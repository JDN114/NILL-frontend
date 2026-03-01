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

  const [activeEmail, setActiveEmail] = useState(null);

  const [initializing, setInitializing] =
    useState(false);

  const lastStatusFetch = useRef(0);

  // =====================================================
  // STATUS CHECK
  // =====================================================

  const fetchStatus = useCallback(async () => {

    try {

      const now = Date.now();

      if (
        now - lastStatusFetch.current
        < 60000
      ) return;

      lastStatusFetch.current = now;

      const res =
        await api.get("/outlook/status");

      const data = res.data || {
        connected: false
      };

      setConnected(data);

      if (!data.connected) {

        setEmails([]);

        setActiveEmail(null);

      }

    } catch (err) {

      console.error(
        "Outlook status error:",
        err?.message
      );

      setConnected({
        connected: false
      });

      setEmails([]);

      setActiveEmail(null);

    }

  }, []);

  // =====================================================
  // FETCH EMAIL LIST
  // =====================================================

  const fetchEmails = useCallback(
    async () => {

      if (!connected?.connected)
        return;

      setInitializing(true);

      try {

        const res =
          await api.get(
            "/outlook/emails"
          );

        setEmails(
          res.data?.emails || []
        );

      } catch (err) {

        console.error(
          "Outlook fetch error:",
          err?.message
        );

      } finally {

        setInitializing(false);

      }

    },
    [connected]
  );

  // =====================================================
  // OPEN EMAIL DETAIL
  // =====================================================

  const openEmail = useCallback(
    async (id) => {

      if (!id)
        return;

      const loadEmail =
        async () => {

          try {

            const res =
              await api.get(
                `/outlook/emails/${id}`
              );

            setActiveEmail(
              res.data
            );

            return res.data;

          } catch (err) {

            console.error(
              "Detail error:",
              err?.message
            );

            return null;

          }

        };

      setInitializing(true);

      const first =
        await loadEmail();

      setInitializing(false);

      if (
        first?.ai_status
        !== "success"
      ) {

        const poll =
          async () => {

            const refreshed =
              await loadEmail();

            if (
              refreshed?.ai_status
              !== "success"
            ) {

              setTimeout(
                poll,
                1500
              );

            }

          };

        setTimeout(poll, 1500);

      }

    },
    []
  );

  // =====================================================
  // CLOSE EMAIL
  // =====================================================

  const closeEmail = useCallback(() => {

    setActiveEmail(null);

  }, []);

  // =====================================================
  // CONNECT
  // =====================================================

  const connectOutlook = () => {

    window.location.href =
      `${api.defaults.baseURL}/outlook/auth-url`;

  };

  // =====================================================
  // DISCONNECT
  // =====================================================

  const disconnectOutlook =
    useCallback(async () => {

      try {

        await api.post(
          "/outlook/disconnect"
        );

        setConnected({
          connected: false
        });

        setEmails([]);

        setActiveEmail(null);

      } catch (err) {

        console.error(
          "Disconnect error:",
          err?.message
        );

      }

    }, []);

  // =====================================================
  // INITIAL STATUS LOAD
  // =====================================================

  useEffect(() => {

    fetchStatus();

  }, [fetchStatus]);

  // =====================================================
  // PROVIDER
  // =====================================================

  return (

    <OutlookContext.Provider

      value={{

        connected,

        emails,

        activeEmail,

        initializing,

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
