import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import CalendarWrapper from "../components/Calendar/CalendarWrapper";
import EventList from "../components/Calendar/EventList";
import EventModal from "../components/Calendar/EventModal";
import CreateEventModal from "../components/Calendar/CreateEventModal";
import api from "../services/api";
import { AnimatePresence, motion } from "framer-motion";

/* ─── kleine Hilfs-Komponenten ─────────────────────────── */

function Spinner() {
  return (
    <div
      style={{
        width: 22, height: 22,
        border: "2px solid rgba(var(--tint),0.08)",
        borderTopColor: "var(--nill-gold)",
        borderRadius: "50%",
        animation: "em-spin 0.75s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

function StatChip({ label, value, accent }) {
  return (
    <div className="kal-stat" style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0.65rem 1.25rem",
      background: accent
        ? "rgba(197,165,114,0.07)"
        : "rgba(var(--tint),0.03)",
      border: `1px solid ${accent ? "rgba(197,165,114,0.18)" : "rgba(var(--tint),0.07)"}`,
      borderRadius: 12,
      gap: 2,
      minWidth: 80,
    }}>
      <span className="kal-stat-val" style={{
        fontSize: "1.35rem", fontWeight: 800,
        color: accent ? "var(--nill-gold)" : "var(--nill-text)",
        lineHeight: 1.1,
      }}>{value}</span>
      <span className="kal-stat-label" style={{
        fontSize: "0.68rem", color: "var(--nill-text-mute)",
        textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600,
      }}>{label}</span>
    </div>
  );
}

function Panel({ children, style = {}, className = "" }) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(var(--tint),0.025)",
        border: "1px solid var(--nill-border)",
        borderRadius: 14,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PanelHeader({ title, badge }) {
  return (
    <div className="kal-panel-head" style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.85rem 1.25rem 0.7rem",
      borderBottom: "1px solid var(--nill-border)",
    }}>
      <span style={{
        fontSize: "0.68rem", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.09em",
        color: "var(--nill-text-mute)",
      }}>{title}</span>
      {badge != null && (
        <span style={{
          fontSize: "0.68rem", fontWeight: 700,
          background: "var(--nill-blue-dim)",
          border: "1px solid var(--nill-blue-glow)",
          color: "#93c5fd",
          padding: "1px 8px", borderRadius: 10, lineHeight: 1.6,
        }}>{badge}</span>
      )}
    </div>
  );
}

/* ─── Mobile-Agenda-Helfer (nur ≤768px sichtbar) ────────── */

function fmtClock(d) {
  try {
    return new Date(d).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function agendaDayLabel(key) {
  const d = new Date(key);
  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return "Heute";
  if (d.toDateString() === tomorrow.toDateString()) return "Morgen";
  return d.toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "short" });
}

/* ─── Haupt-Seite ───────────────────────────────────────── */

