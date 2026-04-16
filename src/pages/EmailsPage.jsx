import { useContext, useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MailContext } from "../context/MailContext";
import SafeEmailHtml from "../components/SafeEmailHtml";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IC = {
  refresh: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
  compose: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  back: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  reply: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  filter: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  close: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

// ─── Filter-Optionen ──────────────────────────────────────────────────────────
const FILTERS = [
  { key: "all",      label: "Alle" },
  { key: "unread",   label: "Ungelesen" },
  { key: "read",     label: "Gelesen" },
  { key: "today",    label: "Heute" },
  { key: "week",     label: "Diese Woche" },
  { key: "withAI",   label: "KI analysiert" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function extractSender(mail) {
  const raw = mail.from_address || mail.from || mail.from_raw || "";
  const nameMatch  = raw.match(/^(.+?)\s*<.+>$/);
  const emailMatch = raw.match(/<(.+?)>/);
  const name  = nameMatch ? nameMatch[1].replace(/"/g, "").trim() : raw;
  const email = emailMatch ? emailMatch[1] : raw;
  return { name: name || email, email };
}

function formatDateShort(str) {
  if (!str) return "";
  const d = new Date(str), now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  if (d.getFullYear() === now.getFullYear())
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
  return d.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateLong(str) {
  if (!str) return "";
  return new Date(str).toLocaleString("de-DE", {
    weekday: "long", day: "numeric", month: "long",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function Avatar({ name }) {
  const letter = (name || "?")[0].toUpperCase();
  const hue = [...(name || "")].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      style={{ background: `hsl(${hue},35%,32%)` }}
      className="em-avatar"
    >
      {letter}
    </div>
  );
}

function Spinner({ sm }) {
  return (
    <div className={sm ? "em-spinner em-spinner--sm" : "em-spinner"} />
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────
export default function EmailsPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    provider, connected, activeEmail,
    fetchEmails, openEmail, closeEmail,
    initializing, disconnectProvider,
  } = useContext(MailContext);

  const [mailbox, setMailbox]         = useState("inbox");
  const [replyOpen, setReplyOpen]     = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [emails, setEmails]           = useState([]);
  const [error, setError]             = useState(null);

  // Suche & Filter
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterOpen, setFilterOpen]   = useState(false);
  const searchRef                     = useRef(null);

  const pollingRef      = useRef(null);
  const activeEmailRef  = useRef(null);

  useEffect(() => { activeEmailRef.current = activeEmail; }, [activeEmail]);
  useEffect(() => { if (!user) navigate("/login", { replace: true }); }, [user, navigate]);

  // ── Laden ────────────────────────────────────────────────────────────────────
  const loadEmails = useCallback(async () => {
    if (!connected) return;
    setLoading(true); setError(null);
    try {
      const f = (await fetchEmails(mailbox)) ?? [];
      setEmails([...f].sort((a, b) =>
        new Date(b.received_at || b.date || 0) - new Date(a.received_at || a.date || 0)
      ));
    } catch { setError("Laden fehlgeschlagen."); }
    finally { setLoading(false); }
  }, [connected, mailbox, fetchEmails]);

  useEffect(() => {
    if (connected && !initializing) loadEmails();
  }, [connected, mailbox, initializing]);

  // ── Suche + Filter (client-side) ─────────────────────────────────────────────
  const displayEmails = useMemo(() => {
    const now  = new Date();
    const sow  = new Date(now); sow.setDate(now.getDate() - now.getDay());

    return emails.filter((mail) => {
      // Suche
      if (search.trim()) {
        const q = search.toLowerCase();
        const s = extractSender(mail);
        const inSubject = (mail.subject || "").toLowerCase().includes(q);
        const inSender  = s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
        if (!inSubject && !inSender) return false;
      }

      // Filter
      switch (activeFilter) {
        case "unread":  return !mail.read;
        case "read":    return  mail.read;
        case "today": {
          const d = new Date(mail.received_at || mail.date || 0);
          return d.toDateString() === now.toDateString();
        }
        case "week": {
          const d = new Date(mail.received_at || mail.date || 0);
          return d >= sow;
        }
        case "withAI":  return ["done","success"].includes(mail.ai_status);
        default:        return true;
      }
    });
  }, [emails, search, activeFilter]);

  const unreadCount = useMemo(() =>
    emails.filter(m => !m.read && m.mailbox !== "sent").length,
    [emails]
  );

  // ── Polling ───────────────────────────────────────────────────────────────────
  const stopPolling  = () => { clearInterval(pollingRef.current); pollingRef.current = null; };
  const startPolling = (id) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const u = await openEmail(id);
        if (u?.ai_status === "done" || u?.ai_status === "success" || !activeEmailRef.current)
          stopPolling();
      } catch { stopPolling(); }
    }, 3000);
  };
  useEffect(() => () => stopPolling(), []);

  const handleOpen  = async (id) => {
    if (!id || activeEmailRef.current?.id === id) return;
    stopPolling(); await openEmail(id); startPolling(id);
  };
  const handleClose = () => { stopPolling(); setTimeout(closeEmail, 30); };
  const handleDisconnect = async () => {
    if (!window.confirm(`${provider} wirklich trennen?`)) return;
    await disconnectProvider?.();
  };

  // ── Loading / disconnected ────────────────────────────────────────────────────
  if (initializing) return (
    <div className="em-shell em-shell--center">
      <Spinner /><p className="em-center-label">Prüfe Verbindung…</p>
    </div>
  );
  if (!connected) return (
    <div className="em-shell em-shell--center">
      <p className="em-center-label">Kein E-Mail-Konto verbunden.</p>
    </div>
  );

  const filterLabel = FILTERS.find(f => f.key === activeFilter)?.label;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="em-shell">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className="em-sidebar">
          <button onClick={() => setComposeOpen(true)} className="em-compose">
            {IC.compose} Verfassen
          </button>

          <nav className="em-nav">
            {[
              { key: "inbox", label: "Posteingang", badge: unreadCount },
              { key: "sent",  label: "Gesendet" },
            ].map(({ key, label, badge }) => (
              <button
                key={key}
                onClick={() => { setMailbox(key); setSearch(""); setActiveFilter("all"); handleClose(); }}
                className={`em-nav-item ${mailbox === key ? "em-nav-item--active" : ""}`}
              >
                <span>{label}</span>
                {badge > 0 && <span className="em-badge">{badge}</span>}
              </button>
            ))}
          </nav>

          <div className="em-sidebar-foot">
            <span className="em-provider">{provider}</span>
            <button onClick={handleDisconnect} className="em-disconnect">Trennen</button>
          </div>
        </aside>

        {/* ── Liste ───────────────────────────────────────────────────────── */}
        <div className={`em-list-col ${activeEmail ? "em-list-col--pushed" : ""}`}>

          {/* Toolbar: Titel + Refresh */}
          <div className="em-list-header">
            <span className="em-list-title">
              {mailbox === "inbox" ? "Posteingang" : "Gesendet"}
            </span>
            <button
              onClick={loadEmails}
              disabled={loading}
              title="Aktualisieren"
              className={`em-refresh ${loading ? "em-refresh--spin" : ""}`}
            >
              {IC.refresh}
            </button>
          </div>

          {/* Suchleiste */}
          <div className="em-search-bar">
            <span className="em-search-icon">{IC.search}</span>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Betreff oder Absender suchen…"
              className="em-search-input"
            />
            {search && (
              <button onClick={() => setSearch("")} className="em-search-clear">
                {IC.close}
              </button>
            )}
          </div>

          {/* Filterleiste */}
          <div className="em-filter-bar">
            <button
              onClick={() => setFilterOpen(o => !o)}
              className={`em-filter-toggle ${activeFilter !== "all" ? "em-filter-toggle--active" : ""}`}
            >
              {IC.filter}
              <span>{activeFilter !== "all" ? filterLabel : "Filter"}</span>
              {activeFilter !== "all" && (
                <span
                  className="em-filter-clear"
                  onClick={e => { e.stopPropagation(); setActiveFilter("all"); setFilterOpen(false); }}
                >
                  {IC.close}
                </span>
              )}
            </button>

            {filterOpen && (
              <div className="em-filter-dropdown">
                {FILTERS.map(f => (
                  <button
                    key={f.key}
                    onClick={() => { setActiveFilter(f.key); setFilterOpen(false); }}
                    className={`em-filter-option ${activeFilter === f.key ? "em-filter-option--active" : ""}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ergebnis-Info */}
          {(search || activeFilter !== "all") && !loading && (
            <p className="em-result-info">
              {displayEmails.length} Ergebnis{displayEmails.length !== 1 ? "se" : ""}
              {search && <> für „<strong>{search}</strong>"</>}
              {activeFilter !== "all" && <> · {filterLabel}</>}
            </p>
          )}

          {/* Email-Liste */}
          <ul className="em-list">
            {error && <li className="em-state em-state--error">{error}</li>}
            {!error && loading && emails.length === 0 && (
              <li className="em-state"><Spinner sm /></li>
            )}
            {!error && !loading && displayEmails.length === 0 && (
              <li className="em-state em-state--empty">
                {search || activeFilter !== "all" ? "Keine Treffer." : "Keine E-Mails."}
              </li>
            )}
            {displayEmails.map((mail) => {
              const s = extractSender(mail);
              return (
                <li
                  key={mail.id}
                  onClick={() => handleOpen(mail.id)}
                  className={`em-item ${activeEmail?.id === mail.id ? "em-item--active" : ""} ${!mail.read ? "em-item--unread" : ""}`}
                >
                  <Avatar name={s.name} />
                  <div className="em-item-body">
                    <div className="em-item-top">
                      <span className="em-item-sender">{s.name}</span>
                      <span className="em-item-date">{formatDateShort(mail.received_at || mail.date)}</span>
                    </div>
                    <p className="em-item-subject">{mail.subject || "(Kein Betreff)"}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Detail ──────────────────────────────────────────────────────── */}
        <div className={`em-detail-col ${activeEmail ? "em-detail-col--open" : ""}`}>
          {!activeEmail ? (
            <div className="em-detail-empty">Wähle eine E-Mail aus</div>
          ) : (
            <div className="em-detail">
              <div className="em-detail-topbar">
                <button onClick={handleClose} className="em-back">
                  {IC.back} Zurück
                </button>
              </div>

              <div className="em-detail-inner">
                <h2 className="em-detail-subject">
                  {activeEmail.subject || "(Kein Betreff)"}
                </h2>

                <div className="em-detail-meta">
                  {(() => {
                    const s = extractSender(activeEmail);
                    return (
                      <>
                        <Avatar name={s.name} />
                        <div className="em-detail-meta-info">
                          <span className="em-detail-meta-name">{s.name}</span>
                          <span className="em-detail-meta-email">&lt;{s.email}&gt;</span>
                        </div>
                        <span className="em-detail-meta-date">
                          {formatDateLong(activeEmail.received_at)}
                        </span>
                      </>
                    );
                  })()}
                </div>

                <div className="em-detail-body">
                  <SafeEmailHtml html={activeEmail.body ?? ""} />
                </div>

                {activeEmail.ai_status === "pending" && (
                  <div className="em-ai-pending">
                    <Spinner sm /><span>Analyse läuft…</span>
                  </div>
                )}

                {["done","success"].includes(activeEmail.ai_status) && activeEmail.summary && (
                  <div className="em-ai-box">
                    <p className="em-ai-label">KI Zusammenfassung</p>
                    <p className="em-ai-text">{activeEmail.summary}</p>
                  </div>
                )}

                <div className="em-detail-actions">
                  <button onClick={() => setReplyOpen(true)} className="em-reply-btn">
                    {IC.reply} Antworten
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <EmailReplyModal emailId={activeEmail?.id} open={replyOpen} onClose={() => setReplyOpen(false)} />
      <EmailComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />
    </>
  );
}
