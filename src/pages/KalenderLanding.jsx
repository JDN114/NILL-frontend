import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Calendar from "react-calendar";
import api from "../lib/api";
import 'react-calendar/dist/Calendar.css';
import { format } from "date-fns";

export default function KalenderLanding() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch upcoming events
  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
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

  // Events on selected date
  const eventsOnSelectedDate = events.filter(
    e => new Date(e.start_at).toDateString() === selectedDate.toDateString()
  );

  // Next upcoming 5 events
  const nextEvents = events
    .filter(e => new Date(e.start_at) >= new Date())
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at))
    .slice(0, 5);

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold mb-6 text-white">Kalender</h1>

      {loading && (
        <p className="text-gray-400">Lade Termine...</p>
      )}

      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-red-400">
          Termine konnten nicht geladen werden.
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="md:col-span-2 bg-[#0a1120] p-4 rounded-lg border border-white/5 shadow-lg">
            <Calendar
              calendarType="US" // ✅ Supported type
              value={selectedDate}
              onChange={setSelectedDate}
              tileClassName={({ date }) =>
                events.some(e => new Date(e.start_at).toDateString() === date.toDateString())
                  ? "bg-[var(--accent)]/20 rounded transition-colors"
                  : ""
              }
              prevLabel="<"
              nextLabel=">"
              next2Label=">>"
              prev2Label="<<"
              showNeighboringMonth={false}
            />
          </div>

          {/* Event Sidebar */}
          <div className="bg-[#0a1120] p-4 rounded-lg border border-white/5 flex flex-col shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-white">Nächste Termine</h2>
              <button
                className="px-3 py-1 bg-[var(--accent)] rounded text-white text-sm hover:bg-opacity-80 transition"
              >
                Termin eintragen
              </button>
            </div>

            {eventsOnSelectedDate.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-400 mb-2">Termine am {format(selectedDate, "dd.MM.yyyy")}:</p>
                <ul className="space-y-2">
                  {eventsOnSelectedDate.map(e => (
                    <li key={e.id} className="bg-[#111827] p-2 rounded border border-white/5 hover:bg-[var(--accent)]/10 transition">
                      <p className="font-semibold text-white">{e.title}</p>
                      <p className="text-gray-400 text-sm">
                        {format(new Date(e.start_at), "HH:mm")} - {format(new Date(e.end_at), "HH:mm")}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {nextEvents.length > 0 && (
              <>
                <p className="text-gray-400 mb-2">Baldige Termine:</p>
                <ul className="space-y-2 overflow-y-auto max-h-[300px]">
                  {nextEvents.map(e => (
                    <li key={e.id} className="bg-[#111827] p-2 rounded border border-white/5 hover:bg-[var(--accent)]/10 transition">
                      <p className="font-semibold text-white">{e.title}</p>
                      <p className="text-gray-400 text-sm">
                        {format(new Date(e.start_at), "dd.MM HH:mm")}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {eventsOnSelectedDate.length === 0 && nextEvents.length === 0 && (
              <p className="text-gray-400 mt-4">Keine bevorstehenden Termine.</p>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
