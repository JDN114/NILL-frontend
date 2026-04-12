// src/pages/UpgradePage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useState } from "react";
import PageLayout from "../components/layout/PageLayout";

const MODULE_LABELS = {
  accounting: "Buchhaltung",
  calendar:   "Kalender",
  email:      "E-Mail",
  api:        "API-Zugang",
};

const FEATURE_LABELS = {
  accounting: "Buchhaltung",
  calendar:   "Kalender",
  email:      "E-Mail",
  schedules:  "Dienstplan",
  documents:  "Dokumente",
  inventory:  "Inventar",
  wages:      "Lohn",
};

const PLAN_INFO = {
  solo: {
    label: "Solo",
    next: "Team",
    nextKey: "team",
    description: "Für Teams mit bis zu 10 Mitarbeitern und erweiterten Modulen.",
  },
  team: {
    label: "Team",
    next: "Business",
    nextKey: "business",
    description: "Für größere Unternehmen mit API-Zugang und unbegrenzten Nutzern.",
  },
  business: {
    label: "Business",
    next: null,
    nextKey: null,
    description: "Du hast bereits den höchsten Plan.",
  },
};

export default function UpgradePage() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { org, isCompanyAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const { from, feature, module: mod, reason } = location.state ?? {};

  // Fallback: wenn kein state vorhanden (z.B. direkter URL-Aufruf)
  const backTarget = from ?? "/dashboard";

  const blockedLabel =
    reason === "module"
      ? MODULE_LABELS[mod]      ?? mod      ?? "dieses Modul"
      : FEATURE_LABELS[feature] ?? feature  ?? "diese Funktion";

  const planInfo   = PLAN_INFO[org?.plan] ?? null;
  const canUpgrade = isCompanyAdmin?.() && planInfo?.nextKey;

  const handlePortal = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/billing/portal", { withCredentials: true });
      window.location.href = res.data.url;
    } catch {
      setError("Stripe Portal konnte nicht geladen werden. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 text-center">

          {/* Lock icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
              <svg className="w-9 h-9 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.5 10.5V7a4.5 4.5 0 10-9 0v3.5M5.25 10.5h13.5A1.75 1.75 0 0120.5 12.25v7A1.75 1.75 0 0118.75 21H5.25A1.75 1.75 0 013.5 19.25v-7A1.75 1.75 0 015.25 10.5z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">
              Kein Zugriff auf {blockedLabel}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              {reason === "module" ? (
                <>
                  <span className="text-white font-medium">{blockedLabel}</span> ist im aktuellen Plan{" "}
                  <span className="text-white font-medium capitalize">{org?.plan ?? "—"}</span> nicht enthalten.
                  {canUpgrade && " Upgrade auf einen höheren Plan um dieses Modul freizuschalten."}
                </>
              ) : (
                <>
                  Deine Rolle gibt dir keinen Zugriff auf{" "}
                  <span className="text-white font-medium">{blockedLabel}</span>.
                  Wende dich an deinen Administrator.
                </>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">

            {/* Upgrade CTA — nur Company Admin + upgradefähiger Plan + module-block */}
            {canUpgrade && reason === "module" && (
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase tracking-widest">Nächster Plan</span>
                  <span className="text-xs font-semibold text-white bg-white/10 px-2 py-0.5 rounded-full">
                    {planInfo.next}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{planInfo.description}</p>
                <button
                  onClick={handlePortal}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl font-medium bg-white text-gray-900 hover:bg-gray-100 transition disabled:opacity-50 text-sm"
                >
                  {loading ? "Wird geladen…" : `Auf ${planInfo.next} upgraden →`}
                </button>
              </div>
            )}

            {/* Feature-block: Hinweis an Admin */}
            {reason === "feature" && (
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 text-left">
                <p className="text-sm text-gray-400">
                  Berechtigungen werden von deinem Company Admin in{" "}
                  <span className="text-white">Workflow → Team → Rollen</span> vergeben.
                </p>
              </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Zurück — immer funktionierend */}
            <button
              onClick={() => navigate(backTarget)}
              className="w-full py-2.5 rounded-xl font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 transition text-sm"
            >
              ← Zurück zum Dashboard
            </button>

          </div>
        </div>
      </div>
    </PageLayout>
  );
}