export default function CalendarPage() {
  const [events, setEvents]           = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalEvent, setModalEvent]   = useState(null);
  const [createOpen, setCreateOpen]   = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(false);
  // Mobile-only view switcher (Monat | Agenda) — has no effect on desktop,
  // where the chip row is display:none and both views render side by side.
  const [mobileView, setMobileView]   = useState("monat");

  useEffect(() => { fetchEvents(); }, []);

  async function handleDelete(event) {
    try {
      await api.delete(`/calendar/events/${event.id}`);
      fetchEvents();
    } catch (e) { console.error(e); }
  }

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await api.get("/calendar/events/upcoming", { params: { days: 90 } });
      const safeData = Array.isArray(res.data) ? res.data : [];
      const normalized = safeData.map((e) => ({
        ...e,
        start: e.start_at ? new Date(e.start_at) : null,
        end:   e.end_at   ? new Date(e.end_at)   : null,
      }));
      setEvents(normalized);
      setError(false);
    } catch (err) {
      console.error("Calendar fetch error:", err);
      setEvents([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const isSameDay = (d1, d2) =>
    d1 && d2 && new Date(d1).toDateString() === new Date(d2).toDateString();

  const now   = new Date();
  const next7 = new Date(); next7.setDate(now.getDate() + 7);

  const eventsNext7Days = events
    .filter((e) => e?.start && e.start >= now && e.start <= next7)
    .sort((a, b) => a.start - b.start);

  const eventsForDay = events.filter(
    (e) => e?.start && isSameDay(e.start, selectedDate)
  );

  const todayEvents = events.filter(
    (e) => e?.start && isSameDay(e.start, now)
  );

  const selectedLabel = selectedDate.toLocaleDateString("de-DE", {
    weekday: "long", day: "2-digit", month: "long",
  });

  // Mobile agenda: alle anstehenden Termine (ab heute 0:00), nach Tag gruppiert
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
  const agendaGroups = [];
  events
    .filter((e) => e?.start && e.start >= startOfToday)
    .sort((a, b) => a.start - b.start)
    .forEach((e) => {
      const key = e.start.toDateString();
      const group = agendaGroups[agendaGroups.length - 1];
      if (group && group.key === key) group.items.push(e);
      else agendaGroups.push({ key, items: [e] });
    });

  return (
    <PageLayout>
      <style>{`
        @media (max-width: 860px) {
          .kal-grid { grid-template-columns: 1fr !important; grid-template-rows: auto !important; }
          .kal-cal  { grid-column: auto !important; grid-row: auto !important; }
          .kal-panel{ grid-column: auto !important; grid-row: auto !important; }
          .kal-h1   { font-size: 1.4rem !important; }
        }

        /* Mobile-only chrome — new elements, invisible on desktop */
        .kal-m-chips, .kal-m-agenda, .kal-fab { display: none; }

        /* ── Mobile ≤768px — native calendar app feel ─────────────
           Desktop rendering stays byte-identical: every rule below is
           media-scoped or targets mobile-only elements. */
        @media (max-width: 768px) {

          /* Header: one calm serif title row, no breadcrumb/toolbar */
          .kal-crumb   { display: none !important; }
          .kal-head    { margin-bottom: 1rem !important; gap: 0.75rem !important; }
          .kal-h1      { font-family: "Fraunces", Georgia, serif !important; font-weight: 400 !important;
                         font-size: 1.9rem !important; letter-spacing: -0.02em !important; }
          .kal-sub     { font-size: 0.78rem !important; }
          .kal-new-btn { display: none !important; } /* ersetzt durch .kal-fab */

          /* Stats: compact full-width 3-up tiles */
          .kal-actions    { width: 100%; gap: 0.5rem !important; }
          .kal-stat       { flex: 1 !important; min-width: 0 !important; padding: 0.55rem 0.4rem !important; }
          .kal-stat-val   { font-size: 1.2rem !important; }
          .kal-stat-label { font-size: 0.58rem !important; }

          /* View switcher: horizontal chip row (Monat | Agenda | Heute) */
          .kal-m-chips {
            display: flex; gap: 0.45rem; margin: 0 0 1rem;
            overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none;
          }
          .kal-m-chips::-webkit-scrollbar { display: none; }
          .kal-m-chip {
            flex-shrink: 0; min-height: 44px; padding: 0.45rem 1.15rem;
            font-size: 0.85rem; font-weight: 500;
            color: var(--nill-text-sub); background: var(--nill-panel);
            border: 1px solid var(--nill-border); border-radius: 22px;
            cursor: pointer; white-space: nowrap;
            touch-action: manipulation; -webkit-tap-highlight-color: transparent; user-select: none;
            transition: background 0.12s, color 0.12s, border-color 0.12s;
          }
          .kal-m-chip:active { background: var(--nill-panel-hov); }
          .kal-m-chip--active {
            background: var(--nill-gold-dim);
            border-color: rgba(197,165,114,0.4);
            color: var(--nill-gold); font-weight: 600;
          }

          /* Grid: one natural column, one document scroll */
          .kal-grid { gap: 1rem !important; }
          .kal-week-panel { display: none !important; } /* Agenda-Ansicht ersetzt "Nächste 7 Tage" */
          .kal-grid--m-agenda .kal-cal,
          .kal-grid--m-agenda .kal-day-panel { display: none !important; }
          .kal-grid--m-agenda .kal-m-agenda { display: flex; flex-direction: column; gap: 1.15rem; }

          /* Month view: strip desktop panel chrome → full-width native grid */
          .kal-cal, .kal-day-panel {
            background: transparent !important; border: none !important;
            border-radius: 0 !important;
            backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
          }
          .kal-cal .kal-panel-head { display: none !important; }
          .kal-cal-pad { padding: 0 !important; }
          .kal-day-panel .kal-panel-head { padding: 0 0 0.55rem !important; border-bottom: none !important; }
          .kal-panel-body { padding: 0 !important; overflow: visible !important; }

          /* Agenda: tappable event cards grouped by day */
          .kal-m-day-label {
            font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.09em; color: var(--nill-text-mute); margin: 0 0 0.5rem;
          }
          .kal-m-cards { display: flex; flex-direction: column; gap: 0.5rem; }
          .kal-m-card {
            display: flex; align-items: center; gap: 0.85rem;
            width: 100%; min-height: 64px; text-align: left;
            background: rgba(var(--tint),0.03);
            border: 1px solid var(--nill-border); border-radius: 14px;
            padding: 0.8rem 0.95rem; cursor: pointer; color: inherit;
            touch-action: manipulation; -webkit-tap-highlight-color: transparent; user-select: none;
            transition: background 0.12s;
            content-visibility: auto; contain-intrinsic-size: auto 64px;
          }
          .kal-m-card:active { background: var(--nill-panel-hov); }
          .kal-m-time { display: flex; flex-direction: column; align-items: center; gap: 1px; min-width: 3.2rem; flex-shrink: 0; }
          .kal-m-time-start { font-size: 0.85rem; font-weight: 700; color: var(--nill-gold); }
          .kal-m-time-end   { font-size: 0.7rem; color: var(--nill-text-dim); }
          .kal-m-time-all   { font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
                              letter-spacing: 0.05em; color: var(--nill-gold); text-align: center; }
          .kal-m-card-body  { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
          .kal-m-card-title { font-size: 0.95rem; font-weight: 600; color: var(--nill-text);
                              white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .kal-m-card-loc   { font-size: 0.75rem; color: var(--nill-text-mute);
                              white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .kal-m-chevron    { font-size: 1.15rem; color: var(--nill-text-dim); flex-shrink: 0; }
          .kal-m-empty      { font-size: 0.82rem; color: var(--nill-text-dim); margin: 0.5rem 0 0; }

          /* Floating create action, clear of the 62px bottom tab bar */
          .kal-fab {
            display: flex; align-items: center; justify-content: center;
            position: fixed; right: 18px;
            bottom: calc(62px + env(safe-area-inset-bottom, 0) + 12px);
            z-index: 210; /* über der Tab-Bar (200), unter den Sheets (400) */
            width: 56px; height: 56px; border-radius: 50%; border: none;
            background: var(--nill-gold); color: #1a1206;
            box-shadow: 0 6px 20px rgba(197,165,114,0.45), 0 2px 8px rgba(0,0,0,0.35);
            cursor: pointer;
            touch-action: manipulation; -webkit-tap-highlight-color: transparent;
            transition: transform 0.12s, box-shadow 0.12s;
          }
          .kal-fab:active { transform: scale(0.93); }
        }

        @media (max-width: 420px) {
          .kal-h1     { font-size: 1.7rem !important; }
          .kal-stat   { padding: 0.5rem 0.3rem !important; }
          .kal-m-card { padding: 0.7rem 0.85rem; }
          .kal-fab    { width: 52px; height: 52px; right: 16px; }
        }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────── */}
      <div className="kal-head" style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>

          {/* Breadcrumb */}
          <span className="kal-crumb" style={{
            fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--nill-text-dim)",
          }}>
            Dashboard / Kalender
          </span>

          <h1 className="kal-h1" style={{
            fontSize: "1.85rem", fontWeight: 800, margin: 0, lineHeight: 1.15,
            color: "var(--nill-text)",
            letterSpacing: "-0.01em",
          }}>
            Kalender
          </h1>

          <p className="kal-sub" style={{ margin: 0, fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>
            {loading ? "Lade Termine…" : `${events.length} Termine gesamt`}
          </p>
        </div>

        {/* Stat-Chips + Button */}
        <div className="kal-actions" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {!loading && !error && (
            <>
              <StatChip label="Heute"    value={todayEvents.length}    accent />
              <StatChip label="7 Tage"   value={eventsNext7Days.length} />
              <StatChip label="Gesamt"   value={events.length} />
            </>
          )}

          <button
            className="kal-new-btn"
            onClick={() => setCreateOpen(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              padding: "0.6rem 1.25rem",
              background: "var(--nill-gold-dim)",
              border: "1px solid rgba(197,165,114,0.28)",
              borderRadius: 22, cursor: "pointer",
              color: "var(--nill-gold)", fontSize: "0.82rem", fontWeight: 700,
              letterSpacing: "0.01em",
              transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "var(--nill-gold-glow)";
              e.currentTarget.style.borderColor = "rgba(197,165,114,0.5)";
              e.currentTarget.style.boxShadow = "0 0 14px rgba(197,165,114,0.15)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "var(--nill-gold-dim)";
              e.currentTarget.style.borderColor = "rgba(197,165,114,0.28)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5"  y1="12" x2="19" y2="12" />
            </svg>
            Termin erstellen
          </button>
        </div>
      </div>

      {/* ── MOBILE VIEW SWITCHER (≤768px, sonst display:none) ── */}
      {!loading && !error && (
        <div className="kal-m-chips" role="tablist" aria-label="Kalender-Ansicht">
          <button
            role="tab"
            aria-selected={mobileView === "monat"}
            className={`kal-m-chip${mobileView === "monat" ? " kal-m-chip--active" : ""}`}
            onClick={() => setMobileView("monat")}
          >
            Monat
          </button>
          <button
            role="tab"
            aria-selected={mobileView === "agenda"}
            className={`kal-m-chip${mobileView === "agenda" ? " kal-m-chip--active" : ""}`}
            onClick={() => setMobileView("agenda")}
          >
            Agenda
          </button>
          <button
            className="kal-m-chip"
            onClick={() => { setSelectedDate(new Date()); setMobileView("monat"); }}
          >
            Heute
          </button>
        </div>
      )}

      {/* ── LOADING ─────────────────────────────────────── */}
      {loading && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          padding: "3rem 0", color: "var(--nill-text-mute)", fontSize: "0.82rem",
        }}>
          <Spinner />
          Termine werden geladen…
        </div>
      )}

      {/* ── ERROR ───────────────────────────────────────── */}
      {!loading && error && (
        <div style={{
          padding: "0.9rem 1.25rem", marginBottom: "1.5rem",
          background: "rgba(248,113,113,0.06)",
          border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 12, color: "#f87171", fontSize: "0.82rem",
          display: "flex", alignItems: "center", gap: "0.6rem",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Termine konnten nicht geladen werden.
          <button
            onClick={fetchEvents}
            style={{
              marginLeft: "auto", fontSize: "0.75rem", fontWeight: 600,
              color: "#f87171", background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)", borderRadius: 8,
              padding: "0.25rem 0.75rem", cursor: "pointer",
            }}
          >
            Erneut versuchen
          </button>
        </div>
      )}

      {/* ── CONTENT GRID ────────────────────────────────── */}
      {!loading && !error && (
        <motion.div
          className={`kal-grid${mobileView === "agenda" ? " kal-grid--m-agenda" : ""}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "auto auto",
            gap: "1.25rem",
          }}
        >

          {/* CALENDAR — spans 2 cols, 2 rows */}
          <Panel className="kal-cal" style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }}>
            <PanelHeader title="Monatsansicht" />
            <div className="kal-cal-pad" style={{ padding: "1.1rem" }}>
              <CalendarWrapper
                value={selectedDate}
                onChange={setSelectedDate}
                events={events}
              />
            </div>
          </Panel>

          {/* NEXT 7 DAYS */}
          <Panel className="kal-panel kal-week-panel" style={{ gridColumn: "3 / 4", gridRow: "1 / 2", display: "flex", flexDirection: "column" }}>
            <PanelHeader title="Nächste 7 Tage" badge={eventsNext7Days.length} />
            <div className="kal-panel-body" style={{ padding: "0.85rem 1.1rem", flex: 1, overflowY: "auto" }}>
              {eventsNext7Days.length === 0 ? (
                <p style={{ fontSize: "0.78rem", color: "var(--nill-text-dim)", margin: 0, paddingTop: "0.5rem" }}>
                  Keine anstehenden Termine.
                </p>
              ) : (
                <EventList
                  events={eventsNext7Days}
                  onSelect={(e) => setModalEvent(e)}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </Panel>

          {/* DAY VIEW */}
          <Panel className="kal-panel kal-day-panel" style={{ gridColumn: "3 / 4", gridRow: "2 / 3", display: "flex", flexDirection: "column" }}>
            <PanelHeader
              title={selectedLabel}
              badge={eventsForDay.length > 0 ? eventsForDay.length : undefined}
            />
            <div className="kal-panel-body" style={{ padding: "0.85rem 1.1rem", flex: 1, overflowY: "auto" }}>
              {eventsForDay.length === 0 ? (
                <p style={{ fontSize: "0.78rem", color: "var(--nill-text-dim)", margin: 0, paddingTop: "0.5rem" }}>
                  Keine Termine für diesen Tag.
                </p>
              ) : (
                <EventList
                  events={eventsForDay}
                  onSelect={(e) => setModalEvent(e)}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </Panel>

          {/* MOBILE AGENDA (≤768px + Agenda-Chip, sonst display:none) */}
          <div className="kal-m-agenda">
            {agendaGroups.length === 0 ? (
              <p className="kal-m-empty">Keine anstehenden Termine.</p>
            ) : (
              agendaGroups.map((group) => (
                <div key={group.key}>
                  <p className="kal-m-day-label">{agendaDayLabel(group.key)}</p>
                  <div className="kal-m-cards">
                    {group.items.map((e, i) => (
                      <button
                        key={e.id ?? `${group.key}-${i}`}
                        type="button"
                        className="kal-m-card"
                        onClick={() => setModalEvent(e)}
                      >
                        <span className="kal-m-time">
                          {e.all_day ? (
                            <span className="kal-m-time-all">Ganztägig</span>
                          ) : (
                            <>
                              <span className="kal-m-time-start">{fmtClock(e.start)}</span>
                              {e.end && <span className="kal-m-time-end">{fmtClock(e.end)}</span>}
                            </>
                          )}
                        </span>
                        <span className="kal-m-card-body">
                          <span className="kal-m-card-title">{e.title || "Ohne Titel"}</span>
                          {e.location && <span className="kal-m-card-loc">{e.location}</span>}
                        </span>
                        <span className="kal-m-chevron" aria-hidden="true">›</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

        </motion.div>
      )}

      {/* ── MOBILE FAB — Termin erstellen (≤768px) ──────── */}
      <button
        type="button"
        className="kal-fab"
        aria-label="Termin erstellen"
        onClick={() => setCreateOpen(true)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5"  y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* ── MODALS ──────────────────────────────────────── */}
      <AnimatePresence>
        {modalEvent && (
          <EventModal event={modalEvent} onClose={() => setModalEvent(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {createOpen && (
          <CreateEventModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            onCreated={fetchEvents}
          />
        )}
      </AnimatePresence>

    </PageLayout>
  );
}
