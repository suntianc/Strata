import { O as OllamaEmbeddings, d as Ollama } from "./ollama-B0RdM9ui.js";
import { searchVectors } from "./vector-BPcG6pNR.js";
import { findMessagesByTag } from "./graph-BGb6JlNF.js";
import { query } from "./pg-NFDvKLLG.js";
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://localhost:11434"
});
const llm = new Ollama({
  model: "llama3.2",
  baseUrl: "http://localhost:11434",
  temperature: 0.7
});
class RetrievalService {
  /**
   * Hybrid search: Vector + Graph
   */
  static async search(searchQuery, scope) {
    console.log(`[Retrieval] Searching for: "${searchQuery}"`);
    try {
      const queryEmbedding = await embeddings.embedQuery(searchQuery);
      const vectorResults = await searchVectors(queryEmbedding, {
        limit: 10,
        taskId: scope == null ? void 0 : scope.taskId
      });
      let graphResults = [];
      if (scope == null ? void 0 : scope.taskId) {
        const extractedTags = this.extractKeywords(searchQuery);
        if (extractedTags.length > 0) {
          graphResults = await findMessagesByTag(scope.taskId, extractedTags);
        }
      }
      const mergedIds = this.mergeResults(
        vectorResults.map((v) => v.metadata.message_id),
        graphResults
      );
      if (mergedIds.length === 0) return [];
      const placeholders = mergedIds.map((_, i) => `$${i + 1}`).join(",");
      const messages = await query(
        `SELECT m.*,
                array_agg(DISTINCT mt.tag) FILTER (WHERE mt.tag IS NOT NULL) as tags
         FROM messages m
         LEFT JOIN message_tags mt ON m.id = mt.message_id
         WHERE m.id IN (${placeholders}) AND m.is_archived = FALSE
         GROUP BY m.id`,
        mergedIds
      );
      return messages.map((msg) => this.toMessage(msg));
    } catch (error) {
      console.error("[Retrieval] Search failed:", error);
      return [];
    }
  }
  /**
   * RAG-powered chat
   */
  static async chat(userQuery, context, onToken) {
    console.log(`[Retrieval] Chat query: "${userQuery}"`);
    try {
      const relevantMessages = await this.search(userQuery, {
        taskId: context.taskId
      });
      const contextStr = relevantMessages.slice(0, 5).map((msg, idx) => `[${idx + 1}] ${msg.content}`).join("\n\n");
      const prompt = `You are an intelligent research assistant. Use the following context to answer the user's question.

Context:
${contextStr}

User Question: ${userQuery}

Answer:`;
      const stream = await llm.stream(prompt);
      for await (const chunk of stream) {
        onToken(chunk);
      }
    } catch (error) {
      console.error("[Retrieval] Chat failed:", error);
      onToken("[Error: Failed to generate response]");
    }
  }
  // ========== Helper Methods ==========
  /**
   * Reciprocal Rank Fusion
   * Combines multiple ranked lists into a single ranked list
   */
  static mergeResults(vectorIds, graphIds) {
    const scores = /* @__PURE__ */ new Map();
    const k = 60;
    vectorIds.forEach((id, rank) => {
      scores.set(id, (scores.get(id) || 0) + 1 / (k + rank + 1));
    });
    graphIds.forEach((id, rank) => {
      scores.set(id, (scores.get(id) || 0) + 1 / (k + rank + 1));
    });
    const sorted = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]).map(([id]) => id);
    return sorted.slice(0, 10);
  }
  /**
   * Extract keywords from query for graph search
   */
  static extractKeywords(query2) {
    const stopWords = ["the", "is", "at", "which", "on", "a", "an", "and", "or", "but"];
    const words = query2.toLowerCase().split(/\s+/).filter((word) => word.length > 3 && !stopWords.includes(word));
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
      author: "user",
      tags: row.tags || [],
      attachments: [],
      projectId: row.task_id || void 0,
      isArchived: row.is_archived
    };
  }
}
export {
  RetrievalService
};
