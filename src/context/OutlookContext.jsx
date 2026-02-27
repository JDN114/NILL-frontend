import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

export const OutlookContext = createContext();

export const OutlookProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const lastStatusFetch = useRef(0);

  // ----------------------------------
  // Status prüfen
  // ----------------------------------
  const fetchStatus = useCallback(async () => {
    try {
      const now = Date.now();
      if (now - lastStatusFetch.current < 5000) return; // max 1x alle 5s
      lastStatusFetch.current = now;

      const res = await api.get("/outlook/status");
      setConnected(res.data?.connected === true);

      if (!res.data?.connected) setEmails([]);
    } catch (err) {
      console.error("Outlook status error:", err);
      setConnected(false);
      setEmails([]);
    }
  }, []);

  // ----------------------------------
  // Connect / Disconnect
  // ----------------------------------
  const connectOutlook = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/outlook/auth-url`;
  };

  const disconnectOutlook = useCallback(async () => {
    try {
      const res = await api.post("/outlook/disconnect");
      if (res.data?.success) {
        setConnected(false);
        setEmails([]);
        setActiveEmail(null);
      }
    } catch (err) {
      console.error("Outlook disconnect error:", err);
    }
  }, []);

  // ----------------------------------
  // Emails laden
  // ----------------------------------
  const fetchEmails = useCallback(async () => {
    if (!connected) return;
    setLoading(true);
    try {
      const res = await api.get("/outlook/emails");
      setEmails(res.data?.emails || []);
    } catch (err) {
      console.error("Outlook emails error:", err);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  }, [connected]);

  // ----------------------------------
  // Email Detail
  // ----------------------------------
  const openEmail = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    try {
      const res = await api.get(`/outlook/emails/${id}`);
      setActiveEmail(res.data);
      return res.data;
    } catch (err) {
      console.error("Outlook email detail error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const closeEmail = () => setActiveEmail(null);

  // Auto-fetch status beim Mount
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <OutlookContext.Provider
      value={{
        connected,
        emails,
        activeEmail,
        loading,
        fetchStatus,
        connectOutlook,
        disconnectOutlook,
        fetchEmails,
        openEmail,
        closeEmail,
      }}
    >
      {children}
    </OutlookContext.Provider>
  );
};
