import { Plugin } from 'vite'
import * as path from 'path'

export function multiEntry(): Plugin {
  return {
    name: 'vite-plugin-multi-entry',
    config(config) {
      const entries = {
        popup: path.resolve(process.cwd(), 'src/extension/popup/main.tsx'),
        background: path.resolve(process.cwd(), 'src/extension/background/main.ts'),
        content: path.resolve(process.cwd(), 'src/extension/content/main.ts')
      }

      return {
        build: {
          rollupOptions: {
            input: entries,
            output: {
              entryFileNames: '[name].js',
              chunkFileNames: '[name].[hash].js',
              assetFileNames: '[name].[hash].[ext]'
            }
          }
        }
      }
    }
  }
}
