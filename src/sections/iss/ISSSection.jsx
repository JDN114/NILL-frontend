import { useRef, useState, useMemo, useEffect } from 'react'
import { ISSScene } from './ISSScene'
import { ModuleCard } from './ModuleCard'
import { useISSTimeline } from './useISSTimeline'

import '../../styles/iss.css'

const MODULES = [
  {
    tag: 'Observation Layer',
    title: 'Intelligente\n<em>Beobachtung</em>',
    description:
      'NILL überwacht jeden Kanal wie aus der Cupola — Postfach, Belege, Lager, Schichten. Alles in einer Ansicht, ohne tote Winkel.',
    stats: [
      ['24/7', 'aktiv'],
      ['5',    'Module'],
      ['1',    'Ansicht'],
    ],
    position: 'tr',
  },
  {
    tag: 'Distributed Power',
    title: 'Adaptive\n<em>Architektur</em>',
    description:
      'Wie Solar-Arrays, die sich zur Sonne drehen — NILLs Module skalieren, balancieren und heilen sich selbst, bevor du es bemerkst.',
    stats: [
      ['DE',     'gehostet'],
      ['100 %',  'Ökostrom'],
      ['DSGVO',  'konform'],
    ],
    position: 'tl',
  },
  {
    tag: 'Deep Space Link',
    title: 'Autonome\n<em>Orchestrierung</em>',
    description:
      'Die Schüssel zeigt nach draußen — NILL spricht mit Banken, Behörden, Lieferanten. Workloads finden ihren Weg, ohne dass du ein Ticket öffnest.',
    stats: [
      ['1.200+', 'Aufgaben/Tag'],
      ['−60 %',  'Handarbeit'],
      ['0',      'Tickets'],
    ],
    position: 'br',
  },
]

export default function ISSSection() {
  const sectionRef = useRef(null)
  const issGroupRef = useRef(null)
  const cardRefs = [useRef(null), useRef(null), useRef(null)]

  const [activeCard, setActiveCard] = useState(-1)
  const [phase, setPhase] = useState('approach')
  const [loaded, setLoaded] = useState(false)
  // Canvas rendert nur, wenn die Section (fast) im Viewport ist — sonst läuft
  // der WebGL-Loop beim Scrollen durch andere Sections weiter und erzeugt Lag
  const [inView, setInView] = useState(false)

  const [coords, setCoords] = useState({ x: '0.00', y: '0.00', z: '0.00' })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: '25% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const stationProxy  = useMemo(() => ({ rotX: 0, rotY: 0, rotZ: 0 }), [])
  const cameraProxy   = useMemo(() => ({ x: 0, y: 1.6, z: 30 }), [])
  const lookProxy     = useMemo(() => ({ x: 0, y: 0, z: 0 }), [])
  const thrusterProxy = useMemo(() => ({ intensity: 0 }), [])
  const fovProxy      = useMemo(() => ({ value: 36 }), [])
  const focusProxy    = useMemo(() => ({ value: -1 }), [])

  useISSTimeline({
    sectionRef,
    issGroupRef,
    stationProxy,
    cameraProxy,
    lookProxy,
    thrusterProxy,
    fovProxy,
    focusProxy,
    onCardChange: setActiveCard,
    onPhaseChange: setPhase,
    damping: 0.07,
  })

  useEffect(() => {
    if (!inView) return
    let raf = 0, last = 0
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (now - last < 120) return
      last = now
      setCoords({
        x: cameraProxy.x.toFixed(2),
        y: cameraProxy.y.toFixed(2),
        z: cameraProxy.z.toFixed(2),
      })
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [cameraProxy, inView])

  const cardState = (i) => {
    if (i === activeCard) return 'active'
    if (activeCard > i) return 'past'
    return 'future'
  }

  return (
    <section
      ref={sectionRef}
      className={`iss-section ${loaded ? 'iss-loaded' : ''}`}
      data-screen-label="ISS"
    >
      <div className="iss-sticky" data-phase={phase}>

        <div className="iss-canvas-wrap">
          <ISSScene
            active={inView}
            issGroupRef={issGroupRef}
            stationProxy={stationProxy}
            cameraProxy={cameraProxy}
            lookProxy={lookProxy}
            thrusterProxy={thrusterProxy}
            fovProxy={fovProxy}
            focusProxy={focusProxy}
            onLoaded={() => setLoaded(true)}
          />
        </div>

        <div className="iss-bar top" aria-hidden="true" />
        <div className="iss-bar bot" aria-hidden="true" />
        <div className="iss-grain" aria-hidden="true" />

        <div className="iss-hud tl">
          <div><span className="dot" />NILL · MISSION CONTROL</div>
          <div className="label">Orbital Layer · v1</div>
        </div>
        <div className="iss-hud tr">
          <div className="label">REF · NILL-OS / ISS-04</div>
          <div className="value">50° 06′ 45″ N · 8° 40′ 56″ E</div>
        </div>
        <div className="iss-hud bl">
          <div className="label">CAMERA</div>
          <div className="value">
            x <em>{coords.x}</em>&nbsp; y <em>{coords.y}</em>&nbsp; z <em>{coords.z}</em>
          </div>
        </div>
        <div className="iss-hud br">
          <div className="label">STATUS</div>
          <div className="value">
            {phase === 'approach' ? 'APPROACH — STAND-BY' :
             phase === 'reveal'   ? 'REVEAL — MODULE FOCUS' :
                                    'NOMINAL — TRACKING'}
          </div>
        </div>

        <div className="iss-intro" aria-hidden={phase !== 'approach'}>
          <div className="iss-intro-inner">
            <span className="eyebrow">
              <span className="pip" />
              NILL · MISSION CONTROL
            </span>
            <h2>
              Das Betriebssystem, das dein
              <br />
              Unternehmen <em>im Orbit</em> hält.
            </h2>
            <p>
              Stell dir NILL als Raumstation vor: ein zentrales System, das alle Module deines
              Betriebs verbindet. Beobachtung, Energie, Kommunikation — orchestriert von einer KI,
              die nie schläft.
            </p>
          </div>
        </div>

        <div className="iss-outro" aria-hidden={phase !== 'outro'}>
          <div className="iss-outro-inner">
            <span className="eyebrow">
              <span className="pip" />
              READY · LAUNCH WINDOW OPEN
            </span>
            <h2>
              Eine Plattform.
              <br />
              Ein Login. <em>Alle Module.</em>
            </h2>
            <p>
              NILL hält deinen Betrieb in der Umlaufbahn — 24/7, ohne Tickets, ohne Bauchschmerzen.
              Bereit, die Station zu betreten?
            </p>
            <a className="iss-outro-cta" href="#cta">
              Demo anfragen <span className="arrow">→</span>
            </a>
          </div>
        </div>

        <div className="iss-card-stage">
          {MODULES.map((m, i) => (
            <ModuleCard
              key={i}
              ref={cardRefs[i]}
              index={i}
              total={MODULES.length}
              tag={m.tag}
              title={m.title}
              description={m.description}
              stats={m.stats}
              position={m.position}
              state={cardState(i)}
            />
          ))}
        </div>

        <div className="iss-progress" aria-hidden="true">
          {MODULES.map((_, i) => (
            <div
              key={i}
              className={`iss-progress-dot ${
                i === activeCard ? 'active' : (i < activeCard ? 'passed' : '')
              }`}
            />
          ))}
        </div>

        <div className={`iss-scroll-hint ${phase !== 'approach' ? 'hidden' : ''}`}>
          <span>scroll · mission</span>
          <span className="iss-scroll-hint-line" />
        </div>
      </div>
    </section>
  )
}
