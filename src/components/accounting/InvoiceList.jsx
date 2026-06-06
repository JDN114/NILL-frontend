// src/components/accounting/InvoiceList.jsx
// @refresh reset
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import api from "../../services/api";

const fmtEur = (n) => `${Number(n||0).toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} €`;

const AI_BADGE_STYLE = {
  display:"inline-flex", alignItems:"center", gap:3,
  padding:"1px 6px", borderRadius:99, marginLeft:6,
  fontSize:9, fontFamily:"JetBrains Mono,monospace", letterSpacing:"0.1em",
  background:"rgba(122,92,255,0.12)", border:"1px solid rgba(122,92,255,0.25)",
  color:"rgba(122,92,255,0.8)", verticalAlign:"middle", userSelect:"none",
};

const BOOKED_BADGE_STYLE = {
  display:"inline-flex", alignItems:"center", gap:3,
  padding:"2px 7px", borderRadius:99, marginLeft:0,
  fontSize:10, fontFamily:"JetBrains Mono,monospace", letterSpacing:"0.06em",
  background:"rgba(100,220,120,0.12)", border:"1px solid rgba(100,220,120,0.3)",
  color:"rgba(100,220,120,0.9)", userSelect:"none", whiteSpace:"nowrap",
};

const STATUS_META = {
  paid:    { label:"Bezahlt",    cls:"ac-badge-green"  },
  open:    { label:"Offen",      cls:"ac-badge-gray"   },
  overdue: { label:"Überfällig", cls:"ac-badge-pink"   },
  draft:   { label:"Entwurf",    cls:"ac-badge-gray"   },
  unpaid:  { label:"Offen",      cls:"ac-badge-gray"   },
};

const norm = (inv) => {
  const rawStatus = inv.payment_status || inv.status || "open";
  return {
    ...inv,
    date:      inv.invoice_date || inv.date,
    amount:    inv.gross_amount || inv.amount,
    status:    rawStatus === "unpaid" ? "open" : rawStatus,
    is_booked: !!inv.is_booked,
  };
};

// Generate default invoice number schema: RE-YYYY-NNNN
const defaultInvNr = (id) => {
  const year = new Date().getFullYear();
  return `RE-${year}-${String(id).padStart(4, "0")}`;
};

// ── KI-Kontenerkennung Panel ──────────────────────────────────────────────────

const BUCHUNGSTYP_LABELS = {
  inland_19:      { label:"Inland 19 % MwSt",         color:"rgba(100,220,120,0.85)" },
  inland_7:       { label:"Inland 7 % MwSt",           color:"rgba(100,220,120,0.85)" },
  inland_0:       { label:"Inland steuerfrei",          color:"rgba(100,220,120,0.85)" },
  reverse_charge: { label:"Reverse Charge §13b UStG",  color:"rgba(255,165,0,0.9)"   },
  ig_erwerb:      { label:"IG-Erwerb §1a UStG",        color:"rgba(255,165,0,0.9)"   },
  einfuhr_ust:    { label:"Einfuhrumsatzsteuer §21",   color:"rgba(255,165,0,0.9)"   },
  keine_vorsteuer:{ label:"Eingeschr. Vorsteuerabzug", color:"rgba(200,180,100,0.9)" },
};

function ConfidenceLight({ konfidenz }) {
  const pct = Math.round((konfidenz || 0) * 100);
  const color = pct >= 85 ? "#4ade80" : pct >= 60 ? "#fbbf24" : "#f87171";
  const label = pct >= 85 ? "Hohe Konfidenz" : pct >= 60 ? "Mittlere Konfidenz" : "Niedrige Konfidenz";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{
        width:12, height:12, borderRadius:"50%", flexShrink:0,
        background:color, boxShadow:`0 0 6px ${color}`,
      }} />
      <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".78rem", color }}>
        {pct} % — {label}
      </span>
    </div>
  );
}

