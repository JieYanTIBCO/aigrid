import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    lib: {
      formats: ['es'],
      entry: {
        popup: path.resolve(__dirname, '../../src/extension/popup/main.tsx'),
        background: path.resolve(__dirname, '../../src/extension/background/main.ts'),
        content: path.resolve(__dirname, '../../src/extension/content/main.ts')
      }
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]',
        format: 'es',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
