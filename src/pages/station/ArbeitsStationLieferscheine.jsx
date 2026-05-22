import { useEffect, useState, useRef } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import api from "../../lib/api";

const ACCENT = "#fb923c";

const STATUS = {
  pending:   { bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.25)",  text: "#fbbf24", label: "Ausstehend" },
  confirmed: { bg: "rgba(134,239,172,0.08)", border: "rgba(134,239,172,0.25)", text: "#86efac", label: "Bestätigt" },
  rejected:  { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", text: "#f87171", label: "Abgelehnt" },
};

function Spinner() {
  return (
    <div style={{
      width: 18, height: 18,
      border: "2px solid rgba(255,255,255,0.08)",
      borderTopColor: ACCENT, borderRadius: "50%",
      animation: "as-spin 0.75s linear infinite", flexShrink: 0,
    }} />
  );
}

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function ArbeitsStationLieferscheine() {
  const [notes, setNotes]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [filter, setFilter]     = useState("all");
  const [error, setError]       = useState(null);
  const fileRef                 = useRef();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get("/inventory/delivery-notes");
      setNotes(r.data?.delivery_notes || []);
    } catch { setNotes([]); }
    finally { setLoading(false); }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await api.post("/inventory/delivery-notes/from-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await load();
    } catch { setError("Analyse fehlgeschlagen."); }
    finally { setAnalyzing(false); e.target.value = ""; }
  }

  async function quickConfirm(noteId) {
    try {
      await api.post(`/inventory/delivery-notes/${noteId}/confirm`, { items: [] });
      setNotes(prev => prev.map(n => n.id === noteId ? { ...n, status: "confirmed" } : n));
    } catch {}
  }

  const pending = notes.filter(n => n.status === "pending");
  const shown   = filter === "all" ? notes
                : filter === "pending" ? pending
                : notes.filter(n => n.status === filter);

  return (
    <ArbeitsStationLayout title="Lieferscheine" icon="📦" accent={ACCENT} maxWidth={820}>
      <style>{`@keyframes as-spin { to { transform: rotate(360deg); } }`}</style>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flex: 1, flexWrap: "wrap" }}>
          {[
            { key: "all",       label: "Alle",       count: notes.length },
            { key: "pending",   label: "Ausstehend", count: pending.length },
            { key: "confirmed", label: "Bestätigt",  count: null },
          ].map(({ key, label, count }) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: "5px 14px", borderRadius: 99,
              border: filter === key
                ? "1px solid rgba(251,146,60,0.35)"
                : "1px solid rgba(239,237,231,0.08)",
              background: filter === key ? "rgba(251,146,60,0.1)" : "rgba(255,255,255,0.03)",
              color: filter === key ? ACCENT : "rgba(239,237,231,0.5)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}>
              {label}
              {count != null && count > 0 && (
                <span style={{
                  background: filter === key ? "rgba(251,146,60,0.15)" : "rgba(255,255,255,0.06)",
                  border: filter === key ? "1px solid rgba(251,146,60,0.2)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 99, padding: "0 5px", fontSize: "0.6rem",
                  color: filter === key ? ACCENT : "rgba(239,237,231,0.4)",
                }}>{count}</span>
              )}
            </button>
          ))}
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={analyzing} style={{
          padding: "0.45rem 1.1rem", borderRadius: 10,
          border: "1px solid rgba(251,146,60,0.3)", background: "rgba(251,146,60,0.08)",
          color: ACCENT, fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase",
          cursor: analyzing ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", gap: 7,
          opacity: analyzing ? 0.6 : 1,
          transition: "background 0.2s",
        }}>
          {analyzing ? <Spinner /> : "📷"}
          {analyzing ? "Analysiere…" : "Foto hochladen"}
        </button>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={handleUpload} />
      </div>

      {error && (
        <div style={{
          marginBottom: 16, padding: "0.75rem 1rem",
          background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 12, color: "#f87171",
          fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.8rem",
        }}>{error}</div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}><Spinner /></div>
      ) : shown.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          border: "1px solid rgba(239,237,231,0.06)", borderRadius: 20,
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 12 }}>📦</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "rgba(239,237,231,0.4)" }}>
            {filter === "pending" ? "Keine ausstehenden Lieferscheine" : "Keine Lieferscheine vorhanden"}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {shown.map(note => {
            const s = STATUS[note.status] || STATUS.pending;
            return (
              <div key={note.id} style={{
                padding: "16px 20px", borderRadius: 16,
                border: `1px solid ${note.status === "pending" ? "rgba(251,191,36,0.2)" : "rgba(239,237,231,0.07)"}`,
                background: note.status === "pending" ? "rgba(251,191,36,0.03)" : "rgba(255,255,255,0.025)",
                display: "flex", alignItems: "flex-start", gap: 16,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem",
                }}>
                  {note.source === "photo" ? "📷" : "📦"}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: "1rem", fontWeight: 400, color: "#efede7",
                    }}>{note.supplier || "Unbekannter Lieferant"}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase",
                      color: s.text, background: s.bg, border: `1px solid ${s.border}`,
                      borderRadius: 99, padding: "1px 8px",
                    }}>{s.label}</span>
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem", color: "rgba(239,237,231,0.4)", marginBottom: 8,
                  }}>
                    {note.delivery_number && `Nr. ${note.delivery_number} · `}
                    {note.delivery_date || fmtDate(note.created_at)}
                    {note.items?.length > 0 && ` · ${note.items.length} Position${note.items.length !== 1 ? "en" : ""}`}
                  </div>
                  {note.items?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {note.items.slice(0, 4).map((item, i) => (
                        <span key={i} style={{
                          fontFamily: "'Inter', system-ui, sans-serif",
                          fontSize: "0.63rem", color: "rgba(239,237,231,0.45)",
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 99, padding: "1px 8px",
                        }}>{item.quantity} {item.unit} {item.name}</span>
                      ))}
                      {note.items.length > 4 && (
                        <span style={{ fontSize: "0.63rem", color: "rgba(239,237,231,0.3)", alignSelf: "center" }}>
                          +{note.items.length - 4} weitere
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {note.status === "pending" && (
                  <button onClick={() => quickConfirm(note.id)} style={{
                    padding: "0.4rem 0.9rem", borderRadius: 10, flexShrink: 0,
                    border: "1px solid rgba(134,239,172,0.3)", background: "rgba(134,239,172,0.08)",
                    color: "#86efac", fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase",
                    cursor: "pointer", transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(134,239,172,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(134,239,172,0.08)"}
                  >✓ Bestätigen</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </ArbeitsStationLayout>
  );
}
