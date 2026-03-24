// /src/components/Calendar/CalendarWrapper.jsx
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

export default function CalendarWrapper({ value, onChange, events = [] }) {
  const safeEvents = Array.isArray(events) ? events : [];

  // 🔥 FIX: nutzt start_at statt date
  const hasEvent = (date) => {
    return safeEvents.some((e) => {
      if (!e?.start) return false; // <- aus Landing normalisiert
      return new Date(e.start).toDateString() === date.toDateString();
    });
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        value={value || new Date()}
        onChange={onChange}
        locale="de-DE"

        // 🔥 bessere Navigation
        prevLabel="‹"
        nextLabel="›"
        prev2Label="«"
        next2Label="»"

        navigationLabel={({ date }) =>
          date.toLocaleDateString("de-DE", {
            month: "long",
            year: "numeric",
          })
        }

        // 🔥 Event Highlight
        tileClassName={({ date }) =>
          hasEvent(date) ? "event-day" : ""
        }
      />
    </div>
  );
}
