import { useRef, useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import '../../styles/sustainability.css'

/* ──────────────────────────────────────────────────────────────
   SustainabilitySection (v3 — ehrlich & belegbar)
   ──────────────────────────────────────────────────────────────
   Grundregel dieser Sektion: JEDE Zahl ist entweder
   (a) eine belegte Anbieter-/Fachquelle (Quellen unten verlinkt) oder
   (b) eine klar gekennzeichnete Schätzung ("geschätzt", "≈", "Ø").
   Nichts wird als eigene Messung ausgegeben, die es nicht gibt.

   Bewusst ENTFERNT gegenüber v2 (waren erfunden / nicht belegbar):
   • "Live Power Mix Frankfurt" (waren Math.random-Balken)
   • "Public Carbon Ledger 247 t" (war ein hochzählender Timer)
   • Offset-Ledger mit Zertifikat-Seriennummern + Namen echter Dritter
   • "CO₂-neutral", "100 % Ökostrom (eigene Leistung)", "105 % Überkompensation"
   • "1,7 g/Anfrage gemessen", "62 % Vektor-Cache", "28 kg/Mitarbeiter gespart"

   Reale Infrastruktur (Stand Code): Backend → Hetzner (DE),
   Frontend → Vercel, KI → OpenAI-API (gpt-4o-mini). Die KI-Inferenz
   läuft extern; ihr Fußabdruck kann von uns nur geschätzt, nicht
   gemessen werden.
   ────────────────────────────────────────────────────────────── */

/* ── Belegte Kernwerte (Quellen siehe SOURCES unten) ──────────── */
const GRID_G_PER_KWH = 363          // dt. Strommix 2024, UBA (Verbrauch)
const REQ_WH_LOW  = 0.24            // Google: Median Gemini-Textanfrage
const REQ_WH_HIGH = 0.34            // OpenAI/Altman: Ø ChatGPT-Anfrage
const PAPER_G_PER_SHEET = 4.7       // A4-Blatt, Herstellung (ISO/PAS/CEPI 4,29–4,74)
// Geschätzter CO₂-Wert einer kurzen KI-Anfrage am dt. Netz:
//   0,24–0,34 Wh × 0,363 g/Wh ≈ 0,09–0,12 g  → gerundet ≈ 0,1 g
const REQ_G_EST = ((REQ_WH_LOW + REQ_WH_HIGH) / 2) * (GRID_G_PER_KWH / 1000)

const de = (n, d = 0) => n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d })

/* Triggert ~120px bevor das Element den Viewport erreicht */
function useReveal(threshold = 0) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect() }
    }, { threshold, rootMargin: '0px 0px 120px 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return [ref, vis]
}

function Rev({ className = '', children }) {
  const [ref, vis] = useReveal()
  return (
    <div ref={ref} className={`reveal${vis ? ' in' : ''} ${className}`}>
      {children}
    </div>
  )
}

/* Smooth count-up triggered on scroll */
function useCountUp(target, { duration = 1000, decimals = 0, start = 0 } = {}) {
  const [val, setVal] = useState(start)
  const [ref, vis] = useReveal()
  useEffect(() => {
    if (!vis) return
    const t0 = performance.now()
    let raf = 0
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(start + (target - start) * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [vis, target, duration, start])
  return [ref, de(val, decimals)]
}

/* ── Floating leaves (CSS-only, randomized positions) ── */
function LeafParticles({ count = 14 }) {
  const leaves = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        left: Math.random() * 100,
        size: 14 + Math.random() * 18,
        delay: -Math.random() * 22,
        duration: 18 + Math.random() * 16,
        dim: i % 3 === 0,
      })
    }
    return arr
  }, [count])

  return (
    <div className="nh2-leaves" aria-hidden="true">
      {leaves.map((l, i) => (
        <svg
          key={i}
          className={`nh2-leaf${l.dim ? ' dim' : ''}`}
          style={{
            left: `${l.left}%`,
            width: l.size, height: l.size,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
          }}
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M12 2c-5 3-7 7-7 11 0 4 3 8 7 9 4-1 7-5 7-9 0-4-2-8-7-11Zm0 4c2 2 3 4 3 7s-1 5-3 6c-2-1-3-3-3-6s1-5 3-7Z"/>
        </svg>
      ))}
    </div>
  )
}

