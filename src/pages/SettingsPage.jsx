import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { GmailContext } from "../context/GmailContext";
import api, {
  logoutUser,
  getOutlookStatus,
  disconnectOutlook,
} from "../services/api";

import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";

export default function SettingsPage() {
  const navigate = useNavigate();

  const {
    connected,
    connectGmail,
    disconnectGmail,
    fetchStatus,
  } = useContext(GmailContext);

  const [loadingStatus, setLoadingStatus] = useState(false);

  // NEW: Outlook state
  const [outlookConnected, setOutlookConnected] = useState(false);

  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  // ----------------------------------
  // Logout
  // ----------------------------------
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Logout Fehler:", err);
    }
  };

  // ----------------------------------
  // Load Provider Status
  // ----------------------------------
  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      setLoadingStatus(true);

      try {
        // Gmail Status
        if (typeof fetchStatus === "function") {
          await fetchStatus();
        }

        // Outlook Status
        const outlook = await getOutlookStatus();

        if (mounted) {
          setOutlookConnected(outlook.connected);
        }

      } catch (err) {
        console.error("Status load error:", err);
      } finally {
        if (mounted) setLoadingStatus(false);
      }
    };

    loadStatus();

    return () => {
      mounted = false;
    };

  }, [fetchStatus]);

  // ----------------------------------
  // Load Subscription
  // ----------------------------------
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const res = await api.get("/me/subscription");
        setSubscription(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSub(false);
      }
    };

    loadSubscription();
  }, []);

  // ----------------------------------
  // Connect Provider
  // ----------------------------------
  const handleProviderSelect = (provider) => {
    setShowProviderModal(false);

    try {
      if (provider === "gmail") {
        connectGmail();
      }

      if (provider === "outlook") {
        window.location.href =
          `${import.meta.env.VITE_API_URL}/outlook/auth-url`;
      }

    } catch (err) {
      console.error("Provider Connect Fehler:", err);
    }
  };

  // ----------------------------------
  // Disconnect Provider
  // ----------------------------------
  const handleDisconnect = async () => {
    setLoadingStatus(true);

    try {
      if (outlookConnected) {

        await disconnectOutlook();
        setOutlookConnected(false);

      } else if (connected?.connected) {

        await disconnectGmail();

      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const anyConnected =
    outlookConnected || connected?.connected;

  const providerName =
    outlookConnected
      ? "Microsoft Outlook"
      : connected?.connected
      ? "Gmail"
      : null;

  // ----------------------------------
  // UI
  // ----------------------------------
  return (
    <PageLayout>
      <div className="max-w-4xl space-y-12">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Einstellungen
          </h1>

          <p className="text-gray-400">
            Verwalte dein Konto, dein Abonnement und deine Integrationen.
          </p>
        </div>

        {/* EMAIL */}
        <Card
          title="E-Mail Konten"
          className="rounded-2xl shadow-md"
        >
          <div className="flex flex-col gap-6">

            {anyConnected ? (
              <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">

                <div>

                  <p className="text-sm text-gray-400">
                    {providerName}
                  </p>

                  <p className="font-semibold text-white">
                    Verbunden
                  </p>

                </div>

                <button
                  onClick={handleDisconnect}
                  disabled={loadingStatus}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition"
                >
                  Trennen
                </button>

              </div>
            ) : (
              <button
                onClick={() => setShowProviderModal(true)}
                className="w-full py-3 rounded-xl font-medium bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition"
              >
                E-Mail Konto verbinden
              </button>
            )}

            <p className="text-xs text-gray-500">
              Du kannst mehrere E-Mail Konten verbinden (bald verfügbar).
            </p>

          </div>
        </Card>

        {/* SUBSCRIPTION */}
        <Card
          title="Abonnement"
          className="rounded-2xl shadow-md"
        >
          {loadingSub ? (
            <p className="text-gray-400">
              Lade Abonnement...
            </p>
          ) : subscription ? (
            <div className="space-y-6">

              <div>
                <p className="text-sm text-gray-400">
                  Account E-Mail
                </p>

                <p className="font-semibold text-white">
                  {subscription.email}
                </p>
              </div>

              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm text-gray-400">
                    Aktueller Plan
                  </p>

                  <p className="font-semibold text-white">
                    {subscription.plan}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-sm bg-green-500/10 text-green-400">
                  {subscription.is_subscription_active
                    ? "Aktiv"
                    : "Inaktiv"}
                </span>

              </div>

              {subscription.next_billing_date && (
                <div>

                  <p className="text-sm text-gray-400">
                    Nächste Abbuchung
                  </p>

                  <p className="font-semibold text-white">
                    {new Date(
                      subscription.next_billing_date
                    ).toLocaleDateString("de-DE")}
                  </p>

                </div>
              )}

              <div className="pt-4">
                <Link
                  to="/redeem-coupon"
                  className="px-5 py-2 rounded-xl font-medium bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition"
                >
                  Coupon einlösen
                </Link>
              </div>

            </div>
          ) : (
            <p className="text-red-400">
              Abonnement-Daten konnten nicht geladen werden.
            </p>
          )}
        </Card>

        {/* ACCOUNT */}
        <Card
          title="Account"
          className="rounded-2xl shadow-md space-y-4"
        >

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full py-3 rounded-xl font-medium bg-gray-700 hover:bg-gray-600 text-white transition"
          >
            Passwort ändern
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl font-medium bg-gray-800 hover:bg-gray-700 text-white transition"
          >
            Ausloggen
          </button>

        </Card>

        {/* DANGER ZONE */}
        <Card
          title="Gefahrenbereich"
          className="rounded-2xl shadow-md border border-red-900/30 bg-gray-800"
        >

          <div className="space-y-4">

            <p className="text-sm text-gray-400">
              Aktionen in diesem Bereich sind dauerhaft und können nicht rückgängig gemacht werden.
            </p>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-3 rounded-xl font-medium bg-red-700 hover:bg-red-600 text-white transition"
            >
              Account dauerhaft löschen
            </button>

          </div>

        </Card>

      </div>

      {/* PROVIDER MODAL */}
      {showProviderModal && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl">

            <h2 className="text-xl font-bold text-white">
              E-Mail Anbieter auswählen
            </h2>

            <div className="space-y-4">

              <button
                onClick={() => handleProviderSelect("gmail")}
                className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition"
              >
                Google (Gmail)
              </button>

              <button
                onClick={() => handleProviderSelect("outlook")}
                className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition"
              >
                Microsoft Outlook
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

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />

    </PageLayout>
  );
}
