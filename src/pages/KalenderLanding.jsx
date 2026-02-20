import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Calendar from "react-calendar";
import api from "../lib/api";
import 'react-calendar/dist/Calendar.css';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await api.get("/calendar/events/upcoming", { params: { days: 30 } });
      setEvents(res.data || []);
      setError(false);
    } catch (err) {
      console.error("Calendar fetch error:", err);
      setEvents([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const nextEvents = events.filter(e => new Date(e.date) >= new Date()).slice(0, 5);

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Kalender</h1>

      {loading && <p className="text-gray-400">Lade Termine...</p>}
      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-400">
          Termine konnten nicht geladen werden.
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#0a1120] p-4 rounded-lg border border-white/5">
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              tileClassName={({ date }) =>
                events.some(e => new Date(e.date).toDateString() === date.toDateString())
                  ? "bg-[var(--accent)]/20 rounded"
                  : ""
              }
            />
          </div>

          <div className="bg-[#0a1120] p-4 rounded-lg border border-white/5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-white">Nächste Termine</h2>
              <button className="px-3 py-1 bg-[var(--accent)] rounded text-white text-sm hover:bg-opacity-80 transition">
                Termin eintragen
              </button>
            </div>
            {nextEvents.length === 0 ? (
              <p className="text-gray-400">Keine bevorstehenden Termine.</p>
            ) : (
              <ul className="space-y-2 overflow-y-auto max-h-[300px]">
                {nextEvents.map(e => (
                  <li key={e.id} className="bg-[#111827] p-2 rounded border border-white/5">
                    <p className="font-semibold">{e.title}</p>
                    <p className="text-gray-400 text-sm">{new Date(e.date).toLocaleString()}</p>
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
