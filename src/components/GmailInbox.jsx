import { useEffect, useState } from "react";
import { getGmailEmails } from "../services/api";

export default function GmailInbox() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    getGmailEmails().then(setEmails);
  }, []);

  return (
    <div>
      <h2>📬 Gmail Inbox</h2>
      {emails.map((mail) => (
        <div key={mail.id} style={{ borderBottom: "1px solid #eee" }}>
          <b>{mail.subject}</b>
          <p>{mail.from}</p>
          <small>{mail.snippet}</small>
        </div>
      ))}
    </div>
  );
}
