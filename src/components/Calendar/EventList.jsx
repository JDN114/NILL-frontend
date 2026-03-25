import { motion } from "framer-motion";

// -------------------------
// HELPER
// -------------------------
function formatDateTime(start, end, allDay) {
  try {
    const s = new Date(start);
    const e = new Date(end);

    const date = s.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
    });

    if (allDay) return `${date} • Ganztägig`;

    const time = `${s.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    })}${
      end
        ? " - " +
          e.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""
    }`;

    return `${date} • ${time}`;
  } catch {
    return "";
  }
}

// -------------------------
// COMPONENT
// -------------------------
export default function EventList({ events = [], onSelect, onDelete }) {
  if (!events.length) {
    return (
      <p className="text-gray-400 text-sm">
        Keine Termine vorhanden.
      </p>
    );
  }

  return (
    <ul className="space-y-3 overflow-y-auto max-h-[320px] pr-1">
      {events.map((e) => (
        <motion.li
          key={e.id}
          whileHover={{ scale: 1.02 }}
          className="bg-[#111827] border border-white/5 rounded-xl p-3 transition group hover:border-[var(--accent)]/40"
        >
          {/* CLICK AREA */}
          <div
            onClick={() => onSelect?.(e)}
            className="cursor-pointer"
          >
            {/* TITLE */}
            <p className="text-white font-semibold">
              {e.title || "Ohne Titel"}
            </p>

            {/* DATE + TIME */}
            <p className="text-xs text-gray-400 mt-1">
              {formatDateTime(e.start_at, e.end_at, e.all_day)}
            </p>

            {/* DESCRIPTION */}
            {e.description && (
              <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                {e.description}
              </p>
            )}

            {/* LOCATION */}
            {e.location && (
              <p className="text-xs text-gray-500 mt-1">
                📍 {e.location}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 mt-3 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(ev) => {
                ev.stopPropagation(); // 🔥 verhindert Modal + Click gleichzeitig
                onSelect?.(e);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Bearbeiten
            </button>

            <button
              onClick={(ev) => {
                ev.stopPropagation(); // 🔥 wichtig!
                onDelete?.(e);
              }}
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
