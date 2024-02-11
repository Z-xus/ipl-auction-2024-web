import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vercel from 'vite-plugin-vercel';

export default defineConfig({
  plugins: [react(), vercel()],
  vercel: {},
})