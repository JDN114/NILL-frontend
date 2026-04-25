import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";

/* ── Shared ─────────────────────────────────────────────── */
const panelStyle = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid var(--nill-border)",
  borderRadius: 14,
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  overflow: "hidden",
};

const inputBase = {
  width: "100%", padding: "0.6rem 0.9rem",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--nill-border)",
  borderRadius: 9, color: "var(--nill-text)",
  fontSize: "0.82rem", outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};

function Spinner() {
  return (
    <div style={{
      width: 18, height: 18,
      border: "2px solid rgba(255,255,255,0.08)",
      borderTopColor: "var(--nill-gold)",
      borderRadius: "50%",
      animation: "em-spin 0.75s linear infinite",
      flexShrink: 0,
    }} />
  );
}

function StatusBadge({ status }) {
  const map = {
    completed: { label: "Erledigt",    bg: "rgba(134,239,172,0.08)", border: "rgba(134,239,172,0.2)",  color: "#86efac" },
    escalated: { label: "Eskaliert",   bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.22)", color: "#f87171" },
  };
  const s = map[status] ?? { label: status, bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", color: "#fbbf24" };
  return (
    <span style={{
      fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.65rem",
      borderRadius: 20, background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
}

/* ── Haupt-Seite ────────────────────────────────────────── */
export default function WorkflowTasksPage() {
  const [tasks, setTasks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc]   = useState("");
  const [createOpen, setCreateOpen]     = useState(false);

  useEffect(() => { fetchTasks(); }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await api.get("/workflow/tasks");
      setTasks(res.data?.items || []);
      setError(false);
    } catch (err) {
      console.error(err); setTasks([]); setError(true);
    } finally { setLoading(false); }
  }

  async function createTask() {
    if (!newTaskTitle) return;
    setActionLoading(true);
    try {
      await api.post("/workflow/tasks", { title: newTaskTitle, description: newTaskDesc });
      setNewTaskTitle(""); setNewTaskDesc(""); setCreateOpen(false);
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

  async function assignTask(id, userId) {
    if (!userId) return;
    setActionLoading(true);
    try { await api.post(`/workflow/tasks/${id}/assign`, { assignee_id: userId }); fetchTasks(); }
    catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  }

  const open   = tasks.filter(t => t.status !== "completed" && t.status !== "escalated");
  const done   = tasks.filter(t => t.status === "completed");
  const esc    = tasks.filter(t => t.status === "escalated");

  return (
    <PageLayout>

      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--nill-text-dim)" }}>
            Betrieb / Aufgaben
          </span>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: "0.25rem 0 0",
            color: "var(--nill-text)", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            Aufgaben
          </h1>
        </div>

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
      </div>

      {/* ── Aufgabe erstellen ────────────────────────────── */}
      {createOpen && (
        <div style={{ ...panelStyle, marginBottom: "1.25rem" }}>
          <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid var(--nill-border)",
            fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.09em", color: "var(--nill-text-mute)" }}>
            Neue Aufgabe
          </div>
          <div style={{ padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input
              style={inputBase}
              placeholder="Titel"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onFocus={e => e.target.style.borderColor = "rgba(197,165,114,0.4)"}
              onBlur={e => e.target.style.borderColor = "var(--nill-border)"}
            />
            <textarea
              style={{ ...inputBase, resize: "vertical", minHeight: 72, lineHeight: 1.5 }}
              placeholder="Beschreibung (optional)"
              value={newTaskDesc}
              onChange={e => setNewTaskDesc(e.target.value)}
              onFocus={e => e.target.style.borderColor = "rgba(197,165,114,0.4)"}
              onBlur={e => e.target.style.borderColor = "var(--nill-border)"}
            />
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button
                onClick={createTask}
                disabled={!newTaskTitle || actionLoading}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.55rem 1.2rem",
                  background: "var(--nill-gold-dim)",
                  border: "1px solid rgba(197,165,114,0.28)",
                  borderRadius: 9, cursor: "pointer",
                  color: "var(--nill-gold)", fontSize: "0.8rem", fontWeight: 600,
                  opacity: (!newTaskTitle || actionLoading) ? 0.4 : 1,
                  transition: "background 0.15s",
                }}
              >
                {actionLoading ? <Spinner /> : null}
                Erstellen
              </button>
              <button
                onClick={() => { setCreateOpen(false); setNewTaskTitle(""); setNewTaskDesc(""); }}
                style={{
                  padding: "0.55rem 1rem",
                  background: "transparent", border: "1px solid var(--nill-border)",
                  borderRadius: 9, cursor: "pointer",
                  color: "var(--nill-text-sub)", fontSize: "0.8rem",
                  transition: "background 0.12s, color 0.12s",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "var(--nill-panel-hov)"; e.currentTarget.style.color = "var(--nill-text)"; }}
                onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--nill-text-sub)"; }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Loading / Error / Empty ──────────────────────── */}
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

      {/* ── Task List ────────────────────────────────────── */}
      {!loading && !error && tasks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {[
            { label: "Offen",      items: open, accent: false },
            { label: "Eskaliert",  items: esc,  accent: "red" },
            { label: "Erledigt",   items: done, accent: "green" },
          ].map(group => group.items.length > 0 && (
            <div key={group.label}>
              {/* Group header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.09em", color: "var(--nill-text-mute)",
                }}>
                  {group.label}
                </span>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700,
                  background: "var(--nill-blue-dim)", border: "1px solid var(--nill-blue-glow)",
                  color: "#93c5fd", padding: "1px 7px", borderRadius: 10, lineHeight: 1.6,
                }}>
                  {group.items.length}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {group.items.map(t => (
                  <div
                    key={t.id}
                    style={{
                      ...panelStyle,
                      padding: "1rem 1.25rem",
                      display: "flex", alignItems: "center",
                      gap: "1rem", flexWrap: "wrap",
                    }}
                  >
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--nill-text)" }}>
                        {t.title}
                      </span>
                      {t.description && (
                        <span style={{ fontSize: "0.75rem", color: "var(--nill-text-mute)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.description}
                        </span>
                      )}
                    </div>

                    <StatusBadge status={t.status} />

                    {/* Actions */}
                    {t.status !== "completed" && (
                      <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                        <button
                          onClick={() => completeTask(t.id)}
                          disabled={actionLoading}
                          style={{
                            padding: "0.35rem 0.85rem",
                            background: "rgba(134,239,172,0.08)",
                            border: "1px solid rgba(134,239,172,0.2)",
                            borderRadius: 8, cursor: "pointer",
                            color: "#86efac", fontSize: "0.75rem", fontWeight: 600,
                            transition: "background 0.12s",
                            opacity: actionLoading ? 0.4 : 1,
                          }}
                          onMouseOver={e => e.currentTarget.style.background = "rgba(134,239,172,0.14)"}
                          onMouseOut={e => e.currentTarget.style.background = "rgba(134,239,172,0.08)"}
                        >
                          Erledigen
                        </button>

                        {t.status !== "escalated" && (
                          <button
                            onClick={() => escalateTask(t.id)}
                            disabled={actionLoading}
                            style={{
                              padding: "0.35rem 0.85rem",
                              background: "rgba(248,113,113,0.08)",
                              border: "1px solid rgba(248,113,113,0.2)",
                              borderRadius: 8, cursor: "pointer",
                              color: "#f87171", fontSize: "0.75rem", fontWeight: 600,
                              transition: "background 0.12s",
                              opacity: actionLoading ? 0.4 : 1,
                            }}
                            onMouseOver={e => e.currentTarget.style.background = "rgba(248,113,113,0.14)"}
                            onMouseOut={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
                          >
                            Eskalieren
                          </button>
                        )}

                        <button
                          onClick={() => assignTask(t.id, prompt("User-ID?"))}
                          disabled={actionLoading}
                          style={{
                            padding: "0.35rem 0.85rem",
                            background: "var(--nill-blue-dim)",
                            border: "1px solid var(--nill-blue-glow)",
                            borderRadius: 8, cursor: "pointer",
                            color: "#93c5fd", fontSize: "0.75rem", fontWeight: 600,
                            transition: "background 0.12s",
                            opacity: actionLoading ? 0.4 : 1,
                          }}
                          onMouseOver={e => e.currentTarget.style.background = "rgba(59,130,246,0.18)"}
                          onMouseOut={e => e.currentTarget.style.background = "var(--nill-blue-dim)"}
                        >
                          Zuweisen
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
