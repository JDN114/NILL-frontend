import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TrialBanner() {
  const { isTrialActive, trialDaysRemaining } = useAuth();
  const navigate = useNavigate();

  if (!isTrialActive()) return null;

  const days = trialDaysRemaining();
  const isUrgent = days <= 3;

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
        justifyContent: "center",
        gap: 16,
        fontSize: 13,
        fontFamily: "Inter, sans-serif",
        color: "rgba(var(--ink-tint),.8)",
        flexWrap: "wrap",
      }}
    >
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
        onClick={() => navigate("/pricing")}
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
  );
}
