import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    {
      name: 'move-html',
      apply: 'build',
      writeBundle() {
        const distDir = resolve(__dirname, 'dist');
        const srcDir = resolve(__dirname, 'dist/src');
        const pagesDir = resolve(__dirname, srcDir, 'pages');
  
        fs.readdirSync(pagesDir).forEach(dir => {
          const innerDir = resolve(__dirname, pagesDir, dir);
          fs.readdirSync(innerDir).forEach((file) => {
            fs.renameSync(resolve(innerDir, file), resolve(distDir, `${dir}/${dir}.html`));
          });
        });
  
        fs.rmSync(srcDir, { recursive: true, force: true });
      }
    },
  ],
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/pages/popup/index.html'),
      },
      output: {
        dir: resolve(__dirname, 'dist'),
        entryFileNames: '[name]/[name].js',
        chunkFileNames: '[name]/[name].js',
        assetFileNames: '[name]/[name].[ext]',
      }
    }
  },
});
