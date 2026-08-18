import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/Marketing-Landmark/',
  plugins: [react()],
  build: {
    // Client build
    outDir: 'dist/client',
    rollupOptions: {
      input: 'index.html',
    },
  },
  ssr: {
    // SSR entry point (for vite build --ssr)
    external: ['compression'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
