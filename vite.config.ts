// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/dealer-life-simulator/", // ✅ VERY IMPORTANT
  plugins: [react()],
});
