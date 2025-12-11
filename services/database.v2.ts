import { PGlite } from '@electric-sql/pglite';
import { TaskNode, Message, AppSettings } from '../types';

// Singleton instance that persists across HMR
let dbInstance: PGlite | null = null;
let initPromise: Promise<void> | null = null;

class DatabaseService {
  private async getDb(): Promise<PGlite> {
    if (!dbInstance) {
      console.log('[Database] Creating new PGlite instance with IndexedDB persistence...');

      // Use IndexedDB for persistence with relaxedDurability for better performance
      // relaxedDurability: Flushes to IndexedDB happen asynchronously after queries
      dbInstance = new PGlite({
        dataDir: 'idb://strata-db',
        relaxedDurability: true  // Critical for IndexedDB persistence
      });

      // Wait for database to be ready
      await dbInstance.waitReady;

      await this.createTables(dbInstance);
      console.log('[Database] ✅ PGlite instance created and persisted to IndexedDB');
      console.log('[Database] 💾 relaxedDurability enabled - data will persist across refreshes');
    }
    return dbInstance;
  }

  async init(): Promise<void> {
    if (initPromise) {
      return initPromise;
    }

    initPromise = (async () => {
      try {
        await this.getDb();
        console.log('[Database] ✅ Database initialized successfully');
      } catch (error) {
        console.error('[Database] ❌ Failed to initialize:', error);
        throw error;
      }
    })();

    return initPromise;
  }

