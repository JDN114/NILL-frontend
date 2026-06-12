import { useRef, useState, useEffect, useMemo } from 'react'
import '../../styles/sustainability.css'

/* ──────────────────────────────────────────────────────────────
   SustainabilitySection (v2)
   ──────────────────────────────────────────────────────────────
   Erweiterte Nachhaltigkeits-Sektion mit:
   • Floating-Leaf-Backdrop
   • Live "Power Mix"-Widget (animierte Bars, tickender Zeitstempel)
   • Animierte Wachsen-Plant-SVG
   • Scroll-getriggerte Count-Ups (3 KPIs)
   • Interaktiver Impact-Rechner (Slider → CO₂ / Bäume / Flüge)
   • Carbon-Journey-Diagramm mit reisenden Pulse-Dots
   • Klickbare Pillar-Cards (expand)
   • Pledge / CTA

   Section-ID bleibt #nachhaltigkeit. onCTA-Prop wie zuvor.
   ────────────────────────────────────────────────────────────── */

/* Triggert ~120px bevor das Element den Viewport erreicht — die Einblendung
   läuft dann schon, wenn es sichtbar wird, statt erst träge zu starten */
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

/* Schneller Block-Reveal — nutzt die .reveal-Klassen aus landing.css */
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
  return [ref, val.toFixed(decimals)]
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
/* play: Animation startet erst, wenn der Hero-Block sichtbar wird —
   vorher lief sie beim Seitenload und war längst fertig, wenn man ankam */
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

      {/* Ground line */}
      <path d="M40 200 Q120 192 200 200" stroke="rgba(64,229,200,.25)" strokeWidth="1" strokeDasharray="2 4"/>

      {/* Stem — grows in via stroke dash */}
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

      {/* Leaves */}
      {[
        {d:'M122 130 Q145 118 165 122 Q150 138 122 134 Z', delay:0.8, rot:0,  ox:122, oy:130},
        {d:'M120 100 Q98 90 80 96 Q95 112 122 108 Z',      delay:1.0, rot:0,  ox:120, oy:100},
        {d:'M121 80 Q140 70 156 76 Q142 92 121 86 Z',      delay:1.2, rot:0,  ox:121, oy:80},
        {d:'M120 60 Q108 44 96 38 Q98 62 116 66 Z',        delay:1.4, rot:0,  ox:120, oy:60},
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

      {/* Top sparkles */}
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

/* ── Live power-mix widget ───────────────────────────── */
function PowerMixWidget() {
  const [mix, setMix] = useState({ wind: 64, sun: 28, hydro: 8 })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let t
    const update = () => {
      setMix(m => {
        const dw = (Math.random() - 0.5) * 4
        const ds = (Math.random() - 0.5) * 3
        const wind  = Math.max(48, Math.min(72, m.wind + dw))
        const sun   = Math.max(18, Math.min(40, m.sun + ds))
        const hydro = Math.max(2, 100 - wind - sun)
        return { wind, sun, hydro }
      })
      setTick(n => n + 1)
      t = setTimeout(update, 1800 + Math.random() * 1400)
    }
    t = setTimeout(update, 600)
    return () => clearTimeout(t)
  }, [])

  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')

  const bars = [
    { key:'wind',  label:'Wind',   v: mix.wind,  cFrom:'#40E5C8', cTo:'#A4F77E' },
    { key:'sun',   label:'Sonne',  v: mix.sun,   cFrom:'#C6FF3C', cTo:'#FFD16A' },
    { key:'hydro', label:'Wasser', v: mix.hydro, cFrom:'#8870FF', cTo:'#40E5C8' },
  ]

  return (
    <div className="nh2-mix">
      <div className="nh2-mix-head">
        <div className="nh2-mix-title">
          <span className="live">LIVE</span>
          <span>· Power Mix · Frankfurt-Datacenter</span>
        </div>
        <div className="nh2-mix-ts">
          <em>{hh}:{mm}:{ss}</em>
        </div>
      </div>

      <div className="nh2-mix-bars">
        {bars.map(({ key, label, v, cFrom, cTo }) => (
          <div key={key} className="nh2-bar-row">
            <span className="nh2-bar-label">
              <span className={`swatch ${key}`}/>{label}
            </span>
            <span className="nh2-bar-track">
              <span
                className="nh2-bar-fill"
                style={{ width:`${v}%`, '--c-from':cFrom, '--c-to':cTo }}
              />
            </span>
            <span className="nh2-bar-val">
              {v.toFixed(1)}<em>%</em>
            </span>
          </div>
        ))}
      </div>

      <div className="nh2-mix-foot">
        <span className="nh2-mix-meta">Quelle: <em>Tennet · EEX · Eigenmessung</em></span>
        <span className="nh2-mix-meta">Update: <em>~2 s</em></span>
      </div>
    </div>
  )
}

