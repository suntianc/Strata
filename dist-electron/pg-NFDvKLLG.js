import { PGlite } from "@electric-sql/pglite";
import path from "path";
import { app } from "electron";
let db = null;
async function initPGlite() {
  if (db) return db;
  const dbPath = path.join(app.getPath("userData"), "strata.db");
  console.log("[PGlite] Initializing database at:", dbPath);
  db = new PGlite(dbPath);
  await createSchema();
  console.log("[PGlite] Database initialized");
  return db;
}
function getPGlite() {
  if (!db) {
    throw new Error("[PGlite] Database not initialized. Call initPGlite() first.");
  }
  return db;
}
async function createSchema() {
  if (!db) throw new Error("Database not initialized");
  console.log("[PGlite] Creating schema...");
  await db.exec(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'blocked', 'done')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON tasks(parent_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
      content TEXT NOT NULL,
      version INT DEFAULT 1,
      is_archived BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_messages_task_id ON messages(task_id);
    CREATE INDEX IF NOT EXISTS idx_messages_archived ON messages(is_archived);
    CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS attachments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
      file_path TEXT NOT NULL,
      file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx', 'xlsx', 'image', 'code', 'other')),
      file_name TEXT NOT NULL,
      file_size BIGINT,
      summary TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_attachments_message_id ON attachments(message_id);
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS message_tags (
      message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
      tag TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (message_id, tag)
    );

    CREATE INDEX IF NOT EXISTS idx_message_tags_tag ON message_tags(tag);
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS message_relations (
      from_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
      to_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
      relation_type TEXT DEFAULT 'refers_to',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (from_id, to_id)
    );
  `);
  await db.exec(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
    CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
    CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
  console.log("[PGlite] Schema created successfully");
}
async function query(sql, params = []) {
  const db2 = getPGlite();
  const result = await db2.query(sql, params);
  return result.rows;
}
async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}
async function execute(sql, params = []) {
  const db2 = getPGlite();
  await db2.query(sql, params);
}
export {
  execute,
  getPGlite,
  initPGlite,
  query,
  queryOne
};
