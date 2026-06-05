// src/components/accounting/ImportTab.jsx
import React, { useState, useRef } from "react";
import api from "../../services/api";

const BUCHUNGEN_VORLAGE = [
  "buchungsdatum;buchungstext;beleg_nummer;konto_soll;konto_haben;betrag;ust_kennzeichen",
  "2026-01-15;Büromaterial Staples;RE-2026-001;4930;1200;119.00;ust_19",
  "2026-01-20;Monatliche Miete Januar;RE-2026-002;4210;1200;1200.00;",
  "2026-02-01;Telefonkosten Januar;RE-2026-003;4920;1200;59.50;ust_19",
  "2026-02-15;Umsatz Kunde Müller GmbH;AR-2026-001;1200;8400;595.00;ust_19",
  "2026-03-10;Fahrtkosten Außendienst;RE-2026-010;4320;1200;85.00;",
].join("\n");

const RECHNUNGEN_VORLAGE = [
  "datum;rechnungsnummer;lieferant;netto_betrag;mwst_satz;brutto_betrag;status",
  "2026-01-05;RE-2026-001;Staples GmbH;100.00;19;119.00;paid",
  "2026-01-20;RE-2026-002;Landlord AG;1200.00;0;1200.00;paid",
  "2026-02-08;RE-2026-003;Telekom;50.00;19;59.50;paid",
  "2026-03-15;RE-2026-020;Software AG;800.00;19;952.00;open",
  "2026-04-01;RE-2026-035;IT-Service GmbH;1500.00;19;1785.00;open",
].join("\n");

const AUSGANGSRECHNUNGEN_VORLAGE = [
  "rechnungsdatum;rechnungsnummer;empfaenger_name;empfaenger_strasse;empfaenger_plz;empfaenger_ort;betreff;beschreibung;menge;einzelpreis;ust_satz;zahlungsziel_tage;status",
  "2026-01-15;AR-2026-001;Müller GmbH;Hauptstr. 1;80331;München;Beratung Januar;Strategieberatung;10;150.00;19;14;bezahlt",
  "2026-01-15;AR-2026-001;Müller GmbH;Hauptstr. 1;80331;München;Beratung Januar;Reisekosten;1;85.00;0;14;bezahlt",
  "2026-02-01;AR-2026-002;Schmidt AG;;;Berlin;Webentwicklung Februar;Frontend-Entwicklung;20;120.00;19;30;bezahlt",
  "2026-03-10;AR-2026-003;Beispiel KG;;;Hamburg;Consulting;Workshop-Durchführung;2;800.00;19;14;offen",
].join("\n");

const UST_KZ_HINWEIS = [
  "ust_19 → Umsatzsteuer 19 %",
  "ust_7  → Umsatzsteuer 7 %",
  "kein_ust → Steuerfrei §4 UStG",
  "ig_lieferung → ig-Lieferung §4 Nr. 1b",
  "ig_erwerb → ig-Erwerb",
  "reverse_charge → Reverse Charge §13b",
  "drittland → Drittland §6",
  "oss → OSS §18j",
  "(leer) → Kein Kennzeichen",
];

