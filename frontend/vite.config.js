// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'], // ✅ Avoid hook mismatch
  },
  server: {
    proxy: {
      // 🔐 Auth Service (Port 8081)
      '/api/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/auth/, '/api/auth'),
      },
      // 📦 Inventory Service (Port 8082)
      '/api/inventory': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/inventory/, '/api/inventory'),
      },
    },
  },
});
