import { rollup } from 'rollup';
import { loadConfigFile } from 'rollup/loadConfigFile';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateManifest } from './write-manifest.js';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function build() {
  console.log('Cleaning directories...');
  await fs.remove('dist');

  console.log('Building TypeScript files...');
  try {
    const { options, warnings } = await loadConfigFile(
      path.resolve(__dirname, '../rollup.config.mjs')
    );

    warnings.count > 0 && warnings.flush();

    for (const inputOptions of options) {
      const bundle = await rollup(inputOptions);
      await Promise.all(inputOptions.output.map(bundle.write));
      await bundle.close();
    }

    // Copy React dependencies
    const isDev = process.env.NODE_ENV === 'development';
    const reactMode = isDev ? 'development' : 'production.min';
    
    await fs.copy(
      `node_modules/react/umd/react.${reactMode}.js`,
      'dist/newtab/react.js'
    );
    
    await fs.copy(
      `node_modules/react-dom/umd/react-dom.${reactMode}.js`,
      'dist/newtab/react-dom.js'
    );
  } catch (error) {
    console.error('Build failed:', error);
    throw error;
  }

  console.log('Copying additional files...');

  console.log('Generating manifest.json...');
  await generateManifest();
}
