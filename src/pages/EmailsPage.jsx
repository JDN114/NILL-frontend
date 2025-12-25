import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext } from "react";
import { GmailContext } from "../context/GmailContext";

export default function EmailsPage() {
  const { emails, activeEmail, openEmail, closeEmail } = useContext(GmailContext);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Postfach</h1>

      <div className="grid grid-cols-3 gap-4 h-[75vh]">
        
        {/* 📩 Sidebar - 1/3 */}
        <Card className="col-span-1 overflow-y-auto">
          {emails?.length ? (
            <ul className="divide-y divide-gray-800">
              {emails.map((mail) => (
                <li
                  key={mail.id}
                  className="p-3 cursor-pointer hover:bg-gray-800 transition"
                  onClick={() => openEmail(mail.id)}
                >
                  <p className="font-semibold truncate">{mail.subject || "(Kein Betreff)"}</p>
                  <p className="text-xs text-gray-400 truncate">{mail.from}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Keine Emails gefunden.</p>
          )}
        </Card>

        {/* 📄 Detail View - 2/3 */}
        <Card className="col-span-4 overflow-y-auto p-6">
          {!activeEmail ? (
            <p className="text-gray-400">Wähle eine Email aus</p>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-1">{activeEmail.subject || "(Kein Betreff)"}</h2>
              <p className="text-sm text-gray-400 mb-3">{activeEmail.from}</p>
              <hr className="border-gray-700 mb-3"/>

              {/* 🧠 HTML Body Support */}
              <div
                className="email-body text-sm whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeEmail.body }}
              />

              <button
                onClick={closeEmail}
                className="mt-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
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
