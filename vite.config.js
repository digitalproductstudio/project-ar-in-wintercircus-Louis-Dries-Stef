import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/project-ar-in-wintercircus-Louis-Dries-Stef/",
  build: {
    outDir: "docs",
  },
});