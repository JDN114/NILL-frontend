import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function Emails() {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    try {
      const res = await axios.get("/emails/all");
      setEmails(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchEmails();

    const ws = new WebSocket((window.location.protocol === "https:" ? "wss" : "ws") + "://" + window.location.host + "/ws/emails");

    ws.onopen = () => console.log("ws open");
    ws.onmessage = (evt) => {
      const payload = JSON.parse(evt.data);
      setEmails(prev => [payload, ...prev]);
    };
    ws.onclose = () => console.log("ws closed");

    return () => ws.close();
  }, []);

  const generateReply = async (id) => {
    const res = await axios.post(`/email-actions/${id}/reply`);
    alert(res.data.reply);
  };

  return (
    <div>
      {emails.map(e => (
        <div key={e.id}>
          <h3>{e.subject}</h3>
          <p>{e.summary || e.body}</p>
          <button onClick={() => generateReply(e.id)}>Antwort generieren</button>
        </div>
      ))}
    </div>
  );
}