/* ── Animated growing plant SVG ──────────────────────── */
function GrowingPlant({ play = true }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" style={{overflow:'visible'}}>
      <defs>
        <linearGradient id="nh2-stem" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#1a5b3a"/>
          <stop offset="1" stopColor="#A4F77E"/>
        </linearGradient>
        <radialGradient id="nh2-leafG" cx=".3" cy=".2">
          <stop offset="0" stopColor="#C6FF3C"/>
          <stop offset=".6" stopColor="#40E5C8"/>
          <stop offset="1" stopColor="#1a8060"/>
        </radialGradient>
        <filter id="nh2-soft"><feGaussianBlur stdDeviation=".4"/></filter>
      </defs>

      <path d="M40 200 Q120 192 200 200" stroke="rgba(64,229,200,.25)" strokeWidth="1" strokeDasharray="2 4"/>

      <path
        d="M120 200 Q118 160 122 130 Q126 95 120 60"
        stroke="url(#nh2-stem)" strokeWidth="3.5"
        strokeLinecap="round" fill="none"
        style={{
          strokeDasharray: 200,
          strokeDashoffset: 200,
          animation: play ? 'nh2grow 1.5s .15s cubic-bezier(.16,1,.3,1) forwards' : 'none',
        }}
      />

      {[
        {d:'M122 130 Q145 118 165 122 Q150 138 122 134 Z', delay:0.8, ox:122, oy:130},
        {d:'M120 100 Q98 90 80 96 Q95 112 122 108 Z',      delay:1.0, ox:120, oy:100},
        {d:'M121 80 Q140 70 156 76 Q142 92 121 86 Z',      delay:1.2, ox:121, oy:80},
        {d:'M120 60 Q108 44 96 38 Q98 62 116 66 Z',        delay:1.4, ox:120, oy:60},
      ].map((leaf, i) => (
        <path key={i}
          d={leaf.d}
          fill="url(#nh2-leafG)"
          filter="url(#nh2-soft)"
          style={{
            transformOrigin: `${leaf.ox}px ${leaf.oy}px`,
            transformBox:'fill-box',
            opacity:0, transform:'scale(0)',
            animation: play ? `nh2leaf .6s ${leaf.delay}s cubic-bezier(.34,1.42,.64,1) forwards` : 'none',
          }}
        />
      ))}

      {[[100,40],[140,46],[120,28]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2" fill="#C6FF3C"
          style={{
            opacity:0,
            animation: play ? `nh2spark 2.4s ${1.8+i*0.2}s ease-in-out infinite` : 'none',
          }}
        />
      ))}

      <style>{`
        @keyframes nh2grow{to{stroke-dashoffset:0}}
        @keyframes nh2leaf{
          0%{opacity:0;transform:scale(0) rotate(-20deg)}
          70%{opacity:1;transform:scale(1.06) rotate(2deg)}
          100%{opacity:1;transform:scale(1) rotate(0)}
        }
        @keyframes nh2spark{
          0%,100%{opacity:0;transform:scale(.6)}
          50%{opacity:1;transform:scale(1.4)}
        }
      `}</style>
    </svg>
  )
}

