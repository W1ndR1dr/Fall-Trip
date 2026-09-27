import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import type { Plugin } from 'vite';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Relative base: the app is served from https://<user>.github.io/Fall-Trip/
// and routes live in the hash, so the document is always ./index.html.
const built = new Date().toISOString();

// Preload the two fonts every screen paints with first (Inter UI, Newsreader
// roman titles), so a cold start doesn't paint fallbacks and reflow.
function preloadFonts(): Plugin {
  const want = [/inter-latin-opsz-normal.*\.woff2$/, /newsreader-latin-opsz-normal.*\.woff2$/];
  return {
    name: 'fall-trip:preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) => want.some((re) => re.test(f)));
        return files.map((f) => ({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: './' + f, crossorigin: '' }, injectTo: 'head' as const }));
      },
    },
  };
}

export default defineConfig({
  base: './',
  define: {
    __BUILD_TIME__: JSON.stringify(built),
    __BUILD_ID__: JSON.stringify(createHash('sha1').update(built).digest('hex').slice(0, 10)),
  },
  plugins: [
    react(),
    tailwindcss(),
    preloadFonts(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      // The globs below already cover the icons; don't list them twice.
      includeManifestIcons: false,
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
        // (public/ files are covered by these globs; no includeAssets needed.)
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,webp,jpg,json,txt}'], // the plugin adds the manifest itself
        // The review-only kit (#/_kit) still loads online, but isn't precached.
        globIgnores: ['**/Kit-*.js'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        cacheId: 'fall-trip',
      },
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // The main chunk is React + Motion + the shell; Vaul loads with the sheet.
  build: { target: 'es2022', assetsInlineLimit: 0, sourcemap: false, chunkSizeWarningLimit: 700 },
});
