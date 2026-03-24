// /src/components/calendar/CreateEventModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../lib/api";

export default function CreateEventModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [allDay, setAllDay] = useState(false);

  const [error, setError] = useState("");

  const submit = async () => {
    if (!title.trim()) return setError("Titel ist erforderlich");
    if (!start || !end) return setError("Zeitraum ist erforderlich");

    try {
      await api.post("/calendar/events", {
        title,
        description,
        location,
        start_at: start,
        end_at: end,
        all_day: allDay,
      });

      onCreated?.();
      onClose();
    } catch (e) {
      console.error(e);
      setError("Fehler beim Erstellen");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 bg-gray-900 w-[500px] p-6 rounded-xl border border-white/10 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Neuer Termin
        </h2>

        {error && (
          <div className="text-red-400 text-sm mb-3">{error}</div>
        )}

        <div className="space-y-3">
          <input
            placeholder="Titel *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 p-2 rounded"
          />

          <textarea
            placeholder="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-800 p-2 rounded"
          />

          <input
            placeholder="Ort"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-gray-800 p-2 rounded"
          />

          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="flex-1 bg-gray-800 p-2 rounded"
            />
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="flex-1 bg-gray-800 p-2 rounded"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={allDay}
              onChange={() => setAllDay(!allDay)}
            />
            Ganztägig
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-700 rounded"
          >
            Abbrechen
          </button>

          <button
            onClick={submit}
            className="px-4 py-1 bg-[var(--accent)] rounded text-white"
          >
            Erstellen
          </button>
        </div>
      </motion.div>
    </div>
  );
}
