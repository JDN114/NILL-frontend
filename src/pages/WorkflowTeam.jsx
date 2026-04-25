// src/pages/WorkflowTeam.jsx
import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const ALL_PERMISSIONS = [
  { key: "calendar",   label: "Kalender" },
  { key: "email",      label: "E-Mail" },
  { key: "accounting", label: "Buchhaltung" },
  { key: "schedules",  label: "Stundenpläne" },
  { key: "documents",  label: "Dokumente" },
  { key: "inventory",  label: "Inventur" },
  { key: "wages",      label: "Löhne" },
];

/* ── Shared Styles ──────────────────────────────────────── */
const panelStyle = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid var(--nill-border)",
  borderRadius: 14,
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  overflow: "hidden",
};

const inputStyle = {
  width: "100%", padding: "0.6rem 0.9rem",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--nill-border)",
  borderRadius: 9, color: "var(--nill-text)",
  fontSize: "0.82rem", outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

function PermBadge({ label, active }) {
  return (
    <span style={{
      fontSize: "0.7rem", fontWeight: 600,
      padding: "0.2rem 0.6rem", borderRadius: 20,
      background: active ? "rgba(134,239,172,0.08)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${active ? "rgba(134,239,172,0.2)" : "var(--nill-border)"}`,
      color: active ? "#86efac" : "var(--nill-text-dim)",
    }}>
      {label}
    </span>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 50, padding: "1rem",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#0d1628",
        border: "1px solid var(--nill-border-lg)",
        borderRadius: 16,
        padding: "1.75rem",
        width: "100%", maxWidth: 440,
        boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        display: "flex", flexDirection: "column", gap: "1.25rem",
      }}>
        {children}
      </div>
    </div>
  );
}

function ModalTitle({ children }) {
  return (
    <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--nill-text)" }}>
      {children}
    </h2>
  );
}

function ModalLabel({ children }) {
  return (
    <label style={{
      display: "block", marginBottom: "0.4rem",
      fontSize: "0.73rem", fontWeight: 600,
      textTransform: "uppercase", letterSpacing: "0.07em",
      color: "var(--nill-text-mute)",
    }}>
      {children}
    </label>
  );
}

function BtnPrimary({ children, onClick, disabled, danger }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1, padding: "0.65rem",
        background: danger ? "rgba(248,113,113,0.12)" : "var(--nill-gold-dim)",
        border: `1px solid ${danger ? "rgba(248,113,113,0.3)" : "rgba(197,165,114,0.3)"}`,
        borderRadius: 10, cursor: "pointer",
        color: danger ? "#f87171" : "var(--nill-gold)",
        fontSize: "0.82rem", fontWeight: 700,
        opacity: disabled ? 0.5 : 1,
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function BtnSecondary({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: "0.65rem",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--nill-border)",
        borderRadius: 10, cursor: "pointer",
        color: "var(--nill-text-sub)",
        fontSize: "0.82rem", fontWeight: 600,
        transition: "background 0.12s, color 0.12s",
      }}
      onMouseOver={e => { e.currentTarget.style.background = "var(--nill-panel-hov)"; e.currentTarget.style.color = "var(--nill-text)"; }}
      onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--nill-text-sub)"; }}
    >
      {children}
    </button>
  );
}

