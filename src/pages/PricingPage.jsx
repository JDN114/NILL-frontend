import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://api.nillai.de";

// ─── Design tokens (matches LandingPage) ─────────────────────────────────────
const bg      = "#040407";
const bg2     = "#08080c";
const ink     = "#efede7";
const inkDim  = "rgba(239,237,231,0.5)";
const inkFaint= "rgba(239,237,231,0.14)";
const line    = "rgba(239,237,231,0.07)";
const glass   = "rgba(255,255,255,0.035)";
const accent  = "#c6ff3c";
const serif   = "'Fraunces','Iowan Old Style',Georgia,serif";
const mono    = "'JetBrains Mono',monospace";
const sans    = "'Inter',system-ui,sans-serif";
const radius  = 28;
const ease    = "cubic-bezier(.16,1,.3,1)";

// ─── Plan data ────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "solo",
    title: "Solo",
    subtitle: "Für Einzelunternehmer & kleine Büros",
    seats: "1–2 Personen",
    monthlyPrice: 25,
    yearlyPrice: 240,
    features: [
      "NILL KI-Sekretärin (unbegrenzte Anfragen)",
      "E-Mail-Integration: Gmail, Outlook & IMAP",
      "Intelligenter Kalender & Aufgaben",
      "Buchhaltung mit OCR-Belegerfassung",
      "Automatische Steuer- & Kategorieextraktion",
      "Rechnungserstellung & PDF-Export",
    ],
  },
  {
    id: "team",
    title: "Team",
    subtitle: "Für wachsende Teams & KMUs",
    seats: "3–10 Personen",
    monthlyPrice: 50,
    yearlyPrice: 480,
    pop: true,
    features: [
      "Alles aus Solo — für bis zu 10 Nutzer",
      "Lohnbuchhaltung & Mitarbeiterverwaltung",
      "Arbeitszeiterfassung & digitale Stempeluhr",
      "Urlaubs- & Abwesenheitsverwaltung",
      "Team-Aufgaben mit Deadline-Erinnerungen",
      "HR-Dokumente & automatische Lohnabrechnungen",
    ],
  },
  {
    id: "business",
    title: "Business",
    subtitle: "Für größere Unternehmen & Agenturen",
    seats: "10+ Personen",
    monthlyPrice: 90,
    yearlyPrice: 864,
    features: [
      "Alles aus Team — unbegrenzte Nutzerzahl",
      "API-Zugang & Webhooks (folgt Q4 2026)",
      "Erweiterte KI-Automatisierungen",
      "Priorisierter Support mit SLA-Garantie",
      "Nutzungsanalysen & individuelle Berichte (folgt Q4 2026)",
    ],
  },
];

