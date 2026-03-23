// /src/pages/KalenderLanding.jsx
import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Calendar from "react-calendar";
import EventModal from "../components/Calendar/EventModal";
import api from "../lib/api";
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await api.get("/calendar/events/upcoming", { params: { days: 90 } });
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

  // Events für die selektierte Tagesanzeige
  const eventsForDay = events.filter(e =>
    new Date(e.date).toDateString() === selectedDate.toDateString()
  );

  // Nächste 5 bevorstehende Events
  const nextEvents = events.filter(e => new Date(e.date) >= new Date()).slice(0, 5);

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
          {/* CALENDAR */}
          <div className="md:col-span-2 bg-[#0a1120] p-4 rounded-xl border border-white/5 shadow-lg">
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              calendarType="US" // Fix für "Unsupported calendar type"
              className="bg-[#0a1120] text-white rounded-xl"
              tileClassName={({ date }) =>
                events.some(e => new Date(e.date).toDateString() === date.toDateString())
                  ? "bg-[var(--accent)]/30 rounded-lg font-semibold text-white shadow-inner"
                  : ""
              }
            />
          </div>

          {/* UPCOMING EVENTS */}
          <div className="bg-[#0a1120] p-4 rounded-xl border border-white/5 shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-white text-lg">Nächste Termine</h2>
              <button className="px-3 py-1 bg-[var(--accent)] rounded text-white text-sm hover:bg-opacity-80 transition">
                Neuer Termin
              </button>
            </div>

            <ul className="space-y-3 overflow-y-auto max-h-[400px]">
              {nextEvents.length === 0 && (
                <p className="text-gray-400">Keine bevorstehenden Termine.</p>
              )}
              {nextEvents.map(e => (
                <li
                  key={e.id}
                  className="bg-[#111827] p-3 rounded-lg border border-white/5 cursor-pointer hover:bg-[var(--accent)]/20 transition"
                  onClick={() => setModalEvent(e)}
                >
                  <p className="font-semibold text-white">{e.title}</p>
                  <p className="text-gray-400 text-sm">{new Date(e.date).toLocaleString()}</p>
                  {e.location && <p className="text-gray-500 text-xs">📍 {e.location}</p>}
                </li>
              ))}
            </ul>
          </div>

          {/* EVENTS FOR SELECTED DAY */}
          {eventsForDay.length > 0 && (
            <div className="md:col-span-3 bg-[#0a1120] p-4 rounded-xl border border-white/5 shadow-lg mt-6">
              <h3 className="text-white font-semibold mb-3">
                Termine für {selectedDate.toLocaleDateString()}
              </h3>
              <ul className="space-y-2">
                {eventsForDay.map(e => (
                  <li
                    key={e.id}
                    className="bg-[#111827] p-2 rounded-lg border border-white/5 cursor-pointer hover:bg-[var(--accent)]/20 transition"
                    onClick={() => setModalEvent(e)}
                  >
                    <p className="font-semibold text-white">{e.title}</p>
                    <p className="text-gray-400 text-sm">{new Date(e.date).toLocaleTimeString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* EVENT MODAL */}
      <AnimatePresence>
        {modalEvent && (
          <EventModal
            event={modalEvent}
            onClose={() => setModalEvent(null)}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
