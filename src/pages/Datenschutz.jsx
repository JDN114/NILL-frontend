import React from "react";
import LegalLayout from "../components/LegalLayout";

const SRC = "https://itrk.legal/1yEr.bg.17NW-iframe.html";

export default function Datenschutz() {
  return (
    <LegalLayout title="Datenschutzerklärung" fillViewport>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <iframe
          src={SRC}
          title="Datenschutzerklärung"
          style={{ flex: 1, minHeight: 0, width: "100%", border: "none", display: "block", filter: "invert(1) hue-rotate(180deg)" }}
        />
        <div style={{ flexShrink: 0, padding: "8px 16px 10px", fontSize: 13, color: "rgba(239,237,231,0.5)" }}>
          Falls die Anzeige nicht lädt:{" "}
          <a href={SRC} target="_blank" rel="noopener noreferrer" style={{ color: "#c6ff3c", textDecoration: "underline" }}>
            Dokument in neuem Tab öffnen ↗
          </a>
        </div>
      </div>
    </LegalLayout>
  );
}
