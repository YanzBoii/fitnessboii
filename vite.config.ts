import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { VitePWA } from 'vite-plugin-pwa';

// `npm run preview` sert les mêmes en-têtes de sécurité que Netlify (netlify.toml) pour tester la CSP en local.
const netlifyHeaders = Object.fromEntries(
  [...readFileSync('netlify.toml', 'utf8').split('[[headers]]')[1].matchAll(/^\s+([\w-]+) = "(.*)"$/gm)]
    .filter(m => m[1] !== 'for')
    // En local (http), pas de upgrade-insecure-requests.
    .map(m => [m[1], m[2].replace('; upgrade-insecure-requests', '')])
);

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'FitnessBoii',
        short_name: 'FitnessBoii',
        description: 'Tes programmes, tes perfs et ta régularité au même endroit.',
        lang: 'fr',
        start_url: '/',
        display: 'standalone',
        background_color: '#0c080a',
        theme_color: '#0c080a',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  preview: { headers: netlifyHeaders },
  build: { chunkSizeWarningLimit: 1000 },
  test: { environment: 'node' }
});
