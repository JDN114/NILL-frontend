// src/components/accounting/JahresabschlussTab.jsx
// Jahresabschluss-Workflow §§242–264 HGB / §4 Abs.3 EStG
// KSt §23 KStG · GewSt §11 GewStG
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

const STATUS_META = {
  entwurf:       { label: "Entwurf",      color: "ac-badge-gray"   },
  in_bearbeitung:{ label: "In Bearbeitung",color: "ac-badge-purple" },
  festgestellt:  { label: "Festgestellt", color: "ac-badge-green"  },
  eingereicht:   { label: "Eingereicht",  color: "ac-badge-green"  },
};

const SCHRITTE = [
  { id: 1, label: "Berechnungen" },
  { id: 2, label: "KSt / GewSt" },
  { id: 3, label: "Prüfung" },
  { id: 4, label: "Feststellung" },
  { id: 5, label: "PDF + Einreichung" },
];

function StepNav({ active, data }) {
  const done = data?.status === "festgestellt" || data?.status === "eingereicht";
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 24, overflowX: "auto" }}>
      {SCHRITTE.map((s, i) => {
        const isDone = done || (data?.kst_betrag && s.id <= 3);
        return (
          <React.Fragment key={s.id}>
            <div style={{
              flex: 1, textAlign: "center", padding: "8px 12px",
              background: s.id === active ? "var(--accent)" : isDone ? "var(--surface2)" : "var(--surface)",
              color: s.id === active ? "#fff" : "var(--ink)",
              borderRadius: i === 0 ? "8px 0 0 8px" : i === SCHRITTE.length - 1 ? "0 8px 8px 0" : 0,
              border: "1px solid var(--border)",
              borderLeft: i > 0 ? "none" : undefined,
              fontSize: ".82rem", fontWeight: s.id === active ? 700 : 400,
              cursor: "default", whiteSpace: "nowrap",
            }}>
              {isDone && s.id < active ? "✓ " : ""}{s.label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Schritt1({ data, jahr, onDone }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const berechnen = async () => {
    setLoading(true); setErr("");
    try {
      await api.post(`/api/v1/jahresabschluss/${jahr}/berechnen`);
      onDone();
    } catch (e) {
      setErr(e.response?.data?.detail || "Berechnung fehlgeschlagen.");
    } finally { setLoading(false); }
  };

  const hasData = data?.guv_umsatzerloese != null || data?.eur_einnahmen != null;

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Schritt 1 — Berechnungen aus Buchungssätzen</div>
      <p style={{ color: "var(--ink2)", fontSize: ".88rem", marginBottom: 16 }}>
        EÜR (§4 Abs. 3 EStG), GuV (§275 HGB) und Bilanz (§266 HGB) werden aus den
        gebuchten Buchungssätzen des Jahres berechnet.
      </p>
      {err && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}
      {hasData && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 16 }}>
          {[
            ["EÜR Einnahmen",     data.eur_einnahmen],
            ["EÜR Gewinn",        data.eur_gewinn_verlust],
            ["GuV Umsatzerlöse",  data.guv_umsatzerloese],
            ["GuV Jahresüberschuss", data.guv_jahresueberschuss],
            ["Bilanz Aktiva",     data.bilanz_aktiva],
          ].filter(([,v]) => v != null).map(([label, val]) => (
            <div key={label} className="ac-kpi">
              <div className="ac-kpi-label">{label}</div>
              <div className="ac-kpi-value" style={{ fontSize: "1rem" }}>{fmtEur(val)}</div>
            </div>
          ))}
        </div>
      )}
      <button className="ac-btn ac-btn-primary" onClick={berechnen} disabled={loading}>
        {loading ? "Berechne…" : hasData ? "Neu berechnen" : "Jetzt berechnen"}
      </button>
      {hasData && !loading && (
        <span style={{ marginLeft: 12, fontSize: ".85rem", color: "var(--accent)" }}>✓ Berechnung vorhanden</span>
      )}
    </div>
  );
}

function Schritt2({ data, jahr, onDone }) {
  const yr = new Date().getFullYear();
  const [form, setForm] = useState({
    gewinn:          String(data?.guv_jahresueberschuss ?? data?.eur_gewinn_verlust ?? 0),
    hinzurechnungen: String(data?.kst_hinzurechnungen ?? 0),
    korrekturen:     String(data?.kst_korrekturen ?? 0),
    hebesatz:        String(data?.gewst_hebesatz ?? 400),
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const berechnen = async () => {
    setLoading(true); setErr("");
    try {
      const r = await api.post(`/api/v1/jahresabschluss/${jahr}/kst-berechnen`, {
        gewinn:          parseFloat(form.gewinn || 0),
        hinzurechnungen: parseFloat(form.hinzurechnungen || 0),
        korrekturen:     parseFloat(form.korrekturen || 0),
        hebesatz:        parseInt(form.hebesatz || 400),
      });
      setResult(r.data);
      onDone();
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Schritt 2 — Körperschaftsteuer / Gewerbesteuer</div>
      <p style={{ color: "var(--ink2)", fontSize: ".88rem", marginBottom: 16 }}>
        Vereinfachte Berechnung nach §23 KStG (15% KSt + 5,5% SolZ) und §11 GewStG.
        Bitte durch Steuerberater vor Abgabe prüfen lassen.
      </p>
      {err && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}
      <div className="ac-form-row">
        <div className="ac-form-col">
          <label className="ac-label">Steuerlicher Gewinn (z.v.E.-Basis) €</label>
          <input className="ac-input ac-mono" type="number" step="0.01" value={form.gewinn}
            onChange={e => set("gewinn", e.target.value)} />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Hinzurechnungen §8 GewStG / §8 KStG €</label>
          <input className="ac-input ac-mono" type="number" step="0.01" value={form.hinzurechnungen}
            onChange={e => set("hinzurechnungen", e.target.value)} />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Kürzungen §9 GewStG / §9 KStG €</label>
          <input className="ac-input ac-mono" type="number" step="0.01" value={form.korrekturen}
            onChange={e => set("korrekturen", e.target.value)} />
        </div>
        <div className="ac-form-col" style={{ maxWidth: 140 }}>
          <label className="ac-label">GewSt-Hebesatz %</label>
          <input className="ac-input ac-mono" type="number" step="1" value={form.hebesatz}
            onChange={e => set("hebesatz", e.target.value)} />
        </div>
      </div>
      <button className="ac-btn ac-btn-primary" onClick={berechnen} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "Berechne…" : "Steuerberechnung ausführen"}
      </button>

      {(result || data?.kst_betrag) && (
        <div style={{ marginTop: 20 }}>
          <div className="ac-section-title" style={{ marginBottom: 12 }}>Steuerberechnung</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
            {[
              ["KSt 15 % (§23 KStG)",     result?.kst_betrag   ?? data?.kst_betrag],
              ["SolZ 5,5 % auf KSt",      result?.solz_betrag  ?? data?.solz_betrag],
              ["GewSt (§11 GewStG)",       result?.gewst_betrag ?? data?.gewst_betrag],
              ["Gesamte Steuerlast",        result?.steuerlast_gesamt ?? data?.steuerlast_gesamt],
            ].map(([label, val]) => (
              <div key={label} className="ac-kpi">
                <div className="ac-kpi-label">{label}</div>
                <div className="ac-kpi-value" style={{ fontSize: ".95rem" }}>{fmtEur(val)}</div>
              </div>
            ))}
          </div>
          {(result?.effektivrate_pct ?? 0) > 0 && (
            <div style={{ marginTop: 10, fontSize: ".82rem", color: "var(--ink2)" }}>
              Effektivbelastung: {result?.effektivrate_pct ?? 0}%
              &nbsp;·&nbsp;
              {result?.hinweis}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Schritt3({ data }) {
  if (!data) return null;
  const checks = [
    { label: "GuV berechnet",        done: data.guv_umsatzerloese != null },
    { label: "Bilanz berechnet",     done: data.bilanz_aktiva != null },
    { label: "EÜR berechnet",        done: data.eur_einnahmen != null },
    { label: "KSt/GewSt berechnet",  done: data.kst_betrag != null },
    { label: "Steuerlast berechnet", done: data.steuerlast_gesamt != null },
  ];
  const allDone = checks.every(c => c.done);
  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Schritt 3 — Vollständigkeitsprüfung</div>
      <div style={{ marginBottom: 16 }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ color: c.done ? "var(--accent)" : "var(--a3)", fontWeight: 700 }}>
              {c.done ? "✓" : "✗"}
            </span>
            <span style={{ fontSize: ".88rem", color: "var(--ink)" }}>{c.label}</span>
          </div>
        ))}
      </div>
      {!allDone && (
        <div className="ac-alert ac-alert-warn">
          Nicht alle Schritte abgeschlossen. Bitte Schritt 1 und 2 vollständig ausführen.
        </div>
      )}
      {allDone && (
        <div className="ac-alert ac-alert-ok">
          ✓ Alle Berechnungen vollständig. Weiter zu Schritt 4: Feststellungsbeschluss.
        </div>
      )}
    </div>
  );
}

function Schritt4({ data, jahr, onDone }) {
  const [form, setForm] = useState({
    festgestellt_von: "",
    feststellungs_notiz: "",
    finanzamt_steuernummer: data?.finanzamt_steuernummer || "",
    finanzamt_aktenzeichen: data?.finanzamt_aktenzeichen || "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  if (data?.status === "festgestellt" || data?.status === "eingereicht") {
    return (
      <div>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Schritt 4 — Feststellungsbeschluss</div>
        <div className="ac-alert ac-alert-ok">
          ✓ Festgestellt am {data.festgestellt_am?.slice(0,10)} von <strong>{data.festgestellt_von}</strong>
          {data.feststellungs_notiz && <div style={{ marginTop: 6 }}>{data.feststellungs_notiz}</div>}
        </div>
      </div>
    );
  }

  const feststellen = async () => {
    if (!form.festgestellt_von.trim()) { setErr("Name ist Pflichtfeld."); return; }
    setLoading(true); setErr("");
    try {
      await api.post(`/api/v1/jahresabschluss/${jahr}/feststellungsbeschluss`, form);
      onDone();
    } catch (e) {
      setErr(e.response?.data?.detail || "Fehler.");
    } finally { setLoading(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Schritt 4 — Feststellungsbeschluss</div>
      <p style={{ color: "var(--ink2)", fontSize: ".88rem", marginBottom: 16 }}>
        Mit der Feststellung wird der Jahresabschluss verbindlich (§42a GmbHG / §316 HGB).
        Eine nachträgliche Neuberechnung ist dann nicht mehr möglich.
      </p>
      {err && <div className="ac-alert ac-alert-err" style={{ marginBottom: 12 }}>{err}</div>}
      <div className="ac-form-row">
        <div className="ac-form-col">
          <label className="ac-label">Festgestellt von (Name) *</label>
          <input className="ac-input" value={form.festgestellt_von}
            onChange={e => set("festgestellt_von", e.target.value)}
            placeholder="Max Mustermann, Geschäftsführer" />
        </div>
        <div className="ac-form-col">
          <label className="ac-label">Steuernummer Finanzamt</label>
          <input className="ac-input ac-mono" value={form.finanzamt_steuernummer}
            onChange={e => set("finanzamt_steuernummer", e.target.value)}
            placeholder="123/456/78901" />
        </div>
      </div>
      <label className="ac-label">Anmerkungen / Beschlussprotokoll</label>
      <textarea className="ac-input" rows={3} value={form.feststellungs_notiz}
        onChange={e => set("feststellungs_notiz", e.target.value)}
        style={{ resize: "vertical", marginBottom: 16 }}
        placeholder="z.B. Beschluss der Gesellschafterversammlung vom…" />
      <button className="ac-btn ac-btn-primary" onClick={feststellen} disabled={loading}>
        {loading ? "Feststellen…" : `Jahresabschluss ${jahr} verbindlich feststellen`}
      </button>
    </div>
  );
}

function Schritt5({ data, jahr, onRefresh }) {
  const [downloading, setDownloading] = useState(false);
  const [einreichend, setEinreichend] = useState(false);

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const r = await api.get(`/api/v1/jahresabschluss/${jahr}/pdf`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([r.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url; a.download = `Jahresabschluss_${jahr}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { /* silent */ } finally { setDownloading(false); }
  };

  const markEingereicht = async () => {
    setEinreichend(true);
    try {
      await api.post(`/api/v1/jahresabschluss/${jahr}/eingereicht`);
      onRefresh();
    } catch { /* silent */ } finally { setEinreichend(false); }
  };

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Schritt 5 — PDF Export + Einreichung</div>
      <p style={{ color: "var(--ink2)", fontSize: ".88rem", marginBottom: 16 }}>
        Jahresabschluss-PDF herunterladen und beim Finanzamt / Bundesanzeiger einreichen.
        GmbH/AG: Pflicht zur Offenlegung §325 HGB (Frist: 12 Monate nach Geschäftsjahresende).
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="ac-btn ac-btn-primary" onClick={downloadPdf} disabled={downloading}>
          {downloading ? "Generiere PDF…" : "📄 Jahresabschluss PDF"}
        </button>
        {data?.status === "festgestellt" && (
          <button className="ac-btn ac-btn-ghost" onClick={markEingereicht} disabled={einreichend}>
            {einreichend ? "Markiere…" : "✓ Als eingereicht markieren"}
          </button>
        )}
      </div>
      {data?.status === "eingereicht" && (
        <div className="ac-alert ac-alert-ok" style={{ marginTop: 14 }}>
          ✓ Eingereicht am {data.eingereicht_am?.slice(0,10)}
        </div>
      )}
    </div>
  );
}

// ── Hauptkomponente ───────────────────────────────────────────────────────────
export default function JahresabschlussTab() {
  const yr = new Date().getFullYear();
  const [jahr, setJahr]       = useState(yr);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [schritt, setSchritt] = useState(1);
  const [liste, setListe]     = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r, l] = await Promise.all([
        api.get(`/api/v1/jahresabschluss/${jahr}`),
        api.get("/api/v1/jahresabschluss"),
      ]);
      setData(r.data);
      setListe(l.data || []);
      // Schritt automatisch anpassen
      if (r.data?.status === "festgestellt" || r.data?.status === "eingereicht") setSchritt(5);
      else if (r.data?.kst_betrag) setSchritt(3);
      else if (r.data?.status === "in_bearbeitung") setSchritt(2);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [jahr]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="ac-loading"><span className="ac-spinner" /> Lade…</div>;

  const meta = STATUS_META[data?.status || "entwurf"];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 700 }}>
          Jahresabschluss
        </div>
        <select className="ac-select" value={jahr} onChange={e => setJahr(+e.target.value)}
          style={{ width: 100 }}>
          {[yr - 2, yr - 1, yr, yr + 1].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        {data && (
          <span className={`ac-badge ${meta.color}`} style={{ fontSize: ".78rem" }}>
            {meta.label}
          </span>
        )}
        {liste.length > 1 && (
          <div style={{ marginLeft: "auto", fontSize: ".8rem", color: "var(--ink2)" }}>
            {liste.length} gespeicherte Abschlüsse
          </div>
        )}
      </div>

      {/* Schritte-Navigation */}
      <StepNav active={schritt} data={data} />

      {/* Schritt-Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {SCHRITTE.map(s => (
          <button key={s.id} className={`ac-btn ac-btn-sm ${schritt === s.id ? "ac-btn-primary" : "ac-btn-ghost"}`}
            onClick={() => setSchritt(s.id)}>
            {s.id}. {s.label}
          </button>
        ))}
      </div>

      {/* Aktiver Schritt */}
      <div className="ac-card">
        <div style={{ padding: "20px 24px" }}>
          {schritt === 1 && <Schritt1 data={data} jahr={jahr} onDone={load} />}
          {schritt === 2 && <Schritt2 data={data} jahr={jahr} onDone={load} />}
          {schritt === 3 && <Schritt3 data={data} />}
          {schritt === 4 && <Schritt4 data={data} jahr={jahr} onDone={load} />}
          {schritt === 5 && <Schritt5 data={data} jahr={jahr} onRefresh={load} />}
        </div>
      </div>

      {/* Gespeicherte Jahresabschlüsse */}
      {liste.length > 0 && (
        <div className="ac-card" style={{ marginTop: 20, padding: 0 }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
            <span className="ac-section-title">Alle Jahresabschlüsse</span>
          </div>
          <table className="ac-table">
            <thead><tr>
              <th>Jahr</th><th>Status</th>
              <th style={{ textAlign: "right" }}>Gewinn</th>
              <th style={{ textAlign: "right" }}>Steuerlast</th>
              <th>Festgestellt</th>
            </tr></thead>
            <tbody>
              {liste.map(a => {
                const m = STATUS_META[a.status] || STATUS_META.entwurf;
                const gewinn = a.eur_gewinn_verlust ?? a.guv_jahresueberschuss;
                return (
                  <tr key={a.id} onClick={() => setJahr(a.jahr)} style={{ cursor: "pointer" }}>
                    <td className="ac-mono" style={{ fontWeight: 600 }}>{a.jahr}</td>
                    <td><span className={`ac-badge ${m.color}`} style={{ fontSize: ".72rem" }}>{m.label}</span></td>
                    <td className="ac-mono" style={{ textAlign: "right" }}>{gewinn != null ? fmtEur(gewinn) : "—"}</td>
                    <td className="ac-mono" style={{ textAlign: "right" }}>{a.steuerlast_gesamt ? fmtEur(a.steuerlast_gesamt) : "—"}</td>
                    <td style={{ fontSize: ".82rem", color: "var(--ink2)" }}>
                      {a.festgestellt_von ? `${a.festgestellt_am?.slice(0,10)} · ${a.festgestellt_von}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
