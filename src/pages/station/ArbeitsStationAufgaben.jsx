import { useEffect, useState, useCallback } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import api from "../../lib/api";

const ACCENT = "#c6ff3c";

const PRIORITY_COLOR = {
  high:   { dot: "#f87171", label: "Hoch" },
  medium: { dot: "#fbbf24", label: "Mittel" },
  low:    { dot: "#86efac", label: "Niedrig" },
};

function Spinner() {
  return (
    <div style={{
      width: 20, height: 20,
      border: "2px solid rgba(255,255,255,0.08)",
      borderTopColor: ACCENT,
      borderRadius: "50%",
      animation: "as-spin 0.75s linear infinite",
    }} />
  );
}

function TaskCard({ task, onComplete, busy }) {
  const prio = PRIORITY_COLOR[task.priority] ?? { dot: "#94a3b8", label: task.priority };
  const isOverdue = task.due_at && new Date(task.due_at) < new Date();
  const isToday   = task.due_at && new Date(task.due_at).toDateString() === new Date().toDateString();

  return (
    <div style={{
      borderRadius: 16,
      border: `1px solid ${isOverdue ? "rgba(248,113,113,0.25)" : "rgba(239,237,231,0.07)"}`,
      background: isOverdue ? "rgba(248,113,113,0.04)" : "rgba(255,255,255,0.025)",
      padding: "18px 20px",
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
      transition: "border-color 0.2s",
    }}>
      {/* Priority dot */}
      <span style={{
        width: 10, height: 10, borderRadius: "50%",
        background: prio.dot,
        flexShrink: 0,
        marginTop: 5,
      }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
          fontWeight: 400,
          color: "#efede7",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
          marginBottom: 6,
        }}>{task.title}</div>

        {task.description && (
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.78rem",
            color: "rgba(239,237,231,0.45)",
            margin: "0 0 8px",
            lineHeight: 1.45,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>{task.description}</p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: prio.dot,
            background: `${prio.dot}14`,
            border: `1px solid ${prio.dot}30`,
            borderRadius: 99,
            padding: "2px 8px",
          }}>{prio.label}</span>

          {task.due_at && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.05em",
              color: isOverdue ? "#f87171" : isToday ? "#fbbf24" : "rgba(239,237,231,0.4)",
              background: isOverdue ? "rgba(248,113,113,0.08)" : isToday ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isOverdue ? "rgba(248,113,113,0.25)" : isToday ? "rgba(251,191,36,0.25)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 99,
              padding: "2px 8px",
            }}>
              {isToday ? "Heute" : isOverdue ? "Überfällig" : new Date(task.due_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
            </span>
          )}

          {task.assigned_role && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              color: "rgba(239,237,231,0.35)",
            }}>↳ {task.assigned_role}</span>
          )}
        </div>
      </div>

      {/* Complete button */}
      <button
        onClick={() => onComplete(task.id)}
        disabled={busy}
        title="Als erledigt markieren"
        style={{
          width: 38, height: 38,
          borderRadius: 10,
          border: `1px solid rgba(198,255,60,0.25)`,
          background: "rgba(198,255,60,0.06)",
          color: ACCENT,
          fontSize: "1rem",
          cursor: busy ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.2s, border-color 0.2s, transform 0.15s",
          opacity: busy ? 0.5 : 1,
        }}
        onPointerDown={e => !busy && (e.currentTarget.style.transform = "scale(0.92)")}
        onPointerUp={e => (e.currentTarget.style.transform = "scale(1)")}
        onPointerLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(198,255,60,0.14)"; e.currentTarget.style.borderColor = "rgba(198,255,60,0.45)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(198,255,60,0.06)"; e.currentTarget.style.borderColor = "rgba(198,255,60,0.25)"; }}
      >✓</button>
    </div>
  );
}

export default function ArbeitsStationAufgaben() {
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]     = useState(false);
  const [filter, setFilter] = useState("open");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/workflow/tasks", { params: { my_tasks: true } });
      setTasks(res.data?.items || []);
    } catch { setTasks([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  async function complete(id) {
    setBusy(true);
    try { await api.post(`/workflow/tasks/${id}/complete`, { result_data: {} }); fetch(); }
    catch { /* non-fatal */ }
    finally { setBusy(false); }
  }

  const open = tasks.filter(t => t.status !== "completed" && t.status !== "escalated");
  const done = tasks.filter(t => t.status === "completed");
  const shown = filter === "open" ? open : done;

  return (
    <ArbeitsStationLayout title="Aufgaben" icon="⌘" accent={ACCENT}>
      <style>{`@keyframes as-spin { to { transform: rotate(360deg); } }`}</style>

      {/* Filter tabs */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 24,
        borderBottom: "1px solid rgba(239,237,231,0.07)",
        paddingBottom: 16,
      }}>
        {[
          { key: "open",      label: "Offen",    count: open.length },
          { key: "completed", label: "Erledigt", count: done.length },
        ].map(({ key, label, count }) => (
          <button key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: "6px 18px",
              borderRadius: 99,
              border: filter === key
                ? `1px solid rgba(198,255,60,0.35)`
                : "1px solid rgba(239,237,231,0.08)",
              background: filter === key
                ? "rgba(198,255,60,0.1)"
                : "rgba(255,255,255,0.03)",
              color: filter === key ? ACCENT : "rgba(239,237,231,0.5)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s",
            }}
          >
            {label}
            <span style={{
              background: filter === key ? "rgba(198,255,60,0.15)" : "rgba(255,255,255,0.06)",
              border: filter === key ? "1px solid rgba(198,255,60,0.2)" : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 99,
              padding: "0px 6px",
              fontSize: "0.65rem",
              color: filter === key ? ACCENT : "rgba(239,237,231,0.4)",
            }}>{count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
          <Spinner />
        </div>
      ) : shown.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          border: "1px solid rgba(239,237,231,0.06)",
          borderRadius: 20,
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 12 }}>⌘</div>
          <div style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.1rem",
            color: "rgba(239,237,231,0.4)",
          }}>
            {filter === "open" ? "Keine offenen Aufgaben" : "Noch nichts erledigt"}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {shown.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={complete}
              busy={busy}
            />
          ))}
        </div>
      )}
    </ArbeitsStationLayout>
  );
}
