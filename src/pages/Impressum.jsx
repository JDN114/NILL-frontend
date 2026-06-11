import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function Impressum() {
  return (
    <LegalLayout title="Impressum">
      <iframe
        src="https://itrk.legal/1yEr.0.17NW-de-iframe.html"
        title="Impressum"
        style={{ width: "100%", minHeight: "80vh", border: "none", filter: "invert(1) hue-rotate(180deg)" }}
        loading="lazy"
      />
    </LegalLayout>
  );
}
