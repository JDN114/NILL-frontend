// src/pages/SettingsPage.jsx
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { GmailContext } from "../context/GmailContext";

export default function SettingsPage() {
  const { connected, connectGmail, disconnectGmail, fetchStatus } =
    useContext(GmailContext);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // 🔁 Gmail Status beim Laden prüfen (mit Cache aus Context)
  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      if (typeof fetchStatus !== "function") return;
      setLoadingStatus(true);
      try {
        await fetchStatus(); // Context cached max. 1x/min
      } catch (err) {
        console.error("Fehler beim Laden des Gmail-Status:", err);
      } finally {
        if (mounted) setLoadingStatus(false);
      }
    };

    loadStatus();

    // Optional: Status alle Minute automatisch updaten
    const interval = setInterval(loadStatus, 60_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchStatus]);

  // 🔁 Verbinden / Abmelden
  const handleButtonClick = async () => {
    if (connected?.connected) {
      setLoadingStatus(true);
      try {
        await disconnectGmail(); // soft disconnect
      } finally {
        setLoadingStatus(false);
      }
    } else {
      connectGmail(); // leitet zu Google weiter
    }
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Einstellungen</h1>

      {/* -------------------- */}
      {/* Gmail Verbindung */}
      {/* -------------------- */}
      <Card title="Gmail">
        <div className="flex items-center justify-between">
          <span className="text-sm">
            Status:{" "}
            <strong
              className={
                connected?.connected ? "text-green-500" : "text-red-500"
              }
            >
              {loadingStatus
                ? "Lade…"
                : connected?.connected
                ? "Verbunden"
                : "Nicht verbunden"}
            </strong>
          </span>

          <button
            onClick={handleButtonClick}
            disabled={loadingStatus}
            className={`
              bg-[var(--nill-primary)]
              text-white
              px-4 py-2
              rounded
              hover:bg-[var(--nill-primary-hover)]
              transition
              ${loadingStatus ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {loadingStatus
              ? "Lädt…"
              : connected?.connected
              ? "Abmelden"
              : "Gmail verbinden"}
          </button>
        </div>
      </Card>

      {/* -------------------- */}
      {/* Coupon Card */}
      {/* -------------------- */}
      <Card title="Abonnement">
        <div className="flex items-center justify-between">
          <span className="text-sm">Hast du einen Coupon?</span>
          <Link
            to="/redeem-coupon"
            className="
              bg-[var(--nill-primary)]
              text-white
              px-4 py-2
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
