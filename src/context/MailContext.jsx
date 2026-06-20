// src/context/MailContext.jsx
//
// Vereinheitlicht Gmail + Outlook + IMAP. Provider-Auswahl-Logik:
//   1. Wenn der User explizit einen Active-Provider gesetzt hat
//      (localStorage 'nill.mail.provider'), nimm den.
//   2. Sonst: Outlook → Gmail → IMAP (erstes verbundenes wird genommen).
//
// Identische API wie zuvor (provider, connected, emails, activeEmail,
// initializing, hasMore, fetchEmails, searchEmails, openEmail, closeEmail,
// disconnectProvider). Neu: setActiveProvider, accountId, allProviders.
//
// EmailsPage / Modals nutzen `useMailApi()` für send/reply — der Hook macht
// automatisch das Routing zum richtigen Backend.

import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from "react";
import { GmailContext }   from "./GmailContext";
import { OutlookContext } from "./OutlookContext";
import { ImapContext }    from "./ImapContext";
import {
  sendEmail, sendEmailWithAttachments, replyToEmail, aiReply, attachmentUrl,
} from "../services/mailApi";

export const MailContext = createContext(null);

const PROVIDER_KEY = "nill.mail.provider";

export const MailProvider = ({ children }) => {
  const gmail   = useContext(GmailContext);
  const outlook = useContext(OutlookContext);
  const imap    = useContext(ImapContext);

  // Welche Provider sind tatsächlich verbunden?
  const gmailC   = !!gmail?.connected?.connected;
  const outlookC = !!outlook?.connected?.connected;
  const imapC    = !!imap?.connected?.connected;

  // Aktiver Provider: gespeicherte Wahl oder erster verbundener (Outlook > Gmail > IMAP).
  const [explicit, setExplicit] = useState(() => {
    try { return localStorage.getItem(PROVIDER_KEY); } catch { return null; }
  });

  const provider = useMemo(() => {
    const candidates = [];
    if (outlookC) candidates.push("outlook");
    if (gmailC)   candidates.push("gmail");
    if (imapC)    candidates.push("imap");
    if (explicit && candidates.includes(explicit)) return explicit;
    return candidates[0] ?? null;
  }, [explicit, outlookC, gmailC, imapC]);

  const setActiveProvider = useCallback((p) => {
    try {
      if (p) localStorage.setItem(PROVIDER_KEY, p);
      else   localStorage.removeItem(PROVIDER_KEY);
    } catch { /* ignore */ }
    setExplicit(p);
  }, []);

  // ── Initializing-Status zusammenführen ────────────────────────────────
  const initializing = useMemo(() => {
    // Always wait for ALL three to report before committing to any provider.
    // Without this, Outlook (whose .initializing defaults to false) resolves
    // first and triggers email loading before Gmail's status is known — users
    // never see the full provider list before emails start loading.
    const allStatusKnown =
      gmail?.connected !== null &&
      outlook?.connected !== null &&
      !imap?.initializing;

    if (!allStatusKnown) return true;

    // All statuses known — defer to the active provider's data-loading state.
    if (provider === "outlook") return outlook?.initializing ?? false;
    if (provider === "gmail")   return gmail?.initializing   ?? false;
    if (provider === "imap")    return imap?.initializing    ?? false;
    return false;
  }, [
    provider, gmail?.initializing, outlook?.initializing, imap?.initializing,
    gmail?.connected, outlook?.connected,
  ]);

  // ── Emails ────────────────────────────────────────────────────────────
  const emails = useMemo(() => {
    if (provider === "outlook") return outlook?.emails ?? [];
    if (provider === "gmail")   return [...(gmail?.emails ?? []), ...(gmail?.sentEmails ?? [])];
    if (provider === "imap")    return [...(imap?.emails ?? []), ...(imap?.sentEmails ?? [])];
    return [];
  }, [provider, outlook?.emails, gmail?.emails, gmail?.sentEmails, imap?.emails, imap?.sentEmails]);

  const activeEmail = useMemo(() => {
    if (provider === "outlook") return outlook?.activeEmail ?? null;
    if (provider === "gmail")   return gmail?.activeEmail   ?? null;
    if (provider === "imap")    return imap?.activeEmail    ?? null;
    return null;
  }, [provider, outlook?.activeEmail, gmail?.activeEmail, imap?.activeEmail]);

  const hasMore = useMemo(() => {
    if (provider === "gmail") return { inbox: gmail?.hasMoreInbox, sent: gmail?.hasMoreSent };
    if (provider === "imap")  return { inbox: imap?.hasMoreInbox,  sent: imap?.hasMoreSent };
    return { inbox: false, sent: false };
  }, [provider, gmail?.hasMoreInbox, gmail?.hasMoreSent, imap?.hasMoreInbox, imap?.hasMoreSent]);

  // ── Funktionen ────────────────────────────────────────────────────────

  const fetchEmails = useCallback(async (box = null, append = false) => {
    if (!provider) return [];
    if (provider === "outlook") {
      const f = await outlook.fetchEmails();
      return box ? f.filter(m => m.mailbox === box) : f;
    }
    if (provider === "gmail") {
      if (box === "inbox") return await gmail.fetchInboxEmails({ append });
      if (box === "sent")  return await gmail.fetchSentEmails({ append });
      const [a, b] = await Promise.all([
        gmail.fetchInboxEmails({ append }),
        gmail.fetchSentEmails({ append }),
      ]);
      return [...a, ...b];
    }
    if (provider === "imap") {
      if (box === "inbox") return await imap.fetchInboxEmails({ append });
      if (box === "sent")  return await imap.fetchSentEmails({ append });
      const [a, b] = await Promise.all([
        imap.fetchInboxEmails({ append }),
        imap.fetchSentEmails({ append }),
      ]);
      return [...a, ...b];
    }
    return [];
  }, [provider, outlook?.fetchEmails, gmail?.fetchInboxEmails, gmail?.fetchSentEmails,
      imap?.fetchInboxEmails, imap?.fetchSentEmails]);

  const searchEmails = useCallback(async (q, box = null) => {
    if (!provider) return [];
    if (provider === "gmail") return await gmail.searchEmails(q, box);
    if (provider === "imap")  return await imap.searchEmails(q, box);
    const all = outlook?.emails ?? [];
    const ql  = q.toLowerCase();
    return all.filter(m =>
      (m.subject || "").toLowerCase().includes(ql) ||
      (m.from_address || m.from || "").toLowerCase().includes(ql)
    );
  }, [provider, gmail?.searchEmails, imap?.searchEmails, outlook?.emails]);

  const openEmail = useCallback(async (id) => {
    if (!id) return null;
    if (provider === "outlook") return await outlook.openEmail(id);
    if (provider === "gmail")   return await gmail.openEmail(id);
    if (provider === "imap")    return await imap.openEmail(id);
    return null;
  }, [provider, outlook?.openEmail, gmail?.openEmail, imap?.openEmail]);

  const closeEmail = useCallback(() => {
    outlook?.closeEmail?.();
    gmail?.closeEmail?.();
    imap?.closeEmail?.();
  }, [outlook?.closeEmail, gmail?.closeEmail, imap?.closeEmail]);

  const disconnectProvider = useCallback(async () => {
    if (provider === "gmail")   return await gmail.disconnectGmail?.();
    if (provider === "outlook") return await outlook.disconnectOutlook?.();
    if (provider === "imap")    return await imap.disconnectImap?.();
  }, [provider, gmail?.disconnectGmail, outlook?.disconnectOutlook, imap?.disconnectImap]);

  // ── Account-Info für IMAP (UI-Switcher) ───────────────────────────────
  const imapAccounts      = imap?.accounts ?? [];
  const activeImapAccount = imap?.activeAccount ?? null;
  const setActiveImap     = imap?.setActiveAccount ?? (() => {});

  const accountId = provider === "imap" ? imap?.activeAccountId ?? null : null;

  // ── List of all available providers (für UI-Switcher) ─────────────────
  const allProviders = useMemo(() => {
    const out = [];
    if (outlookC) out.push({ key: "outlook", label: "Outlook" });
    if (gmailC)   out.push({ key: "gmail",   label: "Gmail" });
    if (imapC)    out.push({ key: "imap",    label: activeImapAccount?.email ?? "IMAP" });
    return out;
  }, [outlookC, gmailC, imapC, activeImapAccount]);

  return (
    <MailContext.Provider value={{
      provider, connected: provider !== null, accountId,
      emails, activeEmail, initializing, hasMore,
      fetchEmails, searchEmails, openEmail, closeEmail, disconnectProvider,

      // Multi-Provider-Switching
      allProviders, setActiveProvider,

      // Connect-Funktionen für Provider-Picker (auch im !connected-Zustand nutzbar)
      connectGmail:   gmail?.connectGmail   ?? null,
      connectOutlook: outlook?.connectOutlook ?? null,

      // IMAP-spezifisch durchgereicht
      imapAccounts,
      activeImapAccount,
      setActiveImap,
      imapNeedsReauth: !!imap?.needsReauth,
    }}>
      {children}
    </MailContext.Provider>
  );
};

/**
 * Provider-aware send/reply Hook für Modals.
 * Nutzung in EmailComposeModal / EmailReplyModal:
 *
 *   const mail = useMailApi();
 *   await mail.send(payload);
 *   await mail.reply(emailId, { body, files });
 *   const aiText = await mail.aiReply(emailId);
 */
export function useMailApi() {
  const ctx = useContext(MailContext);
  const provider  = ctx?.provider;
  const accountId = ctx?.accountId;

  return {
    provider,
    accountId,
    send:        (payload)               => sendEmail({ provider, accountId, payload }),
    sendWithAttachments: (payload, files) =>
                                            sendEmailWithAttachments({ provider, accountId, payload, files }),
    reply:       (emailId, opts)         => replyToEmail({ provider, emailId, ...(opts ?? {}) }),
    aiReply:     (emailId)               => aiReply({ provider, emailId }),
    attachmentUrl,
  };
}
