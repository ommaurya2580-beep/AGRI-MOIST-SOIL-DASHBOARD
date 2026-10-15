import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Local dev proxy for Model 1 (Disease)
      '/api/v1/disease/predict': {
        target: 'http://16.192.162.67',
        changeOrigin: true,
        secure: false,
      },
      // Local dev proxy for Model 2 (Pest)
      '/api/pest/predict': {
        target: 'http://13.50.81.200',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pest\/predict/, '/api/pest/predict')
      }
    }
  },
  base: './', // Ensures assets are loaded with relative paths
})
