import fs from 'fs';
import path from 'path';

// Clean up duplicate React files after the build
const cleanupDuplicateFiles = () => {
  const newtabDir = path.join(process.cwd(), 'dist', 'newtab');
  const filesToRemove = [
    'react.production.min.js',
    'react-dom.production.min.js'
  ];

  filesToRemove.forEach(file => {
    const filePath = path.join(newtabDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed duplicate file: ${file}`);
    }
  });
};

// Execute the main build script
// Execute the main build script
import('./build.js').then((buildModule) => {
  return buildModule.default();
}).then(() => {
  console.log('Build completed, cleaning up...');
  cleanupDuplicateFiles();
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
