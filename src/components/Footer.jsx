import React from "react";
import { Link } from "react-router-dom";
import { openCookieSettings } from "./CookieBanner";

const inkDim = "rgba(239,237,231,0.35)";
const inkHov = "rgba(239,237,231,0.7)";
const line   = "rgba(239,237,231,0.07)";
const mono   = "'JetBrains Mono',monospace";
const sans   = "'Inter',system-ui,sans-serif";

const NAV_LINKS = [
  { to: "/Impressum",        label: "Impressum" },
  { to: "/Datenschutz",      label: "Datenschutz" },
  { to: "/agb",              label: "AGB" },
  { to: "/Widerruf",         label: "Widerruf" },
  { to: "/gobd",             label: "GoBD" },
  { to: "/barrierefreiheit", label: "Barrierefreiheit" },
];

const linkStyle = {
  fontFamily: mono, fontSize: 11, letterSpacing: "0.1em",
  color: inkDim, textDecoration: "none",
  transition: "color 0.15s",
};

export default function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${line}`, background: "transparent" }}>
      <div style={{
        width: "min(1280px, 100% - 48px)", margin: "0 auto",
        padding: "16px 0",
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 12,
        fontFamily: sans,
      }}>
        <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", color: inkDim }}>
          © {new Date().getFullYear()} NILL
        </span>

        <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 20px" }}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={linkStyle}
              onMouseEnter={e => e.currentTarget.style.color = inkHov}
              onMouseLeave={e => e.currentTarget.style.color = inkDim}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={openCookieSettings}
            style={{
              ...linkStyle,
              background: "none", border: "none", padding: 0, cursor: "pointer",
            }}
            onMouseEnter={e => e.currentTarget.style.color = inkHov}
            onMouseLeave={e => e.currentTarget.style.color = inkDim}
          >
            Cookie-Einstellungen
          </button>
        </nav>
      </div>
    </footer>
  );
}
