import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

const values = [
  {
    n: "01",
    title: "Integrität",
    text: "Transparenz gegenüber Kunden, Partnern und der Gesellschaft. Wir stehen für das, was wir bauen.",
  },
  {
    n: "02",
    title: "Exzellenz",
    text: "Kein Kompromiss bei Qualität. Jedes Feature wird gebaut, bis es sich richtig anfühlt.",
  },
  {
    n: "03",
    title: "Verantwortung",
    text: "KI, die Menschen stärkt — nicht verdrängt. Klimaneutral, DSGVO-konform, in Deutschland gehostet.",
  },
];

const facts = [
  { label: "Gegründet", value: "2024" },
  { label: "Standort", value: "Frankfurt a.M." },
  { label: "Hosting", value: "Deutschland · 100 % Ökostrom" },
  { label: "Rechtsform", value: "Einzelunternehmen" },
];

export default function AboutUsPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--ink)" }}>

      {/* ── HERO ── */}
      <section style={{
        padding: "clamp(80px,14vw,160px) 0 clamp(60px,8vw,100px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(198,255,60,0.07) 0%, transparent 70%)",
        }} />
        <div className="wrap" style={{ position: "relative" }}>
          <span className="eyebrow" style={{ marginBottom: 24, display: "inline-flex" }}>
            <span style={{ width: 24, height: 1, background: "var(--accent)", display: "inline-block" }} />
            Über uns
          </span>
          <h1 style={{
            fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 800, lineHeight: 1.05,
            letterSpacing: "-0.03em", margin: "0 auto 1.5rem",
            maxWidth: "18ch",
          }}>
            Technologie, die <em style={{ fontStyle: "italic", color: "var(--accent)" }}>arbeitet.</em>
          </h1>
          <p className="lead" style={{ margin: "0 auto", textAlign: "center" }}>
            NILL ist das KI-Betriebssystem für Unternehmen — gebaut von einem Gründer,
            der glaubt, dass gute Technologie Arbeit nicht ersetzt, sondern zurückgibt.
          </p>
        </div>
      </section>

      {/* ── GRÜNDER ── */}
      <section style={{ padding: "clamp(60px,8vw,100px) 0", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,6vw,5rem)",
            alignItems: "center",
          }}>
            <div>
              <span className="eyebrow" style={{ marginBottom: 20, display: "inline-flex" }}>
                <span style={{ width: 24, height: 1, background: "var(--accent)", display: "inline-block" }} />
                Der Gründer
              </span>
              <h2 style={{
                fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 800,
                letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "1.25rem",
              }}>
                Julian David Nill
              </h2>
              <p style={{ marginBottom: "1rem" }}>
                Aufgewachsen in der Region Tübingen, geprägt durch Sport, Physik und den Ehrgeiz,
                Probleme nicht zu umgehen — sondern zu lösen. Drei Jahre Jugendbundesliga American Football
                haben mir beigebracht, was Teamarbeit und Disziplin wirklich bedeuten.
              </p>
              <p style={{ marginBottom: "2rem" }}>
                NILL entstand aus einer einfachen Frage: <em style={{ color: "var(--ink)", fontStyle: "italic" }}>Warum
                verschwenden so viele Unternehmen Stunden mit Aufgaben, die ein System übernehmen könnte?</em> Die
                Antwort ist das Produkt, das du heute nutzt.
              </p>
              <blockquote style={{
                borderLeft: "2px solid var(--accent)", paddingLeft: "1.25rem",
                margin: 0, fontStyle: "italic", color: "var(--ink-dim)",
                fontSize: "0.95rem", lineHeight: 1.6,
              }}>
                „Mensch &amp; Maschine — gemeinsam stärker als allein.&quot;
              </blockquote>
            </div>

            {/* Fakten-Box */}
            <div style={{
              background: "var(--glass-strong)", border: "1px solid var(--line)",
              borderRadius: 20, padding: "clamp(1.5rem,3vw,2.5rem)",
              backdropFilter: "blur(12px)",
            }}>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--ink-dim)", marginBottom: "1.5rem",
              }}>
                NILL AI — Unternehmensinfo
              </div>
              {facts.map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.9rem 0", borderBottom: "1px solid var(--line)",
                }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--ink-dim)" }}>{label}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink)" }}>{value}</span>
                </div>
              ))}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.9rem 0",
              }}>
                <span style={{ fontSize: "0.8rem", color: "var(--ink-dim)" }}>Inhaber</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink)" }}>Julian David Nill</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WERTE ── */}
      <section style={{ padding: "clamp(60px,8vw,100px) 0", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem,5vw,4rem)" }}>
            <span className="eyebrow" style={{ marginBottom: 16, display: "inline-flex" }}>
              <span style={{ width: 24, height: 1, background: "var(--accent)", display: "inline-block" }} />
              Unsere Werte
            </span>
            <h2 style={{
              fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 800,
              letterSpacing: "-0.025em", margin: "0.5rem 0 0",
            }}>
              Woran wir uns messen lassen.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }}>
            {values.map(({ n, title, text }) => (
              <div key={n} style={{
                background: "var(--glass)", border: "1px solid var(--line)",
                borderRadius: 16, padding: "clamp(1.25rem,2.5vw,2rem)",
                display: "flex", flexDirection: "column", gap: "0.75rem",
              }}>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "var(--accent)",
                }}>
                  {n}
                </span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--ink-dim)", margin: 0, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section style={{
        padding: "clamp(60px,8vw,100px) 0",
        borderTop: "1px solid var(--line)",
        textAlign: "center",
      }}>
        <div className="wrap" style={{ maxWidth: 700 }}>
          <span className="eyebrow" style={{ marginBottom: 20, display: "inline-flex" }}>
            <span style={{ width: 24, height: 1, background: "var(--accent)", display: "inline-block" }} />
            Mission
          </span>
          <h2 style={{
            fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 800,
            letterSpacing: "-0.025em", marginBottom: "1.25rem",
          }}>
            NILL — <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Neural Intelligence for Less Labour</em>
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            Monotone Arbeit automatisieren — damit Zeit für Kreativität, Innovation und Menschlichkeit bleibt.
            KI soll nicht ersetzen, sondern befähigen.
          </p>
          <p>
            Postfach, Buchhaltung, Inventur, Zeiterfassung und Teamverwaltung in einem System.
            Gebaut in Deutschland. Gehostet in Frankfurt. Klimaneutral.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "2.5rem" }}>
            <Link to="/" style={{
              padding: "12px 24px", borderRadius: 99,
              background: "var(--accent)", color: "#050505",
              fontWeight: 700, fontSize: "0.85rem", textDecoration: "none",
            }}>
              Produkt entdecken
            </Link>
            <Link to="/Impressum" style={{
              padding: "12px 24px", borderRadius: 99,
              border: "1px solid var(--line)", color: "var(--ink)",
              fontSize: "0.85rem", textDecoration: "none",
            }}>
              Impressum
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
