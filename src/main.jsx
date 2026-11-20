import React from "react";

// Anti-clickjacking : le site refuse d'être affiché dans le cadre d'une autre page.
if (window.top !== window.self) {
  try { window.top.location.href = window.self.location.href; }
  catch { document.documentElement.style.display = "none"; }
}

import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { LangProvider } from "./i18n.jsx";
import { MotionProvider } from "./motion.jsx";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LangProvider>
      <MotionProvider>
        <App />
      </MotionProvider>
    </LangProvider>
  </React.StrictMode>
);
