// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/project-ar-in-wintercircus-Louis-Dries-Stef/", // e.g. /my-cool-app/
  plugins: [react()],
});
