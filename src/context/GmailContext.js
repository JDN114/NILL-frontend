// src/context/GmailContext.js (oder services/api.js nutzen)
import { createContext, useState } from "react";
import { getGmailAuthUrl } from "../services/api";

export const GmailContext = createContext();

export const GmailProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [emails, setEmails] = useState([]);

  const connectGmail = async () => {
    try {
      // Auth URL vom Backend holen
      const auth_url = await getGmailAuthUrl();
      if (!auth_url) throw new Error("Keine Auth-URL erhalten");

      // Redirect zu Google
      window.location.href = auth_url;
    } catch (error) {
      console.error("Gmail connect error:", error);
      alert(
        "Fehler beim Verbinden mit Gmail. Bitte prüfen Sie, ob Sie eingeloggt sind."
      );
    }
  };

  const fetchStatus = async () => {
    // Hier könntest du API call für /gmail/status machen
    // setConnected(true/false)
  };

  const fetchEmails = async () => {
    // Hier könntest du API call für /gmail/emails machen
    // setEmails([...])
  };

  return (
    <GmailContext.Provider
      value={{ connected, emails, connectGmail, fetchStatus, fetchEmails }}
    >
      {children}
    </GmailContext.Provider>
  );
};
