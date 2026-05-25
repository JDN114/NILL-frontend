// src/components/accounting/BelegEmailTab.jsx — Coming Soon
import React from "react";

export default function BelegEmailTab() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 320, gap: 14, textAlign: "center",
    }}>
      <div style={{
        fontFamily: "Fraunces,serif", fontSize: "1.4rem",
        fontWeight: 600, color: "var(--ink)",
      }}>Belege per E-Mail einreichen</div>
      <div style={{
        fontSize: ".88rem", color: "var(--ink2)", lineHeight: 1.65,
        maxWidth: 380,
      }}>
        Schicken Sie Belege einfach an Ihre persönliche Eingangsadresse —
        NILL erkennt Anhänge automatisch und legt sie im Belegarchiv ab.
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 16px", borderRadius: 20,
        background: "rgba(155,152,144,.08)", border: "1px solid var(--border)",
        fontSize: ".78rem", color: "var(--ink2)",
        fontFamily: "JetBrains Mono,monospace",
      }}>
        belege@firma.nill.app
      </div>
      <div style={{
        marginTop: 8,
        padding: "5px 14px", borderRadius: 20,
        background: "rgba(198,255,60,.1)", border: "1px solid rgba(198,255,60,.2)",
        fontSize: ".74rem", color: "var(--accent)", fontWeight: 600,
        letterSpacing: ".06em", textTransform: "uppercase",
      }}>Demnächst verfügbar</div>
    </div>
  );
}
