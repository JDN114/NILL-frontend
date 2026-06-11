import React from "react";
import LegalLayout from "../components/LegalLayout";

const ink    = "#efede7";
const inkDim = "rgba(239,237,231,0.5)";
const accent = "#c6ff3c";
const serif  = "'Fraunces','Iowan Old Style',Georgia,serif";
const mono   = "'JetBrains Mono',monospace";

const h2 = {
  fontFamily: serif, fontWeight: 400, fontSize: 22,
  letterSpacing: "-0.01em", color: ink,
  margin: "0 0 12px",
};
const p = { color: inkDim, fontSize: 15, lineHeight: 1.75, margin: "0 0 12px" };

export default function Barrierefreiheit() {
  return (
    <LegalLayout title="Barrierefreiheitserklärung">

      <p style={{ color: inkDim, fontSize: 12, fontFamily: mono, letterSpacing: "0.12em", marginBottom: 36 }}>
        Stand: Mai 2026
      </p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={h2}>Geltungsbereich</h2>
        <p style={p}>
          Diese Barrierefreiheitserklärung gilt für die Webanwendung NILL unter{" "}
          <strong style={{ color: ink }}>nillai.de</strong> und alle zugehörigen Subdomains
          (dashboard.nillai.de). NILL ist ein kommerzielles SaaS-Produkt und unterliegt als
          solches den Anforderungen des Barrierefreiheitsstärkungsgesetzes (BFSG).
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={h2}>Stand der Barrierefreiheit</h2>
        <p style={p}>
          NILL ist <strong style={{ color: ink }}>teilweise konform</strong> mit den Anforderungen der
          Web Content Accessibility Guidelines (WCAG) 2.1, Konformitätsstufe AA.
        </p>
        <p style={{ ...p, marginTop: 12 }}>Bekannte Einschränkungen:</p>
        <ul style={{ paddingLeft: 24, margin: "8px 0 0", color: inkDim, fontSize: 15, lineHeight: 1.9 }}>
          <li>
            Einige komplexe Datentabellen (Buchhaltung, Rechnungen) verfügen noch nicht
            über vollständige ARIA-Tabellenrollen.
          </li>
          <li>
            Einige Statusmeldungen werden noch nicht über Live-Regionen (aria-live)
            angekündigt.
          </li>
          <li>Ein formeller WCAG-Audit durch eine externe Prüfstelle steht aus.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={h2}>Feedback und Kontakt</h2>
        <p style={p}>
          Wenn Sie Barrieren auf unserer Plattform feststellen oder Unterstützung
          benötigen, wenden Sie sich bitte an:
        </p>
        <address style={{ fontStyle: "normal", marginTop: 12, lineHeight: 1.9, color: inkDim, fontSize: 15 }}>
          <strong style={{ color: ink }}>NILL</strong><br />
          E-Mail:{" "}
          <a href="mailto:support@nillai.de" style={{ color: accent, textDecoration: "none" }}>
            support@nillai.de
          </a>
        </address>
        <p style={{ ...p, marginTop: 12 }}>
          Wir bemühen uns, Anfragen innerhalb von 5 Werktagen zu beantworten.
        </p>
      </section>

      <section>
        <h2 style={h2}>Durchsetzungsverfahren</h2>
        <p style={p}>
          Wenn Sie auf eine Beschwerde keine zufriedenstellende Antwort erhalten,
          können Sie sich an die zuständige Durchsetzungsstelle wenden. Für
          privatwirtschaftliche Anbieter ist dies die{" "}
          <strong style={{ color: ink }}>Marktüberwachungsbehörde Ihres Bundeslandes</strong>.
        </p>
      </section>

    </LegalLayout>
  );
}
