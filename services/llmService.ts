import { ModelConfig } from '../types';
import { GoogleGenAI } from "@google/genai";

// Unified LLM Service supporting multiple providers
export class LLMService {
  private config: ModelConfig;

  constructor(config: ModelConfig) {
    this.config = config;
  }

  // Generate chat completion with streaming support
  async generateChatCompletion(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: {
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    }
  ): Promise<string> {
    const { provider, modelName, apiKey, baseUrl } = this.config;

    try {
      switch (provider) {
        case 'gemini':
          return await this.generateGemini(messages, options);

        case 'ollama':
          return await this.generateOllama(messages, options);

        case 'openai':
          return await this.generateOpenAI(messages, options);

        case 'custom':
          return await this.generateCustom(messages, options);

        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`[LLMService] Error with ${provider}:`, error);
      throw error;
    }
  }

  // Gemini implementation
  private async generateGemini(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: any
  ): Promise<string> {
    const { modelName, apiKey } = this.config;

    if (!apiKey) {
      throw new Error('Gemini API key is required. Please configure it in Settings.');
    }

    const client = new GoogleGenAI({ apiKey });

    // Convert messages to Gemini format
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) {
      throw new Error('No user message found');
    }

    const response = await client.models.generateContent({
      model: modelName || 'gemini-2.5-flash',
      contents: lastUserMessage.content,
    });

    return response.text || 'No response generated.';
  }

  // Ollama implementation
  private async generateOllama(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: any
  ): Promise<string> {
    const { modelName, baseUrl } = this.config;
    const url = baseUrl || 'http://localhost:11434';

    const response = await fetch(`${url}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName || 'llama3.2',
        messages: messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
        stream: false,
        options: {
          temperature: options?.temperature || 0.7,
          num_predict: options?.maxTokens || 2000,
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.message?.content || 'No response from Ollama.';
  }

  // OpenAI compatible implementation
  private async generateOpenAI(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: any
  ): Promise<string> {
    const { modelName, apiKey, baseUrl } = this.config;
    const url = baseUrl || 'https://api.openai.com/v1';

    if (!apiKey) {
      throw new Error('API key is required for OpenAI provider.');
    }

    const response = await fetch(`${url}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName || 'gpt-3.5-turbo',
        messages: messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2000,
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response from OpenAI.';
  }

  // Custom OpenAI-compatible endpoint
  private async generateCustom(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: any
  ): Promise<string> {
    const { modelName, apiKey, baseUrl } = this.config;

    if (!baseUrl) {
      throw new Error('Base URL is required for custom provider. Please set the Base URL in Settings.');
    }

    if (!apiKey) {
      throw new Error('API Key is required for custom provider. Please set the API Key in Settings.');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    try {
      console.log('[LLMService] Calling custom API:', baseUrl);

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        mode: 'cors',
        body: JSON.stringify({
          model: modelName,
          messages: messages,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 2000,
        })
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorData.message || errorMessage;
        } catch {
          errorMessage = await response.text() || errorMessage;
        }
        throw new Error(`API Error: ${errorMessage}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No response from API.';
    } catch (error: any) {
      console.error('[LLMService] Custom API error:', error);

      // Better error messages for common issues
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Cannot connect to API. Please check:\n• Base URL is correct\n• API server is running\n• No CORS issues (if calling from browser)');
      }

      throw error;
    }
  }

  // Helper: Test connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const testMessages = [{ role: 'user' as const, content: 'Hello' }];
      await this.generateChatCompletion(testMessages);
      return { success: true, message: 'Connection successful' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}

// Generate short task title from message content
export const generateTaskTitle = async (
  messageContent: string,
  config?: ModelConfig
): Promise<string> => {
  // Fallback to environment variable if no config provided
  const llmConfig: ModelConfig = config || {
    provider: 'gemini',
    modelName: 'gemini-2.5-flash',
    apiKey: process.env.API_KEY || '',
  };

  const prompt = `Generate a short, concise task title (maximum 30 characters) from this message content.
Return ONLY the title, no explanations, no quotes.

Message: "${messageContent.substring(0, 500)}"`;

  try {
    const service = new LLMService(llmConfig);
    const messages = [{ role: 'user' as const, content: prompt }];
    const title = await service.generateChatCompletion(messages, { temperature: 0.5, maxTokens: 50 });
    // Clean up response - remove quotes and trim
    return title.replace(/["']/g, '').trim().substring(0, 60);
  } catch (error: any) {
    console.error("Title Generation Error:", error);
    // Fallback: use first 30 chars of content
    return messageContent.substring(0, 30).trim() + (messageContent.length > 30 ? '...' : '');
  }
};

// Legacy wrapper for backward compatibility
export const generateAnalysis = async (
  prompt: string,
  contextMessages: string[],
  language: 'en' | 'zh' = 'en',
  config?: ModelConfig
): Promise<string> => {
  // Fallback to environment variable if no config provided
  const llmConfig: ModelConfig = config || {
    provider: 'gemini',
    modelName: 'gemini-2.5-flash',
    apiKey: process.env.API_KEY || '',
  };

  const contextStr = contextMessages.join('\n---\n');
  const languageInstruction = language === 'zh'
    ? "Reply in Simplified Chinese (简体中文). Keep technical terms if necessary."
    : "Reply in English.";

  const fullPrompt = `
System Instruction: You are "Strata Copilot", a research assistant.
Your output should look like an analysis report.
Use Markdown. Be concise, academic, and structured.
${languageInstruction}

Context Data (Strata layers):
${contextStr}

User Query: ${prompt}
  `;

  try {
    const service = new LLMService(llmConfig);
    const messages = [{ role: 'user' as const, content: fullPrompt }];
    return await service.generateChatCompletion(messages);
  } catch (error: any) {
    console.error("LLM Service Error:", error);
    return `Error: ${error.message}\n\nPlease check your LLM configuration in Settings.`;
  }
};
