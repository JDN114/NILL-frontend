import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import CalendarWrapper from "../components/Calendar/CalendarWrapper";
import EventList from "../components/Calendar/EventList";
import EventModal from "../components/Calendar/EventModal";
import CreateEventModal from "../components/Calendar/CreateEventModal";
import api from "../lib/api";
import { AnimatePresence, motion } from "framer-motion";

/* ─── kleine Hilfs-Komponenten ─────────────────────────── */

function Spinner() {
  return (
    <div
      style={{
        width: 22, height: 22,
        border: "2px solid rgba(255,255,255,0.08)",
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
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0.65rem 1.25rem",
      background: accent
        ? "rgba(197,165,114,0.07)"
        : "rgba(255,255,255,0.03)",
      border: `1px solid ${accent ? "rgba(197,165,114,0.18)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 12,
      gap: 2,
      minWidth: 80,
    }}>
      <span style={{
        fontSize: "1.35rem", fontWeight: 800,
        color: accent ? "var(--nill-gold)" : "var(--nill-text)",
        lineHeight: 1.1,
      }}>{value}</span>
      <span style={{
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
        background: "rgba(255,255,255,0.025)",
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
    <div style={{
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

/* ─── Haupt-Seite ───────────────────────────────────────── */

export default function CalendarPage() {
  const [events, setEvents]           = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalEvent, setModalEvent]   = useState(null);
  const [createOpen, setCreateOpen]   = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(false);

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

  return (
    <PageLayout>

      {/* ── HEADER ──────────────────────────────────────── */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>

          {/* Breadcrumb */}
          <span style={{
            fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--nill-text-dim)",
          }}>
            Dashboard / Kalender
          </span>

          <h1 style={{
            fontSize: "1.85rem", fontWeight: 800, margin: 0, lineHeight: 1.15,
            color: "var(--nill-text)",
            letterSpacing: "-0.01em",
          }}>
            Kalender
          </h1>

          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>
            {loading ? "Lade Termine…" : `${events.length} Termine gesamt`}
          </p>
        </div>

        {/* Stat-Chips + Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {!loading && !error && (
            <>
              <StatChip label="Heute"    value={todayEvents.length}    accent />
              <StatChip label="7 Tage"   value={eventsNext7Days.length} />
              <StatChip label="Gesamt"   value={events.length} />
            </>
          )}

          <button
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
          <Panel style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }}>
            <PanelHeader title="Monatsansicht" />
            <div style={{ padding: "1.1rem" }}>
              <CalendarWrapper
                value={selectedDate}
                onChange={setSelectedDate}
                events={events}
              />
            </div>
          </Panel>

          {/* NEXT 7 DAYS */}
          <Panel style={{ gridColumn: "3 / 4", gridRow: "1 / 2", display: "flex", flexDirection: "column" }}>
            <PanelHeader title="Nächste 7 Tage" badge={eventsNext7Days.length} />
            <div style={{ padding: "0.85rem 1.1rem", flex: 1, overflowY: "auto" }}>
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
          <Panel style={{ gridColumn: "3 / 4", gridRow: "2 / 3", display: "flex", flexDirection: "column" }}>
            <PanelHeader
              title={selectedLabel}
              badge={eventsForDay.length > 0 ? eventsForDay.length : undefined}
            />
            <div style={{ padding: "0.85rem 1.1rem", flex: 1, overflowY: "auto" }}>
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

        </motion.div>
      )}

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
