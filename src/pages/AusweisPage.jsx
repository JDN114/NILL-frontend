// src/pages/AusweisPage.jsx
//
// Standalone, lightweight page that shows only the employee's QR badge — so it
// can be reached in a single tap (dashboard tile / direct link) instead of
// digging through the Settings tabs before each clock-in.

import PageLayout from "../components/layout/PageLayout";
import MitarbeiterAusweis from "../components/MitarbeiterAusweis";

const text = "var(--nill-text,#efede7)";
const dim  = "var(--nill-text-dim,rgba(var(--ink-tint),.5))";

/* Mobile-only polish — all rules inside the media query; on desktop these
   classes have no styles, so rendering is byte-identical. */
const AW_MOBILE_CSS = `
  @media (max-width: 768px) {
    .aw-head { text-align: center; }
    .aw-title { font-size: 1.45rem !important; letter-spacing: -0.02em; }
    .aw-sub {
      font-size: 0.8rem !important;
      max-width: 30ch;
      margin-left: auto !important;
      margin-right: auto !important;
      line-height: 1.5;
    }
    .aw-wrap { gap: 1rem !important; padding-top: 0.5rem; }
  }
  @media (max-width: 420px) {
    .aw-title { font-size: 1.3rem !important; }
  }
`;

export default function AusweisPage() {
  return (
    <PageLayout>
      <style>{AW_MOBILE_CSS}</style>
      <div className="aw-wrap" style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="aw-head">
          <h1 className="aw-title" style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "1.6rem", fontWeight: 400, color: text, margin: 0,
          }}>
            Mein Ausweis
          </h1>
          <p className="aw-sub" style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.85rem", color: dim, margin: "6px 0 0",
          }}>
            QR-Code an der Arbeitsstation scannen zum Ein-/Ausstempeln und Aufgaben abhaken.
          </p>
        </div>
        <MitarbeiterAusweis />
      </div>
    </PageLayout>
  );
}
