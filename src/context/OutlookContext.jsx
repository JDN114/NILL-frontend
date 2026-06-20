import React, { createContext, useState, useEffect, useCallback, useRef, useMemo, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const OutlookContext = createContext();

export const OutlookProvider = ({ children }) => {
  const { user } = useContext(AuthContext) || {};

  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const lastStatusFetch = useRef(0);
  // Ref speichert den aktuellen connected-Wert, ohne fetchEmails neu zu erzeugen.
  // Muss mit null initialisiert werden (passend zu useState(null)), damit der
  // erste fetchStatus-Aufruf setConnected() immer aufruft, auch wenn Outlook
  // nicht verbunden ist (false !== false wäre sonst false → State bleibt null).
  const connectedRef = useRef(null);

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
      if (err?.response?.status !== 401) {
        console.error("[OutlookContext] Status error:", err);
      }
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
    if (!connectedRef.current) return [];
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
        read: m.read ?? false,
      }));

      setEmails(safeEmails);
      return safeEmails;
    } catch (err) {
      console.error("[OutlookContext] fetchEmails failed:", err);
      return [];
    }
  }, []); // ✅ keine Dependencies → stabile Referenz, kein Loop

  // =========================
  // Open Single Email
  // =========================
  const openEmail = useCallback(async (id) => {
    if (!id) return null;
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
        read: mail.read ?? false,
        provider: mail.provider ?? "outlook",
        attachments: mail.attachments ?? [],
      };
      setActiveEmail(active);
      setAiLoading(active.ai_status === "pending");
      if (!mail.read) {
        api.post(`/outlook/emails/${id}/read`).catch(() => {});
        setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
      }
      return active;
    } catch (err) {
      console.error("[OutlookContext] openEmail failed:", err);
      return null;
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
  // Auto-fetch status — nur für eingeloggte User.
  // Anonyme Besucher auf der Landingpage dürfen weder /outlook/status
  // abfragen noch einen 60s-Poll-Timer starten (kein Zombie-Interval).
  // =========================
  useEffect(() => {
    if (!user) {
      // De-Auth / Logout: laufenden Status zurücksetzen, damit keine
      // verbundenen Daten eines vorigen Users im State hängen bleiben.
      connectedRef.current = null;
      lastStatusFetch.current = 0;
      setConnected(null);
      setEmails([]);
      setActiveEmail(null);
      return;
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, [user, fetchStatus]);

  const value = useMemo(() => ({
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
  }), [connected, emails, activeEmail, initializing, aiLoading,
       fetchStatus, fetchEmails, openEmail, closeEmail, connectOutlook, disconnectOutlook]);

  return (
    <OutlookContext.Provider value={value}>
      {children}
    </OutlookContext.Provider>
  );
};
