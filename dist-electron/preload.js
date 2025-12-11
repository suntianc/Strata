import { contextBridge, ipcRenderer } from "electron";
const api = {
  // --- Message CRUD ---
  createMessage: (payload) => ipcRenderer.invoke("createMessage", payload),
  getMessages: (taskId, page, limit) => ipcRenderer.invoke("getMessages", taskId, page, limit),
  updateMessage: (payload) => ipcRenderer.invoke("updateMessage", payload),
  archiveMessage: (id) => ipcRenderer.invoke("archiveMessage", id),
  // --- Task Management ---
  createTask: (payload) => ipcRenderer.invoke("createTask", payload),
  getTasks: () => ipcRenderer.invoke("getTasks"),
  updateTaskStatus: (id, status) => ipcRenderer.invoke("updateTaskStatus", id, status),
  moveMessage: (payload) => ipcRenderer.invoke("moveMessage", payload),
  // --- AI Capabilities ---
  chat: async (query, context, onToken) => {
    const tokenHandler = (_, token) => onToken(token);
    ipcRenderer.on("chat-token", tokenHandler);
    try {
      await ipcRenderer.invoke("chat", query, context);
    } finally {
      ipcRenderer.removeListener("chat-token", tokenHandler);
    }
  },
  getInboxSuggestions: () => ipcRenderer.invoke("getInboxSuggestions"),
  analyzeMessage: (messageId) => ipcRenderer.invoke("analyzeMessage", messageId),
  // --- Search ---
  searchMessages: (query, scope) => ipcRenderer.invoke("searchMessages", query, scope),
  // --- System ---
  getAppPath: () => ipcRenderer.invoke("getAppPath")
};
contextBridge.exposeInMainWorld("strataAPI", api);
