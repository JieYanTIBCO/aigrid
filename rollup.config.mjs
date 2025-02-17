import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import html from '@rollup/plugin-html'
import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace'
import path from 'path'

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
  // Newtab bundle
  {
    input: 'src/extension/newtab/index.tsx',
    output: {
      dir: 'dist/newtab',
      format: 'iife',
      sourcemap: true,
      globals: {
        'react': 'React',
        'react-dom/client': 'ReactDOM',
        'react-dom': 'ReactDOM'
      },
      name: 'AIGrid',
      entryFileNames: 'index.js',
      assetFileNames: '[name][extname]',
      inlineDynamicImports: true
    },
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }
      }),
      ...sharedPlugins,
      typescript({
        tsconfig: './tsconfig.newtab.json',
        sourceMap: true,
        jsx: 'react-jsx',
        jsxImportSource: 'react'
      }),
      html({
        template: () => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Tab</title>
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <div id="root"></div>
  <script src="index.js"></script>
</body>
</html>
        `
      }),
      copy({
        targets: [
          { src: 'public/**/*', dest: 'dist/' },
          ...(process.env.NODE_ENV === 'development' && !process.env.VITE_BUILD_WATCH ? [{
            src: 'src/extension/newtab/live-reload.js',
            dest: 'dist/newtab'
          }] : [])
        ]
      })
    ]
  },
  // Background script bundle
  {
    input: 'src/extension/background/main.ts',
    output: {
      dir: 'dist',
      entryFileNames: 'background.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }
      }),
      ...sharedPlugins,
      typescript({
        tsconfig: './tsconfig.background.json',
        sourceMap: true
      })
    ]
  },
  // Content script bundle
  {
    input: 'src/extension/content/main.ts',
    output: {
      dir: 'dist',
      entryFileNames: 'content.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }
      }),
      ...sharedPlugins,
      typescript({
        tsconfig: './tsconfig.content.json',
        sourceMap: true
      })
    ]
  }
])
