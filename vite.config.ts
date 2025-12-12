import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import electronRenderer from 'vite-plugin-electron-renderer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isDev = mode === 'development';

    // Check if we're building for Electron
    const isElectron = process.env.VITE_ELECTRON === 'true';

    const plugins: any[] = [react()];

    // Only load Electron plugins when explicitly building for Electron
    if (isElectron) {
      plugins.push(
        ...electron([
          {
            // Main process entry
            entry: 'electron/main.ts',
            onstart(options) {
              options.reload();
            },
            vite: {
              build: {
                outDir: 'dist-electron',
                lib: {
                  entry: 'electron/main.ts',
                  formats: ['cjs'],
                  fileName: () => 'main.cjs',
                },
                rollupOptions: {
                  external: [
                    'electron',
                    '@electric-sql/pglite',
                    '@lancedb/lancedb',
                    'kuzu',
                    'langchain',
                    '@langchain/community',
                    'llamaindex',
                    'better-sqlite3',
                    'fs',
                    'path',
                    'crypto',
                    'os',
                    'dotenv',
                    'url',
                  ],
                  output: {
                    format: 'cjs',
                    entryFileNames: '[name].cjs',
                    chunkFileNames: '[name]-[hash].cjs',
                  },
                },
              },
              plugins: [
                {
                  name: 'copy-package-json',
                  closeBundle() {
                    // Copy package.json to mark dist-electron as CommonJS
                    const pkgJson = {
                      type: 'commonjs',
                      description: 'Electron main process - uses CommonJS for compatibility'
                    };
                    fs.writeFileSync(
                      path.join(__dirname, 'dist-electron', 'package.json'),
                      JSON.stringify(pkgJson, null, 2)
                    );
                  }
                }
              ],
            },
          },
          {
            // Preload script
            entry: 'electron/preload.ts',
            onstart(options) {
              options.reload();
            },
            vite: {
              build: {
                outDir: 'dist-electron',
                lib: {
                  entry: 'electron/preload.ts',
                  formats: ['cjs'],
                  fileName: () => 'preload.cjs',
                },
                rollupOptions: {
                  external: ['electron'],
                  output: {
                    format: 'cjs',
                  },
                },
              },
            },
          },
        ]),
        electronRenderer()
      );
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins,
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        emptyOutDir: true,
      },
    };
});
