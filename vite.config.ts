import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
/* import { viteSingleFile } from "vite-plugin-singlefile" */

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        dir: './dist/',
        entryFileNames: 'script.js',
        assetFileNames: 'style.css',
      }
    }
  }
})
