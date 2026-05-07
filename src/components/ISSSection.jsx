
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

function ISSModel() {
  const ref = useRef()

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.08
  })

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[2,1,1]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  )
}

function CinematicSequence() {
  const station = useRef()
  const { camera } = useThree()

  useEffect(() => {

    camera.position.set(0, 0, 14)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.iss-sequence',
        start: 'top top',
        end: '+=7000',
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
      }
    })

    // PHASE 1
    tl.to(station.current.rotation, {
      y: Math.PI * 0.6,
      duration: 2,
      ease: 'power2.inOut'
    })

    // PHASE 2
    tl.to(station.current.rotation, {
      y: Math.PI * 1.3,
      x: 0.2,
      duration: 2.5,
      ease: 'power2.inOut'
    })

    // PHASE 3
    tl.to(station.current.position, {
      y: -3,
      z: -8,
      duration: 3,
      ease: 'power2.inOut'
    })

    // MODULES
    tl.to('.module-1', {
      opacity: 1,
      y: 0,
      duration: 1.2,
    }, '-=2')

    tl.to('.module-2', {
      opacity: 1,
      y: 0,
      duration: 1.2,
    }, '+=1')

    tl.to('.module-3', {
      opacity: 1,
      y: 0,
      duration: 1.2,
    }, '+=1')

    // FINAL ZOOM OUT
    tl.to(camera.position, {
      z: 80,
      duration: 6,
      ease: 'power2.inOut'
    }, '-=1')

    tl.to(station.current.scale, {
      x: 0.15,
      y: 0.15,
      z: 0.15,
      duration: 6,
      ease: 'power2.inOut'
    }, '<')

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }

  }, [])

  useFrame((state) => {

    if (!station.current) return

    const t = state.clock.elapsedTime

    station.current.position.x =
      Math.sin(t * 2) * 0.08

    camera.lookAt(
      station.current.position.x,
      station.current.position.y,
      station.current.position.z
    )

  })

  return (
    <group ref={station}>
      <ISSModel />
    </group>
  )
}

export default function ISSSection() {

  return (
    <section className="iss-sequence">

      <Canvas camera={{ fov: 45 }}>

        <color attach="background" args={['#000']} />

        <ambientLight intensity={0.7} />

        <directionalLight
          position={[5,5,5]}
          intensity={2}
        />

        <Stars
          radius={300}
          depth={80}
          count={10000}
          factor={4}
          saturation={0}
          fade
          speed={0.4}
        />

        <CinematicSequence />

      </Canvas>

      <div className="modules-layer">

        <div className="module module-1">
          <h2>Orbital Intelligence</h2>
          <p>
            Advanced infrastructure monitoring and telemetry.
          </p>
        </div>

        <div className="module module-2">
          <h2>Adaptive Systems</h2>
          <p>
            Self-healing distributed architecture at scale.
          </p>
        </div>

        <div className="module module-3">
          <h2>Deep Space Compute</h2>
          <p>
            Autonomous compute orchestration beyond Earth orbit.
          </p>
        </div>

      </div>

    </section>
  )
}
