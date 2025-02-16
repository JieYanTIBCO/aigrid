import { defineConfig } from 'vite'
import multiEntry from './plugin-multi-entry'

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        input: ['src/extension/popup/main.tsx'],
        output: {
          entryFileNames: `popup.js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`
        }
      }
    },
    plugins: [multiEntry()]
  }
})
