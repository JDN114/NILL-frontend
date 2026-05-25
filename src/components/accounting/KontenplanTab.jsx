// src/components/accounting/KontenplanTab.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import api from "../../services/api";

// ─── EÜR-Kontenkatalog ────────────────────────────────────────────────────────
const EUR_GRUPPEN = [
  {
    id: "einnahmen", label: "Einnahmen", farbe: "#c6ff3c",
    konten: [
      { nr:"8400", name:"Umsatzerlöse (19 % USt)",
        kurz:"Deine Haupteinnahmen mit regulärer Mehrwertsteuer",
        wann:"Jede Ausgangsrechnung, auf der du 19 % MwSt ausweist.",
        beispiele:["Freiberufliche Honorare","Beratungsleistungen","Warenverkauf"],
        flag: null },
      { nr:"8300", name:"Umsatzerlöse (7 % USt)",
        kurz:"Einnahmen mit ermäßigtem Steuersatz",
        wann:"Für Lebensmittel, Bücher, bestimmte Dienstleistungen (7 %).",
        beispiele:["Lebensmittelverkauf","Bücher & Zeitschriften"],
        flag: null },
      { nr:"8200", name:"Steuerfreie Erlöse (§ 19 UStG)",
        kurz:"Für Kleinunternehmer — keine MwSt auf Rechnung",
        wann:"Nur wenn du unter der Kleinunternehmerregelung bist (Umsatz < 22.000 € Vorjahr).",
        beispiele:["Alle Rechnungen ohne Umsatzsteuerausweis"],
        flag:"kleinunternehmer" },
    ],
  },
  {
    id: "bank", label: "Bank & Kasse", farbe: "#7a5cff",
    konten: [
      { nr:"1200", name:"Girokonto",
        kurz:"Dein Geschäftsbankkonto",
        wann:"Jede Zahlung, die über dein Geschäftskonto fließt.",
        beispiele:["Überweisungen","Lastschriften","Kartenzahlungen"],
        flag: null },
      { nr:"1000", name:"Kasse",
        kurz:"Barzahlungen — Einnahmen & Ausgaben",
        wann:"Wenn Bargeld die Hand wechselt.",
        beispiele:["Bareinnahmen am Tresen","Bare Kleinausgaben"],
        flag: null },
    ],
  },
  {
    id: "ausgaben", label: "Betriebsausgaben", farbe: "#ff4d8d",
    konten: [
      { nr:"4930", name:"Büromaterial",
        kurz:"Verbrauchsmaterial für den Büroalltag",
        wann:"Schreibwaren, Papier, Druckerpatronen, USB-Sticks.",
        beispiele:["Druckerpapier","Stifte","Hefter"],
        flag: null },
      { nr:"4920", name:"Telefon & Internet",
        kurz:"Kommunikationskosten (betrieblicher Anteil)",
        wann:"Handy-, Festnetz- und Internetrechnungen.",
        beispiele:["Mobilfunkvertrag","DSL/Glasfaser","Zoom-Abo"],
        flag: null },
      { nr:"4600", name:"Werbung & Marketing",
        kurz:"Alles rund um Kundengewinnung",
        wann:"Werbeanzeigen, Drucksachen, Social-Media-Tools.",
        beispiele:["Google Ads","Flyer","Canva-Abo"],
        flag: null },
      { nr:"4630", name:"Kfz-Kosten",
        kurz:"Fahrzeugkosten für betriebliche Fahrten",
        wann:"Sprit, Reparaturen, Versicherung — nur betrieblicher Anteil.",
        beispiele:["Tanken","Werkstatt","Parkschein auf Dienstreise"],
        warnung:"Privatanteil rausrechnen (Fahrtenbuch oder 1 %-Regel).",
        flag: null },
      { nr:"4570", name:"Reisekosten",
        kurz:"Dienstreisen, Übernachtungen, Tagegeld",
        wann:"Geschäftliche Reisen außerhalb deines normalen Arbeitsorts.",
        beispiele:["Bahnticket","Hotel","Tagespauschale 28 €/Tag"],
        flag: null },
      { nr:"4820", name:"Bewirtungskosten",
        kurz:"Geschäftsessen mit Kunden oder Partnern",
        wann:"Restaurant- oder Cafébesuche mit betrieblichem Anlass.",
        beispiele:["Kundenessen","Kaffee beim Erstgespräch"],
        warnung:"Nur 70 % steuerlich absetzbar. Anlass & Teilnehmer auf den Beleg schreiben!",
        flag: null },
      { nr:"4980", name:"Buchführung & Steuerberater",
        kurz:"Kosten für Buchhaltung und Steuerberatung",
        wann:"Rechnung vom Steuerberater oder Buchhaltungssoftware.",
        beispiele:["NILL-Abo","Steuerberaterhonorar","DATEV"],
        flag: null },
      { nr:"6800", name:"Miete & Nebenkosten",
        kurz:"Miete für Büro oder Geschäftsräume",
        wann:"Monatliche Miete für betrieblich genutzte Räume.",
        beispiele:["Büroraum","Lager","Co-Working-Space"],
        warnung:"Heimarbeitsplatz nur abzugsfähig wenn ausschließlich betrieblich genutzt.",
        flag: null },
      { nr:"4200", name:"Löhne & Gehälter",
        kurz:"Personalkosten für Angestellte",
        wann:"Wenn du Mitarbeiter beschäftigst.",
        beispiele:["Bruttogehalt","Aushilfen","Minijobberlohn"],
        flag: null },
    ],
  },
  {
    id: "privat", label: "Privat", farbe: "#9b9890",
    konten: [
      { nr:"1800", name:"Privatentnahmen",
        kurz:"Geld, das du privat aus dem Unternehmen nimmst",
        wann:"Dein 'Unternehmerlohn' — kein Betriebsaufwand, mindert aber Eigenkapital.",
        beispiele:["Monatliche Entnahme","Private Rechnung mit Geschäftskonto bezahlt"],
        flag: null },
      { nr:"1890", name:"Privateinlagen",
        kurz:"Privates Geld, das du ins Unternehmen einbringst",
        wann:"Startkapital oder Nachschuss aus der eigenen Tasche.",
        beispiele:["Startkapital","Privater Kredit ans Unternehmen"],
        flag: null },
    ],
  },
];

