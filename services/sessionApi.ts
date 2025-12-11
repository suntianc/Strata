/**
 * Session API
 * Frontend wrapper for session management IPC calls
 */

import type { ChatSession, ChatMessage, ContextType } from '../types';

declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
        on(channel: string, listener: (...args: any[]) => void): void;
        removeListener(channel: string, listener: (...args: any[]) => void): void;
      };
    };
  }
}

class SessionAPI {
  /**
   * Get or create a session for a given context (returns most recent if exists)
   */
  async getOrCreateSession(
    contextType: ContextType,
    contextId: string,
    title?: string
  ): Promise<ChatSession> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    return await window.electron.ipcRenderer.invoke(
      'session:getOrCreate',
      contextType,
      contextId,
      title
    );
  }

  /**
   * Create a new session (always creates a new one)
   */
  async createSession(
    contextType: ContextType,
    contextId: string,
    title?: string
  ): Promise<ChatSession> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    return await window.electron.ipcRenderer.invoke(
      'session:create',
      contextType,
      contextId,
      title
    );
  }

  /**
   * List all sessions for a given context
   */
  async listSessions(
    contextType: ContextType,
    contextId: string
  ): Promise<ChatSession[]> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    return await window.electron.ipcRenderer.invoke(
      'session:list',
      contextType,
      contextId
    );
  }

  /**
   * Get a specific session by ID
   */
  async getSession(sessionId: string): Promise<ChatSession | null> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    return await window.electron.ipcRenderer.invoke('session:get', sessionId);
  }

  /**
   * Update session title
   */
  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    await window.electron.ipcRenderer.invoke('session:updateTitle', sessionId, title);
  }

  /**
   * Delete a session and all its messages
   */
  async deleteSession(sessionId: string): Promise<void> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    await window.electron.ipcRenderer.invoke('session:delete', sessionId);
  }

  /**
   * Get all messages in a session
   */
  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    return await window.electron.ipcRenderer.invoke('session:getMessages', sessionId);
  }

  /**
   * Add a message to a session
   */
  async addMessage(
    sessionId: string,
    role: 'user' | 'model',
    content: string,
    citations?: string[]
  ): Promise<ChatMessage> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    return await window.electron.ipcRenderer.invoke(
      'session:addMessage',
      sessionId,
      role,
      content,
      citations
    );
  }

  /**
   * Clear all messages in a session (keep the session)
   */
  async clearSessionMessages(sessionId: string): Promise<void> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    await window.electron.ipcRenderer.invoke('session:clearMessages', sessionId);
  }

  /**
   * Get recent sessions across all contexts
   */
  async getRecentSessions(limit: number = 10): Promise<ChatSession[]> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    return await window.electron.ipcRenderer.invoke('session:getRecent', limit);
  }

  /**
   * Search messages across sessions
   */
  async searchMessages(
    searchTerm: string,
    contextType?: ContextType,
    contextId?: string
  ): Promise<ChatMessage[]> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    return await window.electron.ipcRenderer.invoke(
      'session:search',
      searchTerm,
      contextType,
      contextId
    );
  }

  /**
   * Get session statistics
   */
  async getSessionStats(sessionId: string): Promise<{
    totalMessages: number;
    userMessages: number;
    modelMessages: number;
    firstMessageAt: string | null;
    lastMessageAt: string | null;
  }> {
    if (!window.electron) {
      throw new Error('Electron IPC not available');
    }
    return await window.electron.ipcRenderer.invoke('session:getStats', sessionId);
  }
}

// Export singleton instance
export const sessionApi = new SessionAPI();
