import { defineConfig } from "@solidjs/start/config";


export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        source: false,
      },
    },
  },
  resolve: {
    alias: {
      '~': '/src',
    },
  },
  ssr: false,
});
