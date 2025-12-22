import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext } from "react";
import { GmailContext } from "../context/GmailContext";

export default function EmailsPage() {
  const { emails } = useContext(GmailContext);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Emails</h1>

      <Card>
        {emails?.length ? (
          <ul className="divide-y divide-gray-800">
            {emails.map((mail) => (
              <li key={mail.id} className="py-4">
                <p className="font-medium">{mail.subject}</p>
                <p className="text-sm text-[var(--text-muted)]">
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
    </PageLayout>
  );
}
