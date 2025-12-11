/**
 * LLM Configuration Module
 * Supports multiple LLM providers: Ollama (local), Gemini (cloud)
 */

import { Ollama } from '@langchain/community/llms/ollama';
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type LLMProvider = 'ollama' | 'gemini';

export interface LLMConfig {
  provider: LLMProvider;
  ollamaConfig?: {
    baseUrl: string;
    llmModel: string;
    embeddingModel: string;
  };
  geminiConfig?: {
    apiKey: string;
    model: string;
  };
}

// Default configuration
let currentConfig: LLMConfig = {
  provider: 'gemini', // Default to Gemini since it's already configured
  ollamaConfig: {
    baseUrl: 'http://localhost:11434',
    llmModel: 'llama3.2',
    embeddingModel: 'nomic-embed-text',
  },
  geminiConfig: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-2.0-flash-exp',
  },
};

/**
 * Update LLM configuration
 */
export function setLLMConfig(config: Partial<LLMConfig>) {
  currentConfig = { ...currentConfig, ...config };
  console.log(`[LLM] Configuration updated: ${currentConfig.provider}`);
}

/**
 * Get current LLM configuration
 */
export function getLLMConfig(): LLMConfig {
  return currentConfig;
}

/**
 * Get LLM instance based on current configuration
 */
export function getLLM() {
  if (currentConfig.provider === 'ollama') {
    if (!currentConfig.ollamaConfig) {
      throw new Error('[LLM] Ollama configuration not found');
    }
    return new Ollama({
      model: currentConfig.ollamaConfig.llmModel,
      baseUrl: currentConfig.ollamaConfig.baseUrl,
      temperature: 0.7,
    });
  } else if (currentConfig.provider === 'gemini') {
    if (!currentConfig.geminiConfig?.apiKey) {
      throw new Error('[LLM] Gemini API key not configured');
    }
    // Return a wrapper that provides LangChain-like interface
    return createGeminiWrapper(currentConfig.geminiConfig);
  }
  throw new Error(`[LLM] Unsupported provider: ${currentConfig.provider}`);
}

/**
 * Get embeddings instance based on current configuration
 */
export function getEmbeddings() {
  if (currentConfig.provider === 'ollama') {
    if (!currentConfig.ollamaConfig) {
      throw new Error('[LLM] Ollama configuration not found');
    }
    return new OllamaEmbeddings({
      model: currentConfig.ollamaConfig.embeddingModel,
      baseUrl: currentConfig.ollamaConfig.baseUrl,
    });
  } else if (currentConfig.provider === 'gemini') {
    // Gemini has built-in embeddings via text-embedding-004
    return createGeminiEmbeddingsWrapper(currentConfig.geminiConfig!);
  }
  throw new Error(`[LLM] Unsupported provider: ${currentConfig.provider}`);
}

/**
 * Check if current LLM provider is available
 */
export async function checkLLMAvailability(): Promise<boolean> {
  try {
    if (currentConfig.provider === 'ollama') {
      const response = await fetch(`${currentConfig.ollamaConfig!.baseUrl}/api/tags`);
      return response.ok;
    } else if (currentConfig.provider === 'gemini') {
      return !!currentConfig.geminiConfig?.apiKey;
    }
    return false;
  } catch {
    return false;
  }
}

// ========== Gemini Wrappers ==========

/**
 * Create a LangChain-compatible wrapper for Gemini
 */
function createGeminiWrapper(config: { apiKey: string; model: string }) {
  const genAI = new GoogleGenerativeAI(config.apiKey);
  const model = genAI.getGenerativeModel({ model: config.model });

  return {
    async stream(prompt: string): Promise<AsyncIterable<string>> {
      const result = await model.generateContentStream(prompt);

      return {
        async *[Symbol.asyncIterator]() {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) yield text;
          }
        }
      };
    },

    async call(prompt: string): Promise<string> {
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  };
}

/**
 * Create embeddings wrapper for Gemini
 */
function createGeminiEmbeddingsWrapper(config: { apiKey: string }) {
  const genAI = new GoogleGenerativeAI(config.apiKey);
  const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

  return {
    async embedQuery(text: string): Promise<number[]> {
      const result = await embeddingModel.embedContent(text);
      return result.embedding.values;
    },

    async embedDocuments(texts: string[]): Promise<number[][]> {
      const embeddings = await Promise.all(
        texts.map(text => this.embedQuery(text))
      );
      return embeddings;
    }
  };
}

/**
 * Initialize LLM configuration from environment
 */
export function initLLMFromEnv() {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    console.log('[LLM] Gemini API key found, using Gemini as default provider');
    setLLMConfig({
      provider: 'gemini',
      geminiConfig: {
        apiKey: geminiKey,
        model: 'gemini-2.0-flash-exp',
      },
    });
  } else {
    console.log('[LLM] No Gemini API key, falling back to Ollama');
    setLLMConfig({
      provider: 'ollama',
    });
  }
}
