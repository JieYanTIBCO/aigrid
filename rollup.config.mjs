import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import path from 'path'

// Shared TypeScript configuration
const tsPluginOptions = {
  tsconfig: './tsconfig.json',
  sourceMap: true,
  include: ['src/**/*.ts', 'src/**/*.tsx'],
  exclude: ['node_modules']
}

// Shared plugin configuration
const sharedPlugins = [
  resolve({
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  }),
  commonjs(),
  postcss({
    extensions: ['.css'],
    extract: true,
    minimize: true
  })
]

export default defineConfig([
  // Popup bundle
  {
    input: 'src/extension/popup/main.tsx',
    output: {
      file: 'dist/popup.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      ...sharedPlugins,
      typescript({
        ...tsPluginOptions,
        jsx: 'react'
      })
    ],
    external: ['react', 'react-dom']
  },
  // Background script bundle
  {
    input: 'src/extension/background/main.ts',
    output: {
      file: 'dist/background.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      ...sharedPlugins,
      typescript(tsPluginOptions)
    ]
  },
  // Content script bundle
  {
    input: 'src/extension/content/main.ts',
    output: {
      file: 'dist/content.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      ...sharedPlugins,
      typescript(tsPluginOptions)
    ]
  }
])
