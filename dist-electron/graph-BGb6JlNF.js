import kuzu from "kuzu";
import path from "path";
import { app } from "electron";
let database = null;
let connection = null;
async function initKuzuDB() {
  if (database) return database;
  const dbPath = path.join(app.getPath("userData"), "kuzu");
  console.log("[KuzuDB] Initializing database at:", dbPath);
  database = new kuzu.Database(dbPath);
  connection = new kuzu.Connection(database);
  await createSchema();
  console.log("[KuzuDB] Database initialized");
  return database;
}
function getKuzuConnection() {
  if (!connection) {
    throw new Error("[KuzuDB] Database not initialized. Call initKuzuDB() first.");
  }
  return connection;
}
async function createSchema() {
  var _a;
  console.log("[KuzuDB] Creating graph schema...");
  try {
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
    console.log("[KuzuDB] Schema created successfully");
  } catch (error) {
    if (!((_a = error.message) == null ? void 0 : _a.includes("already exists"))) {
      throw error;
    }
  }
}
async function upsertTask(id, name, status) {
  const conn = getKuzuConnection();
  await conn.query(`
    MERGE (t:Task {id: $id})
    SET t.name = $name, t.status = $status
  `, { id, name, status });
}
async function createTaskHierarchy(childId, parentId) {
  const conn = getKuzuConnection();
  await conn.query(`
    MATCH (child:Task {id: $childId}), (parent:Task {id: $parentId})
    MERGE (parent)-[:PARENT_OF]->(child)
  `, { childId, parentId });
}
async function upsertMessage(id, version) {
  const conn = getKuzuConnection();
  await conn.query(`
    MERGE (m:Message {id: $id})
    SET m.version = $version
  `, { id, version });
}
async function linkMessageToTask(messageId, taskId) {
  const conn = getKuzuConnection();
  await upsertMessage(messageId, 1);
  await conn.query(`
    MATCH (m:Message {id: $messageId})-[r:BELONGS_TO]->(:Task)
    DELETE r
  `, { messageId });
  await conn.query(`
    MATCH (m:Message {id: $messageId}), (t:Task {id: $taskId})
    MERGE (m)-[:BELONGS_TO]->(t)
  `, { messageId, taskId });
}
async function addMessageTags(messageId, tags) {
  const conn = getKuzuConnection();
  for (const tag of tags) {
    await conn.query(`
      MERGE (t:Tag {name: $tag})
    `, { tag });
    await conn.query(`
      MATCH (m:Message {id: $messageId}), (t:Tag {name: $tag})
      MERGE (m)-[:HAS_TAG]->(t)
    `, { messageId, tag });
  }
}
async function findMessagesByTag(taskId, tags) {
  const conn = getKuzuConnection();
  const tagList = tags.map((t) => `'${t}'`).join(", ");
  const result = await conn.query(`
    MATCH (t:Task {id: $taskId})-[:PARENT_OF*0..]->(sub)<-[:BELONGS_TO]-(m:Message)-[:HAS_TAG]->(tag:Tag)
    WHERE tag.name IN [${tagList}]
    RETURN DISTINCT m.id AS message_id
  `, { taskId });
  return result.map((row) => row.message_id);
}
async function getRelatedMessages(messageId) {
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
export {
  addMessageTags,
  createTaskHierarchy,
  findMessagesByTag,
  getKuzuConnection,
  getRelatedMessages,
  initKuzuDB,
  linkMessageToTask,
  upsertMessage,
  upsertTask
};
