import React, { createContext, useState, useCallback, useEffect, useRef } from "react";

export const GmailContext = createContext();

const API_BASE = "https://api.nillai.de";

export const GmailProvider = ({ children }) => {
  const [connected, setConnected]       = useState(null);
  const [emails, setEmails]             = useState([]);
  const [sentEmails, setSentEmails]     = useState([]);
  const [activeEmail, setActiveEmail]   = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [inboxNextToken, setInboxNextToken] = useState(null);
  const [sentNextToken, setSentNextToken]   = useState(null);
  const [hasMoreInbox, setHasMoreInbox] = useState(false);
  const [hasMoreSent, setHasMoreSent]   = useState(false);

  const lastStatusFetch   = useRef(0);
  const fetchInboxPromise = useRef(null);
  const fetchSentPromise  = useRef(null);

  // ── Status ──────────────────────────────────────────────────────────────────
  const fetchStatus = useCallback(async () => {
    try {
      const now = Date.now();
      if (now - lastStatusFetch.current < 60_000) return;
      lastStatusFetch.current = now;

      const res  = await fetch(`${API_BASE}/gmail/status`, { credentials: "include" });
      const data = await res.json().catch(() => ({ connected: false }));
      setConnected(data);
      if (!data.connected) { setEmails([]); setSentEmails([]); setActiveEmail(null); }
    } catch {
      setConnected({ connected: false });
      setEmails([]); setSentEmails([]); setActiveEmail(null);
    } finally {
      setInitializing(false);
    }
  }, []);

  // ── Connect / Disconnect ─────────────────────────────────────────────────────
  const connectGmail = () => { window.location.href = `${API_BASE}/gmail/auth-url`; };

  const disconnectGmail = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/gmail/disconnect`, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      setConnected({ connected: false });
      setEmails([]); setSentEmails([]); setActiveEmail(null);
      setInboxNextToken(null); setSentNextToken(null);
      lastStatusFetch.current = 0;
    } catch (err) { console.error("Gmail disconnect error:", err); }
  }, []);

  // ── Fetch helpers ────────────────────────────────────────────────────────────
  const _fetchPage = useCallback(async ({ mailbox, append, token }) => {
    const url = `${API_BASE}/gmail/emails?mailbox=${mailbox}${token ? `&page_token=${token}` : ""}`;
    const res  = await fetch(url, { credentials: "include" });

    if (!res.ok) {
      if (res.status === 401) setConnected({ connected: false });
      throw new Error(`Fetch failed: ${res.status}`);
    }

    const data  = await res.json();
    const mails = (data.emails || []).map(m => ({ ...m, mailbox }));
    const next  = data.next_page_token || null;

    if (mailbox === "inbox") {
      setInboxNextToken(next);
      setHasMoreInbox(!!next);
      setEmails(prev => append ? [...prev, ...mails] : mails);
    } else {
      setSentNextToken(next);
      setHasMoreSent(!!next);
      setSentEmails(prev => append ? [...prev, ...mails] : mails);
    }

    return mails;
  }, []);

  // ── Inbox ────────────────────────────────────────────────────────────────────
  const fetchInboxEmails = useCallback(async ({ append = false } = {}) => {
    if (!connected?.connected) return [];

    // Deduplication
    if (!append && fetchInboxPromise.current) return fetchInboxPromise.current;

    const token   = append ? inboxNextToken : null;
    const promise = _fetchPage({ mailbox: "inbox", append, token })
      .catch(err => { console.error("Inbox error:", err); return []; })
      .finally(() => { fetchInboxPromise.current = null; });

    if (!append) fetchInboxPromise.current = promise;
    return promise;
  }, [connected, inboxNextToken, _fetchPage]);

  // ── Sent ─────────────────────────────────────────────────────────────────────
  const fetchSentEmails = useCallback(async ({ append = false } = {}) => {
    if (!connected?.connected) return [];

    if (!append && fetchSentPromise.current) return fetchSentPromise.current;

    const token   = append ? sentNextToken : null;
    const promise = _fetchPage({ mailbox: "sent", append, token })
      .catch(err => { console.error("Sent error:", err); return []; })
      .finally(() => { fetchSentPromise.current = null; });

    if (!append) fetchSentPromise.current = promise;
    return promise;
  }, [connected, sentNextToken, _fetchPage]);

  // ── Suche (DB-seitig, findet auch alte Emails) ───────────────────────────────
  const searchEmails = useCallback(async (q, mailbox = null) => {
    if (!connected?.connected || !q?.trim()) return [];
    try {
      const params = new URLSearchParams({ q: q.trim(), limit: "100" });
      if (mailbox) params.set("mailbox", mailbox);
      const res  = await fetch(`${API_BASE}/gmail/emails/search?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();
      return (data.emails || []).map(m => ({ ...m, mailbox: mailbox || m.mailbox || "inbox" }));
    } catch (err) {
      console.error("Search error:", err);
      return [];
    }
  }, [connected]);

  // ── Email Detail ─────────────────────────────────────────────────────────────
  const openEmail = useCallback(async (id) => {
    if (!id) return null;
    try {
      const res  = await fetch(`${API_BASE}/gmail/emails/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load email detail");
      const data = await res.json();
      setActiveEmail(data);
      return data;
    } catch (err) { console.error("Detail fetch error:", err); return null; }
  }, []);

  const closeEmail = useCallback(() => setActiveEmail(null), []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  return (
    <GmailContext.Provider value={{
      connected, connectGmail, disconnectGmail, fetchStatus,
      emails, sentEmails, activeEmail, initializing,
      fetchInboxEmails, fetchSentEmails, searchEmails,
      openEmail, closeEmail,
      hasMoreInbox, hasMoreSent,
    }}>
      {children}
    </GmailContext.Provider>
  );
};
