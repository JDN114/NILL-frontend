import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard",      path: "/dashboard",                    exact: true },
  { label: "Emails",         path: "/dashboard/emails" },
  { label: "Kalender",       path: "/dashboard/calendar" },
  { label: "Buchhaltung",    path: "/dashboard/accounting" },
  { label: "NILL",           path: "/dashboard/nill-secretary",     gold: true },
  { label: "Einstellungen",  path: "/dashboard/settings" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  const isActive = (item) =>
    item.exact ? pathname === item.path : pathname.startsWith(item.path);

  return (
    <header style={{
      background: "rgba(7,16,35,0.85)",
      borderBottom: "1px solid var(--nill-border)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 1.5rem",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
      }}>

        {/* ── Logo ──────────────────────────────────────── */}
        <Link
          to="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div style={{
            width: 30, height: 30,
            background: "var(--nill-gold)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.85rem", fontWeight: 900,
            color: "#03060a",
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}>
            N
          </div>
          <span style={{
            fontSize: "1rem",
            fontWeight: 800,
            color: "var(--nill-gold)",
            letterSpacing: "0.07em",
          }}>
            NILL
          </span>
        </Link>

        {/* ── Nav Links ─────────────────────────────────── */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);

            if (item.gold) {
              /* Spezieller Gold-Pill für NILL-Sekretärin */
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.35rem",
                    padding: "0.35rem 0.85rem",
                    borderRadius: 22,
                    fontSize: "0.82rem", fontWeight: 700,
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                    transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s",
                    background: active ? "var(--nill-gold-glow)" : "var(--nill-gold-dim)",
                    border: `1px solid ${active ? "rgba(197,165,114,0.5)" : "rgba(197,165,114,0.22)"}`,
                    color: "var(--nill-gold)",
                    boxShadow: active ? "0 0 12px rgba(197,165,114,0.15)" : "none",
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "var(--nill-gold-glow)";
                    e.currentTarget.style.borderColor = "rgba(197,165,114,0.5)";
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(197,165,114,0.15)";
                  }}
                  onMouseOut={e => {
                    if (!isActive(item)) {
                      e.currentTarget.style.background = "var(--nill-gold-dim)";
                      e.currentTarget.style.borderColor = "rgba(197,165,114,0.22)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  {/* kleiner Sparkle-Dot */}
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "var(--nill-gold)",
                    boxShadow: "0 0 6px rgba(197,165,114,0.7)",
                    flexShrink: 0,
                  }} />
                  {item.label}
                </Link>
              );
            }

            /* Standard-Link */
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: "0.4rem 0.75rem",
                  borderRadius: 8,
                  fontSize: "0.82rem", fontWeight: active ? 600 : 500,
                  textDecoration: "none",
                  transition: "background 0.12s, color 0.12s",
                  background: active ? "rgba(255,255,255,0.05)" : "transparent",
                  color: active ? "var(--nill-text)" : "var(--nill-text-sub)",
                  borderBottom: active
                    ? "1px solid rgba(197,165,114,0.35)"
                    : "1px solid transparent",
                }}
                onMouseOver={e => {
                  if (!isActive(item)) {
                    e.currentTarget.style.background = "var(--nill-panel-hov)";
                    e.currentTarget.style.color = "var(--nill-text)";
                  }
                }}
                onMouseOut={e => {
                  if (!isActive(item)) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--nill-text-sub)";
                  }
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
