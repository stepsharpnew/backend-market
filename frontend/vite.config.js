import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Пример: перенаправить API-запросы
      '/api': {
        target: 'http://backend:5000',
        // target : 'http://51.250.88.173',
        //  target : 'http://localhost:5000',

        changeOrigin: true, 
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});