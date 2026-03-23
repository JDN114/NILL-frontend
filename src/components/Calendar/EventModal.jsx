// /src/components/calendar/EventModal.jsx
import { motion } from "framer-motion";

export default function EventModal({ event, onClose }) {
  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-[#0a1120] rounded-xl p-6 w-full max-w-md border border-white/10 shadow-xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-white mb-2">{event.title || "Untitled Event"}</h2>
        {event.description && (
          <p className="text-gray-300 mb-2">{event.description}</p>
        )}
        {event.location && (
          <p className="text-gray-400 mb-2">📍 {event.location}</p>
        )}
        {event.date && (
          <p className="text-gray-400 text-sm mb-2">
            🗓 {new Date(event.date).toLocaleString()}
          </p>
        )}
        {event.color && (
          <div className="h-3 w-20 rounded-full" style={{ backgroundColor: event.color }}></div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-[var(--accent)] text-white py-2 rounded hover:bg-opacity-80 transition"
        >
          Schließen
        </button>
      </motion.div>
    </motion.div>
  );
}
