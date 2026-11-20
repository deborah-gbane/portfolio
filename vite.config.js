import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/portfolio/", // site publié sur https://deborah-gbane.github.io/portfolio/
  plugins: [react()],
});
