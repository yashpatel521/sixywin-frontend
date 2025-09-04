import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Casino-style fonts
import { fontUrls } from "@/libs/fonts";
import '@fontsource/walter-turncoat';
import '@fontsource/shadows-into-light';
import '@fontsource/irish-grover';
import '@fontsource/pacifico';

// Add font stylesheets to document head
fontUrls.forEach(url => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
