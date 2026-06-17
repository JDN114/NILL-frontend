// src/pages/AusweisPage.jsx
//
// Standalone, lightweight page that shows only the employee's QR badge — so it
// can be reached in a single tap (dashboard tile / direct link) instead of
// digging through the Settings tabs before each clock-in.

import PageLayout from "../components/layout/PageLayout";
import MitarbeiterAusweis from "../components/MitarbeiterAusweis";

const text = "var(--nill-text,#efede7)";
const dim  = "var(--nill-text-dim,rgba(var(--ink-tint),.5))";

export default function AusweisPage() {
  return (
    <PageLayout>
      <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "1.6rem", fontWeight: 400, color: text, margin: 0,
          }}>
            Mein Ausweis
          </h1>
          <p style={{
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
