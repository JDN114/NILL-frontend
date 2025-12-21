import React, { createContext, useState } from "react";
import { getGmailAuthUrl, getGmailStatus, getGmailEmails } from "../services/api";

export const GmailContext = createContext();

export function GmailProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [emails, setEmails] = useState([]);

  const fetchStatus = async () => setConnected(await getGmailStatus());
  const fetchEmails = async () => setEmails(await getGmailEmails());
  const connectGmail = async () => {
    const url = await getGmailAuthUrl();
    window.location.href = url; // OAuth Flow starten
  };

  return (
    <GmailContext.Provider value={{ connected, emails, fetchStatus, fetchEmails, connectGmail }}>
      {children}
    </GmailContext.Provider>
  );
}
