import { useState } from "react";
import api from "../../lib/api";

export default function EventModal({ open, onClose, onCreated, selectedDate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    all_day: false,
    start_at: "",
    end_at: "",
  });

  if (!open) return null;

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const createEvent = async () => {
    if (!form.title || !form.start_at) {
      alert("Titel und Startzeit sind Pflicht");
      return;
    }

    try {
      await api.post("/calendar/events", {
        ...form,
        start_at: new Date(form.start_at).toISOString(),
        end_at: form.all_day
          ? new Date(form.start_at).toISOString()
          : new Date(form.end_at).toISOString(),
      });

      onCreated?.();
      onClose();
    } catch (e) {
      console.error("create event failed", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative z-10 bg-[#0f172a] p-6 rounded-2xl w-[420px] space-y-4 border border-white/10 shadow-xl">

        <h2 className="text-lg font-semibold text-white">
          Neuer Termin
        </h2>

        {/* TITLE */}
        <input
          placeholder="Titel *"
          className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white"
          onChange={(e) => handleChange("title", e.target.value)}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Beschreibung"
          className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white"
          onChange={(e) => handleChange("description", e.target.value)}
        />

        {/* LOCATION */}
        <input
          placeholder="Ort"
          className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white"
          onChange={(e) => handleChange("location", e.target.value)}
        />

        {/* ALL DAY */}
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            onChange={(e) => handleChange("all_day", e.target.checked)}
          />
          Ganztägig
        </label>

        {/* DATE PICKERS */}
        <div className="space-y-2">

          <div>
            <label className="text-xs text-gray-400">
              Start *
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white"
              onChange={(e) => handleChange("start_at", e.target.value)}
            />
          </div>

          {!form.all_day && (
            <div>
              <label className="text-xs text-gray-400">
                Ende
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white"
                onChange={(e) => handleChange("end_at", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Abbrechen
          </button>
          <button
            onClick={createEvent}
            className="bg-indigo-600 px-4 py-2 rounded-lg text-sm hover:bg-indigo-500"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
