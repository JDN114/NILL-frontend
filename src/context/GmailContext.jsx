// src/context/GmailContext.jsx
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
      // API gibt Boolean zurück
      const connectedBool = await getGmailStatus();

      const statusObj = {
        connected: connectedBool,
        email: null,
        expired: false,
      };

      setConnected(statusObj);
      return statusObj;
    } catch (err) {
      console.error("Failed to fetch Gmail status:", err);
      const fallback = { connected: false, email: null, expired: null };
      setConnected(fallback);
      return fallback;
    }
  };

  // -----------------------------
  // EMAIL LIST (kein Pagination)
  // -----------------------------
  const fetchEmails = async () => {
    try {
      const res = await getGmailEmails();
      const list = Array.isArray(res?.emails) ? res.emails : [];
      setEmails(list);
      return list;
    } catch (err) {
      console.error("Failed to fetch emails:", err);
      setEmails([]);
      return [];
    }
  };

  // ❗ No-Op, damit Consumer nicht crashen
  const loadMoreEmails = async () => {
    console.warn("loadMoreEmails is disabled (pagination off)");
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
      await markEmailRead(id);
    } catch (err) {
      console.error("Failed to open email:", err);
    } finally {
      setLoadingEmail(false);
    }
  };

  const closeEmail = () => setActiveEmail(null);

  // -----------------------------
  // INIT
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
        console.error("Gmail init failed:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();
    return () => (mounted = false);
  }, []);

  // -----------------------------
  // CONNECT
  // -----------------------------
  const connectGmail = async () => {
    try {
      const url = await getGmailAuthUrl();
      window.location.href = url;
    } catch (err) {
      console.error("Failed to start Gmail connect flow:", err);
    }
  };

  // -----------------------------
  // CONTEXT EXPORT
  // -----------------------------
  return (
    <GmailContext.Provider
      value={{
        connected,
        emails,
        activeEmail,
        loading,
        loadingEmail,

        fetchEmails,
        loadMoreEmails, // 🔥 bleibt drin, No-Op
        openEmail,
        closeEmail,
        connectGmail,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
}
