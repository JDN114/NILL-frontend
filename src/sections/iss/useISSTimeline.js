import { useEffect } from 'react'

const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, a, b) => v < a ? a : v > b ? b : v
const smoothstep5 = t => {
  const x = clamp(t, 0, 1)
  return x * x * x * (x * (x * 6 - 15) + 10)
}

export const WAYPOINTS = [
  // 0 — DEEP APPROACH
  { p: 0.00, cam: { x: 0,    y: 1.6,  z: 28 },  look: { x: 0,    y: 0,     z: 0    }, rotX: 0.05, rotY: 0.20,  rotZ: 0.00,  fov: 36, thruster: 0,    focus: -1, card: -1, phase: 'approach' },
  // 1 — ALIGNMENT
  { p: 0.10, cam: { x: 0,    y: 0.7,  z: 13.5 },look: { x: 0,    y: 0.1,   z: 0    }, rotX: 0.18, rotY: 0.85,  rotZ: 0.04,  fov: 40, thruster: 0.25, focus: -1, card: -1, phase: 'active' },
  // 2 — CUPOLA close-up
  { p: 0.26, cam: { x: -1.9, y: 1.8,  z: 6.4 }, look: { x: 0,    y: 0.6,   z: 0.2  }, rotX:-0.06, rotY: 1.55,  rotZ:-0.04,  fov: 38, thruster: 0,    focus: 0,  card: 0,  phase: 'reveal' },
  // 3 — SOLAR ARRAYS
  { p: 0.46, cam: { x: 3.6,  y: -0.1, z: 8.0 }, look: { x: -0.4, y: 1.4,   z: 0    }, rotX: 0.08, rotY: 2.55,  rotZ: 0.08,  fov: 44, thruster: 0,    focus: 1,  card: 1,  phase: 'reveal' },
  // 4 — COMMS DISH
  { p: 0.66, cam: { x: -2.3, y: -0.6, z: 6.6 }, look: { x: 0.4,  y: -0.05, z: 0.9  }, rotX: 0.18, rotY: 3.45,  rotZ:-0.05,  fov: 36, thruster: 0,    focus: 2,  card: 2,  phase: 'reveal' },
  // 5 — EPIC PULLBACK
  { p: 0.86, cam: { x: 0,    y: 2.9,  z: 19.5 },look: { x: 0,    y: -0.8,  z: -1.8 }, rotX: 0.28, rotY: 4.25,  rotZ:-0.05,  fov: 46, thruster: 0.55, focus: -1, card: -1, phase: 'outro' },
  // 6 — DRIFT-OUT
  { p: 1.00, cam: { x: 0,    y: 3.4,  z: 23 },  look: { x: 0,    y: -1.1,  z: -2.4 }, rotX: 0.30, rotY: 4.45,  rotZ:-0.06,  fov: 48, thruster: 0.25, focus: -1, card: -1, phase: 'outro' },
]

function sampleWaypoints(p) {
  let i = 0
  while (i < WAYPOINTS.length - 2 && p > WAYPOINTS[i + 1].p) i++
  const a = WAYPOINTS[i]
  const b = WAYPOINTS[Math.min(i + 1, WAYPOINTS.length - 1)]
  const span = b.p - a.p
  const local = span > 1e-5 ? smoothstep5((p - a.p) / span) : 0

  return {
    cam:   { x: lerp(a.cam.x,  b.cam.x,  local), y: lerp(a.cam.y,  b.cam.y,  local), z: lerp(a.cam.z,  b.cam.z,  local) },
    look:  { x: lerp(a.look.x, b.look.x, local), y: lerp(a.look.y, b.look.y, local), z: lerp(a.look.z, b.look.z, local) },
    rotX:  lerp(a.rotX, b.rotX, local),
    rotY:  lerp(a.rotY, b.rotY, local),
    rotZ:  lerp(a.rotZ, b.rotZ, local),
    fov:   lerp(a.fov,  b.fov,  local),
    thruster: lerp(a.thruster, b.thruster, local),
    focus: local > 0.55 ? b.focus : a.focus,
    card:  local > 0.55 ? b.card  : a.card,
    phase: local > 0.55 ? b.phase : a.phase,
  }
}

