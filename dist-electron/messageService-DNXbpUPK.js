import { v as v4 } from "./wrapper-DLiFKYvL.js";
import { execute, queryOne, query } from "./pg-C--6FeAb.js";
import { upsertMessage, linkMessageToTask, addMessageTags } from "./graph-DlPa-fCr.js";
import { IngestionService } from "./ingestion-wBGvIprb.js";
class MessageService {
  /**
   * Create a new message with attachments
   */
  static async create(payload) {
    const { content, tags, files = [], taskId } = payload;
    const messageId = v4();
    await execute(
      `INSERT INTO messages (id, task_id, content, version, is_archived, created_at, updated_at)
       VALUES ($1, $2, $3, 1, FALSE, NOW(), NOW())`,
      [messageId, taskId || null, content]
    );
    for (const tag of tags) {
      await execute(
        `INSERT INTO message_tags (message_id, tag) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [messageId, tag]
      );
    }
    const attachments = [];
    for (const filePath of files) {
      const attachmentId = v4();
      const fileName = filePath.split("/").pop() || "unknown";
      const fileType = this.detectFileType(fileName);
      await execute(
        `INSERT INTO attachments (id, message_id, file_path, file_type, file_name)
         VALUES ($1, $2, $3, $4, $5)`,
        [attachmentId, messageId, filePath, fileType, fileName]
      );
      attachments.push({
        id: attachmentId,
        type: fileType,
        name: fileName,
        url: filePath
      });
    }
    await upsertMessage(messageId, 1);
    if (taskId) {
      await linkMessageToTask(messageId, taskId);
    }
    if (tags.length > 0) {
      await addMessageTags(messageId, tags);
    }
    IngestionService.ingestMessage(messageId, content, files).catch((err) => {
      console.error("[MessageService] Ingestion failed:", err);
    });
    const dbMessage = await queryOne(
      "SELECT * FROM messages WHERE id = $1",
      [messageId]
    );
    return this.toMessage(dbMessage, attachments, tags);
  }
  /**
   * Get messages by task (or inbox if taskId is null)
   */
  static async getByTask(taskId, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    let sql;
    let params;
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
    const rows = await query(sql, params);
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
  static async update(payload) {
    const { id, content } = payload;
    await execute(
      `UPDATE messages
       SET content = $1, version = version + 1, updated_at = NOW()
       WHERE id = $2`,
      [content, id]
    );
    IngestionService.reingestMessage(id, content).catch((err) => {
      console.error("[MessageService] Re-ingestion failed:", err);
    });
    const dbMessage = await queryOne(
      "SELECT * FROM messages WHERE id = $1",
      [id]
    );
    const attachments = await this.getAttachments(id);
    const tags = await this.getTags(id);
    return this.toMessage(dbMessage, attachments, tags);
  }
  /**
   * Archive a message
   */
  static async archive(id) {
    await execute(
      "UPDATE messages SET is_archived = TRUE WHERE id = $1",
      [id]
    );
  }
  /**
   * Move message to different task
   */
  static async move(payload) {
    const { messageId, targetTaskId } = payload;
    await execute(
      "UPDATE messages SET task_id = $1 WHERE id = $2",
      [targetTaskId, messageId]
    );
    await linkMessageToTask(messageId, targetTaskId);
  }
  // ========== Helper Methods ==========
  static async getAttachments(messageId) {
    const attachments = await query(
      "SELECT * FROM attachments WHERE message_id = $1",
      [messageId]
    );
    return attachments.map((a) => ({
      id: a.id,
      type: a.file_type,
      name: a.file_name,
      url: a.file_path,
      meta: a.summary
    }));
  }
  static async getTags(messageId) {
    const rows = await query(
      "SELECT tag FROM message_tags WHERE message_id = $1",
      [messageId]
    );
    return rows.map((r) => r.tag);
  }
  static toMessage(dbMsg, attachments, tags) {
    return {
      id: dbMsg.id,
      content: dbMsg.content,
      timestamp: new Date(dbMsg.created_at),
      version: dbMsg.version,
      author: "user",
      tags,
      attachments,
      projectId: dbMsg.task_id || void 0,
      isArchived: dbMsg.is_archived
    };
  }
  static detectFileType(fileName) {
    var _a;
    const ext = (_a = fileName.split(".").pop()) == null ? void 0 : _a.toLowerCase();
    switch (ext) {
      case "pdf":
        return "pdf";
      case "xlsx":
      case "xls":
      case "csv":
        return "excel";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "image";
      case "js":
      case "ts":
      case "py":
      case "java":
        return "code";
      default:
        return "other";
    }
  }
}
export {
  MessageService
};
