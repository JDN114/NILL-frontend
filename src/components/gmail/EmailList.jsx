import { useContext } from "react";
import { GmailContext } from "../../context/GmailContext";

export default function EmailList() {
  const { emails, openEmail } = useContext(GmailContext);

  if (!emails.length) {
    return <div className="text-gray-400 p-4">Keine Emails</div>;
  }

  return (
    <div className="divide-y border rounded">
      {emails.map((mail) => (
        <div
          key={mail.id}
          onClick={() => openEmail(mail.id)}
          className="p-4 cursor-pointer hover:bg-gray-100 transition"
        >
          <div className="font-semibold truncate">{mail.subject || "(Kein Betreff)"}</div>
          <div className="text-sm text-gray-600 truncate">{mail.from}</div>
          <div className="text-sm text-gray-500 truncate">{mail.snippet}</div>
        </div>
      ))}
    </div>
  );
}
