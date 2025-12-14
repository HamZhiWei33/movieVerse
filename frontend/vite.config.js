import { defineConfig } from "vite";
import dotenv from "dotenv";
import react from "@vitejs/plugin-react";

dotenv.config()

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      "/api": {
        target: process.env.BACKEND_TARGET || "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
