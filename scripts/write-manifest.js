import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestContent = `{
  "manifest_version": 3,
  "name": "AIGrid",
  "description": "Your AI Collaboration Hub for the Intelligent Era",
  "version": "0.1.0",
  "chrome_url_overrides": {
    "newtab": "newtab/index.html"
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["https://chat.openai.com/*"],
      "js": ["content.js"]
    }
  ],
  "permissions": [
    "storage",
    "cookies",
    "scripting",
    "tabs"
  ],
  "host_permissions": [
    "https://chat.openai.com/*"
  ],
  "action": {
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}`;

const projectRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(projectRoot, 'dist', 'manifest.json');

// Write with explicit encoding and line endings
fs.writeFileSync(manifestPath, manifestContent, { encoding: 'utf8', flag: 'w' });

// Verify content
const written = fs.readFileSync(manifestPath, 'utf8');
console.log('Written manifest content:');
console.log(written);

// Verify JSON validity
try {
    JSON.parse(written);
    console.log('\n✅ Manifest is valid JSON');
} catch (error) {
    console.error('❌ Invalid JSON:', error);
    process.exit(1);
}
