import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy SFD realtime page to avoid CORS in development
      '/sfd-realtime': {
        target: 'https://web.seattle.gov',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/sfd-realtime/, '/sfd/realtime911'),
      },
    },
  },
})
