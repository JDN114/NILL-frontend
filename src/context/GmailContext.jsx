// src/context/GmailContext.jsx
import React, { createContext, useState, useCallback } from "react";

export const GmailContext = createContext();

const API_BASE = "https://api.nillai.de";

export const GmailProvider = ({ children }) => {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);

  // --------------------------------------------------
  // STATUS CHECK
  // --------------------------------------------------
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/gmail/status`, {
        credentials: "include",
      });

      if (!res.ok) {
        setConnected({ connected: false });
        return;
      }

      const data = await res.json().catch(() => ({ connected: false }));
      setConnected(data);
    } catch (err) {
      console.error("Gmail status error:", err);
      setConnected({ connected: false });
    }
  }, []);

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

      setConnected({ connected: false });
      setEmails([]);
      setSentEmails([]);
      setActiveEmail(null);
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
  // EMAIL DETAIL + AI POLLING
  // --------------------------------------------------
  const openEmail = useCallback(
    async (id) => {
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

      if (firstLoad?.ai_status !== "success") {
        const pollAI = async () => {
          const refreshed = await loadEmail();
          if (refreshed?.ai_status !== "success") {
            setTimeout(pollAI, 1500);
          }
        };
        setTimeout(pollAI, 1500);
      }
    },
    []
  );

  const closeEmail = () => setActiveEmail(null);

  return (
    <GmailContext.Provider
      value={{
        connected,
        connectGmail,
        disconnectGmail, // ✅ neu
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
