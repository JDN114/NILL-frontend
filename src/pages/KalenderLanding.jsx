import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../lib/api";
import 'react-calendar/dist/Calendar.css';

export default function KalenderLanding() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // erst nach Mount rendern wir den Kalender
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

// Dieser Teil wird nur clientseitig gerendert
function ClientCalendar() {
  const Calendar = require("react-calendar").default;
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("/calendar/events/upcoming", { params: { days: 30 } });
        setEvents(res.data || []);
      } catch (err) {
        console.error(err);
        setEvents([]);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="bg-[#0a1120] p-4 rounded-lg border border-white/5">
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        calendarType="US" // zwingend setzen, sonst Unsupported calendar type
        tileClassName={({ date }) =>
          events.some(e => new Date(e.start_at).toDateString() === date.toDateString())
            ? "bg-[var(--accent)]/30 rounded-lg"
            : ""
        }
      />
    </div>
  );
}
