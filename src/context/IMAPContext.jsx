// src/context/ImapContext.jsx
//
// Spiegelt das API-Pattern von GmailContext, mit zwei Erweiterungen:
//   1. Multi-Account: ein User kann mehrere IMAP-Postfächer verbinden.
//   2. Active-Account: alle Read/Send-Calls wissen, welches Postfach gerade
//      aktiv ist. EmailsPage hat einen kleinen Switcher dafür.
//
// Public API mirrored at GmailContext (für MailContext-Plug-in):
//   connected, initializing, emails, sentEmails, activeEmail,
//   hasMoreInbox, hasMoreSent,
//   fetchStatus(), fetchInboxEmails({append}), fetchSentEmails({append}),
//   searchEmails(q, box), openEmail(id), closeEmail(),
//   connectImap(payload), disconnectImap(),
// Plus IMAP-spezifisch:
//   accounts, activeAccountId, setActiveAccount(id),
//   addAccount(payload), removeAccount(id), testAccount(id),
//   reauthAccount(id, payload).

import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const ImapContext = createContext(null);

const PAGE_SIZE = 30;

export const ImapProvider = ({ children }) => {
  const { user } = useContext(AuthContext) || {};

  // ── State ──────────────────────────────────────────────────────────────
  const [accounts, setAccounts]               = useState([]);
  const [activeAccountId, setActiveAccountId] = useState(null);
  const [initializing, setInitializing]       = useState(true);

  const [emails, setEmails]         = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);

  const [nextCursorInbox, setNextCursorInbox] = useState(null);
  const [nextCursorSent, setNextCursorSent]   = useState(null);

  // ── Refs für stabile Closures ──────────────────────────────────────────
  const activeIdRef = useRef(null);
  useEffect(() => { activeIdRef.current = activeAccountId; }, [activeAccountId]);

  // ── Status laden ───────────────────────────────────────────────────────
  const fetchStatus = useCallback(async () => {
    try {
      const r = await api.get("/imap/status");
      const list = r.data?.accounts ?? [];
      setAccounts(list);
      // Aktiven Account beibehalten falls noch da, sonst ersten nehmen.
      setActiveAccountId(prev => {
        if (prev && list.find(a => a.id === prev)) return prev;
        return list[0]?.id ?? null;
      });
      return list;
    } catch (e) {
      console.error("[ImapContext] fetchStatus", e);
      return [];
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setInitializing(false);
      return;
    }
    fetchStatus();
  }, [user, fetchStatus]);

  // ── Account-Mutationen ─────────────────────────────────────────────────
  const addAccount = useCallback(async (payload) => {
    const r = await api.post("/imap/connect", payload);
    await fetchStatus();
    setActiveAccountId(r.data?.id ?? null);
    return r.data;
  }, [fetchStatus]);

  const reauthAccount = useCallback(async (id, payload) => {
    // /imap/connect ist idempotent — selber Endpoint, selbe Email-Adresse
    // → Account-Row wird upserted und status zurück auf "active" gesetzt.
    const r = await api.post("/imap/connect", payload);
    await fetchStatus();
    return r.data;
  }, [fetchStatus]);

  const removeAccount = useCallback(async (id) => {
    await api.post(`/imap/disconnect/${id}`);
    await fetchStatus();
  }, [fetchStatus]);

  const testAccount = useCallback(async (id) => {
    const r = await api.post(`/imap/test/${id}`);
    await fetchStatus(); // Status kann sich danach ändern (needs_reauth → active)
    return r.data;
  }, [fetchStatus]);

  // ── Listen laden ────────────────────────────────────────────────────────
  const _fetchList = useCallback(async (box, append, currentCursor) => {
    if (!activeIdRef.current) return [];
    const params = {
      account_id: activeIdRef.current,
      mailbox:    box,
      limit:      PAGE_SIZE,
    };
    if (append && currentCursor) params.cursor = currentCursor;
    const r = await api.get("/imap/emails", { params });
    return {
      items:      r.data?.emails ?? [],
      nextCursor: r.data?.next_cursor ?? null,
    };
  }, []);

  const fetchInboxEmails = useCallback(async ({ append } = {}) => {
    const { items, nextCursor } = await _fetchList("inbox", append, nextCursorInbox);
    setEmails(prev => append ? _mergeUnique(prev, items) : items);
    setNextCursorInbox(nextCursor);
    return items;
  }, [_fetchList, nextCursorInbox]);

  const fetchSentEmails = useCallback(async ({ append } = {}) => {
    const { items, nextCursor } = await _fetchList("sent", append, nextCursorSent);
    setSentEmails(prev => append ? _mergeUnique(prev, items) : items);
    setNextCursorSent(nextCursor);
    return items;
  }, [_fetchList, nextCursorSent]);

  // ── Suche ──────────────────────────────────────────────────────────────
  const searchEmails = useCallback(async (q, box = null) => {
    if (!activeIdRef.current) return [];
    const params = { q, account_id: activeIdRef.current };
    if (box) params.mailbox = box;
    const r = await api.get("/imap/emails/search", { params });
    return r.data?.emails ?? [];
  }, []);

  // ── Detail / open ──────────────────────────────────────────────────────
  const openEmail = useCallback(async (id) => {
    if (!id) return null;
    try {
      const r = await api.get(`/imap/emails/${id}`);
      const detail = r.data;
      setActiveEmail(detail);
      // Mark-Read async — UI hat lokal schon optimistisch markiert.
      if (detail && !detail.read) {
        api.patch(`/imap/emails/${id}/read`).catch(() => {});
      }
      return detail;
    } catch (e) {
      console.error("[ImapContext] openEmail", e);
      return null;
    }
  }, []);

  const closeEmail = useCallback(() => setActiveEmail(null), []);

  // ── Disconnect-Wrapper (active account) ────────────────────────────────
  const disconnectImap = useCallback(async () => {
    const id = activeIdRef.current;
    if (!id) return;
    await removeAccount(id);
  }, [removeAccount]);

  // ── Reset bei Account-Switch ───────────────────────────────────────────
  useEffect(() => {
    setEmails([]);
    setSentEmails([]);
    setActiveEmail(null);
    setNextCursorInbox(null);
    setNextCursorSent(null);
  }, [activeAccountId]);

  // ── Public Wert (mirroring GmailContext shape) ─────────────────────────
  const value = useMemo(() => ({
    // Mirror der Gmail-API
    connected: { connected: accounts.length > 0 },
    initializing,
    emails, sentEmails, activeEmail,
    hasMoreInbox: !!nextCursorInbox,
    hasMoreSent:  !!nextCursorSent,
    fetchStatus, fetchInboxEmails, fetchSentEmails,
    searchEmails, openEmail, closeEmail,
    connectImap: addAccount, disconnectImap,

    // IMAP-spezifisch
    accounts,
    activeAccountId,
    setActiveAccount: setActiveAccountId,
    activeAccount: accounts.find(a => a.id === activeAccountId) ?? null,
    addAccount, removeAccount, testAccount, reauthAccount,
    needsReauth: accounts.some(a => a.status === "needs_reauth"),
  }), [
    accounts, activeAccountId, initializing,
    emails, sentEmails, activeEmail,
    nextCursorInbox, nextCursorSent,
    fetchStatus, fetchInboxEmails, fetchSentEmails,
    searchEmails, openEmail, closeEmail,
    addAccount, disconnectImap, removeAccount, testAccount, reauthAccount,
  ]);

  return <ImapContext.Provider value={value}>{children}</ImapContext.Provider>;
};

// ── Helpers ──────────────────────────────────────────────────────────────

// Both arrays arrive sorted desc by received_at from the API.
// A linear O(n+m) merge replaces the O((n+m) log (n+m)) full re-sort that
// fired on every "load more" page.
function _mergeUnique(prev, more) {
  const seen = new Set(prev.map(e => e.id));
  const newItems = more.filter(m => !seen.has(m.id));
  if (!newItems.length) return prev;

  // Merge two descending-sorted arrays in a single pass.
  const result = [];
  let i = 0, j = 0;
  while (i < prev.length && j < newItems.length) {
    const ta = new Date(prev[i].received_at || 0).getTime();
    const tb = new Date(newItems[j].received_at || 0).getTime();
    if (ta >= tb) result.push(prev[i++]);
    else          result.push(newItems[j++]);
  }
  while (i < prev.length)    result.push(prev[i++]);
  while (j < newItems.length) result.push(newItems[j++]);
  return result;
}
