import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";

import CalendarWrapper from "../components/Calendar/CalendarWrapper";
import EventList from "../components/Calendar/EventList";
import CalendarStats from "../components/Calendar/CalendarStats";
import EventModal from "../components/Calendar/EventModal";
import CreateEventModal from "../components/Calendar/CreateEventModal";

import api from "../lib/api";
import { AnimatePresence } from "framer-motion";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [modalEvent, setModalEvent] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // -------------------------
  // FETCH EVENTS
  // -------------------------
  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await api.get("/calendar/events/upcoming", {
        params: { days: 90 },
      });

      const safeData = Array.isArray(res.data) ? res.data : [];

      // 🔥 normalize backend → frontend
      const normalized = safeData.map((e) => ({
        ...e,
        start: e.start_at ? new Date(e.start_at) : null,
        end: e.end_at ? new Date(e.end_at) : null,
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

  // -------------------------
  // HELPERS
  // -------------------------
  const isSameDay = (d1, d2) =>
    d1 && d2 && new Date(d1).toDateString() === new Date(d2).toDateString();

  const eventsForDay = events.filter(
    (e) => e?.start && isSameDay(e.start, selectedDate)
  );

  const nextEvents = events
    .filter((e) => e?.start && e.start >= new Date())
    .sort((a, b) => a.start - b.start)
    .slice(0, 5);

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <PageLayout>
      <h1 className="text-3xl font-bold mb-6 text-white">Kalender</h1>

      {loading && <p className="text-gray-400">Lade Termine...</p>}

      {!loading && error && (
        <Card className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 mb-6">
          Termine konnten nicht geladen werden.
        </Card>
      )}

      {!loading && !error && (
        <>
          <CalendarStats events={events} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CALENDAR */}
            <Card className="md:col-span-2 p-4 rounded-xl shadow-lg">
              <CalendarWrapper
                value={selectedDate}
                onChange={setSelectedDate}
                events={events}
              />
            </Card>

            {/* UPCOMING */}
            <Card className="p-4 rounded-xl shadow-lg flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-white text-lg">
                  Nächste Termine
                </h2>

                <button
                  onClick={() => setCreateOpen(true)}
                  className="px-3 py-1 bg-indigo-600 rounded text-white text-sm hover:bg-indigo-500 transition"
                >
                  + Termin
                </button>
              </div>

              <EventList
                events={nextEvents}
                onSelect={(e) => setModalEvent(e)}
              />
            </Card>

            {/* DAY VIEW */}
            <Card className="md:col-span-3 p-4 rounded-xl shadow-lg">
              <h3 className="text-white font-semibold mb-3">
                Termine für {selectedDate.toLocaleDateString()}
              </h3>

              <EventList
                events={eventsForDay}
                onSelect={(e) => setModalEvent(e)}
              />
            </Card>
          </div>
        </>
      )}

      {/* EVENT DETAILS */}
      <AnimatePresence>
        {modalEvent && (
          <EventModal
            event={modalEvent}
            onClose={() => setModalEvent(null)}
          />
        )}
      </AnimatePresence>

      {/* CREATE MODAL (FIXED) */}
      <AnimatePresence>
        {createOpen && (
          <CreateEventModal
            open={createOpen} // 🔥 FIX
            onClose={() => setCreateOpen(false)}
            onCreated={fetchEvents}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
