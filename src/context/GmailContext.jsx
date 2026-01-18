// src/context/GmailContext.jsx
import React, { createContext, useEffect, useState } from "react";
import {
  getGmailAuthUrl,
  getGmailStatus,
  getGmailEmails,
  getGmailEmailDetail,
  markEmailRead,
} from "../services/api";

export const GmailContext = createContext({
  connected: { connected: false, email: null, expired: null },
  emails: [],
  activeEmail: null,
  loading: true,
  loadingEmail: false,
  fetchStatus: async () => {},
  fetchEmails: async () => [],
  openEmail: async () => {},
  closeEmail: () => {},
  connectGmail: async () => {},
});

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

      const safeStatus = {
        connected: !!res?.connected,
        email: res?.email ?? null,
        expired: res?.expired ?? null,
      };

      setConnected(safeStatus);
      return safeStatus;
    } catch (err) {
      console.error("[Gmail] status failed", err);
      const fallback = { connected: false, email: null, expired: null };
      setConnected(fallback);
      return fallback;
    }
  };

  // -----------------------------
  // EMAIL LIST
  // -----------------------------
const fetchEmails = async () => {
  try {
    const list = await getGmailEmails(); // ⬅️ ist bereits ein Array
    setEmails(Array.isArray(list) ? list : []);
    return list;
  } catch (err) {
    console.error("Failed to fetch emails:", err);
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

      // optional read
      try {
        await markEmailRead(id);
      } catch {}
    } catch (err) {
      console.error("[Gmail] open email failed", err);
    } finally {
      setLoadingEmail(false);
    }
  };

  const closeEmail = () => setActiveEmail(null);

  // -----------------------------
  // CONNECT
  // -----------------------------
  const connectGmail = async () => {
    try {
      const url = await getGmailAuthUrl();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("[Gmail] connect failed", err);
    }
  };

  // -----------------------------
  // INIT
  // -----------------------------
useEffect(() => {
  let mounted = true;

  const init = async () => {
    try {
      const status = await fetchStatus();

      if (!mounted) return;

      if (status.connected) {
        await fetchEmails();

        // 🔁 Retry nach OAuth / Sync
        setTimeout(() => {
          if (mounted) fetchEmails();
        }, 3000);
      }
    } finally {
      if (mounted) setLoading(false);
    }
  };

  init();
  return () => (mounted = false);
}, []);

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
        fetchStatus,
        fetchEmails,
        openEmail,
        closeEmail,
        connectGmail,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
}
