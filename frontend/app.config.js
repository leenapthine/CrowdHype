import { defineConfig } from "@solidjs/start/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000',
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
  ssr: true,
  build: {
    rollupOptions: {
      input: {
        ssr: "src/entry-server.tsx",
      },
    },
  },
});
