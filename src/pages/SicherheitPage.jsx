import React from 'react'
import LegalLayout from '../components/LegalLayout'

const PILLARS = [
  {
    icon: '🔐',
    title: 'Ende-zu-Ende-Verschlüsselung',
    text: 'Alle Daten werden in Transit mit TLS 1.3 verschlüsselt. OAuth-Tokens und TOTP-Secrets werden mit Fernet (AES-128-CBC + HMAC-SHA256) verschlüsselt im Speicher abgelegt.',
  },
  {
    icon: '🏠',
    title: 'Hosting in Deutschland',
    text: 'NILL läuft ausschließlich auf Servern in Frankfurt am Main. Kein Drittanbieter außerhalb der EU hat Zugriff auf Kundendaten.',
  },
  {
    icon: '🛡️',
    title: 'DSGVO-konform',
    text: 'Alle Datenverarbeitungen basieren auf einer Rechtsgrundlage nach Art. 6 DSGVO. Auftragsverarbeitungsverträge (AVV) werden auf Anfrage bereitgestellt.',
  },
  {
    icon: '🔑',
    title: 'Passwortloser Login (Passkeys)',
    text: 'NILL unterstützt WebAuthn / FIDO2. Statt Passwörtern kannst du biometrische Schlüssel oder Hardware-Tokens verwenden.',
  },
  {
    icon: '⏱️',
    title: 'Rate-Limiting & Brute-Force-Schutz',
    text: 'Alle öffentlichen Endpunkte sind durch Rate-Limiting geschützt. Fehlgeschlagene Login-Versuche werden nach fünf Versuchen temporär gesperrt.',
  },
  {
    icon: '📋',
    title: 'Audit-Logs',
    text: 'Sicherheitsrelevante Aktionen (Login, Einladungen, Datenexporte) werden protokolliert und können auf Anfrage eingesehen werden.',
  },
]

export default function SicherheitPage() {
  return (
    <LegalLayout title="Sicherheit">
      <p style={{ color: 'rgba(239,237,231,.6)', fontSize: 16, lineHeight: 1.7, marginBottom: 40, marginTop: 0 }}>
        NILL verarbeitet sensible Unternehmensdaten. Sicherheit ist kein Feature — sie ist die Grundlage.
        Hier findest du einen Überblick über unsere wichtigsten Sicherheitsmaßnahmen.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
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

      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 32, marginTop: 8 }}>
        <h3 style={{ color: '#efede7', marginTop: 0, fontSize: 18 }}>Sicherheitslücke melden</h3>
        <p style={{ color: 'rgba(239,237,231,.55)', fontSize: 15, lineHeight: 1.7 }}>
          Hast du eine Sicherheitslücke gefunden? Bitte melde sie vertraulich an{' '}
          <a href="mailto:security@nillai.de" style={{ color: '#c6ff3c', textDecoration: 'none' }}>security@nillai.de</a>.
          Wir bestätigen deinen Bericht innerhalb von 48 Stunden und arbeiten an einer Lösung.
          Responsible Disclosure wird von uns ausdrücklich gewürdigt.
        </p>
      </div>
    </LegalLayout>
  )
}
