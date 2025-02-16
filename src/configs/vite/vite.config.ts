import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(process.cwd(), 'src/extension/popup/main.tsx'),
      name: 'aigrid',
      formats: ['es'],
      fileName: (format) => `popup.js`
    },
    rollupOptions: {
      input: {
        popup: path.resolve(process.cwd(), 'src/extension/popup/main.tsx'),
        background: path.resolve(process.cwd(), 'src/extension/background/main.ts'),
        content: path.resolve(process.cwd(), 'src/extension/content/main.ts')
      },
      output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        format: 'es',
        preserveModules: false
      }
    },
    cssCodeSplit: false,
    outDir: 'dist',
    emptyOutDir: true
  }
})
