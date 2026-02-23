import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { GmailContext } from "../context/GmailContext";
import api from "../services/api";

export default function SettingsPage() {
  const { connected, connectGmail, disconnectGmail, fetchStatus } = useContext(GmailContext);

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  /* ---------------------------------- */
  /* Load Gmail Status                  */
  /* ---------------------------------- */
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
    return () => { mounted = false; };
  }, [fetchStatus]);

  /* ---------------------------------- */
  /* Load Subscription Info             */
  /* ---------------------------------- */
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

  /* ---------------------------------- */
  /* Email Connect Handlers             */
  /* ---------------------------------- */
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
          <p className="text-gray-400">Verwalte dein Konto, dein Abonnement und deine Integrationen.</p>
        </div>

        {/* EMAIL */}
        <Card title="E-Mail Konten" className="rounded-2xl shadow-md">
          <div className="flex flex-col gap-6">

            {connected?.connected ? (
              <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
                <div>
                  <p className="text-sm text-gray-400">Gmail</p>
                  <p className="font-semibold text-white">Verbunden</p>
                </div>
                <button onClick={handleDisconnect} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition">
                  Trennen
                </button>
              </div>
            ) : (
              <button onClick={() => setShowProviderModal(true)} className="w-full py-3 rounded-xl font-medium bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition">
                E-Mail Konto verbinden
              </button>
            )}

            <p className="text-xs text-gray-500">Du kannst mehrere E-Mail Konten verbinden (bald verfügbar).</p>
          </div>
        </Card>

        {/* SUBSCRIPTION */}
        <Card title="Abonnement" className="rounded-2xl shadow-md">
          {loadingSub ? (
            <p className="text-gray-400">Lade Abonnement...</p>
          ) : subscription ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-400">Account E-Mail</p>
                <p className="font-semibold text-white">{subscription.email}</p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Aktueller Plan</p>
                  <p className="font-semibold text-white">{subscription.plan}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-green-500/10 text-green-400">{subscription.is_subscription_active ? "Aktiv" : "Inaktiv"}</span>
              </div>

              {subscription.next_billing_date && (
                <div>
                  <p className="text-sm text-gray-400">Nächste Abbuchung</p>
                  <p className="font-semibold text-white">{new Date(subscription.next_billing_date).toLocaleDateString("de-DE")}</p>
                </div>
              )}

              <div className="pt-4">
                <Link to="/redeem-coupon" className="px-5 py-2 rounded-xl font-medium bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition">Coupon einlösen</Link>
              </div>
            </div>
          ) : (
            <p className="text-red-400">Abonnement-Daten konnten nicht geladen werden.</p>
          )}
        </Card>

        {/* ACCOUNT */}
        <Card title="Account" className="rounded-2xl shadow-md">
          <div className="space-y-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Passwort</p>
                <p className="font-semibold text-white">Passwort ändern</p>
              </div>
              <Link to="/reset-password" className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition">Ändern</Link>
            </div>
          </div>
        </Card>

        {/* DANGER ZONE – weniger prominent */}
        <Card title="Gefahrenbereich" className="rounded-2xl shadow-md border border-red-900/20 bg-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-semibold text-red-500">Account dauerhaft löschen</p>
              <p className="text-sm text-gray-400">Diese Aktion kann nicht rückgängig gemacht werden.</p>
            </div>
            <button className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white transition">Löschen</button>
          </div>
        </Card>

      </div>

      {/* PROVIDER MODAL */}
      {showProviderModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white">E-Mail Anbieter auswählen</h2>
            <div className="space-y-4">
              <button onClick={() => handleProviderSelect("gmail")} className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition">Google (Gmail)</button>
              <button disabled className="w-full py-3 rounded-xl bg-gray-800 text-gray-500 cursor-not-allowed">Microsoft Outlook (bald verfügbar)</button>
            </div>
            <button onClick={() => setShowProviderModal(false)} className="text-sm text-gray-400 hover:text-white transition">Abbrechen</button>
          </div>
        </div>
      )}

    </PageLayout>
  );
}
