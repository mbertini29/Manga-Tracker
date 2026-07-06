import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",

      devOptions: {
        enabled: true
      },
      
      manifest:{
        name: "Manga Tracker",
        short_name: "MangaTracker",
        scope:"/",
        start_url:"/",
        display:"standalone",
        icons:[
          {
            src:"/icon-512x512.png",
            sizes: "512x512",
            type:"image/png",
            purpose:"any"
          },
          {
            src:"/icon-192x192.png",
            sizes: "192x192",
            type:"image/png"
          }
        ]
      },
    })
  ]
})