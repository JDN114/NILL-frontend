import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";
import clsx from "clsx";
import 'react-calendar/dist/Calendar.css';

// Dynamisches Importieren nur im Browser
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function KalenderLanding() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Events laden
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

  // Events nach Datum gruppieren
  const eventsByDate = useMemo(() => {
    const map = {};
    (events || []).forEach(e => {
      const start = e.start_at || e.date;
      if (!start) return;
      const day = new Date(start).toDateString();
      if (!map[day]) map[day] = [];
      map[day].push(e);
    });
    return map;
  }, [events]);

  const selectedDayEvents = eventsByDate[selectedDate?.toDateString()] || [];

  // Nächste 5 Termine
  const nextEvents = useMemo(() => {
    const now = new Date();
    return (events || [])
      .filter(e => new Date(e.start_at || e.date) >= now)
      .sort((a,b) => new Date(a.start_at || a.date) - new Date(b.start_at || b.date))
      .slice(0, 5);
  }, [events]);

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
          {/* Calendar */}
          <div className="md:col-span-2 bg-[#0a1120] p-4 rounded-xl border border-white/10 shadow-lg">
            {typeof window !== "undefined" && selectedDate && (
              <Calendar
                value={selectedDate}
                onChange={date => date && setSelectedDate(date)}
                calendarType="US" // Nur erlaubte Types
                next2Label={null}
                prev2Label={null}
                className="react-calendar text-white border-none bg-[#0a1120]"
                tileClassName={({ date }) =>
                  clsx(
                    "transition-colors duration-200",
                    eventsByDate[date.toDateString()] && "bg-[var(--accent)]/20 rounded-lg",
                    date.toDateString() === selectedDate.toDateString() && "bg-[var(--accent)]/60 text-white font-semibold"
                  )
                }
              />
            )}

            {selectedDayEvents.length > 0 && (
              <div className="mt-4 p-2 bg-[#111827]/80 rounded-lg border border-white/5 shadow-inner max-h-60 overflow-y-auto">
                <h3 className="text-white font-semibold mb-2">Termine am {selectedDate.toLocaleDateString()}</h3>
                <ul className="space-y-2">
                  {selectedDayEvents.map(e => (
                    <li key={e.id} className="p-2 bg-[#1f2937]/50 rounded border border-white/5 hover:bg-[var(--accent)]/30 transition">
                      <p className="font-semibold">{e.title}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(e.start_at || e.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - 
                        {new Date(e.end_at || e.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-[#0a1120] p-4 rounded-xl border border-white/10 shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-white text-lg">Nächste Termine</h2>
              <button className="px-3 py-1 bg-[var(--accent)] rounded text-white text-sm hover:bg-opacity-80 transition">
                Termin eintragen
              </button>
            </div>
            {nextEvents.length === 0 ? (
              <p className="text-gray-400">Keine bevorstehenden Termine.</p>
            ) : (
              <ul className="space-y-2 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-[var(--accent)] scrollbar-track-[#0a1120]">
                {nextEvents.map(e => (
                  <li key={e.id} className="bg-[#111827]/50 p-3 rounded-lg border border-white/5 hover:bg-[var(--accent)]/30 transition cursor-pointer">
                    <p className="font-semibold text-white">{e.title}</p>
                    <p className="text-gray-400 text-sm">{new Date(e.start_at || e.date).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