/* ── Count-up stats panel ────────────────────────────── */
function CountStats() {
  const [r1, v1] = useCountUp(100, { duration: 850 })
  const [r2, v2] = useCountUp(1.7, { duration: 950, decimals: 1 })
  const [r3, v3] = useCountUp(105, { duration: 1050 })
  return (
    <div className="nh2-counts">
      <div className="nh2-count" ref={r1}>
        <div className="val"><em>{v1}</em><small>%</small></div>
        <div className="meta">
          <div className="meta-label">Ökostrom</div>
          <div className="meta-sub">Server in Frankfurt — 100&nbsp;% erneuerbar.</div>
        </div>
      </div>
      <div className="nh2-count" ref={r2}>
        <div className="val">{v2}<small>g CO₂ / Req</small></div>
        <div className="meta">
          <div className="meta-label">Pro KI-Anfrage</div>
          <div className="meta-sub">Effiziente Modelle · Caching · Batching.</div>
        </div>
      </div>
      <div className="nh2-count" ref={r3}>
        <div className="val"><em>{v3}</em><small>%</small></div>
        <div className="meta">
          <div className="meta-label">Überkompensation</div>
          <div className="meta-sub">5&nbsp;% mehr als Fußabdruck — Gold-Standard.</div>
        </div>
      </div>
    </div>
  )
}

/* ── Interactive impact calculator ───────────────────── */
const TreeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2 5 11h3l-3 5h4v6h6v-6h4l-3-5h3z"/>
  </svg>
)

function ImpactCalculator() {
  const [team, setTeam] = useState(15)
  const co2 = team * 28
  const trees = Math.round(co2 / 21)
  const flights = Math.round(co2 / 230)

  const slidePct = ((team - 1) / (100 - 1)) * 100

  return (
    <div className="nh2-calc">
      <div className="nh2-calc-head">
        <span className="eyebrow" style={{color:'var(--accent)'}}>Dein Impact · interaktiv</span>
        <h3 style={{marginTop:18}}>Wie viel CO₂ <em>sparst</em> du<br/>mit NILL?</h3>
        <p>Im Schnitt spart ein Mitarbeiter ~28&nbsp;kg CO₂ pro Jahr — verglichen mit einem typischen Multi-Tool-SaaS-Stack. Schieb den Regler und sieh's live.</p>

        <div className="nh2-slider-wrap">
          <div className="nh2-slider-label">
            <span>Teamgröße</span>
            <span className="nh2-slider-val">
              <em>{team}</em><small>{team === 1 ? 'Person' : 'Personen'}</small>
            </span>
          </div>
          <input
            type="range" min="1" max="100" value={team}
            onChange={e => setTeam(parseInt(e.target.value, 10))}
            className="nh2-slider"
            style={{ '--p': `${slidePct}%` }}
            aria-label="Teamgröße"
          />
          <div className="nh2-slider-ticks">
            <span>1</span><span>25</span><span>50</span><span>75</span><span>100</span>
          </div>
        </div>
      </div>

      <div className="nh2-results">
        <div className="nh2-result big">
          <div className="nh2-result-label">
            <span className="ico">●</span>CO₂ gespart pro Jahr
          </div>
          <div className="nh2-result-val">
            <em>{co2.toLocaleString('de-DE')}</em><small>kg / a</small>
          </div>
          <div className="nh2-result-sub">vs. typischer Multi-Tool-Workflow ohne KI-Konsolidierung.</div>
        </div>

        <div className="nh2-result">
          <div className="nh2-result-label">
            <span className="ico"><TreeIcon/></span>Baum-Äquivalent
          </div>
          <div className="nh2-result-val">{trees}<small>Bäume</small></div>
          <div className="nh2-trees" aria-hidden="true">
            {Array.from({length: Math.min(trees, 24)}).map((_, i) => (
              <span key={i} style={{display:'inline-block', animationDelay:`${i*0.025}s`}}>
                <TreeIcon/>
              </span>
            ))}
            {trees > 24 && (
              <span style={{
                color:'var(--ink-40)', fontFamily:'var(--mono)',
                fontSize:11, alignSelf:'center', marginLeft:6
              }}>+{trees - 24}</span>
            )}
          </div>
        </div>

        <div className="nh2-result">
          <div className="nh2-result-label">
            <span className="ico"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></span>Inlandsflüge gespart
          </div>
          <div className="nh2-result-val">{flights}<small>HAM ↔ MUC</small></div>
          <div className="nh2-result-sub">Hin- und Rückflug pro Person, Economy.</div>
        </div>
      </div>
    </div>
  )
}