export function useISSTimeline({
  sectionRef,
  issGroupRef,
  stationProxy,
  cameraProxy,
  lookProxy,
  thrusterProxy,
  fovProxy,
  focusProxy,
  onPhaseChange,
  onCardChange,
  damping = 0.07,
} = {}) {
  useEffect(() => {
    if (!sectionRef?.current) return

    let raf = 0
    let rawP = 0
    let smoothP = 0
    let lastCard = -2
    let lastPhase = ''
    let mounted = true
    let debugFrame = 0

    // getBoundingClientRect reflects any scroll container (window or inner div).
    // Called inside RAF so the DOM is always in a fully-settled, consistent state —
    // zoom transitions included. No resize listener needed: within a single RAF
    // frame both r.top and total scale proportionally with any browser zoom,
    // so rawP stays invariant.
    const recomputeRaw = () => {
      const el = sectionRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = document.documentElement.clientHeight || window.innerHeight
      const total = el.offsetHeight - vh
      if (total <= 0) { rawP = 0; return }
      rawP = clamp(-r.top / total, 0, 1)
    }

    const tick = () => {
      if (!mounted) return
      raf = requestAnimationFrame(tick)

      // Poll every frame — works for window scroll, inner-div scroll, and
      // any other scroll container. No dependency on scroll/resize events.
      recomputeRaw()

      // DEBUG — remove after diagnosing
      if (debugFrame++ % 60 === 0) {
        const el = sectionRef.current
        if (el) {
          const r = el.getBoundingClientRect()
          const vh = document.documentElement.clientHeight || window.innerHeight
          console.log('[ISS]', {
            scrollY: window.scrollY,
            rTop: r.top.toFixed(1),
            offsetH: el.offsetHeight,
            vh,
            total: el.offsetHeight - vh,
            rawP: rawP.toFixed(3),
          })
        }
      }

      smoothP = lerp(smoothP, rawP, damping)
      if (Math.abs(smoothP - rawP) < 1e-4) smoothP = rawP

      const s = sampleWaypoints(smoothP)
      const t = performance.now() / 1000

      if (cameraProxy)   { cameraProxy.x   = s.cam.x;  cameraProxy.y   = s.cam.y;  cameraProxy.z = s.cam.z }
      if (lookProxy)     { lookProxy.x     = s.look.x; lookProxy.y     = s.look.y; lookProxy.z   = s.look.z }
      if (stationProxy)  { stationProxy.rotX = s.rotX; stationProxy.rotY = s.rotY; stationProxy.rotZ = s.rotZ }
      if (thrusterProxy) { thrusterProxy.intensity = s.thruster }
      if (fovProxy)      { fovProxy.value = s.fov }
      if (focusProxy)    { focusProxy.value = s.focus }

      // Apply rotation directly to the Three.js group — same tick as camera, guaranteed in sync
      const g = issGroupRef?.current
      if (g) {
        g.position.x = Math.sin(t * 0.31) * 0.04
        g.position.y = Math.sin(t * 0.23) * 0.055
        g.position.z = Math.sin(t * 0.17) * 0.03
        g.rotation.x = s.rotX + Math.sin(t * 0.07) * 0.005
        g.rotation.y = s.rotY + Math.sin(t * 0.09) * 0.008
        g.rotation.z = s.rotZ + Math.sin(t * 0.11) * 0.004
      }

      if (s.card !== lastCard) {
        lastCard = s.card
        onCardChange && onCardChange(s.card)
      }
      if (s.phase !== lastPhase) {
        lastPhase = s.phase
        onPhaseChange && onPhaseChange(s.phase)
      }
    }

    raf = requestAnimationFrame(tick)

    return () => {
      mounted = false
      cancelAnimationFrame(raf)
    }
  }, [sectionRef, issGroupRef, stationProxy, cameraProxy, lookProxy, thrusterProxy, fovProxy, focusProxy, onPhaseChange, onCardChange, damping])
}
