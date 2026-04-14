import React, { createContext, useState, useCallback, useEffect, useRef } from "react";

export const GmailContext = createContext();

const API_BASE = "https://api.nillai.de";

export const GmailProvider = ({ children }) => {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  // initializing = true nur solange Status noch nie geladen wurde
  const [initializing, setInitializing] = useState(true);
  const [inboxNextToken, setInboxNextToken] = useState(null);
  const [sentNextToken, setSentNextToken] = useState(null);

  const lastStatusFetch = useRef(0);
  // Cache: verhindert parallele Inbox/Sent-Requests
  const fetchInboxPromise = useRef(null);
  const fetchSentPromise  = useRef(null);

  // --------------------------------------------------
  // STATUS CHECK
  // --------------------------------------------------
  const fetchStatus = useCallback(async () => {
    try {
      const now = Date.now();
      if (now - lastStatusFetch.current < 60_000) return;
      lastStatusFetch.current = now;

      const res = await fetch(`${API_BASE}/gmail/status`, { credentials: "include" });
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
    } finally {
      // Status ist geladen → initializing done, egal ob connected oder nicht
      setInitializing(false);
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
      lastStatusFetch.current = 0; // Status-Cache invalidieren
    } catch (err) {
      console.error("Gmail disconnect error:", err);
    }
  }, []);

  // --------------------------------------------------
  // INBOX EMAILS
  // WICHTIG: kein setInitializing hier — das blockt die ganze Page.
  //          Caller (EmailsPage) managed seinen eigenen loading-State.
  //          Request-Deduplication via fetchInboxPromise verhindert Doppelcalls.
  // --------------------------------------------------
  const fetchInboxEmails = useCallback(
    async ({ append = false } = {}) => {
      if (!connected?.connected) return [];

      // Deduplication: laufenden Request wiederverwenden
      if (!append && fetchInboxPromise.current) {
        return fetchInboxPromise.current;
      }

      const token = append ? inboxNextToken : null;

      const promise = fetch(
        `${API_BASE}/gmail/emails?mailbox=inbox${token ? `&page_token=${token}` : ""}`,
        { credentials: "include" }
      )
        .then(async (res) => {
          if (!res.ok) {
            if (res.status === 401) {
              // Token wirklich ungültig → disconnect signalisieren
              setConnected({ connected: false });
            }
            throw new Error(`Inbox fetch failed: ${res.status}`);
          }
          const data = await res.json();
          setInboxNextToken(data.next_page_token || null);

          const inboxMails = (data.emails || []).map((m) => ({ ...m, mailbox: "inbox" }));
          if (append) {
            setEmails((prev) => [...prev, ...inboxMails]);
          } else {
            setEmails(inboxMails);
          }
          return inboxMails;
        })
        .catch((err) => {
          console.error("Inbox error:", err);
          return [];
        })
        .finally(() => {
          fetchInboxPromise.current = null;
        });

      if (!append) fetchInboxPromise.current = promise;
      return promise;
    },
    [connected, inboxNextToken]
  );

  // --------------------------------------------------
  // SENT EMAILS  (gleiche Struktur wie Inbox)
  // --------------------------------------------------
  const fetchSentEmails = useCallback(
    async ({ append = false } = {}) => {
      if (!connected?.connected) return [];

      if (!append && fetchSentPromise.current) {
        return fetchSentPromise.current;
      }

      const token = append ? sentNextToken : null;

      const promise = fetch(
        `${API_BASE}/gmail/emails?mailbox=sent${token ? `&page_token=${token}` : ""}`,
        { credentials: "include" }
      )
        .then(async (res) => {
          if (!res.ok) {
            if (res.status === 401) setConnected({ connected: false });
            throw new Error(`Sent fetch failed: ${res.status}`);
          }
          const data = await res.json();
          setSentNextToken(data.next_page_token || null);

          const sentMails = (data.emails || []).map((m) => ({ ...m, mailbox: "sent" }));
          if (append) {
            setSentEmails((prev) => [...prev, ...sentMails]);
          } else {
            setSentEmails(sentMails);
          }
          return sentMails;
        })
        .catch((err) => {
          console.error("Sent error:", err);
          return [];
        })
        .finally(() => {
          fetchSentPromise.current = null;
        });

      if (!append) fetchSentPromise.current = promise;
      return promise;
    },
    [connected, sentNextToken]
  );

  // --------------------------------------------------
  // EMAIL DETAIL
  // --------------------------------------------------
  const openEmail = useCallback(async (id) => {
    if (!id) return null;
    try {
      const res = await fetch(`${API_BASE}/gmail/emails/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load email detail");
      const data = await res.json();
      setActiveEmail(data);
      return data;
    } catch (err) {
      console.error("Detail fetch error:", err);
      return null;
    }
  }, []);

  const closeEmail = useCallback(() => setActiveEmail(null), []);

  // --------------------------------------------------
  // INIT — nur Status, kein Email-Prefetch
  // MailContext/EmailsPage triggert fetchEmails selbst
  // --------------------------------------------------
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
