import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 720,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/scenarios.ts')) {
            return 'scenarios'
          }

          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react'
          }

          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-')) {
            return 'motion'
          }

          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }
        },
      },
    },
  },
})
