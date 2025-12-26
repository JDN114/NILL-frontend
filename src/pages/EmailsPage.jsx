import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext } from "react";
import { GmailContext } from "../context/GmailContext";
import SafeEmailHtml from "../components/SafeEmailHtml";

export default function EmailsPage() {
  const { emails, activeEmail, openEmail, closeEmail, loadingEmail } =
    useContext(GmailContext);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Postfach</h1>

      <div className="flex gap-4 h-[88vh] min-h-[600px]">

        {/* 📩 Inbox Sidebar */}
        <Card className="w-[280px] flex-shrink-0 overflow-y-auto p-4 pointer-events-auto">
          {emails?.length ? (
            <ul className="divide-y divide-gray-800">
              {emails.map((mail) => (
                <li
                  key={mail.id}
                  onClick={() => {
                    if (!mail.id) return;
                    openEmail(mail.id);
                  }}
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

        {/* 📄 Detail View - Full focus */}
        <Card className="flex-1 overflow-y-auto p-8 bg-gray-900 rounded-xl max-w-full">
          {!activeEmail ? (
            <p className="text-gray-400">Wähle eine Email aus</p>
          ) : loadingEmail ? (
            <p className="text-gray-400">Lade Email …</p>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-3">
                {activeEmail.subject || "(Kein Betreff)"}
              </h2>
              <p className="text-sm text-gray-400 mb-4">{activeEmail.from}</p>
              <hr className="border-gray-700 mb-6" />

              {/* 🔥 Sichere HTML Darstellung */}
              <SafeEmailHtml html={activeEmail.body} />

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
