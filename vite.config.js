import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [
    tailwindcss(),
    ViteImageOptimizer({
      jpg: { quality: 82, mozjpeg: true },
      jpeg: { quality: 82, mozjpeg: true },
      png: { quality: 82, compressionLevel: 9 },
      webp: { quality: 82 },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main:     r('./index.html'),
        services: r('./services/index.html'),
        builds:   r('./builds/index.html'),
        gallery:  r('./gallery/index.html'),
        notes:    r('./notes/index.html'),
        linkedinCallback: r('./linkedin/callback/index.html'),
        notFound: r('./404.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
