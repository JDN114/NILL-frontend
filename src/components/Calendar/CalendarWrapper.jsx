// /src/components/calendar/CalendarWrapper.jsx
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarWrapper({ value, onChange, events = [] }) {
  const safeEvents = Array.isArray(events) ? events : [];

  const hasEvent = (date) => {
    return safeEvents.some((e) => {
      if (!e?.date) return false;
      return new Date(e.date).toDateString() === date.toDateString();
    });
  };

  return (
    <div className="calendar-dark">
      <Calendar
        value={value || new Date()}
        onChange={onChange}
        locale="de-DE"
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
        tileClassName={({ date }) =>
          hasEvent(date)
            ? "bg-[var(--accent)]/20 rounded-lg"
            : ""
        }
      />
    </div>
  );
}