// Keyword → Kontonummer Mapping für Kontofinder
const FINDER_MAP = [
  { keys:["drucker","papier","stift","büro","schreibwaren","klammer","umschlag"], nr:"4930" },
  { keys:["handy","telefon","internet","dsl","glasfaser","zoom","teams","slack"], nr:"4920" },
  { keys:["werbung","google","ads","flyer","logo","marketing","instagram","social"], nr:"4600" },
  { keys:["auto","kfz","benzin","tank","diesel","werkstatt","reparatur","parkschein","reifen"], nr:"4630" },
  { keys:["reise","hotel","bahn","zug","flug","taxi","uber","tagegeld","übernachtung"], nr:"4570" },
  { keys:["essen","restaurant","kaffee","café","bewirtung","mittagessen","dinner"], nr:"4820" },
  { keys:["steuerberater","buchhaltung","datev","nill","software","abo"], nr:"4980" },
  { keys:["miete","büroraum","lager","coworking","nebenkosten"], nr:"6800" },
  { keys:["gehalt","lohn","mitarbeiter","personal","aushilfe","minijob"], nr:"4200" },
  { keys:["einnahme","rechnung","honorar","umsatz","erlös","verkauf"], nr:"8400" },
  { keys:["kleinunternehmer","§19","ohne mehrwertsteuer","ohne mwst"], nr:"8200" },
  { keys:["bank","konto","überweisung","lastschrift","karte","girokonto"], nr:"1200" },
  { keys:["kasse","bar","bargeld","cash"], nr:"1000" },
  { keys:["entnahme","privatentnahme","gehalt selbst","unternehmerlohn"], nr:"1800" },
  { keys:["einlage","privateinlage","startkapital","eigenmittel"], nr:"1890" },
];

const alleKonten = EUR_GRUPPEN.flatMap(g => g.konten.map(k => ({ ...k, gruppe: g.label, farbe: g.farbe })));

