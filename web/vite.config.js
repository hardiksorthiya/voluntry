import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// For local dev: base is '/' (default)
// For GitHub Pages: set VITE_BASE_PATH=/voluntry/ when building
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