/* ── Wo der Strom wirklich herkommt (statisch, belegte Anbieter-Fakten) ── */
function PowerSources() {
  const rows = [
    {
      key: 'backend', label: 'Backend', host: 'Hetzner · Deutschland',
      fact: 'Rechenzentren mit Strom aus Wasserkraft (Anbieter-Angabe, seit 2008), PUE ≈ 1,13.',
      cFrom:'#40E5C8', cTo:'#A4F77E', tag: 'Wasserkraft',
    },
    {
      key: 'frontend', label: 'Frontend', host: 'Vercel · Edge',
      fact: 'Statische Auslieferung über CDN; Betreiber gleicht seinen Strombezug rechnerisch mit Erneuerbaren aus.',
      cFrom:'#C6FF3C', cTo:'#FFD16A', tag: 'CDN',
    },
    {
      key: 'ki', label: 'KI', host: 'OpenAI-API · gpt-4o-mini',
      fact: 'Inferenz läuft extern — ihr Verbrauch entsteht bei OpenAI/Azure und kann von uns nur geschätzt, nicht gemessen werden.',
      cFrom:'#8870FF', cTo:'#40E5C8', tag: 'extern',
    },
  ]
  return (
    <div className="nh2-mix">
      <div className="nh2-mix-head">
        <div className="nh2-mix-title">
          <span>Woher der Strom kommt</span>
        </div>
        <div className="nh2-mix-ts"><em>Ist-Zustand</em></div>
      </div>
      <div className="nh2-mix-bars">
        {rows.map(({ key, label, host, fact, cFrom, cTo, tag }) => (
          <div key={key} className="nh2-bar-row" style={{ alignItems:'flex-start' }}>
            <span className="nh2-bar-label" style={{ minWidth: 92 }}>
              <span className="swatch" style={{ background:`linear-gradient(90deg,${cFrom},${cTo})` }}/>{label}
            </span>
            <span style={{ flex:1 }}>
              <span style={{ display:'block', fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-70,#c9d4cf)' }}>{host}</span>
              <span style={{ display:'block', fontSize:12.5, lineHeight:1.5, color:'var(--ink-50,#9fb0aa)', marginTop:3 }}>{fact}</span>
            </span>
            <span className="nh2-bar-val" style={{ whiteSpace:'nowrap' }}>{tag}</span>
          </div>
        ))}
      </div>
      <div className="nh2-mix-foot">
        <span className="nh2-mix-meta">Anbieter-Angaben · <em>Quellen unten</em></span>
        <span className="nh2-mix-meta">Keine Live-Messung</span>
      </div>
    </div>
  )
}

/* ── Ehrliche Count-up-Stats ─────────────────────────── */
function CountStats() {
  const [r1, v1] = useCountUp(100,  { duration: 850 })
  const [r2, v2] = useCountUp(REQ_G_EST, { duration: 950, decimals: 1 })
  const [r3, v3] = useCountUp(1.13, { duration: 1050, decimals: 2 })
  return (
    <div className="nh2-counts">
      <div className="nh2-count" ref={r1}>
        <div className="val"><em>{v1}</em><small>%</small></div>
        <div className="meta">
          <div className="meta-label">Grünstrom beim Hoster</div>
          <div className="meta-sub">Hetzner DE: Strom aus Wasserkraft — Anbieter-Angabe, nicht unsere Messung.</div>
        </div>
      </div>
      <div className="nh2-count" ref={r2}>
        <div className="val">≈&nbsp;{v2}<small>g CO₂ / Anfrage</small></div>
        <div className="meta">
          <div className="meta-label">Geschätzt, nicht gemessen</div>
          <div className="meta-sub">0,24–0,34 Wh je Textanfrage × dt. Netz 363 g/kWh. Externe Quellen.</div>
        </div>
      </div>
      <div className="nh2-count" ref={r3}>
        <div className="val"><em>{v3}</em><small>PUE</small></div>
        <div className="meta">
          <div className="meta-label">Effizienz Rechenzentrum</div>
          <div className="meta-sub">Hetzner-Angabe · je näher an 1,0, desto weniger Strom fürs Drumherum.</div>
        </div>
      </div>
    </div>
  )
}

/* ── Live: echter NILL-KI-Fußabdruck (zählt jede Anfrage) ──────
   Holt die realen, kumulativen Zähler vom Backend (/sustainability/ai-usage)
   und pollt alle 20 s, damit neue Anfragen sichtbar werden. Requests & Tokens
   sind GEZÄHLT; der CO₂-Wert bleibt die belegte Schätzung (Wh × Netz). */
function useAiUsage() {
  const [data, setData] = useState(null)
  const [err, setErr]   = useState(false)
  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const r = await api.get('/sustainability/ai-usage')
        if (alive) { setData(r.data); setErr(false) }
      } catch {
        if (alive) setErr(true)
      }
    }
    load()
    const id = setInterval(load, 20000)
    const onVis = () => { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onVis)
    return () => { alive = false; clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [])
  return [data, err]
}

/* Adaptive CO₂-Formatierung: g bis 1000, danach kg. */
function fmtCo2(g) {
  if (g == null) return '—'
  return g < 1000 ? `${de(g, 1)} g` : `${de(g / 1000, 2)} kg`
}

