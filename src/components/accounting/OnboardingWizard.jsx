// src/components/accounting/OnboardingWizard.jsx — Onboarding-Assistent (F30)
import React, { useState } from "react";
import api from "../../services/api";

const RECHTSFORMEN = [
  { value: "einzelunternehmen",  label: "Einzelunternehmen / Freiberufler",     desc: "Einkommensteuer (EkSt), Einnahmen-Überschuss-Rechnung (EÜR) möglich, §19 UStG" },
  { value: "gbr",                label: "GbR (Gesellschaft bürgerl. Rechts)",   desc: "Personengesellschaft, Einkommensteuer (EkSt) bei den Gesellschaftern" },
  { value: "kg",                 label: "KG / OHG",                             desc: "Personenhandelsgesellschaft, §238 HGB – Buchführungspflicht" },
  { value: "gmbh",               label: "GmbH",                                 desc: "Körperschaftsteuer (KöSt) 15% + Gewerbesteuer (GewSt), Bilanzpflicht §242 HGB" },
  { value: "ug",                 label: "UG (haftungsbeschränkt)",               desc: "Wie GmbH, Körperschaftsteuer (KöSt), Mindestkapital 1 €" },
  { value: "ag",                 label: "AG",                                    desc: "Körperschaftsteuer (KöSt) + Gewerbesteuer (GewSt), strenge Berichtspflicht §267 HGB" },
];

const UMSATZ_KLASSEN = [
  { value: "unter_22000",    label: "Unter 22.000 € / Jahr",  desc: "Kleinunternehmer §19 UStG möglich" },
  { value: "22000_bis_100k", label: "22.000–100.000 € / Jahr", desc: "Regelbesteuerung, UStVA monatlich/quartalsweise" },
  { value: "ueber_100k",     label: "Über 100.000 € / Jahr",  desc: "Monatliche UStVA, evtl. Dauerfristverlängerung" },
];

const STEPS = ["Rechtsform", "Umsatz", "Buchhaltungsmodus", "Abschluss"];

