import { useEffect, useState } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import api from "../../services/api";

const ACCENT = "#fbbf24";

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

const TYPE_ICONS = {
  "Lohnsteuerbescheinigung": "📋",
  "Gehaltsabrechnung":       "💶",
  "Arbeitsvertrag":          "📝",
  "Zeugnis":                 "🎓",
  "Krankmeldung":            "🏥",
  "Urlaubsantrag":           "✈️",
};

function DocCard({ doc, onDownload, downloading }) {
  const isNew = !doc.read_at;
  const icon  = TYPE_ICONS[doc.document_type] ?? "📄";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "16px 20px",
      borderRadius: 16,
      border: `1px solid ${isNew ? "rgba(251,191,36,0.25)" : "rgba(239,237,231,0.07)"}`,
      background: isNew ? "rgba(251,191,36,0.04)" : "rgba(255,255,255,0.025)",
      transition: "background 0.2s",
    }}>
      {/* Icon */}
      <div style={{
        width: 44, height: 44,
        borderRadius: 12,
        background: `rgba(251,191,36,0.1)`,
        border: "1px solid rgba(251,191,36,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.3rem",
        flexShrink: 0,
      }}>{icon}</div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
            fontWeight: 400,
            color: "#efede7",
            letterSpacing: "-0.01em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>{doc.title || doc.file_name}</span>
          {isNew && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: ACCENT,
              background: "rgba(251,191,36,0.12)",
              border: "1px solid rgba(251,191,36,0.25)",
              borderRadius: 99,
              padding: "1px 7px",
              flexShrink: 0,
            }}>Neu</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {doc.document_type && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(239,237,231,0.4)",
              letterSpacing: "0.05em",
            }}>{doc.document_type}</span>
          )}
          {doc.year && (
            <span style={{ fontSize: "0.65rem", color: "rgba(239,237,231,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
              · {doc.year}
            </span>
          )}
          <span style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.7rem",
            color: "rgba(239,237,231,0.3)",
          }}>
            {new Date(doc.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={() => onDownload(doc)}
        disabled={downloading === doc.id}
        title="Herunterladen"
        style={{
          width: 38, height: 38,
          borderRadius: 10,
          border: "1px solid rgba(251,191,36,0.25)",
          background: "rgba(251,191,36,0.07)",
          color: ACCENT,
          fontSize: "1rem",
          cursor: downloading === doc.id ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.2s, border-color 0.2s, transform 0.15s",
          opacity: downloading === doc.id ? 0.5 : 1,
        }}
        onPointerDown={e => downloading !== doc.id && (e.currentTarget.style.transform = "scale(0.92)")}
        onPointerUp={e => (e.currentTarget.style.transform = "scale(1)")}
        onPointerLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(251,191,36,0.14)"; e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(251,191,36,0.07)"; e.currentTarget.style.borderColor = "rgba(251,191,36,0.25)"; }}
      >
        {downloading === doc.id ? <Spinner /> : "↓"}
      </button>
    </div>
  );
}

export default function ArbeitsStationHR() {
  const [docs, setDocs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [downloading, setDownload] = useState(null);
  const [filter, setFilter]       = useState("all");

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
    setDownload(doc.id);
    try {
      const res = await api.get(`/hr/documents/${doc.id}/download`, { responseType: "blob" });
      await api.post(`/hr/documents/${doc.id}/read`).catch(() => {});
      const url = URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement("a");
      a.href    = url;
      a.download = doc.file_name || "dokument.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, read_at: new Date().toISOString() } : d));
    } catch { /* non-fatal */ }
    finally { setDownload(null); }
  }

  const unread = docs.filter(d => !d.read_at);
  const shown  = filter === "unread" ? unread : docs;

  return (
    <ArbeitsStationLayout title="HR Dokumente" icon="📄" accent={ACCENT} maxWidth={780}>
      <style>{`@keyframes as-spin { to { transform: rotate(360deg); } }`}</style>

      {/* Filter tabs */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 24,
        borderBottom: "1px solid rgba(239,237,231,0.07)",
        paddingBottom: 16,
      }}>
        {[
          { key: "all",    label: "Alle",    count: docs.length },
          { key: "unread", label: "Ungelesen", count: unread.length },
        ].map(({ key, label, count }) => (
          <button key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: "6px 18px",
              borderRadius: 99,
              border: filter === key
                ? "1px solid rgba(251,191,36,0.35)"
                : "1px solid rgba(239,237,231,0.08)",
              background: filter === key
                ? "rgba(251,191,36,0.1)"
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
            {count > 0 && (
              <span style={{
                background: filter === key ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.06)",
                border: filter === key ? "1px solid rgba(251,191,36,0.2)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 99,
                padding: "0px 6px",
                fontSize: "0.65rem",
                color: filter === key ? ACCENT : "rgba(239,237,231,0.4)",
              }}>{count}</span>
            )}
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
          <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 12 }}>📄</div>
          <div style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.1rem",
            color: "rgba(239,237,231,0.4)",
          }}>
            {filter === "unread" ? "Keine ungelesenen Dokumente" : "Noch keine Dokumente vorhanden"}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {shown.map(doc => (
            <DocCard
              key={doc.id}
              doc={doc}
              onDownload={download}
              downloading={downloading}
            />
          ))}
        </div>
      )}
    </ArbeitsStationLayout>
  );
}