function KontoVorschlagPanel({ invoice, onAccept, onOverride }) {
  const [vorschlag, setVorschlag] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [expanded,  setExpanded]  = useState(false);
  const [showLines, setShowLines] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    setLoading(true);
    api.post("/api/v1/buchhaltung/suggest-konto", {
      invoice_id:  invoice.id,
      vendor:      invoice.vendor      || null,
      category:    invoice.category    || null,
      vat_rate:    invoice.vat_rate    != null ? Number(invoice.vat_rate)    : null,
      net_amount:  invoice.net_amount  != null ? Number(invoice.net_amount)  : null,
    })
      .then(r => { setVorschlag(r.data); onAccept(r.data); })
      .catch(() => setVorschlag(null))
      .finally(() => setLoading(false));
  }, [invoice.id]);

  if (loading) return (
    <div style={{
      background:"rgba(122,92,255,0.06)", border:"1px solid rgba(122,92,255,0.18)",
      borderRadius:8, padding:"12px 14px", marginBottom:16,
      fontSize:".78rem", color:"var(--ink2)",
    }}>
      KI analysiert Rechnung…
    </div>
  );

  if (!vorschlag) return null;

  const btype  = BUCHUNGSTYP_LABELS[vorschlag.buchungstyp] || { label: vorschlag.buchungstyp, color:"var(--ink2)" };
  const isSpecial = vorschlag.reverse_charge || vorschlag.buchungstyp === "einfuhr_ust";

  return (
    <div style={{
      background: isSpecial ? "rgba(255,165,0,0.06)" : "rgba(122,92,255,0.06)",
      border: `1px solid ${isSpecial ? "rgba(255,165,0,0.25)" : "rgba(122,92,255,0.2)"}`,
      borderRadius:8, padding:"12px 14px", marginBottom:16,
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:8 }}>
        <span style={{
          fontSize:9, fontFamily:"JetBrains Mono,monospace", letterSpacing:".1em",
          padding:"1px 6px", borderRadius:99,
          background:"rgba(122,92,255,0.12)", border:"1px solid rgba(122,92,255,0.25)",
          color:"rgba(122,92,255,0.8)", userSelect:"none",
        }}>◈ KI-VORSCHLAG</span>
        <span style={{ fontWeight:700, color:"var(--ink)", fontFamily:"JetBrains Mono,monospace", fontSize:".9rem" }}>
          {vorschlag.konto_nr}
        </span>
        <span style={{ color:"var(--ink2)", fontSize:".82rem" }}>{vorschlag.konto_name}</span>
        <span style={{ marginLeft:"auto" }}>
          <ConfidenceLight konfidenz={vorschlag.konfidenz} />
        </span>
      </div>

      {/* Buchungstyp */}
      <div style={{ marginBottom:8 }}>
        <span style={{
          display:"inline-block", padding:"2px 8px", borderRadius:99,
          fontSize:".73rem", fontWeight:600, color:btype.color,
          border:`1px solid ${btype.color}`, background:"rgba(0,0,0,0.12)",
        }}>
          {btype.label}
        </span>
      </div>

      {/* Reverse Charge / Spezial-Warnung */}
      {isSpecial && vorschlag.ust_hinweis && (
        <div style={{
          background:"rgba(255,165,0,0.08)", border:"1px solid rgba(255,165,0,0.3)",
          borderRadius:6, padding:"8px 12px", marginBottom:10,
          fontSize:".75rem", color:"rgba(255,165,0,0.95)", lineHeight:1.6,
        }}>
          <strong>Umsatzsteuer-Hinweis:</strong> {vorschlag.ust_hinweis}
        </div>
      )}

      {/* Begründung toggle */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ background:"none", border:"none", cursor:"pointer", color:"var(--ink2)", fontSize:".73rem", padding:0, marginBottom: expanded ? 8 : 0 }}
      >
        {expanded ? "▾ Begründung ausblenden" : "▸ Begründung anzeigen"}
      </button>
      {expanded && (
        <div style={{ fontSize:".76rem", color:"var(--ink2)", lineHeight:1.65, marginBottom:8 }}>
          {vorschlag.begruendung}
        </div>
      )}

      {/* Buchungszeilen toggle */}
      {vorschlag.zeilen && vorschlag.zeilen.length > 0 && (
        <>
          <button
            onClick={() => setShowLines(e => !e)}
            style={{ background:"none", border:"none", cursor:"pointer", color:"var(--ink2)", fontSize:".73rem", padding:0, marginBottom: showLines ? 8 : 0 }}
          >
            {showLines ? "▾ Buchungszeilen ausblenden" : "▸ Buchungszeilen anzeigen"}
          </button>
          {showLines && (
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:".73rem", marginBottom:8 }}>
              <thead>
                <tr style={{ color:"var(--ink3)", textAlign:"left" }}>
                  <th scope="col" style={{ padding:"2px 6px" }}>Konto</th>
                  <th scope="col" style={{ padding:"2px 6px" }}>Bezeichnung</th>
                  <th scope="col" style={{ padding:"2px 6px", textAlign:"right" }}>Soll</th>
                  <th scope="col" style={{ padding:"2px 6px", textAlign:"right" }}>Haben</th>
                </tr>
              </thead>
              <tbody>
                {vorschlag.zeilen.map((z, i) => (
                  <tr key={i} style={{ borderTop:"1px solid var(--border)" }}>
                    <td style={{ padding:"3px 6px", fontFamily:"JetBrains Mono,monospace", color:"var(--accent)" }}>{z.kontonummer}</td>
                    <td style={{ padding:"3px 6px", color:"var(--ink2)" }}>{z.bezeichnung}</td>
                    <td style={{ padding:"3px 6px", textAlign:"right", color:"var(--ink)", fontFamily:"JetBrains Mono,monospace" }}>{z.soll > 0 ? fmtEur(z.soll) : "—"}</td>
                    <td style={{ padding:"3px 6px", textAlign:"right", color:"var(--ink)", fontFamily:"JetBrains Mono,monospace" }}>{z.haben > 0 ? fmtEur(z.haben) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Actions */}
      <div style={{ display:"flex", gap:8, marginTop:4, flexWrap:"wrap" }}>
        <span style={{ fontSize:".72rem", color:"var(--ink3)", alignSelf:"center", flexGrow:1 }}>
          KI-Modell: {vorschlag.ai_modell}
        </span>
        <button
          className="ac-btn ac-btn-ghost ac-btn-sm"
          onClick={() => onOverride(vorschlag)}
          title="Anderes Konto manuell wählen"
        >
          Konto anpassen
        </button>
      </div>
    </div>
  );
}

// ── Booking error help panel ───────────────────────────────────────────────────
function BookingErrorHelp({ error }) {
  const isAccountError = error && (
    error.toLowerCase().includes("kont") ||
    error.toLowerCase().includes("422") ||
    error.toLowerCase().includes("automatisch")
  );
  if (!isAccountError) return null;

  return (
    <div style={{
      background:"rgba(255,180,0,0.07)", border:"1px solid rgba(255,180,0,0.25)",
      borderRadius:8, padding:"12px 14px", marginTop:10,
      fontSize:".78rem", lineHeight:1.7,
    }}>
      <div style={{ fontWeight:700, color:"rgba(255,180,0,0.9)", marginBottom:6 }}>
        Hilfe: Warum kann die Rechnung nicht gebucht werden?
      </div>
      <div style={{ color:"var(--ink2)" }}>
        Die automatische Buchung benötigt passende Konten im Kontenrahmen (SKR03).
        Mögliche Ursachen:
      </div>
      <ul style={{ color:"var(--ink2)", margin:"8px 0 0 16px", padding:0 }}>
        <li>Das Lieferanten-Konto konnte nicht automatisch zugeordnet werden → <strong style={{color:"var(--ink)"}}>Lieferant prüfen oder Kategorie korrigieren</strong></li>
        <li>Konto 1200 (Bank/Kasse), 1400 (Forderungen) oder 1600 (Verbindlichkeiten) fehlt → <strong style={{color:"var(--ink)"}}>Buchhaltung → Konten überprüfen</strong></li>
        <li>Netto- oder Bruttobetrag ist 0 oder fehlt → <strong style={{color:"var(--ink)"}}>Beträge oben ausfüllen</strong></li>
      </ul>
      <div style={{ marginTop:8, color:"rgba(255,180,0,0.7)" }}>
        Tipp: Trage Nettobetrag + MwSt-Satz ein — NILL berechnet den Bruttobetrag automatisch.
      </div>
    </div>
  );
}

// ── Booking Confirm + Edit Modal ───────────────────────────────────────────────
function BookingConfirmModal({ invoice, onClose, onBooked, setMsg }) {
  const [form, setForm] = useState({
    vendor:         invoice.vendor         || "",
    invoice_number: invoice.invoice_number || defaultInvNr(invoice.id),
    invoice_date:   invoice.date           || "",
    net_amount:     invoice.net_amount     != null ? String(invoice.net_amount) : "",
    vat_rate:       invoice.vat_rate       != null ? String(invoice.vat_rate)   : "19",
    gross_amount:   invoice.amount         != null ? String(invoice.amount)     : "",
    notes:          invoice.notes          || "",
  });
  const [saving,    setSaving]    = useState(false);
  const [err,       setErr]       = useState(null);
  const [kiData,    setKiData]    = useState(null);  // last KI suggestion
  const [showManual,setShowManual]= useState(false);

  const handleNetOrVat = (field) => (e) => {
    const next = { ...form, [field]: e.target.value };
    const net = parseFloat(next.net_amount?.replace(",", ".")) || 0;
    const vat = parseFloat(next.vat_rate?.replace(",", "."))   || 0;
    if (net > 0 && vat >= 0) {
      next.gross_amount = String((net * (1 + vat / 100)).toFixed(2));
    }
    setForm(next);
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const _sendAudit = async (aktion, gewKonto) => {
    if (!kiData) return;
    try {
      await api.post("/api/v1/buchhaltung/suggest-konto/audit", {
        invoice_id:            invoice.id,
        vorschlag_konto:       kiData.konto_nr,
        vorschlag_konfidenz:   kiData.konfidenz,
        vorschlag_buchungstyp: kiData.buchungstyp,
        vorschlag_begruendung: kiData.begruendung,
        vorschlag_modell:      kiData.ai_modell,
        user_aktion:           aktion,
        gewahltes_konto:       gewKonto || kiData.konto_nr,
      });
    } catch (_) { /* audit non-critical */ }
  };

  const handle = async () => {
    setSaving(true); setErr(null);
    try {
      const patch = {};
      if (form.vendor         !== (invoice.vendor         || ""))              patch.vendor         = form.vendor;
      if (form.invoice_number !== (invoice.invoice_number || defaultInvNr(invoice.id))) patch.invoice_number = form.invoice_number;
      if (form.invoice_date   !== (invoice.date           || ""))              patch.invoice_date   = form.invoice_date;
      if (form.notes          !== (invoice.notes          || ""))              patch.notes          = form.notes;
      const origNet    = invoice.net_amount != null ? String(invoice.net_amount) : "";
      const origVat    = invoice.vat_rate   != null ? String(invoice.vat_rate)   : "19";
      const origBrutto = invoice.amount     != null ? String(invoice.amount)     : "";
      if (form.net_amount   !== origNet    && form.net_amount)   patch.net_amount   = parseFloat(form.net_amount.replace(",","."));
      if (form.vat_rate     !== origVat    && form.vat_rate)     patch.vat_rate     = parseFloat(form.vat_rate.replace(",","."));
      if (form.gross_amount !== origBrutto && form.gross_amount) patch.gross_amount = parseFloat(form.gross_amount.replace(",","."));

      if (Object.keys(patch).length > 0) {
        await api.patch(`/accounting/invoices/${invoice.id}`, patch);
      }
      await _sendAudit("bestaetigt", null);
      await api.post(`/api/v1/buchhaltung/buchungen/auto/${invoice.id}`);
      setMsg({ type:"ok", text:`Rechnung ${form.invoice_number || invoice.id} erfolgreich gebucht.` });
      onBooked();
    } catch(e) {
      setErr(e.response?.data?.detail || "Fehler beim Buchen. Bitte prüfen.");
    } finally {
      setSaving(false);
    }
  };

  const inp = (label, key, type="text", placeholder="", onChange=undefined) => (
    <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1, minWidth:130 }}>
      <label style={{ fontSize:".73rem", color:"var(--ink2)", fontFamily:"Inter,sans-serif" }}>{label}</label>
      <input
        className="ac-input"
        type={type}
        step={type==="number" ? "0.01" : undefined}
        value={form[key]}
        onChange={onChange || set(key)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="ac-modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth:580 }}>
        <div className="ac-modal-title">
          Rechnung prüfen &amp; buchen
        </div>

        {/* GoBD notice */}
        <div style={{
          background:"rgba(198,255,60,0.07)", border:"1px solid rgba(198,255,60,0.2)",
          borderRadius:8, padding:"10px 14px", marginBottom:16,
          fontSize:".78rem", color:"rgba(198,255,60,0.8)", lineHeight:1.55,
        }}>
          <strong>GoBD-Hinweis:</strong> Vor dem Buchen können alle Felder frei bearbeitet werden.
          Nach dem Buchen sind Rechnungsnummer, Datum und Beträge unveränderlich (§146 AO).
        </div>

        {/* KI-Kontenerkennung */}
        <KontoVorschlagPanel
          invoice={invoice}
          onAccept={(v) => setKiData(v)}
          onOverride={(v) => { setKiData(v); setShowManual(true); _sendAudit("geaendert", null); }}
        />

        {/* Manuelles Konto-Override Feld */}
        {showManual && (
          <div style={{
            background:"var(--surface2)", border:"1px solid var(--border)",
            borderRadius:8, padding:"10px 14px", marginBottom:14,
          }}>
            <label style={{ fontSize:".73rem", color:"var(--ink2)", display:"block", marginBottom:6 }}>
              Konto manuell eingeben (SKR03-Nummer)
            </label>
            <input
              className="ac-input"
              placeholder="z.B. 4930"
              style={{ maxWidth:140 }}
              onChange={e => {
                const val = e.target.value.trim();
                if (val) _sendAudit("geaendert", val);
              }}
            />
            <div style={{ fontSize:".7rem", color:"var(--ink3)", marginTop:6 }}>
              Das überschriebene Konto wird im GoBD-Audit-Log festgehalten.
            </div>
          </div>
        )}

        {err && (
          <>
            <div role="alert" className="ac-alert ac-alert-err" style={{ marginBottom:4 }}>{err}</div>
            <BookingErrorHelp error={err} />
            <div style={{ marginBottom:14 }} />
          </>
        )}

        <div style={{ display:"flex", gap:12, marginBottom:12, flexWrap:"wrap" }}>
          {inp("Lieferant", "vendor", "text", "Lieferantenname")}
          <div style={{ display:"flex", flexDirection:"column", gap:4, flex:1, minWidth:130 }}>
            <label style={{ fontSize:".73rem", color:"var(--ink2)", fontFamily:"Inter,sans-serif" }}>
              Rechnungsnr.
              <span style={{ marginLeft:6, fontSize:".68rem", color:"var(--ink3)", fontStyle:"italic" }}>
                Schema: RE-JJJJ-NNNN
              </span>
            </label>
            <input
              className="ac-input"
              type="text"
              value={form.invoice_number}
              onChange={set("invoice_number")}
              placeholder={defaultInvNr(invoice.id)}
            />
          </div>
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:12, flexWrap:"wrap" }}>
          {inp("Rechnungsdatum", "invoice_date", "date")}
          {inp("MwSt-Satz (%)", "vat_rate", "number", "19", handleNetOrVat("vat_rate"))}
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:12, flexWrap:"wrap" }}>
          {inp("Nettobetrag (€)", "net_amount", "number", "0,00", handleNetOrVat("net_amount"))}
          {inp("Bruttobetrag (€)", "gross_amount", "number", "0,00")}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:18 }}>
          <label style={{ fontSize:".73rem", color:"var(--ink2)" }}>Notiz</label>
          <input className="ac-input" value={form.notes} onChange={set("notes")} placeholder="Optional…" />
        </div>

        {/* Preview */}
        <div style={{
          background:"var(--surface2)", borderRadius:8, padding:"12px 14px",
          marginBottom:18, fontSize:".82rem",
        }}>
          <div style={{ fontSize:".7rem", color:"var(--ink2)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>
            Buchungsvorschau
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", color:"var(--ink2)", marginBottom:4 }}>
            <span>Netto</span>
            <span className="ac-mono" style={{ color:"var(--ink)" }}>
              {form.net_amount ? fmtEur(parseFloat(form.net_amount)||0) : "—"}
            </span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", color:"var(--ink2)", marginBottom:4 }}>
            <span>MwSt {form.vat_rate ? `(${form.vat_rate} %)` : ""}</span>
            <span className="ac-mono" style={{ color:"var(--ink)" }}>
              {(form.net_amount && form.vat_rate)
                ? fmtEur((parseFloat(form.net_amount)||0) * (parseFloat(form.vat_rate)||0) / 100)
                : "—"}
            </span>
          </div>
          <div style={{
            display:"flex", justifyContent:"space-between", fontWeight:700,
            borderTop:"1px solid var(--border)", paddingTop:8, marginTop:4,
          }}>
            <span>Brutto</span>
            <span className="ac-mono" style={{ color:"var(--accent)" }}>
              {form.gross_amount ? fmtEur(parseFloat(form.gross_amount)||0) : "—"}
            </span>
          </div>
        </div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose} disabled={saving}>
            Abbrechen
          </button>
          <button className="ac-btn ac-btn-primary" onClick={handle} disabled={saving}>
            {saving ? "…" : invoice.is_booked ? "Erneut buchen" : "Jetzt buchen"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Info tooltip (stateless — open/setOpen from parent) ──────────────────────
function BookingInfoTooltip({ open, onToggle }) {
  return (
    <div style={{ position:"relative", display:"inline-flex" }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="booking-info-popup"
        style={{
          width:20, height:20, borderRadius:"50%", border:"1px solid var(--border)",
          background:"var(--surface2)", color:"var(--ink2)", fontSize:11,
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          fontWeight:700, flexShrink:0,
        }}
        title="Was bedeutet 'Buchen'?"
      >
        i
      </button>
      {open && (
        <div
          id="booking-info-popup"
          role="dialog"
          aria-modal="false"
          aria-label="Was bedeutet Buchen?"
          onClick={onToggle}
          onKeyDown={(e) => { if (e.key === "Escape") onToggle(); }}
          style={{
            position:"absolute", top:26, left:0, zIndex:100,
            width:300, background:"var(--surface)", border:"1px solid var(--border)",
            borderRadius:10, padding:"14px 16px", boxShadow:"0 8px 32px rgba(0,0,0,0.25)",
            fontSize:".78rem", lineHeight:1.65, color:"var(--ink2)",
          }}
        >
          <div style={{ fontWeight:700, color:"var(--ink)", marginBottom:6 }}>Warum muss ich Rechnungen buchen?</div>
          <p style={{ margin:"0 0 8px" }}>
            Eine hochgeladene Rechnung ist zunächst nur ein Dokument. Erst durch das <strong style={{color:"var(--ink)"}}>Buchen</strong> wird sie zu einem rechtssicheren Buchungssatz im Journal (GoBD §146 AO).
          </p>
          <p style={{ margin:"0 0 8px" }}>
            NILL ordnet dabei automatisch die richtigen SKR03-Konten zu (z.B. Aufwandskonto, Vorsteuer 1360, Verbindlichkeiten 1600).
          </p>
          <p style={{ margin:0 }}>
            Rechnungen mit Status <strong style={{color:"rgba(100,220,120,0.9)"}}>✓ Gebucht</strong> erscheinen im Buchungsjournal und in der BWA.
          </p>
          <div style={{ textAlign:"right", marginTop:10 }}>
            <button onClick={onToggle} style={{ fontSize:".73rem", color:"var(--accent)", background:"none", border:"none", cursor:"pointer" }}>Schließen</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── InvoiceList ────────────────────────────────────────────────────────────────
export default function InvoiceList() {
  const [invoices,      setInvoices]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [filter,        setFilter]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [sortKey,       setSortKey]       = useState("date");
  const [sortAsc,       setSortAsc]       = useState(false);
  const [msg,           setMsg]           = useState(null);
  const [bookingInv,    setBookingInv]    = useState(null);
  const [infoOpen,      setInfoOpen]      = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/accounting/invoices")
      .then(r => {
        const raw = r.data;
        const list = Array.isArray(raw) ? raw : [];
        setInvoices(list.map(norm));
      })
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const markPaid = async (id) => {
    try {
      await api.post(`/accounting/invoices/${id}/mark-paid`);
      setMsg({ type:"ok", text:"Rechnung als bezahlt markiert." });
      load();
    } catch(e) {
      setMsg({ type:"err", text:"Fehler beim Aktualisieren." });
    }
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm("Rechnung wirklich löschen?")) return;
    try {
      await api.delete(`/accounting/invoices/${id}`);
      setMsg({ type:"ok", text:"Rechnung gelöscht." });
      load();
    } catch(e) {
      setMsg({ type:"err", text:"Fehler beim Löschen." });
    }
  };

  const sorted = useMemo(() => {
    let list = invoices.filter(inv => {
      const matchText = !filter ||
        (inv.vendor || "").toLowerCase().includes(filter.toLowerCase()) ||
        (inv.invoice_number || "").toLowerCase().includes(filter.toLowerCase());
      const matchStatus  = statusFilter  === "all" || inv.status === statusFilter;
      const matchBooking = bookingFilter === "all"
        || (bookingFilter === "booked"   &&  inv.is_booked)
        || (bookingFilter === "unbooked" && !inv.is_booked);
      return matchText && matchStatus && matchBooking;
    });
    list = [...list].sort((a, b) => {
      let va = a[sortKey] ?? "";
      let vb = b[sortKey] ?? "";
      if (sortKey === "amount" || sortKey === "net_amount") {
        va = Number(va); vb = Number(vb);
      }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ?  1 : -1;
      return 0;
    });
    return list;
  }, [invoices, filter, statusFilter, bookingFilter, sortKey, sortAsc]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const th = (key, label, right) => (
    <th scope="col"
      style={{ cursor:"pointer", userSelect:"none", textAlign: right ? "right" : "left" }}
      onClick={() => toggleSort(key)}
    >
      {label}{" "}
      {sortKey === key
        ? (sortAsc ? "▲" : "▼")
        : <span style={{ opacity:0.25 }}>↕</span>}
    </th>
  );

  if (loading) return <div role="status" aria-live="polite" className="ac-loading"><span className="ac-spinner" aria-hidden="true" />Lade Rechnungen…</div>;

  const totalOpen = invoices
    .filter(i => i.status !== "paid")
    .reduce((s, i) => s + Number(i.amount || 0), 0);

  return (
    <div>
      {msg && (
        <div role={msg.type==="ok" ? "status" : "alert"} aria-live="polite" className={`ac-alert ${msg.type==="ok"?"ac-alert-ok":"ac-alert-err"}`}
          style={{cursor:"pointer"}} onClick={() => setMsg(null)}>
          {msg.text}
        </div>
      )}

      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <input className="ac-input" style={{ maxWidth:240 }} aria-label="Rechnungen suchen" placeholder="Suche (Lieferant, Nr.)…"
          value={filter} onChange={e => setFilter(e.target.value)} />
        <select aria-label="Zahlungsstatus filtern" className="ac-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Alle Zahlungsstatus</option>
          <option value="open">Offen</option>
          <option value="paid">Bezahlt</option>
          <option value="overdue">Überfällig</option>
          <option value="draft">Entwurf</option>
        </select>
        <select aria-label="Buchungsstatus filtern" className="ac-select" value={bookingFilter} onChange={e => setBookingFilter(e.target.value)}>
          <option value="all">Alle Buchungsstatus</option>
          <option value="booked">Gebucht</option>
          <option value="unbooked">Nicht gebucht</option>
        </select>
        <BookingInfoTooltip open={infoOpen} onToggle={() => setInfoOpen(o => !o)} />
        <span style={{ color:"var(--ink2)", fontSize:".85rem", marginLeft:"auto" }}>
          Offen: <strong style={{color:"var(--a3)"}}>{fmtEur(totalOpen)}</strong>
        </span>
      </div>

      <div className="ac-card" style={{ padding:0 }}>
        <table aria-label="Rechnungen" className="ac-table">
          <thead>
            <tr>
              {th("invoice_number","Nr.")}
              {th("vendor","Lieferant")}
              {th("date","Datum")}
              {th("net_amount","Netto", true)}
              {th("vat_rate","MwSt", true)}
              {th("amount","Brutto", true)}
              {th("status","Status")}
              <th scope="col">Buchung</th>
              <th scope="col">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={9} className="ac-empty">Keine Rechnungen gefunden.</td></tr>
            )}
            {sorted.map(inv => {
              const meta = STATUS_META[inv.status] || STATUS_META.open;
              return (
                <tr key={inv.id}>
                  <td className="ac-mono" style={{color:"var(--accent)", fontSize:".82rem", whiteSpace:"nowrap"}}>
                    {inv.invoice_number || <span style={{color:"var(--ink2)",fontStyle:"italic"}}>—</span>}
                  </td>
                  <td style={{maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                    {inv.vendor || inv.description || "—"}
                    {inv.ai_status === "completed" && (
                      <span style={AI_BADGE_STYLE} title="KI-verarbeitet">◈ KI</span>
                    )}
                  </td>
                  <td className="ac-mono" style={{whiteSpace:"nowrap"}}>{inv.date || "—"}</td>
                  <td className="ac-mono" style={{textAlign:"right", color:"var(--ink2)"}}>
                    {inv.net_amount ? fmtEur(inv.net_amount) : "—"}
                  </td>
                  <td className="ac-mono" style={{textAlign:"right", color:"var(--ink2)", whiteSpace:"nowrap"}}>
                    {inv.vat_rate != null ? `${Number(inv.vat_rate).toFixed(0)} %` : "—"}
                  </td>
                  <td className="ac-mono" style={{textAlign:"right", fontWeight:600}}>{fmtEur(inv.amount)}</td>
                  <td><span className={`ac-badge ${meta.cls}`}>{meta.label}</span></td>
                  <td>
                    {inv.is_booked ? (
                      <span style={BOOKED_BADGE_STYLE} title="Buchungssatz vorhanden">
                        ✓ Gebucht{inv.buchungs_konto_nr && (
                          <span style={{
                            marginLeft:5, fontFamily:"JetBrains Mono,monospace",
                            fontSize:9, opacity:0.75,
                          }}>{inv.buchungs_konto_nr}</span>
                        )}
                      </span>
                    ) : (
                      <span style={{
                        ...BOOKED_BADGE_STYLE,
                        background:"rgba(180,180,180,0.08)",
                        border:"1px solid rgba(180,180,180,0.2)",
                        color:"var(--ink3)",
                      }}>Offen</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display:"flex", gap:4 }}>
                      {inv.status !== "paid" && inv.payment_status !== "paid" && (
                        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => markPaid(inv.id)}>
                          ✓ Bezahlt
                        </button>
                      )}
                      <button
                        className={`ac-btn ac-btn-sm ${inv.is_booked ? "ac-btn-ghost" : "ac-btn-primary"}`}
                        onClick={() => setBookingInv(inv)}
                        title={inv.is_booked ? "Buchung prüfen / erneut buchen" : "Rechnung buchen"}
                        style={inv.is_booked ? { opacity:0.6 } : undefined}
                      >
                        {inv.is_booked ? "↺" : "Buchen"}
                      </button>
                      <button className="ac-btn ac-btn-danger ac-btn-sm" onClick={() => deleteInvoice(inv.id)}>
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {bookingInv && (
        <BookingConfirmModal
          invoice={bookingInv}
          onClose={() => setBookingInv(null)}
          onBooked={() => { setBookingInv(null); load(); }}
          setMsg={setMsg}
        />
      )}
    </div>
  );
}
