import React from 'react';
import LegalLayout from '../components/LegalLayout';

const ink    = '#efede7';
const inkDim = 'rgba(239,237,231,0.5)';
const line   = 'rgba(239,237,231,0.07)';
const accent = '#c6ff3c';
const serif  = "'Fraunces','Iowan Old Style',Georgia,serif";
const mono   = "'JetBrains Mono',monospace";

const cardStyle = {
  background: 'linear-gradient(180deg,#0c0d08,#070805)',
  border: `1px solid rgba(198,255,60,0.1)`,
  borderRadius: 20,
  padding: '22px 24px',
};

const h2Style = {
  fontFamily: serif, fontWeight: 400,
  fontSize: 26, letterSpacing: '-0.015em',
  color: ink, margin: '0 0 16px',
};

const h3Style = {
  fontFamily: serif, fontWeight: 400,
  fontSize: 17, letterSpacing: '-0.01em',
  color: ink, margin: '0 0 8px',
};

const PILLARS = [
  {
    icon: '🔒',
    title: 'Unveränderlichkeit (§146 Abs. 4 AO)',
    text: 'Festgeschriebene Buchungen können in NILL technisch nicht mehr geändert oder gelöscht werden — Datenbank-Trigger verhindern das auch auf Systemebene. Korrekturen erfolgen ausschließlich über dokumentierte Stornobuchungen. Jeder Buchungssatz trägt einen HMAC-SHA256-Integritätshash.',
  },
  {
    icon: '🧾',
    title: 'Lückenlose Journale',
    text: 'Jede Buchung erhält eine fortlaufende Journalnummer (GoBD Rz. 51). Soll und Haben müssen je Buchungssatz ausgeglichen sein — unvollständige Buchungen werden vom System abgelehnt. Eingangs- wie Ausgangsrechnungen sind durchgängig mit Buchungssätzen verknüpft.',
  },
  {
    icon: '📜',
    title: 'Nachvollziehbarkeit & Audit-Trail',
    text: 'Jede Änderung an buchführungsrelevanten Daten landet in einem Audit-Log: wer, wann, was, warum. Die nach GoBD Rz. 151 ff. geforderte Verfahrensdokumentation generiert NILL automatisch aus der tatsächlichen Systemkonfiguration — immer aktuell, nie veraltet.',
  },
  {
    icon: '🗄️',
    title: 'Aufbewahrung 10 Jahre (§147 AO)',
    text: 'Belege werden revisionssicher archiviert; Löschversuche innerhalb der gesetzlichen Aufbewahrungsfrist werden durch Datenbank-Trigger blockiert. Zusätzlich erstellt NILL monatliche GoBD-Archiv-Snapshots mit dauerhafter Aufbewahrung.',
  },
  {
    icon: '🔍',
    title: 'Datenzugriff Z1 / Z2 / Z3 (§147 Abs. 6 AO)',
    text: 'Für die Betriebsprüfung bietet NILL alle drei Zugriffsarten: einen zeitlich begrenzten read-only Prüferzugang (Z1), Auswertungen im System (Z2) und die Datenträgerüberlassung (Z3) als ZIP-Export nach dem Beschreibungsstandard der Finanzverwaltung — direkt einlesbar in IDEA & Co., inklusive SHA-256-Prüfsummen-Manifest.',
  },
  {
    icon: '💶',
    title: 'Kassenführung & TSE (§146a AO)',
    text: 'Anbindung zertifizierter technischer Sicherheitseinrichtungen (Swissbit, Deutsche Fiskal, VariConnect), DSFinV-K-Export für die Kassennachschau und Unterstützung der Mitteilungspflicht nach §146a Abs. 4 AO — mit vorbefüllten ELSTER-Meldedaten und Fristen-Überwachung.',
  },
  {
    icon: '📧',
    title: 'E-Rechnung & Formate',
    text: 'ZUGFeRD/Factur-X (EN 16931), XRechnung und UBL 2.1 — NILL erzeugt und verarbeitet strukturierte E-Rechnungen und erfüllt damit die seit 2025 geltende E-Rechnungspflicht im B2B-Geschäft. Girocode (EPC-QR) auf jeder Rechnung beschleunigt den Zahlungseingang.',
  },
  {
    icon: '⏱️',
    title: 'Zeitnahe & vollständige Erfassung',
    text: 'Belege kommen per Foto, E-Mail-Postfach oder Upload automatisch ins System — die KI extrahiert Beträge, Steuersätze und schlägt das passende SKR03-Konto vor. So gelingt die von den GoBD geforderte zeitnahe Erfassung (Rz. 45 ff.) ohne Mehraufwand.',
  },
  {
    icon: '🤝',
    title: 'Steuerberater-Anbindung',
    text: 'DATEV-Buchungsstapel (EXTF), DATEV-Lohn-Bewegungsdaten und ein sicherer read-only Kanzlei-Zugang mit eigenem Token — Ihr Steuerberater arbeitet direkt mit Ihren Daten, ohne dass Sie etwas exportieren oder per E-Mail verschicken müssen.',
  },
  {
    icon: '🚗',
    title: 'Elektronisches Fahrtenbuch',
    text: 'Finanzamtskonform nach §8 Abs. 2 EStG: lückenlose Kilometerstände, Fahrten nach Erfassung unveränderlich, Korrekturen nur per dokumentiertem Storno, SHA-256-Hash-Kette gegen Manipulation — inklusive PDF-Export für die Prüfung.',
  },
];

