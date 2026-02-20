import { useEffect, useState, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PageLayout from "../components/layout/PageLayout";
import { Button } from "../components/ui/Button";

const localizer = momentLocalizer(moment);
const API_BASE = "https://api.nillai.de";

export default function CalendarLanding() {
  const [events, setEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Lade alle Termine für react-big-calendar (z. B. nächsten Monat)
  // --------------------------------------------------
  const fetchCalendarEvents = useCallback(async () => {
    setLoading(true);
    try {
      const today = moment().startOf("month").format("YYYY-MM-DD");
      const endMonth = moment().endOf("month").format("YYYY-MM-DD");

      const res = await fetch(
        `${API_BASE}/calendar/events?start=${today}&end=${endMonth}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Fehler beim Laden der Events");
      const data = await res.json();
      setEvents(
        data.events.map((e) => ({
          id: e.id,
          title: e.title,
          start: new Date(e.start),
          end: new Date(e.end),
        }))
      );
    } catch (err) {
      console.error("Calendar fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // Lade die kommenden 5 Termine für rechte Spalte
  // --------------------------------------------------
  const fetchUpcoming = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/calendar/events/upcoming?days=30&limit=5`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Fehler beim Laden der kommenden Termine");
      const data = await res.json();
      setUpcoming(data);
    } catch (err) {
      console.error("Upcoming events fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchCalendarEvents();
    fetchUpcoming();
  }, [fetchCalendarEvents, fetchUpcoming]);

  // --------------------------------------------------
  // Handler für neuen Termin
  // --------------------------------------------------
  const handleAddEvent = () => {
    const title = prompt("Titel des Termins:");
    const dateStr = prompt("Datum (YYYY-MM-DD):");
    if (!title || !dateStr) return;

    fetch(`${API_BASE}/calendar/events`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, start: dateStr, end: dateStr }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Termin konnte nicht erstellt werden");
        return res.json();
      })
      .then(() => {
        fetchCalendarEvents();
        fetchUpcoming();
      })
      .catch(console.error);
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6 text-white">Kalender</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 📅 Kalender Links */}
        <div className="flex-1 bg-[#0a1120] p-4 rounded-lg shadow-inner">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            views={["month", "week", "day"]}
            popup
          />
        </div>

        {/* 📋 Rechte Spalte: nächste Termine */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Nächste Termine</h2>
            <Button onClick={handleAddEvent}>Termin eintragen</Button>
          </div>

          <div className="bg-[#0a1120] p-4 rounded-lg shadow-inner flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-gray-400">Lade Termine...</p>
            ) : upcoming.length === 0 ? (
              <p className="text-gray-400">Keine Termine geplant</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((e) => (
                  <li key={e.id} className="bg-[#111827] p-3 rounded-md shadow-sm text-white">
                    <p className="font-medium">{e.title}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(e.start).toLocaleString()} - {new Date(e.end).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
