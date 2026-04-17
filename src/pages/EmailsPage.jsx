import { useContext, useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MailContext } from "../context/MailContext";
import SafeEmailHtml from "../components/SafeEmailHtml";
import EmailReplyModal from "../components/EmailReplyModal";
import EmailComposeModal from "../components/EmailComposeModal";

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

const PRIORITY_CFG = {
  high:   { label: "Dringend",  cls: "em-priority--high",   dot: "em-dot--high" },
  medium: { label: "Normal",    cls: "em-priority--medium", dot: "em-dot--medium" },
  low:    { label: "Niedrig",   cls: "em-priority--low",    dot: "em-dot--low" },
};

const SENTIMENT_CFG = {
  positive: { label: "Positiv",  cls: "em-sentiment--pos" },
  neutral:  { label: "Neutral",  cls: "em-sentiment--neu" },
  negative: { label: "Negativ",  cls: "em-sentiment--neg" },
};

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
    weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function Avatar({ name }) {
  const letter = (name || "?")[0].toUpperCase();
  const hue = [...(name || "")].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return <div style={{ background: `hsl(${hue},35%,32%)` }} className="em-avatar">{letter}</div>;
}
function Spinner({ sm }) {
  return <div className={sm ? "em-spinner em-spinner--sm" : "em-spinner"} />;
}

