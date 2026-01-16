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
  const [loadingMore, setLoadingMore] = useState(false);

  const [nextPageToken, setNextPageToken] = useState(null);

  // -----------------------------
  // STATUS
  // -----------------------------
  const fetchStatus = async () => {
    const res = await getGmailStatus();
    setConnected(res);
    return res;
  };

  // -----------------------------
  // EMAIL LIST (INITIAL)
  // -----------------------------
  const fetchEmails = async () => {
    try {
      const res = await getGmailEmails();

      setEmails(res.emails || []);
      setNextPageToken(res.nextPageToken || null);

      return res.emails || [];
    } catch (err) {
      console.error("Failed to fetch emails", err);
      setEmails([]);
      setNextPageToken(null);
      return [];
    }
  };

  // -----------------------------
  // LOAD MORE (PAGINATION)
  // -----------------------------
  const loadMoreEmails = async () => {
    if (!nextPageToken || loadingMore) return;

    setLoadingMore(true);

    try {
      const res = await getGmailEmails(nextPageToken);

      setEmails((prev) => [...prev, ...(res.emails || [])]);
      setNextPageToken(res.nextPageToken || null);
    } catch (err) {
      console.error("Failed to load more emails", err);
    } finally {
      setLoadingMore(false);
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

      await markEmailRead(id);
    } catch (err) {
      console.error("Failed to open email", err);
    } finally {
      setLoadingEmail(false);
    }
  };

  const closeEmail = () => setActiveEmail(null);

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
    return () => (mounted = false);
  }, []);

  // -----------------------------
  // CONNECT
  // -----------------------------
  const connectGmail = async () => {
    const url = await getGmailAuthUrl();
    window.location.href = url;
  };

  // -----------------------------
  // CONTEXT
  // -----------------------------
  return (
    <GmailContext.Provider
      value={{
        connected,
        emails,
        activeEmail,
        loading,
        loadingEmail,
        loadingMore,

        fetchEmails,
        loadMoreEmails,
        openEmail,
        closeEmail,
        connectGmail,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
}
