// src/components/MitarbeiterAusweis.jsx
//
// Mitarbeiter-Ausweis (QR-Badge) — used both as a tab inside SettingsPage and
// as the standalone /ausweis page so employees can pull up their clock-in /
// task QR code in a single tap.
//
// "Als PDF speichern / Drucken" uses window.print() against a dedicated
// print-only, white-background card. The QR stays an SVG → it prints
// vector-crisp (better scan quality than a rasterised jsPDF/html2canvas export)
// and the browser's print dialog covers both "Save as PDF" and physical print
// without pulling in a PDF dependency.

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import api from "../services/api";

// ─── Design Tokens (kept local so this component is self-contained) ──────────
const surface = "rgba(var(--tint),0.03)";
const border  = "rgba(var(--ink-tint),0.07)";
const text    = "var(--nill-text,#efede7)";
const dim     = "var(--nill-text-dim,rgba(var(--ink-tint),.5))";
const gold    = "var(--nill-gold,#c5a572)";
const red     = "#f87171";

const PRINT_CSS = `
  .ausweis-print-only { display: none; }
  @media print {
    body * { visibility: hidden !important; }
    .ausweis-print-only, .ausweis-print-only * { visibility: visible !important; }
    .ausweis-print-only { display: block !important; position: absolute; left: 0; top: 0; width: 100%; }
    .ausweis-noprint { display: none !important; }
    @page { margin: 16mm; }
  }
`;

