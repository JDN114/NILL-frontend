import { useRef, useState } from 'react'
import { ISSScene } from './ISSScene'
import { ModuleCard } from './ModuleCard'
import { useISSTimeline } from './useISSTimeline'
import '../../styles/iss.css'

const MODULES = [
  {
    tag: 'Orbital Infrastructure',
    title: 'Intelligent\nMonitoring',
    desc: 'Advanced telemetry and observability infrastructure that adapts in real-time to changing mission parameters — zero blind spots across your entire stack.',
    stats: [
      { n: '99.999%', l: 'uptime' },
      { n: '<2ms',    l: 'latency' },
      { n: '10TB/s',  l: 'throughput' },
    ],
  },
  {
    tag: 'Distributed Systems',
    title: 'Adaptive\nArchitecture',
    desc: 'Self-healing distributed systems that reroute, rebalance, and recover without human intervention — engineered for environments where failure is not an option.',
    stats: [
      { n: '400+',  l: 'nodes' },
      { n: '0.4ms', l: 'failover' },
      { n: '∞',     l: 'scale' },
    ],
  },
  {
    tag: 'Autonomous Compute',
    title: 'Deep Space\nOrchestration',
    desc: 'Compute workloads that schedule, migrate, and terminate themselves based on mission priority — the infrastructure disappears so your product can shine.',
    stats: [
      { n: '1200+', l: 'deploys/day' },
      { n: '60%',   l: 'cost reduction' },
      { n: '3s',    l: 'cold start' },
    ],
  },
]

// Proxy objects mutated by GSAP — never triggers React re-renders
const stationProxy  = { x: 0, y: 0, z: 0, rotY: 0, rotX: 0, scaleX: 1, scaleY: 1, scaleZ: 1 }
const cameraProxy   = { x: 0, y: 0, z: 16 }
const lookProxy     = { x: 0, y: 0, z: 0 }
const thrusterProxy = { intensity: 0 }

export default function ISSSection() {
  const sectionRef = useRef()
  const card1Ref   = useRef()
  const card2Ref   = useRef()
  const card3Ref   = useRef()
  const cardRefs   = [card1Ref, card2Ref, card3Ref]

  const [phase, setPhase] = useState('idle')

  useISSTimeline({
    sectionRef,
    stationProxy,
    cameraProxy,
    lookProxy,
    thrusterProxy,
    card1Ref,
    card2Ref,
    card3Ref,
    onPhaseChange: setPhase,
  })

  const phaseIndex = ['idle','alignment','ignition','reveal1','reveal2','reveal3','pullback','handoff']
    .indexOf(phase)

  return (
    <section ref={sectionRef} className="iss-section">

      {/* Three.js canvas — fills the section absolutely */}
      <ISSScene
        stationProxy={stationProxy}
        cameraProxy={cameraProxy}
        lookProxy={lookProxy}
        thrusterProxy={thrusterProxy}
        activeModule={
          phase === 'reveal1' ? 0 :
          phase === 'reveal2' ? 1 :
          phase === 'reveal3' ? 2 : -1
        }
      />

      {/* Module feature cards — positioned in CSS, revealed by GSAP */}
      <div className="iss-overlay">

        {MODULES.map((m, i) => (
          <ModuleCard
            key={i}
            ref={cardRefs[i]}
            tag={m.tag}
            title={m.title}
            desc={m.desc}
            stats={m.stats}
          />
        ))}

        {/* Phase progress dots */}
        <div className="iss-progress" aria-hidden="true">
          {['idle','alignment','ignition','reveal1','reveal2','reveal3','pullback'].map((p, i) => (
            <div
              key={p}
              className={`iss-progress-dot ${phaseIndex >= i ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Scroll hint — fades out after idle phase */}
        <div className={`iss-scroll-hint ${phase !== 'idle' ? 'hidden' : ''}`}>
          <div className="iss-scroll-hint-line" />
          <span>scroll</span>
        </div>

      </div>
    </section>
  )
}
