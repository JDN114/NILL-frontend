import React, { createContext, useState, useCallback, useEffect, useRef, useMemo } from "react";
import api from "../services/api";

export const GmailContext = createContext();

const INBOX_TTL_MS = 30_000; // 30 s before re-fetching inbox on remount

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
  const lastInboxFetch    = useRef(0);   // PERF-C3: TTL for inbox re-fetch
  const fetchInboxPromise = useRef(null);
  const fetchSentPromise  = useRef(null);

  // Refs for pagination tokens — avoids recreating callbacks on each page load.
  // State counterparts keep the rendered UI in sync.
  const inboxNextTokenRef = useRef(null);
  const sentNextTokenRef  = useRef(null);

  const _setInboxNextToken = useCallback((val) => {
    inboxNextTokenRef.current = val;
    setInboxNextToken(val);
  }, []);
  const _setSentNextToken = useCallback((val) => {
    sentNextTokenRef.current = val;
    setSentNextToken(val);
  }, []);

  // ── Status ──────────────────────────────────────────────────────────────────
  const fetchStatus = useCallback(async () => {
    try {
      const now = Date.now();
      if (now - lastStatusFetch.current < 60_000) return;
      lastStatusFetch.current = now;

      const res  = await api.get("/gmail/status");
      const data = res.data || { connected: false };
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
  const connectGmail = () => {
    window.location.href = `${api.defaults.baseURL}/gmail/auth-url`;
  };

  const disconnectGmail = useCallback(async () => {
    try {
      await api.post("/gmail/disconnect");
      setConnected({ connected: false });
      setEmails([]); setSentEmails([]); setActiveEmail(null);
      _setInboxNextToken(null); _setSentNextToken(null);
      lastStatusFetch.current = 0;
      lastInboxFetch.current  = 0;
    } catch (err) { console.error("Gmail disconnect error:", err); }
  }, [_setInboxNextToken, _setSentNextToken]);

  // ── Fetch helpers ────────────────────────────────────────────────────────────
  const _fetchPage = useCallback(async ({ mailbox, append, token }) => {
    const params = { mailbox };
    if (token) params.page_token = token;

    const res  = await api.get("/gmail/emails", { params });
    const data = res.data;
    const mails = (data.emails || []).map(m => ({ ...m, mailbox }));
    const next  = data.next_page_token || null;

    if (mailbox === "inbox") {
      _setInboxNextToken(next);
      setHasMoreInbox(!!next);
      setEmails(prev => append ? [...prev, ...mails] : mails);
    } else {
      _setSentNextToken(next);
      setHasMoreSent(!!next);
      setSentEmails(prev => append ? [...prev, ...mails] : mails);
    }

    return mails;
  }, [_setInboxNextToken, _setSentNextToken]);

  // ── Inbox ────────────────────────────────────────────────────────────────────
  // Deps: connected (need to know if we can fetch), _fetchPage (stable).
  // inboxNextToken removed from deps — read via ref to avoid recreation on every page.
  const fetchInboxEmails = useCallback(async ({ append = false } = {}) => {
    if (!connected?.connected) return [];

    // PERF-C3: skip re-fetch if inbox was loaded recently and this is a fresh load
    if (!append) {
      if (fetchInboxPromise.current) return fetchInboxPromise.current;
      if (Date.now() - lastInboxFetch.current < INBOX_TTL_MS && emails.length > 0) return emails;
    }

    const token   = append ? inboxNextTokenRef.current : null;
    const promise = _fetchPage({ mailbox: "inbox", append, token })
      .then(mails => { if (!append) lastInboxFetch.current = Date.now(); return mails; })
      .catch(err => { console.error("Inbox error:", err); return []; })
      .finally(() => { fetchInboxPromise.current = null; });

    if (!append) fetchInboxPromise.current = promise;
    return promise;
  }, [connected, emails, _fetchPage]);

  // ── Sent ─────────────────────────────────────────────────────────────────────
  const fetchSentEmails = useCallback(async ({ append = false } = {}) => {
    if (!connected?.connected) return [];

    if (!append && fetchSentPromise.current) return fetchSentPromise.current;

    const token   = append ? sentNextTokenRef.current : null;
    const promise = _fetchPage({ mailbox: "sent", append, token })
      .catch(err => { console.error("Sent error:", err); return []; })
      .finally(() => { fetchSentPromise.current = null; });

    if (!append) fetchSentPromise.current = promise;
    return promise;
  }, [connected, _fetchPage]);

  // ── Suche ────────────────────────────────────────────────────────────────────
  const searchEmails = useCallback(async (q, mailbox = null) => {
    if (!connected?.connected || !q?.trim()) return [];
    try {
      const params = { q: q.trim(), limit: "100" };
      if (mailbox) params.mailbox = mailbox;
      const res  = await api.get("/gmail/emails/search", { params });
      const data = res.data;
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
      const res  = await api.get(`/gmail/emails/${id}`);
      const data = res.data;
      // Bail out if only a timestamp changed — prevents polling from forcing re-renders
      setActiveEmail(prev =>
        prev?.id === data.id && prev?.ai_status === data.ai_status ? prev : data
      );
      if (!data.read) {
        api.patch(`/gmail/emails/${id}/read`).catch(() => {});
      }
      return data;
    } catch (err) { console.error("Detail fetch error:", err); return null; }
  }, []);

  const closeEmail = useCallback(() => setActiveEmail(null), []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const value = useMemo(() => ({
    connected, connectGmail, disconnectGmail, fetchStatus,
    emails, sentEmails, activeEmail, initializing,
    fetchInboxEmails, fetchSentEmails, searchEmails,
    openEmail, closeEmail,
    hasMoreInbox, hasMoreSent,
    inboxNextToken, sentNextToken,
  }), [
    connected, disconnectGmail, fetchStatus,
    emails, sentEmails, activeEmail, initializing,
    fetchInboxEmails, fetchSentEmails, searchEmails,
    openEmail, closeEmail,
    hasMoreInbox, hasMoreSent,
    inboxNextToken, sentNextToken,
  ]);

  return (
    <GmailContext.Provider value={value}>
      {children}
    </GmailContext.Provider>
  );
};