const CHECKLIST = [
  ['Nachvollziehbarkeit & Nachprüfbarkeit (Rz. 30 ff.)', 'Audit-Log, Hash-Ketten, Beleg-Buchung-Verknüpfung'],
  ['Vollständigkeit (Rz. 36 ff.)', 'Lückenlose Journalnummern, Pflichtfeld-Validierung, Soll=Haben-Prüfung'],
  ['Richtigkeit (Rz. 44)', 'Automatische USt-Logik (19/7 %, §13b, §19, OSS), VIES-USt-ID-Prüfung'],
  ['Zeitgerechte Erfassung (Rz. 45 ff.)', 'KI-Belegerfassung per Foto & E-Mail, Bank-Sync, Erfassungszeitstempel'],
  ['Ordnung (Rz. 53 ff.)', 'SKR03/SKR04-Kontenrahmen, Kontierungsvorschläge, Belegarchiv mit Volltextsuche'],
  ['Unveränderbarkeit (Rz. 58 ff., §146 Abs. 4 AO)', 'Festschreibung, Storno-Prinzip, DB-Trigger gegen UPDATE/DELETE, HMAC-Hashes'],
  ['Aufbewahrung (Rz. 113 ff., §147 AO)', '10-Jahres-Archiv, Löschschutz-Trigger, monatliche Archiv-Snapshots'],
  ['Datenzugriff (Rz. 158 ff., §147 Abs. 6 AO)', 'Prüferzugang (Z1), Systemauswertungen (Z2), Export nach Beschreibungsstandard (Z3)'],
  ['Verfahrensdokumentation (Rz. 151 ff.)', 'Automatisch generiert aus der realen Systemkonfiguration'],
  ['Kassenführung (§146a AO, KassenSichV)', 'TSE-Anbindung, DSFinV-K-Export, §146a Abs. 4-Meldeassistent'],
];

export default function GobdPage() {
  return (
    <LegalLayout title="So ist NILL GoBD-konform">

      <p style={{ color: inkDim, fontSize: 15, lineHeight: 1.75, marginBottom: 12, marginTop: 0 }}>
        Die <strong style={{ color: ink }}>GoBD</strong> („Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung
        von Büchern, Aufzeichnungen und Unterlagen in elektronischer Form sowie zum Datenzugriff",
        BMF-Schreiben vom 28.11.2019) sind der Maßstab, an dem das Finanzamt jede digitale
        Buchführung misst. Wer dagegen verstößt, riskiert Hinzuschätzungen bei der Betriebsprüfung.
      </p>
      <p style={{ color: inkDim, fontSize: 15, lineHeight: 1.75, marginBottom: 44 }}>
        NILL wurde von Grund auf entlang dieser Anforderungen gebaut — nicht nachträglich
        „GoBD-ready" gemacht. Hier ist, wie jede Anforderung konkret umgesetzt ist.
      </p>

      {/* Pillar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16, marginBottom: 52 }}>
        {PILLARS.map(p => (
          <div key={p.title} style={cardStyle}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>{p.icon}</div>
            <h3 style={h3Style}>{p.title}</h3>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: inkDim }}>{p.text}</p>
          </div>
        ))}
      </div>

      {/* Checklist table */}
      <h2 style={h2Style}>GoBD-Anforderungen im Überblick</h2>
      <div style={{ overflowX: 'auto', marginBottom: 48 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px 14px', borderBottom: `1px solid rgba(239,237,231,0.15)`, color: ink, fontWeight: 500 }}>
                Anforderung (GoBD)
              </th>
              <th style={{ textAlign: 'left', padding: '10px 14px', borderBottom: `1px solid rgba(239,237,231,0.15)`, color: ink, fontWeight: 500 }}>
                Umsetzung in NILL
              </th>
            </tr>
          </thead>
          <tbody>
            {CHECKLIST.map(([req, impl]) => (
              <tr key={req}>
                <td style={{ padding: '10px 14px', borderBottom: `1px solid ${line}`, color: inkDim, verticalAlign: 'top' }}>{req}</td>
                <td style={{ padding: '10px 14px', borderBottom: `1px solid ${line}`, color: inkDim, verticalAlign: 'top' }}>
                  <span style={{ color: accent, marginRight: 6 }}>✓</span>{impl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note card */}
      <div style={{
        background: 'linear-gradient(180deg,#0a0a0e,#060609)',
        border: `1px solid ${line}`,
        borderRadius: 20, padding: '22px 24px', marginBottom: 40,
      }}>
        <h3 style={h3Style}>Wichtig zu wissen</h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: inkDim }}>
          Es gibt keine offizielle „GoBD-Zertifizierung" durch die Finanzverwaltung — entsprechende
          Werbeversprechen anderer Anbieter sind rechtlich ohne Bindungswirkung (GoBD Rz. 179 ff.).
          GoBD-Konformität entsteht immer aus dem Zusammenspiel von Software{' '}
          <em style={{ color: ink }}>und</em> ihrer korrekten Nutzung: zeitnahe Belegerfassung,
          regelmäßige Festschreibung und eine aktuelle Verfahrensdokumentation. NILL nimmt Ihnen
          davon so viel wie technisch möglich ab — die Verfahrensdokumentation erstellt das System
          automatisch, Festschreibung und Fristen überwacht es für Sie.
        </p>
      </div>

      {/* Contact note */}
      <div style={{ borderTop: `1px solid ${line}`, paddingTop: 28, marginTop: 8 }}>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: inkDim, margin: 0 }}>
          Fragen zur GoBD-Umsetzung oder zur Betriebsprüfung mit NILL? Schreiben Sie uns —{' '}
          <a href="mailto:info@nillai.de" style={{ color: accent, textDecoration: 'none' }}>info@nillai.de</a>
        </p>
      </div>

    </LegalLayout>
  );
}
