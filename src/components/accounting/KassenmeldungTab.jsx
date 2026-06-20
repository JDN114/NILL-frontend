// src/components/accounting/KassenmeldungTab.jsx — Mitteilungspflicht §146a Abs. 4 AO
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

export default function KassenmeldungTab() {
  const [status, setStatus] = useState(null);
  const [vorlage, setVorlage] = useState(null);
  const [meldungen, setMeldungen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ anschaffungsdatum: "", inbetriebnahme_datum: "", tse_bsi_id: "" });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/api/v1/kasse/meldung/status"),
      api.get("/api/v1/kasse/meldung/vorlage"),
      api.get("/api/v1/kasse/meldung"),
    ])
      .then(([s, v, m]) => {
        setStatus(s.data); setVorlage(v.data); setMeldungen(m.data?.meldungen || []);
      })
      .catch(() => setErr("Meldedaten konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const protokollieren = async (art) => {
    setSaving(true); setErr(null);
    try {
      await api.post("/api/v1/kasse/meldung", {
        meldung_art: art,
        status: "gemeldet",
        anschaffungsdatum: form.anschaffungsdatum || null,
        inbetriebnahme_datum: form.inbetriebnahme_datum || null,
        tse_bsi_id: form.tse_bsi_id || null,
      });
      load();
    } catch (e) { setErr(e?.response?.data?.detail || "Protokollierung fehlgeschlagen."); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 20, color: "var(--ink2)" }}>Wird geladen…</div>;

  const faellig = status?.meldung_faellig;

  return (
    <div>
      <div style={{ marginBottom: 6 }}>
        <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>
          Kassenmeldung ans Finanzamt (§146a Abs. 4 AO)
        </span>
      </div>
      <p style={{ margin: "0 0 16px", fontSize: ".78rem", color: "var(--ink2)", maxWidth: 760 }}>
        Seit 1.1.2025 müssen elektronische Kassen mit TSE über „Mein ELSTER&quot; gemeldet werden.
        NILL stellt alle Pflichtangaben vorbefüllt bereit und protokolliert Ihre Meldung als Nachweis.
      </p>

      {err && <div role="alert" className="ac-alert ac-alert-warn" style={{ marginBottom: 12 }}>{err}</div>}

      {/* Compliance-Ampel */}
      <div className="ac-card" style={{ marginBottom: 16, borderColor: faellig ? "rgba(248,113,113,.4)" : "rgba(198,255,60,.25)" }}>
        <div className="ac-section-title" style={{ color: faellig ? "#f87171" : "var(--accent)" }}>
          {faellig ? "⚠ Meldung ausstehend" : status?.kasse_konfiguriert ? "✓ Meldung protokolliert" : "Keine Kasse konfiguriert"}
        </div>
        {faellig && (
          <>
            <p style={{ fontSize: ".82rem", margin: "0 0 6px" }}>{status.frist_hinweis}</p>
            <p style={{ fontSize: ".76rem", color: "#f87171", margin: 0 }}>{status.bussgeld_hinweis}</p>
          </>
        )}
        {!faellig && status?.letzte_meldung && (
          <p style={{ fontSize: ".8rem", color: "var(--ink2)", margin: 0 }}>
            Letzte Meldung: {status.letzte_meldung.meldung_art} am{" "}
            {status.letzte_meldung.gemeldet_am ? new Date(status.letzte_meldung.gemeldet_am).toLocaleDateString("de-DE") : "—"}
          </p>
        )}
      </div>

      {/* Vorbefüllte ELSTER-Daten */}
      {vorlage && (
        <div className="ac-card" style={{ marginBottom: 16 }}>
          <div className="ac-section-title">Ihre Daten für das ELSTER-Formular</div>
          <p style={{ fontSize: ".76rem", color: "var(--ink2)", margin: "0 0 12px" }}>
            Formular: „{vorlage.formular}&quot; — {vorlage.portal}
          </p>
          <table className="ac-table" aria-label="ELSTER-Meldedaten">
            <tbody>
              <tr><td style={{ color: "var(--ink2)" }}>Steuerpflichtiger</td><td>{vorlage.steuerpflichtiger?.name || "—"}</td></tr>
              <tr><td style={{ color: "var(--ink2)" }}>Steuernummer</td><td>{vorlage.steuerpflichtiger?.steuernummer || "— (in den Firmendaten ergänzen)"}</td></tr>
              <tr><td style={{ color: "var(--ink2)" }}>Art des Systems</td><td>{vorlage.aufzeichnungssystem?.art}</td></tr>
              <tr><td style={{ color: "var(--ink2)" }}>Software</td><td>{vorlage.aufzeichnungssystem?.software}</td></tr>
              <tr><td style={{ color: "var(--ink2)" }}>Seriennummer Kasse</td><td>{vorlage.aufzeichnungssystem?.seriennummer || "—"}</td></tr>
              <tr><td style={{ color: "var(--ink2)" }}>TSE-Art</td><td>{vorlage.tse?.art || "—"}</td></tr>
              <tr><td style={{ color: "var(--ink2)" }}>TSE-Seriennummer</td><td>{vorlage.tse?.seriennummer || "—"}</td></tr>
            </tbody>
          </table>
          {vorlage.tse?.hinweis_software_tse && (
            <div className="ac-alert ac-alert-warn" style={{ marginTop: 12, fontSize: ".76rem" }}>
              {vorlage.tse.hinweis_software_tse}
            </div>
          )}
        </div>
      )}

      {/* Meldung protokollieren */}
      <div className="ac-card" style={{ marginBottom: 16 }}>
        <div className="ac-section-title">Meldung protokollieren</div>
        <p style={{ fontSize: ".76rem", color: "var(--ink2)", margin: "0 0 10px" }}>
          Nachdem Sie die Meldung in Mein ELSTER abgegeben haben, hier als Nachweis protokollieren.
        </p>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="ac-form-col" style={{ maxWidth: 160 }}>
            <label className="ac-label">Anschaffungsdatum</label>
            <input className="ac-input" type="date" value={form.anschaffungsdatum}
              onChange={e => setForm({ ...form, anschaffungsdatum: e.target.value })}/>
          </div>
          <div className="ac-form-col" style={{ maxWidth: 160 }}>
            <label className="ac-label">Inbetriebnahme</label>
            <input className="ac-input" type="date" value={form.inbetriebnahme_datum}
              onChange={e => setForm({ ...form, inbetriebnahme_datum: e.target.value })}/>
          </div>
          <div className="ac-form-col" style={{ maxWidth: 220 }}>
            <label className="ac-label">BSI-Zertifizierungs-ID (TSE)</label>
            <input className="ac-input" placeholder="BSI-K-TR-xxxx-xxxx" value={form.tse_bsi_id}
              onChange={e => setForm({ ...form, tse_bsi_id: e.target.value })}/>
          </div>
          <button className="ac-btn ac-btn-primary" onClick={() => protokollieren("anmeldung")} disabled={saving}>
            {saving ? "…" : "Anmeldung protokollieren"}
          </button>
          <button className="ac-btn ac-btn-ghost" onClick={() => protokollieren("abmeldung")} disabled={saving}>
            Abmeldung
          </button>
        </div>
      </div>

      {/* Protokoll */}
      {meldungen.length > 0 && (
        <div className="ac-card" style={{ padding: 0 }}>
          <table className="ac-table" aria-label="Meldungsprotokoll">
            <thead>
              <tr><th>Art</th><th>Status</th><th>Gemeldet am</th><th>TSE-Seriennummer</th></tr>
            </thead>
            <tbody>
              {meldungen.map(m => (
                <tr key={m.id}>
                  <td style={{ textTransform: "capitalize" }}>{m.meldung_art}</td>
                  <td>{m.status}</td>
                  <td>{m.gemeldet_am ? new Date(m.gemeldet_am).toLocaleString("de-DE") : "—"}</td>
                  <td style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".74rem" }}>{m.tse_seriennummer || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
