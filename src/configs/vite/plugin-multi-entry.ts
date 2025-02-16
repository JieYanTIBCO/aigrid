import type { Plugin } from 'vite'

export default function multiEntry(): Plugin {
  return {
    name: 'multi-entry',
    apply: 'build',
    configResolved(resolvedConfig) {
      const input = resolvedConfig.build.rollupOptions.input
      if (typeof input === 'string') {
        resolvedConfig.build.rollupOptions.input = [input]
      }
    }
  }
}
