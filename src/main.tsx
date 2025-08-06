import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Additional error boundary for external script errors
window.addEventListener(
  "error",
  (event) => {
    // Suppress errors from external scripts that we don't control
    if (
      event.filename &&
      (event.filename.includes("share-modal") ||
        event.filename.includes("extension") ||
        event.filename.includes("chrome-extension") ||
        event.filename.includes("moz-extension"))
    ) {
      console.warn("External script error suppressed:", event.message);
      event.preventDefault();
      return true;
    }
  },
  true
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
