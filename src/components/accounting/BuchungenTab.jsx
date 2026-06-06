// src/components/accounting/BuchungenTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmt    = (n) => Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtEur = (n) => `${fmt(n)} EUR`;

const UST_OPTIONS = [
  { value: "",             label: "Kein Kennzeichen" },
  { value: "ust_19",       label: "USt 19%" },
  { value: "ust_7",        label: "USt 7%" },
  { value: "kein_ust",     label: "Steuerfrei §4 UStG" },
  { value: "ig_lieferung", label: "ig-Lieferung §4 Nr. 1b" },
  { value: "ig_erwerb",    label: "ig-Erwerb" },
  { value: "reverse_charge", label: "Reverse Charge §13b" },
  { value: "drittland",    label: "Drittland §6" },
  { value: "oss",          label: "OSS §18j" },
];

function NeuBuchungModal({ konten, perioden, onClose, onSaved }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    buchungsdatum: today, buchungstext: "", beleg_nummer: "",
    periode_id: perioden[0]?.id || "", buchungstyp: "standard",
    waehrung: "EUR", betrag_fremd: "", kurs_fremd: "",
  });
  const [zeilen, setZeilen] = useState([
    { konto_id: "", soll: "", haben: "", ust_kennzeichen: "", kostenstelle_id: "" },
    { konto_id: "", soll: "", haben: "", ust_kennzeichen: "", kostenstelle_id: "" },
  ]);
  const [kostenstellen, setKostenstellen] = React.useState([]);
  React.useEffect(() => {
    api.get("/api/v1/kostenstellen").then(r => setKostenstellen(r.data || [])).catch(() => {});
  }, []);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [kontoSearch, setKontoSearch] = useState("");

  const sollSumme  = zeilen.reduce((s, z) => s + parseFloat(z.soll  || 0), 0);
  const habenSumme = zeilen.reduce((s, z) => s + parseFloat(z.haben || 0), 0);
  const balanced   = Math.abs(sollSumme - habenSumme) < 0.005;

  const addZeile    = () => setZeilen(z => [...z, { konto_id: "", soll: "", haben: "", ust_kennzeichen: "", kostenstelle_id: "" }]);
  const removeZeile = (i) => setZeilen(z => z.filter((_, idx) => idx !== i));
  const setZeile    = (i, key, val) => setZeilen(z => z.map((row, idx) => idx === i ? { ...row, [key]: val } : row));

  const save = async () => {
    setError("");
    if (!balanced) { setError("Debet und Kredit sind nicht ausgeglichen. Die Summe aller Soll-Beträge muss gleich der Summe aller Haben-Beträge sein. Bitte prüfen Sie die eingegebenen Beträge."); return; }
    if (zeilen.some(z => !z.konto_id)) { setError("Alle Zeilen brauchen ein Konto."); return; }
    setLoading(true);
    try {
      await api.post("/api/v1/buchhaltung/buchungen", {
        ...form,
        brutto_betrag: sollSumme,
        periode_id:    form.periode_id || null,
        waehrung:      form.waehrung || "EUR",
        betrag_fremd:  form.betrag_fremd ? parseFloat(form.betrag_fremd) : null,
        kurs_fremd:    form.kurs_fremd   ? parseFloat(form.kurs_fremd)   : null,
        zeilen: zeilen.map(z => ({
          konto_id: z.konto_id,
          soll:  parseFloat(z.soll  || 0),
          haben: parseFloat(z.haben || 0),
          ust_kennzeichen: z.ust_kennzeichen || null,
          kostenstelle_id: z.kostenstelle_id ? parseInt(z.kostenstelle_id) : null,
        })),
      });
      onSaved(); onClose();
    } catch (e) {
      setError(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setLoading(false); }
  };

  return (
    <div className="ac-modal-backdrop">
      <div className="ac-modal" style={{ maxWidth: 680 }}>
        <div className="ac-modal-title">Neuer Buchungssatz</div>
        {error && <div role="alert" className="ac-alert ac-alert-err">{error}</div>}
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Buchungsdatum</label>
            <input className="ac-input" type="date" value={form.buchungsdatum}
              onChange={e => setForm(f => ({ ...f, buchungsdatum: e.target.value }))} />
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Beleg-Nr.</label>
            <input className="ac-input" value={form.beleg_nummer} placeholder="RE-2024-001"
              onChange={e => setForm(f => ({ ...f, beleg_nummer: e.target.value }))} />
          </div>
          <div className="ac-form-col" style={{ flex: 2 }}>
            <label className="ac-label">Buchungstext</label>
            <input className="ac-input" value={form.buchungstext} placeholder="Beschreibung..."
              onChange={e => setForm(f => ({ ...f, buchungstext: e.target.value }))} />
          </div>
        </div>
        <div className="ac-form-row">
          <div className="ac-form-col">
            <label className="ac-label">Periode</label>
            <select className="ac-select" value={form.periode_id}
              onChange={e => setForm(f => ({ ...f, periode_id: e.target.value }))}>
              {perioden.map(p => (
                <option key={p.id} value={p.id}>{p.bezeichnung || `${p.von} – ${p.bis}`}</option>
              ))}
            </select>
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Typ</label>
            <select className="ac-select" value={form.buchungstyp}
              onChange={e => setForm(f => ({ ...f, buchungstyp: e.target.value }))}>
              <option value="standard">Standard</option>
              <option value="eingangsrechnung">Eingangsrechnung</option>
              <option value="ausgangsrechnung">Ausgangsrechnung</option>
              <option value="zahlung">Zahlung</option>
              <option value="abschreibung">Abschreibung</option>
              <option value="umbuchung">Umbuchung</option>
            </select>
          </div>
          <div className="ac-form-col" style={{ maxWidth: 90 }}>
            <label className="ac-label">Währung</label>
            <input className="ac-input ac-mono" value={form.waehrung}
              onChange={e => setForm(f => ({ ...f, waehrung: e.target.value.toUpperCase().slice(0,3) }))}
              placeholder="EUR" maxLength={3} />
          </div>
        </div>
        {form.waehrung && form.waehrung !== "EUR" && (
          <div className="ac-form-row" style={{ marginBottom: 8 }}>
            <div className="ac-form-col">
              <label className="ac-label">Betrag in {form.waehrung}</label>
              <input className="ac-input ac-mono" type="number" step="0.01"
                value={form.betrag_fremd}
                onChange={e => setForm(f => ({ ...f, betrag_fremd: e.target.value }))}
                placeholder={`Betrag in ${form.waehrung}`} />
            </div>
            <div className="ac-form-col">
              <label className="ac-label">Kurs (1 {form.waehrung} = X EUR)</label>
              <input className="ac-input ac-mono" type="number" step="0.000001"
                value={form.kurs_fremd}
                onChange={e => setForm(f => ({ ...f, kurs_fremd: e.target.value }))}
                placeholder="z.B. 1.08 für USD" />
            </div>
            {form.betrag_fremd && form.kurs_fremd && (
              <div className="ac-form-col" style={{ display:"flex", alignItems:"flex-end", paddingBottom: 6 }}>
                <span style={{ fontSize: ".82rem", color: "var(--ink2)" }}>
                  ≈ {(parseFloat(form.betrag_fremd) * parseFloat(form.kurs_fremd)).toLocaleString("de-DE",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR
                </span>
              </div>
            )}
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <span className="ac-label">Buchungszeilen</span>
            <span style={{ fontSize:".8rem", color: balanced ? "var(--accent)" : "var(--a3)" }}>
              Soll: {fmt(sollSumme)} | Haben: {fmt(habenSumme)}{" "}
              {balanced ? "✓ Ausgeglichen" : "⚠ Nicht ausgeglichen"}
            </span>
          </div>
          <div style={{ fontSize:".78rem", color:"var(--ink2)", marginBottom:8, lineHeight:1.5 }}>
            <strong style={{color:"var(--ink)"}}>Soll</strong> = ausgehende Beträge (z.B. Bankabgang, Aufwand) ·{" "}
            <strong style={{color:"var(--ink)"}}>Haben</strong> = eingehende Beträge (z.B. Einnahme, Verbindlichkeit). Beide Summen müssen gleich sein.
          </div>
          <input
            className="ac-input"
            placeholder="Konto suchen (Nr. oder Name)…"
            value={kontoSearch}
            onChange={e => setKontoSearch(e.target.value)}
            style={{ marginBottom: 8, fontSize: ".83rem" }}
          />
          {zeilen.map((z, i) => {
            const SKR03_GRUPPEN = [
              { prefix: "0", label: "Klasse 0 – Anlage- & Kapitalkonten" },
              { prefix: "1", label: "Klasse 1 – Finanz- & Privatkonten" },
              { prefix: "2", label: "Klasse 2 – Abgrenzungskonten" },
              { prefix: "3", label: "Klasse 3 – Waren & Bestände" },
              { prefix: "4", label: "Klasse 4 – Betriebliche Aufwendungen (Kosten)" },
              { prefix: "5", label: "Klasse 5 – Diverse" },
              { prefix: "6", label: "Klasse 6 – Diverse" },
              { prefix: "7", label: "Klasse 7 – Bestände & Eigenleistungen" },
              { prefix: "8", label: "Klasse 8 – Erlöse (Einnahmen)" },
              { prefix: "9", label: "Klasse 9 – Vortrags- & Abschlusskonten" },
            ];
            const searchLow = kontoSearch.toLowerCase();
            const filtered = konten.filter(k =>
              !kontoSearch ||
              String(k.kontonummer).includes(kontoSearch) ||
              k.bezeichnung.toLowerCase().includes(searchLow)
            );
            return (
            <div key={i} className="ac-form-row" style={{ marginBottom: 8 }}>
              <div className="ac-form-col" style={{ flex: 3 }}>
                <select className="ac-select" value={z.konto_id}
                  onChange={e => setZeile(i, "konto_id", e.target.value)}>
                  <option value="">-- Konto wählen --</option>
                  {kontoSearch
                    ? filtered.map(k => (
                        <option key={k.id} value={k.id}>{k.kontonummer} – {k.bezeichnung}</option>
                      ))
                    : SKR03_GRUPPEN.map(g => {
                        const gruppe = konten.filter(k => String(k.kontonummer).startsWith(g.prefix));
                        if (!gruppe.length) return null;
                        return (
                          <optgroup key={g.prefix} label={g.label}>
                            {gruppe.map(k => (
                              <option key={k.id} value={k.id}>{k.kontonummer} – {k.bezeichnung}</option>
                            ))}
                          </optgroup>
                        );
                      })
                  }
                </select>
              </div>
              <div className="ac-form-col">
                <input className="ac-input ac-mono" placeholder="Soll" type="number" step="0.01"
                  value={z.soll} onChange={e => setZeile(i, "soll", e.target.value)} />
              </div>
              <div className="ac-form-col">
                <input className="ac-input ac-mono" placeholder="Haben" type="number" step="0.01"
                  value={z.haben} onChange={e => setZeile(i, "haben", e.target.value)} />
              </div>
              <div className="ac-form-col" style={{ flex: 2 }}>
                <select className="ac-select" value={z.ust_kennzeichen}
                  onChange={e => setZeile(i, "ust_kennzeichen", e.target.value)}>
                  {UST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              {kostenstellen.length > 0 && (
                <div className="ac-form-col" style={{ minWidth: 130 }}>
                  <select className="ac-select" value={z.kostenstelle_id}
                    onChange={e => setZeile(i, "kostenstelle_id", e.target.value)}>
                    <option value="">— KST —</option>
                    {kostenstellen.map(k => (
                      <option key={k.id} value={k.id}>{k.nummer} {k.bezeichnung}</option>
                    ))}
                  </select>
                </div>
              )}
              <button className="ac-btn ac-btn-danger ac-btn-sm" onClick={() => removeZeile(i)}
                disabled={zeilen.length <= 2}>x</button>
            </div>
            );
          })}
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={addZeile}>+ Zeile</button>
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={loading || !balanced}>
            {loading ? "..." : "Buchen"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuchungenTab() {
  const today = new Date();
  const [buchungen, setBuchungen]     = useState([]);
  const [konten, setKonten]           = useState([]);
  const [perioden, setPerioden]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [expanded, setExpanded]       = useState({});
  const [filter, setFilter]           = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [kontoFilter, setKontoFilter] = useState("");
  const [msg, setMsg]                 = useState(null);
  const [von, setVon]               = useState(`${today.getFullYear()}-01-01`);
  const [bis, setBis]               = useState(today.toISOString().slice(0, 10));

  // Debounce text filter: wait 300 ms after last keystroke before firing request
  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilter(filter), 300);
    return () => clearTimeout(t);
  }, [filter]);

  const load = useCallback(() => {
    setLoading(true);
    const params = { von, bis, limit: 200 };
    if (debouncedFilter) params.q = debouncedFilter;
    if (kontoFilter)     params.konto_id = kontoFilter;
    Promise.all([
      api.get("/api/v1/buchhaltung/buchungen", { params }),
      api.get("/api/v1/buchhaltung/konten"),
      api.get("/api/v1/buchhaltung/perioden"),
    ]).then(([b, k, p]) => {
      setBuchungen(b.data || []);
      setKonten(k.data || []);
      setPerioden(p.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [von, bis, debouncedFilter, kontoFilter]);

  useEffect(() => { load(); }, [load]);

  const storno = async (id) => {
    if (!window.confirm("Buchungssatz stornieren?")) return;
    try {
      await api.post(`/api/v1/buchhaltung/buchungen/${id}/storno`, {
        storno_datum: new Date().toISOString().slice(0, 10),
        storno_grund: "Manuelle Stornierung",
      });
      setMsg({ type: "ok", text: "Storno-Buchung erstellt." });
      load();
    } catch (e) {
      setMsg({ type: "err", text: e.response?.data?.detail || "Storno fehlgeschlagen." });
    }
  };

  // Filtering is now server-side; buchungen already matches current filter state
  const filtered = buchungen;

  if (loading) return <div role="status" aria-live="polite" className="ac-loading"><span className="ac-spinner" aria-hidden="true"/>Lade Journal...</div>;

  return (
    <div>
      <div style={{ display:"flex", gap:10, alignItems:"flex-end", marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label className="ac-label">Von</label>
          <input className="ac-input" type="date" value={von} onChange={e => setVon(e.target.value)} style={{ width:140 }} />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label className="ac-label">Bis</label>
          <input className="ac-input" type="date" value={bis} onChange={e => setBis(e.target.value)} style={{ width:140 }} />
        </div>
        <input className="ac-input" style={{ flex:1, minWidth:180 }} aria-label="Buchungen suchen" placeholder="Suche (Text, Belegnr.)..."
          value={filter} onChange={e => setFilter(e.target.value)} />
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label className="ac-label">Konto</label>
          <select className="ac-select" style={{ minWidth:200 }} value={kontoFilter}
            onChange={e => setKontoFilter(e.target.value)}>
            <option value="">Alle Konten</option>
            {konten.map(k => (
              <option key={k.id} value={String(k.id)}>{k.kontonummer} – {k.bezeichnung}</option>
            ))}
          </select>
        </div>
        <button className="ac-btn ac-btn-primary" onClick={() => setShowModal(true)}>+ Buchungssatz</button>
      </div>
      {msg && (
        <div role={msg.type === "ok" ? "status" : "alert"} aria-live="polite" className={`ac-alert ${msg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
          style={{ cursor:"pointer" }} onClick={() => setMsg(null)}>{msg.text}</div>
      )}
      <div className="ac-card" style={{ padding: 0 }}>
        <table aria-label="Buchungen" className="ac-table">
          <thead>
            <tr><th scope="col">Datum</th><th scope="col">Beleg</th><th scope="col">Text</th><th scope="col">Typ</th><th scope="col" style={{textAlign:"right"}}>Betrag</th><th scope="col">Status</th><th scope="col"></th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="ac-empty">Keine Buchungen gefunden.</td></tr>
            )}
            {filtered.map(b => (
              <React.Fragment key={b.id}>
                <tr
                  tabIndex={0}
                  style={{ cursor:"pointer" }}
                  aria-expanded={!!expanded[b.id]}
                  onClick={() => setExpanded(e => ({ ...e, [b.id]: !e[b.id] }))}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(ex => ({ ...ex, [b.id]: !ex[b.id] })); } }}
                >
                  <td className="ac-mono">{b.buchungsdatum}</td>
                  <td className="ac-mono" style={{ color:"var(--ink2)" }}>{b.beleg_nummer || "--"}</td>
                  <td>{b.buchungstext || "--"}</td>
                  <td>
                    <span className="ac-badge ac-badge-gray">{b.buchungstyp}</span>
                    {b.ist_storno && <span className="ac-badge ac-badge-pink" style={{marginLeft:4}}>STORNO</span>}
                  </td>
                  <td className="ac-mono" style={{ textAlign:"right" }}>{fmtEur(b.brutto_betrag)}</td>
                  <td>
                    {b.festgeschrieben
                      ? <span className="ac-badge ac-badge-green">Fest</span>
                      : <span className="ac-badge ac-badge-gray">Offen</span>}
                  </td>
                  <td>
                    {!b.festgeschrieben && !b.ist_storno && (
                      <button className="ac-btn ac-btn-danger ac-btn-sm"
                        onClick={e => { e.stopPropagation(); storno(b.id); }}>Storno</button>
                    )}
                  </td>
                </tr>
                {expanded[b.id] && b.zeilen?.length > 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "0 0 0 32px" }}>
                      <table aria-label="Buchungen" className="ac-table" style={{ fontSize:".8rem", margin:"8px 0" }}>
                        <thead><tr><th scope="col">Konto</th><th scope="col" style={{textAlign:"right"}}>Soll</th><th scope="col" style={{textAlign:"right"}}>Haben</th><th scope="col">USt-Kennzeichen</th></tr></thead>
                        <tbody>
                          {b.zeilen.map(z => (
                            <tr key={z.id}>
                              <td className="ac-mono">{z.konto_nummer ? `${z.konto_nummer} – ${z.konto_name}` : z.konto_id}</td>
                              <td className="ac-mono" style={{ textAlign:"right", color: z.soll > 0 ? "var(--accent)" : "var(--ink2)" }}>
                                {z.soll > 0 ? fmtEur(z.soll) : "--"}
                              </td>
                              <td className="ac-mono" style={{ textAlign:"right", color: z.haben > 0 ? "var(--a2)" : "var(--ink2)" }}>
                                {z.haben > 0 ? fmtEur(z.haben) : "--"}
                              </td>
                              <td style={{ color:"var(--ink2)" }}>{z.ust_kennzeichen || "--"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <NeuBuchungModal konten={konten} perioden={perioden}
          onClose={() => setShowModal(false)} onSaved={load} />
      )}
    </div>
  );
}