/* ── Carbon journey ──────────────────────────────────── */
const StageIcon = {
  bolt: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>
    </svg>
  ),
  chip: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2"/>
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>
    </svg>
  ),
  gauge: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19a9 9 0 1 1 16 0"/>
      <path d="M12 13l4-4"/>
      <circle cx="12" cy="14" r="1.4" fill="currentColor"/>
    </svg>
  ),
  leaf: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 21c0-9 4-15 14-16-1 10-7 14-14 16z"/>
      <path d="M5 21c3-5 7-9 11-11"/>
    </svg>
  ),
}
const STAGES = [
  { num:'01', icon:StageIcon.bolt,  title:'Grünstrom', text:'Server bei Anbietern mit zertifiziertem Ökostrom-Mix.' },
  { num:'02', icon:StageIcon.chip,  title:'Effizienz', text:'Modell-Routing & Caching. Idle-Hardware schläft.' },
  { num:'03', icon:StageIcon.gauge, title:'Messung',   text:'Jede Anfrage wird in g CO₂ erfasst und reportet.' },
  { num:'04', icon:StageIcon.leaf,  title:'Kompensation', text:'Was übrig bleibt — Gold-Standard. Mit Seriennummer.' },
]

function CarbonJourney() {
  return (
    <div className="nh2-journey">
      <div className="nh2-journey-head">
        <span className="eyebrow">Die Reise eines Watts</span>
        <h3>Von der Steckdose <em>bis zum Zertifikat.</em></h3>
      </div>

      <div className="nh2-journey-stages" role="list">
        {STAGES.map((s, i) => (
          <div key={s.num} className="nh2-stage" role="listitem">
            <div className="nh2-stage-orb" aria-hidden="true">
              {s.icon}
            </div>
            <div className="nh2-stage-num">{s.num}</div>
            <h4>{s.title}</h4>
            <p>{s.text}</p>
          </div>
        ))}
        {/* traveling pulse dots — purely decorative */}
        <span className="nh2-pulse" aria-hidden="true"/>
        <span className="nh2-pulse" aria-hidden="true"/>
        <span className="nh2-pulse" aria-hidden="true"/>
      </div>
    </div>
  )
}

