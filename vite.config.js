import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', 
  server: {
    host: '0.0.0.0', 
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          utils: ['yup', 'react-toastify'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  preview: {
    host: '0.0.0.0', 
    port: process.env.PORT || 8080, 
    allowedHosts: ['ideark-proyecto.onrender.com'], 
    open: false, 
  },
});
