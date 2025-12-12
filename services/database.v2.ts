import { TaskNode, Message, AppSettings } from '../types';

// Browser-only localStorage-based database service
// Electron mode uses SQLite (better-sqlite3) via IPC
//
// PGlite has been removed - browser mode now uses localStorage exclusively

let initPromise: Promise<void> | null = null;
let isInitialized = false;

class DatabaseService {
  private async getDb(): Promise<null> {
    // PGlite has been removed - using localStorage instead
    throw new Error('PGlite disabled - using localStorage for browser mode');
  }

  async init(): Promise<void> {
    if (initPromise) {
      return initPromise;
    }

    initPromise = (async () => {
      // Browser mode: Skip PGlite initialization, use localStorage
      console.log('[Database] 🌐 Browser mode - using localStorage (PGlite removed)');
      isInitialized = false;
    })();

    return initPromise;
  }

  isDatabaseAvailable(): boolean {
    return false; // Always return false to force localStorage usage
  }

  // ============ Stub Methods (Never Called) ============
  // All methods below are stubbed because PGlite has been removed
  // Browser mode uses localStorage via App.tsx directly
  // These methods are protected by isDatabaseAvailable() checks

  private async createTables(): Promise<void> {
    throw new Error('PGlite disabled - using localStorage');
  }

  async getTasks(): Promise<TaskNode[]> {
    throw new Error('PGlite disabled - using localStorage');
  }

  async saveTasks(tasks: TaskNode[]): Promise<void> {
    throw new Error('PGlite disabled - using localStorage');
  }

  async getMessages(): Promise<Message[]> {
    throw new Error('PGlite disabled - using localStorage');
  }

  async saveMessages(messages: Message[]): Promise<void> {
    throw new Error('PGlite disabled - using localStorage');
  }

  async getSettings(): Promise<AppSettings | null> {
    throw new Error('PGlite disabled - using localStorage');
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    throw new Error('PGlite disabled - using localStorage');
  }

  async migrateFromLocalStorage(): Promise<void> {
    throw new Error('PGlite disabled - using localStorage');
  }

  async getAppState(key: string): Promise<string | null> {
    throw new Error('PGlite disabled - using localStorage');
  }

  async setAppState(key: string, value: string): Promise<void> {
    throw new Error('PGlite disabled - using localStorage');
  }
}

export const db = new DatabaseService();
