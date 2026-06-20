import React from "react";
import { Link } from "react-router-dom";
import { openCookieSettings } from "./CookieBanner";

/* rgba(var(--ink-tint), ...) flips automatically:
   dark → rgba(239,237,231, ...)  light → rgba(48,42,30, ...)          */
const S = `
  .nf-footer {
    border-top: 1px solid rgba(var(--ink-tint), .08);
    background: transparent;
  }
  .nf-inner {
    width: min(1280px, 100% - 48px);
    margin: 0 auto;
    padding: 16px 0;
    display: flex; flex-wrap: wrap; align-items: center;
    justify-content: space-between; gap: 12px;
    font-family: "Inter", system-ui, sans-serif;
  }
  .nf-copy {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px; letter-spacing: 0.12em;
    color: rgba(var(--ink-tint), .38);
  }
  .nf-nav {
    display: flex; flex-wrap: wrap; align-items: center; gap: 8px 20px;
  }
  .nf-link {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px; letter-spacing: 0.1em;
    color: rgba(var(--ink-tint), .38);
    text-decoration: none;
    background: none; border: none; padding: 0; cursor: pointer;
    transition: color .15s;
  }
  .nf-link:hover { color: rgba(var(--ink-tint), .75); }
`;

const NAV_LINKS = [
  { to: "/Impressum",        label: "Impressum" },
  { to: "/Datenschutz",      label: "Datenschutz" },
  { to: "/agb",              label: "AGB" },
  { to: "/Widerruf",         label: "Widerruf" },
  { to: "/gobd",             label: "GoBD" },
  { to: "/barrierefreiheit", label: "Barrierefreiheit" },
];

export default function Footer() {
  return (
    <>
      <style>{S}</style>
      <footer className="nf-footer">
        <div className="nf-inner">
          <span className="nf-copy">© {new Date().getFullYear()} NILL</span>

          <nav className="nf-nav">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className="nf-link">{label}</Link>
            ))}
            <button className="nf-link" onClick={openCookieSettings}>
              Cookie-Einstellungen
            </button>
          </nav>
        </div>
      </footer>
    </>
  );
}
