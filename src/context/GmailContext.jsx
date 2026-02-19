import React, { createContext, useState, useCallback, useEffect, useRef } from "react";

export const GmailContext = createContext();

const API_BASE = "https://api.nillai.de";

export const GmailProvider = ({ children }) => {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const [inboxNextToken, setInboxNextToken] = useState(null);
  const [sentNextToken, setSentNextToken] = useState(null);
  
  const lastStatusFetch = useRef(0);

  // --------------------------------------------------
  // STATUS CHECK
  // --------------------------------------------------
  const fetchStatus = useCallback(async () => {
    try {
      const now = Date.now();
      if (now - lastStatusFetch.current < 60000) return; // max 1x/min
      lastStatusFetch.current = now;

      const res = await fetch(`${API_BASE}/gmail/status`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => ({ connected: false }));
      setConnected(data);
      if (!data.connected) {
        setEmails([]);
        setSentEmails([]);
        setActiveEmail(null);
      }
    } catch (err) {
      console.error("Gmail status error:", err);
      setConnected({ connected: false });
      setEmails([]);
      setSentEmails([]);
      setActiveEmail(null);
    }
  }, []);

  // --------------------------------------------------
  // CONNECT / DISCONNECT
  // --------------------------------------------------
  const connectGmail = () => {
    window.location.href = `${API_BASE}/gmail/auth-url`;
  };

  const disconnectGmail = useCallback(async () => {
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
  }, []);

  // --------------------------------------------------
  // INBOX / SENT EMAILS
  // --------------------------------------------------
  const fetchInboxEmails = useCallback(
    async ({ append = false } = {}) => {
      if (!connected?.connected) return;

      setInitializing(true);

      try {
        const token = append ? inboxNextToken : null;

        const res = await fetch(
          `${API_BASE}/gmail/emails?mailbox=inbox${
            token ? `&page_token=${token}` : ""
          }`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Inbox fetch failed");

        const data = await res.json();

        setInboxNextToken(data.next_page_token || null);

        if (append) {
          setEmails((prev) => [...prev, ...(data.emails || [])]);
        } else {
          setEmails(data.emails || []);
        }
      } catch (err) {
        console.error("Inbox error:", err);
      } finally {
        setInitializing(false);
      }
    },
    [connected, inboxNextToken]
  );
  
  const fetchSentEmails = useCallback(
    async (params = {}) => {
      if (!connected?.connected) return;

      setInitializing(true);
      try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE}/gmail/emails?mailbox=sent&${query}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Sent fetch failed");

        const data = await res.json().catch(() => ({ emails: [] }));
        if (params.append) {
          setSentEmails((prev) => [...prev, ...(data.emails || [])]);
        } else {
          setSentEmails(data.emails || []);
        }
      } catch (err) {
        console.error("Sent error:", err);
      } finally {
        setInitializing(false);
      }
    },
    [connected]
  );

  // --------------------------------------------------
  // EMAIL DETAIL + AI POLLING
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

    if (firstLoad?.ai_status !== "success") {
      const pollAI = async () => {
        const refreshed = await loadEmail();
        if (refreshed?.ai_status !== "success") setTimeout(pollAI, 1500);
      };
      setTimeout(pollAI, 1500);
    }
  }, []);

  const closeEmail = () => setActiveEmail(null);

  // Auto-fetch status beim Mount
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

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
