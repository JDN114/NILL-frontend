// src/pages/CheckoutPage.jsx
// Öffentliche Checkout-Seite für Endkunden
// §§ 312g, 355 BGB — AGB + Widerrufsbelehrung vor Zahlungsabschluss
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

// Public checkout endpoints routed through the single api.js instance
// (VITE_API_URL baseURL + CSRF + credentials). Normalizes axios errors to the
// { detail } shape the UI already expects.
async function apiFetch(path, { method = "GET", body } = {}) {
  try {
    const res = await api.request({
      url: path,
      method,
      data: body ? JSON.parse(body) : undefined,
    });
    return res.data;
  } catch (e) {
    const detail = e?.response?.data?.detail;
    throw new Error(detail || `HTTP ${e?.response?.status || "Fehler"}`);
  }
}

const fmtEur = (n, currency = "EUR") =>
  Number(n || 0).toLocaleString("de-DE", {
    style: "currency", currency,
    minimumFractionDigits: 2,
  });

// ── Styles (inline, no CSS dependency) ───────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    background: "#f8f9fa",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#1c1c2e",
  },
  header: {
    background: "#1c1c2e",
    color: "#fff",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logo: { fontWeight: 800, fontSize: "1.25rem", letterSpacing: -0.5 },
  container: { maxWidth: 680, margin: "0 auto", padding: "28px 16px 48px" },
  card: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    marginBottom: 20,
    overflow: "hidden",
  },
  cardHead: {
    padding: "14px 20px",
    borderBottom: "1px solid #e2e8f0",
    fontWeight: 700,
    fontSize: ".92rem",
    color: "#1c1c2e",
  },
  cardBody: { padding: "16px 20px" },
  row: { display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: ".88rem" },
  label: { color: "#64748b" },
  value: { fontWeight: 600 },
  total: {
    display: "flex", justifyContent: "space-between",
    fontWeight: 800, fontSize: "1.1rem",
    borderTop: "2px solid #1c1c2e",
    paddingTop: 10, marginTop: 10,
    color: "#1c1c2e",
  },
  legalBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: ".78rem",
    color: "#475569",
    lineHeight: 1.6,
    maxHeight: 180,
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    marginBottom: 14,
  },
  checkbox: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12, cursor: "pointer" },
  checkboxInput: { marginTop: 2, width: 16, height: 16, flexShrink: 0, cursor: "pointer" },
  checkboxLabel: { fontSize: ".88rem", color: "#334155", lineHeight: 1.4 },
  btn: {
    width: "100%",
    padding: "14px 24px",
    background: "#1c1c2e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: 6,
  },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  alert: {
    background: "#fef2f2", border: "1px solid #fca5a5",
    borderRadius: 8, padding: "10px 14px",
    color: "#991b1b", fontSize: ".85rem", marginBottom: 14,
  },
  success: {
    background: "#f0fdf4", border: "1px solid #86efac",
    borderRadius: 12, padding: "28px 24px", textAlign: "center",
  },
  spinner: {
    display: "inline-block", width: 20, height: 20,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff", borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};

// ── Widerruf-Formular ─────────────────────────────────────────────────────────

function WiderrufFormular({ token, verkäufer, onClose }) {
  const [form, setForm] = useState({ kunde_name: "", kunde_email: "", begruendung: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!form.kunde_name.trim() || !form.kunde_email.trim()) {
      setErr("Name und E-Mail sind Pflichtfelder."); return;
    }
    setBusy(true); setErr("");
    try {
      await apiFetch(`/public/zahlen/${token}/widerruf`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      setDone(true);
    } catch (e) {
      setErr(e.message);
    } finally { setBusy(false); }
  };

  const inp = (k) => ({
    style: { width: "100%", boxSizing: "border-box", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: ".88rem", marginTop: 4, marginBottom: 10 },
    value: form[k],
    onChange: (e) => setForm(f => ({ ...f, [k]: e.target.value })),
  });

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>✓</div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Widerruf eingegangen</div>
        <div style={{ fontSize: ".85rem", color: "#64748b" }}>
          Der Verkäufer wurde informiert und muss die Zahlung innerhalb von 14 Tagen erstatten.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Widerruf einreichen (§ 355 BGB)</div>
      {err && <div style={S.alert}>{err}</div>}
      <label style={{ fontSize: ".82rem", color: "#64748b" }}>Ihr Name *</label>
      <input {...inp("kunde_name")} placeholder="Max Mustermann" />
      <label style={{ fontSize: ".82rem", color: "#64748b" }}>Ihre E-Mail *</label>
      <input {...inp("kunde_email")} type="email" placeholder="max@example.de" />
      <label style={{ fontSize: ".82rem", color: "#64748b" }}>Begründung (optional)</label>
      <textarea {...inp("begruendung")} rows={3}
        style={{ ...inp("begruendung").style, resize: "vertical" }}
        placeholder="Grund für den Widerruf…" />
      <div style={{ fontSize: ".76rem", color: "#94a3b8", marginBottom: 12 }}>
        Widerruf-Adresse: {verkäufer?.email || ""}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "9px 0", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer", fontSize: ".88rem" }}>
          Abbrechen
        </button>
        <button onClick={submit} disabled={busy}
          style={{ flex: 1, padding: "9px 0", borderRadius: 6, border: "none", background: "#1c1c2e", color: "#fff", fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", fontSize: ".88rem", opacity: busy ? 0.6 : 1 }}>
          {busy ? "Einreichen…" : "Widerruf einreichen"}
        </button>
      </div>
    </div>
  );
}

// ── Hauptkomponente ───────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [info, setInfo]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState("");
  const [busy, setBusy]       = useState(false);
  const [showWiderruf, setShowWiderruf] = useState(false);

  const [consent, setConsent] = useState({
    agb: false,
    widerruf: false,
    sofort: false,
  });

  const cancelled = searchParams.get("cancelled") === "1";

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch(`/public/zahlen/${token}`);
        setInfo(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const pay = async () => {
    if (!consent.agb) { setErr("Bitte AGB akzeptieren."); return; }
    if (!consent.widerruf && !info.rechtliches?.kein_widerrufsrecht) {
      setErr("Bitte Widerrufsbelehrung zur Kenntnis nehmen."); return;
    }
    setBusy(true); setErr("");
    try {
      const body = {
        agb_akzeptiert:              consent.agb,
        widerrufsbelehrung_gelesen:  consent.widerruf || !!info.rechtliches?.kein_widerrufsrecht,
        sofortleistung_zustimmung:   consent.sofort,
      };
      const { redirect_url } = await apiFetch(`/public/zahlen/${token}/start`, {
        method: "POST", body: JSON.stringify(body),
      });
      window.location.href = redirect_url;
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#1c1c2e", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 12px" }} />
          <div style={{ color: "#64748b" }}>Lade Zahlungsseite…</div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (err && !info) {
    return (
      <div style={S.page}>
        <div style={S.header}><span style={S.logo}>NILL</span></div>
        <div style={S.container}>
          <div style={S.alert}>{err}</div>
        </div>
      </div>
    );
  }

  if (info?.bereits_bezahlt || info?.status === "bezahlt") {
    return (
      <div style={S.page}>
        <div style={S.header}><span style={S.logo}>NILL</span></div>
        <div style={S.container}>
          <div style={S.success}>
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>✓</div>
            <div style={{ fontWeight: 800, fontSize: "1.2rem", marginBottom: 6 }}>Zahlung bereits erhalten</div>
            <div style={{ color: "#64748b" }}>Diese Rechnung wurde bereits bezahlt. Vielen Dank.</div>
          </div>
        </div>
      </div>
    );
  }

  const r   = info?.rechnung || {};
  const v   = info?.verkäufer || {};
  const recht = info?.rechtliches || {};
  const ausnahme_typ = recht.ausnahme_typ || "keine";
  const hasWiderruf = !recht.kein_widerrufsrecht && recht.widerrufsbelehrung;

  const canPay = consent.agb && (consent.widerruf || !hasWiderruf) &&
    (ausnahme_typ !== "sofort_vollzogen" || consent.sofort);

  return (
    <div style={S.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} * { box-sizing: border-box; }`}</style>

      <div style={S.header}>
        <span style={S.logo}>NILL</span>
        <span style={{ color: "#94a3b8", fontSize: ".85rem", marginLeft: "auto" }}>
          Sichere Zahlung
        </span>
      </div>

      <div style={S.container}>

        {cancelled && (
          <div style={{ ...S.alert, background: "#fffbeb", borderColor: "#fcd34d", color: "#92400e", marginBottom: 16 }}>
            Zahlung abgebrochen. Du kannst es erneut versuchen.
          </div>
        )}

        {err && <div style={S.alert}>{err}</div>}

        {/* Verkäufer */}
        <div style={S.card}>
          <div style={S.cardHead}>Verkäufer</div>
          <div style={S.cardBody}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{v.name}</div>
            {v.strasse && <div style={{ color: "#64748b", fontSize: ".88rem" }}>{v.strasse}</div>}
            {v.plz_ort && <div style={{ color: "#64748b", fontSize: ".88rem" }}>{v.plz_ort}</div>}
            {v.email   && <div style={{ color: "#64748b", fontSize: ".85rem", marginTop: 4 }}>{v.email}</div>}
          </div>
        </div>

        {/* Rechnungsdetails */}
        <div style={S.card}>
          <div style={S.cardHead}>
            {r.betreff || `Rechnung ${r.rechnungsnummer || ""}`}
          </div>
          <div style={S.cardBody}>
            {r.rechnungsdatum && (
              <div style={S.row}>
                <span style={S.label}>Datum</span>
                <span>{r.rechnungsdatum}</span>
              </div>
            )}
            {(r.positionen || []).length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {r.positionen.map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: ".86rem", paddingBottom: 4, borderBottom: "1px solid #f1f5f9", marginBottom: 4 }}>
                    <span style={{ flex: 1, paddingRight: 12 }}>
                      {p.bezeichnung}
                      {p.menge !== 1 && <span style={{ color: "#94a3b8" }}> × {p.menge} {p.einheit}</span>}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {fmtEur(p.netto * (1 + p.ust_satz / 100), r.waehrung || "EUR")}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div style={S.row}>
              <span style={S.label}>Netto</span>
              <span>{fmtEur(r.netto_summe, r.waehrung)}</span>
            </div>
            <div style={S.row}>
              <span style={S.label}>MwSt.</span>
              <span>{fmtEur(r.ust_betrag, r.waehrung)}</span>
            </div>
            <div style={S.total}>
              <span>Gesamtbetrag</span>
              <span>{fmtEur(r.brutto_summe, r.waehrung)}</span>
            </div>
          </div>
        </div>

        {/* Rechtliches / Checkout */}
        {!showWiderruf && (
          <div style={S.card}>
            <div style={S.cardHead}>AGB & Widerrufsbelehrung</div>
            <div style={S.cardBody}>

              {/* AGB */}
              {recht.agb_text ? (
                <>
                  <div style={{ fontSize: ".78rem", color: "#64748b", marginBottom: 4 }}>Allgemeine Geschäftsbedingungen</div>
                  <div style={S.legalBox}>{recht.agb_text}</div>
                </>
              ) : (
                <div style={{ fontSize: ".82rem", color: "#94a3b8", marginBottom: 14 }}>
                  Keine gesonderten AGB des Verkäufers hinterlegt.
                </div>
              )}

              {/* Widerrufsbelehrung */}
              {hasWiderruf && (
                <>
                  <div style={{ fontSize: ".78rem", color: "#64748b", marginBottom: 4 }}>Widerrufsbelehrung</div>
                  <div style={S.legalBox}>{recht.widerrufsbelehrung}</div>
                </>
              )}

              {/* Ausnahme-Hinweis */}
              {recht.ausnahme_hinweis && (
                <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 6, padding: "10px 12px", fontSize: ".8rem", color: "#78350f", marginBottom: 14 }}>
                  {recht.ausnahme_hinweis}
                </div>
              )}

              {/* Checkboxen */}
              <label style={S.checkbox}>
                <input type="checkbox" style={S.checkboxInput}
                  checked={consent.agb}
                  onChange={e => setConsent(c => ({ ...c, agb: e.target.checked }))} />
                <span style={S.checkboxLabel}>
                  Ich habe die AGB des Verkäufers gelesen und akzeptiere diese. *
                </span>
              </label>

              {hasWiderruf && (
                <label style={S.checkbox}>
                  <input type="checkbox" style={S.checkboxInput}
                    checked={consent.widerruf}
                    onChange={e => setConsent(c => ({ ...c, widerruf: e.target.checked }))} />
                  <span style={S.checkboxLabel}>
                    Ich habe die Widerrufsbelehrung zur Kenntnis genommen.
                    Mir ist bekannt, dass ich das Recht habe, innerhalb von 14 Tagen
                    ohne Angabe von Gründen zu widerrufen (§ 355 BGB). *
                  </span>
                </label>
              )}

              {ausnahme_typ === "sofort_vollzogen" && (
                <label style={S.checkbox}>
                  <input type="checkbox" style={S.checkboxInput}
                    checked={consent.sofort}
                    onChange={e => setConsent(c => ({ ...c, sofort: e.target.checked }))} />
                  <span style={S.checkboxLabel}>
                    Ich stimme ausdrücklich zu, dass mit der Ausführung sofort begonnen wird,
                    und nehme zur Kenntnis, dass mein Widerrufsrecht mit vollständiger
                    Erbringung der Leistung erlischt (§ 356 Abs. 4 BGB). *
                  </span>
                </label>
              )}

              <div style={{ fontSize: ".75rem", color: "#94a3b8", marginBottom: 16 }}>
                * Pflichtfelder. Ihre Zustimmung wird mit Zeitstempel protokolliert (§ 312f BGB).
              </div>

              <button
                onClick={pay}
                disabled={busy || !canPay}
                style={{
                  ...S.btn,
                  ...(busy || !canPay ? S.btnDisabled : {}),
                  background: canPay ? "#1c1c2e" : "#94a3b8",
                }}
              >
                {busy ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <span style={S.spinner} />
                    Weiterleitung zur Zahlung…
                  </span>
                ) : (
                  `Jetzt kaufen (${fmtEur(r.brutto_summe, r.waehrung)} zahlungspflichtig)`
                )}
              </button>

              {hasWiderruf && !recht.kein_widerrufsrecht && (
                <div style={{ textAlign: "center", marginTop: 14 }}>
                  <button
                    onClick={() => setShowWiderruf(true)}
                    style={{ background: "none", border: "none", color: "#64748b", fontSize: ".8rem", cursor: "pointer", textDecoration: "underline" }}>
                    Widerruf einreichen
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {showWiderruf && (
          <div style={S.card}>
            <div style={S.cardBody}>
              <WiderrufFormular token={token} verkäufer={v} onClose={() => setShowWiderruf(false)} />
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", fontSize: ".75rem", color: "#94a3b8", marginTop: 16 }}>
          Abgesichert durch <strong>NILL</strong> · Stripe-Zahlung
        </div>
      </div>
    </div>
  );
}