function LiveAiFootprint() {
  const [data, err] = useAiUsage()
  // Weiches Hochzählen der Request-Zahl bei Updates
  const [shownReq, setShownReq] = useState(0)
  const target = data?.total_requests ?? 0
  useEffect(() => {
    if (!data) return
    const from = shownReq
    if (from === target) return
    const t0 = performance.now()
    let raf = 0
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 700)
      const eased = 1 - Math.pow(1 - p, 3)
      setShownReq(Math.round(from + (target - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target]) // eslint-disable-line react-hooks/exhaustive-deps

  if (err || !data) return null  // ehrlich: keine Daten → nichts anzeigen

  const co2 = data.co2_g || {}
  return (
    <div className="nh2-ribbon" style={{ gap: 16, flexWrap: 'wrap' }}>
      <span className="nh2-ribbon-live" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: '#40E5C8',
          boxShadow: '0 0 0 0 rgba(64,229,200,.6)', animation: 'nh2live 2s ease-out infinite',
        }}/>
        Live · NILL-KI-Fußabdruck
      </span>
      <span className="nh2-ribbon-val" style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span><em>{de(shownReq)}</em><small>KI-Anfragen gezählt</small></span>
        <span style={{ opacity: .4 }}>·</span>
        <span><em>{fmtCo2(co2.mid)}</em><small>CO₂ geschätzt</small></span>
      </span>
      <span className="nh2-ribbon-meta">
        Spanne {fmtCo2(co2.low)}–{fmtCo2(co2.high)} · Anfragen gezählt, Energie geschätzt · alle 20&nbsp;s
      </span>
      <style>{`@keyframes nh2live{0%{box-shadow:0 0 0 0 rgba(64,229,200,.5)}70%{box-shadow:0 0 0 7px rgba(64,229,200,0)}100%{box-shadow:0 0 0 0 rgba(64,229,200,0)}}`}</style>
    </div>
  )
}

/* ── Ehrlichkeits-Hinweis statt Fake-Ledger ──────────── */
function HonestyNote() {
  return (
    <div className="nh2-ribbon" style={{ gap: 14 }}>
      <span className="nh2-ribbon-live">Ehrlich statt „klimaneutral“</span>
      <span className="nh2-ribbon-val" style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>
        Wir kaufen <em>aktuell keine</em> CO₂-Kompensation und behaupten deshalb keine Neutralität.
        Was hier steht, ist entweder belegt oder klar als Schätzung markiert.
      </span>
      <span className="nh2-ribbon-meta">Kompensation: geplant, erst wenn nachweisbar</span>
    </div>
  )
}

/* ── Papier-Rechner (belegbar: 4,7 g / A4-Blatt) ─────── */
const TreeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2 5 11h3l-3 5h4v6h6v-6h4l-3-5h3z"/>
  </svg>
)

