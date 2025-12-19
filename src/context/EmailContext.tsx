import React, { createContext, useState, useContext } from "react";
import api from "../services/api";

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
}

interface EmailContextType {
  emails: Email[];
  loading: boolean;
  fetchNextPage: () => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchNextPage = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/gmail/emails?limit=10&page=${page}`);
      setEmails((prev) => [...prev, ...res.data.emails]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Fehler beim Laden der Emails:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmailContext.Provider value={{ emails, loading, fetchNextPage }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmails = () => {
  const context = useContext(EmailContext);
  if (!context) throw new Error("useEmails muss innerhalb von EmailProvider genutzt werden");
  return context;
};
