import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/disease/predict': {
        target: 'http://3.88.159.225:8001',
        changeOrigin: true
      },
      '/api/pest/predict': {
        target: 'http://3.88.159.225:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pest\/predict/, '/predict')
      }
    }
  }
})
