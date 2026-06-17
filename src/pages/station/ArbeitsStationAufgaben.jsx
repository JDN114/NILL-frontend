import { useEffect, useState, useCallback, useRef } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import QrScannerStation from "../../components/QrScannerStation";
import api from "../../services/api";

const ACCENT = "#c6ff3c";

const PRIO = {
  high:   { dot: "#f87171", label: "Hoch",    bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.25)" },
  medium: { dot: "#fbbf24", label: "Mittel",  bg: "rgba(251,191,36,0.08)",   border: "rgba(251,191,36,0.25)" },
  low:    { dot: "#86efac", label: "Niedrig", bg: "rgba(134,239,172,0.08)",  border: "rgba(134,239,172,0.25)" },
};

function Spinner({ color = ACCENT, size = 20 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid rgba(var(--tint),0.08)`,
      borderTopColor: color, borderRadius: "50%",
      animation: "as-spin 0.75s linear infinite", flexShrink: 0,
    }} />
  );
}

function deadlineInfo(due_at) {
  if (!due_at) return null;
  const d = new Date(due_at);
  const now = new Date();
  const diffMs = d - now;
  const diffDays = Math.ceil(diffMs / 86400000);
  if (diffDays < 0) return { label: "Überfällig", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" };
  if (diffDays === 0) return { label: "Heute", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.25)" };
  if (diffDays === 1) return { label: "Morgen", color: "#fbbf24", bg: "rgba(251,191,36,0.05)", border: "rgba(251,191,36,0.18)" };
  return {
    label: d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
    color: "rgba(var(--ink-tint),0.45)", bg: "rgba(var(--tint),0.04)", border: "rgba(var(--tint),0.08)",
  };
}

// ── Signature Canvas ──────────────────────────────────────────────────────────
function SignatureCanvas({ onSigned }) {
  const canvasRef = useRef();
  const drawing   = useRef(false);
  const [hasLines, setHasLines] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(var(--tint),0.03)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#efede7";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return [src.clientX - rect.left, src.clientY - rect.top];
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const [x, y] = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(x, y);
  };

  const move = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const [x, y] = getPos(e, canvas);
    ctx.lineTo(x, y); ctx.stroke();
    setHasLines(true);
  };

  const stop = () => {
    drawing.current = false;
    if (hasLines) onSigned(canvasRef.current.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(var(--tint),0.03)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasLines(false);
    onSigned(null);
  };

  return (
    <div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem",
        letterSpacing: "0.15em", textTransform: "uppercase",
        color: "rgba(var(--ink-tint),0.35)", marginBottom: 8,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        Unterschrift
        {hasLines && (
          <button onClick={clear} style={{
            background: "none", border: "none", color: "rgba(var(--ink-tint),0.35)",
            fontSize: "0.65rem", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase",
          }}>Löschen</button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={360} height={120}
        onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={move} onTouchEnd={stop}
        style={{
          width: "100%", maxWidth: 360, height: 120, borderRadius: 12,
          border: `1px solid ${hasLines ? "rgba(198,255,60,0.25)" : "rgba(var(--ink-tint),0.1)"}`,
          background: "rgba(var(--tint),0.03)", cursor: "crosshair", display: "block",
          touchAction: "none",
        }}
      />
      {!hasLines && (
        <div style={{
          marginTop: -68, textAlign: "center", fontSize: "0.75rem",
          color: "rgba(var(--ink-tint),0.2)", pointerEvents: "none",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          Hier unterschreiben
        </div>
      )}
      <div style={{ marginTop: hasLines ? 0 : 56 }} />
    </div>
  );
}

// ── Bestätigungs-Modal (QR-Ausweis) ──────────────────────────────────────────
function ConfirmModal({ task, onConfirmed, onClose }) {
  const [step, setStep]       = useState("scan");  // scan | sign
  const [qrPayload, setQrPayload] = useState(null);
  const [employee, setEmployee]   = useState(null);
  const [signature, setSig]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleQrScan = async (payload) => {
    if (loading) return;
    setLoading(true); setError("");
    try {
      // Ausweis validieren, ohne Zeitbuchung auszulösen — wir prüfen via badge-endpoint
      // Direktprüfung: NILL-Nummer + HMAC-Signatur (Format "NILL-XXXXX:sig")
      const parts = payload.split(":");
      if (parts.length < 2) throw new Error("Ungültiger Ausweis");
      setQrPayload(payload);
      setEmployee({ name: parts[0] }); // vorläufig NILL-Nr anzeigen
      setStep("sign");
    } catch (err) {
      setError(err?.response?.data?.detail ?? err.message ?? "Ausweis nicht erkannt");
    } finally { setLoading(false); }
  };

  const confirm = async () => {
    setLoading(true); setError("");
    try {
      await api.post(`/workflow/tasks/${task.id}/station-qr-complete`, {
        qr_payload: qrPayload,
        signature: signature || "",
      });
      onConfirmed(task.id);
    } catch (err) {
      setError(err?.response?.data?.detail ?? "Fehler bei der Bestätigung");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(4,7,15,0.9)", backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "rgba(12,16,28,0.98)",
        border: "1px solid rgba(var(--ink-tint),0.1)",
        borderRadius: 20, padding: "1.75rem 2rem",
        width: "100%", maxWidth: 400,
        display: "flex", flexDirection: "column", gap: "1.25rem",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        {/* Header */}
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(var(--ink-tint),0.3)", marginBottom: 6,
          }}>
            Aufgabe bestätigen
          </div>
          <div style={{
            fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.2rem",
            fontWeight: 400, color: "#efede7", letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}>
            {task.title}
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {[{ key: "scan", label: "Ausweis" }, { key: "sign", label: "Unterschrift" }].map(({ key, label }, i) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: step === key ? ACCENT : i < (step === "sign" ? 1 : 0) ? "rgba(198,255,60,0.2)" : "rgba(var(--tint),0.06)",
                border: `1.5px solid ${step === key ? ACCENT : i < (step === "sign" ? 1 : 0) ? "rgba(198,255,60,0.35)" : "rgba(var(--tint),0.1)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", fontWeight: 700,
                color: step === key ? "#000" : "rgba(var(--ink-tint),0.4)",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {step === "sign" && i === 0 ? "✓" : i + 1}
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: step === key ? ACCENT : "rgba(var(--ink-tint),0.3)",
              }}>{label}</span>
              {i === 0 && <div style={{ width: 24, height: 1, background: "rgba(var(--tint),0.08)" }} />}
            </div>
          ))}
        </div>

        {/* ── Schritt 1: QR-Ausweis scannen ── */}
        {step === "scan" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            {loading ? (
              <div style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Spinner size={28} color={ACCENT} />
              </div>
            ) : (
              <QrScannerStation
                onScan={handleQrScan}
                accent={ACCENT}
                label="Mitarbeiterausweis scannen"
              />
            )}
            {error && <div style={{ fontSize: "0.78rem", color: "#f87171", textAlign: "center" }}>{error}</div>}
          </div>
        )}

        {/* ── Schritt 2: Unterschrift ── */}
        {step === "sign" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {employee && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "0.4rem 0.9rem", borderRadius: 99,
                background: "rgba(198,255,60,0.07)", border: "1px solid rgba(198,255,60,0.2)",
                alignSelf: "flex-start",
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, flexShrink: 0 }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem",
                  color: ACCENT, fontWeight: 500, letterSpacing: "0.06em",
                }}>
                  {employee.name}
                </span>
              </div>
            )}

            <SignatureCanvas onSigned={setSig} />

            {error && <div style={{ fontSize: "0.78rem", color: "#f87171" }}>{error}</div>}

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setStep("scan"); setQrPayload(null); setSig(null); setError(""); }} style={{
                flex: 1, padding: "0.65rem", borderRadius: 10,
                border: "1px solid rgba(var(--ink-tint),0.1)", background: "rgba(var(--tint),0.04)",
                color: "rgba(var(--ink-tint),0.55)", fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer",
              }}>← Zurück</button>
              <button onClick={confirm} disabled={loading} style={{
                flex: 2, padding: "0.65rem", borderRadius: 10, border: "none",
                background: !loading ? ACCENT : "rgba(var(--tint),0.05)",
                color: !loading ? "#000" : "rgba(var(--ink-tint),0.25)",
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: !loading ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                {loading ? <Spinner size={16} color="#000" /> : null}
                Bestätigen
              </button>
            </div>
          </div>
        )}

        <button onClick={onClose} style={{
          background: "none", border: "none", padding: "0.2rem 0",
          color: "rgba(var(--ink-tint),0.3)", fontSize: "0.75rem", cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em",
          textTransform: "uppercase", textAlign: "center",
        }}>Abbrechen</button>
      </div>
    </div>
  );
}

