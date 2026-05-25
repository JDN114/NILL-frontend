import React from "react";

export default function BankSyncTab() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 320, gap: 14, textAlign: "center",
    }}>
      <div style={{
        fontFamily: "Fraunces,serif", fontSize: "1.4rem",
        fontWeight: 600, color: "var(--ink)",
      }}>Bank-Synchronisation</div>
      <div style={{
        fontSize: ".88rem", color: "var(--ink2)", lineHeight: 1.65,
        maxWidth: 400,
      }}>
        Verbinden Sie Ihr Geschäftskonto über PSD2 Open Banking — Transaktionen
        werden automatisch importiert und Ihren Rechnungen zugeordnet.
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 16px", borderRadius: 20,
        background: "rgba(155,152,144,.08)", border: "1px solid var(--border)",
        fontSize: ".78rem", color: "var(--ink2)",
        fontFamily: "JetBrains Mono,monospace",
      }}>
        TrueLayer · PSD2 · IBAN-Sync
      </div>
      <div style={{
        marginTop: 8,
        padding: "5px 14px", borderRadius: 20,
        background: "rgba(198,255,60,.1)", border: "1px solid rgba(198,255,60,.2)",
        fontSize: ".74rem", color: "var(--accent)", fontWeight: 600,
        letterSpacing: ".06em", textTransform: "uppercase",
      }}>In Entwicklung</div>
    </div>
  );
}
