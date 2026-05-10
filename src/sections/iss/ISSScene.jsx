console.log("ISSScene mounted")
import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { ISSModel } from './ISSModel'

// Reads cameraProxy each frame and applies to Three.js camera with ambient drift
function CameraRig({ cameraProxy, lookProxy }) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, cameraProxy.z ?? 16)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const driftX = Math.sin(t * 0.19) * 0.06
    const driftY = Math.sin(t * 0.13) * 0.04

    camera.position.x = (cameraProxy.x ?? 0) + driftX
    camera.position.y = (cameraProxy.y ?? 0) + driftY
    camera.position.z = cameraProxy.z ?? 16

    camera.lookAt(
      (lookProxy.x ?? 0) + Math.sin(t * 0.17) * 0.03,
      lookProxy.y ?? 0,
      lookProxy.z ?? 0,
    )
  })

  return null
}

// Reads stationProxy each frame and applies to ISSModel group with micro-drift
function StationAnimator({ stationProxy, issRef, thrusterProxy, activeModule }) {
  useFrame(({ clock }) => {
    const g = issRef.current
    if (!g) return
    const t = clock.elapsedTime

    // Orbital micro-drift — sinusoidal float independent of scroll
    const floatY = Math.sin(t * 0.23) * 0.055
    const floatX = Math.sin(t * 0.31) * 0.04
    const floatZ = Math.sin(t * 0.17) * 0.03

    g.position.x = (stationProxy.x ?? 0) + floatX
    g.position.y = (stationProxy.y ?? 0) + floatY
    g.position.z = (stationProxy.z ?? 0) + floatZ

    g.rotation.y = (stationProxy.rotY ?? 0) + Math.sin(t * 0.09) * 0.008
    g.rotation.x = (stationProxy.rotX ?? 0) + Math.sin(t * 0.07) * 0.005
    g.rotation.z = Math.sin(t * 0.11) * 0.004

    const s = stationProxy.scaleX ?? 1
    g.scale.set(s, s, s)
  })

  return null
}

export function ISSScene({ stationProxy, cameraProxy, lookProxy, thrusterProxy, activeModule }) {
  const issRef = useRef()

  return (
    <Canvas
#      camera={{ fov: 42, near: 0.1, far: 1000 }}
#      gl={{ antialias: true, alpha: false }}
#      style={{ position: 'absolute', inset: 0 }}
#    >
#      <color attach="background" args={['#040407']} />

#      {/* Stars — distant cosmic backdrop */}
#      <Stars
#        radius={350}
#        depth={90}
#        count={12000}
#        factor={4}
#        saturation={0.1}
#        fade
#        speed={0.25}
#      />

#      {/* Sunlight from upper-left — key light */}
#      <directionalLight
#        position={[12, 8, 6]}
#        intensity={2.8}
#        color="#fff8f0"
#      />

#      {/* Earthshine fill — soft blue-green from below */}
#      <directionalLight
#        position={[-4, -6, 4]}
#        intensity={0.55}
#        color="#3a7fd5"
#      />

#      {/* Ambient — barely-there space glow */}
#      <ambientLight intensity={0.18} color="#101828" />

#      <ISSModel
#        ref={issRef}
#        thrusterIntensity={thrusterProxy?.intensity ?? 0}
#        activeModule={activeModule ?? -1}
#      />

#      <StationAnimator
#        stationProxy={stationProxy}
#        issRef={issRef}
#        thrusterProxy={thrusterProxy}
#        activeModule={activeModule}
#      />

#      <CameraRig cameraProxy={cameraProxy} lookProxy={lookProxy} />
    <>
      <ambientLight intensity={5} />
    
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  )

    </Canvas>
  )
}
