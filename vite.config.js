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
      '046773c6fc0e.ngrok-free.app'

    ]
  },
})
