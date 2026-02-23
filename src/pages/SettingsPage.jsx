import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { GmailContext } from "../context/GmailContext";

export default function SettingsPage() {
  const { connected, connectGmail, disconnectGmail, fetchStatus } =
    useContext(GmailContext);

  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      if (typeof fetchStatus !== "function") return;
      setLoadingStatus(true);
      try {
        await fetchStatus();
      } catch (err) {
        console.error("Fehler beim Laden des Gmail-Status:", err);
      } finally {
        if (mounted) setLoadingStatus(false);
      }
    };

    loadStatus();
    const interval = setInterval(loadStatus, 60_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchStatus]);

  const handleButtonClick = async () => {
    setLoadingStatus(true);
    try {
      if (connected?.connected) {
        await disconnectGmail();
      } else {
        connectGmail();
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Einstellungen
          </h1>
          <p className="text-gray-400">
            Verwalte deine Integrationen, dein Konto und dein Abonnement.
          </p>
        </div>

        {/* ---------------------------- */}
        {/* Gmail Integration */}
        {/* ---------------------------- */}
        <Card title="Gmail Integration" className="rounded-2xl shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-4">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected?.connected ? "bg-green-500" : "bg-red-500"
                }`}
              />

              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="font-semibold text-white">
                  {loadingStatus
                    ? "Lade…"
                    : connected?.connected
                    ? "Verbunden"
                    : "Nicht verbunden"}
                </p>
              </div>
            </div>

            <button
              onClick={handleButtonClick}
              disabled={loadingStatus}
              className={`
                px-5 py-2 rounded-xl font-medium transition
                ${
                  connected?.connected
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)]"
                }
                text-white
                ${loadingStatus ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {loadingStatus
                ? "Lädt…"
                : connected?.connected
                ? "Trennen"
                : "Verbinden"}
            </button>
          </div>
        </Card>

        {/* ---------------------------- */}
        {/* Abonnement */}
        {/* ---------------------------- */}
        <Card title="Abonnement" className="rounded-2xl shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <p className="text-sm text-gray-400">Rabattcode</p>
              <p className="font-semibold text-white">
                Hast du einen Coupon?
              </p>
            </div>

            <Link
              to="/redeem-coupon"
              className="
                px-5 py-2 rounded-xl font-medium
                bg-[var(--nill-primary)]
                hover:bg-[var(--nill-primary-hover)]
                text-white transition
              "
            >
              Coupon einlösen
            </Link>
          </div>
        </Card>

        {/* Divider */}
        <div className="border-t border-gray-800" />

        {/* ---------------------------- */}
        {/* Account */}
        {/* ---------------------------- */}
        <Card title="Account" className="rounded-2xl shadow-md">
          <div className="flex flex-col gap-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Passwort</p>
                <p className="font-semibold text-white">
                  Passwort ändern
                </p>
              </div>

              <Link
                to="/reset-password"
                className="
                  px-4 py-2 rounded-xl font-medium
                  bg-gray-700 hover:bg-gray-600
                  text-white transition
                "
              >
                Ändern
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Sitzung</p>
                <p className="font-semibold text-white">
                  Von allen Geräten abmelden
                </p>
              </div>

              <button
                className="
                  px-4 py-2 rounded-xl font-medium
                  bg-gray-700 hover:bg-gray-600
                  text-white transition
                "
              >
                Abmelden
              </button>
            </div>
          </div>
        </Card>

        {/* ---------------------------- */}
        {/* Danger Zone */}
        {/* ---------------------------- */}
        <Card
          title="Gefahrenbereich"
          className="rounded-2xl shadow-md border border-red-900/40"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <p className="font-semibold text-red-500">
                Account dauerhaft löschen
              </p>
              <p className="text-sm text-gray-400">
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
            </div>

            <button
              className="
                px-5 py-2 rounded-xl font-medium
                bg-red-700 hover:bg-red-600
                text-white transition
              "
            >
              Account löschen
            </button>
          </div>
        </Card>

      </div>
    </PageLayout>
  );
}
