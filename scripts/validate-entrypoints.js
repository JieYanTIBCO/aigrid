import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const paths = [
  'src/extension/popup/main.tsx',
  'src/extension/popup/index.html',
  'src/extension/background/main.ts',
  'src/extension/content/main.ts'
]

paths.forEach(p => {
  const fullPath = path.resolve(projectRoot, p)
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing critical entry point: ${p}`)
    process.exit(1)
  }
})

console.log('✅ All entry points validated successfully')
