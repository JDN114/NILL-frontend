import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

export const OutlookContext = createContext();

export const OutlookProvider = ({ children }) => {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const lastStatusFetch = useRef(0);

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

  const fetchEmails = useCallback(async () => {
    if (!connected?.connected) return [];

    setInitializing(true);
    try {
      const res = await api.get("/outlook/emails");
      const rawEmails = res?.data?.emails ?? [];

      const safeEmails = Array.isArray(rawEmails)
        ? rawEmails.map((m) => {
            const sender = m?.from || "(Absender unbekannt)";
            const received = m?.received_at ?? m?.date ?? null;
            const mailbox = m?.mailbox || (m?.folder?.toLowerCase() === "sentitems" ? "sent" : "inbox");
            return {
              id: m?.id ?? Math.random().toString(),
              subject: m?.subject ?? "(Kein Betreff)",
              from: typeof sender === "string" ? sender : `${sender.name} <${sender.address}>`,
              received_at: received,
              body: m?.body ?? "<p>Kein Inhalt</p>",
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

  const openEmail = useCallback(async (id) => {
    if (!id) return null;
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

  const closeEmail = useCallback(() => setActiveEmail(null), []);

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
