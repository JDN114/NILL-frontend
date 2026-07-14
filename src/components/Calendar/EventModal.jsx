import { motion } from "framer-motion";
import api from "../../services/api";
import { useState, useEffect } from "react";
import "./calendar.css"; // mobile (≤768px) bottom-sheet styles — no desktop rules

export default function EventModal({ event, onClose, onUpdated, onDeleted }) {
  const [loading, setLoading] = useState(false);

  // 🔥 LOCAL STATE (Eingaben isoliert vom Originalevent)
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

      // 🔥 PUT statt PATCH
      await api.put(`/calendar/events/${event.id}`, {
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
    <motion.div
      className="kal-sheet-wrap fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        // Backdrop-tap closes the sheet — mobile only, desktop behavior unchanged
        if (e.target === e.currentTarget && window.matchMedia("(max-width: 768px)").matches) {
          onClose();
        }
      }}
    >
      <motion.div className="kal-sheet bg-[#0a1120] p-6 rounded-xl w-full max-w-md border border-white/10 shadow-xl">

        <div className="kal-sheet-handle" aria-hidden="true" />

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
        <div className="kal-sheet-actions flex justify-between gap-2">
          <button
            onClick={handleDelete}
            className="bg-red-500/90 px-3 py-2 rounded text-white hover:bg-red-500 transition"
          >
            Löschen
          </button>

          <div className="kal-sheet-actions-main flex gap-2">
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
