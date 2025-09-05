import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
  root: "src/client",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../../dist/client",
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://energy-stack-api.onrender.com",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
     "@": path.resolve(__dirname, "./src/client"), 
    },
  },
});

