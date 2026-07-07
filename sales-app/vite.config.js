import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Build de UN SOLO ARCHIVO: dist/index.html autocontenido (JS, CSS
// e imágenes inlineadas en base64). Permite abrir con doble clic
// (file://) y enviar por WhatsApp/email como un único archivo.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    assetsInlineLimit: 100_000_000, // inline TODO asset importado (capturas de la app incluidas)
  },
});
