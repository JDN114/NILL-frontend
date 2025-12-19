import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export const GmailContext = createContext();

export const GmailProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [emails, setEmails] = useState([]);
  const [connected, setConnected] = useState(false);

  const fetchStatus = async () => {
    if (!token) return;
    try {
      const res = await api.get("/gmail/status", { headers: { Authorization: `Bearer ${token}` }});
      setConnected(res.data.connected);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEmails = async () => {
    if (!token) return;
    try {
      const res = await api.get("/gmail/emails", { headers: { Authorization: `Bearer ${token}` }});
      setEmails(res.data.emails || []);
    } catch (e) {
      console.error(e);
    }
  };

  const connectGmail = async () => {
    if (!token) return;
    try {
      const res = await api.get("/gmail/auth-url", { headers: { Authorization: `Bearer ${token}` }});
      window.location.href = res.data.auth_url;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <GmailContext.Provider value={{ emails, connected, fetchStatus, fetchEmails, connectGmail }}>
      {children}
    </GmailContext.Provider>
  );
};