export default function MitarbeiterAusweis() {
  const [badge, setBadge]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get("/workflow/badge/me")
      .then(r => { setBadge(r.data); setLoading(false); })
      .catch(() => { setError("Ausweis konnte nicht geladen werden."); setLoading(false); });
  }, []);

  async function handleRegenerate() {
    const ok = window.confirm(
      "Ausweis neu ausstellen?\n\n" +
      "Dein bisheriger QR-Code wird sofort ungültig — auch bereits gespeicherte " +
      "oder ausgedruckte Ausweise funktionieren dann nicht mehr. Deine " +
      "Mitarbeiternummer bleibt unverändert."
    );
    if (!ok) return;
    setRegenerating(true);
    try {
      const r = await api.post("/workflow/badge/regenerate");
      setBadge(r.data);
    } catch {
      window.alert("Ausweis konnte nicht neu ausgestellt werden. Bitte erneut versuchen.");
    } finally {
      setRegenerating(false);
    }
  }

  async function handleDownload() {
    // Echter Datei-Download statt window.print() — sauber auch in der installierten
    // PWA (standalone): authentifizierter Blob-Abruf, Anchor am DOM, verzögertes
    // revoke (sofortiges revoke bricht den Download auf Mobile/iOS-PWA ab).
    setDownloading(true);
    try {
      const r = await api.get("/workflow/badge/pdf", { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([r.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `NILL-Ausweis-${badge?.nill_number || "Ausweis"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch {
      window.alert("Ausweis-PDF konnte nicht heruntergeladen werden. Bitte erneut versuchen.");
    } finally {
      setDownloading(false);
    }
  }

  if (loading) return (
    <div style={{ padding: "3rem", display: "flex", justifyContent: "center" }}>
      <div style={{
        width: 28, height: 28, border: "3px solid rgba(var(--tint),0.08)",
        borderTopColor: gold, borderRadius: "50%", animation: "nill-spin 0.8s linear infinite",
      }} />
    </div>
  );

  if (error) return (
    <div style={{ padding: "2rem", color: red, fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.85rem" }}>
      {error}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <style>{PRINT_CSS}</style>

      {/* Aktionen */}
      <div className="ausweis-noprint" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "0.55rem 1.1rem",
            background: "transparent",
            border: `1px solid rgba(248,113,113,0.4)`,
            borderRadius: 10, color: red,
            cursor: regenerating ? "default" : "pointer",
            opacity: regenerating ? 0.6 : 1,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.82rem", fontWeight: 600,
          }}
        >
          <span aria-hidden="true">↻</span> {regenerating ? "Wird neu ausgestellt…" : "Neu ausstellen"}
        </button>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => window.print()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "0.55rem 1.1rem",
              background: "transparent",
              border: `1px solid ${border}`,
              borderRadius: 10, color: dim, cursor: "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "0.82rem", fontWeight: 600,
            }}
          >
            <span aria-hidden="true">🖨</span> Drucken
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "0.55rem 1.1rem",
              background: "rgba(197,165,114,0.1)",
              border: `1px solid rgba(197,165,114,0.35)`,
              borderRadius: 10, color: gold,
              cursor: downloading ? "default" : "pointer",
              opacity: downloading ? 0.6 : 1,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "0.82rem", fontWeight: 600,
            }}
          >
            <span aria-hidden="true">⤓</span> {downloading ? "Wird erstellt…" : "Als PDF herunterladen"}
          </button>
        </div>
      </div>

      {/* Ausweis-Karte */}
      <div style={{
        background: "linear-gradient(135deg, rgba(197,165,114,0.08), rgba(197,165,114,0.03))",
        border: `1px solid rgba(197,165,114,0.25)`,
        borderRadius: 20,
        padding: "2rem",
        display: "flex",
        gap: "2rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        {/* QR-Code */}
        {badge?.qr_payload && (
          <div style={{
            background: "#fff",
            borderRadius: 12,
            padding: "12px",
            flexShrink: 0,
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}>
            <QRCodeSVG
              value={badge.qr_payload}
              size={140}
              level="M"
              bgColor="#ffffff"
              fgColor="#04070f"
            />
          </div>
        )}

        {/* Ausweis-Info */}
        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* NILL-Nummer */}
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(var(--ink-tint),0.35)", marginBottom: 4,
            }}>
              Mitarbeiternummer
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "1.4rem", fontWeight: 700,
              color: gold, letterSpacing: "0.08em",
            }}>
              {badge?.nill_number ?? "—"}
            </div>
          </div>

          {/* Name */}
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(var(--ink-tint),0.35)", marginBottom: 2,
            }}>Name</div>
            <div style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "1.1rem", fontWeight: 400, color: text,
            }}>
              {badge?.name ?? "—"}
            </div>
          </div>

          {/* Unternehmen + Rolle */}
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {badge?.org_name && (
              <div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "rgba(var(--ink-tint),0.35)", marginBottom: 2,
                }}>Unternehmen</div>
                <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.88rem", color: dim }}>
                  {badge.org_name}
                </div>
              </div>
            )}
            {badge?.role && (
              <div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "rgba(var(--ink-tint),0.35)", marginBottom: 2,
                }}>Rolle</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem",
                  color: gold, letterSpacing: "0.06em",
                }}>
                  {badge.role}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verwendung */}
      <div style={{
        background: surface, border: `1px solid ${border}`,
        borderRadius: 16, padding: "1.25rem 1.5rem",
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: text }}>
          Ausweis verwenden
        </div>
        <ul style={{
          margin: 0, paddingLeft: "1.2rem",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "0.82rem", color: dim, lineHeight: 1.7,
        }}>
          <li>QR-Code an der Arbeitsstation scannen zum <strong style={{ color: text }}>Ein- und Ausstempeln</strong></li>
          <li>QR-Code scannen um <strong style={{ color: text }}>Aufgaben abzuhaken</strong></li>
          <li>Ausweis auf dem Smartphone oder ausgedruckt verwenden</li>
        </ul>
      </div>

      {/* DSGVO-Hinweis */}
      <div style={{
        background: "rgba(59,130,246,0.05)",
        border: "1px solid rgba(59,130,246,0.18)",
        borderRadius: 14, padding: "1rem 1.25rem",
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem",
          letterSpacing: "0.15em", textTransform: "uppercase",
          color: "rgba(96,165,250,0.7)", marginBottom: 2,
        }}>Datenschutzhinweis (DSGVO Art. 13)</div>
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.8rem", color: dim, lineHeight: 1.6 }}>
          <strong style={{ color: text }}>Zweck:</strong> {badge?.purpose ?? "Zeiterfassung und Aufgabenbestätigung an der Arbeitsstation"}
        </div>
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.8rem", color: dim, lineHeight: 1.6 }}>
          <strong style={{ color: text }}>Rechtsgrundlage:</strong> {badge?.legal_basis ?? "Art. 6 Abs. 1 lit. b DSGVO — Vertragserfüllung"}
        </div>
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(var(--ink-tint),0.3)", marginTop: 4, lineHeight: 1.5 }}>
          Der QR-Code enthält ausschließlich deine NILL-Mitarbeiternummer (pseudonymisiert).
          Keine personenbezogenen Daten (Name, E-Mail) sind im Code gespeichert.
          Zeitstempel werden gem. § 16 ArbZG für 2 Jahre aufbewahrt und danach gelöscht.
        </div>
      </div>

      {/* ── Druck-/PDF-Variante: weiß, vektor-scharfer QR, nur beim Drucken sichtbar ── */}
      <div className="ausweis-print-only">
        <div style={{
          width: "100%", maxWidth: 520, margin: "0 auto",
          border: "1px solid #d9d4c8", borderRadius: 16, padding: "28px 32px",
          background: "#ffffff", color: "#04070f", boxSizing: "border-box",
        }}>
          <div style={{
            fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700,
            color: "#04070f", marginBottom: 2,
          }}>
            NILL<span style={{ color: "#9a7b3c" }}>.</span> Mitarbeiterausweis
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b6658",
            marginBottom: 22,
          }}>
            Zeiterfassung &amp; Aufgabenbestätigung
          </div>

          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {badge?.qr_payload && (
              <div style={{ border: "1px solid #ece8dd", borderRadius: 10, padding: 10, flexShrink: 0 }}>
                <QRCodeSVG value={badge.qr_payload} size={170} level="M" bgColor="#ffffff" fgColor="#000000" />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8a8576" }}>Mitarbeiternummer</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: "#04070f", letterSpacing: "0.06em" }}>{badge?.nill_number ?? "—"}</div>
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8a8576" }}>Name</div>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, color: "#04070f" }}>{badge?.name ?? "—"}</div>
              </div>
              {badge?.org_name && (
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8a8576" }}>Unternehmen</div>
                  <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: "#04070f" }}>{badge.org_name}</div>
                </div>
              )}
            </div>
          </div>

          <div style={{
            marginTop: 22, paddingTop: 14, borderTop: "1px solid #ece8dd",
            fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, color: "#8a8576", lineHeight: 1.5,
          }}>
            Der QR-Code enthält ausschließlich die pseudonymisierte NILL-Mitarbeiternummer — keine personenbezogenen
            Daten. An der Arbeitsstation scannen zum Ein-/Ausstempeln und zum Abhaken von Aufgaben.
          </div>
        </div>
      </div>
    </div>
  );
}
