import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { GmailContext } from "../context/GmailContext";
import api from "../services/api";

export default function SettingsPage() {
  const { connected, connectGmail, disconnectGmail, fetchStatus } =
    useContext(GmailContext);

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  // ------------------------
  // Gmail Status laden
  // ------------------------
  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      if (!fetchStatus) return;
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
    return () => { mounted = false; };
  }, [fetchStatus]);

  // ------------------------
  // Subscription Info laden
  // ------------------------
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const res = await api.get("/me/subscription");
        setSubscription(res.data);
      } catch (err) {
        console.error("Fehler beim Laden der Subscription:", err);
      } finally {
        setLoadingSub(false);
      }
    };
    loadSubscription();
  }, []);

  const handleProviderSelect = async (provider) => {
    setShowProviderModal(false);
    if (provider === "gmail") connectGmail();
  };

  const handleDisconnect = async () => {
    setLoadingStatus(true);
    try { await disconnectGmail(); } finally { setLoadingStatus(false); }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl space-y-12">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Einstellungen</h1>
          <p className="text-gray-400">Verwalte dein Konto, Abonnement und Integrationen.</p>
        </div>

        {/* ===================================== */}
        {/* EMAIL ACCOUNTS */}
        {/* ===================================== */}
        <Card title="E-Mail Konten" className="rounded-2xl shadow-md">
          <div className="flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    connected?.connected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-white font-medium">
                  {connected?.connected ? "Verbunden" : "Nicht verbunden"}
                </span>
              </div>

              {connected?.connected ? (
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition"
                >
                  Trennen
                </button>
              ) : (
                <button
                  onClick={() => setShowProviderModal(true)}
                  className="px-4 py-2 rounded-xl bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition"
                >
                  E-Mail verbinden
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500">
              Mehrere E-Mail Konten folgen bald.
            </p>
          </div>
        </Card>

        {/* ===================================== */}
        {/* SUBSCRIPTION */}
        {/* ===================================== */}
        <Card title="Abonnement" className="rounded-2xl shadow-md">
          {loadingSub ? (
            <p className="text-gray-400">Lade Abonnement…</p>
          ) : subscription ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Account E-Mail</p>
                <p className="font-semibold text-white">{subscription.email || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Aktueller Plan</p>
                <p className="font-semibold text-white">{subscription.plan_name || "Kein Plan"}</p>
              </div>

              {subscription.next_billing_date && (
                <div>
                  <p className="text-sm text-gray-400">Nächste Abbuchung</p>
                  <p className="font-semibold text-white">
                    {new Date(subscription.next_billing_date).toLocaleDateString("de-DE")}
                  </p>
                </div>
              )}

              <Link
                to="/redeem-coupon"
                className="px-5 py-2 rounded-xl font-medium bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition inline-block mt-2"
              >
                Coupon einlösen
              </Link>
            </div>
          ) : (
            <p className="text-red-400">Abonnement-Daten konnten nicht geladen werden.</p>
          )}
        </Card>

        {/* ===================================== */}
        {/* ACCOUNT */}
        {/* ===================================== */}
        <Card title="Account" className="rounded-2xl shadow-md">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Passwort</p>
                <p className="font-semibold text-white">Passwort ändern</p>
              </div>
              <Link
                to="/reset-password"
                className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition"
              >
                Ändern
              </Link>
            </div>
          </div>
        </Card>

        {/* ===================================== */}
        {/* DANGER ZONE – weniger prominent */}
        {/* ===================================== */}
        <Card
          title="Gefahrenbereich"
          className="rounded-2xl shadow-md border border-red-900/20 bg-gray-800/30"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-red-500">Account dauerhaft löschen</p>
              <p className="text-sm text-gray-400">
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition text-sm">
              Löschen
            </button>
          </div>
        </Card>

      </div>

      {/* ===================================== */}
      {/* PROVIDER MODAL */}
      {/* ===================================== */}
      {showProviderModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl">

            <h2 className="text-xl font-bold text-white">E-Mail Anbieter auswählen</h2>

            <div className="space-y-4">
              <button
                onClick={() => handleProviderSelect("gmail")}
                className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition"
              >
                Google (Gmail)
              </button>

              <button
                disabled
                className="w-full py-3 rounded-xl bg-gray-800 text-gray-500 cursor-not-allowed"
              >
                Microsoft Outlook (bald verfügbar)
              </button>
            </div>

            <button
              onClick={() => setShowProviderModal(false)}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

    </PageLayout>
  );
}
