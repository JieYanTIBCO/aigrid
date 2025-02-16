import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildManifest() {
  try {
    // Read the template
    const templatePath = path.resolve(__dirname, '../src/configs/manifest/manifest.template.json');
    const manifestContent = await fs.readFile(templatePath, 'utf8');
    
    // Ensure dist directory exists
    const distDir = path.resolve(__dirname, '../dist');
    await fs.ensureDir(distDir);
    
    // Write manifest to dist
    const manifestPath = path.resolve(distDir, 'manifest.json');
    await fs.writeFile(manifestPath, manifestContent);
    
    console.log('✅ Manifest file generated successfully');
  } catch (error) {
    console.error('❌ Error generating manifest:', error);
    process.exit(1);
  }
}

buildManifest();
