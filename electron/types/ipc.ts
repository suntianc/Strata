/**
 * IPC API Type Definitions
 * Defines the contract between Main Process and Renderer Process
 */

import { Message, TaskNode, Attachment } from '../../types';

// ========== DTOs (Data Transfer Objects) ==========

export interface CreateMessageDTO {
  content: string;
  tags: string[];
  files?: string[]; // Local file paths
  taskId?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  parentId?: string;
  status?: 'todo' | 'in_progress' | 'blocked' | 'done';
}

export interface UpdateMessageDTO {
  id: string;
  content: string;
}

export interface MoveMessageDTO {
  messageId: string;
  targetTaskId: string;
}

export interface ChatContextDTO {
  taskId?: string;
  fileIds?: string[];
}

export interface InboxSuggestion {
  messageId: string;
  targetTaskId: string;
  confidence: number;
  reason: string;
}

// ========== IPC API Interface ==========

export interface IStrataAPI {
  // --- Message CRUD ---
  createMessage(payload: CreateMessageDTO): Promise<Message>;
  getMessages(taskId?: string, page?: number, limit?: number): Promise<Message[]>;
  updateMessage(payload: UpdateMessageDTO): Promise<Message>;
  archiveMessage(id: string): Promise<void>;

  // --- Task Management ---
  createTask(payload: CreateTaskDTO): Promise<TaskNode>;
  getTasks(): Promise<TaskNode[]>;
  updateTaskStatus(id: string, status: TaskNode['status']): Promise<void>;
  moveMessage(payload: MoveMessageDTO): Promise<void>;

  // --- AI Capabilities ---
  chat(
    query: string,
    context: ChatContextDTO,
    onToken: (token: string) => void
  ): Promise<void>;

  getInboxSuggestions(): Promise<InboxSuggestion[]>;

  analyzeMessage(messageId: string): Promise<{
    tags: string[];
    relatedIds: string[];
    summary: string;
  }>;

  // --- Search ---
  searchMessages(query: string, scope?: { taskId?: string }): Promise<Message[]>;

  // --- System ---
  getAppPath(): Promise<string>;
}

// ========== Database Models ==========

export interface DBMessage {
  id: string;
  task_id: string | null;
  content: string;
  version: number;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DBTask {
  id: string;
  parent_id: string | null;
  title: string;
  description: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface DBAttachment {
  id: string;
  message_id: string;
  file_path: string;
  file_type: string;
  summary: string | null;
}

export interface VectorRecord {
  id: string;
  vector: Float32Array;
  text: string;
  metadata: {
    message_id: string;
    task_id?: string;
    source: 'text' | 'file';
    file_name?: string;
  };
}
