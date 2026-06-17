// src/components/accounting/SteuerberaterTab.jsx — Read-only-Zugang für die Steuerkanzlei
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

export default function SteuerberaterTab() {
  const [zugaenge, setZugaenge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [neu, setNeu] = useState({ berater_name: "", berater_email: "", gueltig_tage: 90 });
  const [erstellt, setErstellt] = useState(null);   // { token, ... } — nur einmal sichtbar
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/v1/steuerberater/zugaenge")
      .then(r => setZugaenge(r.data?.zugaenge || []))
      .catch(() => setErr("Zugänge konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const erstellen = async () => {
    setSaving(true); setErr(null);
    try {
      const r = await api.post("/api/v1/steuerberater/zugang", {
        berater_name: neu.berater_name,
        berater_email: neu.berater_email || null,
        gueltig_tage: Number(neu.gueltig_tage) || 90,
      });
      setErstellt(r.data);
      setNeu({ berater_name: "", berater_email: "", gueltig_tage: 90 });
      load();
    } catch (e) { setErr(e?.response?.data?.detail || "Zugang konnte nicht erstellt werden."); }
    finally { setSaving(false); }
  };

  const widerrufen = async (id) => {
    if (!window.confirm("Zugang widerrufen? Die Kanzlei verliert sofort den Zugriff.")) return;
    try { await api.delete(`/api/v1/steuerberater/zugang/${id}`); load(); }
    catch { setErr("Widerruf fehlgeschlagen."); }
  };

  const copy = (text) => navigator.clipboard?.writeText(text).catch(() => {});

  return (
    <div>
      <div style={{ marginBottom: 6 }}>
        <span style={{ fontFamily: "Fraunces,serif", fontSize: "1.1rem", fontWeight: 600 }}>Steuerberater-Zugang</span>
      </div>
      <p style={{ margin: "0 0 16px", fontSize: ".78rem", color: "var(--ink2)", maxWidth: 720 }}>
        Geben Sie Ihrer Steuerkanzlei sicheren Lesezugriff auf Belege, Buchungsjournal, Banktransaktionen
        sowie DATEV- und GoBD-Downloads — ohne eigenes NILL-Konto, ohne Schreibrechte, jederzeit widerrufbar.
      </p>

      {err && <div role="alert" className="ac-alert ac-alert-warn" style={{ marginBottom: 12 }}>{err}</div>}

      {erstellt && (
        <div className="ac-card" style={{ marginBottom: 16, borderColor: "rgba(198,255,60,.35)" }}>
          <div className="ac-section-title" style={{ color: "var(--accent)" }}>Zugang erstellt — Token jetzt kopieren</div>
          <p style={{ fontSize: ".78rem", color: "var(--ink2)", margin: "0 0 10px" }}>
            Dieser Token wird aus Sicherheitsgründen <strong>nicht erneut angezeigt</strong>. Übermitteln Sie ihn
            der Kanzlei auf sicherem Weg (nicht per unverschlüsselter E-Mail).
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <code style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".78rem", padding: "8px 12px", background: "rgba(var(--tint),.05)", borderRadius: 8, wordBreak: "break-all" }}>
              {erstellt.token}
            </code>
            <button className="ac-btn ac-btn-primary ac-btn-sm" onClick={() => copy(erstellt.token)}>Kopieren</button>
            <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => setErstellt(null)}>Schließen</button>
          </div>
          <p style={{ fontSize: ".74rem", color: "var(--ink2)", margin: "10px 0 0" }}>
            Die Kanzlei nutzt den Token an <code>{erstellt.portal_basis_url}</code> — z. B.{" "}
            <code>{erstellt.portal_basis_url}/status?token=…</code> oder als <code>Authorization: Bearer</code>-Header.
            Downloads: <code>/datev-export</code> (EXTF-Buchungsstapel), <code>/gobd-export</code> (ZIP).
          </p>
        </div>
      )}

      <div className="ac-card" style={{ marginBottom: 16 }}>
        <div className="ac-section-title">Neuen Zugang erstellen</div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="ac-form-col" style={{ maxWidth: 220 }}>
            <label className="ac-label">Kanzlei / Name *</label>
            <input className="ac-input" value={neu.berater_name}
              onChange={e => setNeu({ ...neu, berater_name: e.target.value })}/>
          </div>
          <div className="ac-form-col" style={{ maxWidth: 240 }}>
            <label className="ac-label">E-Mail (optional)</label>
            <input className="ac-input" type="email" value={neu.berater_email}
              onChange={e => setNeu({ ...neu, berater_email: e.target.value })}/>
          </div>
          <div className="ac-form-col" style={{ maxWidth: 130 }}>
            <label className="ac-label" htmlFor="stb-tage">Gültigkeit</label>
            <select id="stb-tage" className="ac-select" value={neu.gueltig_tage}
              onChange={e => setNeu({ ...neu, gueltig_tage: e.target.value })}>
              <option value={30}>30 Tage</option>
              <option value={90}>90 Tage</option>
              <option value={180}>180 Tage</option>
              <option value={365}>1 Jahr</option>
            </select>
          </div>
          <button className="ac-btn ac-btn-primary" onClick={erstellen}
            disabled={saving || neu.berater_name.trim().length < 2}>
            {saving ? "…" : "Zugang erstellen"}
          </button>
        </div>
      </div>

      <div className="ac-card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 20, color: "var(--ink2)" }}>Wird geladen…</div>
        ) : zugaenge.length === 0 ? (
          <div style={{ padding: 20, color: "var(--ink2)", fontSize: ".85rem" }}>Noch keine Zugänge erstellt.</div>
        ) : (
          <table className="ac-table" aria-label="Steuerberater-Zugänge">
            <thead>
              <tr><th>Kanzlei</th><th>E-Mail</th><th>Gültig bis</th><th>Status</th><th>Zuletzt genutzt</th><th></th></tr>
            </thead>
            <tbody>
              {zugaenge.map(z => (
                <tr key={z.id}>
                  <td>{z.berater_name}</td>
                  <td>{z.berater_email || "—"}</td>
                  <td>{new Date(z.valid_until).toLocaleDateString("de-DE")}</td>
                  <td>
                    {z.is_revoked
                      ? <span style={{ color: "#f87171" }}>Widerrufen</span>
                      : z.aktiv
                        ? <span style={{ color: "var(--accent)" }}>Aktiv</span>
                        : <span style={{ color: "var(--ink2)" }}>Abgelaufen</span>}
                  </td>
                  <td>{z.last_used_at ? new Date(z.last_used_at).toLocaleString("de-DE") : "—"}</td>
                  <td>
                    {!z.is_revoked && z.aktiv && (
                      <button className="ac-btn ac-btn-ghost ac-btn-sm" onClick={() => widerrufen(z.id)}>Widerrufen</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
