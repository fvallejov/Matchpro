import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Build de UN SOLO ARCHIVO: dist/index.html autocontenido (JS, CSS
// e imágenes inlineados). Permite abrir la página con doble clic
// (file://) en cualquier navegador — los browsers Chromium bloquean
// módulos JS externos desde archivos locales.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile()],
});