export default function OnboardingWizard({ onClose, onComplete }) {
  const [step, setStep]     = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm]     = useState({
    rechtsform: "",
    umsatz_klasse: "",
    ist_freiberufler: false,
    ist_kleinunternehmer: false,
    accounting_mode: "einfach",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const isFreiberufler = form.rechtsform === "einzelunternehmen";

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const skip = () => {
    localStorage.setItem("nill_accounting_mode", "einfach");
    localStorage.setItem("nill_onboarding_done", "skipped");
    onClose();
  };

  const [finishError, setFinishError] = useState("");

  const finish = async () => {
    setSaving(true);
    setFinishError("");
    try {
      await api.patch("/api/v1/buchhaltung/unternehmensprofil", {
        rechtsform: form.rechtsform,
        ist_freiberufler: form.ist_freiberufler,
        ist_kleinunternehmer: form.ist_kleinunternehmer,
      });
    } catch (e) {
      const msg = e?.response?.data?.detail || "Profil konnte nicht gespeichert werden.";
      setFinishError(`Hinweis: ${msg} Ihre Einstellungen wurden lokal gespeichert und können in den Einstellungen ergänzt werden.`);
    }
    localStorage.setItem("nill_accounting_mode", form.accounting_mode);
    localStorage.setItem("nill_onboarding_done", "1");
    setSaving(false);
    onComplete?.(form.accounting_mode);
    onClose();
  };

  const canNext = () => {
    if (step === 0) return !!form.rechtsform;
    if (step === 1) return !!form.umsatz_klasse;
    return true;
  };

  return (
    <div className="ac-modal-backdrop" style={{ zIndex: 200 }}>
      <div className="ac-modal" style={{ maxWidth: 520 }}>
        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{
                height: 3, borderRadius: 2,
                background: i <= step ? "var(--accent)" : "var(--border)",
                transition: "background .3s",
              }} />
              <div style={{
                fontSize: ".68rem", color: i === step ? "var(--ink)" : "var(--ink2)",
                marginTop: 5, textAlign: "center",
              }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Step 0: Rechtsform */}
        {step === 0 && (
          <div>
            <div className="ac-modal-title" id="wiz-rf-heading">Welche Rechtsform hat Ihr Unternehmen?</div>
            <div role="group" aria-labelledby="wiz-rf-heading" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {RECHTSFORMEN.map(rf => (
                <label key={rf.value} style={{
                  display: "flex", gap: 12, padding: "12px 16px", borderRadius: 10,
                  border: `1px solid ${form.rechtsform === rf.value ? "var(--accent)" : "var(--border)"}`,
                  background: form.rechtsform === rf.value ? "rgba(198,255,60,.07)" : "transparent",
                  cursor: "pointer", transition: "all .15s",
                }}>
                  <input type="radio" name="rechtsform" value={rf.value}
                    checked={form.rechtsform === rf.value}
                    onChange={() => {
                      set("rechtsform", rf.value);
                      set("ist_freiberufler", rf.value === "einzelunternehmen");
                    }}
                    style={{ accentColor: "var(--accent)", marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{rf.label}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--ink2)", marginTop: 2 }}>{rf.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            {isFreiberufler && (
              <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, cursor: "pointer", fontSize: ".85rem" }}>
                <input type="checkbox" checked={form.ist_freiberufler}
                  onChange={e => set("ist_freiberufler", e.target.checked)}
                  style={{ accentColor: "var(--accent)" }} />
                Ich bin Freiberufler (§ 18 EStG) — keine Gewerbesteuerpflicht
              </label>
            )}
          </div>
        )}

        {/* Step 1: Umsatz */}
        {step === 1 && (
          <div>
            <div className="ac-modal-title" id="wiz-uk-heading">Wie hoch ist Ihr Jahresumsatz?</div>
            <p style={{ fontSize: ".85rem", color: "var(--ink2)", marginBottom: 16 }}>
              Dies beeinflusst den USt-Status und die UStVA-Häufigkeit.
            </p>
            <div role="group" aria-labelledby="wiz-uk-heading" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {UMSATZ_KLASSEN.map(uk => (
                <label key={uk.value} style={{
                  display: "flex", gap: 12, padding: "12px 16px", borderRadius: 10,
                  border: `1px solid ${form.umsatz_klasse === uk.value ? "var(--accent)" : "var(--border)"}`,
                  background: form.umsatz_klasse === uk.value ? "rgba(198,255,60,.07)" : "transparent",
                  cursor: "pointer", transition: "all .15s",
                }}>
                  <input type="radio" name="umsatz_klasse" value={uk.value}
                    checked={form.umsatz_klasse === uk.value}
                    onChange={() => {
                      set("umsatz_klasse", uk.value);
                      set("ist_kleinunternehmer", uk.value === "unter_22000");
                    }}
                    style={{ accentColor: "var(--accent)", marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: ".9rem" }}>{uk.label}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--ink2)", marginTop: 2 }}>{uk.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            {form.umsatz_klasse === "unter_22000" && (
              <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, cursor: "pointer", fontSize: ".85rem" }}>
                <input type="checkbox" checked={form.ist_kleinunternehmer}
                  onChange={e => set("ist_kleinunternehmer", e.target.checked)}
                  style={{ accentColor: "var(--accent)" }} />
                Kleinunternehmerregelung §19 UStG anwenden (keine USt auf Rechnungen)
              </label>
            )}
          </div>
        )}

        {/* Step 2: Buchhaltungsmodus */}
        {step === 2 && (
          <div>
            <div className="ac-modal-title" id="wiz-mode-heading">Welcher Buchhaltungsmodus?</div>
            <p style={{ fontSize: ".85rem", color: "var(--ink2)", marginBottom: 12 }}>
              Sie können den Modus jederzeit wechseln. Der Modus beeinflusst nur die sichtbaren Tabs.
            </p>
            <div style={{ background:"rgba(255,200,0,.07)", border:"1px solid rgba(255,200,0,.25)", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:".82rem", color:"var(--ink2)", lineHeight:1.55 }}>
              <strong style={{ color:"var(--ink)" }}>Wann ist doppelte Buchführung gesetzlich Pflicht?</strong><br/>
              Nach §141 AO ab Umsatz &gt; 600.000 € oder Gewinn &gt; 60.000 € pro Jahr. Freiberufler (§18 EStG) sind grundsätzlich von der Bilanzierungspflicht ausgenommen.
            </div>
            <div role="group" aria-labelledby="wiz-mode-heading" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  value: "einfach", label: "Einfache Buchführung (EÜR)",
                  desc: "Für Freiberufler, Kleingewerbe und Einzelunternehmen. Einnahme-Überschuss-Rechnung (EÜR), keine Bilanzpflicht. Ideal für Umsatz unter 600.000 € / Gewinn unter 60.000 €.",
                  tags: ["§4 Abs. 3 EStG", "Freiberufler", "Kleingewerbe"],
                },
                {
                  value: "doppelt", label: "Doppelte Buchführung (HGB)",
                  desc: "Vollständige doppelte Buchführung mit Journal, Kontenplan, Bilanz und GuV. Für GmbH, AG und alle Unternehmen mit Bilanzierungspflicht. Enthält alle Module.",
                  tags: ["§238 HGB", "GmbH", "AG", "Bilanz"],
                },
              ].map(m => (
                <label key={m.value} style={{
                  display: "flex", gap: 12, padding: "14px 16px", borderRadius: 10,
                  border: `1px solid ${form.accounting_mode === m.value ? "var(--accent)" : "var(--border)"}`,
                  background: form.accounting_mode === m.value ? "rgba(198,255,60,.07)" : "transparent",
                  cursor: "pointer", transition: "all .15s",
                }}>
                  <input type="radio" name="accounting_mode" value={m.value}
                    checked={form.accounting_mode === m.value}
                    onChange={() => set("accounting_mode", m.value)}
                    style={{ accentColor: "var(--accent)", marginTop: 3 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: ".92rem" }}>{m.label}</div>
                    <div style={{ fontSize: ".8rem", color: "var(--ink2)", marginTop: 4, lineHeight: 1.55 }}>{m.desc}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                      {m.tags.map(t => (
                        <span key={t} style={{ padding: "1px 7px", borderRadius: 10, background: "var(--surface2)", fontSize: ".68rem", color: "var(--ink2)" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Abschluss */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}></div>
            <div className="ac-modal-title" style={{ textAlign: "center" }}>Setup abgeschlossen!</div>
            <p style={{ color: "var(--ink2)", fontSize: ".9rem", lineHeight: 1.6, marginBottom: 20 }}>
              Ihr Profil ist konfiguriert. Modus:{" "}
              <strong style={{ color: "var(--ink)" }}>
                {form.accounting_mode === "einfach" ? "Einfache Buchführung (EÜR)" : "Doppelte Buchführung (HGB)"}
              </strong>.
            </p>
            <div style={{
              background: "rgba(198,255,60,.07)", border: "1px solid rgba(198,255,60,.2)",
              borderRadius: 10, padding: "14px 18px", textAlign: "left", fontSize: ".84rem",
              lineHeight: 1.6, color: "var(--ink2)", marginBottom: 20,
            }}>
              <strong style={{ color: "var(--ink)" }}>Nächste Schritte:</strong>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                <li>Erste Rechnung über den Tab <em>Rechnungen</em> erstellen</li>
                <li>Firmenstammdaten unter <em>Steuern → Steuer-Cockpit</em> vervollständigen</li>
                {form.rechtsform !== "einzelunternehmen" && (
                  <li>Geschäftspartner unter dem Tab <em>Geschäftspartner</em> anlegen</li>
                )}
                <li>Belege über den <em>„+ Beleg"-Button</em> oben rechts hochladen</li>
                <li>Setup jederzeit über den <em>„Setup"-Button</em> oben rechts erneut aufrufen</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="ac-modal-footer">
          {step > 0 && (
            <button className="ac-btn ac-btn-ghost" onClick={back}>← Zurück</button>
          )}
          <button className="ac-btn ac-btn-ghost" onClick={skip} style={{ marginRight: "auto" }}>
            Überspringen
          </button>
          {step < STEPS.length - 1 ? (
            <button className="ac-btn ac-btn-primary" onClick={next} disabled={!canNext()}>
              Weiter →
            </button>
          ) : (
            <button className="ac-btn ac-btn-primary" onClick={finish} disabled={saving}>
              {saving ? "…" : "Fertig →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
