import React, { useEffect, useState } from "react";
import { getEmails } from "../services/api";
import EmailCard from "./EmailCard";

export default function EmailList() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEmails();
      setEmails(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  );
}

