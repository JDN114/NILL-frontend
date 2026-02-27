import React,
{
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

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

export const OutlookProvider = ({ children }) =>
{
  const [connected, setConnected] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const lastFetch = useRef(0);

  // =====================================================
  // FETCH STATUS
  // =====================================================
  const fetchStatus = useCallback(async (force = false) =>
  {
    const now = Date.now();

    if (!force && now - lastFetch.current < 5000)
    {
      console.log("[OutlookContext] Status cached, skipping");
      return;
    }

    lastFetch.current = now;

    console.log("[OutlookContext] Fetching status...");

    setLoading(true);

    try
    {
      const res = await api.get("/outlook/status");

      console.log("[OutlookContext] Status response:", res.data);

      const isConnected = res.data?.connected === true;

      setConnected(isConnected);

      console.log("[OutlookContext] Connected =", isConnected);
    }
    catch (err)
    {
      console.error("[OutlookContext] Status error:", err);

      setConnected(false);
    }
    finally
    {
      setLoading(false);
    }

  }, []);

  // =====================================================
  // CONNECT (redirect to FastAPI auth-url)
  // =====================================================
  const connectOutlook = useCallback(async () =>
  {
    console.log("[OutlookContext] Starting OAuth flow");

    try
    {
      /*
      IMPORTANT:
      Your backend returns RedirectResponse.
      Browser must navigate directly.
      */

      window.location.href =
        `${api.defaults.baseURL}/outlook/auth-url`;

    }
    catch (err)
    {
      console.error("[OutlookContext] Connect error:", err);
    }

  }, []);

  // =====================================================
  // DISCONNECT
  // =====================================================
  const disconnectOutlook = useCallback(async () =>
  {
    console.log("[OutlookContext] Disconnect called");

    setLoading(true);

    try
    {
      const res = await api.post("/outlook/disconnect");

      console.log("[OutlookContext] Disconnect response:", res.data);

      setConnected(false);

      setEmails([]);

      await fetchStatus(true);
    }
    catch (err)
    {
      console.error("[OutlookContext] Disconnect error:", err);
    }
    finally
    {
      setLoading(false);
    }

  }, [fetchStatus]);

  // =====================================================
  // FETCH EMAILS
  // =====================================================
  const fetchEmails = useCallback(async () =>
  {
    console.log("[OutlookContext] Fetch emails");

    if (!connected)
    {
      console.log("[OutlookContext] Not connected, abort");

      return;
    }

    setLoading(true);

    try
    {
      const res = await api.get("/outlook/emails");

      console.log(
        "[OutlookContext] Emails received:",
        res.data?.emails?.length
      );

      setEmails(res.data.emails || []);
    }
    catch (err)
    {
      console.error("[OutlookContext] Email fetch error:", err);
    }
    finally
    {
      setLoading(false);
    }

  }, [connected]);

  // =====================================================
  // AUTO LOAD STATUS ON START
  // =====================================================
  useEffect(() =>
  {
    console.log("[OutlookContext] Provider mounted");

    fetchStatus(true);

  }, [fetchStatus]);

  // =====================================================
  // PROVIDER VALUE
  // =====================================================
  const value =
  {
    connected,
    loading,
    emails,

    fetchStatus,
    fetchEmails,

    connectOutlook,
    disconnectOutlook,
  };

  console.log("[OutlookContext] Provider state:", value);

  return (
    <OutlookContext.Provider value={value}>
      {children}
    </OutlookContext.Provider>
  );
};
