import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildWithDebug() {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const distDir = path.join(projectRoot, 'dist');
    const newtabDir = path.join(distDir, 'newtab');
    
    console.log('Current working directory:', process.cwd());
    console.log('Project root:', projectRoot);
    console.log('Dist directory:', distDir);
    console.log('Newtab directory:', newtabDir);
    
    // Clean and create directories
    if (await fs.pathExists(distDir)) {
      console.log('Removing existing dist directory');
      await fs.remove(distDir);
    }
    
    console.log('Creating directories...');
    await fs.mkdirp(distDir);
    await fs.mkdirp(newtabDir);
    
    // Verify directories exist
    const distExists = await fs.pathExists(distDir);
    const newtabExists = await fs.pathExists(newtabDir);
    console.log('Dist directory exists:', distExists);
    console.log('Newtab directory exists:', newtabExists);
    
    if (!distExists || !newtabExists) {
      throw new Error('Failed to create directories');
    }
    
    // Copy files
    console.log('Copying files...');
    const filesToCopy = [
      {
        src: path.join(projectRoot, 'node_modules/react/umd/react.production.min.js'),
        dest: path.join(newtabDir, 'react.production.min.js')
      },
      {
        src: path.join(projectRoot, 'node_modules/react-dom/umd/react-dom.production.min.js'),
        dest: path.join(newtabDir, 'react-dom.production.min.js')
      },
      {
        src: path.join(projectRoot, 'src/extension/newtab/index.html'),
        dest: path.join(newtabDir, 'index.html')
      },
      {
        src: path.join(projectRoot, 'src/configs/manifest/manifest.template.json'),
        dest: path.join(distDir, 'manifest.json')
      }
    ];
    
    for (const {src, dest} of filesToCopy) {
      console.log(`Copying ${src} to ${dest}`);
      const srcExists = await fs.pathExists(src);
      if (!srcExists) {
        console.error(`Source file does not exist: ${src}`);
        continue;
      }
      await fs.copy(src, dest);
      const destExists = await fs.pathExists(dest);
      console.log(`Destination file exists: ${destExists}`);
    }
    
    // List contents of directories
    console.log('\nContents of dist directory:');
    const distContents = await fs.readdir(distDir);
    console.log(distContents);
    
    console.log('\nContents of newtab directory:');
    const newtabContents = await fs.readdir(newtabDir);
    console.log(newtabContents);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildWithDebug();
