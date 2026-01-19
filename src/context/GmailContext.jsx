// src/context/GmailContext.jsx
import React, { createContext, useEffect, useState, useCallback } from "react";
import {
  getGmailAuthUrl,
  getGmailStatus,
  getGmailEmails,
  getGmailEmailDetail,
  markEmailRead,
} from "../services/api";

export const GmailContext = createContext(null);

export function GmailProvider({ children }) {
  const [connected, setConnected] = useState({
    connected: false,
    email: null,
    expired: null,
  });

  const [emails, setEmails] = useState([]);       // Inbox
  const [sentEmails, setSentEmails] = useState([]); // Sent
  const [activeEmail, setActiveEmail] = useState(null);
  const [currentMailbox, setCurrentMailbox] = useState("inbox");

  const [loading, setLoading] = useState(true);
  const [loadingEmail, setLoadingEmail] = useState(false);

  // ----------------------------
  // Gmail Status
  // ----------------------------
  const fetchStatus = useCallback(async () => {
    try {
      const res = await getGmailStatus();
      const safe = {
        connected: Boolean(res?.connected),
        email: res?.email ?? null,
        expired: res?.expired ?? null,
      };
      setConnected(safe);
      return safe;
    } catch {
      const fallback = { connected: false, email: null, expired: null };
      setConnected(fallback);
      return fallback;
    }
  }, []);

  // ----------------------------
  // Emails fetch (caching)
  // ----------------------------
  const fetchEmails = useCallback(
    async (mailbox = "inbox") => {
      if (mailbox === "inbox" && emails.length > 0) return emails;
      if (mailbox === "sent" && sentEmails.length > 0) return sentEmails;

      try {
        const res = await getGmailEmails(mailbox);
        if (mailbox === "inbox") setEmails(res.emails || []);
        else setSentEmails(res.emails || []);
        return res.emails || [];
      } catch (err) {
        console.error(`Failed to fetch ${mailbox} emails:`, err);
        return [];
      }
    },
    [emails, sentEmails]
  );

  // ----------------------------
  // Email Detail
  // ----------------------------
const openEmail = useCallback(
  async (id, mailbox = "inbox") => {
    if (!id) return;
    setLoadingEmail(true);
    setCurrentMailbox(mailbox);

    try {
      // Mailbox mitgeben, damit Backend die richtige Email findet
      const data = await getGmailEmailDetail(id, mailbox);
      setActiveEmail(data);

      // Nur bei Inbox als gelesen markieren
      if (mailbox === "inbox") {
        try {
          await markEmailRead(id);
        } catch {}
      }
    } catch (err) {
      console.error("Failed to open email detail:", err);
    } finally {
      setLoadingEmail(false);
    }
  },
  []
);

  // ----------------------------
  // Init
  // ----------------------------
  useEffect(() => {
    let mounted = true;

    async function init() {
      const status = await fetchStatus();

      if (mounted && status.connected) {
        // Lade Inbox + Sent parallel (Performance)
        await Promise.all([fetchEmails("inbox"), fetchEmails("sent")]);
      }

      if (mounted) setLoading(false);
    }

    init();
    return () => (mounted = false);
  }, [fetchStatus, fetchEmails]);

  // ----------------------------
  // Connect Gmail
  // ----------------------------
  const connectGmail = async () => {
    try {
      const url = await getGmailAuthUrl();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Failed to start Gmail connect flow:", err);
    }
  };

  // ----------------------------
  // Context Value
  // ----------------------------
  return (
    <GmailContext.Provider
      value={{
        connected,
        emails,
        sentEmails,
        activeEmail,
        currentMailbox,
        loading,
        loadingEmail,

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
