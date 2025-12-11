/**
 * Electron Module Wrapper
 *
 * Workaround for CommonJS module resolution issue:
 * When using require('electron') in CommonJS, Node resolves to node_modules/electron/index.js
 * which exports a string path, not the Electron API.
 *
 * This wrapper uses dynamic require to bypass the issue.
 */

// @ts-ignore - Bypass TypeScript checking for this workaround
const electronModule = typeof process !== 'undefined' && process.versions && process.versions.electron
  ? eval('require')('electron')  // Use eval to prevent bundlers from resolving the path
  : require('electron');

export const { app, BrowserWindow, ipcMain } = electronModule;
export default electronModule;
