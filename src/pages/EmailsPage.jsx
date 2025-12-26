import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext } from "react";
import { GmailContext } from "../context/GmailContext";

export default function EmailsPage() {
  const { emails, activeEmail, openEmail, closeEmail, loadingEmail } =
    useContext(GmailContext);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Postfach</h1>

      <div className="grid grid-cols-12 gap-4 h-[75vh]">
        {/* 📩 Inbox links (1/3) */}
        <Card className="col-span-4 overflow-y-auto">
          {emails?.length ? (
            <ul className="divide-y divide-gray-800">
              {emails.map((mail) => (
                <li
                  key={mail.id}
                  onClick={() => openEmail(mail.id)}
                  className="p-3 cursor-pointer hover:bg-gray-800 transition truncate"
                >
                  <p className="font-semibold truncate">
                    {mail.subject || "(Kein Betreff)"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{mail.from}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Keine Emails gefunden.</p>
          )}
        </Card>

        {/* 📄 Detail rechts (2/3) */}
        <Card className="col-span-8 overflow-y-auto p-6">
          {!activeEmail ? (
            <p className="text-gray-400">Wähle eine Email aus</p>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-1">
                {activeEmail.subject || "(Kein Betreff)"}
              </h2>

              <p className="text-sm text-gray-400 mb-3">
                {activeEmail.from}
              </p>

              <hr className="border-gray-700 mb-4" />

              {loadingEmail ? (
                <p className="text-gray-500">Lade Inhalte...</p>
              ) : (
                <div
                  className="text-sm leading-relaxed email-body"
                  dangerouslySetInnerHTML={{ __html: activeEmail.body }}
                />
              )}

              <button
                onClick={closeEmail}
                className="mt-6 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Schließen
              </button>
            </>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
