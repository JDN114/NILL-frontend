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
  loadingDetail: false,

  emails: [],
  activeEmail: null,

  fetchStatus: () => {},
  fetchEmails: () => {},

  openEmail: () => {},
  closeEmail: () => {},

  connectOutlook: () => {},
  disconnectOutlook: () => {},

});

export const OutlookProvider = ({ children }) => {

  const [connected, setConnected] = useState(false);

  const [emails, setEmails] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const lastStatusFetch = useRef(0);

  const statusFetchingRef = useRef(false);
  const emailsFetchingRef = useRef(false);

  const emailsBlockedRef = useRef(false);

  // =====================================================
  // FETCH STATUS
  // =====================================================

  const fetchStatus = useCallback(async (force = false) => {

    const now = Date.now();

    if (statusFetchingRef.current)
      return;

    if (!force && now - lastStatusFetch.current < 10000)
      return;

    statusFetchingRef.current = true;
    lastStatusFetch.current = now;

    setLoadingStatus(true);

    try {

      const res = await api.get("/outlook/status");

      const isConnected =
        res.data?.connected === true;

      setConnected(isConnected);

    } catch (err) {

      console.error(
        "Outlook status error:",
        err?.message
      );

      setConnected(false);

    } finally {

      setLoadingStatus(false);

      statusFetchingRef.current = false;

    }

  }, []);

  // =====================================================
  // FETCH EMAIL LIST
  // =====================================================

  const fetchEmails = useCallback(async () => {

    if (!connected)
      return;

    if (emailsFetchingRef.current)
      return;

    if (emailsBlockedRef.current)
      return;

    emailsFetchingRef.current = true;

    setLoadingEmails(true);

    try {

      const res =
        await api.get("/outlook/emails");

      if (res?.data?.emails) {

        setEmails(res.data.emails);

      }

    } catch (err) {

      if (err?.response?.status === 429) {

        console.warn(
          "Outlook rate limited — blocking temporarily"
        );

        emailsBlockedRef.current = true;

        setTimeout(() => {

          emailsBlockedRef.current = false;

        }, 30000);

      } else {

        console.error(
          "Outlook emails fetch failed:",
          err?.message
        );

      }

    } finally {

      setLoadingEmails(false);

      emailsFetchingRef.current = false;

    }

  }, [connected]);

  // =====================================================
  // OPEN EMAIL (DETAIL)
  // =====================================================

  const openEmail = useCallback(async (emailId) => {

    if (!emailId)
      return;

    setLoadingDetail(true);

    try {

      const res =
        await api.get(
          `/outlook/emails/${emailId}`
        );

      setActiveEmail(res.data);

    } catch (err) {

      console.error(
        "Outlook detail fetch failed:",
        err?.message
      );

    } finally {

      setLoadingDetail(false);

    }

  }, []);

  // =====================================================
  // CLOSE EMAIL
  // =====================================================

  const closeEmail = useCallback(() => {

    setActiveEmail(null);

  }, []);

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

  const disconnectOutlook =
    useCallback(async () => {

      setLoadingEmails(true);

      try {

        await api.post(
          "/outlook/disconnect"
        );

        setConnected(false);

        setEmails([]);

        setActiveEmail(null);

      } catch (err) {

        console.error(
          "Disconnect failed:",
          err?.message
        );

      } finally {

        setLoadingEmails(false);

      }

    }, []);

  // =====================================================
  // AUTO LOAD STATUS
  // =====================================================

  useEffect(() => {

    fetchStatus(true);

  }, [fetchStatus]);

  // =====================================================
  // AUTO LOAD EMAILS AFTER CONNECT
  // =====================================================

  useEffect(() => {

    if (connected)
      fetchEmails();

  }, [connected, fetchEmails]);

  // =====================================================
  // PROVIDER
  // =====================================================

  return (

    <OutlookContext.Provider

      value={{

        connected,

        loadingStatus,
        loadingEmails,
        loadingDetail,

        emails,
        activeEmail,

        fetchStatus,
        fetchEmails,

        openEmail,
        closeEmail,

        connectOutlook,
        disconnectOutlook,

      }}

    >

      {children}

    </OutlookContext.Provider>

  );

};
