import React, { createContext, useContext, useMemo, useRef, useEffect } from "react";
import { GmailContext } from "./GmailContext";
import { OutlookContext } from "./OutlookContext";

export const MailContext = createContext(null);

export const MailProvider = ({ children }) => {
  const gmail = useContext(GmailContext);
  const outlook = useContext(OutlookContext);
  const initializedRef = useRef(false);

  const provider = useMemo(() => {
    if (outlook?.connected?.connected) return "outlook";
    if (gmail?.connected?.connected) return "gmail";
    return null;
  }, [outlook?.connected?.connected, gmail?.connected?.connected]);

  const emails = useMemo(() => {
    if (!provider) return [];
    if (provider === "outlook") return outlook.emails ?? [];
    if (provider === "gmail") return [...(gmail.emails ?? []), ...(gmail.sentEmails ?? [])];
    return [];
  }, [provider, outlook.emails, gmail.emails, gmail.sentEmails]);

  const inboxEmails = useMemo(() => emails.filter((m) => m.mailbox === "inbox"), [emails]);
  const sentEmails = useMemo(() => emails.filter((m) => m.mailbox === "sent"), [emails]);

  const activeEmail =
    provider === "outlook"
      ? outlook.activeEmail ?? null
      : provider === "gmail"
      ? gmail.activeEmail ?? null
      : null;

  const fetchEmails = async (box = null) => {
    try {
      if (provider === "outlook") {
        const fetched = await outlook.fetchEmails();
        if (!box) return fetched;
        return fetched.filter((m) => m.mailbox === box);
      }
      if (provider === "gmail") {
        if (box === "inbox") await gmail.fetchInboxEmails();
        else if (box === "sent") await gmail.fetchSentEmails();
        const all = [...(gmail.emails ?? []), ...(gmail.sentEmails ?? [])];
        return box ? all.filter((m) => m.mailbox === box) : all;
      }
      return [];
    } catch (err) {
      console.error("MailContext fetchEmails Fehler:", err);
      return [];
    }
  };

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
