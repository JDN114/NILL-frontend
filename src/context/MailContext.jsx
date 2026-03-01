import React, { createContext, useContext, useMemo, useRef, useEffect } from "react";
import { GmailContext } from "./GmailContext";
import { OutlookContext } from "./OutlookContext";

export const MailContext = createContext(null);

export const MailProvider = ({ children }) => {
  const gmail = useContext(GmailContext);
  const outlook = useContext(OutlookContext);

  const initializedRef = useRef(false);

  // =====================================================
  // Entscheide Provider
  // =====================================================
  const provider = useMemo(() => {
    if (outlook?.connected?.connected) return "outlook";
    if (gmail?.connected?.connected) return "gmail";
    return null;
  }, [outlook?.connected?.connected, gmail?.connected?.connected]);

  // =====================================================
  // Einheitliche Emails: inbox / sent
  // =====================================================
  const emails = useMemo(() => {
    if (!provider) return [];

    if (provider === "outlook") {
      // Outlook liefert mailbox direkt: inbox/sent
      return outlook.emails ?? [];
    }

    if (provider === "gmail") {
      // Gmail: emails = inbox, sentEmails = sent
      return [...(gmail.emails ?? []), ...(gmail.sentEmails ?? [])];
    }

    return [];
  }, [provider, outlook.emails, gmail.emails, gmail.sentEmails]);

  // Get filtered by mailbox
  const inboxEmails = useMemo(
    () => emails.filter((m) => m.mailbox === "inbox"),
    [emails]
  );

  const sentEmails = useMemo(
    () => emails.filter((m) => m.mailbox === "sent"),
    [emails]
  );

  // =====================================================
  // Aktive Email
  // =====================================================
  const activeEmail =
    provider === "outlook"
      ? outlook.activeEmail ?? null
      : provider === "gmail"
      ? gmail.activeEmail ?? null
      : null;

  // =====================================================
  // Einheitliches fetchEmails, optional nach mailbox
  // =====================================================
  const fetchEmails = async (box = null) => {
    try {
      if (provider === "outlook") {
        const fetched = await outlook.fetchEmails();
        if (!box) return fetched;
        return fetched.filter((m) => m.mailbox === box);
      }
      if (provider === "gmail") {
        // Inbox
        if (box === "inbox") await gmail.fetchInboxEmails();
        // Sent
        else if (box === "sent") await gmail.fetchSentEmails();
        // return combined or filtered
        const all = [...(gmail.emails ?? []), ...(gmail.sentEmails ?? [])];
        return box ? all.filter((m) => m.mailbox === box) : all;
      }
      return [];
    } catch (err) {
      console.error("MailContext fetchEmails Fehler:", err);
      return [];
    }
  };

  // =====================================================
  // Open / Close Email
  // =====================================================
  const openEmail = async (id) => {
    if (!id) return null;
    if (provider === "outlook") return outlook.openEmail(id);
    if (provider === "gmail") return gmail.openEmail(id);
    return null;
  };

  const closeEmail = () => {
    if (provider === "outlook") return outlook.closeEmail();
    if (provider === "gmail") return gmail.closeEmail();
  };

  // =====================================================
  // Fetch nur einmal beim Provider-Wechsel
  // =====================================================
  useEffect(() => {
    if (!provider || initializedRef.current) return;
    initializedRef.current = true;
    fetchEmails();
  }, [provider]);

  return (
    <MailContext.Provider
      value={{
        provider,
        connected: provider !== null,
        emails,
        inboxEmails,
        sentEmails,
        activeEmail,
        fetchEmails,
        openEmail,
        closeEmail,
      }}
    >
      {children}
    </MailContext.Provider>
  );
};
