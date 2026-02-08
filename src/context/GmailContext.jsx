// src/context/GmailContext.jsx
import React, { createContext, useState, useCallback, useRef } from "react";

export const GmailContext = createContext();
const API_BASE = "https://api.nillai.de";
const STATUS_CACHE_MS = 60_000; // 1 Minute Cache für Status

export const GmailProvider = ({ children }) => {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);

  // letzte Status-Abfrage
  const lastStatusCheck = useRef(0);

  // --------------------------------------------------
  // STATUS CHECK MIT CACHE
  // --------------------------------------------------
  const fetchStatus = useCallback(async (force = false) => {
    const now = Date.now();

    if (!force && now - lastStatusCheck.current < STATUS_CACHE_MS) {
      // Cache gültig
      return connected;
    }

    try {
      const res = await fetch(`${API_BASE}/gmail/status`, {
        credentials: "include",
      });

      if (!res.ok) {
        setConnected({ connected: false });
        return { connected: false };
      }

      const data = await res.json().catch(() => ({ connected: false }));
      setConnected(data);
      lastStatusCheck.current = now;
      return data;
    } catch (err) {
      console.error("Gmail status error:", err);
      setConnected({ connected: false });
      return { connected: false };
    }
  }, [connected]);

  // --------------------------------------------------
  // OAUTH CONNECT
  // --------------------------------------------------
  const connectGmail = () => {
    window.location.href = `${API_BASE}/gmail/auth-url`;
  };

  // --------------------------------------------------
  // OAUTH DISCONNECT
  // --------------------------------------------------
  const disconnectGmail = async () => {
    try {
      const res = await fetch(`${API_BASE}/gmail/disconnect`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to disconnect Gmail");

      // Soft-Disconnect lokal
      setConnected({ connected: false });
      setEmails([]);
      setSentEmails([]);
      setActiveEmail(null);

      // optional: Status forcieren
      lastStatusCheck.current = 0;
      await fetchStatus(true);
    } catch (err) {
      console.error("Gmail disconnect error:", err);
    }
  };

  // --------------------------------------------------
  // INBOX LADEN
  // --------------------------------------------------
  const fetchInboxEmails = useCallback(async () => {
    setInitializing(true);
    try {
      const res = await fetch(`${API_BASE}/gmail/emails?mailbox=inbox`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Inbox fetch failed");

      const data = await res.json().catch(() => ({ emails: [] }));
      setEmails(data.emails || []);
    } catch (err) {
      console.error("Inbox error:", err);
    } finally {
      setInitializing(false);
    }
  }, []);

  // --------------------------------------------------
  // SENT LADEN
  // --------------------------------------------------
  const fetchSentEmails = useCallback(async () => {
    setInitializing(true);
    try {
      const res = await fetch(`${API_BASE}/gmail/emails?mailbox=sent`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Sent fetch failed");

      const data = await res.json().catch(() => ({ emails: [] }));
      setSentEmails(data.emails || []);
    } catch (err) {
      console.error("Sent error:", err);
    } finally {
      setInitializing(false);
    }
  }, []);

  // --------------------------------------------------
  // EMAIL DETAIL + AI-POLLING
  // --------------------------------------------------
  const openEmail = useCallback(async (id) => {
    const loadEmail = async () => {
      try {
        const res = await fetch(`${API_BASE}/gmail/emails/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load email detail");

        const data = await res.json();
        setActiveEmail(data);
        return data;
      } catch (err) {
        console.error("Detail fetch error:", err);
        return null;
      }
    };

    setInitializing(true);
    const firstLoad = await loadEmail();
    setInitializing(false);

    // AI-Polling, falls noch nicht fertig
    if (firstLoad?.ai_status !== "success") {
      const pollAI = async () => {
        const refreshed = await loadEmail();
        if (refreshed?.ai_status !== "success") {
          setTimeout(pollAI, 1500);
        }
      };
      setTimeout(pollAI, 1500);
    }
  }, []);

  const closeEmail = () => setActiveEmail(null);

  return (
    <GmailContext.Provider
      value={{
        connected,
        connectGmail,
        disconnectGmail,
        fetchStatus,
        emails,
        sentEmails,
        activeEmail,
        initializing,
        fetchInboxEmails,
        fetchSentEmails,
        openEmail,
        closeEmail,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
};
