import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js suite — large 3D libs only needed on landing page
          if (id.includes('three') || id.includes('@react-three')) {
            return 'vendor-three'
          }
          // Recharts + d3 — only needed in accounting/dashboard
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'vendor-charts'
          }
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          // React Router
          if (id.includes('react-router')) {
            return 'vendor-router'
          }
          // Framer Motion
          if (id.includes('framer-motion')) {
            return 'vendor-motion'
          }
          // All other node_modules
          if (id.includes('node_modules')) {
            return 'vendor-misc'
          }
        },
      },
    },
  },
}))
