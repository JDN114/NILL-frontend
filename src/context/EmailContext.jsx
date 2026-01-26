// src/context/EmailContext.jsx
import React, { createContext, useState, useContext } from "react";
import api from "../services/api";

const EmailContext = createContext(null);

export function EmailProvider({ children }) {
  const [emails, setEmails] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchNextPage = async () => {
    if (loading) return; // ✅ verhindert Doppelaufrufe
    setLoading(true);
    try {
      const res = await api.get(`/gmail/emails?limit=10&page=${page}`);
      setEmails((prev) => [...prev, ...(res.data.emails || [])]);
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
}

export function useEmails() {
  const context = useContext(EmailContext);
  if (!context) throw new Error("useEmails muss innerhalb von EmailProvider genutzt werden");
  return context;
}
