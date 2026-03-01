import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

export const OutlookContext = createContext();

export const OutlookProvider = ({ children }) => {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const lastStatusFetch = useRef(0);

  // =====================================================
  // STATUS CHECK
  // =====================================================
  const fetchStatus = useCallback(async () => {
    try {
      const now = Date.now();
      if (now - lastStatusFetch.current < 60000) return;
      lastStatusFetch.current = now;

      const res = await api.get("/outlook/status");
      const data = res.data || { connected: false };
      setConnected(data);

      if (!data.connected) {
        setEmails([]);
        setActiveEmail(null);
      }
    } catch (err) {
      console.error("Outlook status error:", err?.message);
      setConnected({ connected: false });
      setEmails([]);
      setActiveEmail(null);
    }
  }, []);

  // =====================================================
  // FETCH EMAIL LIST (robust + Inbox/Sent)
  // =====================================================
  const fetchEmails = useCallback(async () => {
    if (!connected?.connected) return [];

    setInitializing(true);
    try {
      const res = await api.get("/outlook/emails");
      const rawEmails = res?.data?.emails ?? [];

      const safeEmails = Array.isArray(rawEmails)
        ? rawEmails.map((m) => {
            // Robust fallback für Absender
            let sender = "(Absender unbekannt)";
            if (m?.from?.emailAddress?.name) sender = m.from.emailAddress.name;
            else if (m?.from?.emailAddress?.address) sender = m.from.emailAddress.address;
            else if (m?.from?.name) sender = m.from.name;
            else if (typeof m?.from === "string") sender = m.from;

            // Robust fallback für Datum
            const received = m?.receivedDateTime ?? m?.received_at ?? null;

            // Inbox/Sent
            const mailbox = m?.folder?.toLowerCase() === "sentitems" ? "sent" : "inbox";

            return {
              id: m?.id ?? Math.random().toString(),
              subject: m?.subject ?? "(Kein Betreff)",
              from: sender,
              received_at: received,
              body: m?.body?.content ?? "<p>Kein Inhalt</p>",
              mailbox,
            };
          })
        : [];

      setEmails(safeEmails);
      return safeEmails;
    } catch (err) {
      console.error("Outlook fetchEmails failed:", err?.message);
      return [];
    } finally {
      setInitializing(false);
    }
  }, [connected]);

  // =====================================================
  // OPEN EMAIL DETAIL
  // =====================================================
  const openEmail = useCallback(async (id) => {
    if (!id) return;
    setInitializing(true);
    try {
      const res = await api.get(`/outlook/emails/${id}`);
      const mail = res?.data;
      setActiveEmail(mail || null);
      return mail || null;
    } catch (err) {
      console.error("Detail error:", err?.message);
      return null;
    } finally {
      setInitializing(false);
    }
  }, []);

  // =====================================================
  // CLOSE EMAIL
  // =====================================================
  const closeEmail = useCallback(() => setActiveEmail(null), []);

  // =====================================================
  // CONNECT/DISCONNECT
  // =====================================================
  const connectOutlook = () => {
    window.location.href = `${api.defaults.baseURL}/outlook/auth-url`;
  };

  const disconnectOutlook = useCallback(async () => {
    try {
      await api.post("/outlook/disconnect");
      setConnected({ connected: false });
      setEmails([]);
      setActiveEmail(null);
    } catch (err) {
      console.error("Disconnect error:", err?.message);
    }
  }, []);

  // =====================================================
  // INITIAL STATUS LOAD
  // =====================================================
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <OutlookContext.Provider
      value={{
        connected,
        emails,
        activeEmail,
        initializing,
        fetchStatus,
        fetchEmails,
        openEmail,
        closeEmail,
        connectOutlook,
        disconnectOutlook,
      }}
    >
      {children}
    </OutlookContext.Provider>
  );
};
