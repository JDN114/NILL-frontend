import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext } from "react";
import { GmailContext } from "../context/GmailContext";

export default function EmailsPage() {
  const { emails, openEmail, activeEmail, closeEmail } = useContext(GmailContext);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Emails</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Inbox Liste */}
        <Card className="col-span-1">
          {emails?.length ? (
            <ul className="divide-y divide-gray-800">
              {emails.map((mail) => (
                <li
                  key={mail.id}
                  className="py-4 cursor-pointer hover:bg-gray-800"
                  onClick={() => openEmail(mail.id)} // 👈 Hier öffnet Klick die Email
                >
                  <p className="font-medium">{mail.subject}</p>
                  <p className="text-sm text-[var(--text-muted)]">{mail.from}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--text-muted)]">Keine Emails gefunden</p>
          )}
        </Card>

        {/* Detailbereich */}
        <Card className="col-span-2">
          {activeEmail ? (
            <div>
              <h2 className="text-xl font-semibold">{activeEmail.subject}</h2>
              <p className="text-sm text-[var(--text-muted)]">{activeEmail.from}</p>
              <hr className="my-2 border-gray-700"/>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {activeEmail.body}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                onClick={closeEmail}
              >
                Schließen
              </button>
            </div>
          ) : (
            <p className="text-[var(--text-muted)]">Klicke eine Email, um sie zu öffnen</p>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
