import React, { createContext, useContext, useMemo } from "react";
import { GmailContext } from "./GmailContext";
import { OutlookContext } from "./OutlookContext";

export const MailContext = createContext(null);

export const MailProvider = ({ children }) => {
  const gmail   = useContext(GmailContext);
  const outlook = useContext(OutlookContext);

  // Provider-Auswahl: Outlook hat Vorrang wenn beide verbunden
  const provider = useMemo(() => {
    if (outlook?.connected?.connected) return "outlook";
    if (gmail?.connected?.connected)   return "gmail";
    return null;
  }, [outlook?.connected?.connected, gmail?.connected?.connected]);

  // initializing: true solange der aktive Provider seinen Status noch lädt
  const initializing = useMemo(() => {
    if (provider === "outlook") return outlook?.initializing ?? false;
    if (provider === "gmail")   return gmail?.initializing   ?? false;
    // Kein Provider — warten bis beide Statuses geladen sind
    // (connected === null bedeutet: noch nie gefetcht)
    const gmailPending   = gmail?.connected   === null;
    const outlookPending = outlook?.connected === null;
    return gmailPending || outlookPending;
  }, [provider, gmail?.initializing, outlook?.initializing, gmail?.connected, outlook?.connected]);

  // Gecachte Email-Listen aus den Sub-Contexts
  const emails = useMemo(() => {
    if (!provider) return [];
    if (provider === "outlook") return outlook.emails ?? [];
    if (provider === "gmail")   return [...(gmail.emails ?? []), ...(gmail.sentEmails ?? [])];
    return [];
  }, [provider, outlook?.emails, gmail?.emails, gmail?.sentEmails]);

  const activeEmail = useMemo(() => {
    if (provider === "outlook") return outlook?.activeEmail ?? null;
    if (provider === "gmail")   return gmail?.activeEmail   ?? null;
    return null;
  }, [provider, outlook?.activeEmail, gmail?.activeEmail]);

  // --------------------------------------------------
  // fetchEmails — kein eigener useEffect nötig, EmailsPage ruft direkt auf
  // --------------------------------------------------
  const fetchEmails = async (box = null) => {
    if (!provider) return [];

    if (provider === "outlook") {
      const fetched = await outlook.fetchEmails();
      return box ? fetched.filter((m) => m.mailbox === box) : fetched;
    }

    if (provider === "gmail") {
      if (box === "inbox") {
        return await gmail.fetchInboxEmails();
      }
      if (box === "sent") {
        return await gmail.fetchSentEmails();
      }
      // Beide parallel laden
      const [inbox, sent] = await Promise.all([
        gmail.fetchInboxEmails(),
        gmail.fetchSentEmails(),
      ]);
      return [...inbox, ...sent];
    }

    return [];
  };

  const openEmail = async (id) => {
    if (!id) return null;
    if (provider === "outlook") return await outlook.openEmail(id);
    if (provider === "gmail")   return await gmail.openEmail(id);
    return null;
  };

  const closeEmail = () => {
    if (provider === "outlook") outlook.closeEmail?.();
    if (provider === "gmail")   gmail.closeEmail?.();
  };

  const disconnectProvider = async () => {
    if (provider === "gmail")   return await gmail.disconnectGmail?.();
    if (provider === "outlook") return await outlook.disconnectOutlook?.();
  };

  return (
    <MailContext.Provider
      value={{
        provider,
        connected: provider !== null,
        emails,
        activeEmail,
        initializing,
        fetchEmails,
        openEmail,
        closeEmail,
        disconnectProvider,
      }}
    >
      {children}
    </MailContext.Provider>
  );
};
