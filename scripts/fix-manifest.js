import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixManifest() {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const distDir = path.join(projectRoot, 'dist');
    const manifestPath = path.join(distDir, 'manifest.json');
    
    // Read the manifest template
    const templatePath = path.join(projectRoot, 'src/configs/manifest/manifest.template.json');
    const manifestData = await fs.readJson(templatePath);
    
    // Write it back with proper JSON formatting
    try {
        const manifestStr = JSON.stringify(manifestData, null, 2);
        // Validate the JSON by parsing it
        JSON.parse(manifestStr);
        await fs.writeFile(manifestPath, manifestStr, 'utf8');
        console.log('Manifest file content:');
        console.log(manifestStr);
    } catch (e) {
        throw new Error(`Invalid JSON: ${e.message}`);
    }
    
    // Verify the output
    const result = await fs.readJson(manifestPath);
    console.log('Manifest fixed successfully. Here is the content:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Failed to fix manifest:', error);
    process.exit(1);
  }
}

fixManifest();
