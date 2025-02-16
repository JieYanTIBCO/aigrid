import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildSimple() {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const distDir = path.join(projectRoot, 'dist');
    const newtabDir = path.join(distDir, 'newtab');
    
    // Clean and create directories
    await fs.emptyDir(distDir);
    await fs.ensureDir(newtabDir);
    
    // Copy files
    await Promise.all([
      // Copy React files
      fs.copy(
        path.join(projectRoot, 'node_modules/react/umd/react.production.min.js'),
        path.join(newtabDir, 'react.production.min.js')
      ),
      fs.copy(
        path.join(projectRoot, 'node_modules/react-dom/umd/react-dom.production.min.js'),
        path.join(newtabDir, 'react-dom.production.min.js')
      ),
      // Copy newtab HTML
      fs.copy(
        path.join(projectRoot, 'src/extension/newtab/index.html'),
        path.join(newtabDir, 'index.html')
      ),
      // Copy manifest
      fs.copy(
        path.join(projectRoot, 'src/configs/manifest/manifest.template.json'),
        path.join(distDir, 'manifest.json')
      )
    ]);
    
    // Log success
    console.log('✅ Files built successfully');
    
    // Verify files exist
    const files = await fs.readdir(newtabDir);
    console.log('Files in newtab directory:', files);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildSimple();
