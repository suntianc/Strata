import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'electron/main.ts')
        }
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'electron/preload.ts')
        }
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html')
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  }
});
