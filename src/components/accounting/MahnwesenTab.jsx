// src/components/accounting/MahnwesenTab.jsx — Mahnwesen
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const fmtEur = (n) =>
  `${Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const STUFE_META = {
  1: { label: "Zahlungserinnerung", cls: "ac-badge-gray" },
  2: { label: "1. Mahnung",         cls: "ac-badge-purple" },
  3: { label: "Letzte Mahnung",     cls: "ac-badge-pink" },
};

const STATUS_META = {
  erstellt:  { label: "Erstellt",  cls: "ac-badge-gray" },
  versendet: { label: "Versendet", cls: "ac-badge-green" },
};

function SendModal({ mahnung, onClose, onSent }) {
  const [email,  setEmail]  = useState(mahnung.versendet_an || "");
  const [busy,   setBusy]   = useState(false);
  const [error,  setError]  = useState("");

  const send = async () => {
    if (!email.trim()) { setError("Bitte E-Mail-Adresse eingeben."); return; }
    setBusy(true);
    try {
      await api.post(`/api/v1/mahnwesen/mahnung/${mahnung.id}/senden`, { to_email: email.trim() });
      onSent();
      onClose();
    } catch (e) {
      setError(e.response?.data?.detail || "Versand fehlgeschlagen.");
    } finally { setBusy(false); }
  };

  return (
    <div className="ac-modal-backdrop" onClick={onClose}>
      <div className="ac-modal" onClick={e => e.stopPropagation()}>
        <div className="ac-modal-title">Mahnbrief versenden</div>
        {error && <div className="ac-alert ac-alert-err" style={{ marginBottom: 14 }}>{error}</div>}
        <div className="ac-form-col" style={{ marginBottom: 16 }}>
          <label className="ac-label">E-Mail-Adresse *</label>
          <input className="ac-input" type="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder="kunde@beispiel.de" autoFocus />
        </div>
        <div className="ac-modal-footer">
          <button className="ac-btn ac-btn-ghost" onClick={onClose}>Abbrechen</button>
          <button className="ac-btn ac-btn-primary" onClick={send} disabled={busy}>
            {busy ? "Wird versendet…" : "📧 Senden"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MahnwesenTab() {
  const [tab,       setTab]       = useState("mahnungen");
  const [mahnungen, setMahnungen] = useState([]);
  const [ueberfaellig, setUeberfaellig] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [autoMsg,   setAutoMsg]   = useState(null);
  const [busy,      setBusy]      = useState({});
  const [sendModal, setSendModal] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/v1/mahnwesen"),
      api.get("/api/v1/mahnwesen/ueberfaellig"),
    ])
      .then(([m, u]) => {
        setMahnungen(m.data?.mahnungen || []);
        setUeberfaellig(u.data?.rechnungen || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const createMahnung = async (rid) => {
    setBusy(b => ({ ...b, [rid]: true }));
    try {
      await api.post(`/api/v1/mahnwesen/rechnung/${rid}/mahnung`);
      load();
    } catch (e) {
      alert(e.response?.data?.detail || "Fehler beim Erstellen der Mahnung.");
    } finally { setBusy(b => ({ ...b, [rid]: false })); }
  };

  const runAuto = async () => {
    setBusy(b => ({ ...b, auto: true }));
    setAutoMsg(null);
    try {
      const r = await api.post("/api/v1/mahnwesen/auto");
      const d = r.data;
      setAutoMsg({ type: "ok", text: `${d.erstellt ?? 0} Mahnungen erstellt, ${d.fehler ?? 0} Fehler.` });
      load();
    } catch { setAutoMsg({ type: "err", text: "Auto-Mahnlauf fehlgeschlagen." }); }
    finally { setBusy(b => ({ ...b, auto: false })); }
  };

  const downloadPdf = async (mid, rid) => {
    try {
      const r = await api.get(`/api/v1/mahnwesen/mahnung/${mid}/pdf`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([r.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Mahnbrief-${rid || mid}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert("PDF-Download fehlgeschlagen."); }
  };

  if (loading) return <div className="ac-loading"><span className="ac-spinner" />Lade Mahnwesen…</div>;

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        {[["mahnungen", "Mahnungen"], ["ueberfaellig", `Überfällige Rechnungen (${ueberfaellig.length})`]].map(([k, l]) => (
          <button key={k}
            className={`ac-btn ac-btn-sm ${tab === k ? "ac-btn-primary" : "ac-btn-ghost"}`}
            onClick={() => setTab(k)}>{l}</button>
        ))}
        <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={load} style={{ marginLeft: "auto" }}>↺</button>
        <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={runAuto} disabled={busy.auto}>
          {busy.auto ? "…" : "⚡ Auto-Mahnlauf"}
        </button>
      </div>

      {autoMsg && (
        <div className={`ac-alert ${autoMsg.type === "ok" ? "ac-alert-ok" : "ac-alert-err"}`}
          style={{ marginBottom: 14, cursor: "pointer" }} onClick={() => setAutoMsg(null)}>
          {autoMsg.text}
        </div>
      )}

      {tab === "ueberfaellig" && (
        <div className="ac-card" style={{ padding: 0, overflowX: "auto" }}>
          {ueberfaellig.length === 0
            ? <div className="ac-empty">Keine überfälligen Rechnungen.</div>
            : (
              <table className="ac-table">
                <thead>
                  <tr>
                    <th>Rechnungsnr.</th>
                    <th>Empfänger</th>
                    <th>Fällig</th>
                    <th>Überfällig</th>
                    <th>Mahnstufe</th>
                    <th style={{ textAlign: "right" }}>Betrag</th>
                    <th>Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {ueberfaellig.map(r => (
                    <tr key={r.id}>
                      <td className="ac-mono" style={{ fontWeight: 600 }}>{r.rechnungsnummer || `#${r.id}`}</td>
                      <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.empfaenger_name || "—"}
                      </td>
                      <td className="ac-mono">{r.faelligkeitsdatum || "—"}</td>
                      <td className="ac-mono" style={{ color: "var(--a3)" }}>
                        {r.tage_ueberfaellig ?? "?"}d
                      </td>
                      <td>
                        {r.mahnstufe
                          ? <span className={`ac-badge ${(STUFE_META[r.mahnstufe] || {}).cls || "ac-badge-gray"}`}>
                              Stufe {r.mahnstufe}
                            </span>
                          : <span style={{ color: "var(--ink2)", fontSize: ".8rem" }}>—</span>}
                      </td>
                      <td className="ac-mono" style={{ textAlign: "right", fontWeight: 600 }}>
                        {fmtEur(r.brutto_summe)}
                      </td>
                      <td>
                        <button className="ac-btn ac-btn-primary ac-btn-sm"
                          disabled={busy[r.id]}
                          onClick={() => createMahnung(r.id)}>
                          {busy[r.id] ? "…" : "+ Mahnung"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      )}

      {tab === "mahnungen" && (
        <div className="ac-card" style={{ padding: 0, overflowX: "auto" }}>
          {mahnungen.length === 0
            ? <div className="ac-empty">Noch keine Mahnungen erstellt.</div>
            : (
              <table className="ac-table">
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Stufe</th>
                    <th>Status</th>
                    <th>Rechnungs-ID</th>
                    <th style={{ textAlign: "right" }}>Mahngebühr</th>
                    <th style={{ textAlign: "right" }}>Zinsen</th>
                    <th style={{ textAlign: "right" }}>Gesamt</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {mahnungen.map(m => {
                    const sm   = STUFE_META[m.mahnstufe] || STUFE_META[1];
                    const stm  = STATUS_META[m.status]   || STATUS_META.erstellt;
                    return (
                      <tr key={m.id}>
                        <td className="ac-mono">{m.erstellt_am ? m.erstellt_am.slice(0, 10) : "—"}</td>
                        <td><span className={`ac-badge ${sm.cls}`}>{sm.label}</span></td>
                        <td><span className={`ac-badge ${stm.cls}`}>{stm.label}</span></td>
                        <td className="ac-mono" style={{ color: "var(--ink2)" }}>
                          {m.rechnung_id ? `#${m.rechnung_id}` : "—"}
                        </td>
                        <td className="ac-mono" style={{ textAlign: "right" }}>{fmtEur(m.mahngebuehr)}</td>
                        <td className="ac-mono" style={{ textAlign: "right" }}>{fmtEur(m.mahnzinsen)}</td>
                        <td className="ac-mono" style={{ textAlign: "right", fontWeight: 600 }}>
                          {fmtEur(m.gesamtbetrag)}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button className="ac-btn ac-btn-ghost ac-btn-sm"
                              onClick={() => downloadPdf(m.id, m.rechnung_id)}>
                              📄 PDF
                            </button>
                            {m.status === "erstellt" && (
                              <button className="ac-btn ac-btn-primary ac-btn-sm"
                                onClick={() => setSendModal(m)}>
                                📧 Senden
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </div>
      )}

      {sendModal && (
        <SendModal
          mahnung={sendModal}
          onClose={() => setSendModal(null)}
          onSent={load}
        />
      )}

      <div style={{
        marginTop: 20, padding: "12px 16px",
        background: "rgba(122,92,255,.07)", border: "1px solid rgba(122,92,255,.15)",
        borderRadius: 10, fontSize: ".8rem", color: "var(--ink2)", lineHeight: 1.6,
      }}>
        <strong style={{ color: "var(--ink)" }}>§ 288 BGB</strong> Verzugszinsen: 8,62 % p.a.
        (5 % über Basiszinssatz 3,62 %). Mahngebühren: Stufe 1 = 0 €, Stufe 2 = 5 €, Stufe 3 = 15 €.
      </div>
    </div>
  );
}
