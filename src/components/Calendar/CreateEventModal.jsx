import { useState, useEffect } from "react";
import api from "../../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-dark.css"; // Custom Dark Theme
import "./calendar.css"; // mobile (≤768px) bottom-sheet styles — no desktop rules

export default function CreateEventModal({
  open,
  onClose,
  onCreated,
  selectedDate,
  isAdmin = false,
  roles = [],
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    all_day: false,
    start_at: selectedDate || new Date(),
    end_at: selectedDate || new Date(),
  });
  // Zielgruppe: private | org | role. Nur der Org-Admin kann sie ändern —
  // normale Mitarbeiter legen immer nur private (nur-für-mich) Termine an.
  const [audience, setAudience] = useState("private");
  const [roleIds, setRoleIds] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setForm((f) => ({ ...f, start_at: selectedDate, end_at: selectedDate }));
    }
  }, [selectedDate]);

  if (!open) return null;

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleRole = (id) =>
    setRoleIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const createEvent = async () => {
    if (!form.title || !form.start_at) {
      alert("Titel und Startzeit sind Pflicht");
      return;
    }
    if (isAdmin && audience === "role" && roleIds.length === 0) {
      alert("Bitte mindestens eine Rolle auswählen");
      return;
    }
    try {
      setSaving(true);
      const eff = isAdmin ? audience : "private";
      await api.post("/calendar/events", {
        ...form,
        start_at: form.start_at.toISOString(),
        end_at: form.all_day ? form.start_at.toISOString() : form.end_at.toISOString(),
        audience: eff,
        role_ids: eff === "role" ? roleIds : null,
      });
      onCreated?.();
      onClose();
    } catch (e) {
      console.error("create event failed", e);
      alert(e?.response?.data?.detail || "Fehler beim Erstellen des Termins");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="kal-sheet-wrap fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="kal-sheet relative z-10 bg-[#0f172a] p-6 rounded-2xl w-[420px] space-y-4 border border-white/10 shadow-xl">
        <div className="kal-sheet-handle" aria-hidden="true" />
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
        <label className="kal-check flex items-center gap-2 text-sm text-gray-300">
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

        {/* SICHTBARKEIT / ZIELGRUPPE */}
        {isAdmin ? (
          <div className="space-y-2 pt-1">
            <label className="text-xs text-gray-400 block">Sichtbar für</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "private", label: "Nur ich" },
                { key: "org", label: "Ganzes Team" },
                { key: "role", label: "Rollen" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setAudience(opt.key)}
                  className={`px-2 py-2 rounded-lg text-xs font-medium border transition ${
                    audience === opt.key
                      ? "bg-[var(--accent)]/20 border-[var(--accent)]/60 text-white"
                      : "bg-gray-800 border-white/10 text-gray-300 hover:border-white/25"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {audience === "role" && (
              <div className="mt-1 max-h-32 overflow-y-auto rounded-lg border border-white/10 bg-gray-800/60 p-2 space-y-1">
                {roles.length === 0 ? (
                  <p className="text-xs text-gray-500 px-1 py-1">
                    Noch keine Rollen angelegt. Rollen unter „Team“ verwalten.
                  </p>
                ) : (
                  roles.map((r) => (
                    <label
                      key={r.id}
                      className="flex items-center gap-2 text-sm text-gray-200 px-1 py-1 cursor-pointer hover:bg-white/5 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={roleIds.includes(r.id)}
                        onChange={() => toggleRole(r.id)}
                      />
                      {r.name}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-500 pt-1">
            🔒 Dieser Termin ist nur für dich sichtbar.
          </p>
        )}

        {/* ACTIONS */}
        <div className="kal-sheet-actions flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            Abbrechen
          </button>
          <button
            onClick={createEvent}
            disabled={saving}
            className="bg-[var(--accent)] px-4 py-2 rounded-lg text-sm hover:bg-opacity-80 transition disabled:opacity-50"
          >
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}
