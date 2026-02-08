// src/context/GmailContext.jsx
import React, { createContext, useState, useCallback } from "react";

export const GmailContext = createContext();

export const GmailProvider = ({ children }) => {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);

  // --------------------------------------------------
  // ✅ STATUS CHECK
  // --------------------------------------------------
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/gmail/status", {
        credentials: "include",
      });

      if (!res.ok) {
        setConnected({ connected: false });
        return;
      }

      const data = await res.json();
      setConnected(data);
    } catch (err) {
      console.error("Gmail status error:", err);
      setConnected({ connected: false });
    }
  }, []);

  // --------------------------------------------------
  // ✅ OAUTH CONNECT (KEIN FETCH!)
  // --------------------------------------------------
  const connectGmail = () => {
    window.location.href = "http://nillai.de/gmail/auth-url";
  };

  // --------------------------------------------------
  // INBOX LADEN
  // --------------------------------------------------
  const fetchInboxEmails = useCallback(async () => {
    setInitializing(true);
    try {
      const res = await fetch("/api/gmail/emails?mailbox=inbox", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Inbox fetch failed");
      }

      const data = await res.json();
      setEmails(data.emails || []);
    } catch (err) {
      console.error(err);
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
      const res = await fetch("/api/gmail/emails?mailbox=sent", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Sent fetch failed");
      }

      const data = await res.json();
      setSentEmails(data.emails || []);
    } catch (err) {
      console.error(err);
    } finally {
      setInitializing(false);
    }
  }, []);

  // --------------------------------------------------
  // EMAIL ÖFFNEN
  // --------------------------------------------------
  const openEmail = (id, mailbox = "inbox") => {
    const list = mailbox === "inbox" ? emails : sentEmails;
    const found = list.find((e) => e.id === id);
    if (found) setActiveEmail(found);
  };

  const closeEmail = () => setActiveEmail(null);

  return (
    <GmailContext.Provider
      value={{
        connected,
        connectGmail,
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
