import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function Datenschutz() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <iframe
        src="https://itrk.legal/1yEr.bg.17NW-iframe.html"
        title="Datenschutzerklärung"
        style={{ width: "100%", minHeight: "80vh", border: "none", filter: "invert(1) hue-rotate(180deg)" }}
        loading="lazy"
      />
    </LegalLayout>
  );
}
