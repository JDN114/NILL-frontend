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

      {/* Same height for both columns */}
      <div className="grid grid-cols-4 gap-6 h-[75vh]">

        {/* 📩 Sidebar – 1/3 */}
        <Card className="col-span-2 overflow-y-auto p-6">
          {emails.length ? (
            <ul className="divide-y divide-gray-700">
              {emails.map((mail) => (
                <li
                  key={mail.id}
                  onClick={() => openEmail(mail.id)}
                  className={`cursor-pointer p-3 hover:bg-gray-800 transition ${
                    activeEmail?.id === mail.id ? "bg-gray-800" : ""
                  }`}
                >
                  <p className="font-semibold truncate">
                    {mail.subject || "(Kein Betreff)"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{mail.from}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Keine Emails gefunden.</p>
          )}
        </Card>

        {/* 📄 Detail – 2/3 */}
        <Card className="col-span-2 overflow-y-auto p-6">
          {!activeEmail ? (
            <p className="text-gray-500">
              Wähle eine Email aus.
            </p>
          ) : loadingEmail ? (
            <p className="text-gray-400 animate-pulse">Laden...</p>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-1">
                {activeEmail.subject || "(Kein Betreff)"}
              </h2>
              <p className="text-sm text-gray-400 mb-3">
                {activeEmail.from}
              </p>
              <hr className="border-gray-700 mb-4"/>

              {/* RENDER HTML SAUBER */}
              <div
                className="email-body text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeEmail.body }}
              />

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
