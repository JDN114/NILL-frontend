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
  const [connected, setConnected] = useState(null); // null = unknown
  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);

  const [loading, setLoading] = useState(true); // initial sync
  const [loadingEmail, setLoadingEmail] = useState(false); // detail view

  /* -----------------------------
     STATUS + LIST
  ----------------------------- */

  const fetchStatus = async () => {
    try {
      const res = await getGmailStatus();
      setConnected(res?.connected ?? false);
      return res;
    } catch (err) {
      console.error("Failed to fetch Gmail status", err);
      setConnected(false);
      return { connected: false };
    }
  };

  const fetchEmails = async () => {
    try {
      const res = await getGmailEmails();
      setEmails(res?.emails ?? []);
      return res;
    } catch (err) {
      console.error("Failed to fetch Gmail emails", err);
      setEmails([]);
      return { emails: [] };
    }
  };

  /* -----------------------------
     EMAIL DETAIL + AUTO MARK AS READ
  ----------------------------- */

  const openEmail = async (id) => {
    if (!id) return;
    setLoadingEmail(true);

    try {
      const data = await getGmailEmailDetail(id);
      setActiveEmail(data ?? null);

      // automatisch als gelesen markieren
      await markEmailRead(id);

      // UI sofort aktualisieren (Inbox)
      setEmails((prev) =>
        prev.map((mail) =>
          mail.id === id ? { ...mail, unread: false } : mail
        )
      );
    } catch (err) {
      console.error("Failed to load email", err);
      setActiveEmail(null);
    } finally {
      setLoadingEmail(false);
    }
  };

  const closeEmail = () => setActiveEmail(null);

  const markAsRead = async (id) => {
    try {
      await markEmailRead(id);
      setEmails((prev) =>
        prev.map((mail) =>
          mail.id === id ? { ...mail, unread: false } : mail
        )
      );
    } catch (err) {
      console.error("Failed to mark email as read", err);
    }
  };

  /* -----------------------------
     INITIAL AUTO-SYNC
  ----------------------------- */

  useEffect(() => {
    async function init() {
      try {
        const status = await fetchStatus();
        if (status?.connected) {
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
    try {
      const url = await getGmailAuthUrl();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Failed to get Gmail auth URL", err);
    }
  };

  /* -----------------------------
     CONTEXT EXPORT
  ----------------------------- */

  return (
    <GmailContext.Provider
      value={{
        connected,
        emails,
        activeEmail,
        loading,
        loadingEmail,
        fetchStatus,
        fetchEmails,
        openEmail,
        closeEmail,
        connectGmail,
        markAsRead,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
}
