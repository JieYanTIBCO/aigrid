import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(process.cwd(), 'src/extension/background/index.ts'),
      output: {
        entryFileNames: 'assets/background.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
