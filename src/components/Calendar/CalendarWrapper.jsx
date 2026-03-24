// /src/components/calendar/CalendarWrapper.jsx
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

export default function CalendarWrapper({ value, onChange, events = [] }) {
  return (
    <div className="calendar-wrapper">
      <Calendar
        value={value}
        onChange={onChange}
        tileClassName={({ date }) => {
          const hasEvent = events.some(
            (e) =>
              e?.date &&
              new Date(e.date).toDateString() === date.toDateString()
          );

          return hasEvent ? "event-day" : "";
        }}
      />
    </div>
  );
}
