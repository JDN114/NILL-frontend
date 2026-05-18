import React from "react";
import { Link } from "react-router-dom";
import { openCookieSettings } from "./CookieBanner";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.07)",
      padding: "14px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "8px",
      fontSize: "12px",
      color: "rgba(255,255,255,0.35)",
      background: "transparent",
    }}>
      <span>© {new Date().getFullYear()} NILL</span>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/Impressum" style={{ color: "inherit", textDecoration: "none" }}
          onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}>
          Impressum
        </Link>
        <Link to="/barrierefreiheit" style={{ color: "inherit", textDecoration: "none" }}
          onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}>
          Barrierefreiheit
        </Link>
        <Link to="/Datenschutz" style={{ color: "inherit", textDecoration: "none" }}
          onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}>
          Datenschutz
        </Link>
        <Link to="/agb" style={{ color: "inherit", textDecoration: "none" }}
          onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}>
          AGBs
        </Link>
        <button
          onClick={openCookieSettings}
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            color: "inherit", font: "inherit", textDecoration: "none",
          }}
          onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
        >
          Cookie-Einstellungen
        </button>
      </nav>
    </footer>
  );
}
