import { useEffect, useState, useRef, useCallback } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import api from "../../services/api";

const ACCENT = "#fbbf24";

const TYPE_ICONS = {
  "Lohnsteuerbescheinigung": "📋",
  "Gehaltsabrechnung":       "💶",
  "Arbeitsvertrag":          "📝",
  "Zeugnis":                 "🎓",
  "Krankmeldung":            "🏥",
  "Urlaubsantrag":           "✈️",
};

function Spinner({ color = ACCENT, size = 20 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid rgba(var(--tint),0.08)`,
      borderTopColor: color, borderRadius: "50%",
      animation: "as-spin 0.75s linear infinite",
      flexShrink: 0,
    }} />
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 8, marginBottom: 24,
      borderBottom: "1px solid rgba(var(--ink-tint),0.07)", paddingBottom: 16,
    }}>
      {tabs.map(({ key, label, count }) => (
        <button key={key} onClick={() => onChange(key)} style={{
          padding: "6px 18px", borderRadius: 99,
          border: active === key ? "1px solid rgba(251,191,36,0.35)" : "1px solid rgba(var(--ink-tint),0.08)",
          background: active === key ? "rgba(251,191,36,0.1)" : "rgba(var(--tint),0.03)",
          color: active === key ? ACCENT : "rgba(var(--ink-tint),0.5)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          transition: "all 0.2s",
        }}>
          {label}
          {count > 0 && (
            <span style={{
              background: active === key ? "rgba(251,191,36,0.15)" : "rgba(var(--tint),0.06)",
              border: active === key ? "1px solid rgba(251,191,36,0.2)" : "1px solid rgba(var(--tint),0.08)",
              borderRadius: 99, padding: "0px 6px", fontSize: "0.65rem",
              color: active === key ? ACCENT : "rgba(var(--ink-tint),0.4)",
            }}>{count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── HR-Dokumente Tab ──────────────────────────────────────────────────────────
function DocsTab() {
  const [docs, setDocs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [downloading, setDl]    = useState(null);
  const [subFilter, setSubFilter] = useState("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/hr/documents/my");
        setDocs(res.data?.documents || res.data || []);
      } catch { setDocs([]); }
      finally { setLoading(false); }
    })();
  }, []);

  async function download(doc) {
    setDl(doc.id);
    try {
      const res = await api.get(`/hr/documents/${doc.id}/download`, { responseType: "blob" });
      await api.post(`/hr/documents/${doc.id}/read`).catch(() => {});
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url; a.download = doc.file_name || "dokument.pdf"; a.click();
      URL.revokeObjectURL(url);
      setDocs(p => p.map(d => d.id === doc.id ? { ...d, read_at: new Date().toISOString() } : d));
    } catch { /* ignore */ }
    finally { setDl(null); }
  }

  const unread = docs.filter(d => !d.read_at);
  const shown  = subFilter === "unread" ? unread : docs;

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ key: "all", label: "Alle", count: docs.length }, { key: "unread", label: "Ungelesen", count: unread.length }].map(({ key, label, count }) => (
          <button key={key} onClick={() => setSubFilter(key)} style={{
            padding: "4px 14px", borderRadius: 99, cursor: "pointer",
            border: subFilter === key ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(var(--ink-tint),0.07)",
            background: subFilter === key ? "rgba(251,191,36,0.08)" : "transparent",
            color: subFilter === key ? ACCENT : "rgba(var(--ink-tint),0.45)",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {label}
            {count > 0 && <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>{count}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}><Spinner /></div>
      ) : shown.length === 0 ? (
        <Empty icon="📄" text={subFilter === "unread" ? "Keine ungelesenen Dokumente" : "Noch keine Dokumente"} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {shown.map(doc => {
            const isNew = !doc.read_at;
            const icon  = TYPE_ICONS[doc.document_type] ?? "📄";
            return (
              <div key={doc.id} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 20px", borderRadius: 16,
                border: `1px solid ${isNew ? "rgba(251,191,36,0.25)" : "rgba(var(--ink-tint),0.07)"}`,
                background: isNew ? "rgba(251,191,36,0.04)" : "rgba(var(--tint),0.025)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem",
                }}>{icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{
                      fontFamily: "'Fraunces', Georgia, serif", fontSize: "1rem",
                      color: "#efede7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{doc.title || doc.file_name}</span>
                    {isNew && <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem",
                      color: ACCENT, background: "rgba(251,191,36,0.12)",
                      border: "1px solid rgba(251,191,36,0.25)", borderRadius: 99, padding: "1px 7px",
                    }}>Neu</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {doc.document_type && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(var(--ink-tint),0.4)" }}>{doc.document_type}</span>}
                    {doc.year && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(var(--ink-tint),0.3)" }}>· {doc.year}</span>}
                  </div>
                </div>
                <button onClick={() => download(doc)} disabled={downloading === doc.id} style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  border: "1px solid rgba(251,191,36,0.25)", background: "rgba(251,191,36,0.07)",
                  color: ACCENT, fontSize: "1rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {downloading === doc.id ? <Spinner size={16} /> : "↓"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ── Listen Tab ────────────────────────────────────────────────────────────────
function ListenTab() {
  const [notes, setNotes]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [checked, setChecked]   = useState({});   // { noteId_itemIdx: bool }
  const [error, setError]       = useState(null);
  const fileRef                 = useRef();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get("/inventory/delivery-notes");
      setNotes(r.data?.delivery_notes || []);
    } catch { setNotes([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

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
    } catch { setError("Analyse fehlgeschlagen. Bitte erneut versuchen."); }
    finally { setAnalyzing(false); e.target.value = ""; }
  }

  const toggle = (noteId, idx) => {
    const k = `${noteId}_${idx}`;
    setChecked(p => ({ ...p, [k]: !p[k] }));
  };

  const pending = notes.filter(n => n.status === "pending");

  return (
    <>
      {/* Upload-Button */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
          letterSpacing: "0.15em", textTransform: "uppercase",
          color: "rgba(var(--ink-tint),0.3)",
        }}>
          {notes.length} Liste{notes.length !== 1 ? "n" : ""}
          {pending.length > 0 && ` · ${pending.length} ausstehend`}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => fileRef.current?.click()} disabled={analyzing} style={{
          padding: "0.4rem 1rem", borderRadius: 10,
          border: "1px solid rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.07)",
          color: ACCENT, fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase",
          cursor: analyzing ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", gap: 7, opacity: analyzing ? 0.6 : 1,
        }}>
          {analyzing ? <Spinner size={16} /> : "📷"}
          {analyzing ? "Analysiere…" : "Lieferschein scannen"}
        </button>
        <input ref={fileRef} type="file" accept="image/*,application/pdf"
          style={{ display: "none" }} onChange={handleUpload} />
      </div>

      {error && (
        <div style={{
          marginBottom: 14, padding: "0.65rem 1rem", borderRadius: 10,
          background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
          color: "#f87171", fontSize: "0.8rem",
        }}>{error}</div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}><Spinner /></div>
      ) : notes.length === 0 ? (
        <Empty icon="📋" text="Noch keine Listen. Scanne einen Lieferschein um zu starten." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notes.map(note => {
            const isOpen  = expanded === note.id;
            const isPending = note.status === "pending";
            const items   = note.items || [];
            const checkedCount = items.filter((_, i) => checked[`${note.id}_${i}`]).length;
            const allDone = items.length > 0 && checkedCount === items.length;

            return (
              <div key={note.id} style={{
                borderRadius: 16,
                border: `1px solid ${isPending ? "rgba(251,191,36,0.2)" : "rgba(var(--ink-tint),0.07)"}`,
                background: isPending ? "rgba(251,191,36,0.03)" : "rgba(var(--tint),0.025)",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}>
                {/* Header */}
                <button onClick={() => setExpanded(isOpen ? null : note.id)} style={{
                  width: "100%", padding: "14px 18px", background: "none", border: "none",
                  display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
                  }}>
                    {note.source === "photo" ? "📷" : "📦"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Fraunces', Georgia, serif", fontSize: "1rem",
                      color: "#efede7", marginBottom: 2,
                    }}>
                      {note.supplier || "Unbekannter Lieferant"}
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem",
                      color: "rgba(var(--ink-tint),0.35)",
                    }}>
                      {note.delivery_number ? `Nr. ${note.delivery_number} · ` : ""}
                      {note.delivery_date || new Date(note.created_at).toLocaleDateString("de-DE")}
                      {items.length > 0 && ` · ${checkedCount}/${items.length}`}
                    </div>
                  </div>
                  {/* Progress bar */}
                  {items.length > 0 && (
                    <div style={{
                      width: 60, height: 4, borderRadius: 99,
                      background: "rgba(var(--tint),0.07)", overflow: "hidden", flexShrink: 0,
                    }}>
                      <div style={{
                        height: "100%", borderRadius: 99,
                        width: `${(checkedCount / items.length) * 100}%`,
                        background: allDone ? "#86efac" : ACCENT,
                        transition: "width 0.3s",
                      }} />
                    </div>
                  )}
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem",
                    color: "rgba(var(--ink-tint),0.3)", flexShrink: 0,
                    transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s",
                  }}>∨</span>
                </button>

                {/* Expanded items */}
                {isOpen && (
                  <div style={{ borderTop: "1px solid rgba(var(--ink-tint),0.06)", padding: "12px 18px 16px" }}>
                    {items.length === 0 ? (
                      <div style={{ fontSize: "0.8rem", color: "rgba(var(--ink-tint),0.35)", fontStyle: "italic" }}>
                        Keine Positionen erkannt
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {items.map((item, i) => {
                          const k = `${note.id}_${i}`;
                          const isDone = !!checked[k];
                          return (
                            <button key={i} onClick={() => toggle(note.id, i)} style={{
                              display: "flex", alignItems: "center", gap: 12,
                              padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                              border: `1px solid ${isDone ? "rgba(134,239,172,0.2)" : "rgba(var(--tint),0.06)"}`,
                              background: isDone ? "rgba(134,239,172,0.04)" : "rgba(var(--tint),0.02)",
                              textAlign: "left", width: "100%",
                              transition: "background 0.15s, border-color 0.15s",
                            }}>
                              <div style={{
                                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                                border: `2px solid ${isDone ? "#86efac" : "rgba(var(--tint),0.2)"}`,
                                background: isDone ? "rgba(134,239,172,0.2)" : "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#86efac", fontSize: "0.7rem",
                                transition: "all 0.15s",
                              }}>
                                {isDone ? "✓" : ""}
                              </div>
                              <div style={{ flex: 1 }}>
                                <span style={{
                                  fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.88rem",
                                  color: isDone ? "rgba(var(--ink-tint),0.4)" : "#efede7",
                                  textDecoration: isDone ? "line-through" : "none",
                                }}>
                                  {item.name}
                                </span>
                              </div>
                              {(item.quantity || item.unit) && (
                                <span style={{
                                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
                                  color: "rgba(var(--ink-tint),0.4)", flexShrink: 0,
                                }}>
                                  {item.quantity} {item.unit}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Confirm all button */}
                    {isPending && allDone && (
                      <button onClick={async () => {
                        try {
                          await api.post(`/inventory/delivery-notes/${note.id}/confirm`, { items: [] });
                          setNotes(p => p.map(n => n.id === note.id ? { ...n, status: "confirmed" } : n));
                        } catch { /* ignore */ }
                      }} style={{
                        marginTop: 12, width: "100%", padding: "0.6rem",
                        borderRadius: 10, border: "1px solid rgba(134,239,172,0.3)",
                        background: "rgba(134,239,172,0.08)", color: "#86efac",
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
                        letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                      }}>
                        ✓ Lieferschein bestätigen
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Empty({ icon, text }) {
  return (
    <div style={{
      textAlign: "center", padding: "4rem 2rem",
      border: "1px solid rgba(var(--ink-tint),0.06)",
      borderRadius: 20, background: "rgba(var(--tint),0.02)",
    }}>
      <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", color: "rgba(var(--ink-tint),0.4)" }}>{text}</div>
    </div>
  );
}

// ── Seite ─────────────────────────────────────────────────────────────────────
export default function ArbeitsStationHR() {
  const [tab, setTab] = useState("dokumente");

  return (
    <ArbeitsStationLayout title="HR & Listen" icon="📄" accent={ACCENT} maxWidth={820}>
      <style>{`@keyframes as-spin { to { transform: rotate(360deg); } }`}</style>

      <TabBar
        active={tab}
        onChange={setTab}
        tabs={[
          { key: "dokumente", label: "Dokumente", count: 0 },
          { key: "listen",    label: "Listen",    count: 0 },
        ]}
      />

      {tab === "dokumente" ? <DocsTab /> : <ListenTab />}
    </ArbeitsStationLayout>
  );
}
