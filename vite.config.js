import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server : {
    port: 8080,
    host: '0.0.0.0',
    hmr: true,
    proxy: {
      "/api/": {
        target: "http://localhost:7090/",
        changeOrigin: true,
        pathRewrite: {
          "^/api/":"/api/"
        }
      }
    }
  }
})
