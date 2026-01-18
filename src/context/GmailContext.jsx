// src/context/GmailContext.jsx
import React, { createContext, useEffect, useState } from "react";
import {
  getGmailAuthUrl,
  getGmailStatus,
  getGmailEmails,
  getGmailEmailDetail,
  markEmailRead,
} from "../services/api";

export const GmailContext = createContext(null);

export function GmailProvider({ children }) {
  // ---------------------------------
  // STATE
  // ---------------------------------
  const [connected, setConnected] = useState({
    connected: false,
    email: null,
    expired: null,
  });

  const [emails, setEmails] = useState([]); // Inbox
  const [sentEmails, setSentEmails] = useState([]); // Gesendet
  const [activeEmail, setActiveEmail] = useState(null);
  const [currentMailbox, setCurrentMailbox] = useState("INBOX"); // "INBOX" | "SENT"

  const [loading, setLoading] = useState(true);
  const [loadingEmail, setLoadingEmail] = useState(false);

  // ---------------------------------
  // STATUS
  // ---------------------------------
  const fetchStatus = async () => {
    try {
      const res = await getGmailStatus();

      const safeStatus = {
        connected: Boolean(res?.connected),
        email: res?.email ?? null,
        expired: res?.expired ?? null,
      };

      setConnected(safeStatus);
      return safeStatus;
    } catch (err) {
      console.error("Failed to fetch Gmail status:", err);
      const fallback = { connected: false, email: null, expired: null };
      setConnected(fallback);
      return fallback;
    }
  };

  // ---------------------------------
  // EMAIL LIST
  // ---------------------------------
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

  const fetchSentEmails = async () => {
    try {
      const res = await getGmailEmails("sent"); // optional: Backend anpassen
      const list = Array.isArray(res?.emails) ? res.emails : [];
      setSentEmails(list);
      return list;
    } catch (err) {
      console.error("Failed to fetch sent emails:", err);
      setSentEmails([]);
      return [];
    }
  };

  // ---------------------------------
  // EMAIL DETAIL
  // ---------------------------------
  const openEmail = async (id, mailbox = "INBOX") => {
    if (!id) return;

    setLoadingEmail(true);
    setCurrentMailbox(mailbox);

    try {
      const data = await getGmailEmailDetail(id, mailbox);
      setActiveEmail(data);

      // optional: read-mark nur für Inbox
      if (mailbox === "INBOX") {
        try {
          await markEmailRead(id);
        } catch {}
      }
    } catch (err) {
      console.error("Failed to open email:", err);
    } finally {
      setLoadingEmail(false);
    }
  };

  const closeEmail = () => setActiveEmail(null);

  // ---------------------------------
  // INIT (SEHR WICHTIG)
  // ---------------------------------
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
    return () => {
      mounted = false;
    };
  }, []);

  // ---------------------------------
  // CONNECT
  // ---------------------------------
  const connectGmail = async () => {
    try {
      const url = await getGmailAuthUrl();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Failed to start Gmail connect flow:", err);
    }
  };

  // ---------------------------------
  // CONTEXT EXPORT
  // ---------------------------------
  return (
    <GmailContext.Provider
      value={{
        // state
        connected,
        emails,
        sentEmails,
        activeEmail,
        currentMailbox,
        loading,
        loadingEmail,

        // actions
        fetchStatus,
        fetchEmails,
        fetchSentEmails,
        openEmail,
        closeEmail,
        connectGmail,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
}
