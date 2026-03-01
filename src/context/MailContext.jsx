import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";

import { GmailContext } from "./GmailContext";
import { OutlookContext } from "./OutlookContext";

export const MailContext = createContext(null);

export const MailProvider = ({ children }) => {

  const gmail = useContext(GmailContext);
  const outlook = useContext(OutlookContext);

  // =====================================================
  // SAFE CONNECTED CHECK
  // =====================================================

  const gmailConnected =
    gmail?.connected?.connected === true;

  const outlookConnected =
    outlook?.connected?.connected === true;

  // =====================================================
  // PROVIDER DETECTION
  // Outlook priority over Gmail
  // =====================================================

  const provider = useMemo(() => {

    if (outlookConnected)
      return "outlook";

    if (gmailConnected)
      return "gmail";

    return null;

  }, [gmailConnected, outlookConnected]);

  // =====================================================
  // UNIFIED STATE
  // =====================================================

  const connected =
    provider !== null;

  const emails = useMemo(() => {

    if (provider === "outlook")
      return outlook.emails || [];

    if (provider === "gmail")
      return gmail.emails || [];

    return [];

  }, [
    provider,
    gmail.emails,
    outlook.emails,
  ]);

  const activeEmail = useMemo(() => {

    if (provider === "outlook")
      return outlook.activeEmail;

    if (provider === "gmail")
      return gmail.activeEmail;

    return null;

  }, [
    provider,
    gmail.activeEmail,
    outlook.activeEmail,
  ]);

  const initializing =
    gmail.initializing ||
    outlook.initializing ||
    false;

  // =====================================================
  // UNIFIED ACTIONS
  // =====================================================

  const fetchEmails = useCallback(
    async (options = {}) => {

      if (provider === "outlook") {

        return outlook.fetchEmails();

      }

      if (provider === "gmail") {

        if (options.mailbox === "sent")
          return gmail.fetchSentEmails(options);

        return gmail.fetchInboxEmails(options);

      }

    },
    [provider, gmail, outlook]
  );

  const openEmail = useCallback(
    async (id) => {

      if (!id)
        return;

      if (provider === "outlook")
        return outlook.openEmail(id);

      if (provider === "gmail")
        return gmail.openEmail(id);

    },
    [provider, gmail, outlook]
  );

  const closeEmail = useCallback(() => {

    if (provider === "outlook")
      return outlook.closeEmail();

    if (provider === "gmail")
      return gmail.closeEmail();

  }, [provider, gmail, outlook]);

  const connect = useCallback(() => {

    if (provider === "outlook")
      return outlook.connectOutlook();

    return gmail.connectGmail();

  }, [provider, gmail, outlook]);

  const disconnect = useCallback(() => {

    if (provider === "outlook")
      return outlook.disconnectOutlook();

    if (provider === "gmail")
      return gmail.disconnectGmail();

  }, [provider, gmail, outlook]);

  // =====================================================
  // FINAL VALUE
  // =====================================================

  const value = {

    provider,          // "gmail" | "outlook" | null

    connected,         // true | false

    emails,

    activeEmail,

    initializing,

    fetchEmails,

    openEmail,

    closeEmail,

    connect,

    disconnect,

  };

  return (

    <MailContext.Provider value={value}>

      {children}

    </MailContext.Provider>

  );

};
