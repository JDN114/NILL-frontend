// ich muss hier was reinschreiben, um einen neuen Git Push zu forcen  src/pages/EmailsPage.jsx
//
// Drop-in Replacement: provider-aware (Gmail / Outlook / IMAP).
//
// Änderungen ggü. der vorherigen Version:
//   - Account-Switcher in der Sidebar bei mehreren IMAP-Postfächern
//   - Provider-Switcher unten in der Sidebar (zeigt Gmail / Outlook / IMAP)
//   - Reauth-Banner oben, wenn ein IMAP-Account needs_reauth signalisiert
//   - Attachment-URLs jetzt provider-aware (IMAP-Mails → /imap/attachments/…)
//   - Compose/Reply-Modal: bei provider==='imap' werden ImapCompose/ImapReply
//     verwendet, sonst die bestehenden Gmail/Outlook-Modals.
//
// Alles andere (Filter, Suche, Smart-Folders, Polling, KI-Panel) ist
// pixelidentisch zur Vorgängerversion.

import { memo, useContext, useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MailContext } from "../context/MailContext";
import { ImapContext } from "../context/ImapContext";
import SafeEmailHtml from "../components/SafeEmailHtml";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";
import ImapReplyModal from "../components/ImapReplyModal";
import ImapComposeModal from "../components/ImapComposeModal";
import ImapAccountSwitcher from "../components/ImapAccountSwitcher";
import SmartFolderModal from "../components/SmartFolderModal";
import api from "../services/api";
import { attachmentUrl } from "../services/mailApi";

