import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function Widerruf() {
  return (
    <LegalLayout title="Widerrufsbelehrung">
      <iframe
        src="https://itrk.legal/1yEr.3K.17NW-iframe.html"
        title="Widerrufsbelehrung"
        style={{ width: "100%", minHeight: "80vh", border: "none" }}
        loading="lazy"
      />
    </LegalLayout>
  );
}
