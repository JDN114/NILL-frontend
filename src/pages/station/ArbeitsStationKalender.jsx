import { useEffect, useState } from "react";
import ArbeitsStationLayout from "../../components/layout/ArbeitsStationLayout";
import api from "../../lib/api";

const ACCENT = "#38f5d0";

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

function timeLabel(event) {
  if (!event.start) return "";
  const opts = { hour: "2-digit", minute: "2-digit" };
  const s = new Date(event.start).toLocaleTimeString("de-DE", opts);
  if (!event.end) return s;
  const e = new Date(event.end).toLocaleTimeString("de-DE", opts);
  return `${s} – ${e}`;
}

function dayKey(date) {
  return new Date(date).toDateString();
}

function relativeLabel(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return "Heute";
  if (diff === 1) return "Morgen";
  if (diff === 2) return "Übermorgen";
  return new Date(dateStr).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
}

function EventItem({ event }) {
  const hasTime = event.start && !event.all_day;
  const isNow = event.start && event.end &&
    new Date() >= new Date(event.start) && new Date() <= new Date(event.end);

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
      padding: "14px 18px",
      borderRadius: 12,
      border: `1px solid ${isNow ? `rgba(56,245,208,0.3)` : "rgba(239,237,231,0.06)"}`,
      background: isNow ? "rgba(56,245,208,0.05)" : "rgba(255,255,255,0.02)",
      transition: "background 0.2s",
    }}>
      {/* Time column */}
      <div style={{
        minWidth: 70,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.72rem",
        color: isNow ? ACCENT : "rgba(239,237,231,0.4)",
        letterSpacing: "0.03em",
        paddingTop: 2,
        flexShrink: 0,
      }}>
        {event.all_day ? "Ganztags" : hasTime ? timeLabel(event) : "–"}
        {isNow && (
          <div style={{
            marginTop: 4,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: ACCENT,
              boxShadow: `0 0 6px ${ACCENT}`,
              animation: "as-pulse 1.5s ease-in-out infinite",
            }} />
            <span style={{ fontSize: "0.58rem", color: ACCENT }}>Jetzt</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
          fontWeight: 400,
          color: "#efede7",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>{event.title}</div>

        {event.location && (
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.73rem",
            color: "rgba(239,237,231,0.4)",
            marginTop: 3,
          }}>📍 {event.location}</div>
        )}
      </div>
    </div>
  );
}

export default function ArbeitsStationKalender() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/calendar/events/upcoming", { params: { days: 14 } });
        const raw = Array.isArray(res.data) ? res.data : [];
        setEvents(raw.map(e => ({
          ...e,
          start: e.start_at ? new Date(e.start_at) : null,
          end:   e.end_at   ? new Date(e.end_at)   : null,
        })).sort((a, b) => (a.start || 0) - (b.start || 0)));
      } catch { setEvents([]); }
      finally { setLoading(false); }
    })();
  }, []);

  // Group events by day
  const grouped = events.reduce((acc, e) => {
    if (!e.start) return acc;
    const key = dayKey(e.start);
    if (!acc[key]) acc[key] = { date: e.start, events: [] };
    acc[key].events.push(e);
    return acc;
  }, {});

  const days = Object.values(grouped).sort((a, b) => a.date - b.date);
  const today = dayKey(new Date());
  const todayGroup = grouped[today];

  return (
    <ArbeitsStationLayout title="Kalender" icon="▦" accent={ACCENT} maxWidth={780}>
      <style>{`
        @keyframes as-spin  { to { transform: rotate(360deg); } }
        @keyframes as-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
          <Spinner />
        </div>
      ) : events.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          border: "1px solid rgba(239,237,231,0.06)",
          borderRadius: 20,
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 12 }}>▦</div>
          <div style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.1rem",
            color: "rgba(239,237,231,0.4)",
          }}>Keine Termine in den nächsten 14 Tagen</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {days.map(({ date, events: dayEvents }) => {
            const key = dayKey(date);
            const isToday = key === today;
            return (
              <div key={key}>
                {/* Day label */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 14,
                  marginBottom: 12,
                }}>
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    minWidth: 44, flexShrink: 0,
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: isToday ? ACCENT : "rgba(239,237,231,0.35)",
                    }}>
                      {date.toLocaleDateString("de-DE", { weekday: "short" })}
                    </div>
                    <div style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: isToday ? "1.6rem" : "1.3rem",
                      fontWeight: 400,
                      color: isToday ? ACCENT : "#efede7",
                      lineHeight: 1,
                    }}>
                      {date.getDate()}
                    </div>
                  </div>
                  <div style={{
                    flex: 1, height: 1,
                    background: isToday
                      ? `linear-gradient(90deg, rgba(56,245,208,0.4), transparent)`
                      : "rgba(239,237,231,0.06)",
                  }} />
                  {isToday && (
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: ACCENT,
                      background: "rgba(56,245,208,0.08)",
                      border: "1px solid rgba(56,245,208,0.2)",
                      borderRadius: 99,
                      padding: "2px 10px",
                    }}>Heute</span>
                  )}
                </div>

                {/* Events for this day */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {dayEvents.map((ev, i) => <EventItem key={i} event={ev} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ArbeitsStationLayout>
  );
}
