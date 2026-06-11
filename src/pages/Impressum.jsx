import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function Impressum() {
  return (
    <LegalLayout title="Impressum" fillViewport>
      <iframe
        src="https://itrk.legal/1yEr.0.17NW-de-iframe.html"
        title="Impressum"
        style={{ width: "100%", height: "100%", border: "none", display: "block", filter: "invert(1) hue-rotate(180deg)" }}
        loading="lazy"
      />
    </LegalLayout>
  );
}
