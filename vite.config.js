import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '10b3d773fa29.ngrok-free.app',
      
    ]
  },
})
