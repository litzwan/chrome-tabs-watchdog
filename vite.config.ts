import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import moveHtmlPlugin from './build/moveHtmlPlugin';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    moveHtmlPlugin(),
  ],
  server: {
    open: './src/pages/popup/index.html',
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/pages/popup/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        dir: resolve(__dirname, 'dist'),
        entryFileNames: (chunk) => {
          if (chunk.name === 'background') {
            return 'background.js';
          }
          return '[name]/[name].js';
        },
        chunkFileNames: '[name]/[name].js',
        assetFileNames: '[name]/[name].[ext]',
      },
      plugins: [
        terser(),
      ],
    },
  },
});
