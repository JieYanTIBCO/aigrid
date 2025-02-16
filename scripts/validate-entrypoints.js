// scripts/validate-entrypoints.js
const fs = require('fs')
const paths = [
  './src/extension/popup/index.html',
  './src/extension/popup/main.tsx',
  './src/extension/background/main.ts',
  './src/extension/content/main.ts'
]

paths.forEach(p => {
  if (!fs.existsSync(p)) {
    console.error(`Missing critical entry point: ${p}`)
    process.exit(1)
  }
})

console.log('✅ All entry points validated successfully')
