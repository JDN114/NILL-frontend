import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { GmailContext } from "../context/GmailContext";

export default function SettingsPage() {
  const { connected, connectGmail, fetchStatus } = useContext(GmailContext);

  // 🔁 Gmail Status beim Laden prüfen
  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Einstellungen</h1>

      {/* Gmail Verbindung */}
      <Card title="Gmail">
        <div className="flex items-center justify-between">
          <span className="text-sm">
            Status:{" "}
            <strong className={connected ? "text-green-500" : "text-red-500"}>
              {connected ? "Verbunden" : "Nicht verbunden"}
            </strong>
          </span>

          {!connected && (
            <button
              onClick={connectGmail}
              className="
                bg-[var(--nill-primary)]
                text-white
                px-4
                py-2
                rounded
                hover:bg-[var(--nill-primary-hover)]
                transition
              "
            >
              Gmail verbinden
            </button>
          )}
        </div>
      </Card>

      {/* Coupon Card */}
      <Card title="Abonnement">
        <div className="flex items-center justify-between">
          <span className="text-sm">Hast du einen Coupon?</span>

          <Link
            to="/redeem-coupon"
            className="
              bg-[var(--nill-primary)]
              text-white
              px-4
              py-2
              rounded
              hover:bg-[var(--nill-primary-hover)]
              transition
            "
          >
            Coupon einlösen
          </Link>
        </div>
      </Card>
    </PageLayout>
  );
}
