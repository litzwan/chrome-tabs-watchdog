import { resolve } from 'path';
import fs from 'fs';
import { PluginOption } from 'vite';

function moveHtmlPlugin(): PluginOption {
  return {
    name: 'move-html',
    apply: 'build',
    writeBundle() {
      const distDir = resolve(__dirname, '..', 'dist');
      const srcDir = resolve(distDir, 'src');
      const pagesDir = resolve(srcDir, 'pages');

      fs.readdirSync(pagesDir).forEach(dir => {
        const innerDir = resolve(pagesDir, dir);
        fs.readdirSync(innerDir).forEach((file) => {
          fs.renameSync(resolve(innerDir, file), resolve(distDir, `${dir}/${dir}.html`));
        });
      });

      fs.rmSync(srcDir, { recursive: true, force: true });
    }
  };
}

export default moveHtmlPlugin;