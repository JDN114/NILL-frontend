import React, { useEffect, useState } from "react";

interface Email {
  id: string;
  subject: string;
  from: string;
  received_at: string;
  summary?: string;
  priority?: string;
  category?: string;
  category_group?: string;
  sentiment?: string;
  ai_status?: string;
  body?: string;
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------
  // Load email list
  // -------------------
  const loadEmails = async () => {
    console.log("Loading email list...");
    setLoadingList(true);
    setError(null);

    try {
      const res = await fetch("/api/emails");

      console.log("List response status:", res.status);

      if (!res.ok) {
        throw new Error(`Failed to load emails (${res.status})`);
      }

      const data = await res.json();

      console.log("Emails loaded:", data.length);

      setEmails(data);
    } catch (err: any) {
      console.error("Error loading emails:", err);
      setError(err.message);
    } finally {
      setLoadingList(false);
    }
  };

  // -------------------
  // Load email detail
  // -------------------
  const loadEmailDetail = async (id: string) => {
    console.log("Loading email detail:", id);

    setLoadingDetail(true);

    try {
      const res = await fetch(`/api/emails/${id}`);

      console.log("Detail response status:", res.status);

      if (!res.ok) {
        throw new Error(`Failed to load email detail (${res.status})`);
      }

      const data = await res.json();

      console.log("Detail loaded:", data);

      setSelectedEmail(data);
    } catch (err: any) {
      console.error("Error loading email detail:", err);
      setError(err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  // -------------------
  // UI
  // -------------------
  return (
    <div style={{ display: "flex", height: "100%" }}>
      
      {/* LEFT: EMAIL LIST */}
      <div
        style={{
          width: "40%",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <h2>Emails</h2>

        {loadingList && <div>Loading emails...</div>}

        {error && (
          <div style={{ color: "red" }}>
            Error: {error}
          </div>
        )}

        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => loadEmailDetail(email.id)}
            style={{
              padding: "12px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              background:
                selectedEmail?.id === email.id
                  ? "#f0f0f0"
                  : "transparent",
            }}
          >
            <div>
              <strong>{email.subject}</strong>
            </div>

            <div style={{ fontSize: "0.9em", color: "#666" }}>
              {email.from}
            </div>

            <div style={{ fontSize: "0.8em", color: "#999" }}>
              {email.received_at}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: DETAIL VIEW */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {!selectedEmail && (
          <div>Select an email</div>
        )}

        {loadingDetail && (
          <div>Loading detail...</div>
        )}

        {selectedEmail && !loadingDetail && (
          <div>
            <h2>{selectedEmail.subject}</h2>

            <div>
              <strong>From:</strong> {selectedEmail.from}
            </div>

            <div>
              <strong>Date:</strong> {selectedEmail.received_at}
            </div>

            <hr />

            <h3>Summary</h3>
            <div>
              {selectedEmail.summary || "No summary yet"}
            </div>

            <h3>Classification</h3>

            <div>Priority: {selectedEmail.priority}</div>
            <div>Category: {selectedEmail.category}</div>
            <div>Group: {selectedEmail.category_group}</div>
            <div>Sentiment: {selectedEmail.sentiment}</div>

            <hr />

            <h3>Body</h3>
            <div
              style={{
                whiteSpace: "pre-wrap",
                marginTop: "10px",
              }}
            >
              {selectedEmail.body}
            </div>

            <div style={{ marginTop: "20px", color: "#888" }}>
              AI Status: {selectedEmail.ai_status}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
