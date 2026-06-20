import React from "react";
import LegalLayout from "../components/LegalLayout";

const SRC = "https://itrk.legal/1yEr.4V.17NW-iframe.html";

export default function AGB() {
  return (
    <LegalLayout title="Allgemeine Geschäftsbedingungen" fillViewport>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <iframe
          src={SRC}
          title="Allgemeine Geschäftsbedingungen"
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
