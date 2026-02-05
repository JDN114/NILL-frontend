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
  const [connected, setConnected] = useState({ connected: false, email: null, expired: null });
  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [currentMailbox, setCurrentMailbox] = useState("inbox");
  const [loading, setLoading] = useState(true);
  const [loadingEmail, setLoadingEmail] = useState(false);

  // ------------------ Status ------------------
  const fetchStatus = async () => {
    try {
      const res = await getGmailStatus();
      const safe = {
        connected: Boolean(res?.connected),
        email: res?.email || null,
        expired: res?.expired || null,
      };
      setConnected(safe);
      return safe;
    } catch {
      const fallback = { connected: false, email: null, expired: null };
      setConnected(fallback);
      return fallback;
    }
  };

  // ------------------ Emails ------------------
  const fetchInboxEmails = async () => {
    try {
      setLoading(true);
      const res = await getGmailEmails("inbox");
      if (res?.emails) setEmails(res.emails);
    } catch (err) {
      console.error("fetchInboxEmails Fehler:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentEmails = async () => {
    try {
      setLoading(true);
      const res = await getGmailEmails("sent");
      if (res?.emails) setSentEmails(res.emails);
    } catch (err) {
      console.error("fetchSentEmails Fehler:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshInboxEmails = async () => {
    try {
      const res = await getGmailEmails("inbox");
      if (res?.emails) setEmails(res.emails);
    } catch {
      // still
    }
  };

  // ------------------ Email Detail ------------------
  const openEmail = async (id, mailbox = "inbox") => {
    if (!id) return;
    setLoadingEmail(true);
    setCurrentMailbox(mailbox);

    try {
      const data = await getGmailEmailDetail(id);
      setActiveEmail(data || null);

      if (mailbox === "inbox") {
        try {
          await markEmailRead(id);
        } catch {}
      }
    } catch (err) {
      console.error("Fehler beim Laden der Email:", err);
      setActiveEmail(null);
    } finally {
      setLoadingEmail(false);
    }
  };

  const closeEmail = () => setActiveEmail(null);

  // ------------------ Init ------------------
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
    return () => {
      mounted = false;
    };
  }, []);

  // ------------------ Polling für AI ------------------
  useEffect(() => {
    const pending = emails.some((e) => e.ai_status === "pending");
    if (!pending) return;

    const timer = setTimeout(() => {
      refreshInboxEmails();
    }, 3000);

    return () => clearTimeout(timer);
  }, [emails]);

// ------------------ Connect ------------------
const connectGmail = () => {
  window.location.href = "/gmail/auth-url";
};
 
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
