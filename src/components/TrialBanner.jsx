import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DISMISS_KEY = "nill_trial_banner_dismissed";

/* Dark mode keeps the existing neon palette.
   Light mode flips to warm gold (normal) and terracotta (urgent) —
   both sit naturally on the bone-white dashboard surface.            */
const S = `
  .tb-root {
    padding: 9px 20px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    font-size: 13px; font-family: "Inter", sans-serif;
    color: rgba(var(--ink-tint), .8);
    flex-wrap: wrap;
  }

  /* ── Normal ─────────────────────────────────────────────────────── */
  .tb-normal {
    background: linear-gradient(90deg, rgba(198,255,60,.08), rgba(56,245,208,.05));
    border-bottom: 1px solid rgba(198,255,60,.15);
  }
  html[data-theme="light"] .tb-normal {
    background: linear-gradient(90deg, rgba(128,98,40,.09), rgba(128,98,40,.03));
    border-bottom: 1px solid rgba(128,98,40,.22);
  }

  /* ── Urgent ─────────────────────────────────────────────────────── */
  .tb-urgent {
    background: linear-gradient(90deg, rgba(255,77,141,.12), rgba(255,77,141,.06));
    border-bottom: 1px solid rgba(255,77,141,.2);
  }
  html[data-theme="light"] .tb-urgent {
    background: linear-gradient(90deg, rgba(190,60,40,.1), rgba(190,60,40,.04));
    border-bottom: 1px solid rgba(190,60,40,.22);
  }

  /* ── Accent text ─────────────────────────────────────────────────── */
  .tb-accent-normal { color: #c6ff3c; }
  .tb-accent-urgent { color: #ff4d8d; }
  html[data-theme="light"] .tb-accent-normal { color: #806228; }
  html[data-theme="light"] .tb-accent-urgent { color: #be3c28; }

  /* ── CTA button ──────────────────────────────────────────────────── */
  .tb-cta {
    border: none; border-radius: 99px;
    padding: 5px 14px; font-size: 12px; font-weight: 600;
    cursor: pointer; white-space: nowrap; font-family: "Inter", sans-serif;
    transition: opacity .15s;
  }
  .tb-cta:hover { opacity: .85; }
  .tb-cta-normal { background: #c6ff3c; color: #050505; }
  .tb-cta-urgent { background: #ff4d8d; color: #fff; }
  html[data-theme="light"] .tb-cta-normal { background: #806228; color: #f5efe0; }
  html[data-theme="light"] .tb-cta-urgent { background: #be3c28; color: #fff; }

  /* ── Dismiss ─────────────────────────────────────────────────────── */
  .tb-dismiss {
    background: none; border: none; cursor: pointer; font-size: 18px;
    color: rgba(var(--ink-tint), .4); line-height: 1; padding: 0 4px; flex-shrink: 0;
    transition: color .15s;
  }
  .tb-dismiss:hover { color: rgba(var(--ink-tint), .75); }
`;

export default function TrialBanner() {
  const { isTrialActive, trialDaysRemaining } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === "1"
  );

  if (!isTrialActive() || dismissed) return null;

  const days = trialDaysRemaining();
  const isUrgent = days <= 3;
  const variant = isUrgent ? "urgent" : "normal";

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <>
      <style>{S}</style>
      <div className={`tb-root tb-${variant}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span>
            {isUrgent && "⚠️ "}
            <strong className={`tb-accent-${variant}`}>
              {days === 0
                ? "Dein Testzeitraum endet heute"
                : `Noch ${days} Tag${days !== 1 ? "e" : ""} im kostenlosen Test`}
            </strong>
            {" "}— danach werden deine Daten 30 Tage lang gespeichert.
          </span>
          <button
            className={`tb-cta tb-cta-${variant}`}
            onClick={() => navigate("/settings?tab=abonnement")}
          >
            Plan wählen →
          </button>
        </div>
        <button className="tb-dismiss" onClick={dismiss} aria-label="Banner schließen">
          ×
        </button>
      </div>
    </>
  );
}
