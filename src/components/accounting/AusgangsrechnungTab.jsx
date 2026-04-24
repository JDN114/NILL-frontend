// src/components/accounting/AusgangsrechnungTab.jsx
// Ausgangsrechnungen (§14 UStG) – Create, edit, finalize, PDF, Vorlagen
import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} \u20ac`;

const STATUS_META = {
  entwurf:   { label:"Entwurf",   color:"ac-badge-gray"   },
  offen:     { label:"Offen",     color:"ac-badge-purple" },
  bezahlt:   { label:"Bezahlt",   color:"ac-badge-green"  },
  storniert: { label:"Storniert", color:"ac-badge-pink"   },
};

const DEFAULT_POS = () => ({
  beschreibung:"", menge:"1", einheit:"Std.",
  einzelpreis:"", rabatt_prozent:"0", ust_satz:"19",
});

const EMPTY_FORM = {
  absender_name:"", absender_strasse:"", absender_plz_ort:"", absender_land:"DE",
  absender_email:"", absender_telefon:"", absender_steuernummer:"", absender_ustid:"",
  absender_bank:"", absender_iban:"", absender_bic:"",
  empfaenger_name:"", empfaenger_strasse:"", empfaenger_plz_ort:"", empfaenger_land:"DE",
  empfaenger_ustid:"",
  rechnungsdatum: new Date().toISOString().slice(0,10),
  lieferdatum:"", faelligkeitsdatum:"",
  zahlungsziel_tage:"14",
  zahlungsbedingungen:"Bitte \u00fcberweisen Sie den Betrag innerhalb von 14 Tagen ohne Abzug.",
  einleitung:"", schlusstext:"Mit freundlichen Gr\u00fc\u00dfen",
  kleinunternehmer: false, reverse_charge: false,
};

function calcTotals(positionen, kleinunternehmer) {
  let netto = 0, ust = 0;
  for (const p of positionen) {
    const m  = parseFloat(p.menge||0);
    const ep = parseFloat(p.einzelpreis||0);
    const rb = parseFloat(p.rabatt_prozent||0);
    const us = parseFloat(p.ust_satz||19);
    const pn = m * ep * (1 - rb/100);
    netto += pn;
    if (!kleinunternehmer) ust += pn * us / 100;
  }
  return { netto, ust, brutto: netto + ust };
}

/* ── Position row ─────────────────────────────────────────────────────────── */
function PosRow({ pos, idx, onChange, onRemove }) {
  const netto = parseFloat(pos.menge||0)
    * parseFloat(pos.einzelpreis||0)
    * (1 - parseFloat(pos.rabatt_prozent||0)/100);
  const inp = (field, w, type="text", extra={}) => (
    <input className="ac-input ac-mono" type={type} value={pos[field]}
      style={{width:w}} {...extra}
      onChange={e => onChange(field, e.target.value)} />
  );
  return (
    <tr>
      <td style={{width:32,textAlign:"center",color:"var(--ink2)",fontSize:".8rem"}}>{idx+1}</td>
      <td>
        <input className="ac-input" style={{width:"100%",minWidth:180}}
          value={pos.beschreibung} placeholder="Beschreibung / Leistung"
          onChange={e => onChange("beschreibung",e.target.value)} />
      </td>
      <td>{inp("menge",      70, "number", {step:"0.001"})}</td>
      <td>
        <input className="ac-input" style={{width:58}} value={pos.einheit}
          onChange={e => onChange("einheit",e.target.value)} />
      </td>
      <td>{inp("einzelpreis", 88, "number", {step:"0.01", placeholder:"0,00"})}</td>
      <td>{inp("rabatt_prozent", 60, "number", {step:"0.1"})}</td>
      <td>
        <select className="ac-select" style={{width:70}} value={pos.ust_satz}
          onChange={e => onChange("ust_satz",e.target.value)}>
          <option value="19">19 %</option>
          <option value="7">7 %</option>
          <option value="0">0 %</option>
        </select>
      </td>
      <td className="ac-mono" style={{textAlign:"right",width:110,fontWeight:500}}>
        {fmtEur(netto)}
      </td>
      <td style={{width:36,textAlign:"center"}}>
        <button className="ac-btn ac-btn-ghost ac-btn-sm"
          style={{color:"var(--a3)",padding:"2px 6px"}} onClick={onRemove}>✕</button>
      </td>
    </tr>
  );
}

/* ── Save-as-template widget (inline) ────────────────────────────────────── */
function VorlageSpeichern({ form, positionen }) {
  const [open,    setOpen]    = useState(false);
  const [name,    setName]    = useState("");
  const [beschr,  setBeschr]  = useState("");
  const [saving,  setSaving]  = useState(false);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await api.post("/api/v1/rechnungen/vorlagen/", {
        name: name.trim(),
        beschreibung: beschr.trim(),
        vorlage_data: { ...form, positionen },
      });
      setOpen(false); setName(""); setBeschr("");
    } catch(e) {
      alert(e.response?.data?.detail || "Fehler beim Speichern der Vorlage.");
    } finally { setSaving(false); }
  };

  if (!open) return (
    <div style={{textAlign:"right",marginBottom:16}}>
      <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setOpen(true)}>
        \ud83d\udcbe Als Vorlage speichern
      </button>
    </div>
  );

  return (
    <div className="ac-card" style={{marginBottom:16}}>
      <div className="ac-section-title">Als Vorlage speichern</div>
      <div className="ac-form-row">
        <div className="ac-form-col" style={{flex:2}}>
          <label className="ac-label">Vorlagenname *</label>
          <input className="ac-input" value={name} onChange={e => setName(e.target.value)}
            placeholder="z.B. Meine Firma \u2013 Standard" />
        </div>
        <div className="ac-form-col" style={{flex:3}}>
          <label className="ac-label">Beschreibung</label>
          <input className="ac-input" value={beschr} onChange={e => setBeschr(e.target.value)} />
        </div>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setOpen(false)}>Abbrechen</button>
        <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={save} disabled={saving||!name.trim()}>
          {saving ? "\u2026" : "Speichern"}
        </button>
      </div>
    </div>
  );
}

/* ── Rechnung form ────────────────────────────────────────────────────────── */
function RechnungForm({ initial, vorlagen, onSaved, onCancel }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...(initial||{}) }));
  const [pos,  setPos]  = useState(() =>
    initial?.positionen?.length
      ? initial.positionen.map(p => ({
          beschreibung:    p.beschreibung||"",
          menge:           String(p.menge||1),
          einheit:         p.einheit||"Std.",
          einzelpreis:     String(p.einzelpreis||0),
          rabatt_prozent:  String(p.rabatt_prozent||0),
          ust_satz:        String(p.ust_satz||19),
        }))
      : [DEFAULT_POS()]
  );
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");
  const [picker, setPicker] = useState(false);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const updPos = (i,k,v) => setPos(p => p.map((r,j) => j===i ? {...r,[k]:v} : r));
  const addPos = () => setPos(p => [...p, DEFAULT_POS()]);
  const delPos = (i) => setPos(p => p.filter((_,j) => j!==i));

  const { netto, ust, brutto } = useMemo(
    () => calcTotals(pos, form.kleinunternehmer),
    [pos, form.kleinunternehmer]
  );

  const applyVorlage = (v) => {
    const d = v.vorlage_data || {};
    const { positionen: vPos, ...rest } = d;
    setForm(f => ({ ...f, ...rest }));
    if (vPos?.length) {
      setPos(vPos.map(p => ({
        beschreibung: p.beschreibung||"",
        menge: String(p.menge||1),
        einheit: p.einheit||"Std.",
        einzelpreis: String(p.einzelpreis||0),
        rabatt_prozent: String(p.rabatt_prozent||0),
        ust_satz: String(p.ust_satz||19),
      })));
    }
    setPicker(false);
  };

  const save = async () => {
    if (!form.absender_name.trim()) { setError("Absendername ist Pflicht (\u00a714 UStG)."); return; }
    if (!form.empfaenger_name.trim()) { setError("Empf\u00e4ngername ist Pflicht."); return; }
    if (pos.length === 0) { setError("Mindestens eine Position erforderlich."); return; }
    setSaving(true); setError("");
    const payload = {
      ...form,
      zahlungsziel_tage: parseInt(form.zahlungsziel_tage||14,10),
      positionen: pos.map((p,i) => ({
        position:       i+1,
        beschreibung:   p.beschreibung,
        menge:          parseFloat(p.menge||1),
        einheit:        p.einheit,
        einzelpreis:    parseFloat(p.einzelpreis||0),
        rabatt_prozent: parseFloat(p.rabatt_prozent||0),
        ust_satz:       parseFloat(p.ust_satz||19),
      })),
    };
    try {
      if (initial?.id) {
        await api.put(`/api/v1/rechnungen/${initial.id}`, payload);
      } else {
        await api.post("/api/v1/rechnungen/", payload);
      }
      onSaved();
    } catch(e) {
      setError(e.response?.data?.detail || "Fehler beim Speichern.");
    } finally { setSaving(false); }
  };

  const Field = ({ label, children, flex }) => (
    <div className="ac-form-col" style={flex ? {flex} : {}}>
      <label className="ac-label">{label}</label>
      {children}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <span style={{fontFamily:"Fraunces,serif",fontSize:"1.15rem",fontWeight:600}}>
          {initial?.id
            ? `Rechnung bearbeiten${initial.rechnungsnummer ? " \u2013 "+initial.rechnungsnummer : ""}`
            : "Neue Ausgangsrechnung"}
        </span>
        <div style={{display:"flex",gap:8}}>
          {vorlagen.length > 0 && (
            <button className="ac-btn ac-btn-ghost" onClick={() => setPicker(true)}>
              \ud83d\udccb Vorlage anwenden
            </button>
          )}
          <button className="ac-btn ac-btn-ghost" onClick={onCancel}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Speichere\u2026" : "Speichern"}
          </button>
        </div>
      </div>

      {error && <div className="ac-alert ac-alert-err" style={{marginBottom:16}}>{error}</div>}

      {/* Absender */}
      <div className="ac-card" style={{marginBottom:16}}>
        <div className="ac-section-title">Absender \u2013 Ihr Unternehmen</div>
        <div className="ac-form-row">
          <Field label="Firmenname / Name *" flex={2}>
            <input className="ac-input" value={form.absender_name}
              onChange={e => set("absender_name",e.target.value)} />
          </Field>
          <Field label="E-Mail">
            <input className="ac-input" type="email" value={form.absender_email}
              onChange={e => set("absender_email",e.target.value)} />
          </Field>
          <Field label="Telefon">
            <input className="ac-input" value={form.absender_telefon}
              onChange={e => set("absender_telefon",e.target.value)} />
          </Field>
        </div>
        <div className="ac-form-row">
          <Field label="Stra\u00dfe, Hausnummer" flex={2}>
            <input className="ac-input" value={form.absender_strasse}
              onChange={e => set("absender_strasse",e.target.value)} />
          </Field>
          <Field label="PLZ + Ort">
            <input className="ac-input" value={form.absender_plz_ort}
              onChange={e => set("absender_plz_ort",e.target.value)} placeholder="12345 Berlin" />
          </Field>
          <Field label="Land">
            <input className="ac-input ac-mono" style={{maxWidth:60}} value={form.absender_land}
              maxLength={2} onChange={e => set("absender_land",e.target.value)} />
          </Field>
        </div>
        <div className="ac-form-row">
          <Field label="Steuernummer">
            <input className="ac-input ac-mono" value={form.absender_steuernummer}
              onChange={e => set("absender_steuernummer",e.target.value)} placeholder="12/345/67890" />
          </Field>
          <Field label="USt-IdNr.">
            <input className="ac-input ac-mono" value={form.absender_ustid}
              onChange={e => set("absender_ustid",e.target.value)} placeholder="DE123456789" />
          </Field>
          <Field label="Kreditinstitut">
            <input className="ac-input" value={form.absender_bank}
              onChange={e => set("absender_bank",e.target.value)} />
          </Field>
        </div>
        <div className="ac-form-row">
          <Field label="IBAN" flex={2}>
            <input className="ac-input ac-mono" value={form.absender_iban}
              onChange={e => set("absender_iban",e.target.value)} placeholder="DE00 0000 0000 0000 0000 00" />
          </Field>
          <Field label="BIC">
            <input className="ac-input ac-mono" value={form.absender_bic}
              onChange={e => set("absender_bic",e.target.value)} placeholder="XXXXXXXX" />
          </Field>
        </div>
      </div>

      {/* Empfänger */}
      <div className="ac-card" style={{marginBottom:16}}>
        <div className="ac-section-title">Empf\u00e4nger</div>
        <div className="ac-form-row">
          <Field label="Name / Firma *" flex={2}>
            <input className="ac-input" value={form.empfaenger_name}
              onChange={e => set("empfaenger_name",e.target.value)} />
          </Field>
          <Field label="USt-IdNr. (bei B2B)">
            <input className="ac-input ac-mono" value={form.empfaenger_ustid}
              onChange={e => set("empfaenger_ustid",e.target.value)} placeholder="DE\u2026" />
          </Field>
        </div>
        <div className="ac-form-row">
          <Field label="Stra\u00dfe" flex={2}>
            <input className="ac-input" value={form.empfaenger_strasse}
              onChange={e => set("empfaenger_strasse",e.target.value)} />
          </Field>
          <Field label="PLZ + Ort">
            <input className="ac-input" value={form.empfaenger_plz_ort}
              onChange={e => set("empfaenger_plz_ort",e.target.value)} />
          </Field>
          <Field label="Land">
            <input className="ac-input ac-mono" style={{maxWidth:60}} value={form.empfaenger_land}
              maxLength={2} onChange={e => set("empfaenger_land",e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Rechnungsdetails */}
      <div className="ac-card" style={{marginBottom:16}}>
        <div className="ac-section-title">Rechnungsdetails</div>
        <div className="ac-form-row">
          <Field label="Rechnungsdatum *">
            <input className="ac-input" type="date" value={form.rechnungsdatum}
              onChange={e => set("rechnungsdatum",e.target.value)} />
          </Field>
          <Field label="Liefer-/Leistungsdatum">
            <input className="ac-input" type="date" value={form.lieferdatum||""}
              onChange={e => set("lieferdatum",e.target.value)} />
          </Field>
          <Field label="F\u00e4lligkeitsdatum">
            <input className="ac-input" type="date" value={form.faelligkeitsdatum||""}
              onChange={e => set("faelligkeitsdatum",e.target.value)} />
          </Field>
          <Field label="Zahlungsziel (Tage)">
            <input className="ac-input ac-mono" type="number" style={{maxWidth:90}}
              value={form.zahlungsziel_tage}
              onChange={e => set("zahlungsziel_tage",e.target.value)} />
          </Field>
        </div>
        <div className="ac-form-row">
          <Field label="Zahlungsbedingungen" flex={1}>
            <input className="ac-input" value={form.zahlungsbedingungen||""}
              onChange={e => set("zahlungsbedingungen",e.target.value)} />
          </Field>
        </div>
        <div style={{display:"flex",gap:28,marginTop:10,flexWrap:"wrap"}}>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:".9rem"}}>
            <input type="checkbox" checked={form.kleinunternehmer}
              onChange={e => set("kleinunternehmer",e.target.checked)} />
            Kleinunternehmer (\u00a719 UStG) \u2013 keine USt ausgewiesen
          </label>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:".9rem"}}>
            <input type="checkbox" checked={form.reverse_charge}
              onChange={e => set("reverse_charge",e.target.checked)} />
            Reverse Charge (\u00a713b UStG) \u2013 Steuerschuld auf Leistungsempf\u00e4nger
          </label>
        </div>
      </div>

      {/* Texte */}
      <div className="ac-card" style={{marginBottom:16}}>
        <div className="ac-section-title">Texte</div>
        <div className="ac-form-row">
          <Field label="Einleitungstext" flex={1}>
            <textarea className="ac-input" rows={2} value={form.einleitung||""}
              style={{resize:"vertical"}}
              placeholder="z.B. Sehr geehrte Damen und Herren, f\u00fcr folgende Leistungen erlauben wir uns zu berechnen:"
              onChange={e => set("einleitung",e.target.value)} />
          </Field>
          <Field label="Schlusstext" flex={1}>
            <textarea className="ac-input" rows={2} value={form.schlusstext||""}
              style={{resize:"vertical"}}
              placeholder="Mit freundlichen Gr\u00fc\u00dfen\u2026"
              onChange={e => set("schlusstext",e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Positionen */}
      <div className="ac-card" style={{marginBottom:16,padding:0}}>
        <div style={{padding:"13px 20px",borderBottom:"1px solid var(--border)"}}>
          <span className="ac-section-title">Positionen (\u00a714 Abs. 4 Nr. 5 UStG)</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="ac-table" style={{minWidth:760}}>
            <thead>
              <tr>
                <th style={{width:32}}>#</th>
                <th>Beschreibung / Leistung</th>
                <th style={{width:80}}>Menge</th>
                <th style={{width:68}}>Einheit</th>
                <th style={{width:98}}>EP (\u20ac)</th>
                <th style={{width:70}}>Rab. %</th>
                <th style={{width:80}}>MwSt</th>
                <th style={{width:112,textAlign:"right"}}>Netto</th>
                <th style={{width:36}}></th>
              </tr>
            </thead>
            <tbody>
              {pos.map((p,i) => (
                <PosRow key={i} pos={p} idx={i}
                  onChange={(k,v) => updPos(i,k,v)}
                  onRemove={() => delPos(i)} />
              ))}
            </tbody>
          </table>
        </div>
        <div style={{
          padding:"14px 20px",borderTop:"1px solid var(--border)",
          display:"flex",justifyContent:"space-between",alignItems:"flex-end",
        }}>
          <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={addPos}>+ Position</button>
          <div style={{textAlign:"right",lineHeight:1.6}}>
            <div style={{color:"var(--ink2)",fontSize:".88rem"}}>
              Netto:&nbsp;<span className="ac-mono">{fmtEur(netto)}</span>
            </div>
            {!form.kleinunternehmer && (
              <div style={{color:"var(--ink2)",fontSize:".88rem"}}>
                USt:&nbsp;<span className="ac-mono">{fmtEur(ust)}</span>
              </div>
            )}
            <div style={{fontWeight:700,fontSize:"1.1rem",marginTop:4}}>
              Brutto:&nbsp;
              <span className="ac-mono" style={{color:"var(--accent)"}}>{fmtEur(brutto)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save as template */}
      <VorlageSpeichern form={form} positionen={pos} />

      {/* Template picker modal */}
      {picker && (
        <div className="ac-modal-backdrop">
          <div className="ac-modal">
            <div className="ac-modal-title">Vorlage ausw\u00e4hlen</div>
            <div style={{maxHeight:320,overflowY:"auto",marginBottom:16}}>
              {vorlagen.map(v => (
                <div key={v.id} onClick={() => applyVorlage(v)} style={{
                  padding:"12px 16px",borderRadius:8,cursor:"pointer",marginBottom:8,
                  background:"var(--surface2)",border:"1px solid var(--border)",
                  transition:"border-color .15s",
                }}>
                  <div style={{fontWeight:600}}>{v.name}</div>
                  {v.beschreibung && (
                    <div style={{fontSize:".82rem",color:"var(--ink2)",marginTop:3}}>{v.beschreibung}</div>
                  )}
                  {v.vorlage_data?.absender_name && (
                    <div style={{fontSize:".72rem",color:"var(--ink2)",marginTop:4}}>
                      Absender: {v.vorlage_data.absender_name}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="ac-modal-footer">
              <button className="ac-btn ac-btn-ghost" onClick={() => setPicker(false)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Rechnungen list ──────────────────────────────────────────────────────── */
function RechnungenList({ onNew, onEdit }) {
  const [rechnungen, setRechnungen] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState("");
  const [busy,       setBusy]       = useState({});

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/rechnungen/")
      .then(r => setRechnungen(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const post = async (id, action, confirmMsg) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setBusy(b => ({...b,[id]:true}));
    try { await api.post(`/api/v1/rechnungen/${id}/${action}`); load(); }
    catch(e) { alert(e.response?.data?.detail || "Fehler."); }
    finally { setBusy(b => ({...b,[id]:false})); }
  };

  const del = async (id) => {
    if (!window.confirm("Entwurf wirklich l\u00f6schen?")) return;
    setBusy(b => ({...b,[id]:true}));
    try { await api.delete(`/api/v1/rechnungen/${id}`); load(); }
    catch(e) { alert(e.response?.data?.detail || "Fehler."); }
    finally { setBusy(b => ({...b,[id]:false})); }
  };

  const downloadPdf = async (id, nr) => {
    try {
      const r = await api.get(`/api/v1/rechnungen/${id}/pdf`, { responseType:"blob" });
      const url = URL.createObjectURL(new Blob([r.data],{type:"application/pdf"}));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Rechnung-${nr||id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert("PDF-Download fehlgeschlagen."); }
  };

  const filtered = rechnungen.filter(r =>
    !filter ||
    (r.rechnungsnummer||"").toLowerCase().includes(filter.toLowerCase()) ||
    (r.empfaenger_name||"").toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Rechnungen\u2026</div>;

  return (
    <div>
      <div style={{display:"flex",gap:12,marginBottom:16,alignItems:"center"}}>
        <input className="ac-input" style={{maxWidth:300}}
          placeholder="Suche nach Nr. oder Empf\u00e4nger\u2026"
          value={filter} onChange={e => setFilter(e.target.value)} />
        <div style={{flex:1}}/>
        <button className="ac-btn ac-btn-primary" onClick={onNew}>+ Neue Rechnung</button>
      </div>

      <div className="ac-card" style={{padding:0}}>
        <table className="ac-table">
          <thead>
            <tr>
              <th>Rechnungsnr.</th>
              <th>Empf\u00e4nger</th>
              <th>Datum</th>
              <th>Status</th>
              <th style={{textAlign:"right"}}>Netto</th>
              <th style={{textAlign:"right"}}>Brutto</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="ac-empty">
                  Noch keine Rechnungen vorhanden. Erstelle deine erste Ausgangsrechnung!
                </td>
              </tr>
            )}
            {filtered.map(r => {
              const meta = STATUS_META[r.status] || STATUS_META.entwurf;
              const b = busy[r.id];
              return (
                <tr key={r.id}>
                  <td className="ac-mono" style={{fontWeight:600}}>
                    {r.rechnungsnummer
                      ? r.rechnungsnummer
                      : <span style={{color:"var(--ink2)",fontStyle:"italic",fontWeight:400}}>Entwurf #{r.id}</span>}
                  </td>
                  <td style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {r.empfaenger_name || "\u2014"}
                  </td>
                  <td className="ac-mono">{r.rechnungsdatum || "\u2014"}</td>
                  <td><span className={`ac-badge ${meta.color}`}>{meta.label}</span></td>
                  <td className="ac-mono" style={{textAlign:"right"}}>{fmtEur(r.netto_summe)}</td>
                  <td className="ac-mono" style={{textAlign:"right",fontWeight:600}}>{fmtEur(r.brutto_summe)}</td>
                  <td>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {r.status === "entwurf" && (<>
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={b}
                          onClick={() => onEdit(r)}>Bearb.</button>
                        <button className="ac-btn ac-btn-primary ac-btn-sm" disabled={b}
                          onClick={() => post(r.id,"finalisieren")}>Finalisieren</button>
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={b}
                          style={{color:"var(--a3)"}} onClick={() => del(r.id)}>L\u00f6schen</button>
                      </>)}
                      {(r.status === "offen" || r.status === "bezahlt") && (
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={b}
                          onClick={() => downloadPdf(r.id, r.rechnungsnummer)}>
                          \ud83d\udcc4 PDF
                        </button>
                      )}
                      {r.status === "offen" && (<>
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={b}
                          onClick={() => post(r.id,"bezahlt")}>\u2713 Bezahlt</button>
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" disabled={b}
                          style={{color:"var(--a3)"}}
                          onClick={() => post(r.id,"stornieren",
                            "Rechnung wirklich stornieren? Dies kann nicht r\u00fckg\u00e4ngig gemacht werden.")}>
                          Stornieren
                        </button>
                      </>)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Vorlagen tab ─────────────────────────────────────────────────────────── */
function VorlagenTab() {
  const [vorlagen, setVorlagen] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const load = useCallback(() => {
    api.get("/api/v1/rechnungen/vorlagen/")
      .then(r => setVorlagen(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const del = async (id) => {
    if (!window.confirm("Vorlage l\u00f6schen?")) return;
    try { await api.delete(`/api/v1/rechnungen/vorlagen/${id}`); load(); }
    catch(e) { alert(e.response?.data?.detail || "Fehler."); }
  };

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Vorlagen\u2026</div>;

  return (
    <div>
      <div className="ac-alert ac-alert-warn" style={{marginBottom:16}}>
        \ud83d\udca1 Vorlagen erstellst du im Rechnungsformular \u00fcber \u201eAls Vorlage speichern\u201c.
        Sie enthalten Absender-Stammdaten und k\u00f6nnen f\u00fcr jede neue Rechnung wiederverwendet werden.
      </div>
      {vorlagen.length === 0 ? (
        <div className="ac-card" style={{textAlign:"center",padding:48,color:"var(--ink2)"}}>
          Noch keine Vorlagen. Erstelle eine Rechnung und speichere sie als Vorlage.
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
          {vorlagen.map(v => (
            <div key={v.id} className="ac-card" style={{marginBottom:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,marginBottom:4}}>{v.name}</div>
                  {v.beschreibung && (
                    <div style={{fontSize:".82rem",color:"var(--ink2)",marginBottom:6}}>{v.beschreibung}</div>
                  )}
                  <div style={{fontSize:".75rem",color:"var(--ink2)"}}>
                    Absender: {v.vorlage_data?.absender_name || "\u2014"}
                  </div>
                  {v.vorlage_data?.kleinunternehmer && (
                    <span className="ac-badge ac-badge-gray" style={{marginTop:8,display:"inline-block"}}>
                      \u00a719 UStG
                    </span>
                  )}
                </div>
                <button className="ac-btn ac-btn-ghost ac-btn-sm"
                  style={{color:"var(--a3)",marginLeft:8}} onClick={() => del(v.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function AusgangsrechnungTab() {
  const [subtab,   setSubtab]   = useState("rechnungen");
  const [view,     setView]     = useState("list"); // "list" | "form"
  const [formData, setFormData] = useState(null);   // null = new, obj = edit
  const [vorlagen, setVorlagen] = useState([]);

  const loadVorlagen = useCallback(() => {
    api.get("/api/v1/rechnungen/vorlagen/")
      .then(r => setVorlagen(r.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => { loadVorlagen(); }, [loadVorlagen]);

  const openNew = () => { setFormData(null); setView("form"); };
  const openEdit = (r) => {
    api.get(`/api/v1/rechnungen/${r.id}`)
      .then(res => { setFormData(res.data); setView("form"); })
      .catch(() =>  { setFormData(r);        setView("form"); });
  };
  const closeForm = () => { setView("list"); setFormData(null); };
  const onSaved   = () => { closeForm(); loadVorlagen(); };

  return (
    <div>
      {view === "list" && (
        <>
          <div style={{display:"flex",gap:4,marginBottom:16}}>
            {[["rechnungen","Ausgangsrechnungen"],["vorlagen","Vorlagen"]].map(([s,l]) => (
              <button key={s}
                className={`ac-btn ${subtab===s?"ac-btn-primary":"ac-btn-ghost"}`}
                onClick={() => setSubtab(s)}>
                {l}
              </button>
            ))}
          </div>
          {subtab === "rechnungen" && (
            <RechnungenList onNew={openNew} onEdit={openEdit} />
          )}
          {subtab === "vorlagen" && <VorlagenTab />}
        </>
      )}
      {view === "form" && (
        <RechnungForm
          initial={formData}
          vorlagen={vorlagen}
          onSaved={onSaved}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
