import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import path from 'path'

export default defineConfig([
  // Popup bundle
  {
    input: 'src/extension/popup/main.tsx',
    output: {
      file: 'dist/popup.js',
      format: 'es'
    },
    plugins: [
      typescript(),
      resolve(),
      commonjs()
    ],
    external: ['react', 'react-dom']
  },
  // Background script bundle
  {
    input: 'src/extension/background/main.ts',
    output: {
      file: 'dist/background.js',
      format: 'es'
    },
    plugins: [
      typescript(),
      resolve(),
      commonjs()
    ]
  },
  // Content script bundle
  {
    input: 'src/extension/content/main.ts',
    output: {
      file: 'dist/content.js',
      format: 'es'
    },
    plugins: [
      typescript(),
      resolve(),
      commonjs()
    ]
  }
])
