import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext } from "react";
import { GmailContext } from "../context/GmailContext";

export default function EmailsPage() {
  const { emails, openEmail, activeEmail, closeEmail, loading } =
    useContext(GmailContext);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Emails</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* 📬 Inbox Liste */}
        <Card className="col-span-4 h-[80vh] overflow-y-auto">
          {loading ? (
            <p className="text-[var(--text-muted)]">Lade Emails…</p>
          ) : emails?.length ? (
            <ul className="divide-y divide-gray-800">
              {emails.map((mail) => (
                <li
                  key={mail.id}
                  className="p-4 cursor-pointer hover:bg-gray-800 transition rounded"
                  onClick={() => openEmail(mail.id)}
                >
                  <p className="font-medium truncate">{mail.subject}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">
                    {mail.from}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--text-muted)]">Keine Emails gefunden</p>
          )}
        </Card>

        {/* 📄 Email Detail */}
        <Card className="col-span-8 h-[80vh] overflow-y-auto">
          {activeEmail ? (
            <div className="pr-2">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-lg font-semibold">
                    {activeEmail.subject}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    {activeEmail.from}
                  </p>
                </div>
                <button
                  onClick={closeEmail}
                  className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                >
                  ✕
                </button>
              </div>

              <hr className="border-gray-700 mb-4" />

              {/* HTML Emails korrekt anzeigen */}
              <div
                className="prose prose-invert max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: activeEmail.body || "<p>(Kein Inhalt)</p>",
                }}
              />
            </div>
          ) : (
            <p className="text-[var(--text-muted)]">
              Klicke auf eine Email, um sie zu öffnen
            </p>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
