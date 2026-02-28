import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
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

  const lastStatusFetch = useRef(0);

  const statusFetchingRef = useRef(false);
  const emailsFetchingRef = useRef(false);
  const emailsBlockedRef = useRef(false);

  // =====================================================
  // FETCH STATUS
  // =====================================================
  const fetchStatus = useCallback(async (force = false) => {
    const now = Date.now();

    if (statusFetchingRef.current) return;

    if (!force && now - lastStatusFetch.current < 10000) return;

    statusFetchingRef.current = true;
    lastStatusFetch.current = now;

    setLoadingStatus(true);

    try {
      const res = await api.get("/outlook/status");

      const isConnected = res.data?.connected === true;

      setConnected(isConnected);

    } catch (err) {

      console.error("Outlook status error:", err?.message);

      setConnected(false);

    } finally {

      setLoadingStatus(false);
      statusFetchingRef.current = false;

    }

  }, []);

  // =====================================================
  // FETCH EMAILS (FIXED)
  // =====================================================
  const fetchEmails = useCallback(async () => {

    if (!connected) return;

    if (emailsFetchingRef.current) return;

    if (emailsBlockedRef.current) return;

    emailsFetchingRef.current = true;

    setLoadingEmails(true);

    try {

      const res = await api.get("/outlook/emails");

      if (res?.data?.emails) {

        setEmails(res.data.emails);

      }

    } catch (err) {

      if (err?.response?.status === 429) {

        console.warn("Outlook rate limited — blocking requests temporarily");

        emailsBlockedRef.current = true;

        setTimeout(() => {

          emailsBlockedRef.current = false;

        }, 30000);

      } else {

        console.error("Outlook emails fetch failed:", err?.message);

      }

    } finally {

      setLoadingEmails(false);

      emailsFetchingRef.current = false;

    }

  }, [connected]);

  // =====================================================
  // AUTO LOAD EMAILS WHEN CONNECTED
  // =====================================================
  useEffect(() => {

    if (connected) {

      fetchEmails();

    }

  }, [connected, fetchEmails]);

  // =====================================================
  // CONNECT
  // =====================================================
  const connectOutlook = useCallback(() => {

    window.location.href =
      `${api.defaults.baseURL}/outlook/auth-url`;

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

    } catch (err) {

      console.error("Disconnect failed:", err?.message);

    } finally {

      setLoadingEmails(false);

    }

  }, []);

  // =====================================================
  // INITIAL LOAD
  // =====================================================
  useEffect(() => {

    fetchStatus(true);

  }, [fetchStatus]);

  // =====================================================
  // CONTEXT
  // =====================================================
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
