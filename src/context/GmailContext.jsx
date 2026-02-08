// src/context/GmailContext.jsx
import React, { createContext, useState, useCallback, useRef } from "react";

export const GmailContext = createContext();

const API_BASE = "https://api.nillai.de";

export const GmailProvider = ({ children }) => {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);

  // Cache für Status: max. 1x/min
  const lastStatusRef = useRef({ time: 0, connected: null });

  // --------------------------------------------------
  // STATUS CHECK
  // --------------------------------------------------
  const fetchStatus = useCallback(async () => {
    try {
      const now = Date.now();
      // Cache prüfen (60s)
      if (now - lastStatusRef.current.time < 60_000 && lastStatusRef.current.connected !== null) {
        setConnected({ connected: lastStatusRef.current.connected });
        return lastStatusRef.current.connected;
      }

      const res = await fetch(`${API_BASE}/gmail/status`, {
        credentials: "include",
      });

      if (!res.ok) {
        setConnected({ connected: false });
        lastStatusRef.current = { time: now, connected: false };
        return false;
      }

      const data = await res.json().catch(() => ({ connected: false }));
      setConnected(data);
      lastStatusRef.current = { time: now, connected: data.connected };
      return data.connected;
    } catch (err) {
      console.error("Gmail status error:", err);
      setConnected({ connected: false });
      lastStatusRef.current = { time: Date.now(), connected: false };
      return false;
    }
  }, []);

  // --------------------------------------------------
  // OAUTH CONNECT / DISCONNECT
  // --------------------------------------------------
  const connectGmail = () => {
    window.location.href = `${API_BASE}/gmail/auth-url`;
  };

  const disconnectGmail = async () => {
    try {
      const res = await fetch(`${API_BASE}/gmail/disconnect`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to disconnect Gmail");

      // Soft disconnect im Frontend reflektieren
      setConnected({ connected: false });
      setEmails([]);
      setSentEmails([]);
      setActiveEmail(null);
      lastStatusRef.current = { time: Date.now(), connected: false };
    } catch (err) {
      console.error("Gmail disconnect error:", err);
    }
  };

  // --------------------------------------------------
  // INBOX & SENT
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

    // AI-Polling: erneut laden, bis AI fertig ist
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
