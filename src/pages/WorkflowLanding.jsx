import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";

const MODULES = [
  {
    title: "Team",
    description: "Mitglieder, Rollen & Einladungen verwalten",
    to: "/dashboard/workflow/team",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: "Aufgaben",
    description: "Aufgaben erstellen, zuweisen & verfolgen",
    to: "/dashboard/workflow/tasks",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    title: "Zeiterfassung",
    description: "Arbeitszeiten & Monatsübersicht",
    to: "/dashboard/workflow/time",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: "Lieferscheine",
    description: "Dokumente & Inventur-Belege",
    to: "/dashboard/workflow/delivery-notes",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

export default function WorkflowLanding() {
  return (
    <PageLayout>

      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <span style={{
          fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--nill-text-dim)",
        }}>
          Dashboard / Betrieb
        </span>
        <h1 style={{
          fontSize: "1.85rem", fontWeight: 800, margin: "0.25rem 0 0.4rem",
          color: "var(--nill-text)", letterSpacing: "-0.01em", lineHeight: 1.15,
        }}>
          Betrieb & Organisation
        </h1>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>
          Alles rund um Team, Aufgaben und Arbeitsabläufe.
        </p>
      </div>

      {/* ── Module Grid ─────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "1rem",
      }}>
        {MODULES.map((mod) => (
          <Link
            key={mod.title}
            to={mod.to}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                padding: "1.35rem 1.4rem",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid var(--nill-border)",
                borderRadius: 14,
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.15s",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = "rgba(197,165,114,0.06)";
                e.currentTarget.style.borderColor = "rgba(197,165,114,0.28)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                e.currentTarget.style.borderColor = "var(--nill-border)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Icon */}
              <div style={{
                width: 38, height: 38,
                borderRadius: 10,
                background: "var(--nill-gold-dim)",
                border: "1px solid rgba(197,165,114,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--nill-gold)",
                flexShrink: 0,
              }}>
                {mod.icon}
              </div>

              {/* Text */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{
                  fontSize: "0.9rem", fontWeight: 700,
                  color: "var(--nill-text)", lineHeight: 1.2,
                }}>
                  {mod.title}
                </span>
                <span style={{
                  fontSize: "0.75rem",
                  color: "var(--nill-text-mute)",
                  lineHeight: 1.4,
                }}>
                  {mod.description}
                </span>
              </div>

              {/* Arrow */}
              <div style={{
                marginTop: "auto",
                display: "flex", justifyContent: "flex-end",
                color: "var(--nill-text-dim)",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
