import { useEffect, useState, useMemo } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";
import clsx from "clsx";
import 'react-calendar/dist/Calendar.css';

export default function KalenderLanding() {
  const [Calendar, setCalendar] = useState(null); // dynamisch importiert
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Lade react-calendar nur clientseitig
  useEffect(() => {
    import("react-calendar").then(mod => setCalendar(() => mod.default));
  }, []);

  // Lade Events
  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await api.get("/calendar/events/upcoming", { params: { days: 90 } });
      setEvents(Array.isArray(res.data) ? res.data : []);
      setError(false);
    } catch (err) {
      console.error("Calendar fetch error:", err);
      setEvents([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // Filter Events nach selectedDate
  const eventsOnSelectedDate = useMemo(() => {
    return events.filter(e => {
      if (!e.start_at) return false;
      const start = new Date(e.start_at);
      const end = e.end_at ? new Date(e.end_at) : start;
      return selectedDate >= start.setHours(0,0,0,0) && selectedDate <= end.setHours(23,59,59,999);
    });
  }, [events, selectedDate]);

  // Nächste 5 Events für Sidebar
  const nextEvents = useMemo(() => {
    return events
      .filter(e => new Date(e.start_at) >= new Date())
      .sort((a,b) => new Date(a.start_at) - new Date(b.start_at))
      .slice(0,5);
  }, [events]);

  if (!Calendar) {
    return (
      <PageLayout>
        <p className="text-gray-400">Lade Kalender...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold mb-6 text-white">Kalender</h1>

      {loading && <p className="text-gray-400">Lade Termine...</p>}
      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-400">
          Termine konnten nicht geladen werden.
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kalender */}
          <div className="md:col-span-2 bg-[#0a1120] p-4 rounded-lg border border-white/5 shadow-lg">
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              calendarType="US"
              tileClassName={({ date }) =>
                events.some(e => {
                  const evDate = new Date(e.start_at);
                  return evDate.toDateString() === date.toDateString();
                })
                  ? "bg-[var(--accent)]/30 rounded-lg shadow-inner transition duration-200"
                  : ""
              }
            />
          </div>

          {/* Sidebar: Nächste Events */}
          <div className="bg-[#0a1120] p-4 rounded-lg border border-white/5 flex flex-col shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-white">Nächste Termine</h2>
              <button className="px-3 py-1 bg-[var(--accent)] rounded text-white text-sm hover:bg-opacity-80 transition">
                + Termin
              </button>
            </div>
            {nextEvents.length === 0 ? (
              <p className="text-gray-400">Keine bevorstehenden Termine.</p>
            ) : (
              <ul className="space-y-3 overflow-y-auto max-h-[400px]">
                {nextEvents.map(e => (
                  <li
                    key={e.id}
                    className={clsx(
                      "bg-[#111827] p-3 rounded-lg border border-white/5 cursor-pointer hover:bg-[var(--accent)]/20 transition",
                      e.id === eventsOnSelectedDate[0]?.id && "border-[var(--accent)]/50"
                    )}
                  >
                    <p className="font-semibold text-white">{e.title}</p>
                    <p className="text-gray-400 text-sm">{new Date(e.start_at).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Events Liste unter Kalender */}
      {eventsOnSelectedDate.length > 0 && (
        <div className="mt-6 bg-[#0a1120] p-4 rounded-lg border border-white/5 shadow-lg">
          <h2 className="font-semibold text-white mb-3">
            Termine am {selectedDate.toLocaleDateString()}
          </h2>
          <ul className="space-y-3">
            {eventsOnSelectedDate.map(e => (
              <li key={e.id} className="bg-[#111827] p-3 rounded-lg border border-white/5 hover:bg-[var(--accent)]/20 transition cursor-pointer">
                <p className="font-semibold text-white">{e.title}</p>
                <p className="text-gray-400 text-sm">{e.description || "-"}</p>
                <p className="text-gray-400 text-xs">
                  {new Date(e.start_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} -{" "}
                  {e.end_at ? new Date(e.end_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "??"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageLayout>
  );
}