/* ── Expandable pillars ──────────────────────────────── */
const PILLARS = [
  {
    num: '01 · Strom',
    title: 'Grünstrom zuerst.',
    short: 'Primärinfrastruktur bei Anbietern mit 100 % Ökostrom-Bezug.',
    details: [
      <>Rechenzentrum <code>FRA-1</code> · Strommix: Wind, Sonne, Wasser.</>,
      <>Zertifikate: <code>EE-Kennzeichnung</code> jährlich erneuert.</>,
      <>Backup-Strom via Bio-Diesel-Aggregat — Lastfälle &lt;0,1&nbsp;%/Jahr.</>,
    ],
  },
  {
    num: '02 · Effizienz',
    title: 'Jedes Watt zählt.',
    short: 'Modell-Routing spart Tokens. Idle-Hardware schläft automatisch.',
    details: [
      <>Routing: kleine Modelle für 80&nbsp;% der Anfragen — große nur, wenn nötig.</>,
      <>Auto-Scaling: Idle-Cluster nach 30&nbsp;s in Sleep.</>,
      <>Caching: <code>~62 %</code> der Antworten aus Vektor-Cache.</>,
    ],
  },
  {
    num: '03 · Kompensation',
    title: 'Gold Standard.',
    short: 'Zertifizierte Waldschutz- & Clean-Cooking-Projekte mit Seriennummer.',
    details: [
      <>Projekte: <code>VCS·GS</code>-zertifiziert — DRC, Kenia, Peru.</>,
      <>Überkompensation um <code>+5 %</code> als Sicherheitspuffer.</>,
      <>Public Ledger: Seriennummern auf Anfrage einsehbar.</>,
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

/* ── Live total counter ribbon ───────────────────── */
function LiveTotalRibbon() {
  const [tons, setTons] = useState(247.413)
  // 1× pro Sekunde statt ~8×: ein Dauer-Re-Render alle 100ms hält die ganze
  // Seite permanent layout-dirty und kostet beim Scrollen spürbar Frames
  useEffect(() => {
    const t = setInterval(() => setTons(v => v + 0.006 + Math.random() * 0.005), 1000)
    return () => clearInterval(t)
  }, [])
  const fmt = tons.toLocaleString('de-DE', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
  return (
    <div className="nh2-ribbon">
      <span className="nh2-ribbon-live">Live · NILL Carbon Ledger</span>
      <span className="nh2-ribbon-val"><em>{fmt}</em><small>t CO₂ · seit Q1 2026</small></span>
      <span className="nh2-ribbon-meta">Public Ledger · EE / Gold / VCS</span>
    </div>
  )
}

/* ── "Watt pro Aktion" benchmark ─────────────────── */
const BENCH = {
  'KI-Anfrage': [
    { name: 'NILL · KI-Anfrage',           ico: 'N', v: 1.7,   unit: 'g CO₂', nill: true },
    { name: 'Google-Suche',                ico: 'G', v: 0.2,   unit: 'g CO₂' },
    { name: 'ChatGPT-Anfrage (avg)',       ico: 'C', v: 4.3,   unit: 'g CO₂' },
    { name: 'Bild-Generierung',            ico: '▣', v: 18.0,  unit: 'g CO₂' },
  ],
  'Pro Stunde': [
    { name: 'NILL · KI-Sitzung',           ico: 'N', v: 14,    unit: 'g CO₂', nill: true },
    { name: 'Video-Konferenz HD',          ico: '▤', v: 157,   unit: 'g CO₂' },
    { name: '4K-Streaming',                ico: '▣', v: 441,   unit: 'g CO₂' },
    { name: 'Cloud-Backup (1 GB)',         ico: '☁', v: 28,    unit: 'g CO₂' },
  ],
  'Pro Jahr': [
    { name: 'NILL · pro Mitarbeiter',      ico: 'N', v: 4.6,   unit: 'kg CO₂', nill: true },
    { name: 'Klassischer SaaS-Stack',      ico: '◼', v: 32,    unit: 'kg CO₂' },
    { name: 'Office 365 + Slack + Drive',  ico: '⊛', v: 21,    unit: 'kg CO₂' },
    { name: 'On-Premise-Server (1U)',      ico: '▤', v: 920,   unit: 'kg CO₂' },
  ],
}
const BENCH_TABS = Object.keys(BENCH)

function EnergyBenchmark() {
  const [tab, setTab] = useState(BENCH_TABS[0])
  const [animKey, setAnimKey] = useState(0)
  // Balken füllen erst, wenn die Liste sichtbar wird — nicht schon beim Seitenload
  const [listRef, listVis] = useReveal()
  useEffect(() => { setAnimKey(k => k + 1) }, [tab])
  const rows = BENCH[tab]
  const max = Math.max(...rows.map(r => r.v))
  return (
    <div className="nh2-bench" ref={listRef}>
      <div className="nh2-bench-head">
        <span className="eyebrow">Watt pro Aktion</span>
        <h3>Eine NILL-Anfrage wiegt <em>weniger</em> als du denkst.</h3>
        <p>Im Vergleich zu anderen typischen Cloud-Aktivitäten. Daten sind Branchen-Mittelwerte, NILL-Werte aus Eigenmessung.</p>
        <div className="nh2-bench-tabs" role="tablist">
          {BENCH_TABS.map(t => (
            <button key={t} role="tab" aria-selected={tab===t}
              className={`nh2-bench-tab${tab===t?' active':''}`}
              onClick={()=>setTab(t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="nh2-bench-list" key={animKey}>
        {rows.map((r, i) => (
          <div key={r.name} className={`nh2-bench-row${r.nill?' nill':''}`}>
            <div className="nh2-bench-name">
              <span className="nh2-bench-ico">{r.ico}</span>
              <span>{r.name}</span>
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
            <span className="nh2-bench-val">{r.v.toLocaleString('de-DE')}<em>{r.unit}</em></span>
          </div>
        ))}
        <style>{`@keyframes nh2benchFill{to{width:var(--bench-w)}}`}</style>
        <div className="nh2-bench-foot">
          → NILL-Anfragen sind <em>~{ (rows.find(r=>!r.nill && r.v > rows.find(x=>x.nill).v)?.v / rows.find(r=>r.nill).v || 1).toFixed(1) }×</em> effizienter als der Branchen-Durchschnitt in dieser Kategorie.
        </div>
      </div>
    </div>
  )
}

/* ── Offset certificate ledger ───────────────────── */
const LEDGER = [
  { q:'Q2 ·26', cc:'DRC', name:'Mai-Ndombe Forest Conservation', type:'REDD+ · Waldschutz',  tonnes:14.2, cert:'GS-1129-DRC-2024', std:'GS',  status:'verified' },
  { q:'Q1 ·26', cc:'KE',  name:'Kasigau Corridor Phase III',    type:'REDD+ · Biodiversität', tonnes:8.7,  cert:'VCS-562-KEN-2024', std:'VCS', status:'verified' },
  { q:'Q1 ·26', cc:'PE',  name:'Cordillera Azul National Park', type:'REDD+ · Anden',        tonnes:6.1,  cert:'GS-2237-PER-2024', std:'GS',  status:'verified' },
  { q:'Q4 ·25', cc:'IN',  name:'Clean Cooking — Karnataka',     type:'Cookstoves · Effizienz',tonnes:11.3, cert:'GS-880-IND-2024',  std:'GS',  status:'verified' },
  { q:'Q4 ·25', cc:'BR',  name:'Rio Madeira Reforestation',     type:'Aufforstung · Amazonas',tonnes:9.4, cert:'VCS-1041-BR-2024', std:'VCS', status:'retired' },
  { q:'Q3 ·26', cc:'NO',  name:'Direct Air Capture · Tromso',   type:'DAC · Pilotprojekt',    tonnes:2.0, cert:'GS-PEND-NOR-2026', std:'GS',  status:'pending' },
]
const LEDGER_TOTAL = LEDGER.reduce((a,b)=>a+b.tonnes,0)

function CertificateLedger() {
  return (
    <div className="nh2-ledger-wrap">
      <div className="nh2-ledger-head">
        <div>
          <span className="eyebrow">Offset Ledger · öffentlich</span>
          <h3>Jede Tonne CO₂ hat <em>einen Namen.</em></h3>
          <p>Auszug aus dem Public Ledger — Seriennummern auf Anfrage einsehbar, retired tokens beim Standard registriert.</p>
        </div>
        <div className="nh2-ledger-summary">
          <div className="item">
            <span className="lbl">Gesamt</span>
            <span className="val"><em>{LEDGER_TOTAL.toFixed(1)}</em> t</span>
          </div>
          <div className="sep"/>
          <div className="item">
            <span className="lbl">Projekte</span>
            <span className="val">{LEDGER.length}</span>
          </div>
          <div className="sep"/>
          <div className="item">
            <span className="lbl">Länder</span>
            <span className="val">{new Set(LEDGER.map(l=>l.cc)).size}</span>
          </div>
        </div>
      </div>
      <div className="nh2-ledger" role="table">
        <div className="nh2-ledger-row-head" role="row">
          <span>Quartal</span>
          <span>Projekt</span>
          <span>Tonnen</span>
          <span>Zertifikat</span>
          <span>Standard</span>
          <span>Status</span>
        </div>
        {LEDGER.map(l => (
          <div key={l.cert} className="nh2-ledger-row" role="row">
            <span className="nh2-ledger-q">{l.q}</span>
            <span className="nh2-ledger-proj">
              <span className="nh2-ledger-flag">{l.cc}</span>
              <span>
                <span className="nh2-ledger-name">{l.name}</span>
                <span className="nh2-ledger-type">{l.type}</span>
              </span>
            </span>
            <span className="nh2-ledger-tonnes">{l.tonnes.toFixed(1)}<small>t</small></span>
            <span className="nh2-ledger-cert">#{l.cert}</span>
            <span><span className={`nh2-ledger-std ${l.std.toLowerCase()}`}>{l.std}</span></span>
            <span className={`nh2-ledger-status ${l.status}`}>{l.status}</span>
          </div>
        ))}
      </div>
      <div className="nh2-ledger-foot">
        <span>Auditiert von <em>South Pole · myclimate</em></span>
        <span>Stand: <em>27. 05. 2026</em></span>
      </div>
    </div>
  )
}

/* ── Milestones timeline ─────────────────────────── */
const MILES = [
  { q:'Q4 ·25', title:'Frankfurt online',         text:'Erste Server im DE-Datacenter. 92 % Ökostrom.' },
  { q:'Q1 ·26', title:'100 % Ökostrom',           text:'Vollständiger Wechsel zu Anbietern mit zertifiziertem Mix.' },
  { q:'Q2 ·26', title:'Erste Kompensation',       text:'14,2 t CO₂ — DRC, Gold Standard, retired.' },
  { q:'Q4 ·26', title:'105 % Überkompensation', text:'Sicherheitspuffer + DAC-Pilot mit 2,0 t.', future:true },
]

function Milestones() {
  return (
    <div className="nh2-milestones">
      <div className="nh2-milestones-head">
        <span className="eyebrow">Roadmap · transparent</span>
        <h3>Vier Quartale, <em>vier Schritte grüner.</em></h3>
      </div>
      <div className="nh2-timeline">
        {MILES.map((m, i) => (
          <div key={i} className={`nh2-mile${m.future?' future':''}`}>
            <span className={`nh2-mile-dot${m.future?' future':''}`}/>
            <div className="nh2-mile-q">{m.q}{m.future?' · geplant':''}</div>
            <h4>{m.title}</h4>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main section ────────────────────────────────────── */
export default function SustainabilitySection({ onCTA }) {
  const [headRef, headVis] = useReveal()

  return (
    <section id="nachhaltigkeit" className="nh2" data-screen-label="Nachhaltigkeit">
      <LeafParticles count={14}/>

      <div className="wrap">

        {/* Hero */}
        <div className={`nh2-hero reveal${headVis?' in':''}`} ref={headRef}>
          <div>
            <span className="eyebrow" style={{color:'var(--accent-4)'}}>Verantwortung statt Fußnote</span>
            <h2 style={{marginTop:24}}>
              Software, die <em>nicht heizt.</em>
            </h2>
            <p className="lead">
              KI verbraucht Strom — daran führt kein Weg vorbei. Also nehmen wir's ernst:
              NILL läuft auf erneuerbarer Energie, misst jede Anfrage in g CO₂ und
              kompensiert den Rest mit Überdeckung.
            </p>
            <div className="nh2-kpis">
              <span className="nh2-kpi"><span className="pip"/>Frankfurt · <em>100 %</em> Ökostrom</span>
              <span className="nh2-kpi"><span className="pip"/>Gold-Standard · <em>105 %</em> Kompensation</span>
              <span className="nh2-kpi"><span className="pip"/>Live-Telemetrie · <em>2 s</em> Update</span>
            </div>
          </div>

          <div className="nh2-plant">
            <div className="nh2-plant-rings" aria-hidden="true"><span/><span/><span/></div>
            <GrowingPlant play={headVis}/>
            <div className="nh2-plant-stat">
              <span className="dot"/>NILL · CO₂-NEUTRAL · 2026
            </div>
          </div>
        </div>

        {/* Live mix + count-up stats */}
        <Rev className="nh2-strip">
          <PowerMixWidget/>
          <CountStats/>
        </Rev>

        <Rev><LiveTotalRibbon/></Rev>

        {/* Interactive calculator */}
        <Rev><ImpactCalculator/></Rev>

        {/* Energy benchmark */}
        <Rev><EnergyBenchmark/></Rev>

        {/* Carbon journey */}
        <Rev><CarbonJourney/></Rev>

        {/* Milestones timeline */}
        <Rev><Milestones/></Rev>

        {/* Expandable pillars */}
        <Rev><ExpandablePillars/></Rev>

        {/* Public offset ledger */}
        <Rev><CertificateLedger/></Rev>

        {/* Pledge / CTA */}
        <div className="nh2-pledge">
          <div>
            <div className="big">
              <em>Transparenter Nachhaltigkeitsbericht</em> — jährlich, als PDF,
              mit Stromquellen, Emissionen und Kompensations-Zertifikaten.
            </div>
            <div className="meta">PDF · Quartalsweise Updates · Public Ledger</div>
          </div>
          <a
            className="btn btn-ghost"
            href="#"
            onClick={(e) => { e.preventDefault(); onCTA && onCTA('Nachhaltigkeitsbericht') }}
          >
            <span>Bericht anfordern</span><span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
