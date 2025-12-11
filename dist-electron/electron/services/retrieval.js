/**
 * Retrieval Service
 * Hybrid search combining vector similarity and graph queries
 */
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { Ollama } from '@langchain/community/llms/ollama';
import { searchVectors } from '../db/vector.js';
import { findMessagesByTag } from '../db/graph.js';
import { query } from '../db/pg.js';
const embeddings = new OllamaEmbeddings({
    model: 'nomic-embed-text',
    baseUrl: 'http://localhost:11434',
});
const llm = new Ollama({
    model: 'llama3.2',
    baseUrl: 'http://localhost:11434',
    temperature: 0.7,
});
export class RetrievalService {
    /**
     * Hybrid search: Vector + Graph
     */
    static async search(searchQuery, scope) {
        console.log(`[Retrieval] Searching for: "${searchQuery}"`);
        try {
            // 1. Vector search
            const queryEmbedding = await embeddings.embedQuery(searchQuery);
            const vectorResults = await searchVectors(queryEmbedding, {
                limit: 10,
                taskId: scope?.taskId,
            });
            // 2. Graph search (by tags)
            let graphResults = [];
            if (scope?.taskId) {
                const extractedTags = this.extractKeywords(searchQuery);
                if (extractedTags.length > 0) {
                    graphResults = await findMessagesByTag(scope.taskId, extractedTags);
                }
            }
            // 3. Merge results (RRF - Reciprocal Rank Fusion)
            const mergedIds = this.mergeResults(vectorResults.map((v) => v.metadata.message_id), graphResults);
            // 4. Fetch full messages from PGlite
            if (mergedIds.length === 0)
                return [];
            const placeholders = mergedIds.map((_, i) => `$${i + 1}`).join(',');
            const messages = await query(`SELECT m.*,
                array_agg(DISTINCT mt.tag) FILTER (WHERE mt.tag IS NOT NULL) as tags
         FROM messages m
         LEFT JOIN message_tags mt ON m.id = mt.message_id
         WHERE m.id IN (${placeholders}) AND m.is_archived = FALSE
         GROUP BY m.id`, mergedIds);
            return messages.map((msg) => this.toMessage(msg));
        }
        catch (error) {
            console.error('[Retrieval] Search failed:', error);
            return [];
        }
    }
    /**
     * RAG-powered chat
     */
    static async chat(userQuery, context, onToken) {
        console.log(`[Retrieval] Chat query: "${userQuery}"`);
        try {
            // 1. Retrieve relevant context
            const relevantMessages = await this.search(userQuery, {
                taskId: context.taskId,
            });
            // 2. Build context string
            const contextStr = relevantMessages
                .slice(0, 5)
                .map((msg, idx) => `[${idx + 1}] ${msg.content}`)
                .join('\n\n');
            // 3. Build prompt
            const prompt = `You are an intelligent research assistant. Use the following context to answer the user's question.

Context:
${contextStr}

User Question: ${userQuery}

Answer:`;
            // 4. Stream response
            const stream = await llm.stream(prompt);
            for await (const chunk of stream) {
                onToken(chunk);
            }
        }
        catch (error) {
            console.error('[Retrieval] Chat failed:', error);
            onToken('[Error: Failed to generate response]');
        }
    }
    // ========== Helper Methods ==========
    /**
     * Reciprocal Rank Fusion
     * Combines multiple ranked lists into a single ranked list
     */
    static mergeResults(vectorIds, graphIds) {
        const scores = new Map();
        const k = 60; // RRF constant
        // Score vector results
        vectorIds.forEach((id, rank) => {
            scores.set(id, (scores.get(id) || 0) + 1 / (k + rank + 1));
        });
        // Score graph results
        graphIds.forEach((id, rank) => {
            scores.set(id, (scores.get(id) || 0) + 1 / (k + rank + 1));
        });
        // Sort by score
        const sorted = Array.from(scores.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([id]) => id);
        return sorted.slice(0, 10);
    }
    /**
     * Extract keywords from query for graph search
     */
    static extractKeywords(query) {
        // Simple keyword extraction (can be improved with NLP)
        const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but'];
        const words = query
            .toLowerCase()
            .split(/\s+/)
            .filter((word) => word.length > 3 && !stopWords.includes(word));
        return words.slice(0, 3);
    }
    /**
     * Convert DB row to Message type
     */
    static toMessage(row) {
        return {
            id: row.id,
            content: row.content,
            timestamp: new Date(row.created_at),
            version: row.version,
            author: 'user',
            tags: row.tags || [],
            attachments: [],
            projectId: row.task_id || undefined,
            isArchived: row.is_archived,
        };
    }
}
