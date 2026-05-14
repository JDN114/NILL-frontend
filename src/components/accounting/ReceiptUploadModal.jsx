// src/components/accounting/ReceiptUploadModal.jsx
import React, { useState, useRef } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  n != null
    ? `${Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`
    : "--";

export default function ReceiptUploadModal({ onClose }) {
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result,    setResult]    = useState(null);
  const [booking,   setBooking]   = useState(false);
  const [booked,    setBooked]    = useState(false);
  const [error,     setError]     = useState("");
  const inputRef = useRef();

  const onFile = (f) => {
    if (!f) return;
    setFile(f); setResult(null); setError(""); setBooked(false);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true); setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await api.post("/accounting/invoices/from-photo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000, // 60 s — AI analysis can take time
      });
      setResult(r.data);
    } catch (e) {
      const detail = e.response?.data?.detail;
      setError(detail || "Upload oder KI-Analyse fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setUploading(false);
    }
  };

  const autoBook = async () => {
    if (!result?.id) return;
    setBooking(true); setError("");
    try {
      await api.post(`/api/v1/buchhaltung/buchungen/auto/${result.id}`);
      setBooked(true);
    } catch (e) {
      setError(e.response?.data?.detail || "Automatikbuchung fehlgeschlagen.");
    } finally {
      setBooking(false);
    }
  };

  const reset = () => {
    setResult(null); setFile(null); setPreview(null); setBooked(false); setError("");
  };

  return (
    <div className="ac-modal-backdrop">
      <div className="ac-modal">
        <div className="ac-modal-title">Beleg hochladen &amp; analysieren</div>
        {error && (
          <div className="ac-alert ac-alert-err" style={{ cursor: "pointer" }} onClick={() => setError("")}>
            {error}
          </div>
        )}

        {!result ? (
          <>
            {/* Drop zone */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}
              style={{
                border: "2px dashed var(--border)", borderRadius: 12, padding: 32,
                textAlign: "center", cursor: "pointer", marginBottom: 16,
                background: file ? "rgba(197,165,114,0.04)" : "var(--surface2)",
                transition: "all .15s",
              }}
            >
              <input
                ref={inputRef} type="file" accept="image/*,application/pdf"
                style={{ display: "none" }} onChange={e => onFile(e.target.files[0])}
              />
              {preview ? (
                <img src={preview} alt="Vorschau" style={{ maxHeight: 180, maxWidth: "100%", borderRadius: 8 }} />
              ) : (
                <div>
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>📄</div>
                  <div style={{ color: "var(--ink2)", fontSize: ".9rem" }}>
                    {file ? file.name : "Datei hierher ziehen oder klicken"}
                  </div>
                  <div style={{ color: "var(--ink2)", fontSize: ".75rem", marginTop: 4 }}>
                    JPG, PNG, PDF bis 10 MB
                  </div>
                </div>
              )}
              {file && !preview && (
                <div style={{ marginTop: 12, color: "var(--accent)", fontSize: ".85rem" }}>
                  {file.name}
                </div>
              )}
            </div>

            {uploading && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", marginBottom: 12,
                background: "rgba(197,165,114,0.06)",
                border: "1px solid rgba(197,165,114,0.2)",
                borderRadius: 8, fontSize: ".84rem", color: "var(--ink2)",
              }}>
                <span className="ac-spinner" />
                <span>◈ KI analysiert den Beleg…</span>
                <span style={{fontSize:".75rem", opacity:.6}}>(bis zu 30 Sek.)</span>
              </div>
            )}

            <div className="ac-modal-footer">
              <button className="ac-btn ac-btn-ghost" onClick={onClose} disabled={uploading}>
                Abbrechen
              </button>
              <button className="ac-btn ac-btn-primary" onClick={upload} disabled={!file || uploading}>
                {uploading ? "Analysiere…" : "Hochladen & analysieren"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="ac-alert ac-alert-ok" style={{ marginBottom: 16, display:"flex", alignItems:"center", gap:10 }}>
              <span>Beleg erfolgreich erkannt und gespeichert.</span>
              <span style={{
                display:"inline-flex", alignItems:"center", gap:3,
                padding:"2px 8px", borderRadius:99, marginLeft:"auto",
                fontSize:10, fontFamily:"JetBrains Mono,monospace", letterSpacing:"0.1em",
                background:"rgba(122,92,255,0.15)", border:"1px solid rgba(122,92,255,0.3)",
                color:"rgba(122,92,255,0.9)", userSelect:"none", flexShrink:0,
              }}>◈ KI-Erkennung</span>
            </div>

            {/* Extracted data grid */}
            <div style={{ background: "var(--surface2)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: ".85rem" }}>
                {[
                  ["Lieferant",    result.vendor         || "--"],
                  ["Rechnungsnr.", result.invoice_number || "--"],
                  ["Datum",        result.date           || "--"],
                  ["Bruttobetrag", fmtEur(result.amount)],
                  ["Nettobetrag",  fmtEur(result.net_amount)],
                  ["MwSt-Satz",    result.vat_rate != null ? `${Number(result.vat_rate).toFixed(0)} %` : "--"],
                  ["Kategorie",    result.category       || "--"],
                  ["Art",          result.direction === "income" ? "Einnahme" : "Ausgabe"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{
                      color: "var(--ink2)", fontSize: ".72rem",
                      textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 2,
                    }}>
                      {k}
                    </div>
                    <div className="ac-mono" style={{ fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-book prompt */}
            {booked ? (
              <div className="ac-alert ac-alert-ok">
                Buchungssatz wurde automatisch in die doppelte Buchführung übernommen.
              </div>
            ) : (
              <div style={{
                background: "rgba(122,92,255,.08)",
                border: "1px solid rgba(122,92,255,.2)",
                borderRadius: 10, padding: 16, marginBottom: 16,
              }}>
                <div style={{ fontWeight: 600, marginBottom: 6, fontSize: ".9rem" }}>
                  Automatisch buchen?
                </div>
                <div style={{ color: "var(--ink2)", fontSize: ".82rem", marginBottom: 12 }}>
                  NILL erstellt automatisch den passenden Buchungssatz inkl. Gegenkonto (SKR03) und USt-Kennzeichen.
                </div>
                <button className="ac-btn ac-btn-primary" onClick={autoBook} disabled={booking}>
                  {booking ? "Buche…" : "Jetzt automatisch buchen"}
                </button>
              </div>
            )}

            <div className="ac-modal-footer">
              <button className="ac-btn ac-btn-ghost" onClick={reset}>
                Weiteren Beleg
              </button>
              <button className="ac-btn ac-btn-primary" onClick={onClose}>
                Fertig
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
