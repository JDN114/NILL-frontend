// src/context/GmailContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const GmailContext = createContext();

export const GmailProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [emails, setEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  // ---------------- Fetch Functions ----------------
  const fetchInboxEmails = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get("/api/gmail/emails?mailbox=inbox");
      setEmails(res.data.emails || []);
    } catch (err) {
      console.error("Fehler beim Laden des Posteingangs:", err);
      setError("Fehler beim Laden des Posteingangs");
    }
  }, [user]);

  const fetchSentEmails = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get("/api/gmail/emails?mailbox=sent");
      setSentEmails(res.data.emails || []);
    } catch (err) {
      console.error("Fehler beim Laden der Gesendet-Mails:", err);
      setError("Fehler beim Laden der Gesendet-Mails");
    }
  }, [user]);

  // ---------------- Active Email ----------------
  const openEmail = useCallback((id, mailbox = "inbox") => {
    const list = mailbox === "inbox" ? emails : sentEmails;
    const found = list.find((e) => e.id === id);
    if (found) setActiveEmail(found);
  }, [emails, sentEmails]);

  const closeEmail = useCallback(() => setActiveEmail(null), []);

  // ---------------- Initial Load ----------------
  useEffect(() => {
    if (!user) return;
    setInitializing(true);

    const load = async () => {
      await fetchInboxEmails();
      await fetchSentEmails();
      setInitializing(false);
    };

    load();
  }, [user, fetchInboxEmails, fetchSentEmails]);

  // ---------------- Optional: Polling alle 30s ----------------
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchInboxEmails();
      fetchSentEmails();
    }, 30000); // alle 30 Sekunden

    return () => clearInterval(interval);
  }, [user, fetchInboxEmails, fetchSentEmails]);

  return (
    <GmailContext.Provider
      value={{
        emails,
        sentEmails,
        activeEmail,
        initializing,
        error,
        openEmail,
        closeEmail,
        fetchInboxEmails,
        fetchSentEmails,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
};
