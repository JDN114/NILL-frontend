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

  const [loading, setLoading] = useState(true);        // initial sync
  const [loadingEmail, setLoadingEmail] = useState(false); // detail view

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
    setEmails(res);
    return res;
  };

  /* -----------------------------
     EMAIL DETAIL
  ----------------------------- */

  const openEmail = async (id) => {
    setLoadingEmail(true);
    try {
      const data = await getGmailEmailDetail(id);
      setActiveEmail(data);
    } catch (err) {
      console.error("Failed to load email", err);
    } finally {
      setLoadingEmail(false);
    }
  };

  const closeEmail = () => {
    setActiveEmail(null);
  };

  const markAsRead = async (id) => {
    try {
      await markEmailRead(id);

      // UI sofort aktualisieren
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

  /* -----------------------------
     CONTEXT EXPORT
  ----------------------------- */

  return (
    <GmailContext.Provider
      value={{
        // state
        connected,
        emails,
        activeEmail,
        loading,
        loadingEmail,

        // actions
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
