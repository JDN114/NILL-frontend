import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext } from "react";
import { GmailContext } from "../context/GmailContext";

export default function EmailsPage() {
  const { emails, openEmail, activeEmail, closeEmail } = useContext(GmailContext);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Emails</h1>

      {/* 🔥 Flex Layout statt Grid */}
      <div className="flex gap-6 h-[75vh]">
        
        {/* 📌 Sidebar: 25% Breite */}
        <Card className="w-1/4 overflow-y-auto">
          {emails?.length ? (
            <ul className="divide-y divide-gray-800">
              {emails.map((mail) => (
                <li
                  key={mail.id}
                  className="py-3 px-2 cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => openEmail(mail.id)}
                >
                  <p className="font-medium truncate">{mail.subject}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{mail.from}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--text-muted)]">Keine Emails gefunden</p>
          )}
        </Card>

        {/* 📌 Detailseite: 75% Breite */}
        <Card className="flex-grow overflow-y-auto">
          {activeEmail ? (
            <div className="p-2">
              <h2 className="text-xl font-semibold mb-1">{activeEmail.subject}</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">{activeEmail.from}</p>

              <div className="prose prose-invert text-sm leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: activeEmail.body }} />
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
