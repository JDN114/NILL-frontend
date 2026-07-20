import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./calendar.css"; // mobile (≤768px) touch styles — no desktop rules

// -------------------------
// HELPERS
// -------------------------
function formatTime(start, end, allDay) {
  try {
    if (allDay) return "Ganztägig";

    const s = new Date(start);
    const e = end ? new Date(end) : null;

    return `${s.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}${
      e ? " – " + e.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : ""
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

  return d.toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "short" });
}

// -------------------------
// GROUP EVENTS BY DAY
// -------------------------
function audienceBadge(e) {
  if (e?.audience === "org") return { label: "Team", color: "#93c5fd", bg: "rgba(59,130,246,0.14)" };
  if (e?.audience === "role") {
    const names = e?.role_names?.length ? e.role_names.join(", ") : "Rollen";
    return { label: names, color: "#c5a572", bg: "rgba(197,165,114,0.14)" };
  }
  return null; // private → kein Badge
}

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
  const [localEvents, setLocalEvents] = useState(events);

  // 🔥 Sync props -> local state
  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  // 🔥 Update einzelner Event direkt in der Liste
  if (!localEvents.length) {
    return <p className="text-gray-400 text-sm">Keine Termine</p>;
  }

  const grouped = groupByDay(localEvents);

  return (
    <div className="kal-elist space-y-6 max-h-[420px] overflow-y-auto pr-1">
      {Object.entries(grouped).map(([day, dayEvents]) => (
        <div key={day}>
          {/* DAY HEADER */}
          <p className="kal-eday text-sm text-gray-400 mb-2">{formatDayLabel(day)}</p>

          <ul className="space-y-3">
            {dayEvents.map((e) => (
              <motion.li
                key={e.id}
                whileHover={{ scale: 1.02 }}
                className="kal-eitem bg-[#111827] border border-white/5 rounded-xl p-3 transition group hover:border-[var(--accent)]/40"
              >
                {/* CLICK AREA */}
                <div onClick={() => onSelect?.(e)} className="kal-ebody cursor-pointer">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="kal-etitle text-white font-semibold truncate">{e.title || "Ohne Titel"}</p>
                      {(() => {
                        const b = audienceBadge(e);
                        return b ? (
                          <span
                            className="text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                            style={{ color: b.color, background: b.bg }}
                          >
                            {b.label}
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(e.start_at, e.end_at, e.all_day)}</span>
                  </div>

                  {e.description && <p className="text-sm text-gray-300 mt-2 line-clamp-2">{e.description}</p>}
                  {e.location && <p className="text-xs text-gray-500 mt-1">📍 {e.location}</p>}
                </div>

                {/* ACTIONS */}
                <div className="kal-eactions flex justify-end gap-3 mt-3 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onSelect?.(e);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {e.editable === false ? "Ansehen" : "Bearbeiten"}
                  </button>

                  {/* Team-/Rollen-Termine kann nur der Org-Admin löschen */}
                  {e.editable !== false && (
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onDelete?.(e);
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Löschen
                    </button>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
