import React from 'react'
import { Link } from 'react-router-dom'

const ENTRIES = [
  {
    version: 'v1.4.0',
    date: 'Mai 2026',
    badge: 'Neu',
    items: [
      'ISS-Sektion auf der Landingpage: interaktive 3D-Raumstation',
      'Smoother Scroll-Animationen im gesamten Onboarding-Flow',
      'Pricing-Karten jetzt direkt mit der Preisseite verknüpft',
    ],
  },
  {
    version: 'v1.3.0',
    date: 'April 2026',
    badge: 'Verbesserung',
    items: [
      'KI-Sekretärin: Antwortvorschläge im E-Mail-Postfach',
      'Kalendermodul: wiederkehrende Aufgaben mit Deadline-Erinnerung',
      'Buchhaltungs-Export jetzt als DATEV-kompatible CSV',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'März 2026',
    badge: 'Sicherheit',
    items: [
      'WebAuthn / Passkey-Unterstützung für passwortlosen Login',
      'Fernet-Verschlüsselung für alle OAuth-Tokens',
      'Rate-Limiting auf allen öffentlichen API-Endpunkten',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'Februar 2026',
    badge: 'Verbesserung',
    items: [
      'Team-Verwaltung: Einladungslinks und Rollenverwaltung',
      'IMAP / Gmail-Integration mit Multi-Account-Unterstützung',
      'Lieferschein-Modul mit PDF-Export',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'Januar 2026',
    badge: 'Launch',
    items: [
      'NILL geht live — alle sechs Kernmodule verfügbar',
      'E-Mail, Buchhaltung, Kalender, Workflows, Zeiterfassung, HR',
      'Hosting in Frankfurt (100 % Ökostrom)',
    ],
  },
]

const BADGE_STYLE = {
  Neu: { background: 'rgba(198,255,60,.15)', color: '#c6ff3c', border: '1px solid rgba(198,255,60,.3)' },
  Verbesserung: { background: 'rgba(56,245,208,.1)', color: '#38f5d0', border: '1px solid rgba(56,245,208,.25)' },
  Sicherheit: { background: 'rgba(122,92,255,.12)', color: '#a78bfa', border: '1px solid rgba(122,92,255,.3)' },
  Launch: { background: 'rgba(255,255,255,.07)', color: '#efede7', border: '1px solid rgba(255,255,255,.15)' },
}

export default function ChangelogPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#02030a', color: '#efede7', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 120px' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(239,237,231,.4)', fontSize: 13, textDecoration: 'none', letterSpacing: '.08em', marginBottom: 56, fontFamily: 'JetBrains Mono, monospace' }}>
          ← NILL.de
        </Link>

        <div style={{ marginBottom: 64 }}>
          <span style={{ display: 'inline-block', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: '#c6ff3c', marginBottom: 16 }}>
            Produkthistorie
          </span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-.025em', margin: 0 }}>
            Changelog
          </h1>
          <p style={{ marginTop: 16, color: 'rgba(239,237,231,.5)', fontSize: 17, lineHeight: 1.6, maxWidth: '48ch' }}>
            Alle Änderungen, Verbesserungen und neuen Features — transparent und lückenlos.
          </p>
        </div>

        <div style={{ position: 'relative', paddingLeft: 28 }}>
          <div style={{ position: 'absolute', left: 0, top: 8, bottom: 0, width: 1, background: 'linear-gradient(to bottom, #c6ff3c, rgba(198,255,60,.1) 80%, transparent)' }} />

          {ENTRIES.map((entry, i) => (
            <div key={entry.version} style={{ position: 'relative', marginBottom: i < ENTRIES.length - 1 ? 56 : 0 }}>
              <div style={{ position: 'absolute', left: -34, top: 4, width: 12, height: 12, borderRadius: '50%', background: i === 0 ? '#c6ff3c' : '#1a1f2e', border: `2px solid ${i === 0 ? '#c6ff3c' : 'rgba(255,255,255,.15)'}`, boxShadow: i === 0 ? '0 0 12px rgba(198,255,60,.6)' : 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, color: '#efede7' }}>{entry.version}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(239,237,231,.35)', letterSpacing: '.08em' }}>{entry.date}</span>
                <span style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', padding: '2px 10px', borderRadius: 99, fontFamily: 'JetBrains Mono, monospace', ...BADGE_STYLE[entry.badge] }}>
                  {entry.badge}
                </span>
              </div>

              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {entry.items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'rgba(239,237,231,.65)', fontSize: 15, lineHeight: 1.55 }}>
                    <span style={{ color: '#c6ff3c', marginTop: 2, flexShrink: 0 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
