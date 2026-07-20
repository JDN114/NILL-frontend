import { motion } from "framer-motion";
import api from "../../services/api";
import { useState, useEffect } from "react";
import "./calendar.css"; // mobile (≤768px) bottom-sheet styles — no desktop rules

// Zielgruppen-Badge-Text
function audienceLabel(event) {
  if (event?.audience === "org") return "Ganzes Team";
  if (event?.audience === "role") {
    const names = event?.role_names?.length ? event.role_names.join(", ") : "Rollen";
    return `Rollen: ${names}`;
  }
  return "Nur ich";
}

export default function EventModal({ event, onClose, onUpdated, onDeleted, isAdmin = false, roles = [] }) {
  const [loading, setLoading] = useState(false);

  // 🔥 LOCAL STATE (Eingaben isoliert vom Originalevent)
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
  });
  const [audience, setAudience] = useState("private");
  const [roleIds, setRoleIds] = useState([]);

  // 🔥 Sync wenn Modal geöffnet wird
  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
      });
      setAudience(event.audience || "private");
      setRoleIds(Array.isArray(event.role_ids) ? event.role_ids.map(String) : []);
    }
  }, [event]);

  if (!event) return null;

  // Team-/Rollen-Termine sind nur vom Org-Admin bearbeitbar (Server liefert `editable`).
  const canEdit = event.editable !== false;
  const toggleRole = (id) =>
    setRoleIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

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
      alert(e?.response?.data?.detail || "Löschen fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (isAdmin && audience === "role" && roleIds.length === 0) {
      alert("Bitte mindestens eine Rolle auswählen");
      return;
    }
    try {
      setLoading(true);

      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
      };
      // Nur der Admin darf die Zielgruppe ändern.
      if (isAdmin) {
        payload.audience = audience;
        payload.role_ids = audience === "role" ? roleIds : null;
      }

      await api.put(`/calendar/events/${event.id}`, payload);

      onUpdated?.();
      onClose();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.detail || "Update fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // RENDER — READ-ONLY (nicht bearbeitbar)
  // -------------------------
  if (!canEdit) {
    return (
      <motion.div
        className="kal-sheet-wrap fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div className="kal-sheet bg-[#0a1120] p-6 rounded-xl w-full max-w-md border border-white/10 shadow-xl">
          <div className="kal-sheet-handle" aria-hidden="true" />

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">{event.title || "Termin"}</h2>
            <span className="text-[0.65rem] font-semibold px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
              {audienceLabel(event)}
            </span>
          </div>

          {event.description && (
            <p className="text-sm text-gray-300 mb-3 whitespace-pre-wrap">{event.description}</p>
          )}
          {event.location && <p className="text-xs text-gray-400 mb-3">📍 {event.location}</p>}

          <p className="text-xs text-gray-500 mb-4">
            🔒 Dieser Termin wurde von deinem Org-Admin eingeplant und kann nur von ihm bearbeitet werden.
          </p>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 px-3 py-2 rounded text-white hover:bg-gray-500 transition"
            >
              Schließen
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // -------------------------
  // RENDER — EDITIERBAR
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

        {/* ZIELGRUPPE — nur Admin */}
        {isAdmin && (
          <div className="mb-4 space-y-2">
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
                      : "bg-[#111827] border-white/10 text-gray-300 hover:border-white/25"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {audience === "role" && (
              <div className="mt-1 max-h-32 overflow-y-auto rounded-lg border border-white/10 bg-[#111827] p-2 space-y-1">
                {roles.length === 0 ? (
                  <p className="text-xs text-gray-500 px-1 py-1">Keine Rollen vorhanden.</p>
                ) : (
                  roles.map((r) => (
                    <label
                      key={r.id}
                      className="flex items-center gap-2 text-sm text-gray-200 px-1 py-1 cursor-pointer hover:bg-white/5 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={roleIds.includes(String(r.id))}
                        onChange={() => toggleRole(String(r.id))}
                      />
                      {r.name}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div className="kal-sheet-actions flex justify-between gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500/90 px-3 py-2 rounded text-white hover:bg-red-500 transition disabled:opacity-50"
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
