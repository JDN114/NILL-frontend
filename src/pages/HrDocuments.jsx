import { useEffect, useState, useRef } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DOC_TYPES = [
  "Lohnsteuerbescheinigung",
  "Gehaltsabrechnung",
  "Arbeitsvertrag",
  "Zeugnis",
  "Krankmeldung",
  "Urlaubsantrag",
  "Sonstiges",
];

function UnreadDot() {
  return (
    <span style={{
      display: "inline-block",
      width: 8, height: 8,
      borderRadius: "50%",
      background: "var(--nill-gold)",
      marginLeft: 6,
      verticalAlign: "middle",
      flexShrink: 0,
    }} />
  );
}

function DocTypeBadge({ type }) {
  return (
    <span style={{
      fontSize: "0.68rem", fontWeight: 700,
      padding: "2px 8px",
      borderRadius: 99,
      background: "rgba(197,165,114,0.12)",
      border: "1px solid rgba(197,165,114,0.25)",
      color: "var(--nill-gold)",
      letterSpacing: "0.03em",
      whiteSpace: "nowrap",
    }}>
      {type}
    </span>
  );
}

// ─── Admin upload form ──────────────────────────────────────────────────────
function UploadForm({ users, onUploaded }) {
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [assignedTo, setAssignedTo] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file || !assignedTo) {
      setError("Bitte Datei und Mitarbeiter auswählen.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", title || file.name);
      fd.append("document_type", docType);
      if (description) fd.append("description", description);
      if (year) fd.append("year", year);
      fd.append("assigned_to", assignedTo);
      await api.post("/hr/documents", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle(""); setDescription(""); setFile(null); setAssignedTo("");
      if (fileRef.current) fileRef.current.value = "";
      onUploaded();
    } catch (err) {
      setError(err?.response?.data?.detail || "Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "0.55rem 0.8rem",
    background: "var(--nill-surface)",
    border: "1px solid var(--nill-border)",
    borderRadius: 8,
    color: "var(--nill-text)",
    fontSize: "0.82rem",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit} style={{
      padding: "1.4rem",
      background: "rgba(255,255,255,0.025)",
      border: "1px solid var(--nill-border)",
      borderRadius: 14,
      display: "flex", flexDirection: "column", gap: "0.85rem",
      marginBottom: "1.5rem",
    }}>
      <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.08em", color: "var(--nill-text-dim)" }}>
        Dokument hochladen
      </span>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: "0.72rem", color: "var(--nill-text-dim)" }}>Titel</label>
          <input style={inputStyle} placeholder="Automatisch aus Dateiname" value={title}
            onChange={e => setTitle(e.target.value)} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: "0.72rem", color: "var(--nill-text-dim)" }}>Typ</label>
          <select style={inputStyle} value={docType} onChange={e => setDocType(e.target.value)}>
            {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: "0.72rem", color: "var(--nill-text-dim)" }}>Mitarbeiter</label>
          <select style={inputStyle} value={assignedTo} onChange={e => setAssignedTo(e.target.value)} required>
            <option value="">-- auswählen --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.email}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: "0.72rem", color: "var(--nill-text-dim)" }}>Jahr</label>
          <input style={inputStyle} type="number" value={year} min={2000} max={2100}
            onChange={e => setYear(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={{ fontSize: "0.72rem", color: "var(--nill-text-dim)" }}>Beschreibung (optional)</label>
        <input style={inputStyle} placeholder="z.B. Lohnsteuerbescheinigung 2024" value={description}
          onChange={e => setDescription(e.target.value)} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label style={{ fontSize: "0.72rem", color: "var(--nill-text-dim)" }}>Datei (PDF, max. 20 MB)</label>
        <input ref={fileRef} style={{ ...inputStyle, padding: "0.45rem 0.8rem" }}
          type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={e => setFile(e.target.files[0])} required />
      </div>

      {error && (
        <span style={{ fontSize: "0.78rem", color: "#f87171" }}>{error}</span>
      )}

      <button type="submit" disabled={uploading} style={{
        alignSelf: "flex-start",
        padding: "0.55rem 1.4rem",
        background: uploading ? "var(--nill-border)" : "var(--nill-gold)",
        color: uploading ? "var(--nill-text-mute)" : "#000",
        border: "none", borderRadius: 8,
        fontWeight: 700, fontSize: "0.82rem",
        cursor: uploading ? "not-allowed" : "pointer",
      }}>
        {uploading ? "Wird hochgeladen…" : "Hochladen"}
      </button>
    </form>
  );
}

