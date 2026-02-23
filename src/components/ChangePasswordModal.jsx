import { useState } from "react";
import api from "../services/api";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post("/me/change-password", { old_password: oldPassword, new_password: newPassword });
      setSuccess("Passwort erfolgreich geändert!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.detail || "Fehler beim Ändern des Passworts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
        <h2 className="text-xl font-bold text-white">Passwort ändern</h2>

        <input
          type="password"
          placeholder="Altes Passwort"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white"
        />
        <input
          type="password"
          placeholder="Neues Passwort"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <div className="flex justify-between">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">Abbrechen</button>
          <button onClick={handleSubmit} disabled={loading} className="px-5 py-2 rounded-xl bg-[var(--nill-primary)] hover:bg-[var(--nill-primary-hover)] text-white transition">
            {loading ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}