// ─── Profi-Ansicht (bestehende Logik) ────────────────────────────────────────
const KLASSEN = {
  "0":"Klasse 0 – Anlagevermögen","1":"Klasse 1 – Umlaufvermögen",
  "2":"Klasse 2 – Eigenkapital","3":"Klasse 3 – Verbindlichkeiten",
  "4":"Klasse 4 – Betriebliche Aufwendungen","5":"Klasse 5 – Wareneinsatz",
  "6":"Klasse 6 – Sonstige Kosten","7":"Klasse 7 – Erträge (Sonderposten)",
  "8":"Klasse 8 – Erlöse / Erträge","9":"Klasse 9 – Vor- und Abschlusskonten",
};
const KONTOART_BADGE = {
  "aktiv":"ac-badge-green","passiv":"ac-badge-purple","ertrag":"ac-badge-green",
  "aufwand":"ac-badge-pink","kasse":"ac-badge-gray","bank":"ac-badge-gray",
};

// ─── Info-Popover ─────────────────────────────────────────────────────────────
function InfoPill({ konto }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span ref={ref} style={{ position:"relative", display:"inline-flex" }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        style={{
          width:18, height:18, borderRadius:"50%", border:"1px solid rgba(239,237,231,.25)",
          background: open ? "rgba(198,255,60,.15)" : "transparent",
          color:"rgba(239,237,231,.5)", fontSize:".65rem", cursor:"pointer",
          display:"inline-flex", alignItems:"center", justifyContent:"center",
          transition:"all .15s", flexShrink:0,
        }}
        title="Mehr Infos"
      >ⓘ</button>
      {open && (
        <div style={{
          position:"absolute", bottom:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)",
          background:"#1a1a26", border:"1px solid rgba(239,237,231,.12)",
          borderRadius:10, padding:"14px 16px", width:280, zIndex:50,
          boxShadow:"0 8px 32px rgba(0,0,0,.5)",
        }}>
          <div style={{ fontSize:".78rem", color:"rgba(239,237,231,.9)", lineHeight:1.6, marginBottom:8 }}>
            <strong style={{ color:"#efede7" }}>Wann?</strong><br/>{konto.wann}
          </div>
          {konto.beispiele?.length > 0 && (
            <div style={{ fontSize:".75rem", color:"rgba(239,237,231,.55)", lineHeight:1.5, marginBottom: konto.warnung ? 8 : 0 }}>
              <strong style={{ color:"rgba(239,237,231,.7)" }}>z.B.:</strong> {konto.beispiele.join(" · ")}
            </div>
          )}
          {konto.warnung && (
            <div style={{
              marginTop:8, padding:"7px 10px", borderRadius:6,
              background:"rgba(255,165,0,.08)", border:"1px solid rgba(255,165,0,.18)",
              fontSize:".72rem", color:"#ffb347", lineHeight:1.5,
            }}>⚠ {konto.warnung}</div>
          )}
          <div style={{ position:"absolute", bottom:-5, left:"50%", transform:"translateX(-50%)",
            width:8, height:8, background:"#1a1a26", border:"1px solid rgba(239,237,231,.12)",
            borderTop:"none", borderLeft:"none", rotate:"45deg" }} />
        </div>
      )}
    </span>
  );
}

