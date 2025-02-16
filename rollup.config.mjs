import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import html from '@rollup/plugin-html'
import copy from 'rollup-plugin-copy'
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
      format: 'es',
      sourcemap: true
    },
    plugins: [
      ...sharedPlugins,
      typescript({
        tsconfig: './tsconfig.newtab.json',
        sourceMap: true,
        jsx: 'react'
      }),
      html({
        template: ({ files }) => {
          return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Tab</title>
  ${files.css?.map(file => `<link rel="stylesheet" href="${file.fileName}">`).join('\n')}
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  ${files.js?.map(file => `<script type="module" src="${file.fileName}"></script>`).join('\n')}
</body>
</html>
          `.trim();
        }
      }),
      copy({
        targets: [
          { src: 'public/**/*', dest: 'dist/' }
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
      ...sharedPlugins,
      typescript({
        tsconfig: './tsconfig.content.json',
        sourceMap: true
      })
    ]
  }
])
