import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";

import { GmailContext } from "../context/GmailContext";
import { OutlookContext } from "../context/OutlookContext";

import api, { logoutUser } from "../services/api";

import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
#import AccountingSettings from "../components/AccountingSettings";

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("[SettingsPage] Render start");
  console.log("[SettingsPage] Location key:", location.key);

  // -------------------------------
  // Contexts
  // -------------------------------
  const {
    connected: gmailConnected,
    connectGmail,
    disconnectGmail,
    fetchStatus: fetchGmailStatus,
  } = useContext(GmailContext);

  const {
    connected: outlookConnected,
    connectOutlook,
    disconnectOutlook,
    fetchStatus: fetchOutlookStatus,
  } = useContext(OutlookContext);

  console.log("[SettingsPage] Gmail context:", gmailConnected);
  console.log("[SettingsPage] Outlook context:", outlookConnected);

  // -------------------------------
  // Local state
  // -------------------------------
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  // -------------------------------
  // Logout
  // -------------------------------
  const handleLogout = async () => {
    console.log("[SettingsPage] Logout clicked");
    try {
      await logoutUser();
      console.log("[SettingsPage] Logout success, redirecting");
      navigate("/login");
    } catch (err) {
      console.error("[SettingsPage] Logout Fehler:", err);
    }
  };

  // -------------------------------
  // Load Provider Status
  // -------------------------------
  useEffect(() => {
    let mounted = true;

    console.log("[SettingsPage] useEffect loadStatus triggered");

    const loadStatus = async () => {
      console.log("[SettingsPage] Loading provider status...");
      setLoadingStatus(true);

      try {
        if (typeof fetchGmailStatus === "function") {
          console.log("[SettingsPage] Fetching Gmail status...");
          const gmailResult = await fetchGmailStatus();
          console.log("[SettingsPage] Gmail status result:", gmailResult);
        } else {
          console.warn("[SettingsPage] fetchGmailStatus is not a function");
        }

        if (typeof fetchOutlookStatus === "function") {
          console.log("[SettingsPage] Fetching Outlook status...");
          const outlookResult = await fetchOutlookStatus();
          console.log("[SettingsPage] Outlook status result:", outlookResult);
        } else {
          console.warn("[SettingsPage] fetchOutlookStatus is not a function");
        }

      } catch (err) {
        console.error("[SettingsPage] Status load error:", err);
      } finally {
        if (mounted) {
          console.log("[SettingsPage] Provider status loading finished");
          setLoadingStatus(false);
        }
      }
    };

    loadStatus();

    return () => {
      console.log("[SettingsPage] Cleanup loadStatus effect");
      mounted = false;
    };
  }, [fetchGmailStatus, fetchOutlookStatus, location.key]);

  // -------------------------------
  // Load Subscription
  // -------------------------------
  useEffect(() => {
    console.log("[SettingsPage] Loading subscription...");

    const loadSubscription = async () => {
      try {
        const res = await api.get("/me/subscription");
        console.log("[SettingsPage] Subscription result:", res.data);
        setSubscription(res.data);
      } catch (err) {
        console.error("[SettingsPage] Subscription load error:", err);
      } finally {
        console.log("[SettingsPage] Subscription loading finished");
        setLoadingSub(false);
      }
    };

    loadSubscription();
  }, []);

  // -------------------------------
  // Connect Provider
  // -------------------------------
  const handleProviderSelect = (provider) => {
    console.log("[SettingsPage] Provider selected:", provider);

    setShowProviderModal(false);

    if (provider === "gmail") {
      console.log("[SettingsPage] Connecting Gmail...");
      connectGmail();
    }

    if (provider === "outlook") {
      console.log("[SettingsPage] Connecting Outlook...");
      connectOutlook();
    }
  };

  // -------------------------------
  // Disconnect Provider
  // -------------------------------
  const handleDisconnect = async () => {
    console.log("[SettingsPage] Disconnect clicked");

    setLoadingStatus(true);

    try {
      if (outlookIsConnected) {
        console.log("[SettingsPage] Disconnecting Outlook...");
        await disconnectOutlook();
        console.log("[SettingsPage] Outlook disconnected");
        } else if (gmailIsConnected) {
        console.log("[SettingsPage] Disconnecting Gmail...");
        await disconnectGmail();
        console.log("[SettingsPage] Gmail disconnected");
      } else {
        console.warn("[SettingsPage] No provider connected");
      }
    } catch (err) {
      console.error("[SettingsPage] Disconnect error:", err);
    } finally {
      console.log("[SettingsPage] Disconnect finished");
      setLoadingStatus(false);
    }
  };

  // -------------------------------
  // Unified provider state
  // -------------------------------
  // normalize values (handle boolean OR object)
  const gmailIsConnected =
    gmailConnected === true ||
    gmailConnected?.connected === true;

  const outlookIsConnected =
    outlookConnected === true ||
    outlookConnected?.connected === true;

  const anyConnected = gmailIsConnected || outlookIsConnected;

  const providerName = outlookIsConnected
    ? "Microsoft Outlook"
    : gmailIsConnected
    ? "Gmail"
    : null;

  console.log("[SettingsPage] Normalized state:", {
    gmailIsConnected,
    outlookIsConnected,
    anyConnected,
    providerName,
  });

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <PageLayout>
      <div className="max-w-4xl space-y-12">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Einstellungen</h1>
          <p className="text-gray-400">
            Verwalte dein Konto, dein Abonnement und deine Integrationen.
          </p>
        </div>

        {/* EMAIL */}
        <Card title="E-Mail Konten" className="rounded-2xl shadow-md">
          <div className="flex flex-col gap-6">
            {anyConnected ? (
              <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
                <div>
                  <p className="text-sm text-gray-400">{providerName}</p>
                  <p className="font-semibold text-white">Verbunden</p>
                </div>
                <button
                  onClick={handleDisconnect}
                  disabled={loadingStatus}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition disabled:opacity-50"
                >
                  Trennen
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  console.log("[SettingsPage] Open provider modal");
                  setShowProviderModal(true);
                }}
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


 #       <AccountingSettings />


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
                <span className="px-3 py-1 rounded-full text-sm bg-green-500/10 text-green-400">
                  {subscription.is_subscription_active ? "Aktiv" : "Inaktiv"}
                </span>
              </div>

              {subscription.next_billing_date && (
                <div>
                  <p className="text-sm text-gray-400">Nächste Abbuchung</p>
                  <p className="font-semibold text-white">
                    {new Date(subscription.next_billing_date).toLocaleDateString("de-DE")}
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
        <Card title="Account" className="rounded-2xl shadow-md space-y-4">
          <button
            onClick={() => {
              console.log("[SettingsPage] Open password modal");
              setShowPasswordModal(true);
            }}
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
        <Card title="Gefahrenbereich" className="rounded-2xl shadow-md border border-red-900/30 bg-gray-800">
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Aktionen in diesem Bereich sind dauerhaft und können nicht rückgängig gemacht werden.
            </p>

            <button
              onClick={() => {
                console.log("[SettingsPage] Open delete modal");
                setShowDeleteModal(true);
              }}
              className="w-full py-3 rounded-xl font-medium bg-red-700 hover:bg-red-600 text-white transition"
            >
              Account dauerhaft löschen
            </button>
          </div>
        </Card>

      </div>

      {/* Modals unchanged */}
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
              onClick={() => {
                console.log("[SettingsPage] Close provider modal");
                setShowProviderModal(false);
              }}
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
