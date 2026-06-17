import { useEffect, useState, useCallback } from "react";
import PageLayout from "../components/layout/PageLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

/* ── Shared styles ─────────────────────────────────────── */
const panelStyle = {
  background: "rgba(var(--tint),0.025)",
  border: "1px solid var(--nill-border)",
  borderRadius: 14,
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  overflow: "hidden",
};

const inputBase = {
  width: "100%", padding: "0.6rem 0.9rem",
  background: "rgba(var(--tint),0.04)",
  border: "1px solid var(--nill-border)",
  borderRadius: 9, color: "var(--nill-text)",
  fontSize: "0.82rem", outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};

const selectStyle = {
  ...inputBase,
  appearance: "none",
  cursor: "pointer",
};

function Spinner() {
  return (
    <div style={{
      width: 16, height: 16,
      border: "2px solid rgba(var(--tint),0.08)",
      borderTopColor: "var(--nill-gold)",
      borderRadius: "50%",
      animation: "em-spin 0.75s linear infinite",
      flexShrink: 0,
    }} />
  );
}

function StatusBadge({ status }) {
  const map = {
    completed:   { label: "Erledigt",    bg: "rgba(134,239,172,0.08)", border: "rgba(134,239,172,0.2)",  color: "#86efac" },
    escalated:   { label: "Eskaliert",   bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.22)", color: "#f87171" },
    in_progress: { label: "In Bearbeit", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)",   color: "#fbbf24" },
    open:        { label: "Offen",       bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)",  color: "#94a3b8" },
  };
  const s = map[status] ?? { label: status, bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)", color: "#94a3b8" };
  return (
    <span style={{
      fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.65rem",
      borderRadius: 20, background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      whiteSpace: "nowrap",
    }}>{s.label}</span>
  );
}

function PriorityDot({ priority }) {
  const c = { high: "#f87171", medium: "#fbbf24", low: "#86efac" }[priority] ?? "#94a3b8";
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, display: "inline-block", flexShrink: 0 }} />;
}

function RecurrenceBadge({ recurrence }) {
  if (!recurrence) return null;
  const labels = { daily: "Täglich", weekly: "Wöchentlich", monthly: "Monatlich", yearly: "Jährlich" };
  return (
    <span style={{
      fontSize: "0.65rem", fontWeight: 600, padding: "0.15rem 0.55rem",
      borderRadius: 20, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)",
      color: "#a78bfa", whiteSpace: "nowrap",
    }}>↻ {labels[recurrence] ?? recurrence}</span>
  );
}

function DeadlineBadge({ due_at }) {
  if (!due_at) return null;
  const d = new Date(due_at);
  const now = new Date();
  const overdue = d < now;
  const today = d.toDateString() === now.toDateString();
  const label = today ? "Heute fällig" : d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  return (
    <span style={{
      fontSize: "0.65rem", fontWeight: 600, padding: "0.15rem 0.55rem",
      borderRadius: 20,
      background: overdue ? "rgba(248,113,113,0.1)" : today ? "rgba(251,191,36,0.1)" : "rgba(148,163,184,0.07)",
      border: `1px solid ${overdue ? "rgba(248,113,113,0.3)" : today ? "rgba(251,191,36,0.3)" : "rgba(148,163,184,0.2)"}`,
      color: overdue ? "#f87171" : today ? "#fbbf24" : "#94a3b8",
      whiteSpace: "nowrap",
    }}>📅 {label}</span>
  );
}

