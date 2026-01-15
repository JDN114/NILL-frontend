import React, { createContext, useEffect, useState } from "react";
import {
  getGmailAuthUrl,
  getGmailStatus,
  getGmailEmails,
  getGmailEmailDetail,
  markEmailRead,
} from "../services/api";

export const GmailContext = createContext();

export function GmailProvider({ children }) {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -----------------------------
     STATUS + LIST
  ----------------------------- */
  const fetchStatus = async () => {
    const res = await getGmailStatus();
    setConnected(res);
    return res;
  };

  const fetchEmails = async () => {
    const res = await getGmailEmails();
    console.log("📬 Gmail Emails aus API:", res);
    setEmails(res);
    return res;
  };

  /* -----------------------------
     EMAIL DETAIL + AUTO MARK AS READ
  ----------------------------- */
  const openEmail = async (id) => {
    if (!id) return;

    try {
      const data = await getGmailEmailDetail(id);
      setActiveEmail(data);
      await markEmailRead(id);

      setEmails((prev) =>
        prev.map((mail) => (mail.id === id ? { ...mail, unread: false } : mail))
      );
    } catch (err) {
      console.error("Failed to load email", err);
    }
  };

  const closeEmail = () => setActiveEmail(null);

  /* -----------------------------
     INITIAL AUTO-SYNC
  ----------------------------- */
  useEffect(() => {
    async function init() {
      try {
        const isConnected = await fetchStatus();
        if (isConnected) {
          await fetchEmails();
        }
      } catch (err) {
        console.error("Gmail init failed", err);
        setConnected(false);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  /* -----------------------------
     CONNECT FLOW
  ----------------------------- */
  const connectGmail = async () => {
    const url = await getGmailAuthUrl();
    window.location.href = url;
  };

  return (
    <GmailContext.Provider
      value={{
        connected,
        emails,
        activeEmail,
        loading,
        openEmail,
        closeEmail,
        connectGmail,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
}