// ── KI-Panel ──────────────────────────────────────────────────────────────────
function AiPanel({ email }) {
  const status = email.ai_status;

  if (status === "pending" || status === "processing") {
    return (
      <div className="em-ai-panel em-ai-panel--loading">
        <Spinner sm />
        <span>{status === "processing" ? "KI analysiert…" : "Warte auf Analyse…"}</span>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="em-ai-panel em-ai-panel--failed">
        <span className="em-ai-failed-label">KI-Analyse fehlgeschlagen</span>
      </div>
    );
  }

  if (status !== "success") return null;

  const prio = PRIORITY_CFG[email.priority] || PRIORITY_CFG.medium;
  const sent = SENTIMENT_CFG[email.sentiment] || SENTIMENT_CFG.neutral;

  return (
    <div className="em-ai-panel">
      <div className="em-ai-header">
        <span className="em-ai-title">KI Analyse</span>
        <div className="em-ai-badges">
          <span className={`em-priority ${prio.cls}`}>
            {IC.bolt} {prio.label}
          </span>
          <span className={`em-sentiment ${sent.cls}`}>
            {IC.smile} {sent.label}
          </span>
          {email.category && (
            <span className="em-category">
              {IC.tag} {email.category}
            </span>
          )}
        </div>
      </div>

      {email.summary && (
        <p className="em-ai-summary">{email.summary}</p>
      )}

      {email.action_items?.length > 0 && (
        <div className="em-ai-section">
          <p className="em-ai-section-label">Handlungsbedarf</p>
          <ul className="em-ai-actions">
            {email.action_items.map((item, i) => (
              <li key={i} className="em-ai-action-item">
                <span className="em-ai-action-icon">{IC.check}</span>
                {item}
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
}

// ── Haupt-Komponente ──────────────────────────────────────────────────────────
export default function EmailsPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { provider, connected, activeEmail, fetchEmails, openEmail, closeEmail, initializing, disconnectProvider } = useContext(MailContext);

  const [mailbox, setMailbox]           = useState("inbox");
  const [replyOpen, setReplyOpen]       = useState(false);
  const [composeOpen, setComposeOpen]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [emails, setEmails]             = useState([]);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterOpen, setFilterOpen]     = useState(false);

  const pollingRef     = useRef(null);
  const activeEmailRef = useRef(null);

  useEffect(() => { activeEmailRef.current = activeEmail; }, [activeEmail]);
  useEffect(() => { if (!user) navigate("/login", { replace: true }); }, [user, navigate]);

  const loadEmails = useCallback(async () => {
    if (!connected) return;
    setLoading(true); setError(null);
    try {
      const f = (await fetchEmails(mailbox)) ?? [];
      setEmails([...f].sort((a, b) => new Date(b.received_at || b.date || 0) - new Date(a.received_at || a.date || 0)));
    } catch { setError("Laden fehlgeschlagen."); }
    finally { setLoading(false); }
  }, [connected, mailbox, fetchEmails]);

  useEffect(() => { if (connected && !initializing) loadEmails(); }, [connected, mailbox, initializing]);

  const displayEmails = useMemo(() => {
    const now = new Date(), sow = new Date(now);
    sow.setDate(now.getDate() - now.getDay());
    return emails.filter((mail) => {
      if (search.trim()) {
        const q = search.toLowerCase(), s = extractSender(mail);
        if (!(mail.subject || "").toLowerCase().includes(q) &&
            !s.name.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q))
          return false;
      }
      switch (activeFilter) {
        case "unread":  return !mail.read;
        case "read":    return  mail.read;
        case "high":    return  mail.priority === "high";
        case "today":   return new Date(mail.received_at || 0).toDateString() === now.toDateString();
        case "week":    return new Date(mail.received_at || 0) >= sow;
        case "withAI":  return ["success","done"].includes(mail.ai_status);
        default:        return true;
      }
    });
  }, [emails, search, activeFilter]);

  const unreadCount = useMemo(() => emails.filter(m => !m.read && m.mailbox !== "sent").length, [emails]);

  const stopPolling  = () => { clearInterval(pollingRef.current); pollingRef.current = null; };
  const startPolling = (id) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const u = await openEmail(id);
        if (["done","success","failed"].includes(u?.ai_status) || !activeEmailRef.current) stopPolling();
      } catch { stopPolling(); }
    }, 2500);
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

  return (
    <>
      <div className="em-shell">

        {/* ── Sidebar ── */}
        <aside className="em-sidebar">
          <a href="/dashboard" className="em-logo">
            <span className="em-logo-mark">N</span>
            <span className="em-logo-label">NILL</span>
          </a>

          <button onClick={() => setComposeOpen(true)} className="em-compose">
            {IC.compose} Verfassen
          </button>

          <nav className="em-nav">
            {[
              { key: "inbox", label: "Posteingang", badge: unreadCount },
              { key: "sent",  label: "Gesendet" },
            ].map(({ key, label, badge }) => (
              <button key={key}
                onClick={() => { setMailbox(key); setSearch(""); setActiveFilter("all"); handleClose(); }}
                className={`em-nav-item ${mailbox === key ? "em-nav-item--active" : ""}`}>
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

        {/* ── Liste ── */}
        <div className={`em-list-col ${activeEmail ? "em-list-col--pushed" : ""}`}>
          <div className="em-list-header">
            <span className="em-list-title">{mailbox === "inbox" ? "Posteingang" : "Gesendet"}</span>
            <button onClick={loadEmails} disabled={loading} title="Aktualisieren"
              className={`em-refresh ${loading ? "em-refresh--spin" : ""}`}>
              {IC.refresh}
            </button>
          </div>

          <div className="em-search-bar">
            <span className="em-search-icon">{IC.search}</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Betreff oder Absender…" className="em-search-input" />
            {search && <button onClick={() => setSearch("")} className="em-search-clear">{IC.close}</button>}
          </div>

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
                {FILTERS.map(f => (
                  <button key={f.key} onClick={() => { setActiveFilter(f.key); setFilterOpen(false); }}
                    className={`em-filter-option ${activeFilter === f.key ? "em-filter-option--active" : ""}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(search || activeFilter !== "all") && !loading && (
            <p className="em-result-info">
              {displayEmails.length} Ergebnis{displayEmails.length !== 1 ? "se" : ""}
              {search && <> für „<strong>{search}</strong>"</>}
              {activeFilter !== "all" && <> · {filterLabel}</>}
            </p>
          )}

          <ul className="em-list">
            {error   && <li className="em-state em-state--error">{error}</li>}
            {!error && loading && emails.length === 0 && <li className="em-state"><Spinner sm /></li>}
            {!error && !loading && displayEmails.length === 0 && (
              <li className="em-state em-state--empty">
                {search || activeFilter !== "all" ? "Keine Treffer." : "Keine E-Mails."}
              </li>
            )}
            {displayEmails.map((mail) => {
              const s    = extractSender(mail);
              const prio = PRIORITY_CFG[mail.priority];
              return (
                <li key={mail.id} onClick={() => handleOpen(mail.id)}
                  className={`em-item ${activeEmail?.id === mail.id ? "em-item--active" : ""} ${!mail.read ? "em-item--unread" : ""}`}>
                  <Avatar name={s.name} />
                  <div className="em-item-body">
                    <div className="em-item-top">
                      <span className="em-item-sender">{s.name}</span>
                      <div className="em-item-top-right">
                        {prio && <span className={`em-dot ${prio.dot}`} title={prio.label} />}
                        <span className="em-item-date">{formatDateShort(mail.received_at || mail.date)}</span>
                      </div>
                    </div>
                    <p className="em-item-subject">{mail.subject || "(Kein Betreff)"}</p>
                    {mail.category && (
                      <span className="em-item-category">{mail.category}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Detail ── */}
        <div className={`em-detail-col ${activeEmail ? "em-detail-col--open" : ""}`}>
          {!activeEmail ? (
            <div className="em-detail-empty">Wähle eine E-Mail aus</div>
          ) : (
            <div className="em-detail">
              <div className="em-detail-topbar">
                <button onClick={handleClose} className="em-back">{IC.back} Zurück</button>
              </div>

              <div className="em-detail-inner">
                <h2 className="em-detail-subject">{activeEmail.subject || "(Kein Betreff)"}</h2>

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
                        <span className="em-detail-meta-date">{formatDateLong(activeEmail.received_at)}</span>
                      </>
                    );
                  })()}
                </div>

                {/* KI-Panel — über dem Body */}
                <AiPanel email={activeEmail} />

                <div className="em-detail-body">
                  <SafeEmailHtml html={activeEmail.body ?? ""} />
                </div>

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
