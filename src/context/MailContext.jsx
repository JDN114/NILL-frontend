import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useEffect,
} from "react";

import { GmailContext } from "./GmailContext";
import { OutlookContext } from "./OutlookContext";

export const MailContext = createContext(null);

export const MailProvider = ({ children }) => {

  const gmail = useContext(GmailContext);
  const outlook = useContext(OutlookContext);

  const initializedRef = useRef(false);

  // decide provider
  const provider = useMemo(() => {

    if (outlook?.connected?.connected)
      return "outlook";

    if (gmail?.connected?.connected)
      return "gmail";

    return null;

  }, [
    outlook?.connected?.connected,
    gmail?.connected?.connected
  ]);

  // unified emails
  const emails = useMemo(() => {

    if (provider === "outlook")
      return outlook.emails || [];

    if (provider === "gmail")
      return gmail.emails || [];

    return [];

  }, [provider, outlook.emails, gmail.emails]);

  // unified active email
  const activeEmail =
    provider === "outlook"
      ? outlook.activeEmail
      : provider === "gmail"
      ? gmail.activeEmail
      : null;

  // unified fetch — SAFE
  const fetchEmails = async () => {

    if (provider === "outlook")
      await outlook.fetchEmails();

    if (provider === "gmail")
      await gmail.fetchInboxEmails();

  };

  // FETCH ONLY ONCE
  useEffect(() => {

    if (!provider)
      return;

    if (initializedRef.current)
      return;

    initializedRef.current = true;

    fetchEmails();

  }, [provider]);

  const openEmail = async (id) => {

    if (provider === "outlook")
      return outlook.openEmail(id);

    if (provider === "gmail")
      return gmail.openEmail(id);

  };

  const closeEmail = () => {

    if (provider === "outlook")
      return outlook.closeEmail();

    if (provider === "gmail")
      return gmail.closeEmail();

  };

  const value = {

    provider,

    connected: provider !== null,

    emails,

    activeEmail,

    fetchEmails,

    openEmail,

    closeEmail,

  };

  return (
    <MailContext.Provider value={value}>
      {children}
    </MailContext.Provider>
  );
};
