import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// tabKey = navigates within the host page via onNavigate
// to = external route link
const MODULES = [
  {
    title: "Mitarbeiterverwaltung",
    description: "Stammdaten, Vertragsart, Eintrittsdatum & Lohngruppe",
    tabKey: "mitarbeiter",
    adminOnly: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    title: "Lohnabrechnung",
    description: "Monatliche Abrechnung generieren, vorschauen & exportieren",
    tabKey: "abrechnung",
    adminOnly: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
  {
    title: "Arbeitszeiterfassung",
    description: "Stunden tracken, Überstunden automatisch berechnen",
    to: "/dashboard/workflow/time",
    adminOnly: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: "Urlaubsverwaltung",
    description: "Resturlaub tracken, Abwesenheiten beantragen & genehmigen",
    tabKey: "urlaub",
    adminOnly: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    title: "HR Dokumente",
    description: "Lohnsteuerbescheinigungen & Mitarbeiterdokumente",
    tabKey: "dokumente",
    adminOnly: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    title: "Abzüge & Zulagen",
    description: "Steuerklassen, KV, Prämien & Sonderzahlungen konfigurieren",
    tabKey: "mitarbeiter",
    adminOnly: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    title: "Fristen & Erinnerungen",
    description: "Zahlungsfristen, Abgabetermine & automatische Hinweise",
    to: "/dashboard/workflow/tasks",
    adminOnly: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
];

const cardStyle = {
  padding: "1.35rem 1.4rem",
  background: "rgba(255,255,255,0.025)",
  border: "1px solid var(--nill-border)",
  borderRadius: 14,
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  cursor: "pointer",
  transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.15s",
  display: "flex", flexDirection: "column", gap: "0.85rem",
  height: "100%", boxSizing: "border-box",
  textDecoration: "none",
};

function ModuleCard({ mod, onNavigate }) {
  const inner = (
    <div
      style={cardStyle}
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
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: "var(--nill-gold-dim)",
        border: "1px solid rgba(197,165,114,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--nill-gold)", flexShrink: 0,
      }}>
        {mod.icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--nill-text)", lineHeight: 1.2 }}>
          {mod.title}
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--nill-text-mute)", lineHeight: 1.4 }}>
          {mod.description}
        </span>
      </div>
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end", color: "var(--nill-text-dim)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  );

  if (mod.tabKey && onNavigate) {
    return (
      <div key={mod.title} onClick={() => onNavigate(mod.tabKey)} style={{ textDecoration: "none" }}>
        {inner}
      </div>
    );
  }

  return (
    <Link key={mod.title} to={mod.to || "#"} style={{ textDecoration: "none" }}>
      {inner}
    </Link>
  );
}

function StatCard({ label, value, sub, color = "var(--nill-gold)" }) {
  return (
    <div style={{
      padding: "1.1rem 1.3rem",
      background: "rgba(255,255,255,0.025)",
      border: "1px solid var(--nill-border)",
      borderRadius: 12,
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <span style={{ fontSize: "0.7rem", color: "var(--nill-text-dim)", textTransform: "uppercase",
        letterSpacing: "0.07em", fontWeight: 700 }}>
        {label}
      </span>
      <span style={{ fontSize: "1.6rem", fontWeight: 800, color, lineHeight: 1.1 }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontSize: "0.72rem", color: "var(--nill-text-mute)" }}>{sub}</span>
      )}
    </div>
  );
}

export function LohnbuchhaltungContent({ onNavigate }) {
  const { isCompanyAdmin } = useAuth();
  const isAdmin = Boolean(isCompanyAdmin());

  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      api.get("/hr/employees").catch(() => null),
      api.get("/hr/absences?status=pending").catch(() => null),
    ]).then(([empRes, absRes]) => {
      const employees = empRes?.data?.employees ?? [];
      const absences = absRes?.data?.items ?? [];
      const totalGross = employees.reduce((s, e) => s + parseFloat(e.profile?.salary_monthly || 0), 0);
      setStats({
        employeeCount: employees.length,
        pendingAbsences: absences.length,
        totalGross,
      });
    });
  }, [isAdmin]);

  const visibleModules = MODULES.filter(m => !m.adminOnly || isAdmin);

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h2 style={{
          fontSize: "1.45rem", fontWeight: 800, margin: "0 0 0.3rem",
          color: "var(--nill-text)", letterSpacing: "-0.01em", lineHeight: 1.15,
        }}>
          Lohnbuchhaltung
        </h2>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--nill-text-mute)" }}>
          Mitarbeiterverwaltung, Lohnabrechnung & Personalplanung
        </p>
      </div>

      {/* Stats (admin only) */}
      {isAdmin && stats && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.75rem",
        }}>
          <StatCard
            label="Mitarbeiter"
            value={stats.employeeCount}
            sub="aktive Mitarbeiter"
          />
          <StatCard
            label="Offene Anträge"
            value={stats.pendingAbsences}
            sub="Urlaub / Abwesenheit"
            color={stats.pendingAbsences > 0 ? "#fbbf24" : "var(--nill-text-dim)"}
          />
          <StatCard
            label="Lohnkosten / Monat"
            value={stats.totalGross > 0
              ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(stats.totalGross)
              : "—"}
            sub="Gesamtbrutto"
          />
        </div>
      )}

      {/* Module grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "1rem",
      }}>
        {visibleModules.map((mod) => (
          <ModuleCard key={mod.title} mod={mod} onNavigate={onNavigate} />
        ))}
      </div>
    </>
  );
}

export default function LohnbuchhaltungLanding() {
  return (
    <PageLayout>
      <LohnbuchhaltungContent onNavigate={null} />
    </PageLayout>
  );
}
