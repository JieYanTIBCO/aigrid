import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build() {
  try {
    // Clean and ensure dist directory
    const distDir = path.resolve(__dirname, '../dist');
    await fs.remove(distDir);
    await fs.ensureDir(distDir);
    console.log('✅ Directory cleaned and created');

    // Run rollup
    await execAsync('rollup --config rollup.config.mjs');
    console.log('✅ Rollup build completed');

    // Convert icons
    await execAsync('node ./scripts/convert-icons.js');
    console.log('✅ Icons converted');

    // Build manifest
    await execAsync('node ./scripts/build-manifest.js');
    console.log('✅ Manifest generated');
    
    console.log('🎉 Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
