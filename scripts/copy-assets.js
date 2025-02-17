import { existsSync, mkdirSync } from 'fs';
import { copyFile } from 'fs/promises';
import { join, dirname } from 'path';

const ICONS = [
  'OpenAI_Logo.svg',
  'Claude_AI_logo.svg',
  'gemini-color.svg',
  'qwen-color.svg',
  'DeepSeek_logo.svg',
  'meta-Llama.svg',
  'icon16.png',
  'icon32.png',
  'icon48.png',
  'icon128.png'
];

async function copyIcons() {
  console.log('Copying icons...');
  const sourceDir = join(process.cwd(), 'public', 'icons');
  const targetDir = join(process.cwd(), 'dist', 'icons');

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  for (const icon of ICONS) {
    const source = join(sourceDir, icon);
    const target = join(targetDir, icon);

    try {
      await copyFile(source, target);
      console.log(`✓ Copied ${icon}`);
    } catch (error) {
      console.error(`✗ Failed to copy ${icon}:`, error.message);
    }
  }
}

copyIcons().catch(console.error);