/* ── Haupt-Komponente ───────────────────────────────────── */
export default function WorkflowTeam() {
  const { user, isCompanyAdmin } = useAuth();

  const [members, setMembers]     = useState([]);
  const [roles, setRoles]         = useState([]);
  const [invites, setInvites]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("members");

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole]     = useState(null);
  const [roleName, setRoleName]           = useState("");
  const [rolePerms, setRolePerms]         = useState([]);
  const [roleSaving, setRoleSaving]       = useState(false);
  const [roleError, setRoleError]         = useState("");

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail]         = useState("");
  const [inviteRoleId, setInviteRoleId]       = useState("");
  const [inviteSending, setInviteSending]     = useState(false);
  const [inviteError, setInviteError]         = useState("");
  const [inviteSuccess, setInviteSuccess]     = useState("");

  const [assigningMember, setAssigningMember] = useState(null);
  const [assignRoleId, setAssignRoleId]       = useState("");
  const [deletingMember, setDeletingMember]   = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [mRes, rRes, iRes] = await Promise.all([
        api.get("/team/members", { withCredentials: true }),
        api.get("/team/roles",   { withCredentials: true }),
        isCompanyAdmin()
          ? api.get("/team/invites", { withCredentials: true })
          : Promise.resolve({ data: [] }),
      ]);
      setMembers(mRes.data ?? []);
      setRoles(rRes.data ?? []);
      setInvites(iRes.data ?? []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreateRole = () => {
    setEditingRole(null); setRoleName(""); setRolePerms([]); setRoleError("");
    setShowRoleModal(true);
  };
  const openEditRole = (role) => {
    setEditingRole(role); setRoleName(role.name);
    setRolePerms(role.permissions ?? []); setRoleError("");
    setShowRoleModal(true);
  };
  const togglePerm = (key) =>
    setRolePerms(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key]);

  const saveRole = async () => {
    if (!roleName.trim()) { setRoleError("Name darf nicht leer sein."); return; }
    setRoleSaving(true); setRoleError("");
    try {
      if (editingRole) {
        const res = await api.put(`/team/roles/${editingRole.id}`,
          { name: roleName.trim(), permissions: rolePerms }, { withCredentials: true });
        setRoles(p => p.map(r => r.id === editingRole.id ? res.data : r));
      } else {
        const res = await api.post("/team/roles",
          { name: roleName.trim(), permissions: rolePerms }, { withCredentials: true });
        setRoles(p => [...p, res.data]);
      }
      setShowRoleModal(false);
    } catch { setRoleError("Fehler beim Speichern."); }
    finally { setRoleSaving(false); }
  };

  const deleteRole = async (id) => {
    try { await api.delete(`/team/roles/${id}`, { withCredentials: true });
      setRoles(p => p.filter(r => r.id !== id)); }
    catch (err) { console.error(err); }
  };

  const assignRole = async (memberId) => {
    try {
      await api.post(`/team/roles/${assignRoleId}/assign/${memberId}`, {}, { withCredentials: true });
      setMembers(p => p.map(m => m.id === memberId
        ? { ...m, org_role_id: assignRoleId, org_role_name: roles.find(r => r.id === assignRoleId)?.name }
        : m));
      setAssigningMember(null); setAssignRoleId("");
    } catch (err) { console.error(err); }
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) { setInviteError("E-Mail darf nicht leer sein."); return; }
    setInviteSending(true); setInviteError(""); setInviteSuccess("");
    try {
      const res = await api.post("/team/invites",
        { email: inviteEmail.trim(), org_role_id: inviteRoleId || null }, { withCredentials: true });
      setInvites(p => [...p, res.data]);
      setInviteSuccess(`Einladung an ${inviteEmail} gesendet.`);
      setInviteEmail(""); setInviteRoleId("");
    } catch (err) {
      const d = err.response?.data?.detail;
      setInviteError(typeof d === "string" ? d : "Fehler beim Einladen.");
    } finally { setInviteSending(false); }
  };

  const revokeInvite = async (id) => {
    try { await api.delete(`/team/invites/${id}`, { withCredentials: true });
      setInvites(p => p.filter(i => i.id !== id)); }
    catch (err) { console.error(err); }
  };

  const deleteMember = async (memberId) => {
    try { await api.delete(`/team/members/${memberId}`, { withCredentials: true });
      setMembers(p => p.filter(m => m.id !== memberId)); setDeletingMember(null); }
    catch (err) { console.error(err); }
  };

  const myRole = user?.org_role ?? null;

  const TABS = [
    { key: "members",  label: "Mitglieder" },
    { key: "roles",    label: "Rollen" },
    { key: "invites",  label: "Einladungen" },
  ];

  if (loading) return (
    <PageLayout>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem",
        padding: "3rem 0", color: "var(--nill-text-mute)", fontSize: "0.82rem" }}>
        <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.08)",
          borderTopColor: "var(--nill-gold)", borderRadius: "50%",
          animation: "em-spin 0.75s linear infinite" }} />
        Lade Team…
      </div>
    </PageLayout>
  );

  return (
    <PageLayout>
      <div style={{ maxWidth: 900, display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* ── Header ──────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--nill-text-dim)" }}>
              Betrieb / Team
            </span>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: "0.25rem 0 0.3rem",
              color: "var(--nill-text)", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
              Team
            </h1>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>
              Mitglieder, Rollen &amp; Einladungen verwalten.
            </p>
          </div>

          {isCompanyAdmin() && (
            <button
              onClick={() => setShowInviteModal(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.6rem 1.2rem",
                background: "var(--nill-gold-dim)",
                border: "1px solid rgba(197,165,114,0.28)",
                borderRadius: 22, cursor: "pointer",
                color: "var(--nill-gold)", fontSize: "0.82rem", fontWeight: 700,
                transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "var(--nill-gold-glow)"; e.currentTarget.style.boxShadow = "0 0 12px rgba(197,165,114,0.15)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "var(--nill-gold-dim)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Mitglied einladen
            </button>
          )}
        </div>

        {/* ── Meine Rolle (non-admin) ─────────────────────── */}
        {!isCompanyAdmin() && myRole && (
          <div style={{ ...panelStyle, padding: "1.25rem 1.5rem" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.08em", color: "var(--nill-text-mute)", margin: "0 0 0.4rem" }}>
              Deine Rolle
            </p>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--nill-text)", margin: "0 0 0.85rem" }}>
              {myRole.name}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {ALL_PERMISSIONS.map(p => (
                <PermBadge key={p.key} label={p.label} active={myRole.permissions?.includes(p.key)} />
              ))}
            </div>
          </div>
        )}

        {/* ── Admin Tabs ───────────────────────────────────── */}
        {isCompanyAdmin() && (
          <>
            {/* Tab Bar */}
            <div style={{
              display: "flex", gap: "2px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--nill-border)",
              borderRadius: 12, padding: 4, width: "fit-content",
            }}>
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); loadAll(); }}
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: 9, border: "none", cursor: "pointer",
                    fontSize: "0.8rem", fontWeight: 600,
                    transition: "background 0.12s, color 0.12s",
                    background: activeTab === tab.key ? "rgba(197,165,114,0.12)" : "transparent",
                    color: activeTab === tab.key ? "var(--nill-gold)" : "var(--nill-text-sub)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Members Tab ───────────────────────────────── */}
            {activeTab === "members" && (
              <div style={panelStyle}>
                {members.length === 0 ? (
                  <div style={{ padding: "3rem", textAlign: "center",
                    fontSize: "0.82rem", color: "var(--nill-text-dim)" }}>
                    Noch keine Mitglieder. Lade jemanden ein.
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--nill-border)" }}>
                        {["E-Mail", "Rolle", ""].map((h, i) => (
                          <th key={i} style={{
                            padding: "0.65rem 1.25rem",
                            textAlign: i === 2 ? "right" : "left",
                            fontSize: "0.68rem", fontWeight: 700,
                            textTransform: "uppercase", letterSpacing: "0.08em",
                            color: "var(--nill-text-mute)",
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m, i) => (
                        <tr key={m.id} style={{
                          borderBottom: i < members.length - 1 ? "1px solid var(--nill-border)" : "none",
                        }}>
                          <td style={{ padding: "0.85rem 1.25rem", color: "var(--nill-text)" }}>{m.email}</td>
                          <td style={{ padding: "0.85rem 1.25rem" }}>
                            {assigningMember === m.id ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <select
                                  value={assignRoleId}
                                  onChange={e => setAssignRoleId(e.target.value)}
                                  style={{ ...selectStyle, width: "auto", padding: "0.3rem 0.65rem", fontSize: "0.78rem" }}
                                >
                                  <option value="">Keine Rolle</option>
                                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                                <button
                                  onClick={() => assignRole(m.id)}
                                  disabled={!assignRoleId}
                                  style={{
                                    padding: "0.3rem 0.75rem",
                                    background: "var(--nill-gold-dim)",
                                    border: "1px solid rgba(197,165,114,0.3)",
                                    borderRadius: 7, cursor: "pointer",
                                    color: "var(--nill-gold)", fontSize: "0.75rem", fontWeight: 600,
                                    opacity: !assignRoleId ? 0.4 : 1,
                                  }}
                                >
                                  Speichern
                                </button>
                                <button
                                  onClick={() => setAssigningMember(null)}
                                  style={{ fontSize: "0.73rem", color: "var(--nill-text-mute)",
                                    background: "none", border: "none", cursor: "pointer" }}
                                >
                                  Abbrechen
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setAssigningMember(m.id); setAssignRoleId(m.org_role_id ?? ""); }}
                                style={{
                                  padding: "0.3rem 0.75rem",
                                  background: "var(--nill-panel)",
                                  border: "1px solid var(--nill-border)",
                                  borderRadius: 7, cursor: "pointer",
                                  color: "var(--nill-text-sub)", fontSize: "0.75rem",
                                  transition: "background 0.12s, color 0.12s",
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = "var(--nill-panel-hov)"; e.currentTarget.style.color = "var(--nill-text)"; }}
                                onMouseOut={e => { e.currentTarget.style.background = "var(--nill-panel)"; e.currentTarget.style.color = "var(--nill-text-sub)"; }}
                              >
                                {m.org_role_name ?? "Keine Rolle"}
                              </button>
                            )}
                          </td>
                          <td style={{ padding: "0.85rem 1.25rem", textAlign: "right" }}>
                            {m.id !== user?.id && (
                              <button
                                onClick={() => setDeletingMember(m)}
                                style={{ fontSize: "0.75rem", color: "#f87171",
                                  background: "none", border: "none", cursor: "pointer",
                                  transition: "color 0.12s" }}
                                onMouseOver={e => e.currentTarget.style.color = "#fca5a5"}
                                onMouseOut={e => e.currentTarget.style.color = "#f87171"}
                              >
                                Entfernen
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── Roles Tab ─────────────────────────────────── */}
            {activeTab === "roles" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <button
                    onClick={openCreateRole}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.4rem",
                      padding: "0.5rem 1rem",
                      background: "var(--nill-panel)",
                      border: "1px solid var(--nill-border)",
                      borderRadius: 9, cursor: "pointer",
                      color: "var(--nill-text-sub)", fontSize: "0.8rem",
                      transition: "background 0.12s, color 0.12s, border-color 0.12s",
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = "var(--nill-panel-hov)"; e.currentTarget.style.color = "var(--nill-text)"; e.currentTarget.style.borderColor = "var(--nill-border-lg)"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "var(--nill-panel)"; e.currentTarget.style.color = "var(--nill-text-sub)"; e.currentTarget.style.borderColor = "var(--nill-border)"; }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Neue Rolle
                  </button>
                </div>

                {roles.length === 0 ? (
                  <div style={{ ...panelStyle, padding: "3rem", textAlign: "center",
                    fontSize: "0.82rem", color: "var(--nill-text-dim)" }}>
                    Noch keine Rollen erstellt.
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.85rem" }}>
                    {roles.map(role => (
                      <div key={role.id} style={{ ...panelStyle, padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--nill-text)" }}>
                            {role.name}
                          </span>
                          <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button onClick={() => openEditRole(role)}
                              style={{ fontSize: "0.73rem", color: "var(--nill-text-mute)",
                                background: "none", border: "none", cursor: "pointer", transition: "color 0.12s" }}
                              onMouseOver={e => e.currentTarget.style.color = "var(--nill-text)"}
                              onMouseOut={e => e.currentTarget.style.color = "var(--nill-text-mute)"}
                            >Bearbeiten</button>
                            <button onClick={() => deleteRole(role.id)}
                              style={{ fontSize: "0.73rem", color: "#f87171",
                                background: "none", border: "none", cursor: "pointer", transition: "color 0.12s" }}
                              onMouseOver={e => e.currentTarget.style.color = "#fca5a5"}
                              onMouseOut={e => e.currentTarget.style.color = "#f87171"}
                            >Löschen</button>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                          {ALL_PERMISSIONS.map(p => (
                            <PermBadge key={p.key} label={p.label} active={role.permissions?.includes(p.key)} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Invites Tab ───────────────────────────────── */}
            {activeTab === "invites" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--nill-text-mute)" }}>
                    Offene Einladungen
                  </span>
                  <button onClick={loadAll}
                    style={{ fontSize: "0.73rem", color: "var(--nill-text-dim)",
                      background: "none", border: "none", cursor: "pointer", transition: "color 0.12s" }}
                    onMouseOver={e => e.currentTarget.style.color = "var(--nill-text)"}
                    onMouseOut={e => e.currentTarget.style.color = "var(--nill-text-dim)"}
                  >
                    ↻ Aktualisieren
                  </button>
                </div>

                {inviteSuccess && (
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#86efac" }}>{inviteSuccess}</p>
                )}

                {invites.length === 0 ? (
                  <div style={{ ...panelStyle, padding: "3rem", textAlign: "center",
                    fontSize: "0.82rem", color: "var(--nill-text-dim)" }}>
                    Keine offenen Einladungen.
                  </div>
                ) : (
                  <div style={panelStyle}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--nill-border)" }}>
                          {["E-Mail", "Rolle", "Status", "Läuft ab", ""].map((h, i) => (
                            <th key={i} style={{
                              padding: "0.65rem 1.1rem",
                              textAlign: i === 4 ? "right" : "left",
                              fontSize: "0.68rem", fontWeight: 700,
                              textTransform: "uppercase", letterSpacing: "0.08em",
                              color: "var(--nill-text-mute)",
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {invites.map((inv, i) => (
                          <tr key={inv.id} style={{
                            borderBottom: i < invites.length - 1 ? "1px solid var(--nill-border)" : "none",
                          }}>
                            <td style={{ padding: "0.8rem 1.1rem", color: "var(--nill-text)" }}>{inv.email}</td>
                            <td style={{ padding: "0.8rem 1.1rem", color: "var(--nill-text-mute)" }}>
                              {roles.find(r => r.id === inv.org_role_id)?.name ?? "—"}
                            </td>
                            <td style={{ padding: "0.8rem 1.1rem" }}>
                              <span style={{
                                fontSize: "0.7rem", fontWeight: 600,
                                padding: "0.2rem 0.6rem", borderRadius: 20,
                                background: inv.status === "pending"
                                  ? "rgba(251,191,36,0.1)"
                                  : inv.status === "accepted"
                                  ? "rgba(134,239,172,0.08)"
                                  : "rgba(255,255,255,0.04)",
                                border: `1px solid ${inv.status === "pending"
                                  ? "rgba(251,191,36,0.2)"
                                  : inv.status === "accepted"
                                  ? "rgba(134,239,172,0.2)"
                                  : "var(--nill-border)"}`,
                                color: inv.status === "pending" ? "#fbbf24"
                                  : inv.status === "accepted" ? "#86efac"
                                  : "var(--nill-text-dim)",
                              }}>
                                {inv.status === "pending" ? "Ausstehend"
                                  : inv.status === "accepted" ? "Angenommen"
                                  : "Abgelaufen"}
                              </span>
                            </td>
                            <td style={{ padding: "0.8rem 1.1rem", color: "var(--nill-text-dim)", fontSize: "0.73rem" }}>
                              {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString("de-DE") : "—"}
                            </td>
                            <td style={{ padding: "0.8rem 1.1rem", textAlign: "right" }}>
                              {inv.status === "pending" && (
                                <button
                                  onClick={() => revokeInvite(inv.id)}
                                  style={{ fontSize: "0.73rem", color: "#f87171",
                                    background: "none", border: "none", cursor: "pointer" }}
                                >
                                  Widerrufen
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal: Rolle erstellen/bearbeiten ───────────── */}
      {showRoleModal && (
        <Modal onClose={() => setShowRoleModal(false)}>
          <ModalTitle>{editingRole ? "Rolle bearbeiten" : "Neue Rolle erstellen"}</ModalTitle>

          <div>
            <ModalLabel>Rollenname</ModalLabel>
            <input
              type="text" value={roleName}
              onChange={e => setRoleName(e.target.value)}
              placeholder="z.B. Buchhalter, Techniker…"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "rgba(197,165,114,0.4)"}
              onBlur={e => e.target.style.borderColor = "var(--nill-border)"}
            />
          </div>

          <div>
            <ModalLabel>Berechtigungen</ModalLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {ALL_PERMISSIONS.map(p => (
                <label key={p.key} style={{
                  display: "flex", alignItems: "center", gap: "0.55rem",
                  cursor: "pointer", padding: "0.5rem 0.75rem",
                  background: rolePerms.includes(p.key) ? "rgba(197,165,114,0.07)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${rolePerms.includes(p.key) ? "rgba(197,165,114,0.2)" : "var(--nill-border)"}`,
                  borderRadius: 8, transition: "all 0.12s",
                }}>
                  <input
                    type="checkbox"
                    checked={rolePerms.includes(p.key)}
                    onChange={() => togglePerm(p.key)}
                    style={{ accentColor: "var(--nill-gold)", width: 14, height: 14, cursor: "pointer" }}
                  />
                  <span style={{
                    fontSize: "0.78rem",
                    color: rolePerms.includes(p.key) ? "var(--nill-gold)" : "var(--nill-text-sub)",
                    fontWeight: rolePerms.includes(p.key) ? 600 : 400,
                    transition: "color 0.12s",
                  }}>
                    {p.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {roleError && <p style={{ margin: 0, fontSize: "0.78rem", color: "#f87171" }}>{roleError}</p>}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <BtnPrimary onClick={saveRole} disabled={roleSaving}>
              {roleSaving ? "Speichern…" : "Speichern"}
            </BtnPrimary>
            <BtnSecondary onClick={() => setShowRoleModal(false)}>Abbrechen</BtnSecondary>
          </div>
        </Modal>
      )}

      {/* ── Modal: Mitglied einladen ─────────────────────── */}
      {showInviteModal && (
        <Modal onClose={() => { setShowInviteModal(false); setInviteError(""); setInviteSuccess(""); }}>
          <ModalTitle>Mitglied einladen</ModalTitle>

          <div>
            <ModalLabel>E-Mail Adresse</ModalLabel>
            <input
              type="email" value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="mitarbeiter@beispiel.de"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "rgba(197,165,114,0.4)"}
              onBlur={e => e.target.style.borderColor = "var(--nill-border)"}
            />
          </div>

          <div>
            <ModalLabel>Rolle zuweisen <span style={{ color: "var(--nill-text-dim)", textTransform: "none", fontSize: "0.7rem" }}>(optional)</span></ModalLabel>
            <select
              value={inviteRoleId}
              onChange={e => setInviteRoleId(e.target.value)}
              style={selectStyle}
            >
              <option value="">Keine Rolle</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          {inviteError   && <p style={{ margin: 0, fontSize: "0.78rem", color: "#f87171" }}>{inviteError}</p>}
          {inviteSuccess && <p style={{ margin: 0, fontSize: "0.78rem", color: "#86efac" }}>{inviteSuccess}</p>}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <BtnPrimary onClick={sendInvite} disabled={inviteSending}>
              {inviteSending ? "Sende…" : "Einladung senden"}
            </BtnPrimary>
            <BtnSecondary onClick={() => { setShowInviteModal(false); setInviteError(""); setInviteSuccess(""); }}>
              Abbrechen
            </BtnSecondary>
          </div>
        </Modal>
      )}

      {/* ── Modal: Mitglied entfernen ────────────────────── */}
      {deletingMember && (
        <Modal onClose={() => setDeletingMember(null)}>
          <ModalTitle>Mitglied entfernen</ModalTitle>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--nill-text-mute)", lineHeight: 1.55 }}>
            Möchtest du{" "}
            <span style={{ color: "var(--nill-text)", fontWeight: 600 }}>{deletingMember.email}</span>{" "}
            wirklich aus dem Team entfernen?
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <BtnPrimary danger onClick={() => deleteMember(deletingMember.id)}>
              Entfernen
            </BtnPrimary>
            <BtnSecondary onClick={() => setDeletingMember(null)}>Abbrechen</BtnSecondary>
          </div>
        </Modal>
      )}

    </PageLayout>
  );
}