function downloadCsv(filename, content) {
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function parseCsvPreview(text, maxRows = 5) {
  const lines  = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { header: [], rows: [] };
  const delim  = lines[0].includes(";") ? ";" : ",";
  const header = lines[0].split(delim).map(h => h.trim().replace(/^"|"$/g, ""));
  const rows   = lines.slice(1, maxRows + 1).map(l =>
    l.split(delim).map(c => c.trim().replace(/^"|"$/g, ""))
  );
  return { header, rows };
}

function FileUploadSection({ label, endpoint, vorlage, vorlageName, hinweise, onDone }) {
  const inputRef   = useRef(null);
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);

  const MAX_CSV_PREVIEW_MB = 5;

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size / 1024 / 1024 > MAX_CSV_PREVIEW_MB) {
      alert(`CSV-Datei ist zu groß für die Vorschau (max. ${MAX_CSV_PREVIEW_MB} MB). Die Datei kann trotzdem importiert werden.`);
      setFile(f);
      setPreview(null);
      setResult(null);
      return;
    }
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(parseCsvPreview(ev.target.result));
    reader.readAsText(f, "utf-8");
  };

  const doImport = async () => {
    if (!file) return;
    setLoading(true); setResult(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const r = await api.post(endpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult({ ok: true, ...r.data });
      if (r.data.imported > 0 && onDone) onDone();
    } catch (e) {
      setResult({ ok: false, msg: e.response?.data?.detail || "Import fehlgeschlagen." });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null); setPreview(null); setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="ac-card" style={{ marginBottom: 20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: 16 }}>
        <div className="ac-section-title" style={{ marginBottom: 0 }}>{label}</div>
        <button
          className="ac-btn ac-btn-ghost ac-btn-sm"
          onClick={() => downloadCsv(vorlageName, vorlage)}
        >
          Vorlage herunterladen
        </button>
      </div>

      {/* Hinweis-Box */}
      <details style={{ marginBottom: 16 }}>
        <summary style={{ fontSize:".8rem", color:"var(--ink2)", cursor:"pointer", userSelect:"none" }}>
          CSV-Format & Spalten anzeigen
        </summary>
        <div style={{
          marginTop: 10, padding: "12px 16px",
          background: "var(--surface2)", borderRadius: 8,
          fontSize: ".78rem", color: "var(--ink2)", lineHeight: 1.7,
        }}>
          <div style={{ marginBottom: 8, fontFamily: "JetBrains Mono, monospace", fontSize: ".75rem" }}>
            {vorlage.split("\n")[0]}
          </div>
          {hinweise && (
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {hinweise.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          )}
          <div style={{ marginTop: 8 }}>Trennzeichen: Semikolon <code>;</code> oder Komma <code>,</code></div>
        </div>
      </details>

      {/* Upload */}
      {!file ? (
        <label style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          border: "2px dashed var(--border)", borderRadius: 10, padding: "32px 24px", cursor: "pointer",
          transition: "border-color .15s",
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <input ref={inputRef} type="file" accept=".csv,.txt" style={{ display:"none" }} onChange={onFileChange} />
          <div style={{ fontSize: "1.8rem", marginBottom: 10 }}></div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>CSV-Datei hochladen</div>
          <div style={{ fontSize: ".8rem", color: "var(--ink2)" }}>Klicken oder hierher ziehen (.csv, .txt)</div>
        </label>
      ) : (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16,
            background:"var(--surface2)", borderRadius:8, padding:"10px 14px" }}>
            <span style={{ fontSize:"1.2rem" }}></span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:".9rem" }}>{file.name}</div>
              <div style={{ fontSize:".75rem", color:"var(--ink2)" }}>
                {(file.size / 1024).toFixed(1)} KB
              </div>
            </div>
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={reset}>Andere Datei</button>
          </div>

          {/* Preview */}
          {preview && preview.header.length > 0 && (
            <div style={{ marginBottom: 16, overflowX: "auto" }}>
              <div style={{ fontSize:".75rem", color:"var(--ink2)", marginBottom:6 }}>
                Vorschau (erste 5 Zeilen):
              </div>
              <table className="ac-table" style={{ fontSize:".78rem", minWidth:500 }}>
                <thead>
                  <tr>
                    {preview.header.map((h, i) => <th key={i}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {result && (
            <div className={`ac-alert ${result.ok ? "ac-alert-ok" : "ac-alert-err"}`} style={{ marginBottom:12 }}>
              {result.ok
                ? `${result.imported} von ${result.total} Einträgen erfolgreich importiert.`
                : result.msg}
              {result.ok && result.errors?.length > 0 && (
                <details style={{ marginTop:8 }}>
                  <summary style={{ cursor:"pointer", fontSize:".8rem" }}>
                    {result.errors.length} Warnung(en) anzeigen
                  </summary>
                  <ul style={{ margin:"8px 0 0", paddingLeft:20, fontSize:".78rem" }}>
                    {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )}

          <div style={{ display:"flex", gap:10 }}>
            <button className="ac-btn ac-btn-primary" onClick={doImport} disabled={loading}>
              {loading ? "Importiere…" : `${label} importieren`}
            </button>
            <button className="ac-btn ac-btn-ghost" onClick={reset}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ImportTab({ onDone }) {
  const [sub, setSub] = useState("buchungen");

  return (
    <div>
      <div style={{
        background: "rgba(198,255,60,.07)", border: "1px solid rgba(198,255,60,.18)",
        borderRadius: 10, padding: "14px 18px", marginBottom: 20,
        display: "flex", gap: 14, alignItems: "flex-start",
      }}>
        <div style={{ fontSize: "1.4rem", flexShrink: 0 }}></div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Jahres-Import — bestehende Daten übernehmen</div>
          <p style={{ fontSize:".85rem", color:"var(--ink2)", lineHeight:1.6, margin:0 }}>
            Da das Geschäftsjahr bereits läuft, können Sie hier Buchungen und Eingangsrechnungen aus
            anderen Programmen (Lexware, DATEV, Excel) als CSV importieren.
            Laden Sie zunächst die Vorlage herunter, befüllen Sie diese mit Ihren Daten und laden Sie die
            fertige Datei hoch.
          </p>
        </div>
      </div>

      <div style={{ display:"flex", gap:4, background:"var(--surface)", borderRadius:10, padding:4, marginBottom:20, flexWrap:"wrap" }}>
        {[
          ["buchungen",         "Buchungen (Journal)"],
          ["rechnungen",        "Eingangsrechnungen"],
          ["ausgangsrechnungen","Ausgangsrechnungen"],
        ].map(([s,l]) => (
          <button key={s}
            className={`ac-btn ${sub===s?"ac-btn-primary":"ac-btn-ghost"}`}
            style={{ fontSize:".82rem" }}
            onClick={() => setSub(s)}>
            {l}
          </button>
        ))}
      </div>

      {sub === "buchungen" && (
        <FileUploadSection
          label="Buchungen (Journal)"
          endpoint="/api/v1/buchhaltung/import/buchungen"
          vorlage={BUCHUNGEN_VORLAGE}
          vorlageName="Buchungen_Import_Vorlage.csv"
          hinweise={[
            "konto_soll / konto_haben: SKR03-Kontonummer (z. B. 4930, 1200, 8400)",
            "betrag: Bruttobetrag in EUR, Dezimaltrennzeichen Punkt (z. B. 119.00)",
            "ust_kennzeichen: " + UST_KZ_HINWEIS.join(" | "),
          ]}
          onDone={onDone}
        />
      )}
      {sub === "rechnungen" && (
        <FileUploadSection
          label="Eingangsrechnungen"
          endpoint="/api/v1/buchhaltung/import/rechnungen"
          vorlage={RECHNUNGEN_VORLAGE}
          vorlageName="Eingangsrechnungen_Import_Vorlage.csv"
          hinweise={[
            "mwst_satz: Prozentsatz ohne % (z. B. 19, 7 oder 0)",
            "status: open | paid | overdue | draft",
            "Netto + Brutto können beide angegeben werden; fehlt Brutto wird Netto verwendet",
          ]}
          onDone={onDone}
        />
      )}
      {sub === "ausgangsrechnungen" && (
        <FileUploadSection
          label="Ausgangsrechnungen"
          endpoint="/api/v1/buchhaltung/import/ausgangsrechnungen"
          vorlage={AUSGANGSRECHNUNGEN_VORLAGE}
          vorlageName="Ausgangsrechnungen_Import_Vorlage.csv"
          hinweise={[
            "Mehrere Zeilen mit gleicher rechnungsnummer → mehrere Positionen auf einer Rechnung.",
            "einzelpreis: Netto-Einzelpreis in EUR (z. B. 150.00).",
            "ust_satz: Steuersatz als Zahl ohne % (19, 7 oder 0).",
            "status: offen | bezahlt | entwurf | storniert.",
            "Pflichtfelder: rechnungsdatum, empfaenger_name, beschreibung, einzelpreis.",
          ]}
          onDone={onDone}
        />
      )}

      <div className="ac-card" style={{ borderColor:"rgba(155,152,144,.12)", marginTop:8 }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
          <div style={{ fontSize:"1.2rem" }}></div>
          <div>
            <div style={{ fontWeight:600, marginBottom:6, fontSize:".9rem" }}>Hinweise zum Import</div>
            <ul style={{ fontSize:".82rem", color:"var(--ink2)", lineHeight:1.75, paddingLeft:18, margin:0 }}>
              <li>Vorlage als Referenz verwenden — eigene Spaltenreihenfolge wird erkannt, Spaltennamen müssen stimmen.</li>
              <li>Buchungen-Import: Jede Zeile erzeugt einen einfachen Buchungssatz (eine Soll-, eine Haben-Zeile).</li>
              <li>Für komplexere Buchungssätze (mehr als 2 Zeilen) nutzen Sie das Journal direkt.</li>
              <li><strong style={{ color:"var(--a2)" }}>⚠ Keine Duplikatsprüfung:</strong> Bereits importierte Buchungen werden nicht erkannt — dieselbe Datei zweimal importieren erzeugt doppelte Buchungen. Vor dem Import sicherstellen, dass die Datei noch nicht importiert wurde.</li>
              <li>Nach dem Import erscheinen Buchungen sofort im Journal und in allen Berichten.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
