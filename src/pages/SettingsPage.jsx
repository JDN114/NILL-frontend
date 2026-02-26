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

  // Gmail Context
  const {
    connected: gmailStatus,
    connectGmail,
    disconnectGmail,
    fetchStatus: fetchGmailStatus
  } = useContext(GmailContext);

  // Outlook State
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [loadingOutlook, setLoadingOutlook] = useState(true);

  // UI State
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Subscription
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
  // Fetch Gmail Status
  // ----------------------------------

  useEffect(() => {
    if (fetchGmailStatus) {
      fetchGmailStatus();
    }
  }, []);

  // ----------------------------------
  // Fetch Outlook Status
  // ----------------------------------

  const fetchOutlookStatus = async () => {

    try {

      const res = await fetch(
        "https://api.nillai.de/outlook/status",
        {
          credentials: "include"
        }
      );

      const data = await res.json();

      setOutlookConnected(data.connected === true);

    } catch (err) {

      console.error("Outlook status error:", err);
      setOutlookConnected(false);

    } finally {

      setLoadingOutlook(false);

    }

  };

  useEffect(() => {
    fetchOutlookStatus();
  }, []);

  // ----------------------------------
  // Fetch Subscription
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
  // Connect Outlook
  // ----------------------------------

  const connectOutlook = () => {

    window.location.href =
      "https://api.nillai.de/outlook/auth-url";

  };

  // ----------------------------------
  // Provider Modal Selection
  // ----------------------------------

  const handleProviderSelect = (provider) => {

    setShowProviderModal(false);

    if (provider === "gmail") {

      connectGmail();

    }

    if (provider === "outlook") {

      connectOutlook();

    }

  };

  // ----------------------------------
  // Disconnect Outlook (optional endpoint later)
  // ----------------------------------

  const disconnectOutlook = async () => {

    try {

      await api.post("/outlook/disconnect");

      setOutlookConnected(false);

    } catch (err) {

      console.error(err);

    }

  };

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

            Verwalte dein Konto und deine Integrationen.

          </p>

        </div>


        {/* EMAIL PROVIDERS */}

        <Card title="E-Mail Konten">

          <div className="space-y-4">


            {/* Gmail */}

            <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl">

              <div>

                <p className="text-sm text-gray-400">

                  Google Gmail

                </p>

                <p className="font-semibold text-white">

                  {gmailStatus?.connected
                    ? "Verbunden"
                    : "Nicht verbunden"}

                </p>

              </div>

              {gmailStatus?.connected ? (

                <button
                  onClick={disconnectGmail}
                  className="bg-red-600 px-4 py-2 rounded-xl"
                >
                  Trennen
                </button>

              ) : (

                <button
                  onClick={() => handleProviderSelect("gmail")}
                  className="bg-blue-600 px-4 py-2 rounded-xl"
                >
                  Verbinden
                </button>

              )}

            </div>


            {/* Outlook */}

            <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl">

              <div>

                <p className="text-sm text-gray-400">

                  Microsoft Outlook

                </p>

                <p className="font-semibold text-white">

                  {loadingOutlook
                    ? "Checking..."
                    : outlookConnected
                      ? "Verbunden"
                      : "Nicht verbunden"}

                </p>

              </div>

              {outlookConnected ? (

                <button
                  onClick={disconnectOutlook}
                  className="bg-red-600 px-4 py-2 rounded-xl"
                >
                  Trennen
                </button>

              ) : (

                <button
                  onClick={() => handleProviderSelect("outlook")}
                  className="bg-blue-600 px-4 py-2 rounded-xl"
                >
                  Verbinden
                </button>

              )}

            </div>

          </div>

        </Card>


        {/* SUBSCRIPTION */}

        <Card title="Abonnement">

          {loadingSub ? (

            <p>Lade...</p>

          ) : subscription ? (

            <div>

              <p>Email: {subscription.email}</p>

              <p>Plan: {subscription.plan}</p>

            </div>

          ) : (

            <p>Fehler</p>

          )}

        </Card>


        {/* ACCOUNT */}

        <Card title="Account">

          <div className="space-y-4">

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-gray-700 py-3 rounded-xl"
            >
              Passwort ändern
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-gray-800 py-3 rounded-xl"
            >
              Ausloggen
            </button>

          </div>

        </Card>


        {/* DELETE */}

        <Card title="Gefahrenbereich">

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-red-700 py-3 rounded-xl"
          >
            Account löschen
          </button>

        </Card>

      </div>


      {/* MODALS */}

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
