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

      <div className="grid grid-cols-12 gap-6 h-[80vh]">
        {/* 📬 Inbox */}
        <Card className="col-span-4 overflow-y-auto">
          {loading ? (
            <p className="text-[var(--text-muted)]">Lade Emails…</p>
          ) : (
            <ul className="divide-y divide-gray-900">
              {emails?.map((mail) => (
                <li
                  key={mail.id}
                  className="p-4 cursor-pointer hover:bg-gray-800 transition"
                  onClick={() => openEmail(mail.id)}
                >
                  <p className="font-medium truncate">{mail.subject}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">
                    {mail.from}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* 📄 Detailansicht */}
        <Card className="col-span-8 overflow-y-auto">
          {activeEmail ? (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{activeEmail.subject}</h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    {activeEmail.from}
                  </p>
                </div>

                <button
                  className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                  onClick={closeEmail}
                >
                  ✕
                </button>
              </div>

              <hr className="border-gray-700" />

              {/* HTML-Rendering verbessern */}
              <div
                className="text-sm leading-relaxed break-words"
                dangerouslySetInnerHTML={{
                  __html: activeEmail.body || "<p>(Kein Inhalt)</p>",
                }}
              />
            </div>
          ) : (
            <p className="text-[var(--text-muted)]">
              Klicke eine Email, um sie zu öffnen
            </p>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
