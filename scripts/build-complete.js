import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildComplete() {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const distDir = path.join(projectRoot, 'dist');
    const newtabDir = path.join(distDir, 'newtab');
    
    console.log('Cleaning directories...');
    await fs.emptyDir(distDir);
    await fs.ensureDir(newtabDir);
    
    console.log('Building TypeScript files...');
    execSync('rollup --config rollup.config.mjs', { stdio: 'inherit' });
    
    console.log('Copying additional files...');
    // Copy React dependencies
    await fs.copy(
      path.join(projectRoot, 'node_modules/react/umd/react.production.min.js'),
      path.join(newtabDir, 'react.production.min.js')
    );
    await fs.copy(
      path.join(projectRoot, 'node_modules/react-dom/umd/react-dom.production.min.js'),
      path.join(newtabDir, 'react-dom.production.min.js')
    );
    
    // Copy HTML template
    await fs.copy(
      path.join(projectRoot, 'src/extension/newtab/index.html'),
      path.join(newtabDir, 'index.html')
    );
    
    // Generate manifest.json using ensure-json script
    console.log('\nGenerating manifest.json...');
    execSync('node scripts/ensure-json.js', { stdio: 'inherit' });
    
    // Verify the build
    console.log('\nBuild completed. Verifying files...');
    const files = await fs.readdir(newtabDir);
    console.log('Files in newtab directory:', files);
    
    const manifestContent = await fs.readJson(path.join(distDir, 'manifest.json'));
    console.log('Manifest is valid JSON:', !!manifestContent);
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildComplete();
