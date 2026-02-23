import { useState } from "react";
import api from "../services/api";

export default function DeleteAccountModal({ isOpen, onClose }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      // ❗ POST statt DELETE
      await api.post("/me/delete-account", { password });

      // Optional: nach Löschung ausloggen / redirect
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.detail || "Fehler beim Löschen des Accounts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
        <h2 className="text-xl font-bold text-white">Account löschen</h2>
        <p className="text-gray-400 text-sm">Diese Aktion kann nicht rückgängig gemacht werden.</p>

        <input
          type="password"
          placeholder="Passwort eingeben"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            Abbrechen
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || !password}
            className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white transition"
          >
            {loading ? "Löscht…" : "Löschen"}
          </button>
        </div>
      </div>
    </div>
  );
}