function ImpactCalculator() {
  const [perMonth, setPerMonth] = useState(150)   // Belege/Seiten pro Monat
  const sheets  = perMonth * 12
  const co2kg   = (sheets * PAPER_G_PER_SHEET) / 1000
  const carKm   = Math.round((co2kg * 1000) / 120) // ~120 g CO₂ / km (Ø Neuwagen)

  const min = 10, max = 1500
  const slidePct = ((perMonth - min) / (max - min)) * 100

  return (
    <div className="nh2-calc">
      <div className="nh2-calc-head">
        <span className="eyebrow" style={{color:'var(--accent)'}}>Dein Impact · realistisch</span>
        <h3 style={{marginTop:18}}>Wie viel Papier <em>sparst</em> du<br/>mit digitalen Belegen?</h3>
        <p>
          Der ehrlichste Hebel ist Papier: Rechnungen, Belege und Mahnungen, die du in NILL
          digital abwickelst statt auszudrucken. Rechne mit ~4,7&nbsp;g CO₂ je A4-Blatt (Herstellung).
          Schätzung — sie greift nur, wenn du diese Seiten sonst wirklich gedruckt hättest.
        </p>

        <div className="nh2-slider-wrap">
          <div className="nh2-slider-label">
            <span>Belege / Seiten pro Monat</span>
            <span className="nh2-slider-val">
              <em>{de(perMonth)}</em><small>Seiten</small>
            </span>
          </div>
          <input
            type="range" min={min} max={max} step="10" value={perMonth}
            onChange={e => setPerMonth(parseInt(e.target.value, 10))}
            className="nh2-slider"
            style={{ '--p': `${slidePct}%` }}
            aria-label="Belege pro Monat"
          />
          <div className="nh2-slider-ticks">
            <span>10</span><span>400</span><span>750</span><span>1100</span><span>1500</span>
          </div>
        </div>
      </div>

      <div className="nh2-results">
        <div className="nh2-result big">
          <div className="nh2-result-label">
            <span className="ico">●</span>Papier-CO₂ vermieden / Jahr
          </div>
          <div className="nh2-result-val">
            <em>{de(co2kg, 1)}</em><small>kg CO₂ / a</small>
          </div>
          <div className="nh2-result-sub">{de(sheets)}&nbsp;Blatt/Jahr × ~4,7&nbsp;g (Herstellung, ohne Druck & Versand).</div>
        </div>

        <div className="nh2-result">
          <div className="nh2-result-label">
            <span className="ico"><TreeIcon/></span>Blatt Papier / Jahr
          </div>
          <div className="nh2-result-val">{de(sheets)}<small>Blatt</small></div>
          <div className="nh2-result-sub">Ein Ries (500 Blatt) wiegt ~2,5&nbsp;kg — plus Toner, Drucker, Post.</div>
        </div>

        <div className="nh2-result">
          <div className="nh2-result-label">
            <span className="ico"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11m-14 0h14m-14 0a2 2 0 0 0-2 2v3h2m14-5a2 2 0 0 1 2 2v3h-2m-2 0H7m10 0v2m-10-2v2"/></svg></span>Zur Einordnung
          </div>
          <div className="nh2-result-val">≈&nbsp;{de(carKm)}<small>km Auto</small></div>
          <div className="nh2-result-sub">Gleiche CO₂-Menge wie ~{de(carKm)}&nbsp;km mit einem Ø-Neuwagen (120&nbsp;g/km).</div>
        </div>
      </div>
    </div>
  )
}

/* ── Größenordnung: was ist 1 g CO₂? (belegt/geschätzt) ── */
const BENCH = [
  { name: 'NILL · kurze KI-Anfrage',        ico: 'N', v: Number(REQ_G_EST.toFixed(1)), note:'geschätzt', nill: true },
  { name: 'Eine Web-Suche',                 ico: 'G', v: 0.2,  note:'Anbieter-Angabe (historisch)' },
  { name: 'Ein Blatt A4 (Herstellung)',     ico: '▤', v: 4.7,  note:'ISO/PAS/CEPI' },
  { name: '1 km mit dem Auto',              ico: '▣', v: 120,  note:'Ø Neuwagen' },
]

function EnergyBenchmark() {
  const [listRef, listVis] = useReveal()
  const max = Math.max(...BENCH.map(r => r.v))
  return (
    <div className="nh2-bench" ref={listRef}>
      <div className="nh2-bench-head">
        <span className="eyebrow">Zur Einordnung</span>
        <h3>Was bedeutet <em>1 Gramm CO₂?</em></h3>
        <p>
          Eine einzelne KI-Textanfrage ist im Vergleich zu Alltagsdingen winzig — aber sie ist nicht null.
          Werte gemischter Herkunft, gerundet; der NILL-Wert ist eine Schätzung, keine Messung.
        </p>
      </div>
      <div className="nh2-bench-list">
        {BENCH.map((r, i) => (
          <div key={r.name} className={`nh2-bench-row${r.nill?' nill':''}`}>
            <div className="nh2-bench-name">
              <span className="nh2-bench-ico">{r.ico}</span>
              <span>{r.name}<span style={{ color:'var(--ink-40,#7c8a84)', fontSize:11, marginLeft:8 }}>· {r.note}</span></span>
            </div>
            <span className="nh2-bench-track">
              <span className="nh2-bench-fill"
                style={{
                  width: 0,
                  animation: listVis ? `nh2benchFill .9s ${0.05 + i*0.08}s cubic-bezier(.16,1,.3,1) forwards` : 'none',
                  '--bench-w': `${(r.v / max) * 100}%`,
                }}
              />
            </span>
            <span className="nh2-bench-val">{de(r.v, r.v < 1 ? 1 : 0)}<em>g CO₂</em></span>
          </div>
        ))}
        <style>{`@keyframes nh2benchFill{to{width:var(--bench-w)}}`}</style>
        <div className="nh2-bench-foot">
          Grob: ~<em>{Math.round(PAPER_G_PER_SHEET / REQ_G_EST)}</em> KI-Anfragen entsprechen einem einzigen ausgedruckten Blatt Papier.
        </div>
      </div>
    </div>
  )
}

