// src/components/accounting/ReceiptUploadModal.jsx
import React, { useState, useRef } from "react";
import api from "../../services/api";

export default function ReceiptUploadModal({ onClose }) {
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult]       = useState(null);
  const [booking, setBooking]     = useState(false);
  const [booked, setBooked]       = useState(false);
  const [error, setError]         = useState("");
  const inputRef = useRef();

  const onFile = (f) => {
    if (!f) return;
    setFile(f); setResult(null); setError(""); setBooked(false);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else { setPreview(null); }
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true); setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await api.post("/accounting/invoices/from-photo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(r.data);
    } catch(e) {
      setError(e.response?.data?.detail || "Upload fehlgeschlagen.");
    } finally { setUploading(false); }
  };

  const autoBook = async () => {
    if (!result?.id) return;
    setBooking(true); setError("");
    try {
      await api.post(`/api/v1/buchhaltung/buchungen/auto/${result.id}`);
      setBooked(true);
    } catch(e) {
      setError(e.response?.data?.detail || "Automatikbuchung fehlgeschlagen.");
    } finally { setBooking(false); }
  };

  const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} EUR`;

  return (
    <div className="ac-modal-backdrop">
      <div className="ac-modal">
        <div className="ac-modal-title">Beleg hochladen</div>
        {error && <div className="ac-alert ac-alert-err">{error}</div>}

        {!result ? (
          <>
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}
              style={{
                border:"2px dashed var(--border)", borderRadius:12, padding:32,
                textAlign:"center", cursor:"pointer", marginBottom:16,
                background: file ? "rgba(198,255,60,.04)" : "var(--surface2)",
                transition:"all .15s",
              }}>
              <input ref={inputRef} type="file" accept="image/*,application/pdf"
                style={{display:"none"}} onChange={e => onFile(e.target.files[0])} />
              {preview
                ? <img src={preview} alt="Vorschau" style={{ maxHeight:180, maxWidth:"100%", borderRadius:8 }} />
                : (
                  <div>
                    <div style={{ fontSize:"2rem", marginBottom:8 }}>📄</div>
                    <div style={{ color:"var(--ink2)", fontSize:".9rem" }}>
                      {file ? file.name : "Datei hierher ziehen oder klicken"}
                    </div>
                    <div style={{ color:"var(--ink2)", fontSize:".75rem", marginTop:4 }}>JPG, PNG, PDF bis 10 MB</div>
                  </div>
                )
              }
              {file && !preview && <div style={{ marginTop:12, color:"var(--accent)", fontSize:".85rem" }}>{file.name}</div>}
            </div>
            <div className="ac-modal-footer">
              <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
              <button className="ac-btn ac-btn-primary" onClick={upload} disabled={!file || uploading}>
                {uploading ? "Analysiere..." : "Hochladen & analysieren"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="ac-alert ac-alert-ok" style={{ marginBottom:16 }}>
              Beleg erfolgreich erkannt und gespeichert.
            </div>
            <div style={{ background:"var(--surface2)", borderRadius:10, padding:16, marginBottom:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, fontSize:".85rem" }}>
                {[
                  ["Vendor",       result.vendor || "--"],
                  ["Rechnungsnr.", result.invoice_number || "--"],
                  ["Datum",        result.date || "--"],
                  ["Bruttobetrag", fmtEur(result.amount)],
                  ["Nettobetrag",  result.net_amount ? fmtEur(result.net_amount) : "--"],
                  ["MwSt-Satz",    result.vat_rate != null ? `${result.vat_rate} %` : "--"],
                  ["SKR03-Konto",  result.skr03_account || "--"],
                  ["Kategorie",    result.category || "--"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ color:"var(--ink2)", fontSize:".72rem", textTransform:"uppercase", letterSpacing:".04em", marginBottom:2 }}>{k}</div>
                    <div className="ac-mono" style={{ fontWeight:500 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            {booked ? (
              <div className="ac-alert ac-alert-ok">
                Buchungssatz wurde automatisch in die doppelte Buchfuhrung ubernommen.
              </div>
            ) : (
              <div style={{ background:"rgba(122,92,255,.08)", border:"1px solid rgba(122,92,255,.2)", borderRadius:10, padding:16, marginBottom:16 }}>
                <div style={{ fontWeight:600, marginBottom:6, fontSize:".9rem" }}>Automatisch buchen?</div>
                <div style={{ color:"var(--ink2)", fontSize:".82rem", marginBottom:12 }}>
                  NILL erstellt automatisch den passenden Buchungssatz inkl. Gegenkonto (SKR03{result.skr03_account ? ` ${result.skr03_account}` : ""}) und USt-Kennzeichen.
                </div>
                <button className="ac-btn ac-btn-primary" onClick={autoBook} disabled={booking}>
                  {booking ? "Buche..." : "Jetzt automatisch buchen"}
                </button>
              </div>
            )}
            <div className="ac-modal-footer">
              <button className="ac-btn ac-btn-ghost"
                onClick={() => { setResult(null); setFile(null); setPreview(null); setBooked(false); }}>
                Weiteren Beleg
              </button>
              <button className="ac-btn ac-btn-primary" onClick={onClose}>Fertig</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
