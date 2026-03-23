import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";
import 'react-calendar/dist/Calendar.css';

export default function KalenderLanding() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // wir sind jetzt clientseitig
  }, []);

  return (
    <PageLayout>
      <h1 className="text-white text-3xl font-bold mb-6">Kalender</h1>

      {isClient ? (
        <ClientCalendar />
      ) : (
        <p className="text-gray-400">Lade Kalender...</p>
      )}
    </PageLayout>
  );
}

function ClientCalendar() {
  const [Calendar, setCalendar] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Dynamischer Import nur auf Client
  useEffect(() => {
    import("react-calendar").then(mod => setCalendar(() => mod.default));
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("/calendar/events/upcoming", { params: { days: 30 } });
        setEvents(res.data || []);
      } catch (err) {
        console.error("Calendar fetch error:", err);
        setEvents([]);
      }
    }
    fetchEvents();
  }, []);

  if (!Calendar) return <p className="text-gray-400">Kalender wird geladen...</p>;

  return (
    <div className="bg-[#0a1120] p-4 rounded-lg border border-white/5">
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        calendarType="US" // unbedingt setzen
        tileClassName={({ date }) =>
          events.some(e => new Date(e.start_at).toDateString() === date.toDateString())
            ? "bg-[var(--accent)]/30 rounded-lg"
            : ""
        }
      />
    </div>
  );
}
