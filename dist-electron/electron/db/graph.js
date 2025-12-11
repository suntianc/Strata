/**
 * KuzuDB Graph Database Module
 * Handles complex relationships: task hierarchies, tags, message links
 */
import kuzu from 'kuzu';
import path from 'path';
import { app } from 'electron';
let database = null;
let connection = null;
export async function initKuzuDB() {
    if (database)
        return database;
    const dbPath = path.join(app.getPath('userData'), 'kuzu');
    console.log('[KuzuDB] Initializing database at:', dbPath);
    database = new kuzu.Database(dbPath);
    connection = new kuzu.Connection(database);
    // Create schema
    await createSchema();
    console.log('[KuzuDB] Database initialized');
    return database;
}
export function getKuzuConnection() {
    if (!connection) {
        throw new Error('[KuzuDB] Database not initialized. Call initKuzuDB() first.');
    }
    return connection;
}
async function createSchema() {
    console.log('[KuzuDB] Creating graph schema...');
    try {
        // Node tables
        await connection.query(`
      CREATE NODE TABLE IF NOT EXISTS Task (
        id STRING,
        name STRING,
        status STRING,
        PRIMARY KEY (id)
      )
    `);
        await connection.query(`
      CREATE NODE TABLE IF NOT EXISTS Message (
        id STRING,
        version INT64,
        PRIMARY KEY (id)
      )
    `);
        await connection.query(`
      CREATE NODE TABLE IF NOT EXISTS Tag (
        name STRING,
        PRIMARY KEY (name)
      )
    `);
        await connection.query(`
      CREATE NODE TABLE IF NOT EXISTS Document (
        id STRING,
        name STRING,
        PRIMARY KEY (id)
      )
    `);
        // Relationship tables
        await connection.query(`
      CREATE REL TABLE IF NOT EXISTS PARENT_OF (
        FROM Task TO Task
      )
    `);
        await connection.query(`
      CREATE REL TABLE IF NOT EXISTS BELONGS_TO (
        FROM Message TO Task
      )
    `);
        await connection.query(`
      CREATE REL TABLE IF NOT EXISTS HAS_DOC (
        FROM Message TO Document
      )
    `);
        await connection.query(`
      CREATE REL TABLE IF NOT EXISTS HAS_TAG (
        FROM Message TO Tag
      )
    `);
        await connection.query(`
      CREATE REL TABLE IF NOT EXISTS REFERS_TO (
        FROM Message TO Message
      )
    `);
        console.log('[KuzuDB] Schema created successfully');
    }
    catch (error) {
        // Ignore "already exists" errors
        if (!error.message?.includes('already exists')) {
            throw error;
        }
    }
}
// ========== Graph Operations ==========
/**
 * Create or update a task node
 */
export async function upsertTask(id, name, status) {
    const conn = getKuzuConnection();
    await conn.query(`
    MERGE (t:Task {id: $id})
    SET t.name = $name, t.status = $status
  `, { id, name, status });
}
/**
 * Create task parent-child relationship
 */
export async function createTaskHierarchy(childId, parentId) {
    const conn = getKuzuConnection();
    await conn.query(`
    MATCH (child:Task {id: $childId}), (parent:Task {id: $parentId})
    MERGE (parent)-[:PARENT_OF]->(child)
  `, { childId, parentId });
}
/**
 * Create or update a message node
 */
export async function upsertMessage(id, version) {
    const conn = getKuzuConnection();
    await conn.query(`
    MERGE (m:Message {id: $id})
    SET m.version = $version
  `, { id, version });
}
/**
 * Link message to task
 */
export async function linkMessageToTask(messageId, taskId) {
    const conn = getKuzuConnection();
    // First ensure nodes exist
    await upsertMessage(messageId, 1);
    // Remove old BELONGS_TO relationships
    await conn.query(`
    MATCH (m:Message {id: $messageId})-[r:BELONGS_TO]->(:Task)
    DELETE r
  `, { messageId });
    // Create new relationship
    await conn.query(`
    MATCH (m:Message {id: $messageId}), (t:Task {id: $taskId})
    MERGE (m)-[:BELONGS_TO]->(t)
  `, { messageId, taskId });
}
/**
 * Add tags to a message
 */
export async function addMessageTags(messageId, tags) {
    const conn = getKuzuConnection();
    for (const tag of tags) {
        // Ensure tag node exists
        await conn.query(`
      MERGE (t:Tag {name: $tag})
    `, { tag });
        // Link to message
        await conn.query(`
      MATCH (m:Message {id: $messageId}), (t:Tag {name: $tag})
      MERGE (m)-[:HAS_TAG]->(t)
    `, { messageId, tag });
    }
}
/**
 * Create message reference (for @mentions)
 */
export async function createMessageReference(fromId, toId) {
    const conn = getKuzuConnection();
    await conn.query(`
    MATCH (from:Message {id: $fromId}), (to:Message {id: $toId})
    MERGE (from)-[:REFERS_TO]->(to)
  `, { fromId, toId });
}
/**
 * Find messages by tag within a task hierarchy
 */
export async function findMessagesByTag(taskId, tags) {
    const conn = getKuzuConnection();
    const tagList = tags.map(t => `'${t}'`).join(', ');
    const result = await conn.query(`
    MATCH (t:Task {id: $taskId})-[:PARENT_OF*0..]->(sub)<-[:BELONGS_TO]-(m:Message)-[:HAS_TAG]->(tag:Tag)
    WHERE tag.name IN [${tagList}]
    RETURN DISTINCT m.id AS message_id
  `, { taskId });
    return result.map((row) => row.message_id);
}
/**
 * Get related messages (via REFERS_TO)
 */
export async function getRelatedMessages(messageId) {
    const conn = getKuzuConnection();
    const result = await conn.query(`
    MATCH (m:Message {id: $messageId})-[:REFERS_TO]->(related:Message)
    RETURN related.id AS message_id
    UNION
    MATCH (m:Message {id: $messageId})<-[:REFERS_TO]-(related:Message)
    RETURN related.id AS message_id
  `, { messageId });
    return result.map((row) => row.message_id);
}
/**
 * Get task hierarchy tree
 */
export async function getTaskTree() {
    const conn = getKuzuConnection();
    const result = await conn.query(`
    MATCH (t:Task)
    OPTIONAL MATCH (t)-[:PARENT_OF]->(child:Task)
    RETURN t.id AS id, t.name AS name, t.status AS status,
           collect(child.id) AS children
  `);
    return result;
}
/**
 * Delete a message and its relationships
 */
export async function deleteMessage(messageId) {
    const conn = getKuzuConnection();
    await conn.query(`
    MATCH (m:Message {id: $messageId})
    DETACH DELETE m
  `, { messageId });
}
// Cleanup
export async function closeKuzuDB() {
    if (connection) {
        connection = null;
        database = null;
        console.log('[KuzuDB] Connection closed');
    }
}
