import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VITE_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Eat Your Veggies',
        description:
          'Embrace a healthier lifestyle by eating at least 30 different veggies each week. Track your progress for free with Eat Your Veggies.',
        orientation: 'portrait',
        dir: 'ltr',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        theme_color: '#0ea5e9',
        background_color: '#0ea5e9',
        categories: ['food', 'health', 'lifestyle'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          chartJS: [
            'chart.js',
            'chartjs-plugin-annotation',
            'chartjs-plugin-datalabels',
            'vue-chartjs',
            '@/components/ChartScreenReaderTable.vue',
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  preview: {
    port: 5173,
  },
  base: '/veggies',
});
