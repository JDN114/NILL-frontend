// src/context/GmailContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";

export const GmailContext = createContext();

export const GmailProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [connected, setConnected] = useState({ connected: false, email: null });
  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);

  // -------------------- Rate-Limit & Throttle --------------------
  const [lastFetch, setLastFetch] = useState(0);
  const FETCH_INTERVAL = 5000; // 5 Sekunden Minimum zwischen Requests

  const throttleFetch = async (fetchFunc) => {
    const now = Date.now();
    if (now - lastFetch < FETCH_INTERVAL) return;
    setLastFetch(now);
    return fetchFunc();
  };

  // -------------------- Connect Gmail --------------------
  const connectGmail = () => {
    // Direkt im Browser zu Backend-Endpoint → Backend macht Redirect zu Google
    window.location.href = "/api/gmail/auth-url";
  };

  // -------------------- Status prüfen --------------------
  const fetchStatus = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/gmail/emails?mailbox=inbox", {
        credentials: "include",
      });
      if (res.status === 404) {
        // Kein Gmail verbunden
        setConnected({ connected: false, email: null });
      } else if (res.ok) {
        const data = await res.json();
        // Gmail verbunden, E-Mails laden
        setConnected({ connected: true, email: user.email });
        setEmails(data.emails || []);
      } else {
        setConnected({ connected: false, email: null });
      }
    } catch (err) {
      console.error("Fehler beim Prüfen des Gmail-Status:", err);
      setConnected({ connected: false, email: null });
    }
  }, [user]);

  // Beim Mount automatisch Status prüfen
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // -------------------- Fetch Emails --------------------
  const fetchInboxEmails = useCallback(async () => {
    if (!connected.connected) return;
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
  }, [connected, throttleFetch]);

  const fetchSentEmails = useCallback(async () => {
    if (!connected.connected) return;
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
  }, [connected, throttleFetch]);

  // -------------------- Active Email --------------------
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
        emails,
        sentEmails,
        activeEmail,
        initializing,
        openEmail,
        closeEmail,
        fetchInboxEmails,
        fetchSentEmails,
        connectGmail,
        fetchStatus,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
};
