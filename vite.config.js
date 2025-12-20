import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",               // Root für Vite
  base: "/",               // relative Pfade
  publicDir: "public",     // statische Assets
  build: {
    outDir: "dist",        // Output für Produktion
    emptyOutDir: true,
  },
});
