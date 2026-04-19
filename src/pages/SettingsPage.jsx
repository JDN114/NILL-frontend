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
import EmailVorlagenTab from "../components/EmailVorlagenTab";

const INDUSTRIES = [
  "Handwerk", "Reinigung", "Werkstatt", "Gastronomie",
  "Beratung", "Gesundheit", "IT & Software",
  "Handel", "Transport", "Sonstiges"
];

const PERMISSION_LABELS = {
  calendar:   "Kalender",
  email:      "E-Mail",
  accounting: "Buchhaltung",
  schedules:  "Dienstplan",
  documents:  "Dokumente",
  inventory:  "Inventar",
  wages:      "Lohn",
};

// ── Icons ──────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const IconBuilding = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);
const IconPlug = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);
const IconCreditCard = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);
const IconMail = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconTeam = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

function SidebarTab({ id, label, icon, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
        active
          ? "bg-white/10 text-white"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className={active ? "text-white" : "text-gray-500"}>{icon}</span>
      {label}
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, org, updateOrg, isSolo, isCompanyAdmin } = useAuth();

  const showTeamTab = !isSolo() && org?.plan != null;

  const isAdmin = isCompanyAdmin();
  const TABS = [
    { id: "konto",         label: "Konto",         icon: <IconUser /> },
    ...(isAdmin ? [{ id: "unternehmen",   label: "Unternehmen",   icon: <IconBuilding /> }] : []),
    ...(isAdmin ? [{ id: "integrationen", label: "Integrationen", icon: <IconPlug /> }] : []),
    ...(isAdmin ? [{ id: "abonnement",    label: "Abonnement",    icon: <IconCreditCard /> }] : []),
    ...(showTeamTab ? [{ id: "team", label: "Mein Team", icon: <IconTeam /> }] : []),
    ...(isAdmin ? [{ id: "email_vorlagen", label: "E-Mail Vorlagen", icon: <IconMail /> }] : []),
  ];

  const [activeTab, setActiveTab] = useState("konto");

  const { connected: gmailConnected, connectGmail, disconnectGmail, fetchStatus: fetchGmailStatus } = useContext(GmailContext);
  const { connected: outlookConnected, connectOutlook, disconnectOutlook, fetchStatus: fetchOutlookStatus } = useContext(OutlookContext);

  const [loadingStatus,     setLoadingStatus]     = useState(false);
  const [showProviderModal, setShowProviderModal]  = useState(false);
  const [showPasswordModal, setShowPasswordModal]  = useState(false);
  const [showDeleteModal,   setShowDeleteModal]    = useState(false);
  const [subscription,      setSubscription]       = useState(null);
  const [loadingSub,        setLoadingSub]         = useState(true);

  const [orgName,     setOrgName]     = useState(org?.name ?? "");
  const [orgIndustry, setOrgIndustry] = useState(org?.industry ?? "");
  const [orgSaving,   setOrgSaving]   = useState(false);
  const [orgSuccess,  setOrgSuccess]  = useState(false);
  const [orgError,    setOrgError]    = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingStatus(true);
      try {
        if (typeof fetchGmailStatus === "function") await fetchGmailStatus();
        if (typeof fetchOutlookStatus === "function") await fetchOutlookStatus();
      } catch (err) {
        console.error("[Settings] Status load error:", err);
      } finally {
        if (mounted) setLoadingStatus(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [fetchGmailStatus, fetchOutlookStatus, location.key]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/me/subscription");
        setSubscription(res.data);
      } catch (err) {
        console.error("[Settings] Subscription load error:", err);
      } finally {
        setLoadingSub(false);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    try { await logoutUser(); } catch (_) {}
    navigate("/login");
  };

  const handleSaveOrg = async () => {
    if (!orgName.trim()) { setOrgError("Unternehmensname darf nicht leer sein."); return; }
    setOrgError(""); setOrgSaving(true); setOrgSuccess(false);
    try {
      const res = await api.patch("/auth/onboarding", {
        name: orgName.trim(),
        industry: orgIndustry || null,
      }, { withCredentials: true });
      updateOrg({ name: res.data.name, industry: res.data.industry });
      setOrgSuccess(true);
      setTimeout(() => setOrgSuccess(false), 3000);
    } catch {
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
      console.error("[Settings] Disconnect error:", err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const gmailIsConnected   = gmailConnected === true || gmailConnected?.connected === true;
  const outlookIsConnected = outlookConnected === true || outlookConnected?.connected === true;
  const anyConnected       = gmailIsConnected || outlookIsConnected;
  const providerName       = outlookIsConnected ? "Microsoft Outlook" : gmailIsConnected ? "Gmail" : null;

  const planStatusClass = org?.plan_status === "active"
    ? "text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400"
    : "text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400";

  return (
    <PageLayout>
      <div className="max-w-5xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Einstellungen</h1>
          <p className="text-gray-400 text-sm">Verwalte dein Konto, dein Unternehmen und deine Integrationen.</p>
        </div>

        <div className="flex gap-8 items-start">

          {/* Sidebar */}
          <nav className="w-48 shrink-0 sticky top-6 space-y-1">
            {TABS.map(tab => (
              <SidebarTab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                active={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* ══ KONTO ══ */}
            {activeTab === "konto" && (
              <>
                <Card title="Account" className="rounded-2xl shadow-md">
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user?.email?.[0]?.toUpperCase() ?? "?"}
                      </span>
                      <div>
                        <p className="text-white font-medium text-sm">{user?.email}</p>
                        <p className="text-xs text-gray-400 capitalize mt-0.5">{user?.role || "—"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full py-2.5 rounded-xl font-medium bg-gray-700 hover:bg-gray-600 text-white transition text-sm"
                    >
                      Passwort ändern
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full py-2.5 rounded-xl font-medium bg-gray-800 hover:bg-gray-700 text-white transition text-sm"
                    >
                      Ausloggen
                    </button>
                  </div>
                </Card>

                <Card title="Gefahrenbereich" className="rounded-2xl shadow-md border border-red-900/30">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Das Löschen deines Accounts ist dauerhaft und kann nicht rückgängig gemacht werden.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full py-2.5 rounded-xl font-medium bg-red-700 hover:bg-red-600 text-white transition text-sm"
                    >
                      Account dauerhaft löschen
                    </button>
                  </div>
                </Card>
              </>
            )}

            {/* ══ UNTERNEHMEN ══ */}
            {activeTab === "unternehmen" && (
              <Card title="Unternehmen" className="rounded-2xl shadow-md">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3 bg-gray-800/50 rounded-xl p-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Name</p>
                      <p className="text-white font-medium text-sm">{org?.name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Branche</p>
                      <p className="text-white font-medium text-sm">{org?.industry || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Plan</p>
                      <p className="text-white font-medium text-sm capitalize">{org?.plan || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <span className={planStatusClass}>{org?.plan_status || "—"}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm mb-1 block">Unternehmensname</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={e => setOrgName(e.target.value)}
                      placeholder="z.B. Müller Handwerk GmbH"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-1 block">
                      Branche <span className="text-gray-500">(optional)</span>
                    </label>
                    <select
                      value={orgIndustry}
                      onChange={e => setOrgIndustry(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-500 text-sm"
                    >
                      <option value="">Bitte wählen…</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>

                  {orgError   && <p className="text-red-400 text-sm">{orgError}</p>}
                  {orgSuccess && <p className="text-green-400 text-sm">Änderungen gespeichert.</p>}

                  <button
                    onClick={handleSaveOrg}
                    disabled={orgSaving}
                    className="px-6 py-2.5 rounded-xl font-medium bg-white text-gray-900 hover:bg-gray-100 transition disabled:opacity-50 text-sm"
                  >
                    {orgSaving ? "Wird gespeichert…" : "Speichern"}
                  </button>
                </div>
              </Card>
            )}

            {/* ══ INTEGRATIONEN ══ */}
            {activeTab === "integrationen" && (
              <Card title="E-Mail Konten" className="rounded-2xl shadow-md">
                <div className="space-y-4">
                  {anyConnected ? (
                    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-xl">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{providerName}</p>
                        <p className="font-semibold text-white text-sm">Verbunden</p>
                      </div>
                      <button
                        onClick={handleDisconnect}
                        disabled={loadingStatus}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition disabled:opacity-50 text-sm"
                      >
                        Trennen
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowProviderModal(true)}
                      className="w-full py-3 rounded-xl font-medium bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition text-sm"
                    >
                      E-Mail Konto verbinden
                    </button>
                  )}
                  <p className="text-xs text-gray-500">Mehrere E-Mail Konten verbinden — bald verfügbar.</p>
                </div>
              </Card>
            )}

            {/* ══ ABONNEMENT ══ */}
            {activeTab === "abonnement" && (
              <Card title="Abonnement" className="rounded-2xl shadow-md">
                {loadingSub ? (
                  <p className="text-gray-400 text-sm">Lade Abonnement…</p>
                ) : subscription ? (
                  <div className="space-y-5">
                    <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Account E-Mail</p>
                        <p className="text-white font-medium text-sm">{subscription.email}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Aktueller Plan</p>
                          <p className="text-white font-medium text-sm capitalize">{subscription.plan}</p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          subscription.is_subscription_active
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}>
                          {subscription.is_subscription_active ? "Aktiv" : "Inaktiv"}
                        </span>
                      </div>
                      {subscription.next_billing_date && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Nächste Abbuchung</p>
                          <p className="text-white font-medium text-sm">
                            {new Date(subscription.next_billing_date).toLocaleDateString("de-DE")}
                          </p>
                        </div>
                      )}
                    </div>
                    <Link
                      to="/redeem-coupon"
                      className="inline-block px-5 py-2.5 rounded-xl font-medium bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition text-sm"
                    >
                      Coupon einlösen
                    </Link>
                  </div>
                ) : (
                  <p className="text-red-400 text-sm">Abonnement-Daten konnten nicht geladen werden.</p>
                )}
              </Card>
            )}

            {/* ══ MEIN TEAM ══ */}
            {activeTab === "team" && showTeamTab && (
              <>
                <Card title="Unternehmen" className="rounded-2xl shadow-md">
                  <div className="bg-gray-800/50 rounded-xl p-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Name</p>
                      <p className="text-white font-medium text-sm">{org?.name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Branche</p>
                      <p className="text-white font-medium text-sm">{org?.industry || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Plan</p>
                      <p className="text-white font-medium text-sm capitalize">{org?.plan || "—"}</p>
                    </div>
                  </div>
                </Card>

                <Card title="Meine Rolle" className="rounded-2xl shadow-md">
                  {user?.role === "admin" ? (
                    <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {user?.email?.[0]?.toUpperCase() ?? "?"}
                        </span>
                        <div>
                          <p className="text-white font-medium text-sm">{user?.email}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Company Admin</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Als Company Admin hast du Zugriff auf alle Module und Funktionen deiner Organisation.
                      </p>
                    </div>
                  ) : user?.org_role ? (
                    <div className="bg-gray-800/50 rounded-xl p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {user?.email?.[0]?.toUpperCase() ?? "?"}
                        </span>
                        <div>
                          <p className="text-white font-medium text-sm">{user?.email}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{user.org_role.name}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Freigeschaltete Bereiche</p>
                        {user.org_role.permissions?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {user.org_role.permissions.map(p => (
                              <span key={p} className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white">
                                {PERMISSION_LABELS[p] ?? p}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Keine Berechtigungen zugewiesen.</p>
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
              </>
            )}

          </div>
        </div>
      </div>

      {/* Modals */}
      {showProviderModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white">E-Mail Anbieter auswählen</h2>
            <div className="space-y-3">
              <button onClick={() => handleProviderSelect("gmail")} className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition text-sm">
                Google (Gmail)
              </button>
              <button onClick={() => handleProviderSelect("outlook")} className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition text-sm">
                Microsoft Outlook
              </button>
            </div>
            <button onClick={() => setShowProviderModal(false)} className="text-sm text-gray-400 hover:text-white transition">
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* ══ E-MAIL VORLAGEN ══ */}
      {activeTab === "email_vorlagen" && isAdmin && (
        <EmailVorlagenTab />
      )}

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      <DeleteAccountModal  isOpen={showDeleteModal}   onClose={() => setShowDeleteModal(false)} />

    </PageLayout>
  );
}
