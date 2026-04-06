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

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [membersRes, rolesRes, invitesRes] = await Promise.all([
        api.get("/team/members", { withCredentials: true }),
        api.get("/team/roles", { withCredentials: true }),
        isCompanyAdmin()
          ? api.get("/team/invites", { withCredentials: true })
          : Promise.resolve({ data: [] }),
      ]);
      setMembers(membersRes.data ?? []);
      setRoles(rolesRes.data ?? []);
      setInvites(invitesRes.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    loadAll();
  };

  const openCreateRole = () => {
    setEditingRole(null);
    setRoleName("");
    setRolePerms([]);
    setRoleError("");
    setShowRoleModal(true);
  };

  const openEditRole = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRolePerms(role.permissions ?? []);
    setRoleError("");
    setShowRoleModal(true);
  };

  const togglePerm = (key) => {
    setRolePerms(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  const saveRole = async () => {
    if (!roleName.trim()) { setRoleError("Name darf nicht leer sein."); return; }
    setRoleSaving(true);
    setRoleError("");
    try {
      if (editingRole) {
        const res = await api.put(
          `/team/roles/${editingRole.id}`,
          { name: roleName.trim(), permissions: rolePerms },
          { withCredentials: true }
        );
        setRoles(prev => prev.map(r => r.id === editingRole.id ? res.data : r));
      } else {
        const res = await api.post(
          "/team/roles",
          { name: roleName.trim(), permissions: rolePerms },
          { withCredentials: true }
        );
        setRoles(prev => [...prev, res.data]);
      }
      setShowRoleModal(false);
    } catch (err) {
      setRoleError("Fehler beim Speichern.");
    } finally {
      setRoleSaving(false);
    }
  };

  const deleteRole = async (roleId) => {
    try {
      await api.delete(`/team/roles/${roleId}`, { withCredentials: true });
      setRoles(prev => prev.filter(r => r.id !== roleId));
    } catch (err) {
      console.error(err);
    }
  };

  const assignRole = async (memberId) => {
    try {
      await api.post(
        `/team/roles/${assignRoleId}/assign/${memberId}`,
        {},
        { withCredentials: true }
      );
      setMembers(prev => prev.map(m =>
        m.id === memberId
          ? { ...m, org_role_id: assignRoleId, org_role_name: roles.find(r => r.id === assignRoleId)?.name }
          : m
      ));
      setAssigningMember(null);
      setAssignRoleId("");
    } catch (err) {
      console.error(err);
    }
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) { setInviteError("E-Mail darf nicht leer sein."); return; }
    setInviteSending(true);
    setInviteError("");
    setInviteSuccess("");
    try {
      const res = await api.post(
        "/team/invites",
        { email: inviteEmail.trim(), org_role_id: inviteRoleId || null },
        { withCredentials: true }
      );
      setInvites(prev => [...prev, res.data]);
      setInviteSuccess(`Einladung an ${inviteEmail} gesendet.`);
      setInviteEmail("");
      setInviteRoleId("");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setInviteError(typeof detail === "string" ? detail : "Fehler beim Einladen.");
    } finally {
      setInviteSending(false);
    }
  };

  const revokeInvite = async (inviteId) => {
    try {
      await api.delete(`/team/invites/${inviteId}`, { withCredentials: true });
      setInvites(prev => prev.filter(i => i.id !== inviteId));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMember = async (memberId) => {
    try {
      await api.delete(`/team/members/${memberId}`, { withCredentials: true });
      setMembers(prev => prev.filter(m => m.id !== memberId));
      setDeletingMember(null);
    } catch (err) {
      console.error(err);
    }
  };

  const myRole = user?.org_role ?? null;

  if (loading) {
    return (
      <PageLayout>
        <p className="text-gray-400">Lade Team...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-5xl space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Team</h1>
            <p className="text-gray-400 text-sm mt-1">
              Verwalte Mitglieder, Rollen und Einladungen.
            </p>
          </div>
          {isCompanyAdmin() && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition text-sm"
            >
              + Mitglied einladen
            </button>
          )}
        </div>

        {!isCompanyAdmin() && myRole && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">Deine Rolle</p>
            <p className="text-white font-semibold text-lg">{myRole.name}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {ALL_PERMISSIONS.map(p => (
                <span
                  key={p.key}
                  className={
                    myRole.permissions?.includes(p.key)
                      ? "text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400"
                      : "text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-600"
                  }
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {isCompanyAdmin() && (
          <>
            <div className="flex gap-1 bg-gray-900 rounded-xl p-1 w-fit">
              {["members", "roles", "invites"].map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={
                    activeTab === tab
                      ? "px-4 py-2 rounded-lg text-sm font-medium transition bg-white text-gray-900"
                      : "px-4 py-2 rounded-lg text-sm font-medium transition text-gray-400 hover:text-white"
                  }
                >
                  {tab === "members" ? "Mitglieder"
                    : tab === "roles" ? "Rollen"
                    : "Einladungen"}
                </button>
              ))}
            </div>

            {activeTab === "members" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                {members.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    Noch keine Mitglieder. Lade jemanden ein.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-xs">
                        <th className="text-left px-5 py-3">E-Mail</th>
                        <th className="text-left px-5 py-3">Rolle</th>
                        <th className="text-right px-5 py-3">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map(m => (
                        <tr key={m.id} className="border-b border-gray-800/50 last:border-0">
                          <td className="px-5 py-4 text-white">{m.email}</td>
                          <td className="px-5 py-4">
                            {assigningMember === m.id ? (
                              <div className="flex items-center gap-2">
                                <select
                                  value={assignRoleId}
                                  onChange={e => setAssignRoleId(e.target.value)}
                                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none"
                                >
                                  <option value="">Keine Rolle</option>
                                  {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => assignRole(m.id)}
                                  disabled={!assignRoleId}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-white text-gray-900 font-medium disabled:opacity-40"
                                >
                                  Speichern
                                </button>
                                <button
                                  onClick={() => setAssigningMember(null)}
                                  className="text-xs text-gray-500 hover:text-white"
                                >
                                  Abbrechen
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setAssigningMember(m.id);
                                  setAssignRoleId(m.org_role_id ?? "");
                                }}
                                className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition"
                              >
                                {m.org_role_name ?? "Keine Rolle"}
                              </button>
                            )}
                          </td>
                          <td className="px-5 py-4 text-right">
                            {m.id !== user?.id && (
                              <button
                                onClick={() => setDeletingMember(m)}
                                className="text-xs text-red-400 hover:text-red-300 transition"
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

            {activeTab === "roles" && (
              <div className="space-y-4">
                <button
                  onClick={openCreateRole}
                  className="text-sm px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition"
                >
                  + Neue Rolle
                </button>
                {roles.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-500">
                    Noch keine Rollen erstellt.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map(role => (
                      <div key={role.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-semibold">{role.name}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditRole(role)}
                              className="text-xs text-gray-400 hover:text-white transition"
                            >
                              Bearbeiten
                            </button>
                            <button
                              onClick={() => deleteRole(role.id)}
                              className="text-xs text-red-400 hover:text-red-300 transition"
                            >
                              Löschen
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ALL_PERMISSIONS.map(p => (
                            <span
                              key={p.key}
                              className={
                                role.permissions?.includes(p.key)
                                  ? "text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400"
                                  : "text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-600"
                              }
                            >
                              {p.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "invites" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Offene Einladungen</span>
                  <button
                    onClick={loadAll}
                    className="text-xs text-gray-500 hover:text-white transition"
                  >
                    ↻ Aktualisieren
                  </button>
                </div>
                {inviteSuccess && (
                  <p className="text-green-400 text-sm">{inviteSuccess}</p>
                )}
                {invites.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-500">
                    Keine offenen Einladungen.
                  </div>
                ) : (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-500 text-xs">
                          <th className="text-left px-5 py-3">E-Mail</th>
                          <th className="text-left px-5 py-3">Rolle</th>
                          <th className="text-left px-5 py-3">Status</th>
                          <th className="text-left px-5 py-3">Läuft ab</th>
                          <th className="text-right px-5 py-3">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invites.map(inv => (
                          <tr key={inv.id} className="border-b border-gray-800/50 last:border-0">
                            <td className="px-5 py-4 text-white">{inv.email}</td>
                            <td className="px-5 py-4 text-gray-400">
                              {roles.find(r => r.id === inv.org_role_id)?.name ?? "—"}
                            </td>
                            <td className="px-5 py-4">
                              <span className={
                                inv.status === "pending"
                                  ? "text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400"
                                  : inv.status === "accepted"
                                  ? "text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400"
                                  : "text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-500"
                              }>
                                {inv.status === "pending" ? "Ausstehend"
                                  : inv.status === "accepted" ? "Angenommen"
                                  : "Abgelaufen"}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-gray-500 text-xs">
                              {inv.expires_at
                                ? new Date(inv.expires_at).toLocaleDateString("de-DE")
                                : "—"}
                            </td>
                            <td className="px-5 py-4 text-right">
                              {inv.status === "pending" && (
                                <button
                                  onClick={() => revokeInvite(inv.id)}
                                  className="text-xs text-red-400 hover:text-red-300 transition"
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

      {showRoleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl border border-gray-800">
            <h2 className="text-white font-semibold text-lg">
              {editingRole ? "Rolle bearbeiten" : "Neue Rolle erstellen"}
            </h2>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Rollenname</label>
              <input
                type="text"
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                placeholder="z.B. Buchhalter, Techniker, Kasse…"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Berechtigungen</label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_PERMISSIONS.map(p => (
                  <label key={p.key} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rolePerms.includes(p.key)}
                      onChange={() => togglePerm(p.key)}
                      className="w-4 h-4 rounded accent-white"
                    />
                    <span className="text-gray-300 text-sm group-hover:text-white transition">
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {roleError && <p className="text-red-400 text-sm">{roleError}</p>}
            <div className="flex gap-3 pt-1">
              <button
                onClick={saveRole}
                disabled={roleSaving}
                className="flex-1 py-2.5 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition disabled:opacity-50"
              >
                {roleSaving ? "Speichern…" : "Speichern"}
              </button>
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white transition"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl border border-gray-800">
            <h2 className="text-white font-semibold text-lg">Mitglied einladen</h2>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">E-Mail Adresse</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="mitarbeiter@beispiel.de"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">
                Rolle zuweisen <span className="text-gray-500">(optional)</span>
              </label>
              <select
                value={inviteRoleId}
                onChange={e => setInviteRoleId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-500"
              >
                <option value="">Keine Rolle</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            {inviteError && <p className="text-red-400 text-sm">{inviteError}</p>}
            {inviteSuccess && <p className="text-green-400 text-sm">{inviteSuccess}</p>}
            <div className="flex gap-3 pt-1">
              <button
                onClick={sendInvite}
                disabled={inviteSending}
                className="flex-1 py-2.5 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition disabled:opacity-50"
              >
                {inviteSending ? "Sende…" : "Einladung senden"}
              </button>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteError("");
                  setInviteSuccess("");
                }}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white transition"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingMember && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm space-y-5 shadow-2xl border border-gray-800">
            <h2 className="text-white font-semibold text-lg">Mitglied entfernen</h2>
            <p className="text-gray-400 text-sm">
              Möchtest du <span className="text-white">{deletingMember.email}</span> wirklich aus dem Team entfernen?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteMember(deletingMember.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-500 transition"
              >
                Entfernen
              </button>
              <button
                onClick={() => setDeletingMember(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white transition"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

    </PageLayout>
  );
}
