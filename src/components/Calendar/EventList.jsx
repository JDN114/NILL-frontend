// /src/components/calendar/EventList.jsx
import EventCard from "./EventCard";

export default function EventList({ events = [], onSelect }) {
  if (!Array.isArray(events) || events.length === 0) {
    return <p className="text-gray-400">Keine Termine vorhanden.</p>;
  }

  return (
    <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
      {events.map((e) => (
        <EventCard key={e.id} event={e} onClick={onSelect} />
      ))}
    </div>
  );
}
