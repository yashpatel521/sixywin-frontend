import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  publicDir: "public", // Ensure public directory is served
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Disable sourcemaps for production
    assetsDir: "assets",
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    copyPublicDir: true, // Explicitly copy public directory
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["lucide-react"],
          // Feature chunks
          auth: ["./src/pages/Login.tsx", "./src/pages/Register.tsx"],
          games: [
            "./src/pages/PlayLottery.tsx",
            "./src/pages/DoubleTrouble.tsx",
          ],
          landing: ["./src/pages/Landing.tsx"],
          // Utility chunks
          utils: ["./src/lib/utils.ts", "./src/lib/constants.ts"],
          websocket: ["./src/websocket/index.ts"],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
