import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function AGB() {
  return (
    <LegalLayout title="Allgemeine Geschäftsbedingungen" fillViewport>
      <iframe
        src="https://itrk.legal/1yEr.4V.17NW-iframe.html"
        title="Allgemeine Geschäftsbedingungen"
        style={{ width: "100%", height: "100%", border: "none", display: "block", filter: "invert(1) hue-rotate(180deg)" }}
        loading="lazy"
      />
    </LegalLayout>
  );
}
