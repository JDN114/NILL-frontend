import { motion } from "framer-motion";
import api from "../../lib/api";
import { useState, useEffect } from "react";

export default function EventModal({ event, onClose, onUpdated, onDeleted }) {
  const [loading, setLoading] = useState(false);

  // 🔥 LOCAL STATE (wichtig!)
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
  });

  // 🔥 Sync wenn Modal geöffnet wird
  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
      });
    }
  }, [event]);

  if (!event) return null;

  // -------------------------
  // ACTIONS
  // -------------------------
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
        title: form.title,
        description: form.description,
        location: form.location,
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

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div className="bg-[#0a1120] p-6 rounded-xl w-full max-w-md border border-white/10 shadow-xl">

        <h2 className="text-xl font-bold text-white mb-4">
          Termin bearbeiten
        </h2>

        {/* TITLE */}
        <input
          value={form.title}
          placeholder="Titel"
          onChange={(e) =>
            setForm((f) => ({ ...f, title: e.target.value }))
          }
          className="w-full mb-3 p-2 rounded bg-[#111827] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />

        {/* DESCRIPTION */}
        <textarea
          value={form.description}
          placeholder="Beschreibung"
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className="w-full mb-3 p-2 rounded bg-[#111827] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />

        {/* LOCATION */}
        <input
          value={form.location}
          placeholder="Ort"
          onChange={(e) =>
            setForm((f) => ({ ...f, location: e.target.value }))
          }
          className="w-full mb-4 p-2 rounded bg-[#111827] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />

        {/* ACTIONS */}
        <div className="flex justify-between gap-2">
          <button
            onClick={handleDelete}
            className="bg-red-500/90 px-3 py-2 rounded text-white hover:bg-red-500 transition"
          >
            Löschen
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="bg-gray-600 px-3 py-2 rounded text-white hover:bg-gray-500 transition"
            >
              Abbrechen
            </button>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-[var(--accent)] px-3 py-2 rounded text-white hover:bg-opacity-80 transition disabled:opacity-50"
            >
              {loading ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
