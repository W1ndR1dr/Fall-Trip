import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Relative base: the app is served from https://<user>.github.io/Fall-Trip/
// and routes live in the hash, so the document is always ./index.html.
const built = new Date().toISOString();

export default defineConfig({
  base: './',
  define: {
    __BUILD_TIME__: JSON.stringify(built),
    __BUILD_ID__: JSON.stringify(createHash('sha1').update(built).digest('hex').slice(0, 10)),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['robots.txt', 'icons/*.png', 'icons/*.svg'],
      manifest: {
        id: './',
        name: 'Fall Trip',
        short_name: 'Fall Trip',
        description: 'Our Eastern Sierra fall color weekend.',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: '#f4eee5',
        theme_color: '#f4eee5',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the whole app: every screen must work in Airplane Mode.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,webp,jpg,json,txt,webmanifest}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        cacheId: 'fall-trip',
      },
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // The main chunk is React + Motion + Vaul (~160 KB gzip), precached once.
  build: { target: 'es2022', assetsInlineLimit: 0, sourcemap: false, chunkSizeWarningLimit: 700 },
});
