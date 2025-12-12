/**
 * Embedding Service
 * Generates vector embeddings for text using Transformers.js
 */

import { pipeline, env } from '@xenova/transformers';

// Configure Transformers.js
env.allowLocalModels = true;
env.allowRemoteModels = true;

// Embedding model instance
let embeddingPipeline: any = null;

// Model configuration
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2'; // 384-dim embeddings
const EMBEDDING_DIM = 384;

export class EmbeddingService {
  /**
   * Initialize the embedding model
   */
  async initialize(): Promise<void> {
    if (embeddingPipeline) {
      console.log('[EmbeddingService] Already initialized');
      return;
    }

    try {
      console.log('[EmbeddingService] Loading model:', MODEL_NAME);
      console.log('[EmbeddingService] This may take a few minutes on first run...');

      // Load the feature extraction pipeline
      embeddingPipeline = await pipeline('feature-extraction', MODEL_NAME);

      console.log('[EmbeddingService] ✅ Model loaded successfully');
    } catch (error) {
      console.error('[EmbeddingService] ❌ Failed to load model:', error);
      throw error;
    }
  }

  /**
   * Generate embedding for a single text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!embeddingPipeline) {
      await this.initialize();
    }

    try {
      // Clean and truncate text
      const cleanText = this.cleanText(text);

      // Generate embedding
      const output = await embeddingPipeline(cleanText, {
        pooling: 'mean',
        normalize: true,
      });

      // Convert to array
      const embedding = Array.from(output.data) as number[];

      console.log(`[EmbeddingService] ✅ Generated embedding (${embedding.length} dims) for text: "${cleanText.substring(0, 50)}..."`);

      return embedding;
    } catch (error) {
      console.error('[EmbeddingService] ❌ Failed to generate embedding:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts (batch processing)
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!embeddingPipeline) {
      await this.initialize();
    }

    try {
      console.log(`[EmbeddingService] Generating embeddings for ${texts.length} texts...`);

      const embeddings: number[][] = [];

      // Process in batches to avoid memory issues
      const batchSize = 10;
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const cleanBatch = batch.map(text => this.cleanText(text));

        const batchEmbeddings = await Promise.all(
          cleanBatch.map(text => this.generateEmbedding(text))
        );

        embeddings.push(...batchEmbeddings);

        console.log(`[EmbeddingService] Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`);
      }

      console.log(`[EmbeddingService] ✅ Generated ${embeddings.length} embeddings`);

      return embeddings;
    } catch (error) {
      console.error('[EmbeddingService] ❌ Failed to generate embeddings:', error);
      throw error;
    }
  }

  /**
   * Clean and prepare text for embedding
   */
  private cleanText(text: string): string {
    // Remove excessive whitespace
    let cleaned = text.replace(/\s+/g, ' ').trim();

    // Truncate to max length (512 tokens ≈ 2048 characters)
    const maxLength = 2048;
    if (cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength);
      console.log('[EmbeddingService] Text truncated to', maxLength, 'characters');
    }

    return cleaned;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Get embedding dimension
   */
  getEmbeddingDim(): number {
    return EMBEDDING_DIM;
  }

  /**
   * Check if model is initialized
   */
  isInitialized(): boolean {
    return embeddingPipeline !== null;
  }
}

// Export singleton instance
export const embeddingService = new EmbeddingService();