/* ── Vier ehrliche Schritte (Kompensation = geplant) ── */
const StageIcon = {
  bolt: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>),
  chip: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>),
  gauge: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19a9 9 0 1 1 16 0"/><path d="M12 13l4-4"/><circle cx="12" cy="14" r="1.4" fill="currentColor"/></svg>),
  leaf: (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 21c0-9 4-15 14-16-1 10-7 14-14 16z"/><path d="M5 21c3-5 7-9 11-11"/></svg>),
}
const STAGES = [
  { num:'01', icon:StageIcon.bolt,  title:'Grünes Hosting', text:'Backend bei einem Anbieter mit Strom aus Wasserkraft.', tag:'Ist' },
  { num:'02', icon:StageIcon.chip,  title:'Sparsam rechnen', text:'Bewusst ein kleines KI-Modell (gpt-4o-mini) statt eines Großmodells.', tag:'Ist' },
  { num:'03', icon:StageIcon.gauge, title:'Ehrlich einordnen', text:'Verbrauch offen als Schätzung ausweisen, nicht als Messung verkaufen.', tag:'Ist' },
  { num:'04', icon:StageIcon.leaf,  title:'Kompensation', text:'Erst kaufen, wenn Projekt & Zertifikat nachweisbar sind. Noch nicht erfolgt.', tag:'Ziel' },
]

function CarbonJourney() {
  return (
    <div className="nh2-journey">
      <div className="nh2-journey-head">
        <span className="eyebrow">Unser Ansatz</span>
        <h3>Erst reduzieren, <em>dann ehrlich sein.</em></h3>
      </div>
      <div className="nh2-journey-stages" role="list">
        {STAGES.map((s) => (
          <div key={s.num} className="nh2-stage" role="listitem">
            <div className="nh2-stage-orb" aria-hidden="true">{s.icon}</div>
            <div className="nh2-stage-num">{s.num}</div>
            <h4>{s.title} <span style={{
              fontSize:10, fontWeight:700, letterSpacing:'.08em', verticalAlign:'middle',
              padding:'2px 7px', borderRadius:999, marginLeft:4,
              background: s.tag==='Ist' ? 'rgba(64,229,200,.16)' : 'rgba(255,209,106,.16)',
              color: s.tag==='Ist' ? '#40E5C8' : '#FFD16A',
            }}>{s.tag}</span></h4>
            <p>{s.text}</p>
          </div>
        ))}
        <span className="nh2-pulse" aria-hidden="true"/>
        <span className="nh2-pulse" aria-hidden="true"/>
        <span className="nh2-pulse" aria-hidden="true"/>
      </div>
    </div>
  )
}

/* ── Drei ehrliche Pfeiler ───────────────────────────── */
const PILLARS = [
  {
    num: '01 · Effizienz',
    title: 'Erst weniger verbrauchen.',
    short: 'Der grünste Strom ist der, den man nicht braucht.',
    details: [
      <>KI: kleines, sparsames Modell (<code>gpt-4o-mini</code>) statt Großmodell.</>,
      <>Vor dem Versand an die KI werden personenbezogene Daten entfernt — kürzere, günstigere Anfragen.</>,
      <>Schlanker Server-Footprint statt dauerlaufender GPU-Cluster.</>,
    ],
  },
  {
    num: '02 · Grünes Hosting',
    title: 'Anbieter mit Erneuerbaren.',
    short: 'Belegte Anbieter-Angaben — keine eigenen Öko-Behauptungen.',
    details: [
      <>Backend: Hetzner (DE), Rechenzentren mit Strom aus Wasserkraft, PUE ≈ 1,13.</>,
      <>Frontend: Vercel-CDN; Betreiber gleicht Strombezug rechnerisch mit Erneuerbaren aus.</>,
      <>KI-Inferenz läuft extern (OpenAI/Azure) — von uns nicht direkt steuerbar.</>,
    ],
  },
  {
    num: '03 · Ehrlichkeit',
    title: 'Kein Label ohne Beleg.',
    short: 'Wir sagen nicht „klimaneutral“, solange wir es nicht nachweisen.',
    details: [
      <>Keine gekauften Kompensationen → keine Neutralitäts-Aussage.</>,
      <>Jede Zahl ist Quelle oder klar gekennzeichnete Schätzung.</>,
      <>Kompensation ist ein <em>Ziel</em> — mit Zertifikat, wenn sie kommt.</>,
    ],
  },
]