// ─── Single document row ────────────────────────────────────────────────────
function DocRow({ doc, isAdmin, users, onDelete, onRead }) {
  const [deleting, setDeleting] = useState(false);

  const assignee = isAdmin && users.find(u => u.id === doc.assigned_to);

  async function handleDelete() {
    if (!window.confirm("Dokument wirklich löschen?")) return;
    setDeleting(true);
    try {
      await api.delete(`/hr/documents/${doc.id}`);
      onDelete(doc.id);
    } catch {
      setDeleting(false);
    }
  }

  async function handleDownload() {
    try {
      const res = await api.get(`/hr/documents/${doc.id}/download`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name || "dokument";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download fehlgeschlagen.");
    }
  }

  async function handleMarkRead() {
    try {
      await api.post(`/hr/documents/${doc.id}/read`);
      onRead(doc.id);
    } catch {}
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "1rem",
      padding: "0.9rem 1.1rem",
      background: doc.is_read === false ? "rgba(197,165,114,0.04)" : "transparent",
      border: "1px solid var(--nill-border)",
      borderRadius: 10,
      transition: "background 0.15s",
    }}>
      {/* Icon */}
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        borderRadius: 8,
        background: "var(--nill-gold-dim)",
        border: "1px solid rgba(197,165,114,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--nill-gold)",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>

      {/* Main info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--nill-text)" }}>
            {doc.title}
          </span>
          {doc.is_read === false && <UnreadDot />}
          <DocTypeBadge type={doc.document_type} />
          {doc.year && (
            <span style={{ fontSize: "0.72rem", color: "var(--nill-text-dim)" }}>{doc.year}</span>
          )}
        </div>
        <div style={{ fontSize: "0.72rem", color: "var(--nill-text-mute)", marginTop: 2 }}>
          {isAdmin && assignee && (
            <span style={{ marginRight: 8 }}>→ {assignee.full_name || assignee.email}</span>
          )}
          {doc.description && <span>{doc.description}</span>}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button onClick={handleDownload} title="Herunterladen" style={btnStyle("var(--nill-border)")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>

        {!isAdmin && doc.is_read === false && (
          <button onClick={handleMarkRead} title="Als gelesen markieren" style={btnStyle("rgba(197,165,114,0.25)")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="var(--nill-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        )}

        {isAdmin && (
          <button onClick={handleDelete} disabled={deleting} title="Löschen"
            style={btnStyle("rgba(248,113,113,0.15)", "#f87171")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function btnStyle(bg, color = "var(--nill-text-dim)") {
  return {
    width: 32, height: 32,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: bg,
    border: "1px solid var(--nill-border)",
    borderRadius: 7,
    cursor: "pointer",
    color,
    transition: "background 0.12s",
  };
}

// ─── Embeddable content (used as tab inside other pages) ────────────────────
export function HrDocsContent({ defaultFilterType = "" }) {
  const { isCompanyAdmin } = useAuth();
  const isAdmin = Boolean(isCompanyAdmin);

  const [docs,       setDocs]       = useState([]);
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filterType, setFilterType] = useState(defaultFilterType);
  const [filterUser, setFilterUser] = useState("");

  async function fetchDocs() {
    try {
      const params = {};
      if (filterType) params.document_type = filterType;
      if (filterUser) params.assigned_to   = filterUser;
      const endpoint = isAdmin ? "/hr/documents" : "/hr/documents/my";
      const res = await api.get(endpoint, { params });
      setDocs(res.data?.items ?? res.data ?? []);
    } catch {
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    if (!isAdmin) return;
    try {
      const res = await api.get("/hr/users");
      setUsers(res.data?.items ?? res.data ?? []);
    } catch {}
  }

  useEffect(() => { fetchUsers(); }, [isAdmin]);
  useEffect(() => { setLoading(true); fetchDocs(); }, [filterType, filterUser, isAdmin]);

  const handleDelete = (id) => setDocs(prev => prev.filter(d => d.id !== id));
  const handleRead   = (id) => setDocs(prev => prev.map(d => d.id === id ? { ...d, is_read: true } : d));

  const unreadCount = docs.filter(d => !d.is_read).length;
  const lockType    = Boolean(defaultFilterType); // wenn Typ von außen vorgegeben → kein Filter-Select

  return (
    <div>
      {isAdmin && <UploadForm users={users} onUploaded={fetchDocs} />}

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        {!lockType && (
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selStyle}>
            <option value="">Alle Typen</option>
            {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        )}

        {isAdmin && (
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={selStyle}>
            <option value="">Alle Mitarbeiter</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.full_name || u.email}</option>)}
          </select>
        )}

        <span style={{ fontSize: "0.78rem", color: "var(--nill-text-dim)", marginLeft: "auto" }}>
          {!isAdmin && unreadCount > 0 && (
            <span style={{ marginRight: 10, padding: "2px 8px", borderRadius: 99,
              background: "rgba(197,165,114,0.15)", border: "1px solid rgba(197,165,114,0.3)",
              color: "var(--nill-gold)", fontWeight: 700 }}>
              {unreadCount} neu
            </span>
          )}
          {docs.length} Dokument{docs.length !== 1 ? "e" : ""}
        </span>
      </div>

      {loading ? (
        <div style={{ color: "var(--nill-text-mute)", fontSize: "0.85rem", padding: "2rem 0" }}>Lädt…</div>
      ) : docs.length === 0 ? (
        <div style={{ padding: "3rem 0", textAlign: "center", color: "var(--nill-text-mute)", fontSize: "0.85rem" }}>
          {isAdmin ? "Noch keine Dokumente hochgeladen." : "Du hast noch keine Dokumente erhalten."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {docs.map(doc => (
            <DocRow key={doc.id} doc={doc} isAdmin={isAdmin} users={users}
              onDelete={handleDelete} onRead={handleRead} />
          ))}
        </div>
      )}
    </div>
  );
}

const selStyle = {
  padding: "0.45rem 0.75rem",
  background: "var(--nill-surface)",
  border: "1px solid var(--nill-border)",
  borderRadius: 8, color: "var(--nill-text)",
  fontSize: "0.8rem", cursor: "pointer",
};

// ─── Standalone page (behält eigene Route) ──────────────────────────────────
export default function HrDocuments() {
  const { isCompanyAdmin } = useAuth();
  const isAdmin = Boolean(isCompanyAdmin);

  return (
    <PageLayout>
      <div style={{ marginBottom: "1.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--nill-text-dim)" }}>
          Dashboard / Betrieb / HR Dokumente
        </span>
        <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: "0.25rem 0 0.3rem",
          color: "var(--nill-text)", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
          HR Dokumente
        </h1>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>
          {isAdmin ? "Mitarbeiterdokumente hochladen & verwalten" : "Deine Dokumente & Bescheinigungen"}
        </p>
      </div>
      <HrDocsContent />
    </PageLayout>
  );
}
