import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { LangProvider } from "./i18n.jsx";
import { MotionProvider } from "./motion.jsx";
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
