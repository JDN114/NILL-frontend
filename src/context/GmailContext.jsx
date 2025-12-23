import React, { createContext, useEffect, useState } from "react";
import { getGmailAuthUrl, getGmailStatus, getGmailEmails } from "../services/api";

export const GmailContext = createContext();

export function GmailProvider({ children }) {
  const [connected, setConnected] = useState(null); // 👈 null = unknown
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    const res = await getGmailStatus();
    setConnected(res);
    return res;
  };

  const fetchEmails = async () => {
    const res = await getGmailEmails();
    setEmails(res);
  };

  // 🔁 AUTO-SYNC beim App-Start
  useEffect(() => {
    async function init() {
      try {
        const isConnected = await fetchStatus();
        if (isConnected) {
          await fetchEmails();
        }
      } catch (err) {
        setConnected(false);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const connectGmail = async () => {
    const url = await getGmailAuthUrl();
    window.location.href = url;
  };

  return (
    <GmailContext.Provider
      value={{
        connected,
        emails,
        loading,
        fetchStatus,
        fetchEmails,
        connectGmail,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
}