/* ── Haupt-Seite ────────────────────────────────────────── */
export default function WorkflowTasksPage() {
  const { user, org, updateOrg } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tasks, setTasks]             = useState([]);
  const [orgUsers, setOrgUsers]       = useState([]);
  const [orgRoles, setOrgRoles]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [createOpen, setCreateOpen]   = useState(false);
  const [myTasksOnly, setMyTasksOnly] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  // Auto-Löschen erledigter Aufgaben (Org-Einstellung, nur Admin)
  const [autoDelEnabled, setAutoDelEnabled] = useState((org?.task_auto_delete_days ?? 0) > 0);
  const [autoDelDays, setAutoDelDays]       = useState(org?.task_auto_delete_days || 30);
  const [autoDelSaving, setAutoDelSaving]   = useState(false);
  const [autoDelMsg, setAutoDelMsg]         = useState("");

  // Formular-State
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium",
    assignee_id: "", assigned_role: "",
    due_at: "", recurrence: "", recurrence_end_at: "",
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (myTasksOnly) params.my_tasks = true;
      if (filterStatus) params.status = filterStatus;
      const res = await api.get("/workflow/tasks", { params });
      setTasks(res.data?.items || []);
      setError(false);
    } catch { setTasks([]); setError(true); }
    finally { setLoading(false); }
  }, [myTasksOnly, filterStatus]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => {
    if (!isAdmin) return;
    api.get("/hr/users").then(r => setOrgUsers(r.data?.users || [])).catch(() => {});
    // Rollen für Rollenzuweisung aus Team-API (Endpoint liefert ein Array)
    api.get("/team/roles").then(r => setOrgRoles(Array.isArray(r.data) ? r.data : (r.data?.roles || []))).catch(() => {});
  }, [isAdmin]);

  // Keep the toggle in sync once the org payload arrives.
  useEffect(() => {
    if (org?.task_auto_delete_days != null) {
      setAutoDelEnabled((org.task_auto_delete_days ?? 0) > 0);
      if (org.task_auto_delete_days > 0) setAutoDelDays(org.task_auto_delete_days);
    }
  }, [org?.task_auto_delete_days]);

  async function saveAutoDelete(nextEnabled, nextDays) {
    setAutoDelSaving(true); setAutoDelMsg("");
    try {
      const days = nextEnabled ? Math.max(1, Math.min(3650, Number(nextDays) || 30)) : 0;
      const res = await api.post("/workflow/tasks/retention-settings", {
        enabled: nextEnabled,
        task_auto_delete_days: days,
      });
      updateOrg?.({ task_auto_delete_days: res.data?.task_auto_delete_days ?? days });
      const purged = res.data?.purged || 0;
      setAutoDelMsg(
        nextEnabled
          ? `✓ Gespeichert${purged ? ` · ${purged} alte erledigte Aufgabe(n) gelöscht` : ""}`
          : "✓ Auto-Löschen deaktiviert"
      );
      if (purged) fetchTasks();
    } catch { setAutoDelMsg("Fehler beim Speichern"); }
    finally { setAutoDelSaving(false); }
  }

  function fv(field, val) { setForm(f => ({ ...f, [field]: val })); }

  async function createTask() {
    if (!form.title.trim()) return;
    setActionLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
        assignee_id: form.assignee_id || undefined,
        assigned_role: form.assigned_role || undefined,
        due_at: form.due_at || undefined,
        recurrence: form.recurrence || undefined,
        recurrence_end_at: form.recurrence_end_at || undefined,
      };
      await api.post("/workflow/tasks", payload);
      setForm({ title: "", description: "", priority: "medium", assignee_id: "", assigned_role: "", due_at: "", recurrence: "", recurrence_end_at: "" });
      setCreateOpen(false);
      fetchTasks();
    } catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  }

  async function completeTask(id) {
    setActionLoading(true);
    try { await api.post(`/workflow/tasks/${id}/complete`, { result_data: {} }); fetchTasks(); }
    catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  }

  async function escalateTask(id) {
    const reason = prompt("Grund für Eskalation?");
    if (!reason) return;
    setActionLoading(true);
    try { await api.post(`/workflow/tasks/${id}/escalate`, { reason }); fetchTasks(); }
    catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  }

  const open = tasks.filter(t => t.status !== "completed" && t.status !== "escalated");
  const done = tasks.filter(t => t.status === "completed");
  const esc  = tasks.filter(t => t.status === "escalated");

  return (
    <PageLayout>
      <style>{`
        @media (max-width: 640px) {
          .wt-form-grid-2 { grid-template-columns: 1fr !important; }
          .wt-form-grid-3 { grid-template-columns: 1fr !important; }
          .wt-task-row    { flex-direction: column; align-items: flex-start !important; gap: 0.5rem !important; }
          .wt-task-actions { margin-left: 0 !important; }
          .wt-h1 { font-size: 1.4rem !important; }
        }
      `}</style>

      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--nill-text-dim)" }}>
            Betrieb / Aufgaben
          </span>
          <h1 className="wt-h1" style={{ fontSize: "1.85rem", fontWeight: 800, margin: "0.25rem 0 0",
            color: "var(--nill-text)", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            Aufgaben
          </h1>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Meine Aufgaben Toggle */}
          <button
            onClick={() => setMyTasksOnly(v => !v)}
            style={{
              padding: "0.5rem 1rem",
              background: myTasksOnly ? "rgba(147,197,253,0.12)" : "transparent",
              border: `1px solid ${myTasksOnly ? "rgba(147,197,253,0.35)" : "var(--nill-border)"}`,
              borderRadius: 22, cursor: "pointer",
              color: myTasksOnly ? "#93c5fd" : "var(--nill-text-sub)",
              fontSize: "0.78rem", fontWeight: 600, transition: "all 0.15s",
            }}
          >
            Meine Aufgaben
          </button>

          {/* Status-Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ ...selectStyle, width: "auto", padding: "0.5rem 0.85rem" }}
          >
            <option value="">Alle Status</option>
            <option value="open">Offen</option>
            <option value="in_progress">In Bearbeitung</option>
            <option value="completed">Erledigt</option>
            <option value="escalated">Eskaliert</option>
          </select>

          {isAdmin && (
            <button
              onClick={() => setCreateOpen(o => !o)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.6rem 1.2rem",
                background: createOpen ? "var(--nill-gold-glow)" : "var(--nill-gold-dim)",
                border: `1px solid ${createOpen ? "rgba(197,165,114,0.5)" : "rgba(197,165,114,0.28)"}`,
                borderRadius: 22, cursor: "pointer",
                color: "var(--nill-gold)", fontSize: "0.82rem", fontWeight: 700,
                transition: "all 0.15s",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Neue Aufgabe
            </button>
          )}
        </div>
      </div>

      {/* ── Auto-Löschen erledigter Aufgaben (Admin) ───────── */}
      {isAdmin && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap",
          padding: "0.7rem 1rem", marginBottom: "1.25rem", borderRadius: 12,
          background: "rgba(var(--tint),0.02)", border: "1px solid var(--nill-border)",
          fontSize: "0.82rem", color: "var(--nill-text-sub)",
        }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={autoDelEnabled}
              onChange={e => {
                const on = e.target.checked;
                setAutoDelEnabled(on);
                saveAutoDelete(on, autoDelDays);
              }}
              style={{ accentColor: "var(--nill-gold)", width: 16, height: 16, cursor: "pointer" }}
            />
            Erledigte Aufgaben automatisch löschen nach
          </label>
          <input
            type="number" min={1} max={3650}
            value={autoDelDays}
            disabled={!autoDelEnabled}
            onChange={e => setAutoDelDays(e.target.value)}
            style={{
              width: 64, padding: "0.3rem 0.5rem", textAlign: "center",
              background: "rgba(var(--tint),0.04)", border: "1px solid var(--nill-border)",
              borderRadius: 7, color: "var(--nill-text)", fontSize: "0.82rem",
              opacity: autoDelEnabled ? 1 : 0.4,
            }}
          />
          <span style={{ opacity: autoDelEnabled ? 1 : 0.4 }}>Tagen</span>
          {autoDelEnabled && (
            <button
              onClick={() => saveAutoDelete(true, autoDelDays)}
              disabled={autoDelSaving}
              style={{
                padding: "0.35rem 0.85rem", borderRadius: 8, cursor: "pointer",
                background: "var(--nill-gold-dim)", border: "1px solid rgba(197,165,114,0.28)",
                color: "var(--nill-gold)", fontSize: "0.75rem", fontWeight: 600,
                opacity: autoDelSaving ? 0.5 : 1,
              }}
            >
              {autoDelSaving ? "Speichern…" : "Übernehmen"}
            </button>
          )}
          {autoDelMsg && (
            <span style={{ fontSize: "0.75rem", color: autoDelMsg.startsWith("Fehler") ? "#f87171" : "#86efac" }}>
              {autoDelMsg}
            </span>
          )}
          <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "var(--nill-text-dim)" }}>
            Nur erledigte Aufgaben · offene bleiben erhalten
          </span>
        </div>
      )}

      {/* ── Aufgabe erstellen (Admin) ──────────────────────── */}
      {createOpen && isAdmin && (
        <div style={{ ...panelStyle, marginBottom: "1.5rem" }}>
          <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid var(--nill-border)",
            fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.09em", color: "var(--nill-text-mute)" }}>
            Neue Aufgabe
          </div>
          <div style={{ padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Zeile 1: Titel + Priorität */}
            <div style={{ display: "flex", gap: "0.65rem" }}>
              <input style={{ ...inputBase, flex: 2 }} placeholder="Titel *"
                value={form.title} onChange={e => fv("title", e.target.value)}
                onFocus={e => e.target.style.borderColor = "rgba(197,165,114,0.4)"}
                onBlur={e => e.target.style.borderColor = "var(--nill-border)"}
              />
              <select style={{ ...selectStyle, flex: 1 }} value={form.priority} onChange={e => fv("priority", e.target.value)}>
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
              </select>
            </div>

            {/* Beschreibung */}
            <textarea style={{ ...inputBase, resize: "vertical", minHeight: 68, lineHeight: 1.5 }}
              placeholder="Beschreibung (optional)"
              value={form.description} onChange={e => fv("description", e.target.value)}
              onFocus={e => e.target.style.borderColor = "rgba(197,165,114,0.4)"}
              onBlur={e => e.target.style.borderColor = "var(--nill-border)"}
            />

            {/* Zeile 2: Mitarbeiter ODER Rolle */}
            <div className="wt-form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              <div>
                <label style={{ fontSize: "0.7rem", color: "var(--nill-text-mute)", marginBottom: 4, display: "block" }}>
                  Mitarbeiter zuweisen
                </label>
                <select style={selectStyle} value={form.assignee_id}
                  onChange={e => { fv("assignee_id", e.target.value); if (e.target.value) fv("assigned_role", ""); }}>
                  <option value="">— kein Mitarbeiter —</option>
                  {orgUsers.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.7rem", color: "var(--nill-text-mute)", marginBottom: 4, display: "block" }}>
                  Rolle zuweisen
                </label>
                <select style={selectStyle} value={form.assigned_role}
                  onChange={e => { fv("assigned_role", e.target.value); if (e.target.value) fv("assignee_id", ""); }}>
                  <option value="">— keine Rolle —</option>
                  {orgRoles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
            </div>

            {/* Zeile 3: Deadline + Wiederholung */}
            <div className="wt-form-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem" }}>
              <div>
                <label style={{ fontSize: "0.7rem", color: "var(--nill-text-mute)", marginBottom: 4, display: "block" }}>
                  Deadline
                </label>
                <input type="datetime-local" style={inputBase} value={form.due_at}
                  onChange={e => fv("due_at", e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.7rem", color: "var(--nill-text-mute)", marginBottom: 4, display: "block" }}>
                  Wiederholung
                </label>
                <select style={selectStyle} value={form.recurrence} onChange={e => fv("recurrence", e.target.value)}>
                  <option value="">Einmalig</option>
                  <option value="daily">Täglich</option>
                  <option value="weekly">Wöchentlich</option>
                  <option value="monthly">Monatlich</option>
                  <option value="yearly">Jährlich</option>
                </select>
              </div>
              {form.recurrence && (
                <div>
                  <label style={{ fontSize: "0.7rem", color: "var(--nill-text-mute)", marginBottom: 4, display: "block" }}>
                    Wiederholung endet
                  </label>
                  <input type="datetime-local" style={inputBase} value={form.recurrence_end_at}
                    onChange={e => fv("recurrence_end_at", e.target.value)} />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.25rem" }}>
              <button onClick={createTask} disabled={!form.title.trim() || actionLoading}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.55rem 1.2rem",
                  background: "var(--nill-gold-dim)", border: "1px solid rgba(197,165,114,0.28)",
                  borderRadius: 9, cursor: "pointer",
                  color: "var(--nill-gold)", fontSize: "0.8rem", fontWeight: 600,
                  opacity: (!form.title.trim() || actionLoading) ? 0.4 : 1, transition: "all 0.15s",
                }}>
                {actionLoading ? <Spinner /> : null} Erstellen
              </button>
              <button onClick={() => { setCreateOpen(false); }}
                style={{
                  padding: "0.55rem 1rem", background: "transparent",
                  border: "1px solid var(--nill-border)", borderRadius: 9, cursor: "pointer",
                  color: "var(--nill-text-sub)", fontSize: "0.8rem",
                }}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── States ──────────────────────────────────────────── */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "2rem 0", color: "var(--nill-text-mute)", fontSize: "0.82rem" }}>
          <Spinner /> Lade Aufgaben…
        </div>
      )}
      {!loading && error && (
        <div style={{ padding: "0.85rem 1.25rem", marginBottom: "1rem",
          background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 12, color: "#f87171", fontSize: "0.82rem" }}>
          Fehler beim Laden der Aufgaben.
        </div>
      )}
      {!loading && !error && tasks.length === 0 && (
        <p style={{ fontSize: "0.82rem", color: "var(--nill-text-dim)", padding: "1rem 0" }}>
          Keine Aufgaben vorhanden.
        </p>
      )}

      {/* ── Task-Liste ──────────────────────────────────────── */}
      {!loading && !error && tasks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[
            { label: "Offen",     items: open, accent: false },
            { label: "Eskaliert", items: esc,  accent: "red" },
            { label: "Erledigt",  items: done, accent: "green" },
          ].map(group => group.items.length > 0 && (
            <div key={group.label}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.09em", color: "var(--nill-text-mute)" }}>{group.label}</span>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700, padding: "1px 7px", borderRadius: 10, lineHeight: 1.6,
                  background: "var(--nill-blue-dim)", border: "1px solid var(--nill-blue-glow)", color: "#93c5fd",
                }}>{group.items.length}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {group.items.map(t => (
                  <TaskRow key={t.id} task={t} isAdmin={isAdmin} orgUsers={orgUsers} orgRoles={orgRoles}
                    actionLoading={actionLoading}
                    onComplete={() => completeTask(t.id)}
                    onEscalate={() => escalateTask(t.id)}
                    onRefresh={fetchTasks}
                    setActionLoading={setActionLoading}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

/* ── Task-Zeile ─────────────────────────────────────────── */
function TaskRow({ task: t, isAdmin, orgUsers, orgRoles, actionLoading, onComplete, onEscalate, onRefresh, setActionLoading }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignUserId, setAssignUserId] = useState(t.assignee_id || "");
  const [assignRole, setAssignRole] = useState(t.assigned_role || "");

  // Show the coworker's name — never the email (email lives only in team config).
  const assigneeName = t.assignee_name || orgUsers.find(u => u.id === t.assignee_id)?.name;
  const completedWhen = t.completed_at
    ? new Date(t.completed_at).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  async function saveAssign() {
    setActionLoading(true);
    try {
      await api.post(`/workflow/tasks/${t.id}/assign`, {
        assignee_id: assignUserId || undefined,
        assigned_role: assignRole || undefined,
      });
      setAssignOpen(false);
      onRefresh();
    } catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  }

  return (
    <div style={{ ...panelStyle }}>
      <div style={{ padding: "0.9rem 1.25rem", display: "flex", alignItems: "flex-start", gap: "0.85rem", flexWrap: "wrap" }}>
        {/* Priorität-Punkt */}
        <div style={{ paddingTop: 4 }}><PriorityDot priority={t.priority} /></div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--nill-text)" }}>{t.title}</span>
          {t.description && (
            <span style={{ fontSize: "0.75rem", color: "var(--nill-text-mute)" }}>{t.description}</span>
          )}
          {/* Badges */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: 2 }}>
            <StatusBadge status={t.status} />
            <RecurrenceBadge recurrence={t.recurrence} />
            <DeadlineBadge due_at={t.due_at} />
            {(assigneeName || t.assigned_role) && (
              <span style={{
                fontSize: "0.65rem", fontWeight: 600, padding: "0.15rem 0.55rem", borderRadius: 20,
                background: "rgba(197,165,114,0.08)", border: "1px solid rgba(197,165,114,0.2)", color: "var(--nill-gold)",
              }}>
                👤 {assigneeName ?? `Rolle: ${t.assigned_role}`}
              </span>
            )}
            {t.status === "completed" && completedWhen && (
              <span style={{
                fontSize: "0.65rem", fontWeight: 600, padding: "0.15rem 0.55rem", borderRadius: 20,
                background: "rgba(134,239,172,0.08)", border: "1px solid rgba(134,239,172,0.2)", color: "#86efac",
              }}>
                ✓ {t.completed_by_name ? `${t.completed_by_name} · ` : ""}{completedWhen}
              </span>
            )}
          </div>
        </div>

        {/* Aktionen */}
        {t.status !== "completed" && (
          <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0, flexWrap: "wrap" }}>
            <button onClick={onComplete} disabled={actionLoading}
              style={{ padding: "0.35rem 0.85rem", background: "rgba(134,239,172,0.08)",
                border: "1px solid rgba(134,239,172,0.2)", borderRadius: 8, cursor: "pointer",
                color: "#86efac", fontSize: "0.75rem", fontWeight: 600, opacity: actionLoading ? 0.4 : 1 }}>
              Erledigen
            </button>

            {t.status !== "escalated" && (
              <button onClick={onEscalate} disabled={actionLoading}
                style={{ padding: "0.35rem 0.85rem", background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, cursor: "pointer",
                  color: "#f87171", fontSize: "0.75rem", fontWeight: 600, opacity: actionLoading ? 0.4 : 1 }}>
                Eskalieren
              </button>
            )}

            {isAdmin && (
              <button onClick={() => setAssignOpen(o => !o)} disabled={actionLoading}
                style={{ padding: "0.35rem 0.85rem", background: "var(--nill-blue-dim)",
                  border: "1px solid var(--nill-blue-glow)", borderRadius: 8, cursor: "pointer",
                  color: "#93c5fd", fontSize: "0.75rem", fontWeight: 600, opacity: actionLoading ? 0.4 : 1 }}>
                Zuweisen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Zuweisung aufklappen */}
      {assignOpen && isAdmin && (
        <div style={{ borderTop: "1px solid var(--nill-border)", padding: "0.85rem 1.25rem",
          background: "rgba(var(--tint),0.015)", display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: "0.68rem", color: "var(--nill-text-mute)", marginBottom: 4, display: "block" }}>
              Mitarbeiter
            </label>
            <select style={selectStyle} value={assignUserId}
              onChange={e => { setAssignUserId(e.target.value); if (e.target.value) setAssignRole(""); }}>
              <option value="">— keine Zuweisung —</option>
              {orgUsers.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: "0.68rem", color: "var(--nill-text-mute)", marginBottom: 4, display: "block" }}>
              Rolle
            </label>
            <select style={selectStyle} value={assignRole}
              onChange={e => { setAssignRole(e.target.value); if (e.target.value) setAssignUserId(""); }}>
              <option value="">— keine Rolle —</option>
              {orgRoles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </div>
          <button onClick={saveAssign} disabled={actionLoading}
            style={{ padding: "0.55rem 1.1rem", background: "var(--nill-gold-dim)",
              border: "1px solid rgba(197,165,114,0.28)", borderRadius: 9, cursor: "pointer",
              color: "var(--nill-gold)", fontSize: "0.78rem", fontWeight: 600, opacity: actionLoading ? 0.4 : 1 }}>
            Speichern
          </button>
          <button onClick={() => setAssignOpen(false)}
            style={{ padding: "0.55rem 1rem", background: "transparent",
              border: "1px solid var(--nill-border)", borderRadius: 9, cursor: "pointer",
              color: "var(--nill-text-sub)", fontSize: "0.78rem" }}>
            Abbrechen
          </button>
        </div>
      )}
    </div>
  );
}