  private async createTables(db: PGlite): Promise<void> {
    // Tasks table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'blocked', 'completed')),
        parent_id TEXT,
        expanded BOOLEAN DEFAULT true,
        position INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Messages table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        version INTEGER DEFAULT 1,
        author TEXT NOT NULL CHECK (author IN ('user', 'system')),
        tags TEXT DEFAULT '[]',
        attachments TEXT DEFAULT '[]',
        project_id TEXT,
        highlighted BOOLEAN DEFAULT false,
        is_archived BOOLEAN DEFAULT false,
        suggested_project_id TEXT,
        related_ids TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Settings table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY DEFAULT 'default',
        profile_name TEXT NOT NULL,
        profile_role TEXT NOT NULL,
        profile_avatar_url TEXT,
        llm_provider TEXT NOT NULL,
        llm_model_name TEXT NOT NULL,
        llm_base_url TEXT,
        llm_api_key TEXT,
        embedding_provider TEXT NOT NULL,
        embedding_model_name TEXT NOT NULL,
        embedding_base_url TEXT,
        embedding_api_key TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // App state table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS app_state (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Chat sessions table (NEW)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        context_type TEXT NOT NULL CHECK (context_type IN ('project', 'task', 'message')),
        context_id TEXT NOT NULL,
        title TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(context_type, context_id)
      );
    `);

    // Chat messages table (NEW)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'model')),
        content TEXT NOT NULL,
        citations TEXT DEFAULT '[]',
        position INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
      );
    `);

    // Create indexes
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON tasks(parent_id);
      CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
      CREATE INDEX IF NOT EXISTS idx_messages_archived ON messages(is_archived);
      CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_context ON chat_sessions(context_type, context_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, position);
    `);
  }

  // ============ Task Operations (UPSERT-based) ============

  async getTasks(): Promise<TaskNode[]> {
    const db = await this.getDb();
    const result = await db.query(`SELECT * FROM tasks WHERE parent_id IS NULL ORDER BY position ASC`);
    return this.buildTaskTree(result.rows as any[]);
  }

  private async getChildTasks(parentId: string): Promise<any[]> {
    const db = await this.getDb();
    const result = await db.query(`SELECT * FROM tasks WHERE parent_id = $1 ORDER BY position ASC`, [parentId]);
    return result.rows as any[];
  }

  private async buildTaskTree(tasks: any[]): Promise<TaskNode[]> {
    const taskNodes: TaskNode[] = [];
    for (const task of tasks) {
      const children = await this.getChildTasks(task.id);
      const childNodes = children.length > 0 ? await this.buildTaskTree(children) : [];
      taskNodes.push({
        id: task.id,
        title: task.title,
        status: task.status,
        children: childNodes,
        expanded: task.expanded
      });
    }
    return taskNodes;
  }

  // UPSERT single task (no delete)
  async upsertTask(task: TaskNode, parentId: string | null = null, position: number = 0): Promise<void> {
    const db = await this.getDb();
    await db.query(
      `INSERT INTO tasks (id, title, status, parent_id, expanded, position)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         status = EXCLUDED.status,
         parent_id = EXCLUDED.parent_id,
         expanded = EXCLUDED.expanded,
         position = EXCLUDED.position,
         updated_at = CURRENT_TIMESTAMP`,
      [task.id, task.title, task.status, parentId, task.expanded ?? true, position]
    );

    // Recursively upsert children
    if (task.children && task.children.length > 0) {
      for (let i = 0; i < task.children.length; i++) {
        await this.upsertTask(task.children[i], task.id, i);
      }
    }
  }

  // Save all tasks (upsert-based, keeps existing orphaned data)
  async saveTasks(tasks: TaskNode[]): Promise<void> {
    const db = await this.getDb();

    console.log(`[Database] Saving ${tasks.length} root tasks...`);

    // Get all current task IDs
    const currentIds = new Set<string>();
    const collectIds = (task: TaskNode) => {
      currentIds.add(task.id);
      if (task.children) {
        task.children.forEach(collectIds);
      }
    };
    tasks.forEach(collectIds);

    console.log(`[Database] Total task IDs to save: ${currentIds.size}`);

    // Upsert all tasks
    for (let i = 0; i < tasks.length; i++) {
      await this.upsertTask(tasks[i], null, i);
    }

    // Verify save
    const verifyResult = await db.query(`SELECT COUNT(*) as count FROM tasks`);
    const count = (verifyResult.rows[0] as any).count;
    console.log(`[Database] ✅ Saved complete. Total tasks in DB: ${count}`);

    // Delete tasks that no longer exist (optional, can be disabled)
    const result = await db.query(`SELECT id FROM tasks`);
    const dbIds = (result.rows as any[]).map(r => r.id);
    const idsToDelete = dbIds.filter(id => !currentIds.has(id));

    if (idsToDelete.length > 0) {
      console.log(`[Database] Cleaning up ${idsToDelete.length} deleted tasks`);
      for (const id of idsToDelete) {
        await this.deleteTask(id);
      }
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    const db = await this.getDb();
    await db.query(
      `WITH RECURSIVE task_tree AS (
        SELECT id FROM tasks WHERE id = $1
        UNION ALL
        SELECT t.id FROM tasks t
        INNER JOIN task_tree tt ON t.parent_id = tt.id
      )
      DELETE FROM tasks WHERE id IN (SELECT id FROM task_tree)`,
      [taskId]
    );
  }

  // ============ Message Operations (UPSERT-based) ============

  async getMessages(): Promise<Message[]> {
    const db = await this.getDb();
    const result = await db.query(`SELECT * FROM messages ORDER BY timestamp DESC`);
    return (result.rows as any[]).map(row => ({
      id: row.id,
      content: row.content,
      timestamp: new Date(row.timestamp),
      version: row.version,
      author: row.author,
      tags: JSON.parse(row.tags),
      attachments: JSON.parse(row.attachments),
      projectId: row.project_id,
      highlighted: row.highlighted,
      isArchived: row.is_archived,
      suggestedProjectId: row.suggested_project_id,
      relatedIds: JSON.parse(row.related_ids)
    }));
  }

  async upsertMessage(message: Message): Promise<void> {
    const db = await this.getDb();
    await db.query(
      `INSERT INTO messages (
        id, content, timestamp, version, author, tags, attachments,
        project_id, highlighted, is_archived, suggested_project_id, related_ids
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        version = EXCLUDED.version,
        tags = EXCLUDED.tags,
        attachments = EXCLUDED.attachments,
        project_id = EXCLUDED.project_id,
        highlighted = EXCLUDED.highlighted,
        is_archived = EXCLUDED.is_archived,
        suggested_project_id = EXCLUDED.suggested_project_id,
        related_ids = EXCLUDED.related_ids,
        updated_at = CURRENT_TIMESTAMP`,
      [
        message.id,
        message.content,
        message.timestamp.toISOString(),
        message.version,
        message.author,
        JSON.stringify(message.tags),
        JSON.stringify(message.attachments),
        message.projectId || null,
        message.highlighted || false,
        message.isArchived || false,
        message.suggestedProjectId || null,
        JSON.stringify(message.relatedIds || [])
      ]
    );
  }

  async saveMessages(messages: Message[]): Promise<void> {
    console.log(`[Database] Saving ${messages.length} messages...`);

    // Upsert each message individually
    for (const message of messages) {
      await this.upsertMessage(message);
    }

    // Verify save
    const db = await this.getDb();
    const verifyResult = await db.query(`SELECT COUNT(*) as count FROM messages`);
    const count = (verifyResult.rows[0] as any).count;
    console.log(`[Database] ✅ Saved complete. Total messages in DB: ${count}`);

    // Optional: Clean up deleted messages
    const currentIds = new Set(messages.map(m => m.id));
    const result = await db.query(`SELECT id FROM messages`);
    const dbIds = (result.rows as any[]).map(r => r.id);
    const idsToDelete = dbIds.filter(id => !currentIds.has(id));

    if (idsToDelete.length > 0) {
      console.log(`[Database] Cleaning up ${idsToDelete.length} deleted messages`);
      for (const id of idsToDelete) {
        await this.deleteMessage(id);
      }
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    const db = await this.getDb();
    await db.query(`DELETE FROM messages WHERE id = $1`, [messageId]);
  }

  // ============ Settings Operations ============

  async getSettings(): Promise<AppSettings | null> {
    const db = await this.getDb();
    const result = await db.query(`SELECT * FROM settings WHERE id = 'default'`);

    if (result.rows.length === 0) return null;

    const row = result.rows[0] as any;
    return {
      profile: {
        name: row.profile_name,
        role: row.profile_role,
        avatarUrl: row.profile_avatar_url
      },
      llm: {
        provider: row.llm_provider,
        modelName: row.llm_model_name,
        baseUrl: row.llm_base_url,
        apiKey: row.llm_api_key
      },
      embedding: {
        provider: row.embedding_provider,
        modelName: row.embedding_model_name,
        baseUrl: row.embedding_base_url,
        apiKey: row.embedding_api_key
      }
    };
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    const db = await this.getDb();
    await db.query(
      `INSERT INTO settings (
        id, profile_name, profile_role, profile_avatar_url,
        llm_provider, llm_model_name, llm_base_url, llm_api_key,
        embedding_provider, embedding_model_name, embedding_base_url, embedding_api_key
      )
      VALUES (
        'default', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      ON CONFLICT (id) DO UPDATE SET
        profile_name = EXCLUDED.profile_name,
        profile_role = EXCLUDED.profile_role,
        profile_avatar_url = EXCLUDED.profile_avatar_url,
        llm_provider = EXCLUDED.llm_provider,
        llm_model_name = EXCLUDED.llm_model_name,
        llm_base_url = EXCLUDED.llm_base_url,
        llm_api_key = EXCLUDED.llm_api_key,
        embedding_provider = EXCLUDED.embedding_provider,
        embedding_model_name = EXCLUDED.embedding_model_name,
        embedding_base_url = EXCLUDED.embedding_base_url,
        embedding_api_key = EXCLUDED.embedding_api_key,
        updated_at = CURRENT_TIMESTAMP`,
      [
        settings.profile.name,
        settings.profile.role,
        settings.profile.avatarUrl || null,
        settings.llm.provider,
        settings.llm.modelName,
        settings.llm.baseUrl || null,
        settings.llm.apiKey || null,
        settings.embedding.provider,
        settings.embedding.modelName,
        settings.embedding.baseUrl || null,
        settings.embedding.apiKey || null
      ]
    );
  }

  // ============ App State Operations ============

  async getAppState(key: string): Promise<string | null> {
    const db = await this.getDb();
    const result = await db.query(`SELECT value FROM app_state WHERE key = $1`, [key]);
    return result.rows.length > 0 ? (result.rows[0] as any).value : null;
  }

  async setAppState(key: string, value: string): Promise<void> {
    const db = await this.getDb();
    await db.query(
      `INSERT INTO app_state (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET
         value = EXCLUDED.value,
         updated_at = CURRENT_TIMESTAMP`,
      [key, value]
    );
  }

  // ============ Migration from localStorage ============

  async migrateFromLocalStorage(): Promise<void> {
    const migrated = await this.getAppState('migrated_from_localstorage');
    if (migrated === 'true') {
      console.log('[Database] Migration already completed');
      return;
    }

    console.log('[Database] Starting migration from localStorage...');

    try {
      // Migrate tasks
      const storedTasks = localStorage.getItem('strata_tasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks) as TaskNode[];
        await this.saveTasks(tasks);
        console.log(`[Database] Migrated ${tasks.length} tasks`);
      }

      // Migrate messages
      const storedMessages = localStorage.getItem('strata_messages');
      if (storedMessages) {
        const messages = JSON.parse(storedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })) as Message[];
        await this.saveMessages(messages);
        console.log(`[Database] Migrated ${messages.length} messages`);
      }

      // Migrate active project
      const activeProject = localStorage.getItem('strata_activeProject');
      if (activeProject) {
        await this.setAppState('activeProject', activeProject);
      }

      // Migrate dark mode
      const darkMode = localStorage.getItem('strata_darkMode');
      if (darkMode) {
        await this.setAppState('darkMode', darkMode);
      }

      // Mark migration complete
      await this.setAppState('migrated_from_localstorage', 'true');
      console.log('[Database] ✅ Migration completed successfully');
    } catch (error) {
      console.error('[Database] ❌ Migration failed:', error);
      throw error;
    }
  }

  // ============ Chat Session Operations (NEW) ============

  async getOrCreateSession(
    contextType: 'project' | 'task' | 'message',
    contextId: string,
    title?: string
  ): Promise<string> {
    const db = await this.getDb();

    // Try to find existing session
    const result = await db.query(
      `SELECT id FROM chat_sessions WHERE context_type = $1 AND context_id = $2`,
      [contextType, contextId]
    );

    if (result.rows.length > 0) {
      const sessionId = (result.rows[0] as any).id;
      // Update last activity
      await db.query(
        `UPDATE chat_sessions SET last_activity = CURRENT_TIMESTAMP WHERE id = $1`,
        [sessionId]
      );
      return sessionId;
    }

    // Create new session
    const sessionId = `session-${Date.now()}`;
    await db.query(
      `INSERT INTO chat_sessions (id, context_type, context_id, title)
       VALUES ($1, $2, $3, $4)`,
      [sessionId, contextType, contextId, title || `${contextType} conversation`]
    );

    return sessionId;
  }

  async getChatMessages(sessionId: string): Promise<any[]> {
    const db = await this.getDb();
    const result = await db.query(
      `SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY position ASC`,
      [sessionId]
    );

    return (result.rows as any[]).map(row => ({
      id: row.id,
      role: row.role,
      content: row.content,
      citations: JSON.parse(row.citations),
      createdAt: new Date(row.created_at)
    }));
  }

  async addChatMessage(
    sessionId: string,
    role: 'user' | 'model',
    content: string,
    citations: string[] = []
  ): Promise<void> {
    const db = await this.getDb();

    // Get next position
    const countResult = await db.query(
      `SELECT COUNT(*) as count FROM chat_messages WHERE session_id = $1`,
      [sessionId]
    );
    const position = (countResult.rows[0] as any).count;

    // Insert message
    await db.query(
      `INSERT INTO chat_messages (id, session_id, role, content, citations, position)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [`msg-${Date.now()}`, sessionId, role, content, JSON.stringify(citations), position]
    );

    // Update session last activity
    await db.query(
      `UPDATE chat_sessions SET last_activity = CURRENT_TIMESTAMP WHERE id = $1`,
      [sessionId]
    );
  }

  async deleteSession(sessionId: string): Promise<void> {
    const db = await this.getDb();
    // CASCADE delete will also remove chat_messages
    await db.query(`DELETE FROM chat_sessions WHERE id = $1`, [sessionId]);
  }
}

// Export singleton instance
export const db = new DatabaseService();
