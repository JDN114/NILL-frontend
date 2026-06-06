// ArtikelstammTab.jsx — Produktkatalog-Verwaltung + POS-Ansicht
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const EUR = (n) =>
  Number(n || 0).toLocaleString("de-DE", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }) + " €";

const FARBEN = [
  "#6699ff","#44cc66","#ff6655","#ffb400","#aa66ff",
  "#ff66aa","#00ccbb","#888899",
];

const ALLERGENE_META = {
  A:"Glutenhaltiges Getreide", B:"Krebstiere", C:"Eier", D:"Fisch",
  E:"Erdnüsse", F:"Soja", G:"Milch/Laktose", H:"Schalenfrüchte",
  L:"Sellerie", M:"Senf", N:"Sesam", O:"Sulfite", P:"Lupinen", R:"Weichtiere",
};

const EMPTY_ARTIKEL = {
  bezeichnung:"", preis_brutto:"", ust_satz:19, einheit:"Stk.",
  warengruppe_id:null, artikelnummer:"", beschreibung:"",
  barcode:"", allergene:[], farbe:"",
};

// ── Artikel-Karte ─────────────────────────────────────────────────────────────
function ArtikelKarte({ a, onEdit, onDelete, onSelect, mode }) {
  const farbe = a.anzeige_farbe || a.farbe || "#6699ff";
  const isSelect = mode === "auswahl";
  return (
    <div
      onClick={() => isSelect && onSelect(a)}
      style={{
        borderRadius: 10, overflow: "hidden",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        cursor: isSelect ? "pointer" : "default",
        transition: "transform .12s, box-shadow .12s",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        if (isSelect) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 4px 16px ${farbe}33`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Color bar */}
      <div style={{ height: 5, background: farbe }} />

      <div style={{ padding: "10px 12px 10px" }}>
        {/* Name */}
        <div style={{
          fontWeight: 600, fontSize: ".88rem", color: "var(--ink)",
          marginBottom: 4, lineHeight: 1.3,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {a.bezeichnung}
        </div>

        {/* Price */}
        <div style={{
          fontSize: "1.1rem", fontWeight: 700, color: farbe,
          fontFamily: "JetBrains Mono,monospace", marginBottom: 4,
        }}>
          {EUR(a.preis_brutto)}
        </div>

        {/* Meta row */}
        <div style={{
          display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap",
        }}>
          <span style={{
            fontSize: ".68rem", padding: "1px 6px", borderRadius: 8,
            background: "rgba(255,255,255,.07)", color: "var(--ink2)",
          }}>
            {a.ust_satz} % MwSt
          </span>
          <span style={{ fontSize: ".68rem", color: "var(--ink2)" }}>
            / {a.einheit}
          </span>
          {(a.allergene || []).length > 0 && (
            <span style={{
              fontSize: ".66rem", padding: "1px 5px", borderRadius: 6,
              background: "rgba(255,180,0,.12)", color: "#ffb400",
            }}>
              {(a.allergene || []).join(" ")}
            </span>
          )}
          {a.lagerbestand != null && a.mindestbestand != null
            && a.lagerbestand < a.mindestbestand && (
            <span style={{
              fontSize: ".66rem", padding: "1px 5px", borderRadius: 6,
              background: "rgba(255,100,85,.12)", color: "#ff6655",
            }}>
              Lager niedrig
            </span>
          )}
        </div>

        {/* Actions (management mode only) */}
        {!isSelect && (
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button
              onClick={() => onEdit(a)}
              style={{
                flex: 1, padding: "4px 0", borderRadius: 6,
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--ink2)", cursor: "pointer", fontSize: ".74rem",
              }}
            >
              Bearbeiten
            </button>
            <button
              onClick={() => onDelete(a)}
              style={{
                padding: "4px 8px", borderRadius: 6,
                border: "1px solid rgba(255,100,85,.3)", background: "transparent",
                color: "#ff6655", cursor: "pointer", fontSize: ".74rem",
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Artikel-Modal ─────────────────────────────────────────────────────────────
function ArtikelModal({ initial, warengruppen, onSave, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_ARTIKEL, ...(initial || {}) });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleAllergen = (code) =>
    setForm((f) => {
      const arr = f.allergene || [];
      return {
        ...f,
        allergene: arr.includes(code) ? arr.filter((x) => x !== code) : [...arr, code],
      };
    });

  const netto = form.preis_brutto
    ? (parseFloat(form.preis_brutto) / (1 + parseFloat(form.ust_satz || 19) / 100)).toFixed(2)
    : null;

  const save = async () => {
    if (!form.bezeichnung.trim()) { setErr("Bezeichnung pflicht."); return; }
    if (!(parseFloat(form.preis_brutto) >= 0)) { setErr("Preis pflicht."); return; }
    setSaving(true); setErr("");
    try {
      const payload = {
        ...form,
        preis_brutto: parseFloat(form.preis_brutto),
        ust_satz: parseFloat(form.ust_satz),
        warengruppe_id: form.warengruppe_id || null,
        farbe: form.farbe || null,
        allergene: form.allergene || [],
      };
      if (initial?.id) {
        await api.put(`/api/v1/artikel/${initial.id}`, payload);
      } else {
        await api.post("/api/v1/artikel", payload);
      }
      onSave();
    } catch (ex) {
      setErr(ex.response?.data?.detail || "Fehler.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 580, overflowY: "auto", maxHeight: "90vh" }}>
        <div className="ac-modal-title">{initial?.id ? "Artikel bearbeiten" : "Neuer Artikel"}</div>
        {err && <div role="alert" className="ac-alert ac-alert-err" style={{ marginBottom: 10 }}>{err}</div>}

        <div className="ac-form-row">
          <div className="ac-form-col" style={{ flex: 3 }}>
            <label className="ac-label">Bezeichnung *</label>
            <input aria-required="true" className="ac-input" value={form.bezeichnung}
              onChange={(e) => set("bezeichnung", e.target.value)} autoFocus />
          </div>
          <div className="ac-form-col" style={{ flex: 1 }}>
            <label className="ac-label">Art.-Nr.</label>
            <input className="ac-input" value={form.artikelnummer || ""}
              onChange={(e) => set("artikelnummer", e.target.value)} />
          </div>
        </div>

        <div className="ac-form-row" style={{ marginTop: 8 }}>
          <div className="ac-form-col">
            <label className="ac-label">Preis brutto (€) *</label>
            <input className="ac-input" type="number" step="0.01" min="0"
              value={form.preis_brutto}
              onChange={(e) => set("preis_brutto", e.target.value)} />
            {netto && (
              <div style={{ fontSize: ".71rem", color: "var(--ink2)", marginTop: 3 }}>
                → {netto} € netto
              </div>
            )}
          </div>
          <div className="ac-form-col">
            <label className="ac-label">USt-Satz</label>
            <select className="ac-select" value={form.ust_satz}
              onChange={(e) => set("ust_satz", e.target.value)}>
              <option value={19}>19 % (Regelsteuersatz)</option>
              <option value={7}>7 % (ermäßigt)</option>
              <option value={0}>0 % (steuerfrei)</option>
            </select>
          </div>
          <div className="ac-form-col" style={{ maxWidth: 110 }}>
            <label className="ac-label">Einheit</label>
            <input className="ac-input" value={form.einheit}
              onChange={(e) => set("einheit", e.target.value)}
              placeholder="Stk." />
          </div>
        </div>

        <div className="ac-form-row" style={{ marginTop: 8 }}>
          <div className="ac-form-col">
            <label className="ac-label">Warengruppe</label>
            <select className="ac-select" value={form.warengruppe_id || ""}
              onChange={(e) => set("warengruppe_id", e.target.value ? parseInt(e.target.value) : null)}>
              <option value="">— Keine —</option>
              {warengruppen.map((wg) => (
                <option key={wg.id} value={wg.id}>{wg.bezeichnung}</option>
              ))}
            </select>
          </div>
          <div className="ac-form-col">
            <label className="ac-label">Barcode / EAN</label>
            <input className="ac-input" value={form.barcode || ""}
              onChange={(e) => set("barcode", e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <label className="ac-label">Farbe (überschreibt Warengruppe)</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
            <button
              onClick={() => set("farbe", "")}
              style={{
                width: 28, height: 28, borderRadius: "50%", border: "2px solid",
                borderColor: !form.farbe ? "var(--accent)" : "var(--border)",
                background: "var(--surface)", cursor: "pointer",
                fontSize: ".62rem", color: "var(--ink2)",
              }}
            >Auto</button>
            {FARBEN.map((c) => (
              <button key={c} onClick={() => set("farbe", c)} style={{
                width: 28, height: 28, borderRadius: "50%", border: "2px solid",
                borderColor: form.farbe === c ? "white" : "transparent",
                background: c, cursor: "pointer",
              }} />
            ))}
          </div>
        </div>

        {/* Allergene §4 LMIV */}
        <div style={{ marginTop: 12 }}>
          <label className="ac-label">Allergene (§4 LMIV — EU-VO 1169/2011)</label>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6,
          }}>
            {Object.entries(ALLERGENE_META).map(([code, name]) => {
              const active = (form.allergene || []).includes(code);
              return (
                <button key={code} onClick={() => toggleAllergen(code)} style={{
                  padding: "3px 10px", borderRadius: 12, border: "1px solid",
                  borderColor: active ? "#ffb400" : "var(--border)",
                  background: active ? "rgba(255,180,0,.15)" : "transparent",
                  color: active ? "#ffb400" : "var(--ink2)",
                  cursor: "pointer", fontSize: ".72rem",
                }}>
                  <strong>{code}</strong> {name}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <label className="ac-label">Beschreibung</label>
          <textarea className="ac-input" rows={2} value={form.beschreibung || ""}
            onChange={(e) => set("beschreibung", e.target.value)}
            style={{ resize: "vertical" }} />
        </div>

        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Warengruppen-Modal ────────────────────────────────────────────────────────
function WgModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({ bezeichnung: "", farbe: "#6699ff", sort_order: 0, ...(initial || {}) });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.bezeichnung.trim()) return;
    setSaving(true);
    try {
      if (initial?.id) {
        await api.put(`/api/v1/artikel/warengruppen/${initial.id}`, form);
      } else {
        await api.post("/api/v1/artikel/warengruppen", form);
      }
      onSave();
    } catch (ex) {
      alert(ex.response?.data?.detail || "Fehler.");
    } finally { setSaving(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal" style={{ maxWidth: 380 }}>
        <div className="ac-modal-title">{initial?.id ? "Warengruppe bearbeiten" : "Neue Warengruppe"}</div>
        <label className="ac-label">Name</label>
        <input className="ac-input" value={form.bezeichnung}
          onChange={(e) => set("bezeichnung", e.target.value)} autoFocus
          style={{ marginBottom: 12 }} />
        <label className="ac-label">Farbe</label>
        <div style={{ display: "flex", gap: 8, marginTop: 4, marginBottom: 16 }}>
          {FARBEN.map((c) => (
            <button key={c} onClick={() => set("farbe", c)} style={{
              width: 32, height: 32, borderRadius: "50%", border: "3px solid",
              borderColor: form.farbe === c ? "white" : "transparent",
              background: c, cursor: "pointer", boxShadow: form.farbe === c ? `0 0 0 2px ${c}` : "none",
            }} />
          ))}
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={save} disabled={saving}>
            {saving ? "…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Hauptkomponente ───────────────────────────────────────────────────────────
export default function ArtikelstammTab({ mode = "verwaltung", onArtikelSelect }) {
  const [warengruppen, setWarengruppen] = useState([]);
  const [artikel, setArtikel]           = useState([]);
  const [aktiveWg, setAktiveWg]         = useState(null);   // null = alle
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(false);

  const [editArtikel, setEditArtikel]   = useState(null);   // null=closed, {}=neu, {...}=edit
  const [editWg, setEditWg]             = useState(null);

  const isManagement = mode === "verwaltung";

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [wgRes, artRes] = await Promise.all([
        api.get("/api/v1/artikel/warengruppen"),
        api.get("/api/v1/artikel", {
          params: {
            nur_aktiv: true,
            warengruppe_id: aktiveWg ?? undefined,
            search: search || undefined,
            limit: 500,
          },
        }),
      ]);
      setWarengruppen(wgRes.data);
      setArtikel(artRes.data);
    } catch (e) {
      console.error("Artikelstamm Ladefehler:", e);
    } finally {
      setLoading(false);
    }
  }, [aktiveWg, search]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async (a) => {
    if (!window.confirm(`"${a.bezeichnung}" deaktivieren?`)) return;
    await api.delete(`/api/v1/artikel/${a.id}`);
    loadData();
  };

  const handleDeleteWg = async (wg) => {
    if (!window.confirm(`Warengruppe "${wg.bezeichnung}" deaktivieren?`)) return;
    await api.delete(`/api/v1/artikel/warengruppen/${wg.id}`);
    loadData();
  };

  const handleSelect = (a) => {
    if (onArtikelSelect) onArtikelSelect(a);
  };

  return (
    <div style={{ display: "flex", gap: 0, height: "100%", minHeight: 400 }}>

      {/* ── Warengruppen-Sidebar ── */}
      <div style={{
        width: 190, flexShrink: 0, borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", gap: 2, padding: "8px 0",
      }}>
        {/* Alle */}
        <button
          onClick={() => setAktiveWg(null)}
          style={{
            textAlign: "left", padding: "7px 14px", border: "none", cursor: "pointer",
            background: aktiveWg === null ? "rgba(255,255,255,.07)" : "transparent",
            color: aktiveWg === null ? "var(--ink)" : "var(--ink2)",
            fontSize: ".83rem", fontWeight: aktiveWg === null ? 600 : 400,
            borderRadius: 6, margin: "0 6px",
          }}
        >
          Alle ({artikel.length})
        </button>

        {warengruppen.map((wg) => {
          const count = artikel.filter((a) => a.warengruppe_id === wg.id).length;
          const active = aktiveWg === wg.id;
          return (
            <div key={wg.id} style={{ display: "flex", alignItems: "center", gap: 4, margin: "0 6px" }}>
              <button
                onClick={() => setAktiveWg(active ? null : wg.id)}
                style={{
                  flex: 1, textAlign: "left", padding: "7px 10px", border: "none",
                  cursor: "pointer",
                  background: active ? "rgba(255,255,255,.07)" : "transparent",
                  color: active ? "var(--ink)" : "var(--ink2)",
                  fontSize: ".83rem", fontWeight: active ? 600 : 400, borderRadius: 6,
                  display: "flex", alignItems: "center", gap: 7,
                }}
              >
                <span style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: wg.farbe, flexShrink: 0,
                }} />
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {wg.bezeichnung}
                </span>
                <span style={{ fontSize: ".7rem", color: "var(--ink2)", flexShrink: 0 }}>
                  {count}
                </span>
              </button>
              {isManagement && (
                <button
                  onClick={() => setEditWg(wg)}
                  style={{
                    padding: "4px 5px", border: "none", background: "transparent",
                    color: "var(--ink2)", cursor: "pointer", fontSize: ".72rem",
                    borderRadius: 4,
                  }}
                  title="Bearbeiten"
                >✎</button>
              )}
            </div>
          );
        })}

        {isManagement && (
          <button
            onClick={() => setEditWg({})}
            style={{
              margin: "8px 6px 0", padding: "6px 10px", borderRadius: 6,
              border: "1px dashed var(--border)", background: "transparent",
              color: "var(--ink2)", cursor: "pointer", fontSize: ".76rem",
            }}
          >
            + Neue Warengruppe
          </button>
        )}
      </div>

      {/* ── Artikel-Hauptbereich ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px", borderBottom: "1px solid var(--border)",
        }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Artikel suchen (Name, Art.-Nr., Barcode)…"
            style={{
              flex: 1, padding: "5px 10px", borderRadius: 6,
              border: "1px solid var(--border)", background: "var(--surface)",
              color: "var(--ink)", fontSize: ".82rem",
            }}
          />
          {isManagement && (
            <button
              className="ac-btn ac-btn-primary ac-btn-sm"
              onClick={() => setEditArtikel({})}
            >
              + Artikel
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ padding: "32px 16px", color: "var(--ink2)", fontSize: ".82rem" }}>
            Lade…
          </div>
        ) : artikel.length === 0 ? (
          <div style={{
            padding: "48px 24px", textAlign: "center", color: "var(--ink2)",
            fontSize: ".84rem", lineHeight: 1.7,
          }}>
            {search
              ? `Kein Artikel gefunden für „${search}".`
              : isManagement
                ? 'Noch keine Artikel angelegt. Klicke „+ Artikel" um zu starten.'
                : "Keine Artikel verfügbar."
            }
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 10, padding: 14, overflowY: "auto",
          }}>
            {artikel.map((a) => (
              <ArtikelKarte
                key={a.id}
                a={a}
                mode={mode}
                onEdit={() => setEditArtikel(a)}
                onDelete={() => handleDelete(a)}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {editArtikel !== null && (
        <ArtikelModal
          initial={editArtikel.id ? editArtikel : null}
          warengruppen={warengruppen}
          onSave={() => { setEditArtikel(null); loadData(); }}
          onClose={() => setEditArtikel(null)}
        />
      )}
      {editWg !== null && (
        <WgModal
          initial={editWg.id ? editWg : null}
          onSave={() => { setEditWg(null); loadData(); }}
          onClose={() => setEditWg(null)}
        />
      )}
    </div>
  );
}
