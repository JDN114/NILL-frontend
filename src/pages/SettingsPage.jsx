import React, { useEffect, useState } from "react";

export default function SettingsPage() {
  const [gmailConnected, setGmailConnected] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const [gmailRes, outlookRes] = await Promise.all([
        fetch("/api/gmail/status", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/outlook/status", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const gmailData = await gmailRes.json();
      const outlookData = await outlookRes.json();

      setGmailConnected(gmailData.connected === true);
      setOutlookConnected(outlookData.connected === true);
    } catch (err) {
      console.error("Status fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const openPopup = (url) => {
    const popup = window.open(
      url,
      "connect_email",
      "width=500,height=650"
    );

    const interval = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(interval);
        fetchStatus();
      }
    }, 500);
  };

  const connectGmail = async () => {
    if (outlookConnected) {
      alert("Bitte trenne zuerst Outlook.");
      return;
    }

    const token = localStorage.getItem("access_token");

    const res = await fetch("/api/gmail/auth-url", {
      headers: { Authorization: `Bearer ${token}` },
      redirect: "manual",
    });

    const url = res.headers.get("Location");
    if (url) openPopup(url);
  };

  const connectOutlook = async () => {
    if (gmailConnected) {
      alert("Bitte trenne zuerst Gmail.");
      return;
    }

    const token = localStorage.getItem("access_token");

    const res = await fetch("/api/outlook/auth-url", {
      headers: { Authorization: `Bearer ${token}` },
      redirect: "manual",
    });

    const url = res.headers.get("Location");
    if (url) openPopup(url);
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  const anyConnected = gmailConnected || outlookConnected;

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h2>Email Integration</h2>

      {/* Gmail */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 16,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <h3>Gmail</h3>

        {gmailConnected ? (
          <span style={{ color: "green" }}>✅ Connected</span>
        ) : (
          <>
            <span style={{ color: "gray", marginRight: 10 }}>
              Not connected
            </span>

            <button
              onClick={connectGmail}
              disabled={anyConnected}
            >
              Connect Gmail
            </button>
          </>
        )}
      </div>

      {/* Outlook */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <h3>Outlook</h3>

        {outlookConnected ? (
          <span style={{ color: "green" }}>✅ Connected</span>
        ) : (
          <>
            <span style={{ color: "gray", marginRight: 10 }}>
              Not connected
            </span>

            <button
              onClick={connectOutlook}
              disabled={anyConnected}
            >
              Connect Outlook
            </button>
          </>
        )}
      </div>

      {anyConnected && (
        <div style={{ marginTop: 10, color: "#666" }}>
          Only one email account can be connected at a time.
        </div>
      )}
    </div>
  );
}
