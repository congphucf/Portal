import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3600,
  },
  plugins: [
    vue(),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: [
      'vue',
    ],
  },
});
