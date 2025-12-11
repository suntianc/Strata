import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import electronRenderer from 'vite-plugin-electron-renderer';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isDev = mode === 'development';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        electron([
          {
            // Main process entry
            entry: 'electron/main.ts',
            vite: {
              build: {
                outDir: 'dist-electron',
                rollupOptions: {
                  external: [
                    'electron',
                    '@electric-sql/pglite',
                    '@lancedb/lancedb',
                    'kuzu',
                    'langchain',
                    '@langchain/community',
                    'llamaindex',
                  ],
                },
              },
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
              },
            },
          },
        ]),
        electronRenderer(),
      ],
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
