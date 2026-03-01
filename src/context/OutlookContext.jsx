import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

export const OutlookContext = createContext();

export const OutlookProvider = ({ children }) => {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const lastStatusFetch = useRef(0);

  // =========================
  // Status Check
  // =========================
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

  // =========================
  // Fetch Emails List
  // =========================
  const fetchEmails = useCallback(async () => {
    if (!connected?.connected) return [];

    setInitializing(true);
    try {
      const res = await api.get("/outlook/emails");
      const rawEmails = res?.data?.emails ?? [];

      const safeEmails = Array.isArray(rawEmails)
        ? rawEmails.map((m) => ({
            id: m?.id ?? Math.random().toString(),
            subject: m?.subject ?? "(Kein Betreff)",
            from: m?.from ?? "(Absender unbekannt)",
            received_at: m?.received_at ?? null,
            body: m?.body ?? "<p>Kein Inhalt</p>",
            mailbox: m?.mailbox ?? "inbox",
            ai_status: m?.ai_status ?? "pending",
            summary: m?.summary ?? null,
            priority: m?.priority ?? null,
            category: m?.category ?? null,
            category_group: m?.category_group ?? null,
            action_items: m?.action_items ?? [],
            detected_dates: m?.detected_dates ?? [],
          }))
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

  // =========================
  // Open Single Email + KI
  // =========================
  const openEmail = useCallback(
    async (id) => {
      if (!id) return null;
      setInitializing(true);

      try {
        // Schritt 1: Schnellanzeige aus Liste
        const basicMail = emails.find((e) => e.id === id);
        if (basicMail) setActiveEmail(basicMail);

        // Schritt 2: Detail + KI laden
        const res = await api.get(`/outlook/emails/${id}`);
        const mail = res?.data;
        if (!mail) return null;

        const active = {
          id: mail.id,
          subject: mail.subject ?? "(Kein Betreff)",
          from: mail.from ?? "(Absender unbekannt)",
          received_at: mail.received_at,
          body: mail.body ?? "<p>Kein Inhalt</p>",
          mailbox: mail.mailbox ?? basicMail?.mailbox ?? "inbox",
          ai_status: mail.ai_status ?? "pending",
          summary: mail.summary ?? null,
          priority: mail.priority ?? null,
          category: mail.category ?? null,
          category_group: mail.category_group ?? null,
          action_items: mail.action_items ?? [],
          detected_dates: mail.detected_dates ?? [],
        };

        setActiveEmail(active);
        return active;
      } catch (err) {
        console.error("Detail error:", err?.message);
        return null;
      } finally {
        setInitializing(false);
      }
    },
    [emails]
  );

  const closeEmail = useCallback(() => {
    setActiveEmail(null);
  }, []);

  // =========================
  // Connect / Disconnect
  // =========================
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
