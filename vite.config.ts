import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Big libraries go into their own files ("chunks"). They change less often than our code,
 * so browsers keep them cached between deploys.
 */
const VENDOR_CHUNKS: Record<string, RegExp> = {
  react: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
  heroui: /[\\/]node_modules[\\/](@heroui|@react-aria|@react-stately|@internationalized)[\\/]/,
  motion: /[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
  forms: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    // HeroUI is large on its own; this only hides the size warning.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          return Object.keys(VENDOR_CHUNKS).find((name) => VENDOR_CHUNKS[name].test(id))
        },
      },
      onwarn(warning, warn) {
        // A harmless comment warning from inside zod (node_modules), not our code.
        if (warning.code === 'INVALID_ANNOTATION' && warning.id?.includes('node_modules')) return
        warn(warning)
      },
    },
  },
})
