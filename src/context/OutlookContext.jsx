import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import api from "../services/api";

export const OutlookContext = createContext();

export const OutlookProvider = ({ children }) => {
  const [connected, setConnected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const lastFetch = useRef(0);

  // =====================================================
  // FETCH STATUS
  // =====================================================
  const fetchStatus = useCallback(async (force = false) => {
    const now = Date.now();

    if (!force && now - lastFetch.current < 5000) {
      console.log("[OutlookContext] Skipping status fetch (cached)");
      return;
    }

    lastFetch.current = now;

    console.log("[OutlookContext] Fetching Outlook status...");

    setLoading(true);

    try {
      const res = await api.get("/outlook/status");

      console.log("[OutlookContext] Status response:", res.data);

      setConnected(res.data.connected === true);
    } catch (err) {
      console.error("[OutlookContext] Status error:", err);

      setConnected(false);
    } finally {
      setLoading(false);

      console.log(
        "[OutlookContext] Fetch complete. Connected:",
        connected
      );
    }
  }, [connected]);

  // =====================================================
  // DISCONNECT
  // =====================================================
  const disconnect = useCallback(async () => {
    console.log("[OutlookContext] Disconnect called");

    try {
      const res = await api.post("/outlook/disconnect");

      console.log("[OutlookContext] Disconnect response:", res.data);

      setConnected(false);

      setEmails([]);

      // Force refresh to verify DB state
      await fetchStatus(true);

    } catch (err) {
      console.error("[OutlookContext] Disconnect error:", err);
    }
  }, [fetchStatus]);

  // =====================================================
  // FETCH EMAILS
  // =====================================================
  const fetchEmails = useCallback(async () => {
    console.log("[OutlookContext] Fetch emails called");

    if (!connected) {
      console.log("[OutlookContext] Not connected, skipping fetch");
      return;
    }

    setLoading(true);

    try {
      const res = await api.get("/outlook/emails");

      console.log(
        "[OutlookContext] Emails fetched:",
        res.data.emails?.length || 0
      );

      setEmails(res.data.emails || []);

    } catch (err) {
      console.error("[OutlookContext] Email fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [connected]);

  // =====================================================
  // INITIAL LOAD
  // =====================================================
  useEffect(() => {
    console.log("[OutlookContext] Provider mounted");

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
        disconnect,
      }}
    >
      {children}
    </OutlookContext.Provider>
  );
};
