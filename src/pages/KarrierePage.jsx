import React from 'react'
import { Link } from 'react-router-dom'

const VALUES = [
  { label: 'Exzellenz', text: 'Wir geben uns nur mit dem Besten zufrieden — in Code, Design und Kundenerlebnis.' },
  { label: 'Autonomie', text: 'Kein Mikromanagement. Du bekommst Verantwortung und den Raum, sie zu tragen.' },
  { label: 'Ehrlichkeit', text: 'Direkte Kommunikation, kein Unternehmens-Speak. Was wir sagen, meinen wir.' },
  { label: 'Wirkung', text: 'Du arbeitest an einem Produkt, das Unternehmen täglich nutzen — echte Auswirkung, kein Theater.' },
]

export default function KarrierePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#02030a', color: '#efede7', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px 120px' }}>

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(239,237,231,.4)', fontSize: 13, textDecoration: 'none', letterSpacing: '.08em', marginBottom: 56, fontFamily: 'JetBrains Mono, monospace' }}>
          ← NILL.de
        </Link>

        <div style={{ marginBottom: 72 }}>
          <span style={{ display: 'inline-block', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: '#c6ff3c', marginBottom: 16 }}>
            Wir bauen etwas Großes
          </span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-.025em', margin: '0 0 20px' }}>
            Karriere bei NILL
          </h1>
          <p style={{ color: 'rgba(239,237,231,.5)', fontSize: 17, lineHeight: 1.65, maxWidth: '52ch', margin: 0 }}>
            NILL ist das KI-Betriebssystem für Unternehmen — gebaut in Deutschland, für den globalen Markt.
            Wir suchen Menschen, die nicht nur mitarbeiten, sondern mitgestalten wollen.
          </p>
        </div>

        <div style={{ marginBottom: 72 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.015em', marginBottom: 28, color: '#efede7' }}>
            Was uns ausmacht
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {VALUES.map(v => (
              <div key={v.label} style={{
                background: 'rgba(255,255,255,.03)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 16,
                padding: '20px 22px',
              }}>
                <div style={{ color: '#c6ff3c', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 10 }}>{v.label}</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'rgba(239,237,231,.55)' }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'rgba(198,255,60,.05)',
          border: '1px solid rgba(198,255,60,.2)',
          borderRadius: 20,
          padding: '36px 40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.015em', marginBottom: 12, marginTop: 0 }}>
            Offene Stellen
          </h2>
          <p style={{ color: 'rgba(239,237,231,.5)', fontSize: 16, lineHeight: 1.6, maxWidth: '44ch', margin: '0 auto 28px' }}>
            Wir sind ein kleines, fokussiertes Team. Aktuell gibt es keine ausgeschriebenen Stellen —
            aber wir freuen uns über Initiative.
          </p>
          <a
            href="mailto:jobs@nillai.de?subject=Initiative-Bewerbung"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#c6ff3c',
              color: '#050505',
              fontWeight: 600,
              fontSize: 14,
              padding: '13px 24px',
              borderRadius: 99,
              textDecoration: 'none',
              letterSpacing: '.01em',
            }}
          >
            Initiative bewerben → jobs@nillai.de
          </a>
        </div>

      </div>
    </div>
  )
}
