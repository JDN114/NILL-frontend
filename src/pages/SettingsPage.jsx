import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";

import { GmailContext } from "../context/GmailContext";
import { OutlookContext } from "../context/OutlookContext";
import { useAuth } from "../context/AuthContext";

import api, { logoutUser } from "../services/api";

import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";

const INDUSTRIES = [
  "Handwerk", "Reinigung", "Werkstatt", "Gastronomie",
  "Beratung", "Gesundheit", "IT & Software",
  "Handel", "Transport", "Sonstiges"
];

const TABS = [
  { id: "konto", label: "Konto" },
  { id: "team", label: "Mein Team" },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, org, updateOrg } = useAuth();

  const isSolo = org?.plan === "solo";
  const showTeamTab = !isSolo() && org?.plan != null;

  const visibleTabs = showTeamTab ? TABS : TABS.filter(t => t.id !== "team");
  const [activeTab, setActiveTab] = useState("konto");

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

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  const [orgName, setOrgName] = useState(org?.name ?? "");
  const [orgIndustry, setOrgIndustry] = useState(org?.industry ?? "");
  const [orgSaving, setOrgSaving] = useState(false);
  const [orgSuccess, setOrgSuccess] = useState(false);
  const [orgError, setOrgError] = useState("");

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("[SettingsPage] Logout Fehler:", err);
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadStatus = async () => {
      setLoadingStatus(true);
      try {
        if (typeof fetchGmailStatus === "function") await fetchGmailStatus();
        if (typeof fetchOutlookStatus === "function") await fetchOutlookStatus();
      } catch (err) {
        console.error("[SettingsPage] Status load error:", err);
      } finally {
        if (mounted) setLoadingStatus(false);
      }
    };
    loadStatus();
    return () => { mounted = false; };
  }, [fetchGmailStatus, fetchOutlookStatus, location.key]);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const res = await api.get("/me/subscription");
        setSubscription(res.data);
      } catch (err) {
        console.error("[SettingsPage] Subscription load error:", err);
      } finally {
        setLoadingSub(false);
      }
    };
    loadSubscription();
  }, []);

  const handleSaveOrg = async () => {
    if (!orgName.trim()) {
      setOrgError("Unternehmensname darf nicht leer sein.");
      return;
    }
    setOrgError("");
    setOrgSaving(true);
    setOrgSuccess(false);
    try {
      const res = await api.patch("/auth/onboarding", {
        name: orgName.trim(),
        industry: orgIndustry || null,
      }, { withCredentials: true });
      updateOrg({ name: res.data.name, industry: res.data.industry });
      setOrgSuccess(true);
      setTimeout(() => setOrgSuccess(false), 3000);
    } catch (err) {
      setOrgError("Fehler beim Speichern. Bitte versuche es erneut.");
    } finally {
      setOrgSaving(false);
    }
  };

  const handleProviderSelect = (provider) => {
    setShowProviderModal(false);
    if (provider === "gmail") connectGmail();
    if (provider === "outlook") connectOutlook();
  };

  const handleDisconnect = async () => {
    setLoadingStatus(true);
    try {
      if (outlookIsConnected) await disconnectOutlook();
      else if (gmailIsConnected) await disconnectGmail();
    } catch (err) {
      console.error("[SettingsPage] Disconnect error:", err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const gmailIsConnected =
    gmailConnected === true || gmailConnected?.connected === true;
  const outlookIsConnected =
    outlookConnected === true || outlookConnected?.connected === true;
  const anyConnected = gmailIsConnected || outlookIsConnected;
  const providerName = outlookIsConnected
    ? "Microsoft Outlook"
    : gmailIsConnected ? "Gmail" : null;

  const statusClass = org?.plan_status === "active"
    ? "text-sm font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400"
    : "text-sm font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400";

  // Permission label map
  const PERMISSION_LABELS = {
    calendar: "Kalender",
    email: "E-Mail",
    accounting: "Buchhaltung",
    schedules: "Dienstplan",
    documents: "Dokumente",
    inventory: "Inventar",
    wages: "Lohn",
  };

  return (
    <PageLayout>
      <div className="max-w-4xl space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Einstellungen</h1>
          <p className="text-gray-400">
            Verwalte dein Konto, dein Abonnement und deine Integrationen.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-800/60 p-1 rounded-xl w-fit">
          {visibleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: KONTO ── */}
        {activeTab === "konto" && (
          <div className="space-y-8">

            {/* UNTERNEHMEN */}
            <Card title="Unternehmen" className="rounded-2xl shadow-md">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 bg-gray-800/50 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Unternehmensname</p>
                    <p className="text-white font-medium">
                      {org?.name || <span className="text-gray-500">—</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Branche</p>
                    <p className="text-white font-medium">
                      {org?.industry || <span className="text-gray-500">—</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Plan</p>
                    <p className="text-white font-medium capitalize">
                      {org?.plan || <span className="text-gray-500">—</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={statusClass}>
                      {org?.plan_status || "—"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-1 block">
                    Unternehmensname
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    placeholder="z.B. Müller Handwerk GmbH"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-1 block">
                    Branche <span className="text-gray-500">(optional)</span>
                  </label>
                  <select
                    value={orgIndustry}
                    onChange={e => setOrgIndustry(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-500"
                  >
                    <option value="">Bitte wählen…</option>
                    {INDUSTRIES.map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>

                {orgError && <p className="text-red-400 text-sm">{orgError}</p>}
                {orgSuccess && <p className="text-green-400 text-sm">Änderungen gespeichert.</p>}

                <button
                  onClick={handleSaveOrg}
                  disabled={orgSaving}
                  className="px-6 py-2.5 rounded-xl font-medium bg-white text-gray-900 hover:bg-gray-100 transition disabled:opacity-50"
                >
                  {orgSaving ? "Wird gespeichert…" : "Speichern"}
                </button>
              </div>
            </Card>

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
              <div className="mb-4 bg-gray-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Eingeloggt als</p>
                <p className="text-white font-medium">{user?.email}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  Rolle: {user?.role || "—"}
                </p>
              </div>
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
            <Card title="Gefahrenbereich" className="rounded-2xl shadow-md border border-red-900/30 bg-gray-800">
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
        )}

        {/* ── TAB: MEIN TEAM ── */}
        {activeTab === "team" && showTeamTab && (
          <div className="space-y-6">

            {/* Unternehmen */}
            <Card title="Unternehmen" className="rounded-2xl shadow-md">
              <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="text-white font-medium">
                    {org?.name || <span className="text-gray-500">—</span>}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Branche</p>
                  <p className="text-white font-medium">
                    {org?.industry || <span className="text-gray-500">—</span>}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Plan</p>
                  <p className="text-white font-medium capitalize">
                    {org?.plan || <span className="text-gray-500">—</span>}
                  </p>
                </div>
              </div>
            </Card>

            {/* Meine Rolle */}
            <Card title="Meine Rolle" className="rounded-2xl shadow-md">
              {user?.role === "admin" ? (
                <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold">
                      {user?.email?.[0]?.toUpperCase() ?? "?"}
                    </span>
                    <div>
                      <p className="text-white font-medium">{user?.email}</p>
                      <p className="text-xs text-gray-400">Company Admin</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 pt-1">
                    Als Company Admin hast du Zugriff auf alle Module und Funktionen deiner Organisation.
                  </p>
                </div>
              ) : user?.org_role ? (
                <div className="bg-gray-800/50 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold">
                      {user?.email?.[0]?.toUpperCase() ?? "?"}
                    </span>
                    <div>
                      <p className="text-white font-medium">{user?.email}</p>
                      <p className="text-xs text-gray-400">{user.org_role.name}</p>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Freigeschaltete Bereiche</p>
                    {user.org_role.permissions?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.org_role.permissions.map(p => (
                          <span
                            key={p}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white"
                          >
                            {PERMISSION_LABELS[p] ?? p}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Keine Berechtigungen zugewiesen.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-sm text-gray-400">
                    Dir wurde noch keine Rolle zugewiesen. Wende dich an deinen Administrator.
                  </p>
                </div>
              )}
            </Card>

          </div>
        )}

      </div>

      {/* Modals */}
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
