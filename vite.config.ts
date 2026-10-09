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

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'FitnessBoii',
        short_name: 'FitnessBoii',
        description: 'Tes programmes, tes perfs et ta régularité au même endroit.',
        lang: 'fr',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['health', 'fitness', 'sports'],
        background_color: '#0c080a',
        theme_color: '#0c080a',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        // Affichées dans la fenêtre d'installation (Android, Chrome/Edge desktop).
        screenshots: [
          { src: 'screenshots/phone-home-dark.png', sizes: '1170x2532', type: 'image/png', form_factor: 'narrow', label: 'Accueil : séance du jour, série et présence' },
          { src: 'screenshots/phone-session-dark.png', sizes: '1170x2532', type: 'image/png', form_factor: 'narrow', label: 'Séance guidée, un exercice à la fois' },
          { src: 'screenshots/desktop-home-dark.png', sizes: '2880x1800', type: 'image/png', form_factor: 'wide', label: 'Tableau de bord sur ordinateur' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Captures du manifeste : téléchargées seulement par la fenêtre d'installation, pas mises en cache.
        globIgnores: ['screenshots/**'],
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
  // En mode émulateur, la CSP de prod bloquerait 127.0.0.1 : pas d'en-têtes.
  preview: { headers: mode === 'emulator' ? {} : netlifyHeaders },
  build: { chunkSizeWarningLimit: 1000 },
  test: { environment: 'node' }
}));