function ExpandablePillars() {
  const [open, setOpen] = useState(0)
  return (
    <div className="nh2-pillars">
      {PILLARS.map((p, i) => (
        <button
          key={i}
          className={`nh2-pillar${open === i ? ' open' : ''}`}
          onClick={() => setOpen(open === i ? -1 : i)}
          aria-expanded={open === i}
        >
          <div className="nh2-pillar-head">
            <div>
              <div className="nh2-pillar-num">{p.num}</div>
              <h4>{p.title}</h4>
            </div>
            <span className="nh2-pillar-toggle" aria-hidden="true">+</span>
          </div>
          <p>{p.short}</p>
          <div className="nh2-pillar-more">
            <ul>{p.details.map((d, j) => <li key={j}>{d}</li>)}</ul>
          </div>
        </button>
      ))}
    </div>
  )
}

/* ── Roadmap: Ist + geplant, ehrlich ─────────────────── */
const MILES = [
  { q:'Ist',    title:'Grünes Hosting',      text:'Backend bei Hetzner (DE, Wasserkraft), Frontend über Vercel.' },
  { q:'Ist',    title:'Sparsame KI',         text:'Kleines Modell, Daten-Redaction vor dem Versand an die API.' },
  { q:'Geplant',title:'Eigene Messung',      text:'Energie/Anfrage tatsächlich erfassen statt zu schätzen.', future:true },
  { q:'Geplant',title:'Kompensation + Bericht', text:'Geprüfte Zertifikate kaufen und jährlich transparent berichten.', future:true },
]

