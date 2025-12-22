import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { useContext } from "react";
import { GmailContext } from "../context/GmailContext";

export default function SettingsPage() {
  const { connected, connectGmail } = useContext(GmailContext);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Einstellungen</h1>

      <Card title="Gmail">
        <div className="flex items-center justify-between">
          <span>
            Status:{" "}
            <strong className={connected ? "text-green-500" : "text-red-500"}>
              {connected ? "Verbunden" : "Nicht verbunden"}
            </strong>
          </span>

          {!connected && (
            <button
              onClick={connectGmail}
              className="bg-[var(--nill-primary)] px-4 py-2 rounded hover:bg-[var(--nill-primary-hover)]"
            >
              Gmail verbinden
            </button>
          )}
        </div>
      </Card>
    </PageLayout>
  );
}
