/**
 * SQLite Database Module (formerly PGlite)
 * Truth source for relational data: tasks, messages, attachments
 * Using better-sqlite3 for reliable desktop persistence
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import electron from 'electron';
const { app } = electron;

// __filename and __dirname are automatically available in CommonJS

let db: Database.Database | null = null;

export async function initPGlite(): Promise<Database.Database> {
  if (db) return db;

  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'strata.db');
  console.log('[SQLite] Initializing database at:', dbPath);

  // Ensure the directory exists - use synchronous fs
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
    console.log('[SQLite] Created user data directory:', userDataPath);
  } else {
    console.log('[SQLite] User data directory already exists:', userDataPath);
  }

  // Check if we can write to the directory
  try {
    fs.accessSync(userDataPath, fs.constants.W_OK);
    console.log('[SQLite] Directory is writable');
  } catch (err) {
    console.error('[SQLite] Directory is NOT writable:', err);
    throw err;
  }

  // Try to create the database with better-sqlite3 options
  try {
    db = new Database(dbPath, { verbose: console.log });
    console.log('[SQLite] Database instance created successfully');
  } catch (err) {
    console.error('[SQLite] Failed to create database:', err);
    throw err;
  }

  // Enable WAL mode for better concurrent performance
  db.pragma('journal_mode = WAL');

  // Create schema
  await createSchema();

  console.log('[SQLite] Database initialized successfully');
  return db;
}

export function getPGlite(): Database.Database {
  if (!db) {
    throw new Error('[SQLite] Database not initialized. Call initPGlite() first.');
  }
  return db;
}

async function createSchema() {
  if (!db) throw new Error('Database not initialized');

  console.log('[SQLite] Creating schema...');

  // Tasks table (TEXT for IDs, compatible with frontend)
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      parent_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked', 'completed')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON tasks(parent_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  `);

  // Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      task_id TEXT,
      content TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      author TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      attachments TEXT DEFAULT '[]',
      is_archived INTEGER DEFAULT 0,
      timestamp TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_messages_task_id ON messages(task_id);
    CREATE INDEX IF NOT EXISTS idx_messages_archived ON messages(is_archived);
    CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
  `);

  // Attachments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx', 'xlsx', 'image', 'code', 'other')),
      file_name TEXT NOT NULL,
      file_size INTEGER,
      summary TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_attachments_message_id ON attachments(message_id);
  `);

  // Tags table (for UI display)
  db.exec(`
    CREATE TABLE IF NOT EXISTS message_tags (
      message_id TEXT NOT NULL,
      tag TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (message_id, tag),
      FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_message_tags_tag ON message_tags(tag);
  `);

  // Message relations (for @mentions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS message_relations (
      from_id TEXT NOT NULL,
      to_id TEXT NOT NULL,
      relation_type TEXT DEFAULT 'refers_to',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (from_id, to_id),
      FOREIGN KEY (from_id) REFERENCES messages(id) ON DELETE CASCADE,
      FOREIGN KEY (to_id) REFERENCES messages(id) ON DELETE CASCADE
    );
  `);

  // Chat Sessions table (for Copilot conversations)
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      context_type TEXT NOT NULL CHECK (context_type IN ('project', 'task', 'message')),
      context_id TEXT NOT NULL,
      title TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_activity TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_chat_sessions_context ON chat_sessions(context_type, context_id);
    CREATE INDEX IF NOT EXISTS idx_chat_sessions_activity ON chat_sessions(last_activity DESC);
  `);

  // Chat Messages table (conversation history)
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'model')),
      content TEXT NOT NULL,
      citations TEXT DEFAULT '[]',
      position INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, position);
  `);

  // Triggers for updated_at (SQLite syntax)
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_tasks_updated_at
    AFTER UPDATE ON tasks
    FOR EACH ROW
    BEGIN
      UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS update_messages_updated_at
    AFTER UPDATE ON messages
    FOR EACH ROW
    BEGIN
      UPDATE messages SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS update_chat_sessions_updated_at
    AFTER UPDATE ON chat_sessions
    FOR EACH ROW
    BEGIN
      UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);

  console.log('[SQLite] Schema created successfully');
}

// ========== Helper Functions ==========

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const database = getPGlite();
  const stmt = database.prepare(sql);
  return stmt.all(...params) as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const database = getPGlite();
  const stmt = database.prepare(sql);
  const result = stmt.get(...params);
  return result ? (result as T) : null;
}

export async function execute(sql: string, params: any[] = []): Promise<void> {
  const database = getPGlite();
  const stmt = database.prepare(sql);
  stmt.run(...params);
}

// Cleanup
export async function closePGlite() {
  if (db) {
    db.close();
    db = null;
    console.log('[SQLite] Database closed');
  }
}
