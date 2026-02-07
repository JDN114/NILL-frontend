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
  const FETCH_INTERVAL = 5000; // 5 Sekunden Minimum zwischen Requests

  const throttleFetch = async (fetchFunc) => {
    const now = Date.now();
    if (now - lastFetch < FETCH_INTERVAL) return;
    setLastFetch(now);
    return fetchFunc();
  };

  // -------------------- Connect Gmail --------------------
  const connectGmail = () => {
    // Direkt Browser auf den Backend-Endpunkt weiterleiten,
    // der einen Redirect zu Google zurückliefert
    window.location.href = "/api/gmail/auth-url";
  };

  // -------------------- Fetch Gmail-Verbindungsstatus --------------------
  const fetchStatus = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/gmail/emails?mailbox=inbox", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        setConnected({ connected: true });
      } else {
        setConnected({ connected: false });
      }
    } catch (err) {
      console.error("Error checking Gmail status:", err);
      setConnected({ connected: false });
    }
  }, [user]);

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
  }, [user, throttleFetch]);

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
  }, [user, throttleFetch]);

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
        emails,
        sentEmails,
        activeEmail,
        initializing,
        connected,
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
