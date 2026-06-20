import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DISMISS_KEY = "nill_trial_banner_dismissed";

export default function TrialBanner() {
  const { isTrialActive, trialDaysRemaining, org } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === "1"
  );

  if (!isTrialActive() || dismissed) return null;

  const days = trialDaysRemaining();
  const isUrgent = days <= 3;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      style={{
        background: isUrgent
          ? "linear-gradient(90deg, rgba(255,77,141,.12), rgba(255,77,141,.06))"
          : "linear-gradient(90deg, rgba(198,255,60,.08), rgba(56,245,208,.05))",
        borderBottom: `1px solid ${isUrgent ? "rgba(255,77,141,.2)" : "rgba(198,255,60,.15)"}`,
        padding: "9px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        fontSize: 13,
        fontFamily: "Inter, sans-serif",
        color: "rgba(var(--ink-tint),.8)",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <span>
          {isUrgent ? "⚠️ " : ""}
          <strong style={{ color: isUrgent ? "#ff4d8d" : "#c6ff3c" }}>
            {days === 0
              ? "Dein Testzeitraum endet heute"
              : `Noch ${days} Tag${days !== 1 ? "e" : ""} im kostenlosen Test`}
          </strong>
          {" "}— danach werden deine Daten 30 Tage lang gespeichert.
        </span>
        <button
          onClick={() => navigate("/settings?tab=abonnement")}
          style={{
            background: isUrgent ? "#ff4d8d" : "#c6ff3c",
            color: "#050505",
            border: "none",
            borderRadius: 99,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Plan wählen →
        </button>
      </div>
      <button
        onClick={dismiss}
        aria-label="Banner schließen"
        style={{
          background: "none",
          border: "none",
          color: "rgba(var(--ink-tint),.4)",
          cursor: "pointer",
          fontSize: 18,
          lineHeight: 1,
          padding: "0 4px",
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
