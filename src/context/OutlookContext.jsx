import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

export const OutlookContext = createContext({
  connected: false,
  loading: false,
  emails: [],
  fetchStatus: () => {},
  fetchEmails: () => {},
  connectOutlook: () => {},
  disconnectOutlook: () => {},
});

export const OutlookProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const lastFetch = useRef(0);

  // =====================================================
  // FETCH STATUS
  // =====================================================
  const fetchStatus = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetch.current < 5000) return;
    lastFetch.current = now;

    setLoading(true);
    try {
      const res = await api.get("/outlook/status");
      setConnected(res.data?.connected === true);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // CONNECT (redirect to FastAPI auth-url)
  // =====================================================
  const connectOutlook = useCallback(async () => {
    window.location.href = `${api.defaults.baseURL}/outlook/auth-url`;
  }, []);

  // =====================================================
  // DISCONNECT
  // =====================================================
  const disconnectOutlook = useCallback(async () => {
    setLoading(true);
    try {
      await api.post("/outlook/disconnect");
      setConnected(false);
      setEmails([]);
      await fetchStatus(true);
    } finally {
      setLoading(false);
    }
  }, [fetchStatus]);

  // =====================================================
  // FETCH EMAILS
  // =====================================================
  const fetchEmails = useCallback(async () => {
    if (!connected) return;

    setLoading(true);
    try {
      const res = await api.get("/outlook/emails");
      setEmails(res.data.emails || []);
    } finally {
      setLoading(false);
    }
  }, [connected]);

  // =====================================================
  // AUTO LOAD STATUS ON START
  // =====================================================
  useEffect(() => {
    fetchStatus(true);
  }, [fetchStatus]);

  return (
    <OutlookContext.Provider
      value={{
        connected,
        loading,
        emails,
        fetchStatus,
        fetchEmails,
        connectOutlook,
        disconnectOutlook,
      }}
    >
      {children}
    </OutlookContext.Provider>
  );
};