// ── Aufgaben-Karte ────────────────────────────────────────────────────────────
function TaskCard({ task, onOpenConfirm }) {
  const p   = PRIO[task.priority] ?? { dot: "#94a3b8", label: task.priority, bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)" };
  const dl  = deadlineInfo(task.due_at);
  const isOverdue = dl?.label === "Überfällig";

  return (
    <div style={{
      borderRadius: 16,
      border: `1px solid ${isOverdue ? "rgba(248,113,113,0.25)" : "rgba(var(--ink-tint),0.08)"}`,
      background: isOverdue ? "rgba(248,113,113,0.03)" : "rgba(var(--tint),0.025)",
      padding: "16px 18px",
      display: "flex", alignItems: "flex-start", gap: 14,
    }}>
      {/* Prio dot */}
      <span style={{
        width: 10, height: 10, borderRadius: "50%",
        background: p.dot, flexShrink: 0, marginTop: 6,
        boxShadow: `0 0 6px ${p.dot}66`,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)", fontWeight: 400,
          color: "#efede7", letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: 6,
        }}>
          {task.title}
        </div>

        {task.description && (
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.78rem",
            color: "rgba(var(--ink-tint),0.45)", margin: "0 0 8px", lineHeight: 1.45,
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>{task.description}</p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: p.dot, background: p.bg, border: `1px solid ${p.border}`,
            borderRadius: 99, padding: "2px 8px",
          }}>{p.label}</span>

          {dl && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem",
              letterSpacing: "0.06em",
              color: dl.color, background: dl.bg, border: `1px solid ${dl.border}`,
              borderRadius: 99, padding: "2px 8px",
            }}>⏰ {dl.label}</span>
          )}

          {(task.assignee_name || task.assigned_role) && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem",
              color: "rgba(var(--ink-tint),0.35)",
              background: "rgba(var(--tint),0.04)", border: "1px solid rgba(var(--tint),0.07)",
              borderRadius: 99, padding: "2px 8px",
            }}>👤 {task.assignee_name || task.assigned_role}</span>
          )}
        </div>
      </div>

      <button
        onClick={() => onOpenConfirm(task)}
        title="Aufgabe erledigen"
        style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          border: "1px solid rgba(198,255,60,0.25)", background: "rgba(198,255,60,0.06)",
          color: ACCENT, fontSize: "1rem", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s, border-color 0.2s, transform 0.15s",
        }}
        onPointerDown={e => (e.currentTarget.style.transform = "scale(0.92)")}
        onPointerUp={e => (e.currentTarget.style.transform = "scale(1)")}
        onPointerLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(198,255,60,0.14)"; e.currentTarget.style.borderColor = "rgba(198,255,60,0.45)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(198,255,60,0.06)"; e.currentTarget.style.borderColor = "rgba(198,255,60,0.25)"; }}
      >✓</button>
    </div>
  );
}

