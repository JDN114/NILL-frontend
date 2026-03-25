import { useState, useEffect } from "react";
import api from "../../lib/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-dark.css"; // Custom Dark Theme

export default function CreateEventModal({ open, onClose, onCreated, selectedDate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    all_day: false,
    start_at: selectedDate || new Date(),
    end_at: selectedDate || new Date(),
  });

  useEffect(() => {
    if (selectedDate) {
      setForm((f) => ({ ...f, start_at: selectedDate, end_at: selectedDate }));
    }
  }, [selectedDate]);

  if (!open) return null;

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const createEvent = async () => {
    if (!form.title || !form.start_at) {
      alert("Titel und Startzeit sind Pflicht");
      return;
    }
    try {
      await api.post("/calendar/events", {
        ...form,
        start_at: form.start_at.toISOString(),
        end_at: form.all_day ? form.start_at.toISOString() : form.end_at.toISOString(),
      });
      onCreated?.();
      onClose();
    } catch (e) {
      console.error("create event failed", e);
      alert("Fehler beim Erstellen des Termins");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 bg-[#0f172a] p-6 rounded-2xl w-[420px] space-y-4 border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-white">Neuer Termin</h2>

        {/* TITLE */}
        <input
          placeholder="Titel *"
          className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Beschreibung"
          className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        {/* LOCATION */}
        <input
          placeholder="Ort"
          className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />

        {/* ALL DAY */}
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={form.all_day}
            onChange={(e) => handleChange("all_day", e.target.checked)}
          />
          Ganztägig
        </label>

        {/* DATE PICKERS */}
        <div className="space-y-2 mt-2">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Start *</label>
            <DatePicker
              selected={form.start_at}
              onChange={(date) => handleChange("start_at", date)}
              showTimeSelect={!form.all_day}
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat={form.all_day ? "dd.MM.yyyy" : "dd.MM.yyyy HH:mm"}
              className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              calendarClassName="react-datepicker-dark" // Dark popup
            />
          </div>

          {!form.all_day && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Ende</label>
              <DatePicker
                selected={form.end_at}
                onChange={(date) => handleChange("end_at", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd.MM.yyyy HH:mm"
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                calendarClassName="react-datepicker-dark"
              />
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            Abbrechen
          </button>
          <button
            onClick={createEvent}
            className="bg-[var(--accent)] px-4 py-2 rounded-lg text-sm hover:bg-opacity-80 transition"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
