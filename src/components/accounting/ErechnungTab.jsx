// src/components/accounting/ErechnungTab.jsx — E-Rechnung Empfang & Import
// Ab 01.01.2025 gesetzlich verpflichtend für B2B (§14 UStG i.V.m. BEG IV 2024)
import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../../services/api";


const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

function DropZone({ onFile }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const handle = (files) => {
    const f = files?.[0];
    if (f) onFile(f);
  };

  return (
    <div
      onClick={() => ref.current.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); }}
      style={{
        border: `2px dashed ${drag ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 12, padding: "36px 24px", textAlign: "center",
        cursor: "pointer", transition: "border-color .15s",
        background: drag ? "rgba(198,255,60,.04)" : "transparent",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 10 }}></div>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        XRechnung / ZUGFeRD Datei hier ablegen
      </div>
      <div style={{ fontSize: ".82rem", color: "var(--ink2)" }}>
        Unterstützt .xml (XRechnung 3.0, UN/CEFACT CII) und .pdf (ZUGFeRD Hybrid)
      </div>
      <input ref={ref} type="file" accept=".xml,.pdf"
        style={{ display: "none" }} onChange={e => handle(e.target.files)} />
    </div>
  );
}

function ParsedPreview({ parsed, onImport, importing }) {
  if (!parsed) return null;
  return (
    <div className="ac-card" style={{ marginTop: 16 }}>
      <div className="ac-section-title" style={{ marginBottom: 14 }}>
        E-Rechnung erkannt
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px", marginBottom: 16 }}>
        {[
          ["Aussteller",       parsed.supplier_name],
          ["Rechnungsnummer",  parsed.invoice_number],
          ["Datum",            parsed.invoice_date],
          ["Fällig am",        parsed.due_date],
          ["Netto",            parsed.total_net != null ? fmtEur(parsed.total_net) : null],
          ["USt",              parsed.total_vat != null ? fmtEur(parsed.total_vat) : null],
          ["Brutto",           parsed.total_gross != null ? fmtEur(parsed.total_gross) : null],
          ["Währung",          parsed.currency],
        ].filter(([, v]) => v).map(([l, v]) => (
          <div key={l}>
            <div style={{ fontSize: ".72rem", color: "var(--ink2)", textTransform: "uppercase",
              letterSpacing: ".04em", marginBottom: 3 }}>{l}</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: ".9rem" }}>{v}</div>
          </div>
        ))}
      </div>
      {parsed.line_items?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: ".72rem", color: "var(--ink2)", textTransform: "uppercase",
            letterSpacing: ".04em", marginBottom: 8 }}>Positionen</div>
          <table className="ac-table" style={{ fontSize: ".8rem" }}>
            <thead>
              <tr>
                <th>Beschreibung</th>
                <th style={{ textAlign: "right" }}>Menge</th>
                <th style={{ textAlign: "right" }}>Einzelpreis</th>
                <th style={{ textAlign: "right" }}>Betrag</th>
              </tr>
            </thead>
            <tbody>
              {parsed.line_items.slice(0, 8).map((li, i) => (
                <tr key={i}>
                  <td>{li.description || "—"}</td>
                  <td className="ac-mono" style={{ textAlign: "right" }}>{li.quantity ?? 1}</td>
                  <td className="ac-mono" style={{ textAlign: "right" }}>
                    {li.unit_price != null ? fmtEur(li.unit_price) : "—"}
                  </td>
                  <td className="ac-mono" style={{ textAlign: "right" }}>
                    {li.line_total != null ? fmtEur(li.line_total) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button className="ac-btn ac-btn-primary" onClick={onImport} disabled={importing}>
          {importing ? "Importieren…" : "✓ Als Eingangsrechnung importieren"}
        </button>
      </div>
    </div>
  );
}

export default function ErechnungTab() {
  const [file,       setFile]       = useState(null);
  const [parsed,     setParsed]     = useState(null);
  const [uploading,  setUploading]  = useState(false);
  const [importing,  setImporting]  = useState(false);
  const [msg,        setMsg]        = useState(null);
  const [imported,   setImported]   = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const loadList = useCallback(() => {
    setLoadingList(true);
    api.get("/api/v1/erechnung/list")
      .then(r => setImported(r.data?.erechnungen || []))
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => { loadList(); }, [loadList]);

  const handleFile = async (f) => {
    setFile(f);
    setParsed(null);
    setMsg(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const r = await api.post("/api/v1/erechnung/validate", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setParsed(r.data?.parsed || r.data);
    } catch (e) {
      setMsg({ type: "err", text: e.response?.data?.detail || "Datei konnte nicht geparst werden." });
    } finally { setUploading(false); }
  };

  const doImport = async () => {
    if (!file) return;
    setImporting(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await api.post("/api/v1/erechnung/import", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg({ type: "ok", text: "E-Rechnung erfolgreich importiert." });
      setParsed(null);
      setFile(null);
      loadList();
    } catch (e) {
      setMsg({ type: "err", text: e.response?.data?.detail || "Import fehlgeschlagen." });
    } finally { setImporting(false); }
  };

  return (
    <div>
      <div style={{
        padding: "10px 16px", marginBottom: 20,
        background: "rgba(122,92,255,.07)", border: "1px solid rgba(122,92,255,.15)",
        borderRadius: 10, fontSize: ".82rem", color: "var(--ink2)", lineHeight: 1.6,
      }}>
        <strong style={{ color: "var(--ink)" }}>Ab 01.01.2025 gesetzlich verpflichtend</strong>{" "}
        für alle B2B-Rechnungen (§14 UStG i.V.m. Wachstumschancengesetz / BEG IV 2024).
        NILL empfängt und verarbeitet XRechnung 3.0 (UN/CEFACT CII) und ZUGFeRD 2.x Hybrid-PDFs.
      </div>

      {msg && (
        <div className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
          style={{ marginBottom: 14, cursor: "pointer" }} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}

      <DropZone onFile={handleFile} />

      {uploading && (
        <div className="ac-loading" style={{ marginTop: 16 }}>
          <span className="ac-spinner" />Datei wird analysiert…
        </div>
      )}

      {parsed && (
        <ParsedPreview parsed={parsed} onImport={doImport} importing={importing} />
      )}

      <div style={{ marginTop: 28 }}>
        <div className="ac-section-title" style={{ marginBottom: 14 }}>
          Importierte E-Rechnungen ({imported.length})
        </div>
        {loadingList
          ? <div className="ac-loading"><span className="ac-spinner" />Lade…</div>
          : imported.length === 0
          ? <div className="ac-card"><div className="ac-empty">Noch keine E-Rechnungen importiert.</div></div>
          : (
            <div className="ac-card" style={{ padding: 0, overflowX: "auto" }}>
              <table className="ac-table">
                <thead>
                  <tr>
                    <th>Aussteller</th>
                    <th>Rechnungsnr.</th>
                    <th>Datum</th>
                    <th style={{ textAlign: "right" }}>Brutto</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {imported.map(inv => (
                    <tr key={inv.id}>
                      <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {inv.vendor || "—"}
                      </td>
                      <td className="ac-mono">{inv.invoice_number || "—"}</td>
                      <td className="ac-mono">{inv.invoice_date || "—"}</td>
                      <td className="ac-mono" style={{ textAlign: "right" }}>
                        {inv.total_amount != null ? fmtEur(inv.total_amount) : "—"}
                      </td>
                      <td>
                        <span className="ac-badge ac-badge-purple" style={{ fontSize: ".7rem" }}>
                          E-Rechnung
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
