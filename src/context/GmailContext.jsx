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
  const [currentMailbox, setCurrentMailbox] = useState("inbox"); // inbox | sent

  const [loading, setLoading] = useState(true);
  const [loadingEmail, setLoadingEmail] = useState(false);

  // ---------------------------------
  // STATUS
  // ---------------------------------
  const fetchStatus = async () => {
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
  };

  // ---------------------------------
  // EMAIL LISTS
  // ---------------------------------
  const fetchInboxEmails = async () => {
    try {
      const res = await getGmailEmails("inbox");
      setEmails(res.emails || []);
    } catch {
      setEmails([]);
    }
  };

  const fetchSentEmails = async () => {
    try {
      const res = await getGmailEmails("sent");
      setSentEmails(res.emails || []);
    } catch {
      setSentEmails([]);
    }
  };

  // ---------------------------------
  // EMAIL DETAIL
  // ---------------------------------
  const openEmail = async (id, mailbox = "inbox") => {
    if (!id) return;
    setLoadingEmail(true);
    setCurrentMailbox(mailbox);

    try {
      const data = await getGmailEmailDetail(id);
      setActiveEmail(data);

      // optional: read-mark nur für Inbox
      if (mailbox === "inbox") {
        try {
          await markEmailRead(id);
        } catch {}
      }
    } finally {
      setLoadingEmail(false);
    }
  };

  const closeEmail = () => setActiveEmail(null);

  // ---------------------------------
  // INIT (nur einmal beim Mount)
  // ---------------------------------
  useEffect(() => {
    let mounted = true;

    async function init() {
      const status = await fetchStatus();
      if (mounted && status.connected) {
        await fetchInboxEmails();
      }
      if (mounted) setLoading(false);
    }

    init();
    return () => (mounted = false);
  }, []);

  // ---------------------------------
  // CONNECT
  // ---------------------------------
  const connectGmail = async () => {
    const url = await getGmailAuthUrl();
    if (url) window.location.href = url;
  };

  // ---------------------------------
  // CONTEXT EXPORT
  // ---------------------------------
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

        fetchInboxEmails,
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
