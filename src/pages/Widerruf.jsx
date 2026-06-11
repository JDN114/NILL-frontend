import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function Widerruf() {
  return (
    <LegalLayout title="Widerrufsbelehrung" fillViewport>
      <iframe
        src="https://itrk.legal/1yEr.3K.17NW-iframe.html"
        title="Widerrufsbelehrung"
        style={{ width: "100%", height: "100%", border: "none", display: "block", filter: "invert(1) hue-rotate(180deg)" }}
        loading="lazy"
      />
    </LegalLayout>
  );
}
