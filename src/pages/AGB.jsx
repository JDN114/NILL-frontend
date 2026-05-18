import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function AGB() {
  return (
    <LegalLayout title="Allgemeine Geschäftsbedingungen">
      <iframe
        src="https://itrk.legal/1yEr.4V.17NW-iframe.html"
        title="Allgemeine Geschäftsbedingungen"
        style={{ width: "100%", minHeight: "80vh", border: "none" }}
        loading="lazy"
      />
    </LegalLayout>
  );
}
