import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

export const OutlookContext = createContext({
  connected: false,
  loadingStatus: false,
  loadingEmails: false,
  emails: [],
  fetchStatus: () => {},
  fetchEmails: () => {},
  connectOutlook: () => {},
  disconnectOutlook: () => {},
});

export const OutlookProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const lastFetch = useRef(0);

  // =====================================================
  // FETCH STATUS
  // =====================================================
  const fetchStatus = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetch.current < 5000) return;
    lastFetch.current = now;

    setLoadingStatus(true);
    try {
      const res = await api.get("/outlook/status");
      setConnected(res.data?.connected === true);
    } catch {
      setConnected(false);
    } finally {
      setLoadingStatus(false);
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
    setLoadingEmails(true);
    try {
      await api.post("/outlook/disconnect");
      setConnected(false);
      setEmails([]);
      await fetchStatus(true);
    } finally {
      setLoadingEmails(false);
    }
  }, [fetchStatus]);

  // =====================================================
  // FETCH EMAILS
  // =====================================================
  const fetchEmails = useCallback(async () => {
    if (!connected) return;

    setLoadingEmails(true);
    try {
      const res = await api.get("/outlook/emails");
      setEmails(res.data.emails || []);
    } finally {
      setLoadingEmails(false);
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
        loadingStatus,
        loadingEmails,
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
