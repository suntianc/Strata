
export interface Attachment {
  id: string;
  type: 'pdf' | 'excel' | 'image' | 'code';
  name: string;
  url?: string;
  meta?: string; // e.g., "12 pages" or "24KB"
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  version: number;
  author: 'user' | 'system';
  tags: string[];
  attachments: Attachment[];
  projectId?: string; // If null, it's in Inbox
  highlighted?: boolean;
  isArchived?: boolean;
  suggestedProjectId?: string; // For AI Inbox cleaning
  relatedIds?: string[]; // IDs of related messages for Info Mode
}

export interface TaskNode {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'blocked' | 'completed';
  children?: TaskNode[];
  expanded?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  citations?: string[]; // IDs of messages cited
  isThinking?: boolean;
}

export interface ModelConfig {
  provider: 'gemini' | 'ollama' | 'openai' | 'custom';
  modelName: string;
  baseUrl?: string;
  apiKey?: string;
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface AppSettings {
  profile: UserProfile;
  llm: ModelConfig;
  embedding: ModelConfig;
}
