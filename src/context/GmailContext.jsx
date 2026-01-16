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

      /**
       * Erwartet:
       * {
       *   connected: boolean,
       *   email?: string,
       *   expired?: boolean
       * }
       */
      setConnected(res);
      return res;
    } catch (err) {
      console.error("Failed to fetch Gmail status", err);
      setConnected({ connected: false, email: null, expired: null });
      return null;
    }
  };

  // -----------------------------
  // EMAIL LIST
  // -----------------------------

  const fetchEmails = async () => {
    try {
      const res = await getGmailEmails();

      /**
       * Unterstützt:
       * - res = { emails: [...] }
       * - res = [...]
       */
      let list = [];

      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray(res?.emails)) {
        list = res.emails;
      }

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

      // automatisch als gelesen markieren
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
