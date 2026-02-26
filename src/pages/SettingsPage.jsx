import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import { GmailContext } from "../context/GmailContext";
import api, { logoutUser } from "../services/api";

import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";

export default function SettingsPage() {
  const navigate = useNavigate();

  const {
    connected: gmailStatus,
    connectGmail,
    disconnectGmail,
    fetchStatus: fetchGmailStatus,
  } = useContext(GmailContext);

  const [outlookConnected, setOutlookConnected] = useState(false);

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  // ----------------------------------
  // Helper: popup open
  // ----------------------------------
  const openPopup = (url) => {
    const popup = window.open(
      url,
      "email_connect",
      "width=500,height=700"
    );

    const timer = setInterval(async () => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        await refreshAllStatus();
      }
    }, 500);
  };

  // ----------------------------------
  // Load Outlook Status
  // ----------------------------------
  const fetchOutlookStatus = async () => {
    try {
      const res = await api.get("/outlook/status");
      setOutlookConnected(res.data.connected === true);
    } catch {
      setOutlookConnected(false);
    }
  };

  // ----------------------------------
  // Unified Status Refresh
  // ----------------------------------
  const refreshAllStatus = async () => {
    setLoadingStatus(true);

    try {
      await Promise.all([
        fetchGmailStatus?.(),
        fetchOutlookStatus(),
      ]);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    refreshAllStatus();
  }, []);

  // ----------------------------------
  // Logout
  // ----------------------------------
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------
  // Provider Connect
  // ----------------------------------
  const handleProviderSelect = async (provider) => {
    setShowProviderModal(false);

    try {
      // already connected check
      if (gmailStatus?.connected || outlookConnected) {
        alert("Es kann nur ein E-Mail Konto gleichzeitig verbunden sein.");
        return;
      }

      if (provider === "gmail") {
        await connectGmail();
      }

      if (provider === "outlook") {
        const res = await api.get("/outlook/auth-url");

        const url = res.data.auth_url || res.data.url;

        if (url) openPopup(url);
      }

    } catch (err) {
      console.error("Connect error:", err);
    }
  };

  // ----------------------------------
  // Disconnect
  // ----------------------------------
  const handleDisconnect = async () => {
    setLoadingStatus(true);

    try {
      if (gmailStatus?.connected) {
        await disconnectGmail();
      }

      if (outlookConnected) {
        await api.post("/outlook/disconnect");
        setOutlookConnected(false);
      }

    } finally {
      await refreshAllStatus();
    }
  };

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

  const anyConnected =
    gmailStatus?.connected || outlookConnected;

  const providerName =
    gmailStatus?.connected
      ? "Gmail"
      : outlookConnected
      ? "Outlook"
      : null;

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
        <Card title="E-Mail Konten">

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
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white"
                >
                  Trennen
                </button>

              </div>
            ) : (
              <button
                onClick={() => setShowProviderModal(true)}
                className="w-full py-3 rounded-xl font-medium bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white"
              >
                E-Mail Konto verbinden
              </button>
            )}

            <p className="text-xs text-gray-500">
              Nur ein E-Mail Konto gleichzeitig möglich.
            </p>

          </div>

        </Card>

        {/* SUBSCRIPTION */}
        <Card title="Abonnement">

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

              <div className="flex justify-between">

                <div>
                  <p className="text-sm text-gray-400">
                    Plan
                  </p>

                  <p className="text-white font-semibold">
                    {subscription.plan}
                  </p>
                </div>

                <span className="text-green-400">
                  {subscription.is_subscription_active
                    ? "Aktiv"
                    : "Inaktiv"}
                </span>

              </div>

              <Link
                to="/redeem-coupon"
                className="px-5 py-2 rounded-xl bg-[var(--nill-primary)] text-white"
              >
                Coupon einlösen
              </Link>

            </div>
          ) : (
            <p className="text-red-400">
              Fehler beim Laden
            </p>
          )}

        </Card>

        {/* ACCOUNT */}
        <Card title="Account">

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full py-3 rounded-xl bg-gray-700 text-white"
          >
            Passwort ändern
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-gray-800 text-white"
          >
            Ausloggen
          </button>

        </Card>

      </div>

      {/* PROVIDER MODAL */}
      {showProviderModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md space-y-6">

            <h2 className="text-xl font-bold text-white">
              Anbieter auswählen
            </h2>

            <button
              onClick={() => handleProviderSelect("gmail")}
              className="w-full py-3 rounded-xl bg-gray-800 text-white"
            >
              Gmail
            </button>

            <button
              onClick={() => handleProviderSelect("outlook")}
              className="w-full py-3 rounded-xl bg-gray-800 text-white"
            >
              Outlook
            </button>

            <button
              onClick={() => setShowProviderModal(false)}
              className="text-gray-400"
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
