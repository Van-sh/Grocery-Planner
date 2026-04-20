import babelPlugin from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babelPlugin({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
  ],
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
