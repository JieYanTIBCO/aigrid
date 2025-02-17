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
    
    // Ensure dist directory exists
    await fs.ensureDir('dist');
    await fs.ensureDir('dist/newtab');

    console.log('Building TypeScript files...');
  try {
    console.log('Verifying Rollup installation...');
    try {
      const resolvedPath = import.meta.resolve('rollup');
      const rollupPath = path.dirname(fileURLToPath(resolvedPath));
      let currentPath = rollupPath;
      let rollupJson;
      let attempts = 0;
      
      while (!rollupJson && attempts < 5) {
        try {
          rollupJson = await fs.promises.readFile(`${currentPath}/package.json`, 'utf-8');
        } catch (e) {
          currentPath = path.dirname(currentPath);
          attempts++;
        }
      }
      
      if (!rollupJson) {
        throw new Error('Could not find Rollup package.json');
      }
      const rollupPackage = JSON.parse(rollupJson);
      const rollupVersion = rollupPackage.version;
      console.log(`- Found Rollup version: ${rollupVersion}`);
    } catch (rollupError) {
      console.error('Rollup is not installed correctly:', rollupError);
      throw new Error('Rollup installation is invalid');
    }

    console.log('Loading Rollup configuration...');
    const configPath = path.resolve(__dirname, '../rollup.config.mjs');
    
    if (!fs.existsSync(configPath)) {
      throw new Error(`Rollup config not found: ${configPath}`);
    }

    console.log('- Checking module resolution...');
    try {
        let configModule;
        try {
          // Try importing as file URL
          configModule = await import(new URL(`file://${configPath}`).href);
        } catch (urlError) {
          try {
            // Try importing as regular path
            configModule = await import(configPath);
          } catch (pathError) {
            console.error('Failed both URL and path imports:', pathError);
            throw new Error('Module resolution failed');
          }
        }
      console.log('- Rollup config module loaded successfully');
    } catch (moduleError) {
      console.error('Failed to resolve Rollup config module:', moduleError);
      throw new Error('Module resolution failed');
    }

    console.log('- Validating configuration structure...');
    const configContent = await fs.readFile(configPath, 'utf-8');
    if (!configContent.trim()) {
      throw new Error('Rollup config is empty');
    }

    console.log('- Parsing configuration content...');
    let parsedConfig;
    try {
      parsedConfig = JSON.parse(configContent);
    } catch (parseError) {
      console.warn('Config is not JSON - assuming ES module');
    }

    console.log('- Validating plugins...');
    let configPlugins = [];
    try {
      let configModule;
      try {
        // Convert to file URL
        const fileUrl = new URL(`file://${configPath.replace(/\\/g, '/')}`);
        configModule = await import(fileUrl.href);
      } catch (urlError) {
        try {
          // Try importing as regular path
          configModule = await import(configPath);
        } catch (pathError) {
          console.error('Failed both URL and path imports:', pathError);
          throw new Error('Module resolution failed');
        }
      }

      // Handle different export types
      const getConfig = configModule.default || configModule;
      const configFunction = typeof getConfig === 'function' 
        ? getConfig 
        : () => getConfig;

      const config = configFunction();
      configPlugins = config.plugins || [];
      console.log(`- Found ${configPlugins.length} plugins`);
    } catch (pluginError) {
      console.error('Failed to resolve plugins:', pluginError);
      throw new Error('Plugin resolution failed');
    }

    console.log('- Checking plugin versions...');
    for (const plugin of configPlugins) {
      if (plugin && typeof plugin === 'object' && plugin.name) {
        console.log(`- Found plugin: ${plugin.name}`);
        try {
          const pluginPackage = require(`${plugin.name}/package.json`);
          console.log(`  - Version: ${pluginPackage.version}`);
        } catch (versionError) {
          console.warn(`  - Could not find version for plugin: ${plugin.name}`);
        }
      }
    }

    console.log('- Checking environment conditions...');
    try {
      const envConditions = [
        'process.env.NODE_ENV',
        'process.env.BUILD_TARGET',
        'process.env.PLATFORM'
      ];
      
      for (const condition of envConditions) {
        try {
          console.log(`- Evaluating ${condition}:`, eval(condition));
        } catch (evalError) {
          console.warn(`- ${condition} is not defined`);
        }
      }
    } catch (envError) {
      console.error('Environment check failed:', envError);
    }

    console.log('- Looking for conditional build logic...');
    const conditionalPatterns = [
      'if\\s*\\(.*\\)\\s*{',
      'process\\.env\\.',
      '\\?\\:',
      '\\&\\&',
      '\\|\\|'
    ];

    for (const pattern of conditionalPatterns) {
      if (configContent.match(new RegExp(pattern))) {
        console.warn(`- Found potential conditional logic: ${pattern}`);
      }
    }

    console.log('- Loading configuration options...');
    const { options, warnings } = await loadConfigFile(configPath);

    if (!Array.isArray(options) || options.length === 0) {
      throw new Error('No build configurations found in Rollup config');
    }

    console.log(`- Found ${options.length} build configurations`);
    
    if (warnings.count > 0) {
      console.warn('Rollup warnings:');
      warnings.flush();
    }

    console.log(`Processing ${options.length} build configurations...`);
    
    for (const [index, inputOptions] of options.entries()) {
      const configNumber = index + 1;
      console.log(`\n=== Processing configuration ${configNumber} ===`);
      
      try {
        console.log('- Validating input files...');
        if (!inputOptions.input || !fs.existsSync(inputOptions.input)) {
          throw new Error(`Input file not found: ${inputOptions.input}`);
        }

        console.log('- Creating Rollup bundle...');
        const bundle = await rollup(inputOptions);

        console.log('- Writing output files...');
        await Promise.all(inputOptions.output.map(async (output) => {
          try {
            console.log(`- Writing to ${output.dir || output.file}`);
            await bundle.write(output);
          } catch (writeError) {
            console.error(`Failed to write output for configuration ${configNumber}:`, writeError);
            throw writeError;
          }
        }));

        console.log('- Closing bundle...');
        await bundle.close();

        console.log(`=== Finished configuration ${configNumber} ===`);
      } catch (configError) {
        console.error(`Configuration ${configNumber} failed:`, configError);
        throw configError;
      }
    }

    // Set environment variables
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    const isDev = process.env.NODE_ENV === 'development';
    const reactMode = isDev ? 'development' : 'production.min';
    
    console.log(`Resolved environment variables:`);
    console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`- isDev: ${isDev}`);
    console.log(`- reactMode: ${reactMode}`);
    
    console.log('Validating output directories...');
    const requiredDirs = [
      'dist',
      'dist/newtab'
    ];
    
    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        console.error(`Missing directory: ${dir}`);
        throw new Error(`Directory not found: ${dir}`);
      }
    }

    console.log('All required directories exist.');
    
    try {
      console.log('Copying React dependencies...');
      await fs.copy(
        `node_modules/react/umd/react.${reactMode}.js`,
        'dist/newtab/react.js'
      );
      
      await fs.copy(
        `node_modules/react-dom/umd/react-dom.${reactMode}.js`,
        'dist/newtab/react-dom.js'
      );
    } catch (error) {
      console.error('Error copying React dependencies:', error);
      throw error;
    }
  } catch (error) {
    console.error('Build failed:', error);
    throw error;
  }

  console.log('Copying additional files...');

  console.log('Starting manifest generation...');
  try {
    console.log('- Verifying manifest generator...');
    if (typeof generateManifest !== 'function') {
      throw new Error('generateManifest is not a function');
    }
    
    console.log('- Generating manifest...');
    await generateManifest();
    console.log('- Manifest generated successfully');
  } catch (manifestError) {
    console.error('Manifest generation failed:', manifestError);
    throw manifestError;
  }
}
