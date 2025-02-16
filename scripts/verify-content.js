import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyContent() {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const distDir = path.join(projectRoot, 'dist');
    const newtabDir = path.join(distDir, 'newtab');
    
    // Read and output file contents
    const indexHtml = await fs.readFile(path.join(newtabDir, 'index.html'), 'utf8');
    const manifest = await fs.readFile(path.join(distDir, 'manifest.json'), 'utf8');
    
    console.log('=== index.html ===');
    console.log(indexHtml);
    console.log('\n=== manifest.json ===');
    console.log(manifest);
  } catch (error) {
    console.error('Content verification failed:', error);
  }
}

verifyContent();
