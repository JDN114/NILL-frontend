import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext } from "react";
import { GmailContext } from "../context/GmailContext";

export default function EmailsPage() {
  const { emails, openEmail, activeEmail, closeEmail, loadingEmail } =
    useContext(GmailContext);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Emails</h1>

      {/* Grid mit 1/3 + 2/3 */}
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-180px)]">

        {/* 📌 Inbox Navigation */}
        <div className="col-span-1 bg-[var(--card-bg)] rounded-xl border border-gray-800 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Posteingang</h2>

          {emails?.length ? (
            <ul className="divide-y divide-gray-800">
              {emails.map((mail) => (
                <li
                  key={mail.id}
                  onClick={() => openEmail(mail.id)}
                  className="py-3 px-2 cursor-pointer hover:bg-gray-800 transition rounded-lg"
                >
                  <p className="font-medium truncate">{mail.subject}</p>
                  <p className="text-sm text-[var(--text-muted)] truncate">
                    {mail.from}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--text-muted)]">Keine Emails verfügbar</p>
          )}
        </div>

        {/* 📌 Detailansicht */}
        <div className="col-span-2 bg-[var(--card-bg)] rounded-xl border border-gray-800 p-6 overflow-y-auto">
          {loadingEmail ? (
            <p className="text-[var(--text-muted)]">Lade Nachricht...</p>
          ) : activeEmail ? (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{activeEmail.subject}</h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Von: {activeEmail.from}
                  </p>
                </div>

                <button
                  onClick={closeEmail}
                  className="text-sm text-red-400 hover:text-red-300 transition"
                >
                  ✕ schließen
                </button>
              </div>

              <hr className="my-4 border-gray-700" />

              <div className="whitespace-pre-line text-sm leading-relaxed">
                {activeEmail.body || "Kein Inhalt"}
              </div>
            </>
          ) : (
            <p className="text-[var(--text-muted)] text-center mt-20">
              Wähle eine Email aus, um den Inhalt anzuzeigen
            </p>
          )}
        </div>

      </div>
    </PageLayout>
  );
}
