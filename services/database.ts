import { PGlite } from '@electric-sql/pglite';
import { TaskNode, Message, AppSettings } from '../types';

class DatabaseService {
  private db: PGlite | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        // Initialize PGlite with IndexedDB storage for persistence
        this.db = new PGlite('idb://strata-db');
        await this.createTables();
        console.log('[Database] PGlite initialized successfully');
      } catch (error) {
        console.error('[Database] Failed to initialize:', error);
        throw error;
      }
    })();

    return this.initPromise;
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Create tasks table
    await this.db.exec(`
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

    // Create messages table
    await this.db.exec(`
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

    // Create settings table
    await this.db.exec(`
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

    // Create app state table (for active project, dark mode, etc.)
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS app_state (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON tasks(parent_id);
      CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
      CREATE INDEX IF NOT EXISTS idx_messages_archived ON messages(is_archived);
      CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
    `);
  }

  // ============ Task Operations ============

  async getTasks(): Promise<TaskNode[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(`
      SELECT * FROM tasks WHERE parent_id IS NULL ORDER BY position ASC
    `);

    return this.buildTaskTree(result.rows as any[]);
  }

  private async getChildTasks(parentId: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(
      `SELECT * FROM tasks WHERE parent_id = $1 ORDER BY position ASC`,
      [parentId]
    );

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

  async saveTask(task: TaskNode, parentId: string | null = null, position: number = 0): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.query(
      `INSERT INTO tasks (id, title, status, parent_id, expanded, position)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         status = EXCLUDED.status,
         expanded = EXCLUDED.expanded,
         updated_at = CURRENT_TIMESTAMP`,
      [task.id, task.title, task.status, parentId, task.expanded ?? true, position]
    );

    // Recursively save children
    if (task.children && task.children.length > 0) {
      for (let i = 0; i < task.children.length; i++) {
        await this.saveTask(task.children[i], task.id, i);
      }
    }
  }

  async saveTasks(tasks: TaskNode[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Delete all existing tasks first
    await this.db.exec('DELETE FROM tasks');

    // Save all tasks
    for (let i = 0; i < tasks.length; i++) {
      await this.saveTask(tasks[i], null, i);
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Delete task and all its children (CASCADE behavior)
    await this.db.query(
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

  // ============ Message Operations ============

  async getMessages(): Promise<Message[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(`
      SELECT * FROM messages ORDER BY timestamp DESC
    `);

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

  async saveMessage(message: Message): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.query(
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
    for (const message of messages) {
      await this.saveMessage(message);
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.query(`DELETE FROM messages WHERE id = $1`, [messageId]);
  }

  // ============ Settings Operations ============

  async getSettings(): Promise<AppSettings | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(`SELECT * FROM settings WHERE id = 'default'`);

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
    if (!this.db) throw new Error('Database not initialized');

    await this.db.query(
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
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(
      `SELECT value FROM app_state WHERE key = $1`,
      [key]
    );

    return result.rows.length > 0 ? (result.rows[0] as any).value : null;
  }

  async setAppState(key: string, value: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.query(
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
    console.log('[Database] Starting migration from localStorage...');

    try {
      // Check if migration already done
      const migrated = await this.getAppState('migrated_from_localstorage');
      if (migrated === 'true') {
        console.log('[Database] Migration already completed');
        return;
      }

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
        console.log('[Database] Migrated active project');
      }

      // Migrate dark mode
      const darkMode = localStorage.getItem('strata_darkMode');
      if (darkMode) {
        await this.setAppState('darkMode', darkMode);
        console.log('[Database] Migrated dark mode setting');
      }

      // Mark migration as complete
      await this.setAppState('migrated_from_localstorage', 'true');
      console.log('[Database] Migration completed successfully');

      // Optionally clear localStorage
      // localStorage.removeItem('strata_tasks');
      // localStorage.removeItem('strata_messages');
      // localStorage.removeItem('strata_activeProject');
      // localStorage.removeItem('strata_darkMode');
    } catch (error) {
      console.error('[Database] Migration failed:', error);
      throw error;
    }
  }
}

// Singleton instance
export const db = new DatabaseService();
