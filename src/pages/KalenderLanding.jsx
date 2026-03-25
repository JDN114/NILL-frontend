import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";

import CalendarWrapper from "../components/Calendar/CalendarWrapper";
import EventList from "../components/Calendar/EventList";
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

  async function handleDelete(event) {
    try {
      await api.delete(`/calendar/events/${event.id}`);
      fetchEvents();
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchEvents() {
    try {
      const res = await api.get("/calendar/events/upcoming", {
        params: { days: 90 },
      });

      const safeData = Array.isArray(res.data) ? res.data : [];

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

  const now = new Date();

  const next7d = new Date();
  next7d.setDate(now.getDate() + 7);

  const eventsNext7Days = events
    .filter((e) => e?.start && e.start >= now && e.start <= next7d)
    .sort((a, b) => a.start - b.start);

  const eventsForDay = events.filter(
    (e) => e?.start && isSameDay(e.start, selectedDate)
  );

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <PageLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Kalender</h1>
          <p className="text-gray-400 text-sm mt-1">
            {events.length} Termine insgesamt
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-[var(--accent)] rounded-lg text-white text-sm hover:bg-opacity-80 transition"
        >
          + Termin erstellen
        </button>
      </div>

      {/* LOADING */}
      {loading && <p className="text-gray-400">Lade Termine...</p>}

      {/* ERROR */}
      {!loading && error && (
        <Card className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 mb-6">
          Termine konnten nicht geladen werden.
        </Card>
      )}

      {/* CONTENT */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CALENDAR */}
          <Card className="md:col-span-2 p-4 rounded-xl shadow-lg">
            <CalendarWrapper
              value={selectedDate}
              onChange={setSelectedDate}
              events={events}
            />
          </Card>

          {/* NEXT 7 DAYS */}
          <Card className="p-4 rounded-xl shadow-lg flex flex-col">
            <h2 className="font-semibold text-white text-lg mb-3">
              Nächste 7 Tage
              <span className="ml-2 text-sm text-gray-400">
                ({eventsNext7Days.length})
              </span>
            </h2>

            <EventList
              events={eventsNext7Days}
              onSelect={(e) => setModalEvent(e)}
              onDelete={handleDelete}
            />
          </Card>

          {/* DAY VIEW */}
          <Card className="md:col-span-3 p-4 rounded-xl shadow-lg">
            <h3 className="text-white font-semibold mb-3">
              {selectedDate.toLocaleDateString("de-DE", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </h3>

            <EventList
              events={eventsForDay}
              onSelect={(e) => setModalEvent(e)}
              onDelete={handleDelete}
            />
          </Card>
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

      {/* CREATE MODAL */}
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