const FAQ = [
  {
    q: "Kann ich den Plan jederzeit wechseln?",
    a: "Ja. Sie können jederzeit upgraden oder downgraden. Änderungen werden zum nächsten Abrechnungszeitraum wirksam.",
  },
  {
    q: "Was passiert nach dem kostenlosen Test?",
    a: "Nach der Testphase wählen Sie einen Plan, der zu Ihrem Team passt. Ihre Daten bleiben vollständig erhalten.",
  },
  {
    q: "Sind die Preise inkl. Mehrwertsteuer?",
    a: "Alle genannten Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer. Die Abrechnung erfolgt monatlich oder jährlich.",
  },
  {
    q: "Gibt es einen Enterprise-Plan für größere Teams?",
    a: "Ab 20+ Nutzern erstellen wir gerne ein individuelles Angebot. Kontaktieren Sie uns unter info@nillai.de.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckDot({ pop }) {
  return (
    <span style={{
      width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
      marginTop: 3,
      background: pop
        ? `radial-gradient(circle, ${accent} 0 35%, transparent 36%)`
        : `radial-gradient(circle, ${inkDim} 0 35%, transparent 36%)`,
      border: pop
        ? `1px solid rgba(198,255,60,0.4)`
        : `1px solid rgba(239,237,231,0.22)`,
    }} />
  );
}

function PlanCard({ plan, cycle, loading, onCheckout }) {
  const [hov, setHov] = useState(false);
  const price = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        padding: "34px",
        borderRadius: radius,
        border: plan.pop
          ? `1px solid rgba(198,255,60,${hov ? "0.6" : "0.4"})`
          : `1px solid rgba(239,237,231,${hov ? "0.14" : "0.07"})`,
        background: plan.pop
          ? "radial-gradient(120% 80% at 0% 0%, rgba(198,255,60,0.07), transparent 50%), linear-gradient(180deg,#0c0d08,#070805)"
          : `linear-gradient(180deg,#0a0a0e,#060609)`,
        boxShadow: plan.pop
          ? `0 30px 80px rgba(198,255,60,${hov ? "0.12" : "0.07"})`
          : hov ? "0 20px 60px rgba(0,0,0,0.5)" : "none",
        display: "flex", flexDirection: "column", gap: 22,
        transition: `border-color 0.3s, box-shadow 0.5s, transform 0.5s ${ease}`,
        transform: hov ? "translateY(-4px)" : "none",
        fontFamily: sans,
      }}
    >
      {/* Popular chip */}
      {plan.pop && (
        <div style={{
          position: "absolute", top: -12, left: 28,
          padding: "6px 14px", borderRadius: 99,
          background: accent, color: "#000",
          fontFamily: mono, fontSize: 11,
          letterSpacing: "0.16em", textTransform: "uppercase",
          fontWeight: 600,
        }}>
          Beliebteste Wahl
        </div>
      )}

      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{
            fontFamily: mono, fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: plan.pop ? accent : inkDim,
          }}>
            {plan.seats}
          </span>
        </div>
        <div style={{ fontFamily: serif, fontSize: 32, letterSpacing: "-0.02em", color: ink, lineHeight: 1 }}>
          {plan.title}
        </div>
        <div style={{ fontSize: 13, color: inkDim, marginTop: 6, lineHeight: 1.4 }}>
          {plan.subtitle}
        </div>
      </div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{
          fontFamily: serif, fontSize: 68, letterSpacing: "-0.04em",
          lineHeight: 1, color: ink,
        }}>
          {price}€
        </span>
        <span style={{ fontFamily: mono, fontSize: 12, color: inkDim, letterSpacing: "0.1em" }}>
          / {cycle === "yearly" ? "Jahr" : "Monat"}
        </span>
      </div>
      {cycle === "yearly" && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          marginTop: -14,
          padding: "4px 10px", borderRadius: 99,
          background: "rgba(198,255,60,0.1)",
          border: "1px solid rgba(198,255,60,0.25)",
          color: accent, fontFamily: mono, fontSize: 11, letterSpacing: "0.1em",
          width: "fit-content",
        }}>
          2 Monate gratis
        </div>
      )}

      {/* Features */}
      <ul style={{
        listStyle: "none", padding: 0, margin: 0,
        paddingTop: 18,
        borderTop: `1px solid ${line}`,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: ink, lineHeight: 1.45 }}>
            <CheckDot pop={plan.pop} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onCheckout(plan.id)}
        disabled={!!loading}
        style={{
          marginTop: "auto",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "14px 22px", borderRadius: 99,
          fontSize: 14, fontWeight: 600, fontFamily: sans,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading && loading !== plan.id ? 0.5 : 1,
          border: plan.pop ? "none" : `1px solid ${line}`,
          background: plan.pop ? accent : "transparent",
          color: plan.pop ? "#000" : ink,
          transition: "background 0.2s, color 0.2s, border-color 0.2s",
        }}
        onMouseOver={e => {
          if (!loading) {
            if (plan.pop) { e.currentTarget.style.background = "#fff"; }
            else { e.currentTarget.style.background = glass; e.currentTarget.style.borderColor = inkFaint; }
          }
        }}
        onMouseOut={e => {
          if (plan.pop) { e.currentTarget.style.background = accent; }
          else { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = line; }
        }}
      >
        {loading === plan.id ? "Weiterleitung…" : "Jetzt starten"}
        {!loading && (
          <span style={{ display: "inline-block", transition: `transform 0.3s ${ease}` }}
            onMouseOver={e => e.currentTarget.style.transform = "translateX(4px)"}
            onMouseOut={e => e.currentTarget.style.transform = "none"}
          >→</span>
        )}
      </button>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: `1px solid ${line}`,
        padding: "22px 4px",
        cursor: "pointer",
        background: open ? "linear-gradient(to right, rgba(198,255,60,0.02), transparent 60%)" : "transparent",
        transition: "background 0.3s",
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24,
        fontFamily: serif, fontSize: "clamp(18px, 2vw, 24px)", letterSpacing: "-0.015em", color: ink,
      }}>
        {q}
        <span style={{
          fontFamily: mono, fontSize: 24, color: accent,
          transform: open ? "rotate(45deg)" : "none",
          transition: "transform 0.3s", flexShrink: 0,
        }}>+</span>
      </div>
      {open && (
        <p style={{ marginTop: 14, fontSize: 15, color: inkDim, maxWidth: "70ch", lineHeight: 1.6 }}>
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PricingPage() {
  const navigate = useNavigate();
  const [cycle, setCycle] = useState("monthly");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for nav blur
  useState(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  });

  const handleCheckout = async (planId) => {
    setError(null);
    setLoadingPlan(planId);
    try {
      const res = await axios.post(
        `${API_URL}/billing/create-checkout-session`,
        { plan: planId, billing_cycle: cycle },
        { withCredentials: true }
      );
      if (res?.data?.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else {
        setError("Checkout konnte nicht gestartet werden.");
      }
    } catch (e) {
      const detail = e.response?.data?.error || e.response?.data?.detail;
      setError(detail || "Zahlungsvorgang derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div style={{ background: bg, color: ink, fontFamily: sans, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
        padding: "18px 0",
        backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
        background: scrolled ? "rgba(8,8,10,0.55)" : "transparent",
        borderBottom: scrolled ? `1px solid ${line}` : "1px solid transparent",
        transition: "backdrop-filter 0.4s, background 0.4s, border-color 0.4s",
      }}>
        <div style={{
          width: "min(1280px, 100% - 48px)", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        }}>
          <Link to="/" style={{
            display: "flex", alignItems: "center", gap: 12,
            fontFamily: serif, fontSize: 22, letterSpacing: "-0.02em", color: ink,
            textDecoration: "none",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `conic-gradient(from 210deg, ${accent}, #38f5d0, #7a5cff, #ff4d8d, ${accent})`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 4, borderRadius: 5, background: bg,
              }} />
            </div>
            NILL
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link to="/login" style={{
              fontSize: 13, color: ink, padding: "9px 16px", borderRadius: 99,
              border: `1px solid ${line}`, background: "transparent",
              textDecoration: "none",
              transition: "border-color 0.25s, background 0.25s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = ink; e.currentTarget.style.background = glass; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = line; e.currentTarget.style.background = "transparent"; }}
            >
              Anmelden
            </Link>
            <Link to="/register" style={{
              fontSize: 13, color: "#050505", padding: "9px 16px", borderRadius: 99,
              background: accent, border: `1px solid ${accent}`,
              textDecoration: "none",
              transition: "background 0.25s",
            }}
              onMouseOver={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#fff"; }}
              onMouseOut={e => { e.currentTarget.style.background = accent; e.currentTarget.style.borderColor = accent; }}
            >
              Kostenlos starten
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "160px 0 80px" }}>
        <div style={{ width: "min(1280px, 100% - 48px)", margin: "0 auto", textAlign: "center" }}>

          {/* Eyebrow */}
          <div style={{
            fontFamily: mono, fontSize: 11, letterSpacing: "0.22em",
            textTransform: "uppercase", color: inkDim,
            display: "inline-flex", alignItems: "center", gap: 10,
            marginBottom: 24,
          }}>
            <span style={{ width: 22, height: 1, background: inkDim, display: "inline-block", opacity: 0.6 }} />
            Preise & Pläne
          </div>

          <h1 style={{
            fontFamily: serif, fontWeight: 400,
            fontSize: "clamp(48px, 8vw, 112px)",
            letterSpacing: "-0.025em", lineHeight: 0.95,
            margin: "0 0 28px",
            color: ink,
          }}>
            Der richtige Plan<br />
            <em style={{ fontStyle: "italic", color: accent }}>für jede Größe</em>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.55,
            color: inkDim, maxWidth: "56ch", margin: "0 auto 52px",
          }}>
            Von Einzelunternehmern bis zum wachsenden Team — NILL wächst mit Ihnen.
            Transparent, ohne versteckte Kosten, monatlich kündbar.
          </p>

          {/* Billing toggle */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 72 }}>
            <div style={{
              display: "inline-flex",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${line}`,
              borderRadius: 99, padding: 4, gap: 4,
            }}>
            {["monthly", "yearly"].map(c => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                style={{
                  padding: "9px 20px", borderRadius: 99, border: "none",
                  fontFamily: sans, fontSize: 13, fontWeight: 500, cursor: "pointer",
                  transition: `background 0.2s, color 0.2s`,
                  background: cycle === c ? accent : "transparent",
                  color: cycle === c ? "#000" : inkDim,
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                {c === "monthly" ? "Monatlich" : (
                  <>
                    Jährlich
                    <span style={{
                      fontSize: 10, fontFamily: mono, letterSpacing: "0.1em",
                      background: "rgba(198,255,60,0.15)",
                      border: "1px solid rgba(198,255,60,0.3)",
                      color: accent, padding: "2px 7px", borderRadius: 99,
                    }}>
                      −2 Mo.
                    </span>
                  </>
                )}
              </button>
            ))}
            </div>
            {cycle === "yearly" && (
              <p style={{ fontFamily: mono, fontSize: 11, color: inkDim, letterSpacing: "0.1em", margin: 0 }}>
                Jährliche Abrechnung — einmal jährlich in Rechnung gestellt · 2 Monate gratis
              </p>
            )}
          </div>

          {error && (
            <div style={{
              marginBottom: 32, padding: "14px 20px",
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 12, color: "#f87171", fontSize: 14,
            }}>
              {error}
            </div>
          )}

          {/* Plan cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
            perspective: 1400,
            textAlign: "left",
          }}>
            {PLANS.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                cycle={cycle}
                loading={loadingPlan}
                onCheckout={handleCheckout}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ── Feature comparison note ────────────────────────────────────── */}
      <section style={{ padding: "0 0 80px" }}>
        <div style={{ width: "min(1280px, 100% - 48px)", margin: "0 auto" }}>
          <div style={{
            padding: "44px",
            borderRadius: radius,
            border: `1px solid rgba(198,255,60,0.18)`,
            background: "radial-gradient(60% 90% at 100% 0%, rgba(198,255,60,0.06), transparent 60%), linear-gradient(180deg, rgba(198,255,60,0.02), transparent)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            gap: 30, flexWrap: "wrap",
          }}>
            <div>
              <div style={{
                fontFamily: mono, fontSize: 11, letterSpacing: "0.2em",
                textTransform: "uppercase", color: accent, marginBottom: 10,
              }}>
                Enterprise & Großunternehmen
              </div>
              <p style={{
                fontFamily: serif, fontSize: "clamp(20px, 2.2vw, 28px)",
                letterSpacing: "-0.015em", lineHeight: 1.25,
                color: ink, maxWidth: "52ch", margin: 0,
                fontWeight: 400,
              }}>
                Benötigen Sie mehr als 20 Nutzer, individuelle Integrationen oder
                dediziertes Hosting? Wir erstellen Ihnen{" "}
                <em style={{ fontStyle: "italic", color: accent }}>gerne ein persönliches Angebot.</em>
              </p>
            </div>
            <a
              href="mailto:info@nillai.de?subject=Enterprise-Anfrage"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 26px", borderRadius: 99,
                fontFamily: sans, fontSize: 14, fontWeight: 600,
                background: accent, color: "#000",
                textDecoration: "none", flexShrink: 0,
                transition: "background 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#fff"; }}
              onMouseOut={e => { e.currentTarget.style.background = accent; }}
            >
              Kontakt aufnehmen →
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 0 120px" }}>
        <div style={{ width: "min(840px, 100% - 48px)", margin: "0 auto" }}>
          <div style={{
            fontFamily: mono, fontSize: 11, letterSpacing: "0.22em",
            textTransform: "uppercase", color: inkDim,
            display: "inline-flex", alignItems: "center", gap: 10,
            marginBottom: 24,
          }}>
            <span style={{ width: 22, height: 1, background: inkDim, display: "inline-block", opacity: 0.6 }} />
            FAQ
          </div>
          <h2 style={{
            fontFamily: serif, fontWeight: 400,
            fontSize: "clamp(32px, 4vw, 56px)",
            letterSpacing: "-0.02em", lineHeight: 1.05,
            color: ink, margin: "0 0 48px",
          }}>
            Häufige Fragen
          </h2>
          <div style={{ borderTop: `1px solid ${line}` }}>
            {FAQ.map((item, i) => <FaqItem key={i} {...item} />)}
          </div>
        </div>
      </section>

      {/* ── Footer note ─────────────────────────────────────────────────── */}
      <div style={{
        borderTop: `1px solid ${line}`,
        padding: "32px 0",
        textAlign: "center",
      }}>
        <div style={{ width: "min(1280px, 100% - 48px)", margin: "0 auto" }}>
          <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: inkDim, margin: 0 }}>
            Alle Preise zzgl. gesetzlicher MwSt. · Monatlich kündbar · SSL-verschlüsselt · DSGVO-konform
          </p>
        </div>
      </div>

    </div>
  );
}
