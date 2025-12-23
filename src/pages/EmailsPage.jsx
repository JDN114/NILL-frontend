import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext } from "react";
import { GmailContext } from "../context/GmailContext";

export default function EmailsPage() {
  const { emails, openEmail, activeEmail } = useContext(GmailContext);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Emails</h1>

      <div className="grid grid-cols-3 gap-4">
        {/* 📬 Inbox */}
        <Card className="col-span-1">
          {emails?.length ? (
            <ul className="divide-y divide-gray-800">
              {emails.map((mail) => (
                <li
                  key={mail.id}
                  onClick={() => openEmail(mail.id)}
                  className={`py-4 px-2 cursor-pointer hover:bg-gray-800 rounded
                    ${
                      activeEmail?.id === mail.id
                        ? "bg-gray-800"
                        : ""
                    }
                  `}
                >
                  <p className="font-medium truncate">{mail.subject}</p>
                  <p className="text-sm text-[var(--text-muted)] truncate">
                    {mail.from}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--text-muted)]">
              Keine Emails gefunden
            </p>
          )}
        </Card>

        {/* 📄 Detail View */}
        <Card className="col-span-2">
          {activeEmail ? (
            <>
              <h2 className="text-xl font-bold mb-2">
                {activeEmail.subject}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Von: {activeEmail.from}
              </p>

              <div className="whitespace-pre-wrap text-sm">
                {activeEmail.body}
              </div>
            </>
          ) : (
            <p className="text-[var(--text-muted)]">
              Wähle eine Email aus
            </p>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
