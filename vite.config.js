import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main:     r('./index.html'),
        services: r('./services/index.html'),
        builds:   r('./builds/index.html'),
        gallery:  r('./gallery/index.html'),
        notes:    r('./notes/index.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
