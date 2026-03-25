import { motion } from "framer-motion";

// -------------------------
// HELPERS
// -------------------------
function formatTime(start, end, allDay) {
  try {
    if (allDay) return "Ganztägig";

    const s = new Date(start);
    const e = new Date(end);

    return `${s.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    })}${
      end
        ? " – " +
          e.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""
    }`;
  } catch {
    return "";
  }
}

function formatDayLabel(date) {
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return "Heute";
  if (d.toDateString() === tomorrow.toDateString()) return "Morgen";

  return d.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
}

// -------------------------
// GROUP EVENTS BY DAY
// -------------------------
function groupByDay(events) {
  const groups = {};

  events.forEach((e) => {
    if (!e.start_at) return;

    const key = new Date(e.start_at).toDateString();

    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });

  return groups;
}

// -------------------------
// COMPONENT
// -------------------------
export default function EventList({ events = [], onSelect, onDelete }) {
  if (!events.length) {
    return (
      <p className="text-gray-400 text-sm">
        Keine Termine in den nächsten 7 Tagen ✨
      </p>
    );
  }

  const grouped = groupByDay(events);

  return (
    <div className="space-y-6 max-h-[420px] overflow-y-auto pr-1">
      {Object.entries(grouped).map(([day, dayEvents]) => (
        <div key={day}>
          {/* DAY HEADER */}
          <p className="text-sm text-gray-400 mb-2">
            {formatDayLabel(day)}
          </p>

          <ul className="space-y-3">
            {dayEvents.map((e) => (
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
                  {/* TOP ROW */}
                  <div className="flex justify-between items-center">
                    <p className="text-white font-semibold">
                      {e.title || "Ohne Titel"}
                    </p>

                    <span className="text-xs text-gray-400">
                      {formatTime(e.start_at, e.end_at, e.all_day)}
                    </span>
                  </div>

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
                      ev.stopPropagation();
                      onSelect?.(e);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Bearbeiten
                  </button>

                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
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
        </div>
      ))}
    </div>
  );
}
