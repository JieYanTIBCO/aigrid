import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureJson() {
    try {
        const projectRoot = path.resolve(__dirname, '..');
        const distDir = path.join(projectRoot, 'dist');
        const manifestPath = path.join(distDir, 'manifest.json');
        
        // Format manifest with Windows line endings
        const manifestObj = {
            manifest_version: 3,
            name: "AIGrid",
            description: "Your AI Collaboration Hub for the Intelligent Era",
            version: "0.1.0",
            chrome_url_overrides: {
                newtab: "newtab/index.html"
            },
            background: {
                service_worker: "background.js",
                type: "module"
            },
            content_scripts: [
                {
                    matches: ["https://chat.openai.com/*"],
                    js: ["content.js"]
                }
            ],
            permissions: [
                "storage",
                "cookies",
                "scripting",
                "tabs"
            ],
            host_permissions: [
                "https://chat.openai.com/*"
            ],
            action: {
                default_icon: {
                    "16": "icons/icon16.png",
                    "48": "icons/icon48.png",
                    "128": "icons/icon128.png"
                }
            },
            icons: {
                "16": "icons/icon16.png",
                "48": "icons/icon48.png",
                "128": "icons/icon128.png"
            }
        };

        // Convert to properly formatted JSON string
        const jsonStr = JSON.stringify(manifestObj, null, 2) + '\n';
        
        await fs.writeFile(manifestPath, jsonStr, 'utf8');
        
        // Verify the output
        const content = await fs.readFile(manifestPath, 'utf8');
        console.log('Manifest content:');
        console.log(content);
        
        // Parse to verify it's valid JSON
        JSON.parse(content);
        console.log('\n✅ Manifest is valid JSON');
        
    } catch (error) {
        console.error('Failed to write manifest:', error);
        process.exit(1);
    }
}

ensureJson();
