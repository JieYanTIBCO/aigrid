import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyFiles() {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const distDir = path.join(projectRoot, 'dist');
    const newtabDir = path.join(distDir, 'newtab');
    
    // Try to read files directly
    const files = [
      path.join(newtabDir, 'index.html'),
      path.join(newtabDir, 'react.production.min.js'),
      path.join(newtabDir, 'react-dom.production.min.js'),
      path.join(distDir, 'manifest.json')
    ];
    
    console.log('Attempting to read files...\n');
    
    for (const file of files) {
      try {
        const stats = await fs.stat(file);
        console.log(`✅ ${file}`);
        console.log(`   Size: ${stats.size} bytes`);
        console.log(`   Created: ${stats.birthtime}`);
        console.log(`   Last modified: ${stats.mtime}\n`);
      } catch (err) {
        console.error(`❌ Failed to read ${file}`);
        console.error(`   Error: ${err.message}\n`);
      }
    }
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

verifyFiles();
