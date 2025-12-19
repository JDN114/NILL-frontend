import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { GmailProvider } from "./context/GmailContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <GmailProvider>
      <App />
    </GmailProvider>
  </AuthProvider>
);
