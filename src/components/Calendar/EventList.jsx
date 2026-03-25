kexport default function EventList({ events = [], onSelect, onDelete }) {
  if (!events.length) {
    return <p className="text-gray-400 text-sm">Keine Termine vorhanden.</p>;
  }

  return (
    <ul className="space-y-3 overflow-y-auto max-h-[320px] pr-1">
      {events.map((e) => (
        <motion.li
          key={e.id}
          whileHover={{ scale: 1.02 }}
          className="bg-[#111827] border border-white/5 rounded-xl p-3 transition group"
        >
          {/* CLICK AREA */}
          <div onClick={() => onSelect?.(e)} className="cursor-pointer">
            <p className="text-white font-semibold">
              {e.title || "Ohne Titel"}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {formatDateTime(e.start_at, e.end_at, e.all_day)}
            </p>

            {e.description && (
              <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                {e.description}
              </p>
            )}

            {e.location && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {e.location}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 mt-3 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => onSelect?.(e)}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Bearbeiten
            </button>

            <button
              onClick={() => onDelete?.(e)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Löschen
            </button>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
