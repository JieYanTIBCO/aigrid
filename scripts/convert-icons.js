import sharp from 'sharp';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [16, 48, 128];

async function convertIcons() {
  try {
    const inputPath = path.resolve(__dirname, '../public/icons/icon.svg');
    const outputDir = path.resolve(__dirname, '../dist/icons');
    
    // Ensure output directory exists
    await fs.ensureDir(outputDir);
    
    // Convert SVG to different size PNGs
    for (const size of SIZES) {
      const outputPath = path.join(outputDir, `icon${size}.png`);
      await sharp(inputPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
    }
    
    // Keep the original SVG
    await fs.copy(inputPath, path.join(outputDir, 'icon.svg'));
    
    console.log('✅ Icons generated successfully');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

convertIcons();