const IC = {
  refresh: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>),
  compose: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  back:    (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>),
  reply:   (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>),
  search:  (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  filter:  (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>),
  close:   (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  bolt:    (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>),
  check:   (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  tag:     (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>),
  smile:   (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>),
  more:    (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
};

const FILTERS = [
  { key: "all",    label: "Alle" },
  { key: "unread", label: "Ungelesen" },
  { key: "read",   label: "Gelesen" },
  { key: "high",   label: "Dringend" },
  { key: "today",  label: "Heute" },
  { key: "week",   label: "Diese Woche" },
  { key: "withAI", label: "KI analysiert" },
];

const PRIO = {
  high:   { label: "Dringend", cls: "em-priority--high",   dot: "em-dot--high" },
  medium: { label: "Normal",   cls: "em-priority--medium", dot: "em-dot--medium" },
  low:    { label: "Niedrig",  cls: "em-priority--low",    dot: "em-dot--low" },
};
const SENT_CFG = {
  positive: { label: "Positiv", cls: "em-sentiment--pos" },
  neutral:  { label: "Neutral", cls: "em-sentiment--neu" },
  negative: { label: "Negativ", cls: "em-sentiment--neg" },
};

function extractSender(mail) {
  const raw = mail.from_address || mail.from || mail.from_raw || "";
  const nm  = raw.match(/^(.+?)\s*<.+>$/);
  const em  = raw.match(/<(.+?)>/);
  return { name: (nm ? nm[1].replace(/"/g, "").trim() : raw) || raw, email: em ? em[1] : raw };
}
function fmtShort(str) {
  if (!str) return "";
  const d = new Date(str), now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  if (d.getFullYear() === now.getFullYear()) return d.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
  return d.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
}
function fmtLong(str) {
  if (!str) return "";
  return new Date(str).toLocaleString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
const Avatar = memo(function Avatar({ name }) {
  const letter = (name || "?")[0].toUpperCase();
  const hue = [...(name || "")].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return <div style={{ background: `hsl(${hue},35%,32%)` }} className="em-avatar">{letter}</div>;
});
const Spinner = memo(function Spinner({ sm }) {
  return <div className={sm ? "em-spinner em-spinner--sm" : "em-spinner"} />;
});

const AiPanel = memo(function AiPanel({ email, aiEnabled }) {
  if (!aiEnabled) return null;
  const s = email.ai_status;
  if (s === "pending" || s === "processing") return (
    <div className="em-ai-panel em-ai-panel--loading">
      <Spinner sm /><span>{s === "processing" ? "KI analysiert…" : "Warte auf Analyse…"}</span>
    </div>
  );
  if (s === "failed") return (
    <div className="em-ai-panel em-ai-panel--failed">
      <span className="em-ai-failed-label">KI-Analyse fehlgeschlagen</span>
    </div>
  );
  if (s !== "success") return null;
  const prio = PRIO[email.priority] || PRIO.medium;
  const sent = SENT_CFG[email.sentiment] || SENT_CFG.neutral;
  return (
    <div className="em-ai-panel">
      <div className="em-ai-header">
        <span className="em-ai-title">KI Analyse</span>
        <div className="em-ai-badges">
          <span className={`em-priority ${prio.cls}`}>{IC.bolt} {prio.label}</span>
          <span className={`em-sentiment ${sent.cls}`}>{IC.smile} {sent.label}</span>
          {email.category && <span className="em-category">{IC.tag} {email.category}</span>}
        </div>
      </div>
      {email.summary && <p className="em-ai-summary">{email.summary}</p>}
      {email.action_items?.length > 0 && (
        <div className="em-ai-section">
          <p className="em-ai-section-label">Handlungsbedarf</p>
          <ul className="em-ai-actions">
            {email.action_items.map((item, i) => (
              <li key={i} className="em-ai-action-item">
                <span className="em-ai-action-icon">{IC.check}</span>{item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {email.detected_dates?.length > 0 && (
        <div className="em-ai-section">
          <p className="em-ai-section-label">Erwähnte Termine</p>
          <div className="em-ai-dates">
            {email.detected_dates.map((d, i) => (
              <span key={i} className="em-ai-date-chip">
                {new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// ── Memoized EmailListItem — re-renders only when its own props change ─────────
const EmailListItem = memo(function EmailListItem({
  id, isActive, isUnread, senderName, subject, category, priority, dateStr, onOpen, aiEnabled,
}) {
  const prio = aiEnabled ? PRIO[priority] : null;
  return (
    <li
      onClick={() => onOpen(id)}
      className={`em-item${isActive ? " em-item--active" : ""}${isUnread ? " em-item--unread" : ""}`}
    >
      <Avatar name={senderName} />
      <div className="em-item-body">
        <div className="em-item-top">
          <span className="em-item-sender">{senderName}</span>
          <div className="em-item-top-right">
            {prio && <span className={`em-dot ${prio.dot}`} title={prio.label} />}
            <span className="em-item-date">{dateStr}</span>
          </div>
        </div>
        <p className="em-item-subject">{subject || "(Kein Betreff)"}</p>
        {aiEnabled && category && <span className="em-item-category">{category}</span>}
      </div>
    </li>
  );
});

// ── Attachment preview modal ──────────────────────────────────────────────────
const IMG_EXTS  = new Set(["jpg","jpeg","png","gif","webp","svg","bmp"]);
const PDF_EXTS  = new Set(["pdf"]);

function previewKind(att) {
  // Normalise the stored content_type (may contain params or be octet-stream)
  const ct  = (att.content_type || "").split(";")[0].trim().toLowerCase();
  const ext = (att.filename || "").split(".").pop().toLowerCase();
  if (ct === "application/pdf"  || PDF_EXTS.has(ext))  return "pdf";
  if (ct.startsWith("image/")   || IMG_EXTS.has(ext))  return "image";
  return null;
}

function AttachmentPreview({ att, email, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let revoke;
    setLoading(true); setError(null); setBlobUrl(null);
    const url = attachmentUrl({ email, attachmentId: att.id });
    fetch(url, { credentials: "include" })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.blob(); })
      .then(blob => {
        // Use the correct MIME type so the browser renders PDF / images properly.
        const kind = previewKind(att);
        const mime = kind === "pdf" ? "application/pdf"
                   : kind === "image" ? (att.content_type?.startsWith("image/") ? att.content_type : "image/jpeg")
                   : blob.type || "application/octet-stream";
        const typed = blob.type && blob.type !== "application/octet-stream"
          ? blob
          : blob.slice(0, blob.size, mime);
        const u = URL.createObjectURL(typed);
        revoke = u;
        setBlobUrl(u);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
    return () => { if (revoke) URL.revokeObjectURL(revoke); };
  }, [att.id]);

  const download = () => {
    if (!blobUrl) return;
    const a = document.createElement("a");
    a.href = blobUrl; a.download = att.filename || "attachment";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const kind = previewKind(att);
  const isPreviewable = kind !== null;
  const isImage = kind === "image";

  return (
    <div className="em-preview-backdrop" onClick={onClose}>
      <div className="em-preview-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="em-preview-header">
          <div className="em-preview-filename">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
            <span>{att.filename}</span>
            {att.size_bytes && <span className="em-preview-size">{(att.size_bytes / 1024).toFixed(0)} KB</span>}
          </div>
          <div className="em-preview-actions">
            <button className="em-preview-dl-btn" onClick={download} disabled={!blobUrl} title="Herunterladen">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Herunterladen
            </button>
            <button className="em-preview-close" onClick={onClose} title="Schließen">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="em-preview-body">
          {loading && <div className="em-preview-state"><Spinner /></div>}

          {!loading && error && (
            <div className="em-preview-state">
              <p style={{ color: "#f87171", marginBottom: "1rem" }}>Fehler beim Laden: {error}</p>
            </div>
          )}

          {!loading && !error && isPreviewable && isImage && (
            <img src={blobUrl} alt={att.filename} className="em-preview-img" />
          )}

          {!loading && !error && isPreviewable && !isImage && (
            <iframe src={blobUrl} title={att.filename} className="em-preview-iframe" />
          )}

          {!loading && !error && !isPreviewable && (
            <div className="em-preview-state">
              <div className="em-preview-nopreview">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ opacity: 0.35 }}>
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
                <p style={{ margin: "0.75rem 0 0.25rem", fontWeight: 600 }}>Vorschau nicht verfügbar</p>
                <p style={{ fontSize: "0.82rem", opacity: 0.65, margin: "0 0 0.25rem" }}>
                  {(() => {
                    const ext = (att.filename || "").split(".").pop().toUpperCase();
                    return ext ? `${ext}-Dateien können nicht in der App angezeigt werden.` : "Dieser Dateityp kann nicht angezeigt werden.";
                  })()}
                </p>
                <p style={{ fontSize: "0.72rem", opacity: 0.4, margin: 0 }}>
                  {att.content_type && att.content_type !== "application/octet-stream" ? att.content_type : ""}
                </p>
                <button className="em-preview-dl-btn" style={{ marginTop: "1.5rem" }} onClick={download} disabled={!blobUrl}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Datei herunterladen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Memoized EmailDetail — re-renders only when activeEmail content changes ──
const EmailDetail = memo(function EmailDetail({ email, onClose, onReply, aiEnabled }) {
  const [preview, setPreview] = useState(null); // att object or null

  if (!email) return <div className="em-detail-empty">Wähle eine E-Mail aus</div>;
  const s = extractSender(email);
  return (
    <div className="em-detail">
      {preview && (
        <AttachmentPreview
          att={preview}
          email={email}
          onClose={() => setPreview(null)}
        />
      )}
      <div className="em-detail-topbar">
        <button onClick={onClose} className="em-back">{IC.back} Zurück</button>
      </div>
      <div className="em-detail-inner">
        <h2 className="em-detail-subject">{email.subject || "(Kein Betreff)"}</h2>
        <div className="em-detail-meta">
          <Avatar name={s.name} />
          <div className="em-detail-meta-info">
            <span className="em-detail-meta-name">{s.name}</span>
            <span className="em-detail-meta-email">&lt;{s.email}&gt;</span>
          </div>
          <span className="em-detail-meta-date">{fmtLong(email.received_at)}</span>
        </div>
        <AiPanel email={email} aiEnabled={aiEnabled} />
        <div className="em-detail-body">
          <SafeEmailHtml html={email.body ?? ""} />
        </div>
        {email.attachments?.length > 0 && (
          <div className="em-attachments">
            <div className="em-attachments-label">Anhänge ({email.attachments.length})</div>
            <div className="em-attachment-list">
              {email.attachments.map((att, i) => (
                <button key={i} onClick={() => setPreview(att)} className="em-attachment-chip">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
                    <polyline points="13 2 13 9 20 9"/>
                  </svg>
                  {att.filename}
                  {att.size_bytes && <span className="em-attachment-size">{(att.size_bytes / 1024).toFixed(0)} KB</span>}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="em-detail-actions">
          <button onClick={onReply} className="em-reply-btn">
            {IC.reply} Antworten
          </button>
        </div>
      </div>
    </div>
  );
});

// ── Haupt-Komponente ──────────────────────────────────────────────────────────
export default function EmailsPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    provider, connected, activeEmail,
    fetchEmails, searchEmails, openEmail, closeEmail,
    initializing, disconnectProvider, hasMore,
    allProviders, setActiveProvider,
    connectGmail, connectOutlook,
    imapNeedsReauth,
  } = useContext(MailContext);
  const imap = useContext(ImapContext);

  const [aiEnabled, setAiEnabled]       = useState(false);
  const [mailbox, setMailbox]           = useState("inbox");
  const [activeFolder, setActiveFolder] = useState(null);
  const [folders, setFolders]           = useState([]);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder]     = useState(null);
  const [replyOpen, setReplyOpen]       = useState(false);
  const [composeOpen, setComposeOpen]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [emails, setEmails]             = useState([]);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching]       = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterOpen, setFilterOpen]     = useState(false);

  const pollingRef     = useRef(null);
  const activeEmailRef = useRef(null);
  const searchTimeout  = useRef(null);

  const mailboxRef      = useRef(mailbox);
  const activeFolderRef = useRef(activeFolder);
  const fetchEmailsRef  = useRef(fetchEmails);
  const openEmailRef    = useRef(openEmail);
  useEffect(() => { mailboxRef.current = mailbox; }, [mailbox]);
  useEffect(() => { activeFolderRef.current = activeFolder; }, [activeFolder]);
  useEffect(() => { fetchEmailsRef.current = fetchEmails; }, [fetchEmails]);
  useEffect(() => { activeEmailRef.current = activeEmail; }, [activeEmail]);
  useEffect(() => { openEmailRef.current = openEmail; }, [openEmail]);

  // Smart-Folders sind provider-agnostisch (filtern user-level Email-Rows).
  useEffect(() => {
    if (connected) {
      api.get("/gmail/folders").then(r => setFolders(r.data?.folders || [])).catch(() => {});
    }
  }, [connected]);

  useEffect(() => { if (!user) navigate("/login", { replace: true }); }, [user, navigate]);

  useEffect(() => {
    api.get("/me/onboarding-status")
      .then(r => setAiEnabled(r.data?.ai_email_processing_consent === true))
      .catch(() => {});
  }, []);

  // ── Initiales Laden ───────────────────────────────────────────────────────
  const loadEmails = useCallback(async () => {
    if (!connected) return;
    setLoading(true); setError(null); setSearchResults(null);
    try {
      if (activeFolderRef.current) {
        const r = await api.get(`/gmail/folders/${activeFolderRef.current}/emails`);
        setEmails((r.data?.emails || []).sort((a, b) =>
          new Date(b.received_at || 0) - new Date(a.received_at || 0)
        ));
      } else {
        const f = (await fetchEmailsRef.current(mailboxRef.current)) ?? [];
        setEmails([...f].sort((a, b) =>
          new Date(b.received_at || b.date || 0) - new Date(a.received_at || a.date || 0)
        ));
      }
    } catch { setError("Laden fehlgeschlagen."); }
    finally { setLoading(false); }
  }, [connected]);

  useEffect(() => {
    if (connected && !initializing) loadEmails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, initializing, mailbox, activeFolder, provider, imap?.activeAccountId]);

  // ── Mehr laden ────────────────────────────────────────────────────────────
  const loadMore = async () => {
    if (loadingMore || activeFolder) return;
    setLoadingMore(true);
    try {
      const more = (await fetchEmails(mailbox, true)) ?? [];
      if (more.length > 0) {
        setEmails(prev => {
          const existingIds = new Set(prev.map(e => e.id));
          const newOnes = more.filter(e => !existingIds.has(e.id));
          return [...prev, ...newOnes].sort((a, b) =>
            new Date(b.received_at || b.date || 0) - new Date(a.received_at || a.date || 0)
          );
        });
      }
    } catch { /* still show existing */ }
    finally { setLoadingMore(false); }
  };

  // ── Suche ────────────────────────────────────────────────────────────────
  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    if (!val.trim()) { setSearchResults(null); return; }
    const q = val.toLowerCase();
    const clientHits = emails.filter(m =>
      (m.subject || "").toLowerCase().includes(q) ||
      extractSender(m).name.toLowerCase().includes(q) ||
      extractSender(m).email.toLowerCase().includes(q)
    );
    setSearchResults(clientHits);
    if (val.trim().length >= 2) {
      searchTimeout.current = setTimeout(async () => {
        setSearching(true);
        try {
          const dbResults = await searchEmails(val.trim(), mailbox);
          setSearchResults([...dbResults].sort((a, b) =>
            new Date(b.received_at || b.date || 0) - new Date(a.received_at || a.date || 0)
          ));
        } catch { /* keep client results */ }
        finally { setSearching(false); }
      }, 600);
    }
  };
  useEffect(() => () => clearTimeout(searchTimeout.current), []);

  // ── Filter ───────────────────────────────────────────────────────────────
  const displayEmails = useMemo(() => {
    const base = searchResults !== null ? searchResults : emails;
    let filtered = base;
    if (activeFilter !== "all") {
      const now = new Date(), sow = new Date(now);
      sow.setDate(now.getDate() - now.getDay());
      filtered = base.filter(mail => {
        switch (activeFilter) {
          case "unread":  return !mail.read;
          case "read":    return  mail.read;
          case "high":    return  mail.priority === "high";
          case "today":   return new Date(mail.received_at || 0).toDateString() === now.toDateString();
          case "week":    return new Date(mail.received_at || 0) >= sow;
          case "withAI":  return ["success", "done"].includes(mail.ai_status);
          default:        return true;
        }
      });
    }
    // Pre-compute stable primitive props so EmailListItem.memo can bail out cheaply
    return filtered.map(mail => {
      const { name } = extractSender(mail);
      return { ...mail, _senderName: name, _dateStr: fmtShort(mail.received_at || mail.date) };
    });
  }, [emails, searchResults, activeFilter]);

  const unreadCount   = useMemo(() => emails.filter(m => !m.read && m.mailbox !== "sent").length, [emails]);
  const canLoadMore   = searchResults === null && hasMore?.[mailbox === "inbox" ? "inbox" : "sent"];
  const activeEmailId = activeEmail?.id ?? null;

  // ── Polling (nur für AI-Status der geöffneten Mail) ─────────────────────
  // stopPolling/startPolling/handleOpen nutzen Refs statt Context-Werte als Deps
  // → stabile Referenzen, keine Kaskaden-Re-renders durch openEmail-Änderungen
  const stopPolling = useCallback(() => {
    clearInterval(pollingRef.current);
    pollingRef.current = null;
  }, []);

  const startPolling = useCallback((id) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const updated = await openEmailRef.current(id);
        const status = updated?.ai_status ?? activeEmailRef.current?.ai_status;
        if (["done", "success", "failed"].includes(status) || !activeEmailRef.current) {
          stopPolling();
        }
      } catch { stopPolling(); }
    }, 4000);
  }, [stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const aiEnabledRef = useRef(aiEnabled);
  useEffect(() => { aiEnabledRef.current = aiEnabled; }, [aiEnabled]);

  const handleOpen = useCallback(async (id) => {
    if (!id || activeEmailRef.current?.id === id) return;
    stopPolling();
    const email = await openEmailRef.current(id);
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
    const status = email?.ai_status ?? "skipped";
    if (aiEnabledRef.current && !["done", "success", "failed", "skipped"].includes(status)) {
      startPolling(id);
    }
  }, [stopPolling, startPolling]);

  const handleClose = useCallback(() => {
    stopPolling();
    setTimeout(closeEmail, 30);
  }, [stopPolling, closeEmail]);

  const handleReply = useCallback(() => setReplyOpen(true), []);

  const handleDisconnect = useCallback(async () => {
    if (!window.confirm(`${provider} wirklich trennen?`)) return;
    await disconnectProvider?.();
  }, [provider, disconnectProvider]);

  // Modal-Auswahl je Provider
  const ComposeModal = provider === "imap" ? ImapComposeModal : EmailComposeModal;
  const ReplyModal   = provider === "imap" ? ImapReplyModal   : EmailReplyModal;

  if (initializing) return (
    <div className="em-shell em-shell--center"><Spinner /><p className="em-center-label">Prüfe Verbindung…</p></div>
  );
  if (!connected) return (
    <div className="em-shell em-shell--center">
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:24, maxWidth:360, textAlign:"center" }}>
        <div style={{ fontSize:"1.5rem", fontWeight:600, color:"var(--nill-text, #e8e0d0)" }}>E-Mail verbinden</div>
        <p style={{ fontSize:".85rem", color:"var(--nill-text-dim, #888)", lineHeight:1.5, margin:0 }}>
          Verbinde einen E-Mail-Provider, um deine Nachrichten hier zu verwalten.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%" }}>
          <button
            onClick={() => connectGmail?.()}
            style={{
              padding:"10px 20px", borderRadius:8, border:"1px solid rgba(197,165,114,0.35)",
              background:"rgba(197,165,114,0.08)", color:"#c5a572",
              fontSize:".85rem", cursor:"pointer", fontFamily:"inherit",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
            Gmail verbinden
          </button>
          <button
            onClick={() => connectOutlook?.()}
            style={{
              padding:"10px 20px", borderRadius:8, border:"1px solid rgba(100,140,220,0.35)",
              background:"rgba(100,140,220,0.08)", color:"#7a9de0",
              fontSize:".85rem", cursor:"pointer", fontFamily:"inherit",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
            Outlook verbinden
          </button>
          <a
            href="/dashboard/settings"
            style={{
              padding:"10px 20px", borderRadius:8, border:"1px solid rgba(120,120,120,0.25)",
              background:"transparent", color:"var(--nill-text-dim, #888)",
              fontSize:".85rem", cursor:"pointer", fontFamily:"inherit", textDecoration:"none",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}
          >
            IMAP / eigenen Server verbinden → Einstellungen
          </a>
        </div>
      </div>
    </div>
  );

  const filterLabel = FILTERS.find(f => f.key === activeFilter)?.label;
  const isSearching = search.trim().length > 0;

  return (
    <>
      <div className="em-shell">
        {/* ── Sidebar ── */}
        <aside className="em-sidebar">
          <a href="/dashboard" className="em-logo">
            <span className="em-logo-mark">N</span>
            <span className="em-logo-label">NILL</span>
          </a>

          {/* Provider-Tabs — immer sichtbar, zeigt alle verbundenen Provider */}
          {allProviders.length > 0 && (
            <div className="em-provider-tabs">
              {allProviders.map(p => (
                <button
                  key={p.key}
                  className={`em-provider-tab${provider === p.key ? " em-provider-tab--active" : ""}`}
                  onClick={() => setActiveProvider(p.key)}
                  title={p.label}
                >
                  {p.key === "outlook" ? "Outlook" : p.key === "gmail" ? "Gmail" : "IMAP"}
                </button>
              ))}
            </div>
          )}

          {/* IMAP-Account-Switcher (nur wenn IMAP aktiv) */}
          {provider === "imap" && <ImapAccountSwitcher />}

          {/* Reauth-Banner für IMAP */}
          {imapNeedsReauth && (
            <div className="mx-2 mb-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
              Ein Postfach muss neu verbunden werden.{" "}
              <a href="/settings" className="underline">Einstellungen</a>
            </div>
          )}

          <button onClick={() => setComposeOpen(true)} className="em-compose">
            {IC.compose} Verfassen
          </button>

          <nav className="em-nav">
            {[
              { key: "inbox", label: "Posteingang", badge: unreadCount },
              { key: "sent",  label: "Gesendet" },
            ].map(({ key, label, badge }) => (
              <button key={key}
                onClick={() => { setMailbox(key); setActiveFolder(null); setSearch(""); setSearchResults(null); setActiveFilter("all"); handleClose(); }}
                className={`em-nav-item ${mailbox === key && !activeFolder ? "em-nav-item--active" : ""}`}>
                <span>{label}</span>
                {badge > 0 && <span className="em-badge">{badge}</span>}
              </button>
            ))}

            {folders.length > 0 && <div className="em-nav-divider"/>}
            {folders.map(f => (
              <div key={f.id} className="flex items-center group">
                <button
                  onClick={() => { setActiveFolder(f.id); setSearch(""); setSearchResults(null); setActiveFilter("all"); handleClose(); }}
                  className={`em-nav-item flex-1 ${activeFolder === f.id ? "em-nav-item--active" : ""}`}
                  style={activeFolder === f.id ? { background: `${f.color}22`, color: f.color } : {}}
                >
                  <span>{f.icon} {f.name}</span>
                </button>
                <button
                  onClick={() => { setEditingFolder(f); setFolderModalOpen(true); }}
                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-slate-400 px-1 transition-all text-xs"
                  title="Bearbeiten"
                >✏️</button>
              </div>
            ))}
            <button onClick={() => { setEditingFolder(null); setFolderModalOpen(true); }}
              className="em-nav-item" style={{ color: "var(--nill-text-dim)", marginTop: "4px" }}>
              <span>+ Ordner</span>
            </button>
          </nav>

          <div className="em-sidebar-foot">
            <span className="em-provider" title={allProviders.find(p => p.key === provider)?.label}>
              {allProviders.find(p => p.key === provider)?.label ?? provider}
            </span>
            <button onClick={handleDisconnect} className="em-disconnect">Trennen</button>
          </div>
        </aside>

        {/* ── Liste ── */}
        <div className={`em-list-col ${activeEmail ? "em-list-col--pushed" : ""}`}>
          <div className="em-list-header">
            <span className="em-list-title">
              {activeFolder
                ? (folders.find(f => f.id === activeFolder)?.icon + " " + folders.find(f => f.id === activeFolder)?.name)
                : mailbox === "inbox" ? "Posteingang" : "Gesendet"}
            </span>
            <button onClick={loadEmails} disabled={loading} title="Aktualisieren"
              className={`em-refresh ${loading ? "em-refresh--spin" : ""}`}>
              {IC.refresh}
            </button>
          </div>

          {/* Suche */}
          <div className="em-search-bar">
            <span className="em-search-icon">{searching ? <Spinner sm /> : IC.search}</span>
            <input type="text" value={search}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Suche in allen E-Mails…"
              className="em-search-input" />
            {search && <button onClick={() => { setSearch(""); setSearchResults(null); }} className="em-search-clear">{IC.close}</button>}
          </div>

          {/* Filter */}
          <div className="em-filter-bar">
            <button onClick={() => setFilterOpen(o => !o)}
              className={`em-filter-toggle ${activeFilter !== "all" ? "em-filter-toggle--active" : ""}`}>
              {IC.filter}
              <span>{activeFilter !== "all" ? filterLabel : "Filter"}</span>
              {activeFilter !== "all" && (
                <span className="em-filter-clear"
                  onClick={e => { e.stopPropagation(); setActiveFilter("all"); setFilterOpen(false); }}>
                  {IC.close}
                </span>
              )}
            </button>
            {filterOpen && (
              <div className="em-filter-dropdown">
                {FILTERS.filter(f => aiEnabled || f.key !== "withAI").map(f => (
                  <button key={f.key} onClick={() => { setActiveFilter(f.key); setFilterOpen(false); }}
                    className={`em-filter-option ${activeFilter === f.key ? "em-filter-option--active" : ""}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ergebnis-Info */}
          {(isSearching || activeFilter !== "all") && !loading && (
            <p className="em-result-info">
              {displayEmails.length} Ergebnis{displayEmails.length !== 1 ? "se" : ""}
              {isSearching && <> für „<strong>{search}</strong>"</>}
              {activeFilter !== "all" && <> · {filterLabel}</>}
              {isSearching && searchResults !== null && !searching && (
                <span className="em-result-scope"> (inkl. älterer E-Mails)</span>
              )}
            </p>
          )}

          {/* Liste */}
          <ul className="em-list">
            {error && <li className="em-state em-state--error">{error}</li>}
            {!error && loading && emails.length === 0 && <li className="em-state"><Spinner sm /></li>}
            {!error && !loading && displayEmails.length === 0 && (
              <li className="em-state em-state--empty">
                {isSearching ? "Keine Treffer." : activeFilter !== "all" ? "Keine Treffer." : "Keine E-Mails."}
              </li>
            )}
            {displayEmails.map((mail) => (
              <EmailListItem
                key={mail.id}
                id={mail.id}
                isActive={activeEmailId === mail.id}
                isUnread={!mail.read}
                senderName={mail._senderName}
                subject={mail.subject}
                category={mail.category}
                priority={mail.priority}
                dateStr={mail._dateStr}
                onOpen={handleOpen}
                aiEnabled={aiEnabled}
              />
            ))}
            {canLoadMore && (
              <li className="em-load-more">
                <button onClick={loadMore} disabled={loadingMore} className="em-load-more-btn">
                  {loadingMore ? <><Spinner sm /> Lädt…</> : <>{IC.more} Weitere E-Mails laden</>}
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* ── Detail ── */}
        <div className={`em-detail-col ${activeEmail ? "em-detail-col--open" : ""}`}>
          <EmailDetail email={activeEmail} onClose={handleClose} onReply={handleReply} aiEnabled={aiEnabled} />
        </div>
      </div>

      {/* Provider-aware Modals */}
      <ReplyModal emailId={activeEmail?.id} open={replyOpen} onClose={() => setReplyOpen(false)} />
      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />

      <SmartFolderModal
        open={folderModalOpen}
        folder={editingFolder}
        onClose={() => setFolderModalOpen(false)}
        onSave={async (data) => {
          if (editingFolder) {
            await api.patch(`/gmail/folders/${editingFolder.id}`, data);
          } else {
            await api.post("/gmail/folders", data);
          }
          const r = await api.get("/gmail/folders");
          setFolders(r.data?.folders || []);
          setFolderModalOpen(false);
        }}
        onDelete={async (id) => {
          await api.delete(`/gmail/folders/${id}`);
          const r = await api.get("/gmail/folders");
          setFolders(r.data?.folders || []);
          if (activeFolder === id) setActiveFolder(null);
          setFolderModalOpen(false);
        }}
      />
    </>
  );
}
