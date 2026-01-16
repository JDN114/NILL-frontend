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
  // -----------------------------
  // STATE
  // -----------------------------

  /**
   * connected ist IMMER ein Objekt:
   * {
   *   connected: boolean,
   *   email?: string,
   *   expired?: boolean
   * }
   */
  const [connected, setConnected] = useState({
    connected: false,
    email: null,
    expired: null,
  });

  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingEmail, setLoadingEmail] = useState(false);

  // -----------------------------
  // STATUS
  // -----------------------------

  const fetchStatus = async () => {
    try {
      const res = await getGmailStatus();

      // 🔒 harte Absicherung gegen kaputte Responses
      const safeStatus = {
        connected: Boolean(res?.connected),
        email: res?.email ?? null,
        expired: res?.expired ?? null,
      };

      setConnected(safeStatus);
      return safeStatus;
    } catch (err) {
      console.error("Failed to fetch Gmail status", err);

      const fallback = {
        connected: false,
        email: null,
        expired: null,
      };

      setConnected(fallback);
      return fallback;
    }
  };

  // -----------------------------
  // EMAIL LIST
  // -----------------------------

  const fetchEmails = async () => {
    try {
      const res = await getGmailEmails();

      // API liefert { emails: [...] }
      const list = Array.isArray(res?.emails) ? res.emails : [];

      setEmails(list);
      return list;
    } catch (err) {
      console.error("Failed to fetch Gmail emails", err);
      setEmails([]);
      return [];
    }
  };

  // -----------------------------
  // EMAIL DETAIL
  // -----------------------------

  const openEmail = async (id) => {
    if (!id) return;

    setLoadingEmail(true);

    try {
      const data = await getGmailEmailDetail(id);
      setActiveEmail(data);

      // optional: automatisch als gelesen markieren
      await markEmailRead(id);

      setEmails((prev) =>
        prev.map((mail) =>
          mail.id === id ? { ...mail, unread: false } : mail
        )
      );
    } catch (err) {
      console.error("Failed to open email", err);
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
      setEmails((prev) =>
        prev.map((mail) =>
          mail.id === id ? { ...mail, unread: false } : mail
        )
      );
    } catch (err) {
      console.error("Failed to mark email as read", err);
    }
  };

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const status = await fetchStatus();

        if (mounted && status?.connected) {
          await fetchEmails();
        }
      } catch (err) {
        console.error("Gmail init failed", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // -----------------------------
  // CONNECT FLOW
  // -----------------------------

  const connectGmail = async () => {
    try {
      const url = await getGmailAuthUrl();
      window.location.href = url;
    } catch (err) {
      console.error("Failed to start Gmail connect flow", err);
    }
  };

  // -----------------------------
  // CONTEXT EXPORT
  // -----------------------------

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
