import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Replace with your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
