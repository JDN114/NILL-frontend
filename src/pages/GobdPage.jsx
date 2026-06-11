import React from 'react'
import LegalLayout from '../components/LegalLayout'

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
]

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
]

export default function GobdPage() {
  return (
    <LegalLayout title="So ist NILL GoBD-konform">
      <p style={{ color: 'rgba(239,237,231,.6)', fontSize: 16, lineHeight: 1.7, marginBottom: 16, marginTop: 0 }}>
        Die <strong style={{ color: '#efede7' }}>GoBD</strong> („Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung
        von Büchern, Aufzeichnungen und Unterlagen in elektronischer Form sowie zum Datenzugriff", BMF-Schreiben vom
        28.11.2019) sind der Maßstab, an dem das Finanzamt jede digitale Buchführung misst. Wer dagegen verstößt,
        riskiert Hinzuschätzungen bei der Betriebsprüfung.
      </p>
      <p style={{ color: 'rgba(239,237,231,.6)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
        NILL wurde von Grund auf entlang dieser Anforderungen gebaut — nicht nachträglich „GoBD-ready" gemacht.
        Hier ist, wie jede Anforderung konkret umgesetzt ist.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
        {PILLARS.map(p => (
          <div key={p.title} style={{
            background: 'rgba(255,255,255,.03)',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 16,
            padding: '22px 24px',
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: '#efede7' }}>{p.title}</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'rgba(239,237,231,.5)' }}>{p.text}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 600, color: '#efede7', margin: '0 0 16px' }}>
        GoBD-Anforderungen im Überblick
      </h2>
      <div style={{ overflowX: 'auto', marginBottom: 48 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,.15)', color: '#efede7' }}>Anforderung (GoBD)</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,.15)', color: '#efede7' }}>Umsetzung in NILL</th>
            </tr>
          </thead>
          <tbody>
            {CHECKLIST.map(([req, impl]) => (
              <tr key={req}>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,.06)', color: 'rgba(239,237,231,.7)', verticalAlign: 'top' }}>{req}</td>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,.06)', color: 'rgba(239,237,231,.5)', verticalAlign: 'top' }}>✓ {impl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        background: 'rgba(255,255,255,.03)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 16,
        padding: '22px 24px',
        marginBottom: 40,
      }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: '#efede7' }}>Wichtig zu wissen</h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'rgba(239,237,231,.5)' }}>
          Es gibt keine offizielle „GoBD-Zertifizierung" durch die Finanzverwaltung — entsprechende Werbeversprechen
          anderer Anbieter sind rechtlich ohne Bindungswirkung (GoBD Rz. 179 ff.). GoBD-Konformität entsteht immer aus
          dem Zusammenspiel von Software <em>und</em> ihrer korrekten Nutzung: zeitnahe Belegerfassung, regelmäßige
          Festschreibung und eine aktuelle Verfahrensdokumentation. NILL nimmt Ihnen davon so viel wie technisch
          möglich ab — die Verfahrensdokumentation erstellt das System automatisch, Festschreibung und Fristen
          überwacht es für Sie.
        </p>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 32, marginTop: 8 }}>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(239,237,231,.5)', margin: 0 }}>
          Fragen zur GoBD-Umsetzung oder zur Betriebsprüfung mit NILL? Schreiben Sie uns —
          wir stellen Prüfern und Steuerberatern gern alle technischen Details bereit.
        </p>
      </div>
    </LegalLayout>
  )
}