// ── Hauptseite ────────────────────────────────────────────────────────────────
export default function ArbeitsStationAufgaben() {
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("open");
  const [confirmTask, setConfirmTask] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/workflow/tasks/station-all");
      setTasks(res.data?.items || []);
    } catch { setTasks([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleConfirmed = (taskId) => {
    setTasks(p => p.filter(t => t.id !== taskId));
    setConfirmTask(null);
  };

  // Alle einzigartigen Rollen aus den Aufgaben
  const roles = [...new Set(tasks.map(t => t.assigned_role).filter(Boolean))].sort();

  const filtered = tasks.filter(t => {
    const matchRole   = roleFilter === "all" || t.assigned_role === roleFilter;
    const matchStatus = statusFilter === "open"
      ? t.status !== "completed" && t.status !== "escalated"
      : t.status === statusFilter;
    return matchRole && matchStatus;
  });

  // Sortiert: überfällig zuerst, dann nach Deadline
  const sorted = [...filtered].sort((a, b) => {
    const da = a.due_at ? new Date(a.due_at) : new Date("9999-01-01");
    const db2 = b.due_at ? new Date(b.due_at) : new Date("9999-01-01");
    return da - db2;
  });

  const overdueCount = tasks.filter(t =>
    t.due_at && new Date(t.due_at) < new Date() &&
    t.status !== "completed" && t.status !== "escalated"
  ).length;

  return (
    <ArbeitsStationLayout title="Aufgaben" icon="⌘" accent={ACCENT}>
      <style>{`
        @keyframes as-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Status-Filter */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 16,
        borderBottom: "1px solid rgba(var(--ink-tint),0.07)", paddingBottom: 14,
        flexWrap: "wrap",
      }}>
        {[
          { key: "open",      label: "Offen",    count: tasks.filter(t => t.status !== "completed" && t.status !== "escalated").length },
          { key: "completed", label: "Erledigt", count: tasks.filter(t => t.status === "completed").length },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setStatusFilter(key)} style={{
            padding: "5px 16px", borderRadius: 99,
            border: statusFilter === key ? `1px solid rgba(198,255,60,0.35)` : "1px solid rgba(var(--ink-tint),0.08)",
            background: statusFilter === key ? "rgba(198,255,60,0.1)" : "rgba(var(--tint),0.03)",
            color: statusFilter === key ? ACCENT : "rgba(var(--ink-tint),0.5)",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
            letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
          }}>
            {label}
            <span style={{
              background: statusFilter === key ? "rgba(198,255,60,0.15)" : "rgba(var(--tint),0.06)",
              border: statusFilter === key ? "1px solid rgba(198,255,60,0.2)" : "1px solid rgba(var(--tint),0.08)",
              borderRadius: 99, padding: "0 5px", fontSize: "0.6rem",
              color: statusFilter === key ? ACCENT : "rgba(var(--ink-tint),0.4)",
            }}>{count}</span>
          </button>
        ))}

        {overdueCount > 0 && statusFilter === "open" && (
          <div style={{
            padding: "5px 14px", borderRadius: 99,
            border: "1px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.07)",
            color: "#f87171", fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            ⚠ {overdueCount} überfällig
          </div>
        )}
      </div>

      {/* Rollen-Filter */}
      {roles.length > 0 && (
        <div style={{
          display: "flex", gap: 7, marginBottom: 20, flexWrap: "wrap", alignItems: "center",
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "rgba(var(--ink-tint),0.25)", marginRight: 4,
          }}>Rolle</span>
          {["all", ...roles].map(role => (
            <button key={role} onClick={() => setRoleFilter(role)} style={{
              padding: "4px 12px", borderRadius: 99, cursor: "pointer",
              border: roleFilter === role
                ? "1px solid rgba(198,255,60,0.3)"
                : "1px solid rgba(var(--ink-tint),0.07)",
              background: roleFilter === role
                ? "rgba(198,255,60,0.08)"
                : "rgba(var(--tint),0.02)",
              color: roleFilter === role ? ACCENT : "rgba(var(--ink-tint),0.4)",
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
              letterSpacing: "0.06em", textTransform: "uppercase",
              transition: "all 0.18s",
            }}>
              {role === "all" ? "Alle Rollen" : role}
              {role !== "all" && (
                <span style={{ marginLeft: 5, opacity: 0.6 }}>
                  {tasks.filter(t => t.assigned_role === role && t.status !== "completed").length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Aufgabenliste */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}><Spinner /></div>
      ) : sorted.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          border: "1px solid rgba(var(--ink-tint),0.06)", borderRadius: 20,
          background: "rgba(var(--tint),0.02)",
        }}>
          <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 12 }}>⌘</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "rgba(var(--ink-tint),0.4)" }}>
            {statusFilter === "open" ? "Keine offenen Aufgaben" : "Noch nichts erledigt"}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onOpenConfirm={statusFilter === "open" ? setConfirmTask : undefined}
            />
          ))}
        </div>
      )}

      {confirmTask && (
        <ConfirmModal
          task={confirmTask}
          onConfirmed={handleConfirmed}
          onClose={() => setConfirmTask(null)}
        />
      )}
    </ArbeitsStationLayout>
  );
}
