// /src/components/calendar/EventCard.jsx
export default function EventCard({ event, onClick }) {
  if (!event) return null;

  return (
    <div
      onClick={() => onClick?.(event)}
      className="bg-[#111827] p-3 rounded-lg border border-white/5 cursor-pointer 
                 hover:bg-[var(--accent)]/20 transition group"
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-white group-hover:text-[var(--accent)]">
          {event.title || "Untitled"}
        </p>

        {event.color && (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: event.color }}
          />
        )}
      </div>

      <p className="text-gray-400 text-sm">
        {event.date ? new Date(event.date).toLocaleString() : "-"}
      </p>

      {event.location && (
        <p className="text-gray-500 text-xs mt-1">
          📍 {event.location}
        </p>
      )}
    </div>
  );
}
