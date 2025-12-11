/**
 * Session Manager
 * Manages chat sessions and conversation history for the Copilot feature
 */

import { v4 as uuidv4 } from 'uuid';
import { getPGlite, query, queryOne, execute } from '../db/pg';

export interface ChatSession {
  id: string;
  contextType: 'project' | 'task' | 'message';
  contextId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  messageCount?: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'model';
  content: string;
  citations: string[];
  position: number;
  createdAt: string;
}

export class SessionManager {
  /**
   * Get the most recent session for a given context, or create one if none exists
   */
  async getOrCreateSession(
    contextType: 'project' | 'task' | 'message',
    contextId: string,
    title?: string
  ): Promise<ChatSession> {
    // Try to find the most recent session for this context
    const existing = await queryOne<ChatSession>(
      `SELECT * FROM chat_sessions
       WHERE context_type = ? AND context_id = ?
       ORDER BY last_activity DESC
       LIMIT 1`,
      [contextType, contextId]
    );

    if (existing) {
      // Get message count
      const countResult = await queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM chat_messages WHERE session_id = ?`,
        [existing.id]
      );
      return {
        ...existing,
        messageCount: countResult?.count || 0
      };
    }

    // No existing session, create a new one
    return await this.createSession(contextType, contextId, title);
  }

  /**
   * Create a new session (always creates a new one, even if others exist)
   */
  async createSession(
    contextType: 'project' | 'task' | 'message',
    contextId: string,
    title?: string
  ): Promise<ChatSession> {
    const sessionId = uuidv4();
    const defaultTitle = title || this.generateDefaultTitle(contextType, contextId);

    await execute(
      `INSERT INTO chat_sessions (id, context_type, context_id, title)
       VALUES (?, ?, ?, ?)`,
      [sessionId, contextType, contextId, defaultTitle]
    );

    const newSession = await queryOne<ChatSession>(
      `SELECT * FROM chat_sessions WHERE id = ?`,
      [sessionId]
    );

    return {
      ...newSession!,
      messageCount: 0
    };
  }

  /**
   * List all sessions for a given context
   */
  async listSessions(
    contextType: 'project' | 'task' | 'message',
    contextId: string
  ): Promise<ChatSession[]> {
    const sessions = await query<ChatSession>(
      `SELECT s.*, COUNT(m.id) as messageCount
       FROM chat_sessions s
       LEFT JOIN chat_messages m ON s.id = m.session_id
       WHERE s.context_type = ? AND s.context_id = ?
       GROUP BY s.id
       ORDER BY s.last_activity DESC`,
      [contextType, contextId]
    );

    return sessions;
  }

  /**
   * Get a specific session by ID
   */
  async getSession(sessionId: string): Promise<ChatSession | null> {
    const session = await queryOne<ChatSession>(
      `SELECT s.*, COUNT(m.id) as messageCount
       FROM chat_sessions s
       LEFT JOIN chat_messages m ON s.id = m.session_id
       WHERE s.id = ?
       GROUP BY s.id`,
      [sessionId]
    );

    return session;
  }

  /**
   * Update session title
   */
  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    await execute(
      `UPDATE chat_sessions SET title = ? WHERE id = ?`,
      [title, sessionId]
    );
  }

  /**
   * Delete a session and all its messages
   */
  async deleteSession(sessionId: string): Promise<void> {
    // CASCADE will automatically delete chat_messages
    await execute(
      `DELETE FROM chat_sessions WHERE id = ?`,
      [sessionId]
    );
  }

  /**
   * Get all messages in a session
   */
  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const messages = await query<any>(
      `SELECT * FROM chat_messages
       WHERE session_id = ?
       ORDER BY position ASC`,
      [sessionId]
    );

    // Parse citations JSON
    return messages.map(msg => ({
      ...msg,
      citations: JSON.parse(msg.citations || '[]')
    }));
  }

  /**
   * Add a message to a session
   */
  async addMessage(
    sessionId: string,
    role: 'user' | 'model',
    content: string,
    citations: string[] = []
  ): Promise<ChatMessage> {
    const messageId = uuidv4();

    // Get next position
    const positionResult = await queryOne<{ maxPosition: number }>(
      `SELECT COALESCE(MAX(position), -1) + 1 as maxPosition
       FROM chat_messages
       WHERE session_id = ?`,
      [sessionId]
    );

    const position = positionResult?.maxPosition || 0;

    // Insert message
    await execute(
      `INSERT INTO chat_messages (id, session_id, role, content, citations, position)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [messageId, sessionId, role, content, JSON.stringify(citations), position]
    );

    // Update session last_activity
    await execute(
      `UPDATE chat_sessions SET last_activity = CURRENT_TIMESTAMP WHERE id = ?`,
      [sessionId]
    );

    // Return the created message
    const message = await queryOne<any>(
      `SELECT * FROM chat_messages WHERE id = ?`,
      [messageId]
    );

    return {
      ...message!,
      citations: JSON.parse(message!.citations || '[]')
    };
  }

  /**
   * Clear all messages in a session (keep the session)
   */
  async clearSessionMessages(sessionId: string): Promise<void> {
    await execute(
      `DELETE FROM chat_messages WHERE session_id = ?`,
      [sessionId]
    );
  }

  /**
   * Get recent sessions across all contexts
   */
  async getRecentSessions(limit: number = 10): Promise<ChatSession[]> {
    const sessions = await query<ChatSession>(
      `SELECT s.*, COUNT(m.id) as messageCount
       FROM chat_sessions s
       LEFT JOIN chat_messages m ON s.id = m.session_id
       GROUP BY s.id
       ORDER BY s.last_activity DESC
       LIMIT ?`,
      [limit]
    );

    return sessions;
  }

  /**
   * Generate a default title for a session
   */
  private generateDefaultTitle(contextType: string, contextId: string): string {
    const timestamp = new Date().toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const typeLabel = {
      project: '项目对话',
      task: '任务对话',
      message: '消息对话'
    }[contextType] || '对话';

    return `${typeLabel} - ${timestamp}`;
  }

  /**
   * Search messages across sessions
   */
  async searchMessages(
    searchTerm: string,
    contextType?: 'project' | 'task' | 'message',
    contextId?: string
  ): Promise<ChatMessage[]> {
    let sql = `
      SELECT m.*
      FROM chat_messages m
      JOIN chat_sessions s ON m.session_id = s.id
      WHERE m.content LIKE ?
    `;
    const params: any[] = [`%${searchTerm}%`];

    if (contextType && contextId) {
      sql += ` AND s.context_type = ? AND s.context_id = ?`;
      params.push(contextType, contextId);
    }

    sql += ` ORDER BY m.created_at DESC LIMIT 50`;

    const messages = await query<any>(sql, params);

    return messages.map(msg => ({
      ...msg,
      citations: JSON.parse(msg.citations || '[]')
    }));
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
    const stats = await queryOne<any>(
      `SELECT
        COUNT(*) as totalMessages,
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as userMessages,
        SUM(CASE WHEN role = 'model' THEN 1 ELSE 0 END) as modelMessages,
        MIN(created_at) as firstMessageAt,
        MAX(created_at) as lastMessageAt
       FROM chat_messages
       WHERE session_id = ?`,
      [sessionId]
    );

    return stats || {
      totalMessages: 0,
      userMessages: 0,
      modelMessages: 0,
      firstMessageAt: null,
      lastMessageAt: null
    };
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
