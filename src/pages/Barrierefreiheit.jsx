import React from "react";
import LegalLayout from "../components/LegalLayout";

export default function Barrierefreiheit() {
  return (
    <LegalLayout title="Barrierefreiheitserklärung">
      <p style={{ marginBottom: "1.5rem", color: "rgba(239,237,231,0.6)", fontSize: "0.85rem" }}>
        Stand: Mai 2026
      </p>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Geltungsbereich</h2>
        <p>
          Diese Barrierefreiheitserklärung gilt für die Webanwendung NILL unter{" "}
          <strong>nillai.de</strong> und alle zugehörigen Subdomains (dashboard.nillai.de).
          NILL ist ein kommerzielles SaaS-Produkt und unterliegt als solches den
          Anforderungen des Barrierefreiheitsstärkungsgesetzes (BFSG).
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
          Stand der Barrierefreiheit
        </h2>
        <p>
          NILL ist <strong>teilweise konform</strong> mit den Anforderungen der
          Web Content Accessibility Guidelines (WCAG) 2.1, Konformitätsstufe AA.
        </p>
        <p style={{ marginTop: "0.75rem" }}>
          Bekannte Einschränkungen:
        </p>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem", lineHeight: 1.8 }}>
          <li>
            Einige komplexe Datentabellen (Buchhaltung, Rechnungen) verfügen
            noch nicht über vollständige ARIA-Tabellenrollen.
          </li>
          <li>
            Einige Statusmeldungen werden noch nicht über Live-Regionen
            (aria-live) angekündigt.
          </li>
          <li>
            Ein formeller WCAG-Audit durch eine externe Prüfstelle steht aus.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
          Feedback und Kontakt
        </h2>
        <p>
          Wenn Sie Barrieren auf unserer Plattform feststellen oder Unterstützung
          benötigen, wenden Sie sich bitte an:
        </p>
        <address style={{ fontStyle: "normal", marginTop: "0.75rem", lineHeight: 1.8 }}>
          <strong>NILL</strong><br />
          E-Mail:{" "}
          <a href="mailto:support@nillai.de" style={{ color: "rgba(198,255,60,0.85)" }}>
            support@nillai.de
          </a>
        </address>
        <p style={{ marginTop: "0.75rem" }}>
          Wir bemühen uns, Anfragen innerhalb von 5 Werktagen zu beantworten.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
          Durchsetzungsverfahren
        </h2>
        <p>
          Wenn Sie auf eine Beschwerde keine zufriedenstellende Antwort erhalten,
          können Sie sich an die zuständige Durchsetzungsstelle wenden.
          Für privatwirtschaftliche Anbieter ist dies die{" "}
          <strong>
            Marktüberwachungsbehörde Ihres Bundeslandes
          </strong>.
        </p>
      </section>
    </LegalLayout>
  );
}
