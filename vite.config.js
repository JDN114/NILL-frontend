import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode !== 'development' && VitePWA({
      // Eigene manifest.json in /public wird genutzt — kein doppeltes Generieren
      manifest: false,

      // Automatisches Update: neuer SW übernimmt sofort beim nächsten Seitenaufruf
      registerType: 'autoUpdate',

      // Statische Assets precachen (JS, CSS, Fonts, Icons)
      includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png', 'robots.txt', 'offline.html'],

      workbox: {
        // Alle build-Outputs precachen
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webp}'],

        // SPA-Routing: jeder Navigation-Request bekommt index.html aus dem Cache
        navigateFallback: '/index.html',

        // API- und Auth-Endpunkte NICHT durch den SW routen
        navigateFallbackDenylist: [/^\/api/, /^\/auth/, /^\/offline\.html/],

        // Runtime-Caching für Google Fonts
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),

  build: {
    outDir: '/var/www/nill-app',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
}))
