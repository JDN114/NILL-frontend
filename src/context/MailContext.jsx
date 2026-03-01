import React, { createContext, useContext, useMemo, useEffect } from "react";
import { GmailContext } from "./GmailContext";
import { OutlookContext } from "./OutlookContext";

export const MailContext = createContext(null);

export const MailProvider = ({ children }) => {
  const gmail = useContext(GmailContext);
  const outlook = useContext(OutlookContext);

  const provider = useMemo(() => {
    if (outlook?.connected?.connected) return "outlook";
    if (gmail?.connected?.connected) return "gmail";
    return null;
  }, [outlook?.connected?.connected, gmail?.connected?.connected]);

  const emails = useMemo(() => {
    if (!provider) return [];
    if (provider === "outlook") return outlook.emails ?? [];
    if (provider === "gmail")
      return [...(gmail.emails ?? []), ...(gmail.sentEmails ?? [])];
    return [];
  }, [provider, outlook.emails, gmail.emails, gmail.sentEmails]);

  const activeEmail =
    provider === "outlook"
      ? outlook.activeEmail
      : provider === "gmail"
      ? gmail.activeEmail
      : null;

  const fetchEmails = async (box = null) => {
    if (!provider) return [];
    if (provider === "outlook") {
      const fetched = await outlook.fetchEmails();
      return box ? fetched.filter((m) => m.mailbox === box) : fetched;
    }
    if (provider === "gmail") {
      let inbox = gmail.emails ?? [];
      let sent = gmail.sentEmails ?? [];

      if (box === "inbox") {
        inbox = await gmail.fetchInboxEmails();
      }
      else if (box === "sent") {
        sent = await gmail.fetchSentEmails();
      }
      else {
        inbox = await gmail.fetchInboxEmails();
        sent = await gmail.fetchSentEmails();
      }

      const all = [...inbox, ...sent];
      return box ? all.filter(m => m.mailbox === box) : all;
    }

    return [];
  };

  const openEmail = async (id) => {
    if (!id) return null;
    if (provider === "outlook") return await outlook.openEmail(id);
    if (provider === "gmail") return await gmail.openEmail(id);
    return null;
  };

  const closeEmail = () => {
    if (provider === "outlook") return outlook.closeEmail();
    if (provider === "gmail") return gmail.closeEmail();
  };

  useEffect(() => {
    if (provider) fetchEmails();
  }, [provider]);

  return (
    <MailContext.Provider
      value={{
        provider,
        connected: provider !== null,
        emails,
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
