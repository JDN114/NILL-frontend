// src/pages/SettingsPage.jsx

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import PageLayout from "../components/layout/PageLayout";
import { GmailContext }   from "../context/GmailContext";
import { OutlookContext } from "../context/OutlookContext";
import { ImapContext }    from "../context/ImapContext";
import { useAuth }        from "../context/AuthContext";
import api, { logoutUser } from "../services/api";
import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal  from "../components/DeleteAccountModal";
import EmailVorlagenTab    from "../components/EmailVorlagenTab";
import ImapConnectModal, { getImapSavedConfigs } from "../components/ImapConnectModal";

// ─── Design Tokens ──────────────────────────────────────────────────────────
const surface  = "rgba(255,255,255,0.03)";
const border   = "rgba(239,237,231,0.07)";
const borderHi = "rgba(197,165,114,0.28)";
const text     = "var(--nill-text,#efede7)";
const dim      = "var(--nill-text-dim,rgba(239,237,231,.5))";
const mute     = "var(--nill-text-mute,rgba(239,237,231,.28))";
const gold     = "var(--nill-gold,#c5a572)";
const goldDim  = "rgba(197,165,114,0.1)";
const red      = "#f87171";
const green    = "#34d399";
const amber    = "#fbbf24";

// ─── Shared primitives ──────────────────────────────────────────────────────
const panelStyle = {
  background: surface,
  border: `1px solid ${border}`,
  borderRadius: 14,
  overflow: "hidden",
};

const sectionHeadStyle = {
  padding: "0.85rem 1.25rem",
  borderBottom: `1px solid ${border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.85rem 1.25rem",
  borderBottom: `1px solid ${border}`,
  gap: "1rem",
};

const inputStyle = {
  width: "100%", padding: "0.55rem 0.85rem",
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${border}`,
  borderRadius: 9, color: text,
  fontSize: "0.83rem", outline: "none",
  transition: "border-color 0.15s", boxSizing: "border-box",
};

const btnPrimary = {
  padding: "0.5rem 1.3rem",
  background: gold, color: "#000",
  border: "none", borderRadius: 8,
  fontWeight: 700, fontSize: "0.82rem",
  cursor: "pointer", transition: "opacity 0.15s",
};

const btnGhost = {
  padding: "0.5rem 1.1rem",
  background: "transparent",
  border: `1px solid ${border}`,
  borderRadius: 8, color: dim,
  fontSize: "0.82rem", cursor: "pointer",
  transition: "border-color 0.15s, color 0.15s",
};

const btnDanger = {
  padding: "0.5rem 1.1rem",
  background: "rgba(248,113,113,0.08)",
  border: "1px solid rgba(248,113,113,0.25)",
  borderRadius: 8, color: red,
  fontSize: "0.82rem", cursor: "pointer",
};

// ─── Label + Input helper ──────────────────────────────────────────────────
function Field({ label, children, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: dim,
        textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {label}
      </label>
      {children}
      {hint && <span style={{ fontSize: "0.71rem", color: mute }}>{hint}</span>}
    </div>
  );
}

// ─── Toggle switch ──────────────────────────────────────────────────────────
function Toggle({ on, onChange, label, description }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.85rem 1.25rem", borderBottom: `1px solid ${border}`, gap: "1rem" }}>
      <div>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: text }}>{label}</div>
        {description && <div style={{ fontSize: "0.75rem", color: dim, marginTop: 2 }}>{description}</div>}
      </div>
      <button
        onClick={() => onChange(!on)}
        style={{
          width: 44, height: 24, borderRadius: 99, border: "none",
          background: on ? gold : "rgba(255,255,255,0.1)",
          cursor: "pointer", position: "relative", flexShrink: 0,
          transition: "background 0.2s",
        }}
      >
        <span style={{
          position: "absolute", top: 3, left: on ? 23 : 3,
          width: 18, height: 18, borderRadius: "50%",
          background: on ? "#000" : "rgba(255,255,255,0.5)",
          transition: "left 0.2s",
        }} />
      </button>
    </div>
  );
}

