/**
 * Message Service
 * Handles message CRUD operations across all three databases
 */

import { v4 as uuidv4 } from 'uuid';
import { query, queryOne, execute } from '../db/pg.js';
import { upsertMessage, linkMessageToTask, addMessageTags } from '../db/graph.js';
import type { Message } from '../../types';
import type { CreateMessageDTO, UpdateMessageDTO, MoveMessageDTO, DBMessage } from '../types/ipc';
import { IngestionService } from './ingestion.js';

export class MessageService {
  /**
   * Create a new message with attachments
   */
  static async create(payload: CreateMessageDTO): Promise<Message> {
    const { content, tags, files = [], taskId } = payload;

    // 1. Insert into PGlite
    const messageId = uuidv4();

    await execute(
      `INSERT INTO messages (id, task_id, content, version, is_archived, created_at, updated_at)
       VALUES ($1, $2, $3, 1, FALSE, NOW(), NOW())`,
      [messageId, taskId || null, content]
    );

    // 2. Insert tags
    for (const tag of tags) {
      await execute(
        `INSERT INTO message_tags (message_id, tag) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [messageId, tag]
      );
    }

    // 3. Insert attachments if any
    const attachments = [];
    for (const filePath of files) {
      const attachmentId = uuidv4();
      const fileName = filePath.split('/').pop() || 'unknown';
      const fileType = this.detectFileType(fileName);

      await execute(
        `INSERT INTO attachments (id, message_id, file_path, file_type, file_name)
         VALUES ($1, $2, $3, $4, $5)`,
        [attachmentId, messageId, filePath, fileType, fileName]
      );

      attachments.push({
        id: attachmentId,
        type: fileType as any,
        name: fileName,
        url: filePath,
      });
    }

    // 4. Create graph node
    await upsertMessage(messageId, 1);

    if (taskId) {
      await linkMessageToTask(messageId, taskId);
    }

    if (tags.length > 0) {
      await addMessageTags(messageId, tags);
    }

    // 5. Start async ingestion (vectorization + AI analysis)
    IngestionService.ingestMessage(messageId, content, files).catch((err) => {
      console.error('[MessageService] Ingestion failed:', err);
    });

    // 6. Return the message
    const dbMessage = await queryOne<DBMessage>(
      'SELECT * FROM messages WHERE id = $1',
      [messageId]
    );

    return this.toMessage(dbMessage!, attachments, tags);
  }

  /**
   * Get messages by task (or inbox if taskId is null)
   */
  static async getByTask(
    taskId: string | undefined,
    page: number = 1,
    limit: number = 50
  ): Promise<Message[]> {
    const offset = (page - 1) * limit;

    let sql: string;
    let params: any[];

    if (taskId) {
      sql = `
        SELECT m.*,
               array_agg(DISTINCT mt.tag) FILTER (WHERE mt.tag IS NOT NULL) as tags,
               array_agg(DISTINCT a.id) FILTER (WHERE a.id IS NOT NULL) as attachment_ids
        FROM messages m
        LEFT JOIN message_tags mt ON m.id = mt.message_id
        LEFT JOIN attachments a ON m.id = a.message_id
        WHERE m.task_id = $1 AND m.is_archived = FALSE
        GROUP BY m.id
        ORDER BY m.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      params = [taskId, limit, offset];
    } else {
      // Inbox: messages without task_id
      sql = `
        SELECT m.*,
               array_agg(DISTINCT mt.tag) FILTER (WHERE mt.tag IS NOT NULL) as tags,
               array_agg(DISTINCT a.id) FILTER (WHERE a.id IS NOT NULL) as attachment_ids
        FROM messages m
        LEFT JOIN message_tags mt ON m.id = mt.message_id
        LEFT JOIN attachments a ON m.id = a.message_id
        WHERE m.task_id IS NULL AND m.is_archived = FALSE
        GROUP BY m.id
        ORDER BY m.created_at DESC
        LIMIT $1 OFFSET $2
      `;
      params = [limit, offset];
    }

    const rows = await query<any>(sql, params);

    // Fetch attachments for each message
    const messages = await Promise.all(
      rows.map(async (row) => {
        const attachments = await this.getAttachments(row.id);
        return this.toMessage(row, attachments, row.tags || []);
      })
    );

    return messages;
  }

  /**
   * Update message content (increments version)
   */
  static async update(payload: UpdateMessageDTO): Promise<Message> {
    const { id, content } = payload;

    await execute(
      `UPDATE messages
       SET content = $1, version = version + 1, updated_at = NOW()
       WHERE id = $2`,
      [content, id]
    );

    // Re-run ingestion for updated content
    IngestionService.reingestMessage(id, content).catch((err) => {
      console.error('[MessageService] Re-ingestion failed:', err);
    });

    const dbMessage = await queryOne<DBMessage>(
      'SELECT * FROM messages WHERE id = $1',
      [id]
    );

    const attachments = await this.getAttachments(id);
    const tags = await this.getTags(id);

    return this.toMessage(dbMessage!, attachments, tags);
  }

  /**
   * Archive a message
   */
  static async archive(id: string): Promise<void> {
    await execute(
      'UPDATE messages SET is_archived = TRUE WHERE id = $1',
      [id]
    );
  }

  /**
   * Move message to different task
   */
  static async move(payload: MoveMessageDTO): Promise<void> {
    const { messageId, targetTaskId } = payload;

    // Update PGlite
    await execute(
      'UPDATE messages SET task_id = $1 WHERE id = $2',
      [targetTaskId, messageId]
    );

    // Update graph
    await linkMessageToTask(messageId, targetTaskId);
  }

  // ========== Helper Methods ==========

  private static async getAttachments(messageId: string): Promise<any[]> {
    const attachments = await query(
      'SELECT * FROM attachments WHERE message_id = $1',
      [messageId]
    );

    return attachments.map((a: any) => ({
      id: a.id,
      type: a.file_type,
      name: a.file_name,
      url: a.file_path,
      meta: a.summary,
    }));
  }

  private static async getTags(messageId: string): Promise<string[]> {
    const rows = await query<{ tag: string }>(
      'SELECT tag FROM message_tags WHERE message_id = $1',
      [messageId]
    );
    return rows.map((r) => r.tag);
  }

  private static toMessage(
    dbMsg: DBMessage,
    attachments: any[],
    tags: string[]
  ): Message {
    return {
      id: dbMsg.id,
      content: dbMsg.content,
      timestamp: new Date(dbMsg.created_at),
      version: dbMsg.version,
      author: 'user',
      tags: tags,
      attachments: attachments,
      projectId: dbMsg.task_id || undefined,
      isArchived: dbMsg.is_archived,
    };
  }

  private static detectFileType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'pdf';
      case 'xlsx':
      case 'xls':
      case 'csv':
        return 'excel';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'image';
      case 'js':
      case 'ts':
      case 'py':
      case 'java':
        return 'code';
      default:
        return 'other';
    }
  }
}
