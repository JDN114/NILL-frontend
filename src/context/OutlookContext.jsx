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
  const statusFetchingRef = useRef(false);

  const fetchStatus = useCallback(async (force = false) => {
    const now = Date.now();

    // verhindert Dauerfeuer
    if (statusFetchingRef.current) return;

    // verhindert zu häufige calls
    if (!force && now - lastFetch.current < 10000) return;

    statusFetchingRef.current = true;
    lastFetch.current = now;

    try {
      const res = await api.get("/outlook/status");
      setConnected(res.data?.connected === true);
    } catch {
      setConnected(false);
    } finally {
      statusFetchingRef.current = false;
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
  const emailsFetchingRef = useRef(false);

  const fetchEmails = useCallback(async () => {
    if (!connected) return;
    if (emailsFetchingRef.current) return;

    emailsFetchingRef.current = true;

    try {
      const res = await api.get("/outlook/emails");
      setEmails(res.data.emails || []);
    } finally {
      emailsFetchingRef.current = false;
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
