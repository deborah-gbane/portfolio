import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/*
 * Politique de sécurité du contenu (CSP), injectée uniquement dans la version publiée
 * (le serveur de développement a besoin de scripts inline pour le rechargement à chaud).
 * GitHub Pages ne permet pas d'en-têtes HTTP personnalisés : la balise <meta> est donc
 * le seul moyen de l'appliquer. Tout est servi depuis le site lui-même ('self').
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = () => ({
  name: "security-meta",
  apply: "build",
  transformIndexHtml(html) {
    return html.replace(
      "<head>",
      `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />\n    <meta http-equiv="X-Content-Type-Options" content="nosniff" />`
    );
  },
});

export default defineConfig({
  base: "/portfolio/", // site publié sur https://deborah-gbane.github.io/portfolio/
  plugins: [react(), securityHeaders()],
  build: {
    sourcemap: false, // ne pas publier le code source non minifié
  },
});
