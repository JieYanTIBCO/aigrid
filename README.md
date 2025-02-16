# AIGrid Chrome Extension

AIGrid is your AI Collaboration Hub for the Intelligent Era.

## Development Guide

### Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server with live reload:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Development Features

- **Live Reload**: Changes to source files are automatically detected and trigger browser refresh
- **Watch Mode**: Automatically rebuilds on file changes
- **Development Mode**: Extra debugging features enabled in dev mode
- **Source Maps**: Full source maps support for debugging

### Project Structure

- `/src` - Source files
  - `/extension` - Chrome extension source code
    - `/newtab` - New tab page React application
    - `/background` - Service worker scripts
    - `/content` - Content scripts
- `/dist` - Built extension files
- `/scripts` - Build and development scripts
- `/public` - Static assets

### Build Modes

- **Development**: `npm run dev`
  - Includes live reload
  - Watch mode enabled
  - Source maps
  - Development-specific features

- **Production**: `npm run build`
  - Optimized build
  - No development features
  - Minified output

### Debugging

The extension runs a WebSocket server on port 35729 for live reload in development mode. The new tab page will automatically connect to this server when running in development mode.

To see live reload in action:
1. Run `npm run dev`
2. Load the unpacked extension in Chrome
3. Open a new tab
4. Make changes to source files
5. See automatic updates in the browser
