import { rollup, watch } from 'rollup';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import rollupConfig from '../rollup.config.mjs';
import { LiveReloadServer } from './live-reload-server.js';

// Set development environment
process.env.NODE_ENV = 'development';

// Initialize live reload server
const liveReloadServer = new LiveReloadServer();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupWatch() {
    const projectRoot = path.resolve(__dirname, '..');
    const distDir = path.join(projectRoot, 'dist');

    // Initial setup
    console.log('Setting up watch mode...');
    console.log('Cleaning dist directory...');
    await fs.emptyDir(distDir);
    await fs.ensureDir(path.join(distDir, 'newtab'));

    // Copy React dependencies
    console.log('Copying React dependencies...');
    await fs.copy(
        path.join(projectRoot, 'node_modules/react/umd/react.production.min.js'),
        path.join(distDir, 'newtab/react.production.min.js')
    );
    await fs.copy(
        path.join(projectRoot, 'node_modules/react-dom/umd/react-dom.production.min.js'),
        path.join(distDir, 'newtab/react-dom.production.min.js')
    );

    // Copy public assets
    console.log('Copying public assets...');
    await fs.copy(path.join(projectRoot, 'public'), distDir, { recursive: true });

    // Setup manifest watcher
    const manifestTemplate = path.join(projectRoot, 'src/configs/manifest/manifest.template.json');
    const manifestDest = path.join(distDir, 'manifest.json');

    async function updateManifest() {
        const manifest = await fs.readJson(manifestTemplate);
        await fs.writeJson(manifestDest, manifest, { spaces: 2 });
        console.log('✅ Updated manifest.json');
    }

    // Initial manifest copy
    await updateManifest();

    // Watch manifest template
    fs.watch(manifestTemplate, async (eventType, filename) => {
        if (eventType === 'change') {
            console.log('🔄 Manifest template changed, updating...');
            await updateManifest();
        }
    });

    // Use rollup config
    const configs = await Promise.resolve(rollupConfig);

    // Start live reload server
    liveReloadServer.start();

    // Start rollup watch
    const watcher = watch(configs.map(config => ({
        ...config,
        watch: {
            include: ['src/**'],
            exclude: ['node_modules/**']
        }
    })));

    // Watch events
    watcher.on('event', event => {
        switch (event.code) {
            case 'START':
                console.log('🔄 Build starting...');
                break;
            case 'BUNDLE_START':
                console.log(`📦 Bundling ${event.input}...`);
                break;
            case 'BUNDLE_END':
                console.log(`✅ Bundled ${event.input} → ${event.output} (${event.duration}ms)`);
                break;
            case 'END':
                console.log('✨ Build complete');
                liveReloadServer.reload();
                break;
            case 'ERROR':
                console.error('❌ Build error:', event.error);
                break;
        }
    });

    // Handle process termination
    const cleanup = () => {
        watcher.close();
        liveReloadServer.close();
    };
    
    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);

    console.log('\n👀 Watching for changes...\n');
}

setupWatch().catch(err => {
    console.error('Setup failed:', err);
    process.exit(1);
});
