import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local dev proxy for Model 1 (Disease)
      '/api/v1/disease/predict': {
        target: 'http://3.227.14.235',
        changeOrigin: true,
        secure: false,
      },
      // Local dev proxy for Model 2 (Pest)
      '/api/pest/predict': {
        target: 'http://3.227.14.235',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  base: './', // Ensures assets are loaded with relative paths
})
