// src/context/GmailContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";

export const GmailContext = createContext();

export const GmailProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const [connected, setConnected] = useState({ connected: false });

  // -------------------- Rate-Limit & Throttle --------------------
  const [lastFetch, setLastFetch] = useState(0);
  const FETCH_INTERVAL = 5000;

  const throttleFetch = async (fetchFunc) => {
    const now = Date.now();
    if (now - lastFetch < FETCH_INTERVAL) return;
    setLastFetch(now);
    return fetchFunc();
  };

  // -------------------- Connect Gmail --------------------
  const connectGmail = () => {
    // Browser folgt automatisch dem Redirect von FastAPI → Google
    window.location.href = "/api/gmail/auth-url";
  };

  // -------------------- Fetch Emails --------------------
  const fetchInboxEmails = useCallback(async () => {
    if (!user) return;
    setInitializing(true);
    try {
      await throttleFetch(async () => {
        const res = await fetch("/api/gmail/emails?mailbox=inbox", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch inbox emails");
        const data = await res.json();
        setEmails(data.emails || []);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setInitializing(false);
    }
  }, [user, lastFetch]);

  const fetchSentEmails = useCallback(async () => {
    if (!user) return;
    setInitializing(true);
    try {
      await throttleFetch(async () => {
        const res = await fetch("/api/gmail/emails?mailbox=sent", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch sent emails");
        const data = await res.json();
        setSentEmails(data.emails || []);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setInitializing(false);
    }
  }, [user, lastFetch]);

  // -------------------- Active Email --------------------
  const openEmail = (id, mailbox = "inbox") => {
    const list = mailbox === "inbox" ? emails : sentEmails;
    const found = list.find((e) => e.id === id);
    if (found) setActiveEmail(found);
  };

  const closeEmail = () => setActiveEmail(null);

  // -------------------- Fetch Gmail Connection Status --------------------
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/gmail/emails", {
        method: "GET",
        credentials: "include",
      });
      // Status: verbunden, wenn API antwortet und 200 OK
      setConnected({ connected: res.ok });
    } catch (err) {
      setConnected({ connected: false });
    }
  }, []);

  return (
    <GmailContext.Provider
      value={{
        emails,
        sentEmails,
        activeEmail,
        initializing,
        openEmail,
        closeEmail,
        fetchInboxEmails,
        fetchSentEmails,
        connectGmail,
        connected,
        fetchStatus,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
};
