import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { GmailProvider } from "./context/GmailContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <GmailProvider>
        <App />
      </GmailProvider>
    </AuthProvider>
  </React.StrictMode>
);
