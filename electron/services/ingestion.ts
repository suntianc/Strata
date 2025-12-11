/**
 * Ingestion Service
 * Handles document parsing, chunking, vectorization, and knowledge extraction
 */

import { v4 as uuidv4 } from 'uuid';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { queryOne, query, execute } from '../db/pg.js';
import { insertVectors, deleteVectorsByMessageId, getTaskCenterVector, searchVectors } from '../db/vector.js';
import { addMessageTags, getRelatedMessages } from '../db/graph.js';
import { getLLM, getEmbeddings } from './llmConfig.js';
import type { InboxSuggestion } from '../types/ipc';

export class IngestionService {
  /**
   * Full ingestion pipeline for a new message
   */
  static async ingestMessage(
    messageId: string,
    content: string,
    files: string[] = []
  ): Promise<void> {
    console.log(`[Ingestion] Starting ingestion for message: ${messageId}`);

    try {
      // Step 1: Parse files (if any)
      let fullText = content;
      for (const filePath of files) {
        const fileText = await this.parseFile(filePath);
        fullText += '\n\n' + fileText;
      }

      // Step 2: Chunk text
      const chunks = await this.chunkText(fullText);
      console.log(`[Ingestion] Created ${chunks.length} chunks`);

      // Step 3: Generate embeddings
      const embeddings = getEmbeddings();
      const vectors = await embeddings.embedDocuments(chunks);

      // Step 4: Get task_id for metadata
      const msg = await queryOne<{ task_id: string | null }>(
        'SELECT task_id FROM messages WHERE id = $1',
        [messageId]
      );

      // Step 5: Insert into LanceDB
      const vectorRecords = chunks.map((text, idx) => ({
        id: `${messageId}-chunk-${idx}`,
        text,
        vector: vectors[idx],
        metadata: {
          message_id: messageId,
          task_id: msg?.task_id || undefined,
          source: files.length > 0 ? ('file' as const) : ('text' as const),
          chunk_index: idx,
        },
      }));

      await insertVectors(vectorRecords);

      // Step 6: Extract tags using LLM
      const tags = await this.extractTags(content);
      if (tags.length > 0) {
        await addMessageTags(messageId, tags);

        // Also add to PGlite
        for (const tag of tags) {
          await execute(
            'INSERT INTO message_tags (message_id, tag) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [messageId, tag]
          );
        }
      }

      console.log(`[Ingestion] Completed for message: ${messageId}`);
    } catch (error) {
      console.error(`[Ingestion] Failed for message ${messageId}:`, error);
      throw error;
    }
  }

  /**
   * Re-ingest message after update (delete old vectors, create new ones)
   */
  static async reingestMessage(messageId: string, newContent: string): Promise<void> {
    console.log(`[Ingestion] Re-ingesting updated message: ${messageId}`);

    // Delete old vectors
    await deleteVectorsByMessageId(messageId);

    // Re-ingest with new content
    await this.ingestMessage(messageId, newContent, []);
  }

  /**
   * Analyze a message and return insights
   */
  static async analyzeMessage(messageId: string): Promise<{
    tags: string[];
    relatedIds: string[];
    summary: string;
  }> {
    const msg = await queryOne<{ content: string }>(
      'SELECT content FROM messages WHERE id = $1',
      [messageId]
    );

    if (!msg) throw new Error('Message not found');

    // Extract tags
    const tags = await this.extractTags(msg.content);

    // Find related messages via graph
    const relatedIds = await getRelatedMessages(messageId);

    // Generate summary
    const summary = await this.summarize(msg.content);

    return { tags, relatedIds, summary };
  }

  /**
   * Smart inbox organization
   */
  static async suggestInboxOrganization(): Promise<InboxSuggestion[]> {
    console.log('[Ingestion] Analyzing inbox for organization suggestions...');

    // Get all inbox messages
    const inboxMessages = await query<{ id: string; content: string }>(
      'SELECT id, content FROM messages WHERE task_id IS NULL AND is_archived = FALSE'
    );

    if (inboxMessages.length === 0) return [];

    // Get all active tasks
    const tasks = await query<{ id: string; title: string }>(
      "SELECT id, title FROM tasks WHERE status IN ('todo', 'in_progress')"
    );

    const suggestions: InboxSuggestion[] = [];

    for (const msg of inboxMessages) {
      // Get message vector
      const msgEmbedding = await embeddings.embedQuery(msg.content);

      // Compare with each task's center vector
      let bestMatch = { taskId: '', confidence: 0, reason: '' };

      for (const task of tasks) {
        const taskCenterVector = await getTaskCenterVector(task.id);
        if (!taskCenterVector) continue;

        const similarity = this.cosineSimilarity(msgEmbedding, taskCenterVector);

        if (similarity > bestMatch.confidence) {
          bestMatch = {
            taskId: task.id,
            confidence: similarity,
            reason: `High semantic similarity (${(similarity * 100).toFixed(1)}%) with "${task.title}"`,
          };
        }
      }

      // Only suggest if confidence > 0.85
      if (bestMatch.confidence > 0.85) {
        suggestions.push({
          messageId: msg.id,
          targetTaskId: bestMatch.taskId,
          confidence: bestMatch.confidence,
          reason: bestMatch.reason,
        });
      }
    }

    console.log(`[Ingestion] Generated ${suggestions.length} suggestions`);
    return suggestions;
  }

  // ========== Helper Methods ==========

  /**
   * Parse file content (PDF, DOCX, etc.)
   */
  private static async parseFile(filePath: string): Promise<string> {
    // TODO: Implement with LlamaIndexTS or similar
    // For now, return placeholder
    console.log(`[Ingestion] Parsing file: ${filePath}`);
    return `[Content from ${filePath}]`;
  }

  /**
   * Chunk text into smaller pieces
   */
  private static async chunkText(text: string): Promise<string[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const docs = await splitter.createDocuments([text]);
    return docs.map((doc) => doc.pageContent);
  }

  /**
   * Extract tags using LLM
   */
  private static async extractTags(content: string): Promise<string[]> {
    try {
      const llm = getLLM();
      const prompt = `Analyze the following text and extract 3-5 relevant tags or keywords.
Return ONLY the tags as a comma-separated list, nothing else.

Text: "${content}"

Tags:`;

      const response = await llm.call(prompt);
      const tags = response
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0);

      return tags.slice(0, 5);
    } catch (error) {
      console.error('[Ingestion] Tag extraction failed:', error);
      return [];
    }
  }

  /**
   * Generate summary of content
   */
  private static async summarize(content: string): Promise<string> {
    try {
      const llm = getLLM();
      const prompt = `Summarize the following text in 1-2 sentences:

"${content}"

Summary:`;

      const response = await llm.call(prompt);
      return response.trim();
    } catch (error) {
      console.error('[Ingestion] Summarization failed:', error);
      return '';
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private static cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
