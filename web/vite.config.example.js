import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Update this base path for GitHub Pages
  // 
  // If your GitHub repo is: https://github.com/username/voluntry
  // Then use: base: '/voluntry/'
  //
  // If your GitHub repo is: https://github.com/username/username.github.io
  // Then use: base: '/'
  //
  // Replace 'voluntry' with your actual repository name
  base: '/voluntry/',  // ⬅️ CHANGE THIS to match your repo name!
})

