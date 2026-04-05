
// src/pages/OnboardingPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const INDUSTRIES = [
  "Handwerk", "Reinigung", "Werkstatt", "Gastronomie",
  "Beratung", "Gesundheit", "IT & Software",
  "Handel", "Transport", "Sonstiges"
];

export default function OnboardingPage() {
  const { user, updateOrg } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Bitte gib einen Unternehmensnamen ein.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.patch("/auth/onboarding", {
        name: name.trim(),
        industry: industry || null,
      }, { withCredentials: true });
      updateOrg({ name: res.data.name, industry: res.data.industry });
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError("Fehler beim Speichern. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 border border-gray-800">
        <h1 className="text-white text-2xl font-semibold mb-1">
          Richte deinen Arbeitsbereich ein
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Das dauert weniger als eine Minute.
        </p>

        <div className="mb-4">
          <label className="text-gray-300 text-sm mb-1 block">
            Unternehmensname <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="z.B. Müller Handwerk GmbH"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-300 text-sm mb-1 block">
            Branche <span className="text-gray-500">(optional)</span>
          </label>
          <select
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-500"
          >
            <option value="">Bitte wählen…</option>
            {INDUSTRIES.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white text-gray-900 font-medium rounded-lg py-2.5 hover:bg-gray-100 transition disabled:opacity-50"
        >
          {loading ? "Wird gespeichert…" : "Weiter zum Dashboard"}
        </button>
      </div>
    </div>
  );
}