// ─── Badge ──────────────────────────────────────────────────────────────────
function Badge({ label, color = gold }) {
  return (
    <span style={{
      fontSize: "0.68rem", fontWeight: 700, padding: "2px 9px",
      borderRadius: 99, whiteSpace: "nowrap",
      background: color === green  ? "rgba(52,211,153,0.1)"  :
                  color === red    ? "rgba(248,113,113,0.1)" :
                  color === amber  ? "rgba(251,191,36,0.1)"  : goldDim,
      border: `1px solid ${color === green  ? "rgba(52,211,153,0.25)"  :
                            color === red    ? "rgba(248,113,113,0.25)" :
                            color === amber  ? "rgba(251,191,36,0.25)"  :
                            "rgba(197,165,114,0.25)"}`,
      color,
    }}>
      {label}
    </span>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────
function SectionHead({ title, action }) {
  return (
    <div style={sectionHeadStyle}>
      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: dim,
        textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {title}
      </span>
      {action}
    </div>
  );
}

// ─── Coming Soon Overlay ────────────────────────────────────────────────────
function ComingSoon({ label = "Demnächst" }) {
  return (
    <Badge label={label} color={amber} />
  );
}

const INDUSTRIES = [
  "Handwerk", "Reinigung", "Werkstatt", "Gastronomie",
  "Beratung", "Gesundheit", "IT & Software", "Handel",
  "Transport", "Immobilien", "Recht & Steuer", "Marketing & Agentur",
  "Bildung", "Sonstiges",
];

const PERMISSION_LABELS = {
  calendar: "Kalender", email: "E-Mail", accounting: "Buchhaltung",
  schedules: "Dienstplan", documents: "Dokumente", inventory: "Inventar",
  wages: "Lohn",
};

const HELP_MODULES = [
  {
    icon: "◎",
    title: "Buchhaltung",
    color: "#c6ff3c",
    features: [
      "Eingangs- & Ausgangsrechnungen erstellen, hochladen und verwalten",
      "Doppelte Buchführung mit SKR03-Kontenrahmen",
      "Automatische USt-Voranmeldung (UStVA) berechnen",
      "GUV, Bilanz und EÜR als Berichte abrufen",
      "Anlagenbuch für Wirtschaftsgüter führen",
      "Steuerübersicht mit Vorauszahlungsberechnung",
      "Lohnsteuerbescheinigungen verwalten",
      "DATEV-Export für Steuerberater",
    ],
  },
  {
    icon: "✉",
    title: "E-Mails",
    color: "#7a5cff",
    features: [
      "Gmail, Outlook & IMAP/Custom-Domain verbinden",
      "Mehrere Postfächer parallel verwalten",
      "E-Mails kategorisieren und filtern",
      "E-Mail-Vorlagen erstellen und verwenden",
      "Anhänge direkt in Buchhaltung übernehmen",
    ],
  },
  {
    icon: "▦",
    title: "Kalender",
    color: "#38f5d0",
    features: [
      "Termine und Meetings planen",
      "Aufgaben mit Fälligkeitsdaten verknüpfen",
      "Teamweite Kalenderansicht für Admins",
      "Wiederholende Ereignisse verwalten",
    ],
  },
  {
    icon: "⌘",
    title: "Team & Workflows",
    color: "#c5a572",
    features: [
      "Aufgaben erstellen, zuweisen & verfolgen",
      "Zeiterfassung pro Mitarbeiter",
      "Rollen mit granularen Berechtigungen definieren",
      "Teammitglieder per E-Mail einladen",
      "Mitarbeiterverwaltung mit Vertragsdaten & Steuerklassen",
      "Lohnabrechnung monatlich generieren & als PDF exportieren",
      "Urlaubsanträge stellen, genehmigen & Resturlaub tracken",
      "HR-Dokumente (Arbeitsverträge, Zeugnisse) hochladen & verwalten",
    ],
  },
  {
    icon: "◈",
    title: "NILL KI-Sekretärin",
    color: "#7a5cff",
    comingSoon: true,
    features: [
      "KI-gestützte Bearbeitung eingehender E-Mails",
      "Automatische Kategorisierung & Weiterleitung",
      "Bewerbermanagement & Kandidatenfilterung",
      "Reisekostenabrechnungen automatisch erfassen",
      "Meeting-Vorbereitung & Protokoll-Erstellung",
    ],
  },
  {
    icon: "◉",
    title: "Einstellungen",
    color: dim,
    features: [
      "Unternehmensprofil (Name, Branche, USt-ID, Adresse) pflegen",
      "E-Mail-Konten verbinden & verwalten",
      "Abonnement & Rechnungen einsehen",
      "Teammitglieder verwalten & Rollen zuweisen",
      "Benachrichtigungen konfigurieren",
      "Sicherheitseinstellungen & aktive Sitzungen",
      "E-Mail-Vorlagen personalisieren",
    ],
  },
];

// ─── Kontakt Modal ───────────────────────────────────────────────────────────
function KontaktModal({ onClose }) {
  const { user } = useAuth();
  const [subject,  setSubject]  = useState("");
  const [message,  setMessage]  = useState("");
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [error,    setError]    = useState("");

  const SUBJECTS = [
    "Technisches Problem",
    "Frage zu meinem Abonnement",
    "Feature-Anfrage",
    "Buchhaltung & Steuern",
    "Datenschutz & DSGVO",
    "Sonstiges",
  ];

  async function handleSend() {
    if (!subject) { setError("Bitte ein Thema wählen."); return; }
    if (!message.trim()) { setError("Bitte eine Nachricht eingeben."); return; }
    setSending(true); setError("");
    try {
      await api.post("/contact", { subject, message, email: user?.email });
      setSent(true);
    } catch {
      // Fallback: mailto
      const body = `Von: ${user?.email ?? ""}\n\n${message}`;
      window.open(`mailto:info@nillai.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#0a0a12", border: `1px solid ${border}`,
        borderRadius: 18, padding: "1.75rem",
        width: "100%", maxWidth: 480,
        display: "flex", flexDirection: "column", gap: "1.25rem",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: text }}>Support kontaktieren</div>
            <div style={{ fontSize: "0.78rem", color: dim, marginTop: 3 }}>
              Wir antworten auf <span style={{ color: gold }}>info@nillai.de</span> innerhalb von 24 h.
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none",
            cursor: "pointer", color: dim, fontSize: "1.3rem", lineHeight: 1 }}>
            ×
          </button>
        </div>

        {sent ? (
          <div style={{
            padding: "1.5rem", textAlign: "center",
            background: "rgba(52,211,153,0.06)",
            border: "1px solid rgba(52,211,153,0.2)",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✓</div>
            <div style={{ fontWeight: 700, color: green, marginBottom: 4 }}>Nachricht gesendet</div>
            <div style={{ fontSize: "0.78rem", color: dim }}>Wir melden uns so bald wie möglich.</div>
            <button onClick={onClose} style={{ ...btnPrimary, marginTop: "1rem" }}>Schließen</button>
          </div>
        ) : (
          <>
            <Field label="Thema">
              <select style={inputStyle} value={subject} onChange={e => setSubject(e.target.value)}>
                <option value="">Thema wählen…</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Nachricht">
              <textarea
                style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
                placeholder="Beschreibe dein Anliegen so detailliert wie möglich…"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </Field>

            {error && <div style={{ fontSize: "0.78rem", color: red }}>{error}</div>}

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button style={btnGhost} onClick={onClose}>Abbrechen</button>
              <button style={{ ...btnPrimary, opacity: sending ? 0.6 : 1 }}
                onClick={handleSend} disabled={sending}>
                {sending ? "Senden…" : "Absenden"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, org, updateOrg, isSolo, isCompanyAdmin } = useAuth();
  const showTeamTab = !isSolo() && org?.plan != null;
  const isAdmin = isCompanyAdmin();

  // ── Provider Contexts ───────────────────────────────────────────────────
  const { connected: gmailConn, connectGmail, disconnectGmail, fetchStatus: fetchGmailStatus } = useContext(GmailContext);
  const { connected: outlookConn, connectOutlook, disconnectOutlook, fetchStatus: fetchOutlookStatus } = useContext(OutlookContext);
  const imap = useContext(ImapContext);
  const imapAccounts = imap?.accounts ?? [];
  const savedImapConfigs = getImapSavedConfigs().filter(
    s => !imapAccounts.some(a => a.email === s.email)
  );

  // ── UI state ────────────────────────────────────────────────────────────
  const [activeTab,        setActiveTab]        = useState("konto");
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showImapModal,    setShowImapModal]     = useState(false);
  const [reauthAccount,    setReauthAccount]     = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal,  setShowDeleteModal]   = useState(false);
  const [showKontakt,      setShowKontakt]       = useState(false);
  const [loadingStatus,    setLoadingStatus]     = useState(false);

  // ── Subscription ────────────────────────────────────────────────────────
  const [subscription,     setSubscription]     = useState(null);
  const [loadingSub,       setLoadingSub]       = useState(true);
  const [billingInvoices,  setBillingInvoices]  = useState(null);
  const [loadingInvoices,  setLoadingInvoices]  = useState(false);
  const [refundEligibility, setRefundEligibility] = useState(null);
  const [refundLoading,     setRefundLoading]     = useState(false);
  const [refundDone,        setRefundDone]        = useState(null);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [cancelLoading,     setCancelLoading]     = useState(false);
  const [cancelDone,        setCancelDone]        = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // ── DSGVO Export ────────────────────────────────────────────────────────
  const [gdprExporting,      setGdprExporting]      = useState(false);
  const [gdprCsvExporting,   setGdprCsvExporting]   = useState(false);
  const [auskunftExporting,  setAuskunftExporting]  = useState(false);

  // ── Company form ────────────────────────────────────────────────────────
  const [orgName,    setOrgName]    = useState(org?.name     ?? "");
  const [orgIndustry, setOrgIndustry] = useState(org?.industry ?? "");
  const [orgVatId,   setOrgVatId]   = useState(org?.vat_id   ?? "");
  const [orgStreet,  setOrgStreet]  = useState(org?.street   ?? "");
  const [orgCity,    setOrgCity]    = useState(org?.city     ?? "");
  const [orgZip,     setOrgZip]     = useState(org?.zip      ?? "");
  const [orgPhone,   setOrgPhone]   = useState(org?.phone    ?? "");
  const [orgWebsite, setOrgWebsite] = useState(org?.website  ?? "");
  const [orgSaving,  setOrgSaving]  = useState(false);
  const [orgSuccess, setOrgSuccess] = useState(false);
  const [orgError,   setOrgError]   = useState("");

  // ── Notification prefs (localStorage + backend) ─────────────────────────
  const [notifs, setNotifs] = useState({
    invoices:  true, tasks:  true,
    team:      true, system: true,
    marketing: false,
  });

  // ── Sessions ────────────────────────────────────────────────────────────
  const [sessions,        setSessions]        = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // ── 2FA ─────────────────────────────────────────────────────────────────
  const [twofa,           setTwofa]           = useState(null); // null | {enabled:bool}
  const [twofaStep,       setTwofaStep]       = useState(null); // null|'confirm'|'backup_codes'|'disable'
  const [twofaSecret,     setTwofaSecret]     = useState("");
  const [twofaUri,        setTwofaUri]        = useState("");
  const [twofaCode,       setTwofaCode]       = useState("");
  const [twofaPassword,   setTwofaPassword]   = useState("");
  const [twofaBackupCodes, setTwofaBackupCodes] = useState([]);
  const [twofaDisableCode,setTwofaDisableCode]= useState("");
  const [twofaLoading,    setTwofaLoading]    = useState(false);
  const [twofaError,      setTwofaError]      = useState("");

  // ── WebAuthn (Biometrie) ─────────────────────────────────────────────
  const [webauthnCreds,      setWebauthnCreds]      = useState([]);
  const [webauthnLoading,    setWebauthnLoading]    = useState(false);
  const [webauthnDeviceName, setWebauthnDeviceName] = useState("Mein Gerät");
  const [webauthnError,      setWebauthnError]      = useState("");

  // ── Effects ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingStatus(true);
      try {
        if (typeof fetchGmailStatus   === "function") await fetchGmailStatus();
        if (typeof fetchOutlookStatus === "function") await fetchOutlookStatus();
        if (typeof imap?.fetchStatus  === "function") await imap.fetchStatus();
      } catch {}
      finally { if (mounted) setLoadingStatus(false); }
    };
    load();
    return () => { mounted = false; };
  }, [fetchGmailStatus, fetchOutlookStatus, imap?.fetchStatus, location.key]);

  useEffect(() => {
    api.get("/me/subscription")
      .then(r => setSubscription(r.data))
      .catch(() => {})
      .finally(() => setLoadingSub(false));
    api.get("/me/refund-eligibility")
      .then(r => setRefundEligibility(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeTab === "abonnement" && billingInvoices === null) {
      setLoadingInvoices(true);
      api.get("/me/billing-invoices")
        .then(r => setBillingInvoices(r.data?.invoices ?? []))
        .catch(() => setBillingInvoices([]))
        .finally(() => setLoadingInvoices(false));
    }
  }, [activeTab, billingInvoices]);

  useEffect(() => {
    const saved = localStorage.getItem("nill_notif_prefs");
    if (saved) { try { setNotifs(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    if (activeTab === "sicherheit") {
      setLoadingSessions(true);
      api.get("/me/sessions")
        .then(r => setSessions(r.data?.sessions ?? []))
        .catch(() => setSessions([]))
        .finally(() => setLoadingSessions(false));
      api.get("/auth/2fa/status")
        .then(r => { setTwofa(r.data); setWebauthnCreds(r.data?.webauthn_credentials ?? []); })
        .catch(() => setTwofa({ enabled: false }));
    }
  }, [activeTab]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    navigate("/login");
  };

  const handleSaveOrg = async () => {
    if (!orgName.trim()) { setOrgError("Unternehmensname darf nicht leer sein."); return; }
    setOrgError(""); setOrgSaving(true); setOrgSuccess(false);
    try {
      const res = await api.patch("/auth/onboarding", {
        name: orgName.trim(), industry: orgIndustry || null,
        vat_id: orgVatId || null, street: orgStreet || null,
        city: orgCity || null, zip: orgZip || null,
        phone: orgPhone || null, website: orgWebsite || null,
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

  const toggleNotif = (key) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    localStorage.setItem("nill_notif_prefs", JSON.stringify(updated));
    api.patch("/me/notification-preferences", updated).catch(() => {});
  };

  const handleRevokeSession = async (id) => {
    try {
      await api.delete(`/me/sessions/${id}`);
      setSessions(s => s.filter(x => x.id !== id));
    } catch {}
  };

  const handleRevokeAll = async () => {
    if (!window.confirm("Alle anderen Sitzungen beenden?")) return;
    try { await api.delete("/me/sessions"); } catch {}
    navigate("/login");
  };

  const handleProviderSelect = (provider) => {
    setShowProviderModal(false);
    if (provider === "gmail")   return connectGmail();
    if (provider === "outlook") return connectOutlook();
    if (provider === "imap") { setReauthAccount(null); setShowImapModal(true); }
  };

  const handleReauth = (account) => { setReauthAccount(account); setShowImapModal(true); };

  const handleDisconnectImap = async (id) => {
    if (!window.confirm("Postfach wirklich trennen?")) return;
    setLoadingStatus(true);
    try { await imap.removeAccount(id); } finally { setLoadingStatus(false); }
  };

  const handleDisconnectGmail   = async () => { setLoadingStatus(true); try { await disconnectGmail();   } finally { setLoadingStatus(false); } };
  const handleDisconnectOutlook = async () => { setLoadingStatus(true); try { await disconnectOutlook(); } finally { setLoadingStatus(false); } };

  const handle2faSetup = async () => {
    setTwofaLoading(true); setTwofaError("");
    try {
      const r = await api.post("/auth/2fa/setup");
      setTwofaSecret(r.data.secret);
      setTwofaUri(r.data.uri);
      setTwofaStep("confirm");
    } catch (e) {
      setTwofaError(e.response?.data?.detail ?? "Fehler beim Setup.");
    } finally { setTwofaLoading(false); }
  };

  const handle2faEnable = async () => {
    setTwofaLoading(true); setTwofaError("");
    try {
      const r = await api.post("/auth/2fa/enable", { code: twofaCode.trim() });
      setTwofa({ enabled: true });
      setTwofaCode(""); setTwofaSecret(""); setTwofaUri("");
      if (r.data?.backup_codes?.length) {
        setTwofaBackupCodes(r.data.backup_codes);
        setTwofaStep("backup_codes");
      } else {
        setTwofaStep(null);
      }
    } catch (e) {
      setTwofaError(e.response?.data?.detail ?? "Ungültiger Code.");
      setTwofaCode("");
    } finally { setTwofaLoading(false); }
  };

  const handle2faDisable = async () => {
    setTwofaLoading(true); setTwofaError("");
    try {
      await api.post("/auth/2fa/disable", { password: twofaPassword, code: twofaDisableCode.trim() });
      setTwofa({ enabled: false });
      setTwofaStep(null);
      setTwofaPassword(""); setTwofaDisableCode("");
    } catch (e) {
      setTwofaError(e.response?.data?.detail ?? "Fehler beim Deaktivieren.");
    } finally { setTwofaLoading(false); }
  };

  const handleWebAuthnRegister = async () => {
    setWebauthnLoading(true); setWebauthnError("");
    try {
      const optRes = await api.post("/auth/2fa/webauthn/register-options");
      const options = optRes.data;

      const b64toArr = s => {
        const b = atob(s.replace(/-/g,"+").replace(/_/g,"/"));
        return Uint8Array.from(b, c => c.charCodeAt(0)).buffer;
      };
      const arrToB64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"");

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: b64toArr(options.challenge),
          rp: { id: options.rp.id, name: options.rp.name },
          user: {
            id: b64toArr(options.user.id),
            name: options.user.name,
            displayName: options.user.displayName,
          },
          pubKeyCredParams: options.pubKeyCredParams,
          timeout: options.timeout,
          attestation: options.attestation || "none",
          authenticatorSelection: options.authenticatorSelection,
        },
      });

      const credPayload = {
        id: credential.id,
        rawId: arrToB64(credential.rawId),
        type: credential.type,
        response: {
          clientDataJSON: arrToB64(credential.response.clientDataJSON),
          attestationObject: arrToB64(credential.response.attestationObject),
        },
      };

      await api.post("/auth/2fa/webauthn/register-verify", {
        credential: credPayload,
        device_name: webauthnDeviceName || "Mein Gerät",
      });

      const r = await api.get("/auth/2fa/status");
      setWebauthnCreds(r.data?.webauthn_credentials ?? []);
      setWebauthnDeviceName("Mein Gerät");
    } catch (err) {
      if (err?.name === "NotAllowedError") {
        setWebauthnError("Registrierung abgebrochen.");
      } else {
        setWebauthnError(err?.response?.data?.detail || "Biometrische Registrierung fehlgeschlagen.");
      }
    } finally {
      setWebauthnLoading(false);
    }
  };

  const handleWebAuthnDelete = async (credId) => {
    try {
      await api.delete(`/auth/2fa/webauthn/credentials/${credId}`);
      setWebauthnCreds(prev => prev.filter(c => c.id !== credId));
    } catch (e) {
      setWebauthnError(e.response?.data?.detail ?? "Fehler beim Löschen.");
    }
  };

  const handleRefund = async () => {
    setRefundLoading(true);
    try {
      const r = await api.post("/me/request-refund");
      setRefundDone(r.data);
      setRefundEligibility(e => ({ ...e, eligible: false, reason: "already_refunded" }));
      setShowRefundConfirm(false);
    } catch (e) {
      alert(e?.response?.data?.detail || "Rückerstattung fehlgeschlagen.");
    } finally {
      setRefundLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      const r = await api.post("/me/cancel-subscription");
      setCancelDone(r.data);
      setSubscription(s => ({ ...s, cancel_at_period_end: true }));
      setShowCancelConfirm(false);
    } catch (e) {
      alert(e?.response?.data?.detail || "Kündigung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleGdprExport = async () => {
    setGdprExporting(true);
    try {
      const r = await api.get("/me/gdpr/export");
      const blob = new Blob([JSON.stringify(r.data, null, 2)], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `nill-daten-export-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setGdprExporting(false);
    }
  };

  const handleGdprCsvExport = async () => {
    setGdprCsvExporting(true);
    try {
      const r = await api.get("/me/gdpr/export", { params: { format: "csv" }, responseType: "blob" });
      const url = URL.createObjectURL(new Blob([r.data], { type: "application/zip" }));
      const a   = document.createElement("a");
      a.href    = url;
      a.download = `DSGVO_Export_${new Date().toISOString().slice(0,10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("CSV-Export fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setGdprCsvExporting(false);
    }
  };

  const handleAuskunft = async () => {
    setAuskunftExporting(true);
    try {
      const r = await api.get("/me/gdpr/auskunft");
      const blob = new Blob([JSON.stringify(r.data, null, 2)], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `nill-dsgvo-auskunft-art15-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Auskunft fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setAuskunftExporting(false);
    }
  };

  const gmailIsConnected   = gmailConn   === true || gmailConn?.connected   === true;
  const outlookIsConnected = outlookConn === true || outlookConn?.connected === true;

  // ── Tab definitions ─────────────────────────────────────────────────────
  const TABS = [
    { id: "konto",           label: "Konto",             icon: svgUser },
    ...(isAdmin ? [
      { id: "unternehmen",   label: "Unternehmen",        icon: svgBuilding },
      { id: "integrationen", label: "Integrationen",      icon: svgPlug },
      { id: "abonnement",    label: "Abonnement",         icon: svgCard },
    ] : []),
    ...(showTeamTab ? [
      { id: "team",          label: "Mein Team",          icon: svgTeam },
    ] : []),
    { id: "benachrichtigungen", label: "Benachrichtigungen", icon: svgBell },
    { id: "sicherheit",     label: "Sicherheit",          icon: svgShield },
    ...(isAdmin ? [
      { id: "email_vorlagen", label: "E-Mail Vorlagen",   icon: svgMail },
    ] : []),
    { id: "hilfe",           label: "Hilfe",              icon: svgHelp },
  ];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <PageLayout>
      <style>{`
        .sp-layout { max-width: 1100px; margin: 0 auto; }
        .sp-header { margin-bottom: 2rem; }
        .sp-body { display: flex; gap: 1.75rem; align-items: flex-start; }
        .sp-sidebar {
          width: 188px; flex-shrink: 0;
          position: sticky; top: 5rem;
          display: flex; flex-direction: column; gap: 2px;
        }
        .sp-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1.25rem; }

        /* Mobile: sidebar becomes horizontal scrollable tab strip */
        @media (max-width: 700px) {
          .sp-header { margin-bottom: 1rem; }
          .sp-body { flex-direction: column; gap: 0; }
          .sp-sidebar {
            width: 100%; position: static;
            flex-direction: row; overflow-x: auto; overflow-y: hidden;
            padding-bottom: 0.5rem; margin-bottom: 1rem;
            scrollbar-width: none; gap: 4px;
          }
          .sp-sidebar::-webkit-scrollbar { display: none; }
          .sp-sidebar-btn {
            flex-shrink: 0 !important;
            border-left: none !important;
            border-bottom: 2px solid transparent;
            white-space: nowrap;
          }
          .sp-sidebar-btn.active {
            border-left: none !important;
            border-bottom: 2px solid var(--nill-gold) !important;
          }
          .sp-sidebar-divider { display: none; }
          .sp-content { gap: 1rem; }
        }

        /* Responsive grids inside settings panels */
        @media (max-width: 640px) {
          .sp-grid-2 { grid-template-columns: 1fr !important; }
          .sp-grid-3 { grid-template-columns: 1fr !important; }
          .sp-grid-zip { grid-template-columns: 1fr !important; }
          .sp-row-flex { flex-direction: column !important; align-items: flex-start !important; }
          .sp-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        }
      `}</style>

      <div className="sp-layout">

        {/* Page Header */}
        <div className="sp-header">
          <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: dim }}>
            Dashboard / Einstellungen
          </span>
          <h1 style={{ fontSize: "clamp(1.4rem, 5vw, 1.85rem)", fontWeight: 800, margin: "0.2rem 0 0.3rem",
            color: text, letterSpacing: "-0.02em" }}>
            Einstellungen
          </h1>
          <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
            Konto, Unternehmen, Integrationen & mehr
          </p>
        </div>

        <div className="sp-body">

          {/* ── Sidebar / Tab Strip ─────────────────────────────────────── */}
          <nav className="sp-sidebar">
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`sp-sidebar-btn${active ? " active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "0.55rem 0.85rem", borderRadius: 9,
                    border: "none", cursor: "pointer", textAlign: "left",
                    background: active ? goldDim  : "transparent",
                    color:      active ? gold     : dim,
                    fontWeight: active ? 700      : 500,
                    fontSize: "0.83rem",
                    transition: "background 0.12s, color 0.12s",
                    borderLeft: active ? `2px solid ${gold}` : "2px solid transparent",
                  }}
                  onMouseOver={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = text; } }}
                  onMouseOut={e =>  { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dim; } }}
                >
                  <span style={{ opacity: active ? 1 : 0.7, flexShrink: 0 }}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}

            {/* Divider */}
            <div className="sp-sidebar-divider" style={{ height: 1, background: border, margin: "0.5rem 0" }} />

            {/* Kontakt Button */}
            <button
              className="sp-sidebar-btn"
              onClick={() => setShowKontakt(true)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "0.55rem 0.85rem", borderRadius: 9,
                border: "none", cursor: "pointer", textAlign: "left",
                background: "transparent", color: dim,
                fontSize: "0.83rem", fontWeight: 500,
                transition: "background 0.12s, color 0.12s",
                borderLeft: "2px solid transparent",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = text; }}
              onMouseOut={e  => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dim; }}
            >
              <span style={{ opacity: 0.7, flexShrink: 0 }}>{svgContact}</span>
              Kontakt
            </button>
          </nav>

          {/* ── Content ──────────────────────────────────────────────────── */}
          <div className="sp-content">

            {/* ══ KONTO ══════════════════════════════════════════════════ */}
            {activeTab === "konto" && (
              <>
                {/* Account Info */}
                <div style={panelStyle}>
                  <SectionHead title="Account" />
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Avatar row */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      padding: "1rem 1.1rem",
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${border}`, borderRadius: 10,
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: goldDim, border: `1px solid ${borderHi}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.1rem", fontWeight: 800, color: gold, flexShrink: 0,
                      }}>
                        {user?.email?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user?.email}
                        </div>
                        <div style={{ fontSize: "0.73rem", color: dim, marginTop: 2, textTransform: "capitalize" }}>
                          {user?.role === "admin" ? "Company Admin" : user?.org_role?.name ?? user?.role ?? "—"}
                        </div>
                      </div>
                      {user?.role === "admin" && (
                        <Badge label="Admin" color={gold} />
                      )}
                    </div>

                    <button style={btnGhost} onClick={() => setShowPasswordModal(true)}>
                      Passwort ändern
                    </button>
                    <button style={btnGhost} onClick={handleLogout}>
                      Ausloggen
                    </button>
                  </div>
                </div>

                {/* DSGVO / Datenschutz */}
                <div style={panelStyle}>
                  <SectionHead title="Datenschutz & DSGVO" />
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                      Gemäß <strong>Art. 20 DSGVO</strong> kannst du alle gespeicherten Daten als JSON oder CSV-ZIP exportieren
                      (inkl. E-Mails, Bewerbungen, Reisen, Verträge, Meetings).
                      Gemäß <strong>Art. 15 DSGVO</strong> erhältst du eine formelle Auskunft über alle Verarbeitungszwecke,
                      Empfänger und Aufbewahrungsfristen.
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <button
                        style={{ ...btnGhost, opacity: gdprExporting ? 0.6 : 1 }}
                        disabled={gdprExporting}
                        onClick={handleGdprExport}
                      >
                        {gdprExporting ? "Wird exportiert…" : "Datenkopie herunterladen (JSON)"}
                      </button>
                      <button
                        style={{ ...btnGhost, opacity: gdprCsvExporting ? 0.6 : 1 }}
                        disabled={gdprCsvExporting}
                        onClick={handleGdprCsvExport}
                      >
                        {gdprCsvExporting ? "Wird exportiert…" : "Datenkopie herunterladen (CSV-ZIP)"}
                      </button>
                    </div>
                    <button
                      style={{ ...btnGhost, opacity: auskunftExporting ? 0.6 : 1 }}
                      disabled={auskunftExporting}
                      onClick={handleAuskunft}
                    >
                      {auskunftExporting ? "Wird erstellt…" : "Datenschutz-Auskunft (Art. 15)"}
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div style={{ ...panelStyle, borderColor: "rgba(248,113,113,0.18)" }}>
                  <SectionHead title="⚠ Gefahrenbereich" />
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                      Das Löschen deines Accounts ist permanent und kann nicht rückgängig gemacht werden.
                      Alle deine Daten, Rechnungen und Einstellungen werden dauerhaft entfernt.
                    </p>
                    <button style={btnDanger} onClick={() => setShowDeleteModal(true)}>
                      Account dauerhaft löschen
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ══ UNTERNEHMEN ════════════════════════════════════════════ */}
            {activeTab === "unternehmen" && isAdmin && (
              <div style={panelStyle}>
                <SectionHead title="Unternehmensprofil" />
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Info grid */}
                  <div className="sp-grid-3" style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem",
                    padding: "1rem 1.1rem",
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${border}`, borderRadius: 10,
                  }}>
                    {[
                      { label: "Name",    value: org?.name      },
                      { label: "Branche", value: org?.industry  },
                      { label: "Plan",    value: org?.plan      },
                      { label: "Status",  value: org?.plan_status,
                        badge: org?.plan_status === "active" ? green : red },
                    ].map(({ label, value, badge }) => (
                      <div key={label}>
                        <div style={{ fontSize: "0.67rem", color: mute, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>{label}</div>
                        <div style={{ marginTop: 3 }}>
                          {badge ? <Badge label={value ?? "—"} color={badge} /> :
                            <span style={{ fontSize: "0.83rem", fontWeight: 600, color: text }}>{value || "—"}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Editable fields */}
                  <div className="sp-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                    <Field label="Unternehmensname *">
                      <input style={inputStyle} value={orgName} onChange={e => setOrgName(e.target.value)}
                        placeholder="Müller Handwerk GmbH" />
                    </Field>
                    <Field label="Branche">
                      <select style={inputStyle} value={orgIndustry} onChange={e => setOrgIndustry(e.target.value)}>
                        <option value="">Bitte wählen…</option>
                        {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                      </select>
                    </Field>
                    <Field label="USt-ID / Steuernummer">
                      <input style={inputStyle} value={orgVatId} onChange={e => setOrgVatId(e.target.value)}
                        placeholder="DE123456789" />
                    </Field>
                    <Field label="Telefon">
                      <input style={inputStyle} value={orgPhone} onChange={e => setOrgPhone(e.target.value)}
                        placeholder="+49 30 12345678" />
                    </Field>
                    <Field label="Straße & Hausnummer">
                      <input style={inputStyle} value={orgStreet} onChange={e => setOrgStreet(e.target.value)}
                        placeholder="Musterstraße 42" />
                    </Field>
                    <div className="sp-grid-zip" style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "0.65rem" }}>
                      <Field label="PLZ">
                        <input style={inputStyle} value={orgZip} onChange={e => setOrgZip(e.target.value)}
                          placeholder="10115" />
                      </Field>
                      <Field label="Stadt">
                        <input style={inputStyle} value={orgCity} onChange={e => setOrgCity(e.target.value)}
                          placeholder="Berlin" />
                      </Field>
                    </div>
                    <Field label="Website" hint="Ohne https://">
                      <input style={inputStyle} value={orgWebsite} onChange={e => setOrgWebsite(e.target.value)}
                        placeholder="www.meinunternehmen.de" />
                    </Field>
                  </div>

                  {orgError   && <div style={{ fontSize: "0.78rem", color: red }}>{orgError}</div>}
                  {orgSuccess && <div style={{ fontSize: "0.78rem", color: green }}>✓ Änderungen gespeichert.</div>}

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button style={{ ...btnPrimary, opacity: orgSaving ? 0.6 : 1 }}
                      onClick={handleSaveOrg} disabled={orgSaving}>
                      {orgSaving ? "Wird gespeichert…" : "Speichern"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ══ INTEGRATIONEN ══════════════════════════════════════════ */}
            {activeTab === "integrationen" && isAdmin && (
              <>
                <div style={panelStyle}>
                  <SectionHead
                    title="E-Mail Konten"
                    action={
                      <button style={{ ...btnPrimary, padding: "0.35rem 0.85rem", fontSize: "0.75rem" }}
                        onClick={() => setShowProviderModal(true)}>
                        + Verbinden
                      </button>
                    }
                  />
                  <div style={{ padding: "0.5rem 0" }}>
                    {!gmailIsConnected && !outlookIsConnected && imapAccounts.length === 0 && (
                      <div style={{ padding: "1.5rem 1.25rem", color: mute, fontSize: "0.82rem", textAlign: "center" }}>
                        Noch kein E-Mail-Konto verbunden.
                      </div>
                    )}

                    {gmailIsConnected && (
                      <div style={rowStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(234,67,53,0.12)",
                            border: "1px solid rgba(234,67,53,0.2)", display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: "0.85rem", flexShrink: 0 }}>G</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: text }}>Google Gmail</div>
                            <div style={{ fontSize: "0.72rem", color: dim, marginTop: 1 }}>OAuth verbunden</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <Badge label="Aktiv" color={green} />
                          <button style={btnDanger} onClick={handleDisconnectGmail} disabled={loadingStatus}>Trennen</button>
                        </div>
                      </div>
                    )}

                    {outlookIsConnected && (
                      <div style={rowStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(0,114,239,0.12)",
                            border: "1px solid rgba(0,114,239,0.2)", display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: "0.85rem", flexShrink: 0 }}>M</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: text }}>Microsoft Outlook</div>
                            <div style={{ fontSize: "0.72rem", color: dim, marginTop: 1 }}>OAuth verbunden</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <Badge label="Aktiv" color={green} />
                          <button style={btnDanger} onClick={handleDisconnectOutlook} disabled={loadingStatus}>Trennen</button>
                        </div>
                      </div>
                    )}

                    {imapAccounts.map(a => (
                      <div key={a.id} style={rowStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flex: 1 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(197,165,114,0.1)",
                            border: `1px solid ${borderHi}`, display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: "0.75rem", flexShrink: 0, color: gold, fontWeight: 700 }}>@</div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.email}</div>
                            <div style={{ fontSize: "0.72rem", color: dim, marginTop: 1 }}>
                              Custom-Domain{a.imap_host ? ` · ${a.imap_host.replace(/^imap\./, "")}` : ""}
                              {a.status === "needs_reauth" && <span style={{ color: amber }}> · Verbindung erneuern</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                          <Badge label={a.status === "active" ? "Aktiv" : "Fehler"} color={a.status === "active" ? green : amber} />
                          {a.status === "needs_reauth" && (
                            <button style={{ ...btnGhost, color: amber, borderColor: "rgba(251,191,36,0.3)" }}
                              onClick={() => handleReauth(a)}>Erneuern</button>
                          )}
                          <button style={btnDanger} onClick={() => handleDisconnectImap(a.id)} disabled={loadingStatus}>Trennen</button>
                        </div>
                      </div>
                    ))}

                    {savedImapConfigs.map(s => (
                      <div key={s.email} style={{ ...rowStyle, opacity: 0.7 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flex: 1 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(197,165,114,0.05)",
                            border: `1px solid ${border}`, display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: "0.75rem", flexShrink: 0, color: mute, fontWeight: 700 }}>@</div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.email}</div>
                            <div style={{ fontSize: "0.72rem", color: mute, marginTop: 1 }}>
                              Getrennt{s.imap_host ? ` · ${s.imap_host.replace(/^imap\./, "")}` : ""}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                          <Badge label="Getrennt" color={mute} />
                          <button
                            style={{ ...btnGhost, color: gold, borderColor: "rgba(197,165,114,0.3)" }}
                            onClick={() => { setReauthAccount({ email: s.email }); setShowImapModal(true); }}
                          >Wiederverbinden</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API & Webhooks placeholder */}
                <div style={panelStyle}>
                  <SectionHead title="API & Webhooks" action={<ComingSoon />} />
                  <div style={{ padding: "1.25rem" }}>
                    <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                      API-Schlüssel generieren und Webhooks konfigurieren, um NILL mit externen Systemen zu verbinden.
                      Unterstützt werden REST-Hooks für Rechnungen, Aufgaben und HR-Ereignisse.
                    </p>
                  </div>
                </div>

                {/* Calendar integrations placeholder */}
                <div style={panelStyle}>
                  <SectionHead title="Kalender-Integration" action={<ComingSoon />} />
                  <div style={{ padding: "1.25rem" }}>
                    <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                      Google Calendar, Outlook Calendar & CalDAV-Provider werden demnächst unterstützt.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* ══ ABONNEMENT ═════════════════════════════════════════════ */}
            {activeTab === "abonnement" && isAdmin && (
              <>
                <div style={panelStyle}>
                  <SectionHead title="Aktueller Plan" />
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {loadingSub ? (
                      <div style={{ color: mute, fontSize: "0.82rem" }}>Lade Abonnement…</div>
                    ) : subscription ? (
                      <>
                        <div className="sp-grid-3" style={{
                          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem",
                          padding: "1rem 1.1rem", background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${border}`, borderRadius: 10,
                        }}>
                          {[
                            { label: "Plan",     value: subscription.plan },
                            { label: "Status",   value: subscription.is_subscription_active ? "Aktiv" : "Inaktiv",
                              color: subscription.is_subscription_active ? green : red },
                            { label: "E-Mail",   value: subscription.email },
                            ...(subscription.next_billing_date ? [{
                              label: "Nächste Abbuchung",
                              value: new Date(subscription.next_billing_date).toLocaleDateString("de-DE"),
                            }] : []),
                          ].map(({ label, value, color }) => (
                            <div key={label}>
                              <div style={{ fontSize: "0.67rem", color: mute, textTransform: "uppercase",
                                letterSpacing: "0.07em", fontWeight: 700, marginBottom: 4 }}>{label}</div>
                              {color ? <Badge label={value ?? "—"} color={color} /> :
                                <span style={{ fontSize: "0.83rem", fontWeight: 600, color: text, textTransform: "capitalize" }}>{value ?? "—"}</span>}
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "flex", gap: "0.65rem" }}>
                          <Link to="/redeem-coupon" style={{ ...btnPrimary, display: "inline-block", textDecoration: "none" }}>
                            Coupon einlösen
                          </Link>
                          <Link to="/pricing" style={{ ...btnGhost, display: "inline-block", textDecoration: "none" }}>
                            Plan ändern
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: "0.82rem", color: red }}>
                        Abonnement-Daten konnten nicht geladen werden.
                      </div>
                    )}
                  </div>
                </div>

                {/* ── 14-Tage-Geld-zurück ─────────────────────────────────── */}
                {refundDone && (
                  <div style={{ ...panelStyle, borderColor: green }}>
                    <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1.2rem" }}>✅</span>
                      <p style={{ fontSize: "0.85rem", color: text, fontWeight: 700, margin: 0 }}>
                        Rückerstattung erfolgreich beantragt
                      </p>
                      <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                        {refundDone.message}
                      </p>
                    </div>
                  </div>
                )}

                {refundEligibility?.eligible && !refundDone && (
                  <div style={{ ...panelStyle, borderColor: "rgba(251,191,36,0.35)" }}>
                    <SectionHead
                      title="14-Tage-Geld-zurück-Garantie"
                      action={
                        <Badge
                          label={`Noch ${refundEligibility.days_left} Tag${refundEligibility.days_left !== 1 ? "e" : ""}`}
                          color={amber}
                        />
                      }
                    />
                    <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                        Du bist innerhalb der 14-Tage-Frist. Du kannst eine vollständige Rückerstattung beantragen —
                        dein Account wird sofort auf Free zurückgesetzt.
                        Der Betrag erscheint in 3–5 Werktagen auf deiner Karte.
                      </p>

                      {/* Countdown bar */}
                      {(() => {
                        const total = 14;
                        const used  = total - (refundEligibility.days_left || 0);
                        const pct   = Math.min(100, (used / total) * 100);
                        return (
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between",
                              fontSize: "0.72rem", color: mute, marginBottom: 4 }}>
                              <span>Tag {used} von 14</span>
                              <span>Frist: {new Date(refundEligibility.deadline).toLocaleDateString("de-DE")}</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                              <div style={{
                                height: "100%", borderRadius: 99,
                                width: `${pct}%`,
                                background: pct > 80 ? red : amber,
                                transition: "width 0.4s",
                              }}/>
                            </div>
                          </div>
                        );
                      })()}

                      {!showRefundConfirm ? (
                        <button
                          onClick={() => setShowRefundConfirm(true)}
                          style={{ ...btnDanger, alignSelf: "flex-start" }}>
                          Rückerstattung beantragen
                        </button>
                      ) : (
                        <div style={{
                          padding: "1rem", borderRadius: 10,
                          background: "rgba(239,68,68,0.06)",
                          border: "1px solid rgba(239,68,68,0.25)",
                          display: "flex", flexDirection: "column", gap: "0.75rem",
                        }}>
                          <p style={{ fontSize: "0.83rem", color: text, fontWeight: 700, margin: 0 }}>
                            Bist du sicher?
                          </p>
                          <p style={{ fontSize: "0.8rem", color: dim, margin: 0 }}>
                            Dein Abonnement wird sofort gekündigt und dein Account auf Free zurückgesetzt.
                            Du verlierst den Zugang zu allen Pro-Funktionen.
                          </p>
                          <div style={{ display: "flex", gap: "0.65rem" }}>
                            <button onClick={() => setShowRefundConfirm(false)} style={btnGhost}>
                              Abbrechen
                            </button>
                            <button
                              onClick={handleRefund}
                              disabled={refundLoading}
                              style={{ ...btnDanger, opacity: refundLoading ? 0.6 : 1 }}>
                              {refundLoading ? "Wird bearbeitet…" : "Ja, Geld zurück"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={panelStyle}>
                  <SectionHead title="Rechnungshistorie" />
                  {loadingInvoices ? (
                    <div style={{ padding: "1.25rem", color: mute, fontSize: "0.82rem" }}>
                      Lade Rechnungen…
                    </div>
                  ) : billingInvoices && billingInvoices.length > 0 ? (
                    <div className="sp-table-wrap"><table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: 480 }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${border}` }}>
                          {["Nr.", "Zeitraum", "Betrag", "Status", ""].map(h => (
                            <th key={h} style={{
                              padding: "0.6rem 1.25rem", textAlign: h === "Betrag" ? "right" : "left",
                              color: mute, fontWeight: 700, fontSize: "0.7rem",
                              textTransform: "uppercase", letterSpacing: "0.06em",
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {billingInvoices.map((inv, i) => {
                          const isLast = i === billingInvoices.length - 1;
                          const fmtDate = ts => ts
                            ? new Date(ts * 1000).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
                            : "—";
                          const fmtAmount = (cents, cur) =>
                            new Intl.NumberFormat("de-DE", { style: "currency", currency: cur || "EUR" })
                              .format((cents || 0) / 100);
                          const statusMeta = {
                            paid:  { label: "Bezahlt",    color: green },
                            open:  { label: "Offen",      color: amber },
                            void:  { label: "Storniert",  color: mute  },
                            draft: { label: "Entwurf",    color: mute  },
                          }[inv.status] || { label: inv.status, color: mute };

                          return (
                            <tr key={inv.id} style={{ borderBottom: isLast ? "none" : `1px solid ${border}` }}>
                              <td style={{ padding: "0.75rem 1.25rem", color: dim, fontFamily: "monospace" }}>
                                {inv.number || inv.id?.slice(-8) || "—"}
                              </td>
                              <td style={{ padding: "0.75rem 1.25rem", color: dim }}>
                                {inv.period_start
                                  ? `${fmtDate(inv.period_start)} – ${fmtDate(inv.period_end)}`
                                  : fmtDate(inv.created)}
                              </td>
                              <td style={{ padding: "0.75rem 1.25rem", color: text, fontWeight: 600, textAlign: "right" }}>
                                {fmtAmount(inv.amount_paid, inv.currency)}
                              </td>
                              <td style={{ padding: "0.75rem 1.25rem" }}>
                                <Badge label={statusMeta.label} color={statusMeta.color} />
                              </td>
                              <td style={{ padding: "0.75rem 1.25rem", textAlign: "right" }}>
                                {inv.invoice_pdf && (
                                  <a
                                    href={inv.invoice_pdf}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      display: "inline-flex", alignItems: "center", gap: 5,
                                      padding: "0.3rem 0.7rem", borderRadius: 6,
                                      border: `1px solid ${border}`, color: dim,
                                      fontSize: "0.75rem", fontWeight: 600,
                                      textDecoration: "none",
                                      transition: "border-color 0.15s, color 0.15s",
                                    }}
                                    onMouseOver={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold; }}
                                    onMouseOut={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = dim; }}
                                  >
                                    {svgDownload} PDF
                                  </a>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table></div>
                  ) : (
                    <div style={{ padding: "1.25rem", color: mute, fontSize: "0.82rem" }}>
                      {billingInvoices === null
                        ? "Rechnungen konnten nicht geladen werden."
                        : "Noch keine Rechnungen vorhanden."}
                    </div>
                  )}
                </div>

                {/* ── Abonnement kündigen ─────────────────────────────────── */}
                {subscription?.is_subscription_active && (
                  <div style={{ ...panelStyle, borderColor: subscription?.cancel_at_period_end ? "rgba(239,68,68,0.25)" : border }}>
                    <SectionHead title="Abonnement kündigen" />
                    <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

                      {cancelDone || subscription?.cancel_at_period_end ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <span style={{ fontSize: "1.1rem" }}>⚠️</span>
                          <p style={{ fontSize: "0.85rem", color: text, fontWeight: 700, margin: 0 }}>
                            Kündigung vorgemerkt
                          </p>
                          <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                            {cancelDone?.message || (
                              subscription?.next_billing_date
                                ? `Dein Abonnement läuft zum ${new Date(subscription.next_billing_date).toLocaleDateString("de-DE")} aus. Bis dahin hast du vollen Zugriff.`
                                : "Dein Abonnement wird zum Ende der aktuellen Abrechnungsperiode beendet."
                            )}
                          </p>
                        </div>
                      ) : (
                        <>
                          <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                            Dein Abonnement läuft bis zum Ende der aktuellen Abrechnungsperiode weiter.
                            Danach wird dein Account automatisch auf Free zurückgesetzt — du verlierst keinen Cent für die bereits bezahlte Zeit.
                          </p>

                          {!showCancelConfirm ? (
                            <button
                              onClick={() => setShowCancelConfirm(true)}
                              style={{ ...btnDanger, alignSelf: "flex-start" }}>
                              Abonnement kündigen
                            </button>
                          ) : (
                            <div style={{
                              padding: "1rem", borderRadius: 10,
                              background: "rgba(239,68,68,0.06)",
                              border: "1px solid rgba(239,68,68,0.25)",
                              display: "flex", flexDirection: "column", gap: "0.75rem",
                            }}>
                              <p style={{ fontSize: "0.83rem", color: text, fontWeight: 700, margin: 0 }}>
                                Abonnement wirklich kündigen?
                              </p>
                              <p style={{ fontSize: "0.8rem", color: dim, margin: 0 }}>
                                Du behältst deinen Zugriff bis zum Ende des aktuellen Abrechnungszeitraums.
                                Danach werden alle Pro-Funktionen deaktiviert. Eine Reaktivierung ist jederzeit möglich.
                              </p>
                              <div style={{ display: "flex", gap: "0.65rem" }}>
                                <button onClick={() => setShowCancelConfirm(false)} style={btnGhost}>
                                  Abbrechen
                                </button>
                                <button
                                  onClick={handleCancelSubscription}
                                  disabled={cancelLoading}
                                  style={{ ...btnDanger, opacity: cancelLoading ? 0.6 : 1 }}>
                                  {cancelLoading ? "Wird bearbeitet…" : "Ja, kündigen"}
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

              </>
            )}

            {/* ══ MEIN TEAM ══════════════════════════════════════════════ */}
            {activeTab === "team" && showTeamTab && (
              <>
                <div style={panelStyle}>
                  <SectionHead title="Organisation" />
                  <div style={{ padding: "1.25rem" }}>
                    <div className="sp-grid-3" style={{
                      display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem",
                      padding: "1rem 1.1rem", background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${border}`, borderRadius: 10,
                    }}>
                      {[
                        { label: "Name",    value: org?.name     },
                        { label: "Branche", value: org?.industry },
                        { label: "Plan",    value: org?.plan     },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div style={{ fontSize: "0.67rem", color: mute, textTransform: "uppercase",
                            letterSpacing: "0.07em", fontWeight: 700, marginBottom: 4 }}>{label}</div>
                          <span style={{ fontSize: "0.83rem", fontWeight: 600, color: text }}>{value || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={panelStyle}>
                  <SectionHead title="Meine Rolle & Berechtigungen" />
                  <div style={{ padding: "1.25rem" }}>
                    {user?.role === "admin" ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: goldDim,
                          border: `1px solid ${borderHi}`, display: "flex", alignItems: "center",
                          justifyContent: "center", fontWeight: 800, color: gold, flexShrink: 0 }}>
                          {user?.email?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: text }}>{user?.email}</div>
                          <div style={{ fontSize: "0.72rem", color: dim, marginTop: 2 }}>
                            Company Admin · Zugriff auf alle Module
                          </div>
                        </div>
                        <Badge label="Admin" color={gold} />
                      </div>
                    ) : user?.org_role ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                          <div style={{ width: 40, height: 40, borderRadius: "50%", background: surface,
                            border: `1px solid ${border}`, display: "flex", alignItems: "center",
                            justifyContent: "center", fontWeight: 800, color: text, flexShrink: 0 }}>
                            {user?.email?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: text }}>{user?.email}</div>
                            <div style={{ fontSize: "0.72rem", color: dim, marginTop: 2 }}>{user.org_role.name}</div>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: "0.72rem", color: mute, textTransform: "uppercase",
                            letterSpacing: "0.07em", fontWeight: 700, marginBottom: "0.55rem" }}>
                            Freigeschaltete Bereiche
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                            {user.org_role.permissions?.length > 0
                              ? user.org_role.permissions.map(p => (
                                  <Badge key={p} label={PERMISSION_LABELS[p] ?? p} color={dim} />
                                ))
                              : <span style={{ fontSize: "0.78rem", color: mute }}>Keine Berechtigungen</span>
                            }
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                        Dir wurde noch keine Rolle zugewiesen. Wende dich an deinen Administrator.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ══ BENACHRICHTIGUNGEN ═════════════════════════════════════ */}
            {activeTab === "benachrichtigungen" && (
              <div style={panelStyle}>
                <SectionHead title="Benachrichtigungseinstellungen" />
                <Toggle on={notifs.invoices}  onChange={v => toggleNotif("invoices")}
                  label="Rechnungen & Zahlungen"
                  description="Benachrichtigungen bei neuen Rechnungen, Zahlungsein- und -ausgängen" />
                <Toggle on={notifs.tasks}     onChange={v => toggleNotif("tasks")}
                  label="Aufgaben & Fristen"
                  description="Erinnerungen bei fälligen Aufgaben und ablaufenden Fristen" />
                <Toggle on={notifs.team}      onChange={v => toggleNotif("team")}
                  label="Team & HR"
                  description="Benachrichtigungen bei Urlaubsanträgen, neuen Mitgliedern und Rollenänderungen" />
                <Toggle on={notifs.system}    onChange={v => toggleNotif("system")}
                  label="System & Sicherheit"
                  description="Wichtige Systemereignisse, Login-Aktivitäten und Sicherheitshinweise" />
                <Toggle on={notifs.marketing} onChange={v => toggleNotif("marketing")}
                  label="Produktneuigkeiten"
                  description="Updates zu neuen Features, Verbesserungen und NILL-Neuigkeiten" />
              </div>
            )}

            {/* ══ SICHERHEIT ═════════════════════════════════════════════ */}
            {activeTab === "sicherheit" && (
              <>
                <div style={panelStyle}>
                  <SectionHead title="Passwort & Anmeldung" />
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                      Verwende ein starkes, einzigartiges Passwort. Mindestens 12 Zeichen empfohlen.
                    </p>
                    <button style={btnGhost} onClick={() => setShowPasswordModal(true)}>
                      Passwort ändern
                    </button>
                  </div>
                </div>

                <div style={panelStyle}>
                  <SectionHead
                    title="Zwei-Faktor-Authentifizierung"
                    action={
                      twofa === null ? null :
                      twofa.enabled
                        ? <Badge label="Aktiv" color={green} />
                        : <Badge label="Inaktiv" color={amber} />
                    }
                  />
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {twofa === null ? (
                      <p style={{ fontSize: "0.82rem", color: mute, margin: 0 }}>Lade…</p>
                    ) : twofaStep === null ? (
                      <>
                        <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                          {twofa.enabled
                            ? "2FA ist aktiv. Dein Account ist durch einen TOTP-Code geschützt."
                            : "Schütze deinen Account mit einem zweiten Faktor via TOTP-App (z.B. Google Authenticator, Authy)."}
                        </p>
                        {twofaError && <div style={{ fontSize: "0.78rem", color: red }}>{twofaError}</div>}
                        {twofa.enabled ? (
                          <button style={{ ...btnDanger, alignSelf: "flex-start" }}
                            onClick={() => { setTwofaStep("disable"); setTwofaError(""); }}>
                            2FA deaktivieren
                          </button>
                        ) : (
                          <button style={{ ...btnGhost, alignSelf: "flex-start" }}
                            disabled={twofaLoading}
                            onClick={handle2faSetup}>
                            {twofaLoading ? "Bitte warten…" : "2FA aktivieren"}
                          </button>
                        )}
                      </>
                    ) : twofaStep === "confirm" ? (
                      <>
                        <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                          Scanne den QR-Code mit deiner Authenticator-App und gib anschließend den angezeigten Code ein.
                        </p>
                        <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                          <div style={{ background: "#fff", padding: 12, borderRadius: 10, flexShrink: 0 }}>
                            <QRCodeSVG value={twofaUri} size={148} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, minWidth: 180 }}>
                            <span style={{ fontSize: "0.72rem", color: mute, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                              Manueller Key
                            </span>
                            <code style={{ fontSize: "0.78rem", color: text, background: "rgba(255,255,255,0.05)",
                              padding: "0.4rem 0.6rem", borderRadius: 6, wordBreak: "break-all", letterSpacing: "0.12em" }}>
                              {twofaSecret}
                            </code>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          <label style={{ fontSize: "0.72rem", color: dim, fontWeight: 700,
                            textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            Bestätigungscode
                          </label>
                          <input
                            style={{ ...inputStyle, maxWidth: 200, textAlign: "center",
                              letterSpacing: "0.25em", fontSize: "1.1rem" }}
                            type="text"
                            inputMode="numeric"
                            placeholder="000000"
                            maxLength={6}
                            value={twofaCode}
                            onChange={e => setTwofaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            autoFocus
                          />
                        </div>
                        {twofaError && <div style={{ fontSize: "0.78rem", color: red }}>{twofaError}</div>}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <button style={btnGhost}
                            onClick={() => { setTwofaStep(null); setTwofaCode(""); setTwofaError(""); }}>
                            Abbrechen
                          </button>
                          <button style={{ ...btnPrimary, opacity: twofaLoading ? 0.6 : 1 }}
                            disabled={twofaLoading || twofaCode.length !== 6}
                            onClick={handle2faEnable}>
                            {twofaLoading ? "Prüfen…" : "2FA aktivieren"}
                          </button>
                        </div>
                      </>
                    ) : twofaStep === "backup_codes" ? (
                      <>
                        <div style={{ padding: "0.85rem 1rem", background: "rgba(197,165,114,0.08)",
                          border: `1px solid ${borderHi}`, borderRadius: 10 }}>
                          <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: gold, fontWeight: 600 }}>
                            ⚠ Backup-Codes sichern
                          </p>
                          <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", color: dim, lineHeight: 1.6 }}>
                            Bewahre diese Codes sicher auf. Jeder Code kann nur <strong>einmal</strong> verwendet werden
                            um dich anzumelden falls du dein Authenticator-Gerät verlierst.
                          </p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem 1rem" }}>
                            {twofaBackupCodes.map((c, i) => (
                              <code key={i} style={{ fontSize: "0.85rem", color: text, letterSpacing: "0.1em",
                                background: "rgba(255,255,255,0.05)", padding: "0.3rem 0.5rem", borderRadius: 5 }}>
                                {c}
                              </code>
                            ))}
                          </div>
                          <button
                            style={{ marginTop: "0.85rem", fontSize: "0.75rem", color: dim, background: "none",
                              border: `1px solid ${border}`, borderRadius: 6, padding: "0.3rem 0.75rem", cursor: "pointer" }}
                            onClick={() => {
                              const text = twofaBackupCodes.join("\n");
                              navigator.clipboard?.writeText(text);
                            }}>
                            In Zwischenablage kopieren
                          </button>
                        </div>
                        <button style={{ ...btnPrimary, alignSelf: "flex-start" }}
                          onClick={() => { setTwofaStep(null); setTwofaBackupCodes([]); }}>
                          Gespeichert — weiter
                        </button>
                      </>
                    ) : twofaStep === "disable" ? (
                      <>
                        <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                          Gib dein Passwort und den aktuellen TOTP-Code ein um 2FA zu deaktivieren.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 320 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <label style={{ fontSize: "0.72rem", color: dim, fontWeight: 700,
                              textTransform: "uppercase", letterSpacing: "0.07em" }}>
                              Passwort
                            </label>
                            <input style={inputStyle} type="password" placeholder="••••••••"
                              value={twofaPassword}
                              onChange={e => setTwofaPassword(e.target.value)} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <label style={{ fontSize: "0.72rem", color: dim, fontWeight: 700,
                              textTransform: "uppercase", letterSpacing: "0.07em" }}>
                              Authenticator-Code
                            </label>
                            <input
                              style={{ ...inputStyle, letterSpacing: "0.2em", textAlign: "center" }}
                              type="text"
                              inputMode="numeric"
                              placeholder="000000"
                              maxLength={6}
                              value={twofaDisableCode}
                              onChange={e => setTwofaDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            />
                          </div>
                        </div>
                        {twofaError && <div style={{ fontSize: "0.78rem", color: red }}>{twofaError}</div>}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <button style={btnGhost}
                            onClick={() => { setTwofaStep(null); setTwofaPassword(""); setTwofaDisableCode(""); setTwofaError(""); }}>
                            Abbrechen
                          </button>
                          <button style={{ ...btnDanger, opacity: twofaLoading ? 0.6 : 1 }}
                            disabled={twofaLoading || !twofaPassword || twofaDisableCode.length !== 6}
                            onClick={handle2faDisable}>
                            {twofaLoading ? "Bitte warten…" : "2FA deaktivieren"}
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* ── WebAuthn / Biometrisches Login ── */}
                <div style={panelStyle}>
                  <SectionHead
                    title="Biometrisches Login (Passkey)"
                    action={<Badge label={webauthnCreds.length > 0 ? `${webauthnCreds.length} Gerät${webauthnCreds.length !== 1 ? "e" : ""}` : "Keine"} color={webauthnCreds.length > 0 ? green : amber} />}
                  />
                  <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                      Melde dich per Fingerabdruck, Face ID oder Windows Hello an — ohne Code einzugeben.
                      Registriere dazu dieses Gerät als Passkey.
                    </p>

                    {/* Registered devices */}
                    {webauthnCreds.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {webauthnCreds.map(c => (
                          <div key={c.id} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "0.55rem 0.85rem",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid var(--nill-border)",
                            borderRadius: 8,
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: "1rem" }}>🪪</span>
                              <div>
                                <div style={{ fontSize: "0.82rem", color: text, fontWeight: 600 }}>{c.device_name}</div>
                                <div style={{ fontSize: "0.7rem", color: mute }}>
                                  {c.created_at ? new Date(c.created_at).toLocaleDateString("de-DE") : ""}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleWebAuthnDelete(c.id)}
                              style={{ ...btnDanger, padding: "0.3rem 0.65rem", fontSize: "0.72rem" }}>
                              Entfernen
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Register new device */}
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        style={{ ...inputStyle, flex: 1, minWidth: 140 }}
                        placeholder="Gerätename (z.B. MacBook)"
                        value={webauthnDeviceName}
                        onChange={e => setWebauthnDeviceName(e.target.value)}
                      />
                      <button
                        style={{ ...btnGhost, whiteSpace: "nowrap", opacity: webauthnLoading ? 0.6 : 1 }}
                        disabled={webauthnLoading || !("credentials" in navigator)}
                        onClick={handleWebAuthnRegister}>
                        {webauthnLoading ? "Bitte warten…" : "🪪 Gerät registrieren"}
                      </button>
                    </div>

                    {!("credentials" in navigator) && (
                      <p style={{ fontSize: "0.78rem", color: amber, margin: 0 }}>
                        Dein Browser unterstützt keine Passkeys.
                      </p>
                    )}
                    {webauthnError && <div style={{ fontSize: "0.78rem", color: red }}>{webauthnError}</div>}
                  </div>
                </div>

                <div style={panelStyle}>
                  <SectionHead
                    title="Aktive Sitzungen"
                    action={
                      sessions.length > 1 && (
                        <button style={{ ...btnDanger, padding: "0.3rem 0.75rem", fontSize: "0.73rem" }}
                          onClick={handleRevokeAll}>
                          Alle anderen beenden
                        </button>
                      )
                    }
                  />
                  <div style={{ padding: "0.5rem 0" }}>
                    {loadingSessions ? (
                      <div style={{ padding: "1.25rem", color: mute, fontSize: "0.82rem" }}>Lade Sitzungen…</div>
                    ) : sessions.length === 0 ? (
                      <div style={{ padding: "1.25rem", color: mute, fontSize: "0.82rem", textAlign: "center" }}>
                        Keine aktiven Sitzungen gefunden.
                      </div>
                    ) : (
                      sessions.map((s, i) => (
                        <div key={s.id ?? i} style={rowStyle}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.83rem", color: text }}>
                              {s.device ?? s.user_agent ?? "Unbekanntes Gerät"}
                              {i === 0 && <Badge label="Diese Sitzung" color={green} />}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: dim, marginTop: 2 }}>
                              {s.ip ?? ""} {s.last_active ? `· Zuletzt aktiv: ${new Date(s.last_active).toLocaleString("de-DE")}` : ""}
                            </div>
                          </div>
                          {i > 0 && (
                            <button style={btnDanger} onClick={() => handleRevokeSession(s.id)}>Beenden</button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ══ E-MAIL VORLAGEN ════════════════════════════════════════ */}
            {activeTab === "email_vorlagen" && isAdmin && (
              <EmailVorlagenTab />
            )}

            {/* ══ HILFE ══════════════════════════════════════════════════ */}
            {activeTab === "hilfe" && (
              <>
                <div style={{ ...panelStyle, padding: "1.5rem" }}>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: text, marginBottom: "0.35rem" }}>
                    NILL — Funktionsübersicht
                  </div>
                  <p style={{ fontSize: "0.82rem", color: dim, margin: 0 }}>
                    Hier findest du eine Übersicht aller verfügbaren Module und ihrer Kernfunktionen.
                    Fragen? Nutze den{" "}
                    <button onClick={() => setShowKontakt(true)}
                      style={{ background: "none", border: "none", color: gold, cursor: "pointer",
                        fontSize: "0.82rem", padding: 0, textDecoration: "underline" }}>
                      Support-Chat
                    </button>.
                  </p>
                </div>

                {HELP_MODULES.map(mod => (
                  <div key={mod.title} style={panelStyle}>
                    <div style={{ padding: "0.85rem 1.25rem", borderBottom: `1px solid ${border}`,
                      display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.2rem", color: mod.color }}>{mod.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: text }}>{mod.title}</span>
                      {mod.comingSoon && <ComingSoon />}
                    </div>
                    <div style={{ padding: "1rem 1.25rem" }}>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none",
                        display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                        {mod.features.map(f => (
                          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem",
                            fontSize: "0.82rem", color: dim }}>
                            <span style={{ color: mod.color, flexShrink: 0, marginTop: 1 }}>›</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                <div style={{ ...panelStyle, padding: "1.25rem", textAlign: "center" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: text, marginBottom: "0.5rem" }}>
                    Noch Fragen?
                  </div>
                  <p style={{ fontSize: "0.82rem", color: dim, margin: "0 0 1rem" }}>
                    Unser Support-Team hilft dir gerne weiter — innerhalb von 24 Stunden.
                  </p>
                  <button style={btnPrimary} onClick={() => setShowKontakt(true)}>
                    Support kontaktieren
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* ══ Provider-Picker-Modal ══════════════════════════════════════════ */}
      {showProviderModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 50, padding: "1rem",
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowProviderModal(false); }}
        >
          <div style={{
            background: "#0a0a12", border: `1px solid ${border}`,
            borderRadius: 18, padding: "1.75rem",
            width: "100%", maxWidth: 420,
            display: "flex", flexDirection: "column", gap: "1.1rem",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          }}>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: text }}>E-Mail Anbieter auswählen</div>
              <div style={{ fontSize: "0.78rem", color: dim, marginTop: 3 }}>Mehrere Konten können parallel verbunden werden.</div>
            </div>
            {[
              { key: "gmail",   label: "Google Gmail",       sub: "OAuth — sichere Anmeldung über Google",
                bg: "rgba(234,67,53,0.08)", bc: "rgba(234,67,53,0.2)" },
              { key: "outlook", label: "Microsoft Outlook",  sub: "OAuth — sichere Anmeldung über Microsoft",
                bg: "rgba(0,114,239,0.08)", bc: "rgba(0,114,239,0.2)" },
              { key: "imap",    label: "Custom Domain (IMAP)", sub: "Mailbox.org, Posteo, IONOS, Strato & alle anderen IMAP-Provider",
                bg: goldDim, bc: borderHi },
            ].map(p => (
              <button key={p.key} onClick={() => handleProviderSelect(p.key)}
                style={{
                  width: "100%", padding: "0.85rem 1rem", borderRadius: 10,
                  background: p.bg, border: `1px solid ${p.bc}`,
                  cursor: "pointer", textAlign: "left",
                  transition: "opacity 0.15s",
                }}
                onMouseOver={e => e.currentTarget.style.opacity = "0.8"}
                onMouseOut={e => e.currentTarget.style.opacity = "1"}
              >
                <div style={{ fontWeight: 700, fontSize: "0.87rem", color: text }}>{p.label}</div>
                <div style={{ fontSize: "0.73rem", color: dim, marginTop: 3 }}>{p.sub}</div>
              </button>
            ))}
            <button onClick={() => setShowProviderModal(false)}
              style={{ background: "none", border: "none", color: dim, cursor: "pointer",
                fontSize: "0.82rem", textAlign: "center" }}>
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* ══ Modals ══════════════════════════════════════════════════════════ */}
      {showKontakt && <KontaktModal onClose={() => setShowKontakt(false)} />}

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      <DeleteAccountModal  isOpen={showDeleteModal}   onClose={() => setShowDeleteModal(false)} />
      <ImapConnectModal
        open={showImapModal}
        account={reauthAccount}
        onClose={() => { setShowImapModal(false); setReauthAccount(null); }}
        onConnected={async () => { await imap?.fetchStatus?.(); setShowImapModal(false); setReauthAccount(null); }}
      />
    </PageLayout>
  );
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const iconProps = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" };

const svgUser = (
  <svg {...iconProps}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const svgBuilding = (
  <svg {...iconProps}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const svgPlug = (
  <svg {...iconProps}>
    <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757"/>
    <path d="M7.19 14.688a4.5 4.5 0 01-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757"/>
  </svg>
);
const svgCard = (
  <svg {...iconProps}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const svgTeam = (
  <svg {...iconProps}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const svgBell = (
  <svg {...iconProps}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const svgShield = (
  <svg {...iconProps}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const svgMail = (
  <svg {...iconProps}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const svgHelp = (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const svgContact = (
  <svg {...iconProps}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const svgDownload = (
  <svg {...iconProps}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
