import React, { createContext, useContext, useMemo, useRef, useEffect } from "react";
import { GmailContext } from "./GmailContext";
import { OutlookContext } from "./OutlookContext";

export const MailContext = createContext(null);

export const MailProvider = ({ children }) => {
  const gmail = useContext(GmailContext);
  const outlook = useContext(OutlookContext);

  const initializedRef = useRef(false);

  // Entscheide Provider
  const provider = useMemo(() => {
    if (outlook?.connected?.connected) return "outlook";
    if (gmail?.connected?.connected) return "gmail";
    return null;
  }, [outlook?.connected?.connected, gmail?.connected?.connected]);

  // Vereinheitlichte Emails
  const emails = useMemo(() => {
    if (provider === "outlook") return outlook.emails ?? [];
    if (provider === "gmail") return gmail.emails ?? [];
    return [];
  }, [provider, outlook.emails, gmail.emails]);

  // Aktive Email
  const activeEmail =
    provider === "outlook"
      ? outlook.activeEmail ?? null
      : provider === "gmail"
      ? gmail.activeEmail ?? null
      : null;

  // Einheitliches fetchEmails, gibt Array zurück
  const fetchEmails = async () => {
    try {
      if (provider === "outlook") {
        await outlook.fetchEmails();
        return outlook.emails ?? [];
      }
      if (provider === "gmail") {
        await gmail.fetchInboxEmails();
        return gmail.emails ?? [];
      }
      return [];
    } catch (err) {
      console.error("MailContext fetchEmails Fehler:", err);
      return [];
    }
  };

  // Open / Close Email
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

  // Fetch nur einmal beim Provider-Wechsel
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
