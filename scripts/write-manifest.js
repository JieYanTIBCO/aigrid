import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load manifest template
const templatePath = path.join(__dirname, '../src/configs/manifest/manifest.template.json');
const templateContent = await fs.promises.readFile(templatePath, 'utf8');

// Validate template content
let manifestData;
try {
  manifestData = JSON.parse(templateContent);
} catch (parseError) {
  console.error('❌ Invalid manifest template:', parseError);
  throw new Error('Manifest template contains invalid JSON');
}

// Apply dynamic values
manifestData.version = process.env.npm_package_version || '0.1.0';

export async function generateManifest() {
  const projectRoot = path.resolve(__dirname, '..');
  const manifestPath = path.join(projectRoot, 'dist', 'manifest.json');

  // Ensure dist directory exists
// Ensure directory exists with explicit permissions
  await fs.promises.mkdir(path.dirname(manifestPath), { recursive: true, mode: 0o755 });

  // Prepare final manifest content
  const finalContent = JSON.stringify(manifestData, null, 2);

  // Write manifest with atomic write to prevent partial writes
  const tempPath = `${manifestPath}.tmp`;
  await fs.promises.writeFile(tempPath, finalContent, { 
    encoding: 'utf8',
    mode: 0o644
  });

  console.log('Generated manifest content:');
  console.log(finalContent);

  // Atomically move temp file to final destination
  await fs.promises.rename(tempPath, manifestPath);

  // Verify content
  const written = await fs.promises.readFile(manifestPath, 'utf8');
  console.log('Manifest content:');
  console.log(written);

  // Verify JSON validity
  try {
    JSON.parse(written);
    console.log('\n✅ Manifest is valid JSON');
    return true;
  } catch (error) {
    console.error('❌ Invalid JSON:', error);
    throw error;
  }
}

// Allow direct execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateManifest().catch((error) => {
    console.error('Failed to generate manifest:', error);
    process.exit(1);
  });
}
