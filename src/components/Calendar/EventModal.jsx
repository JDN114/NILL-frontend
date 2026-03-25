import { motion } from "framer-motion";
import api from "../../lib/api";
import { useState } from "react";

export default function EventModal({ event, onClose, onUpdated, onDeleted }) {
  const [loading, setLoading] = useState(false);

  if (!event) return null;

  async function handleDelete() {
    if (!confirm("Termin wirklich löschen?")) return;

    try {
      setLoading(true);
      await api.delete(`/calendar/events/${event.id}`);
      onDeleted?.();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Löschen fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    try {
      setLoading(true);

      await api.patch(`/calendar/events/${event.id}`, {
        title: event.title,
        description: event.description,
        location: event.location,
      });

      onUpdated?.();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Update fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div className="bg-[#0a1120] p-6 rounded-xl w-full max-w-md border border-white/10">

        <h2 className="text-xl font-bold text-white mb-3">
          Termin bearbeiten
        </h2>

        <input
          value={event.title}
          onChange={(e) => (event.title = e.target.value)}
          className="w-full mb-2 p-2 rounded bg-[#111827] text-white"
        />

        <textarea
          value={event.description || ""}
          onChange={(e) => (event.description = e.target.value)}
          className="w-full mb-2 p-2 rounded bg-[#111827] text-white"
        />

        <input
          value={event.location || ""}
          onChange={(e) => (event.location = e.target.value)}
          className="w-full mb-4 p-2 rounded bg-[#111827] text-white"
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={handleDelete}
            className="bg-red-500 px-3 py-2 rounded text-white"
          >
            Löschen
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="bg-gray-600 px-3 py-2 rounded text-white"
            >
              Abbrechen
            </button>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-indigo-600 px-3 py-2 rounded text-white"
            >
              Speichern
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