// ─── Kontofinder ──────────────────────────────────────────────────────────────
function Kontofinder({ saldoMap }) {
  const [q, setQ] = useState("");
  const [highlighted, setHighlighted] = useState(null);

  const treffer = useMemo(() => {
    if (q.trim().length < 2) return [];
    const lower = q.toLowerCase();
    const gefunden = new Set();
    FINDER_MAP.forEach(({ keys, nr }) => {
      if (keys.some(k => lower.includes(k) || k.includes(lower))) gefunden.add(nr);
    });
    return alleKonten.filter(k => gefunden.has(k.nr));
  }, [q]);

  return (
    <div style={{
      background:"rgba(198,255,60,.04)", border:"1px solid rgba(198,255,60,.12)",
      borderRadius:12, padding:"16px 20px", marginBottom:24,
    }}>
      <div style={{ fontSize:".78rem", color:"rgba(198,255,60,.7)", fontWeight:600,
        letterSpacing:".05em", textTransform:"uppercase", marginBottom:8 }}>
        Konto finden
      </div>
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <input
          value={q} onChange={e => setQ(e.target.value)}
          placeholder="Was habe ich gekauft / eingenommen? z.B. Tankquittung, Google Ads..."
          style={{
            flex:1, background:"rgba(0,0,0,.3)", border:"1px solid rgba(239,237,231,.1)",
            color:"#efede7", padding:"9px 14px", borderRadius:8,
            fontFamily:"Inter,sans-serif", fontSize:".85rem", outline:"none",
          }}
          onFocus={e => e.target.style.borderColor = "#c6ff3c"}
          onBlur={e => e.target.style.borderColor = "rgba(239,237,231,.1)"}
        />
        {q && <button onClick={() => setQ("")} style={{
          background:"transparent", border:"none", color:"rgba(239,237,231,.4)",
          cursor:"pointer", fontSize:".9rem", padding:4,
        }}>✕</button>}
      </div>
      {q.trim().length >= 2 && (
        <div style={{ marginTop:12 }}>
          {treffer.length === 0 ? (
            <div style={{ fontSize:".8rem", color:"rgba(239,237,231,.4)", padding:"8px 0" }}>
              Kein passendes Konto gefunden — beschreib es anders oder leg ein eigenes an.
            </div>
          ) : treffer.map(k => (
            <div key={k.nr}
              onMouseEnter={() => setHighlighted(k.nr)}
              onMouseLeave={() => setHighlighted(null)}
              style={{
                display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                borderRadius:8, marginBottom:4, cursor:"default",
                background: highlighted === k.nr ? "rgba(198,255,60,.06)" : "rgba(255,255,255,.02)",
                border:"1px solid", borderColor: highlighted === k.nr ? "rgba(198,255,60,.2)" : "rgba(239,237,231,.06)",
                transition:"all .15s",
              }}>
              <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".78rem", color:"#c6ff3c", minWidth:36 }}>{k.nr}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:".85rem", color:"#efede7", fontWeight:500 }}>{k.name}</div>
                <div style={{ fontSize:".75rem", color:"rgba(239,237,231,.45)", marginTop:2 }}>{k.kurz}</div>
              </div>
              <InfoPill konto={k} />
              {saldoMap[k.nr] !== undefined && (
                <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:".78rem",
                  color:"rgba(239,237,231,.5)", whiteSpace:"nowrap" }}>
                  {Number(saldoMap[k.nr]).toLocaleString("de-DE",{minimumFractionDigits:2})} €
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Einfach-Ansicht ──────────────────────────────────────────────────────────
function EinfachAnsicht({ saldoMap }) {
  const [offeneGruppe, setOffeneGruppe] = useState({ einnahmen:true, bank:true, ausgaben:true, privat:false });

  return (
    <div>
      <Kontofinder saldoMap={saldoMap} />
      {EUR_GRUPPEN.map(g => (
        <div key={g.id} style={{ marginBottom:12 }}>
          <button
            onClick={() => setOffeneGruppe(s => ({ ...s, [g.id]: !s[g.id] }))}
            style={{
              width:"100%", display:"flex", alignItems:"center", gap:10, padding:"13px 18px",
              background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12,
              cursor:"pointer", textAlign:"left", transition:"border-color .15s",
              borderColor: offeneGruppe[g.id] ? "rgba(239,237,231,.14)" : "var(--border)",
            }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:g.farbe, flexShrink:0 }} />
            <span style={{ fontFamily:"Fraunces,serif", fontWeight:600, color:"#efede7", fontSize:"1rem", flex:1 }}>
              {g.label}
            </span>
            <span style={{ fontSize:".78rem", color:"rgba(239,237,231,.35)" }}>
              {g.konten.length} Konten {offeneGruppe[g.id] ? "▲" : "▼"}
            </span>
          </button>

          {offeneGruppe[g.id] && (
            <div style={{ padding:"4px 0 0 0", display:"flex", flexDirection:"column", gap:4 }}>
              {g.konten.map(k => {
                const saldo = saldoMap[k.nr];
                return (
                  <div key={k.nr} style={{
                    display:"flex", alignItems:"center", gap:12, padding:"11px 18px",
                    background:"var(--surface2)", border:"1px solid var(--border)",
                    borderRadius:8, marginLeft:4,
                  }}>
                    <span style={{
                      fontFamily:"JetBrains Mono,monospace", fontSize:".75rem",
                      color:g.farbe, minWidth:36, opacity:.8,
                    }}>{k.nr}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                        <span style={{ fontSize:".88rem", color:"#efede7", fontWeight:500 }}>{k.name}</span>
                        {k.flag === "kleinunternehmer" && (
                          <span style={{
                            fontSize:".65rem", padding:"1px 7px", borderRadius:99,
                            background:"rgba(122,92,255,.15)", border:"1px solid rgba(122,92,255,.25)",
                            color:"#a08fff", fontWeight:600,
                          }}>Kleinunternehmer</span>
                        )}
                        {k.warnung && (
                          <span style={{ fontSize:".68rem", color:"rgba(255,165,0,.7)" }}>⚠</span>
                        )}
                      </div>
                      <div style={{ fontSize:".78rem", color:"rgba(239,237,231,.4)", marginTop:2 }}>{k.kurz}</div>
                    </div>
                    <InfoPill konto={k} />
                    {saldo !== undefined ? (
                      <span style={{
                        fontFamily:"JetBrains Mono,monospace", fontSize:".82rem",
                        color: saldo >= 0 ? "rgba(198,255,60,.8)" : "rgba(255,77,141,.8)",
                        whiteSpace:"nowrap",
                      }}>
                        {Number(saldo).toLocaleString("de-DE",{minimumFractionDigits:2})} €
                      </span>
                    ) : (
                      <span style={{ fontSize:".75rem", color:"rgba(239,237,231,.2)", whiteSpace:"nowrap" }}>– €</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
      <div style={{
        marginTop:20, padding:"12px 16px", borderRadius:10,
        background:"rgba(122,92,255,.05)", border:"1px solid rgba(122,92,255,.12)",
        fontSize:".78rem", color:"rgba(239,237,231,.45)", lineHeight:1.6,
      }}>
        <strong style={{ color:"rgba(122,92,255,.8)" }}>EÜR Tipp:</strong> Du buchst Einnahmen beim Geldeingang und Ausgaben beim Geldabgang.
        Eine eingehende Rechnung ist erst relevant, wenn sie bezahlt ist.
      </div>
    </div>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────
export default function KontenplanTab() {
  const [konten, setKonten]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("");
  const [expanded, setExpanded]   = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newKonto, setNewKonto]   = useState({ kontonummer:"", bezeichnung:"", kontoart:"aufwand" });
  const [saving, setSaving]       = useState(false);
  const [modus, setModus]         = useState(() => localStorage.getItem("nill_konten_modus") || "einfach");

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/buchhaltung/konten", { params:{ include_saldo:true } })
      .then(r => setKonten(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const switchModus = (m) => { setModus(m); localStorage.setItem("nill_konten_modus", m); };

  // Saldo-Map: kontonummer → saldo (für Einfach-Ansicht)
  const saldoMap = useMemo(() => {
    const m = {};
    konten.forEach(k => { if (k.saldo !== undefined) m[k.kontonummer] = k.saldo; });
    return m;
  }, [konten]);

  const filtered = useMemo(() => {
    if (!filter) return konten;
    const q = filter.toLowerCase();
    return konten.filter(k => k.kontonummer.includes(q) || (k.bezeichnung || "").toLowerCase().includes(q));
  }, [konten, filter]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(k => { const cls = k.kontonummer[0] || "?"; if (!g[cls]) g[cls] = []; g[cls].push(k); });
    return g;
  }, [filtered]);

  const save = async () => {
    if (!newKonto.kontonummer || !newKonto.bezeichnung) return;
    setSaving(true);
    try {
      await api.post("/api/v1/buchhaltung/konten", newKonto);
      setShowModal(false);
      setNewKonto({ kontonummer:"", bezeichnung:"", kontoart:"aufwand" });
      load();
    } catch (e) { alert(e.response?.data?.detail || "Fehler"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="ac-loading"><span className="ac-spinner"/>Lade Kontenplan…</div>;

  return (
    <div>
      {/* ── Modus-Toggle ── */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap" }}>
        <div style={{
          display:"inline-flex", gap:2, background:"var(--surface)", border:"1px solid var(--border)",
          borderRadius:10, padding:3,
        }}>
          {[["einfach","Übersicht"],["profi","Vollansicht"]].map(([m, label]) => (
            <button key={m} onClick={() => switchModus(m)} style={{
              padding:"5px 16px", borderRadius:8, border:"none", cursor:"pointer",
              fontFamily:"Inter,sans-serif", fontSize:".8rem", fontWeight: modus===m ? 600 : 400,
              background: modus===m ? "#c6ff3c" : "transparent",
              color: modus===m ? "#000" : "rgba(239,237,231,.55)",
              transition:"all .15s",
            }}>{label}</button>
          ))}
        </div>
        <div style={{ flex:1 }} />
        <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={() => setShowModal(true)}>
          + Konto anlegen
        </button>
      </div>

      {/* ── Inhalt ── */}
      {modus === "einfach" ? (
        <EinfachAnsicht saldoMap={saldoMap} />
      ) : (
        <div>
          <div style={{ display:"flex", gap:12, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
            <input className="ac-input" style={{ maxWidth:300 }} placeholder="Suche (Nr. oder Bezeichnung)…"
              value={filter} onChange={e => setFilter(e.target.value)} />
            <span style={{ color:"var(--ink2)", fontSize:".85rem" }}>{konten.length} Konten</span>
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setExpanded(e => {
              const allOpen = Object.values(e).every(v => v) && Object.keys(e).length === Object.keys(grouped).length;
              const next = {};
              Object.keys(grouped).forEach(k => { next[k] = !allOpen; });
              return next;
            })}>
              Alle {Object.values(expanded).some(v => v) ? "zuklappen" : "aufklappen"}
            </button>
          </div>
          {Object.keys(grouped).sort().map(cls => (
            <div key={cls} className="ac-card" style={{ marginBottom:12, padding:0 }}>
              <div style={{ padding:"14px 20px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}
                onClick={() => setExpanded(e => ({ ...e, [cls]: !e[cls] }))}>
                <span style={{ fontFamily:"Fraunces,serif", fontWeight:600 }}>{KLASSEN[cls] || `Klasse ${cls}`}</span>
                <span style={{ color:"var(--ink2)", fontSize:".8rem" }}>{grouped[cls].length} Konten {expanded[cls] ? "▲" : "▼"}</span>
              </div>
              {expanded[cls] && (
                <table className="ac-table">
                  <thead><tr><th style={{width:100}}>Nr.</th><th>Bezeichnung</th><th>Art</th><th style={{textAlign:"right"}}>Saldo</th><th>USt</th></tr></thead>
                  <tbody>
                    {grouped[cls].map(k => (
                      <tr key={k.id}>
                        <td className="ac-mono" style={{ color:"var(--accent)" }}>{k.kontonummer}</td>
                        <td>{k.bezeichnung}</td>
                        <td><span className={`ac-badge ${KONTOART_BADGE[k.kontoart] || "ac-badge-gray"}`}>{k.kontoart}</span></td>
                        <td className="ac-mono" style={{ textAlign:"right", color:"var(--ink2)" }}>
                          {k.saldo !== undefined ? `${Number(k.saldo).toLocaleString("de-DE",{minimumFractionDigits:2})} €` : "--"}
                        </td>
                        <td style={{ fontSize:".75rem", color:"var(--ink2)" }}>{k.ust_kennzeichen || "--"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Konto anlegen Modal ── */}
      {showModal && (
        <div className="ac-modal-backdrop">
          <div className="ac-modal">
            <div className="ac-modal-title">Konto anlegen</div>
            <div className="ac-form-col" style={{ marginBottom:12 }}>
              <label className="ac-label">Kontonummer (SKR03)</label>
              <input className="ac-input ac-mono" value={newKonto.kontonummer}
                onChange={e => setNewKonto(n => ({ ...n, kontonummer:e.target.value }))}
                placeholder="z.B. 4820" maxLength={8} />
            </div>
            <div className="ac-form-col" style={{ marginBottom:12 }}>
              <label className="ac-label">Bezeichnung</label>
              <input className="ac-input" value={newKonto.bezeichnung}
                onChange={e => setNewKonto(n => ({ ...n, bezeichnung:e.target.value }))}
                placeholder="Kontobeschreibung" />
            </div>
            <div className="ac-form-col" style={{ marginBottom:20 }}>
              <label className="ac-label">Kontoart</label>
              <select className="ac-select" value={newKonto.kontoart}
                onChange={e => setNewKonto(n => ({ ...n, kontoart:e.target.value }))}>
                <option value="aktiv">Aktiv</option>
                <option value="passiv">Passiv</option>
                <option value="ertrag">Ertrag</option>
                <option value="aufwand">Aufwand</option>
                <option value="bank">Bank</option>
                <option value="kasse">Kasse</option>
              </select>
            </div>
            <div className="ac-modal-footer">
              <button className="ac-btn ac-btn-ghost" onClick={() => setShowModal(false)}>Abbrechen</button>
              <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>{saving ? "…" : "Anlegen"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
