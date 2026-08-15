import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/disease/predict': {
        target: 'http://3.235.152.171',
        changeOrigin: true
      },
      '/api/pest/predict': {
        target: 'http://3.235.152.171',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pest\/predict/, '/api/pest/predict')
      }
    }
  }
})
