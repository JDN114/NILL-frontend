import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

export const OutlookContext = createContext();

export const OutlookProvider = ({ children }) => {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const lastStatusFetch = useRef(0);
  // ✅ Ref speichert den aktuellen connected-Wert, ohne fetchEmails neu zu erzeugen
  const connectedRef = useRef(false);

  // =========================
  // Status Check
  // =========================
  const fetchStatus = useCallback(async () => {
    try {
      const now = Date.now();
      if (now - lastStatusFetch.current < 5000) return;
      lastStatusFetch.current = now;

      const res = await api.get("/outlook/status");
      const data = res.data || { connected: false };
      const isConnected = Boolean(data.connected);

      // ✅ Nur setState wenn sich der Wert wirklich ändert — verhindert
      //    neue Objekt-Referenz bei jedem Poll und damit den Render-Loop
      if (isConnected !== connectedRef.current) {
        connectedRef.current = isConnected;
        setConnected(data);

        if (!isConnected) {
          setEmails([]);
          setActiveEmail(null);
        }
      }
    } catch (err) {
      console.error("[OutlookContext] Status error:", err);
      if (connectedRef.current !== false) {
        connectedRef.current = false;
        setConnected({ connected: false });
        setEmails([]);
        setActiveEmail(null);
      }
    }
  }, []); // ✅ keine Dependencies → stabile Referenz

  // =========================
  // Fetch Emails List
  // =========================
  const fetchEmails = useCallback(async () => {
    // ✅ Ref statt State als Dependency → fetchEmails wird nie neu erzeugt
    if (!connectedRef.current) return [];
    setInitializing(true);
    try {
      const res = await api.get("/outlook/emails");
      const rawEmails = res?.data?.emails ?? [];
      const safeEmails = rawEmails.map((m) => ({
        id: m.id,
        subject: m.subject ?? "(Kein Betreff)",
        from: m.from ?? "(Absender unbekannt)",
        from_address: m.from_address ?? m.from ?? "(Absender unbekannt)",
        received_at: m.received_at ?? null,
        mailbox: m.mailbox ?? "inbox",
        body: m.body ?? "<p>Kein Inhalt</p>",
        ai_status: m.ai_status ?? "pending",
        summary: m.summary ?? null,
        priority: m.priority ?? null,
        category: m.category ?? null,
        category_group: m.category_group ?? null,
        action_items: m.action_items ?? [],
        detected_dates: m.detected_dates ?? [],
      }));

      setEmails(safeEmails);
      return safeEmails;
    } catch (err) {
      console.error("[OutlookContext] fetchEmails failed:", err);
      return [];
    } finally {
      setInitializing(false);
    }
  }, []); // ✅ keine Dependencies → stabile Referenz, kein Loop

  // =========================
  // Open Single Email
  // =========================
  const openEmail = useCallback(async (id) => {
    if (!id) return null;
    setInitializing(true);
    try {
      const res = await api.get(`/outlook/emails/${id}`);
      const mail = res.data;
      if (!mail) return null;

      const active = {
        id: mail.id,
        subject: mail.subject ?? "(Kein Betreff)",
        from: mail.from ?? "(Absender unbekannt)",
        from_address: mail.from_address ?? mail.from ?? "(Absender unbekannt)",
        received_at: mail.received_at,
        body: mail.body ?? "<p>Kein Inhalt</p>",
        mailbox: mail.mailbox ?? "inbox",
        ai_status: mail.ai_status ?? "pending",
        summary: mail.summary ?? null,
        priority: mail.priority ?? null,
        category: mail.category ?? null,
        category_group: mail.category_group ?? null,
        sentiment: mail.sentiment ?? null,
        action_items: mail.action_items ?? [],
        detected_dates: mail.detected_dates ?? [],
      };

      setActiveEmail(active);
      setAiLoading(active.ai_status === "pending");
      return active;
    } catch (err) {
      console.error("[OutlookContext] openEmail failed:", err);
      return null;
    } finally {
      setInitializing(false);
    }
  }, []);

  const closeEmail = useCallback(() => {
    setActiveEmail(null);
    setAiLoading(false);
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
      connectedRef.current = false;
      setConnected({ connected: false });
      setEmails([]);
      setActiveEmail(null);
    } catch (err) {
      console.error("[OutlookContext] Disconnect error:", err);
    }
  }, []);

  // =========================
  // Auto-fetch status
  // =========================
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return (
    <OutlookContext.Provider
      value={{
        connected,
        emails,
        activeEmail,
        initializing,
        aiLoading,
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
