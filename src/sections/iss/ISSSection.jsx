import { Suspense, useRef, useState } from 'react'

import ISSScene from './ISS/ISSScene'
import ModuleCard from './ModuleCard'
import { useISSTimeline } from './useISSTimeline'

import '../../styles/iss.css'
import '../../styles/iss-sequence.css'

export default function ISSSection() {
  const sectionRef = useRef()

  const card1Ref = useRef()
  const card2Ref = useRef()
  const card3Ref = useRef()

  const [phase, setPhase] = useState('idle')
  const [loaded, setLoaded] = useState(false)

  const stationProxy = useRef({
    rotX: 0,
    rotY: 0,
    z: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
  })

  const cameraProxy = useRef({
    x: 0,
    y: 0,
    z: 16,
  })

  const lookProxy = useRef({
    x: 0,
    y: 0,
    z: 0,
  })

  const thrusterProxy = useRef({
    intensity: 0,
  })

  useISSTimeline({
    sectionRef,
    stationProxy: stationProxy.current,
    cameraProxy: cameraProxy.current,
    lookProxy: lookProxy.current,
    thrusterProxy: thrusterProxy.current,

    card1Ref,
    card2Ref,
    card3Ref,

    onPhaseChange: setPhase,
  })

  return (
    <section ref={sectionRef} className={`iss-section ${loaded ? 'iss-loaded' : ''}`}>
      <Suspense fallback={null}>
      <ISSScene onLoaded={() => setLoaded(true)}
        stationProxy={stationProxy.current}
        cameraProxy={cameraProxy.current}
        lookProxy={lookProxy.current}
        thrusterProxy={thrusterProxy.current}
      />
      </Suspense>

      <div className="iss-overlay">

        <div ref={card1Ref}>
          <ModuleCard
            tag="ORBITAL AI"
            title={'Persistent\nInfrastructure'}
            description="A cinematic orbital system visualizing autonomous intelligence layers operating continuously in deep space."
            stats={[
              ['99.99%', 'uptime'],
              ['24/7', 'processing'],
            ]}
          />
        </div>

        <div ref={card2Ref}>
          <ModuleCard
            tag="SYNTHETIC NETWORK"
            title={'Adaptive\nNavigation'}
            description="Dynamic AI routing and spatial orchestration responding in real time to interaction and movement."
            stats={[
              ['4ms', 'latency'],
              ['∞', 'scale'],
            ]}
          />
        </div>

        <div ref={card3Ref}>
          <ModuleCard
            tag="DEEP SPACE SYSTEM"
            title={'Autonomous\nExpansion'}
            description="The station evolves while the camera pulls into deep space — transitioning seamlessly into the next narrative layer."
            stats={[
              ['AI', 'core'],
              ['3D', 'world'],
            ]}
          />
        </div>

      </div>

      <div className="iss-progress">
        {['idle','alignment','ignition'].map((p) => (
          <div
            key={p}
            className={`iss-progress-dot ${phase === p ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className={`iss-scroll-hint ${phase !== 'idle' ? 'hidden' : ''}`}>
        <div className="iss-scroll-hint-line" />
        <span>Scroll</span>
      </div>
    </section>
  )
}