function Milestones() {
  return (
    <div className="nh2-milestones">
      <div className="nh2-milestones-head">
        <span className="eyebrow">Roadmap · transparent</span>
        <h3>Was ist, <em>und was wir vorhaben.</em></h3>
      </div>
      <div className="nh2-timeline">
        {MILES.map((m, i) => (
          <div key={i} className={`nh2-mile${m.future?' future':''}`}>
            <span className={`nh2-mile-dot${m.future?' future':''}`}/>
            <div className="nh2-mile-q">{m.q}</div>
            <h4>{m.title}</h4>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Quellen ─────────────────────────────────────────── */
const SOURCES = [
  { t:'Strommix DE 2024 · 363 g CO₂/kWh', u:'https://www.umweltbundesamt.de/themen/co2-emissionen-pro-kilowattstunde-strom-2024', s:'Umweltbundesamt' },
  { t:'KI-Anfrage · 0,24 Wh (Gemini) / 0,34 Wh (ChatGPT)', u:'https://hannahritchie.substack.com/p/ai-footprint-august-2025', s:'Google/OpenAI, zit. n. H. Ritchie' },
  { t:'Grünes Hosting · Wasserkraft, PUE 1,13', u:'https://docs.hetzner.com/general/company-and-policy/sustainability-at-hetzner/', s:'Hetzner' },
  { t:'A4-Blatt · 4,29–4,74 g CO₂ (Herstellung)', u:'https://www.sciencedirect.com/science/article/abs/pii/S0959652611004409', s:'Journal of Cleaner Production' },
]

function SourcesNote() {
  return (
    <div style={{
      marginTop: 28, padding: '20px 22px',
      border: '1px solid var(--line,rgba(255,255,255,.08))', borderRadius: 16,
      background: 'rgba(255,255,255,.02)',
    }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>Quellen &amp; Methodik</div>
      <ul style={{ listStyle:'none', margin:0, padding:0, display:'grid', gap:10 }}>
        {SOURCES.map((s, i) => (
          <li key={i} style={{ fontSize:13, lineHeight:1.5, color:'var(--ink-60,#aab7b1)' }}>
            <a href={s.u} target="_blank" rel="noopener noreferrer"
               style={{ color:'var(--accent,#40E5C8)', textDecoration:'none' }}>
              {s.t}
            </a>
            <span style={{ color:'var(--ink-40,#7c8a84)' }}> — {s.s}</span>
          </li>
        ))}
      </ul>
      <p style={{ fontSize:12, lineHeight:1.6, color:'var(--ink-40,#7c8a84)', margin:'14px 0 0' }}>
        Der Live-Zähler oben ist echt: NILL zählt jede KI-Anfrage (und die vom API gemeldeten Tokens).
        Der CO₂-Wert daraus ist eine Schätzung: gezählte Anfragen × (0,24–0,34&nbsp;Wh je Anfrage)
        × 0,363&nbsp;g&nbsp;CO₂/Wh ≈ 0,1&nbsp;g pro Anfrage. Die KI-Inferenz läuft bei OpenAI und wird von
        uns nicht direkt gemessen. Anbieter-Angaben zu Grünstrom beziehen sich auf die Rechenzentren der
        jeweiligen Anbieter, nicht auf eine Eigenleistung von NILL.
      </p>
    </div>
  )
}

/* ── Main section ────────────────────────────────────── */
export default function SustainabilitySection({ onCTA }) {
  const [headRef, headVis] = useReveal()

  return (
    <section id="nachhaltigkeit" className="nh2" data-screen-label="Nachhaltigkeit">
      <LeafParticles count={10}/>

      <div className="wrap">

        {/* Hero */}
        <div className={`nh2-hero reveal${headVis?' in':''}`} ref={headRef}>
          <div>
            <span className="eyebrow" style={{color:'var(--accent-4)'}}>Verantwortung statt Fußnote</span>
            <h2 style={{marginTop:24}}>
              Software, die <em>ehrlich rechnet.</em>
            </h2>
            <p className="lead">
              KI verbraucht Strom — das lässt sich nicht wegreden. Also gehen wir offen damit um:
              Das Backend läuft in einem Rechenzentrum mit Strom aus Wasserkraft, für die KI nutzen wir
              bewusst ein kleines, sparsames Modell — und wir schreiben nur, was wir belegen können.
              Kompensation kaufen wir noch nicht; wenn, dann nachweisbar.
            </p>
            <div className="nh2-kpis">
              <span className="nh2-kpi"><span className="pip"/><em>Wasserkraft</em> · Backend-Hosting</span>
              <span className="nh2-kpi"><span className="pip"/><em>gpt-4o-mini</em> · sparsames Modell</span>
              <span className="nh2-kpi"><span className="pip"/><em>Quellen</em> · jede Zahl belegt</span>
            </div>
          </div>

          <div className="nh2-plant">
            <div className="nh2-plant-rings" aria-hidden="true"><span/><span/><span/></div>
            <GrowingPlant play={headVis}/>
            <div className="nh2-plant-stat">
              <span className="dot"/>NILL · grünes Hosting · ehrlich gerechnet
            </div>
          </div>
        </div>

        {/* Stromquellen + ehrliche Stats */}
        <Rev className="nh2-strip">
          <PowerSources/>
          <CountStats/>
        </Rev>

        {/* Live: echte NILL-Anfragen, kumulativ */}
        <Rev><LiveAiFootprint/></Rev>

        <Rev><HonestyNote/></Rev>

        {/* Papier-Rechner */}
        <Rev><ImpactCalculator/></Rev>

        {/* Einordnung */}
        <Rev><EnergyBenchmark/></Rev>

        {/* Ansatz */}
        <Rev><CarbonJourney/></Rev>

        {/* Roadmap */}
        <Rev><Milestones/></Rev>

        {/* Pfeiler */}
        <Rev><ExpandablePillars/></Rev>

        {/* Quellen */}
        <Rev><SourcesNote/></Rev>

        {/* Pledge / CTA */}
        <div className="nh2-pledge">
          <div>
            <div className="big">
              <em>Transparenter Nachhaltigkeitsbericht</em> — geplant: jährlich, als PDF,
              mit Stromquellen, geschätzten Emissionen und (sobald vorhanden) Kompensations-Zertifikaten.
            </div>
            <div className="meta">In Arbeit · noch kein Bericht veröffentlicht</div>
          </div>
          <a
            className="btn btn-ghost"
            href="#"
            onClick={(e) => { e.preventDefault(); onCTA && onCTA('Nachhaltigkeitsbericht') }}
          >
            <span>Bei Veröffentlichung benachrichtigen</span>
          </a>
        </div>
      </div>
    </section>
  )
}
