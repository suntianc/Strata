/**
 * Electron Main Process
 * Core logic, database operations, and AI processing
 */

import { config } from 'dotenv';
import electron, { type BrowserWindow as BrowserWindowType } from 'electron';
const { app, BrowserWindow, ipcMain } = electron;
import path from 'path';

// Load environment variables from .env file
config();

// __filename and __dirname are automatically available in CommonJS

// Database singletons (will be initialized)
let mainWindow: BrowserWindowType | null = null;

function isDev() {
  return process.env.NODE_ENV === 'development' || !app.isPackaged;
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#1c1917', // Basalt-900
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // Required for database access
    },
  });

  // Load the app
  if (isDev()) {
    await mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ========== App Lifecycle ==========

app.whenReady().then(async () => {
  // Initialize LLM configuration first
  try {
    const { initLLMFromEnv } = await import('./services/llmConfig.js');
    initLLMFromEnv();
  } catch (error) {
    console.error('[Main] Failed to initialize LLM config:', error);
  }

  // Initialize databases
  try {
    const { initPGlite } = await import('./db/pg.js');
    const { initLanceDB } = await import('./db/vector.js');
    const { initKuzuDB } = await import('./db/graph.js');

    console.log('[Main] Initializing databases...');
    await initPGlite();
    await initLanceDB();
    await initKuzuDB();
    console.log('[Main] Databases initialized successfully');

    // Register IPC handlers
    await registerIPCHandlers();

    // Create window
    await createWindow();
  } catch (error) {
    console.error('[Main] Failed to initialize:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  console.log('[Main] Shutting down databases...');
  // Cleanup will be handled by database modules
});

// ========== IPC Handlers Registration ==========

async function registerIPCHandlers() {
  console.log('[Main] Registering IPC handlers...');

  // Import services
  const { MessageService } = await import('./services/messageService.js');
  const { TaskService } = await import('./services/taskService.js');
  const { IngestionService } = await import('./services/ingestion.js');
  const { RetrievalService } = await import('./services/retrieval.js');
  const { sessionManager } = await import('./services/sessionManager.js');

  // --- Message Handlers ---
  ipcMain.handle('createMessage', async (_, payload) => {
    try {
      return await MessageService.create(payload);
    } catch (error) {
      console.error('[IPC] createMessage error:', error);
      throw error;
    }
  });

  ipcMain.handle('getMessages', async (_, taskId, page = 1, limit = 50) => {
    try {
      return await MessageService.getByTask(taskId, page, limit);
    } catch (error) {
      console.error('[IPC] getMessages error:', error);
      throw error;
    }
  });

  ipcMain.handle('updateMessage', async (_, payload) => {
    try {
      return await MessageService.update(payload);
    } catch (error) {
      console.error('[IPC] updateMessage error:', error);
      throw error;
    }
  });

  ipcMain.handle('archiveMessage', async (_, id) => {
    try {
      await MessageService.archive(id);
    } catch (error) {
      console.error('[IPC] archiveMessage error:', error);
      throw error;
    }
  });

  // --- Task Handlers ---
  ipcMain.handle('createTask', async (_, payload) => {
    try {
      return await TaskService.create(payload);
    } catch (error) {
      console.error('[IPC] createTask error:', error);
      throw error;
    }
  });

  ipcMain.handle('getTasks', async () => {
    try {
      return await TaskService.getTree();
    } catch (error) {
      console.error('[IPC] getTasks error:', error);
      throw error;
    }
  });

  ipcMain.handle('updateTaskStatus', async (_, id, status) => {
    try {
      await TaskService.updateStatus(id, status);
    } catch (error) {
      console.error('[IPC] updateTaskStatus error:', error);
      throw error;
    }
  });

  ipcMain.handle('moveMessage', async (_, payload) => {
    try {
      await MessageService.move(payload);
    } catch (error) {
      console.error('[IPC] moveMessage error:', error);
      throw error;
    }
  });

  // --- AI Handlers ---
  ipcMain.handle('chat', async (event, query, context) => {
    try {
      const results: string[] = [];
      await RetrievalService.chat(query, context, (token) => {
        results.push(token);
        event.sender.send('chat-token', token);
      });
      return results.join('');
    } catch (error) {
      console.error('[IPC] chat error:', error);
      throw error;
    }
  });

  ipcMain.handle('getInboxSuggestions', async () => {
    try {
      return await IngestionService.suggestInboxOrganization();
    } catch (error) {
      console.error('[IPC] getInboxSuggestions error:', error);
      throw error;
    }
  });

  ipcMain.handle('analyzeMessage', async (_, messageId) => {
    try {
      return await IngestionService.analyzeMessage(messageId);
    } catch (error) {
      console.error('[IPC] analyzeMessage error:', error);
      throw error;
    }
  });

  // --- Search Handlers ---
  ipcMain.handle('searchMessages', async (_, query, scope) => {
    try {
      return await RetrievalService.search(query, scope);
    } catch (error) {
      console.error('[IPC] searchMessages error:', error);
      throw error;
    }
  });

  // --- System Handlers ---
  ipcMain.handle('getAppPath', async () => {
    return app.getPath('userData');
  });

  // --- Session Management Handlers ---
  ipcMain.handle('session:getOrCreate', async (_, contextType, contextId, title) => {
    try {
      return await sessionManager.getOrCreateSession(contextType, contextId, title);
    } catch (error) {
      console.error('[IPC] session:getOrCreate error:', error);
      throw error;
    }
  });

  ipcMain.handle('session:create', async (_, contextType, contextId, title) => {
    try {
      return await sessionManager.createSession(contextType, contextId, title);
    } catch (error) {
      console.error('[IPC] session:create error:', error);
      throw error;
    }
  });

  ipcMain.handle('session:list', async (_, contextType, contextId) => {
    try {
      return await sessionManager.listSessions(contextType, contextId);
    } catch (error) {
      console.error('[IPC] session:list error:', error);
      throw error;
    }
  });

  ipcMain.handle('session:get', async (_, sessionId) => {
    try {
      return await sessionManager.getSession(sessionId);
    } catch (error) {
      console.error('[IPC] session:get error:', error);
      throw error;
    }
  });

  ipcMain.handle('session:updateTitle', async (_, sessionId, title) => {
    try {
      await sessionManager.updateSessionTitle(sessionId, title);
    } catch (error) {
      console.error('[IPC] session:updateTitle error:', error);
      throw error;
    }
  });

  ipcMain.handle('session:delete', async (_, sessionId) => {
    try {
      await sessionManager.deleteSession(sessionId);
    } catch (error) {
      console.error('[IPC] session:delete error:', error);
      throw error;
    }
  });

  ipcMain.handle('session:getMessages', async (_, sessionId) => {
    try {
      return await sessionManager.getSessionMessages(sessionId);
    } catch (error) {
      console.error('[IPC] session:getMessages error:', error);
      throw error;
    }
  });

  ipcMain.handle('session:addMessage', async (_, sessionId, role, content, citations) => {
    try {
      return await sessionManager.addMessage(sessionId, role, content, citations);
    } catch (error) {
      console.error('[IPC] session:addMessage error:', error);
      throw error;
    }
  });

  ipcMain.handle('session:clearMessages', async (_, sessionId) => {
    try {
      await sessionManager.clearSessionMessages(sessionId);
    } catch (error) {
      console.error('[IPC] session:clearMessages error:', error);
      throw error;
    }
  });

  ipcMain.handle('session:getRecent', async (_, limit) => {
    try {
      return await sessionManager.getRecentSessions(limit);
    } catch (error) {
      console.error('[IPC] session:getRecent error:', error);
      throw error;
    }
  });

  ipcMain.handle('session:search', async (_, searchTerm, contextType, contextId) => {
    try {
      return await sessionManager.searchMessages(searchTerm, contextType, contextId);
    } catch (error) {
      console.error('[IPC] session:search error:', error);
      throw error;
    }
  });

  ipcMain.handle('session:getStats', async (_, sessionId) => {
    try {
      return await sessionManager.getSessionStats(sessionId);
    } catch (error) {
      console.error('[IPC] session:getStats error:', error);
      throw error;
    }
  });

  console.log('[Main] IPC handlers registered successfully');
}
