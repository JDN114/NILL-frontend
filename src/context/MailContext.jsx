kimport React, { createContext, useContext, useMemo } from "react";
import { GmailContext } from "./GmailContext";
import { OutlookContext } from "./OutlookContext";

export const MailContext = createContext(null);

export const MailProvider = ({ children }) => {
  const gmail   = useContext(GmailContext);
  const outlook = useContext(OutlookContext);

  const provider = useMemo(() => {
    if (outlook?.connected?.connected) return "outlook";
    if (gmail?.connected?.connected)   return "gmail";
    return null;
  }, [outlook?.connected?.connected, gmail?.connected?.connected]);

  const initializing = useMemo(() => {
    if (provider === "outlook") return outlook?.initializing ?? false;
    if (provider === "gmail")   return gmail?.initializing   ?? false;
    const gmailPending   = gmail?.connected   === null;
    const outlookPending = outlook?.connected === null;
    return gmailPending || outlookPending;
  }, [provider, gmail?.initializing, outlook?.initializing, gmail?.connected, outlook?.connected]);

  const emails = useMemo(() => {
    if (!provider) return [];
    if (provider === "outlook") return outlook?.emails ?? [];
    if (provider === "gmail")   return [...(gmail?.emails ?? []), ...(gmail?.sentEmails ?? [])];
    return [];
  }, [provider, outlook?.emails, gmail?.emails, gmail?.sentEmails]);

  const activeEmail = useMemo(() => {
    if (provider === "outlook") return outlook?.activeEmail ?? null;
    if (provider === "gmail")   return gmail?.activeEmail   ?? null;
    return null;
  }, [provider, outlook?.activeEmail, gmail?.activeEmail]);

  const hasMore = useMemo(() => {
    if (provider === "gmail") return { inbox: gmail?.hasMoreInbox, sent: gmail?.hasMoreSent };
    return { inbox: false, sent: false };
  }, [provider, gmail?.hasMoreInbox, gmail?.hasMoreSent]);

  // Normales Laden (Lazy Loading — append=true für "Mehr laden")
  const fetchEmails = async (box = null, append = false) => {
    if (!provider) return [];
    if (provider === "outlook") {
      const f = await outlook.fetchEmails();
      return box ? f.filter(m => m.mailbox === box) : f;
    }
    if (provider === "gmail") {
      if (box === "inbox") return await gmail.fetchInboxEmails({ append });
      if (box === "sent")  return await gmail.fetchSentEmails({ append });
      const [inbox, sent] = await Promise.all([
        gmail.fetchInboxEmails({ append }),
        gmail.fetchSentEmails({ append }),
      ]);
      return [...inbox, ...sent];
    }
    return [];
  };

  // DB-seitige Suche — findet auch alte Emails
  const searchEmails = async (q, box = null) => {
    if (!provider) return [];
    if (provider === "gmail") return await gmail.searchEmails(q, box);
    // Outlook: client-side fallback auf gecachte Emails
    const all = emails;
    const ql  = q.toLowerCase();
    return all.filter(m =>
      (m.subject || "").toLowerCase().includes(ql) ||
      (m.from_address || m.from || "").toLowerCase().includes(ql)
    );
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
    <MailContext.Provider value={{
      provider, connected: provider !== null,
      emails, activeEmail, initializing, hasMore,
      fetchEmails, searchEmails, openEmail, closeEmail, disconnectProvider,
    }}>
      {children}
    </MailContext.Provider>
  );
};
