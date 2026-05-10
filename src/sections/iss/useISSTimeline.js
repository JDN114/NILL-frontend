import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * 26-unit cinematic timeline mapped to 9000px scroll
 *
 * Labels:
 *   idle      0    — orbital float, camera at rest
 *   alignment 2    — deliberate mechanical reorientation
 *   ignition  5    — thrusters glow, vibration
 *   reveal1   7.5  — card 1 enters
 *   reveal2   11.5 — card 2 enters
 *   reveal3   15.5 — card 3 enters
 *   pullback  20   — deep-space zoom out
 *   handoff   24   — transition to next section
 */
export function useISSTimeline({
  sectionRef,
  stationProxy,
  cameraProxy,
  lookProxy,
  thrusterProxy,
  card1Ref,
  card2Ref,
  card3Ref,
  onPhaseChange,
}) {
  useEffect(() => {
    const section = sectionRef.current
    const card1 = card1Ref.current
    const card2 = card2Ref.current
    const card3 = card3Ref.current
    if (!section || !card1 || !card2 || !card3) return

    // Initialize cards hidden with blur
    gsap.set([card1, card2, card3], {
      opacity: 0,
      y: 40,
      scale: 0.93,
      filter: 'blur(10px)',
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=9000',
        scrub: 1.8,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate(self) {
          const p = self.progress
          if (onPhaseChange) {
            if      (p < 0.077)  onPhaseChange('idle',      self.progress)
            else if (p < 0.192)  onPhaseChange('alignment', self.progress)
            else if (p < 0.288)  onPhaseChange('ignition',  self.progress)
            else if (p < 0.442)  onPhaseChange('reveal1',   self.progress)
            else if (p < 0.596)  onPhaseChange('reveal2',   self.progress)
            else if (p < 0.769)  onPhaseChange('reveal3',   self.progress)
            else if (p < 0.923)  onPhaseChange('pullback',  self.progress)
            else                 onPhaseChange('handoff',   self.progress)
          }
        },
      },
    })

    // ── PHASE 1: ORBITAL IDLE (0–2) ──────────────────────────────────
    tl.addLabel('idle', 0)
    // Camera gently closes in while station drifts
    tl.fromTo(cameraProxy, { z: 16 }, { z: 13, duration: 2, ease: 'power1.inOut' }, 'idle')
    tl.fromTo(stationProxy, { y: 0 }, { y: 0.15, duration: 2, ease: 'sine.inOut' }, 'idle')

    // ── PHASE 2: ALIGNMENT (2–5) ─────────────────────────────────────
    tl.addLabel('alignment', 2)
    // Deliberate rotation — mechanical, not fast
    tl.to(stationProxy, {
      rotY: Math.PI * 0.55,
      rotX: 0.08,
      duration: 3,
      ease: 'power2.inOut',
    }, 'alignment')
    // Camera arcs slightly to the right to reveal the truss spine
    tl.to(cameraProxy, {
      x: 1.2,
      z: 12,
      duration: 3,
      ease: 'power2.inOut',
    }, 'alignment')
    tl.to(lookProxy, {
      x: 0.4,
      duration: 3,
      ease: 'power2.inOut',
    }, 'alignment')

    // ── PHASE 3: THRUST IGNITION (5–7.5) ─────────────────────────────
    tl.addLabel('ignition', 5)
    // Thruster intensity up
    tl.to(thrusterProxy, {
      intensity: 1,
      duration: 1.2,
      ease: 'power3.in',
    }, 'ignition')
    // Station pushes forward slightly (acceleration feel)
    tl.to(stationProxy, {
      z: -1.2,
      rotX: 0.15,
      duration: 2.5,
      ease: 'power2.inOut',
    }, 'ignition')
    // Camera follows the thrust vector
    tl.to(cameraProxy, {
      x: 0.6,
      y: 0.8,
      z: 11,
      duration: 2.5,
      ease: 'power2.inOut',
    }, 'ignition')

    // ── PHASE 4: MODULE REVEAL 1 (7.5–11.5) ──────────────────────────
    tl.addLabel('reveal1', 7.5)
    // Thrusters fade — we're coasting
    tl.to(thrusterProxy, {
      intensity: 0.25,
      duration: 2,
      ease: 'power2.out',
    }, 'reveal1')
    // Station settles into a profile view
    tl.to(stationProxy, {
      rotY: Math.PI * 0.8,
      rotX: 0.05,
      z: -0.5,
      y: -0.3,
      duration: 3,
      ease: 'power2.inOut',
    }, 'reveal1')
    tl.to(cameraProxy, {
      x: -0.5,
      y: 0.3,
      z: 11.5,
      duration: 3,
      ease: 'power2.inOut',
    }, 'reveal1')
    // Card 1 enters
    tl.fromTo(card1,
      { opacity: 0, y: 40, scale: 0.93, filter: 'blur(10px)' },
      { opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)', duration: 2, ease: 'power2.out' },
      'reveal1+=0.6'
    )
    // Card 1 exits before card 2
    tl.to(card1, {
      opacity: 0,
      y: -30,
      scale: 0.96,
      filter: 'blur(6px)',
      duration: 1.2,
      ease: 'power2.in',
    }, 'reveal1+=3.2')

    // ── PHASE 5: MODULE REVEAL 2 (11.5–15.5) ─────────────────────────
    tl.addLabel('reveal2', 11.5)
    tl.to(stationProxy, {
      rotY: Math.PI * 1.1,
      rotX: -0.06,
      duration: 3,
      ease: 'power2.inOut',
    }, 'reveal2')
    tl.to(cameraProxy, {
      x: 0.8,
      y: -0.2,
      z: 12,
      duration: 3,
      ease: 'power2.inOut',
    }, 'reveal2')
    tl.fromTo(card2,
      { opacity: 0, y: 40, scale: 0.93, filter: 'blur(10px)' },
      { opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)', duration: 2, ease: 'power2.out' },
      'reveal2+=0.6'
    )
    tl.to(card2, {
      opacity: 0,
      y: -30,
      scale: 0.96,
      filter: 'blur(6px)',
      duration: 1.2,
      ease: 'power2.in',
    }, 'reveal2+=3.2')

    // ── PHASE 6: MODULE REVEAL 3 (15.5–20) ───────────────────────────
    tl.addLabel('reveal3', 15.5)
    tl.to(stationProxy, {
      rotY: Math.PI * 1.45,
      rotX: 0.1,
      duration: 3.5,
      ease: 'power2.inOut',
    }, 'reveal3')
    tl.to(cameraProxy, {
      x: -0.4,
      y: 0.6,
      z: 12.5,
      duration: 3.5,
      ease: 'power2.inOut',
    }, 'reveal3')
    tl.fromTo(card3,
      { opacity: 0, y: 40, scale: 0.93, filter: 'blur(10px)' },
      { opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)', duration: 2, ease: 'power2.out' },
      'reveal3+=0.6'
    )
    tl.to(card3, {
      opacity: 0,
      y: -30,
      scale: 0.96,
      filter: 'blur(6px)',
      duration: 1.2,
      ease: 'power2.in',
    }, 'reveal3+=3.4')

    // ── PHASE 7: DEEP-SPACE PULLBACK (20–24) ─────────────────────────
    tl.addLabel('pullback', 20)
    // Thrusters off entirely
    tl.to(thrusterProxy, {
      intensity: 0,
      duration: 1.5,
      ease: 'power2.out',
    }, 'pullback')
    // Camera pulls far back — ISS becomes a speck
    tl.to(cameraProxy, {
      x: 0,
      y: 2,
      z: 90,
      duration: 4,
      ease: 'power3.inOut',
    }, 'pullback')
    // Station scales down and levels out to full-profile
    tl.to(stationProxy, {
      scaleX: 0.12,
      scaleY: 0.12,
      scaleZ: 0.12,
      rotY: Math.PI * 1.8,
      rotX: 0,
      y: 0,
      z: 0,
      duration: 4,
      ease: 'power3.inOut',
    }, 'pullback')

    // ── PHASE 8: HANDOFF (24–26) ──────────────────────────────────────
    tl.addLabel('handoff', 24)
    // Section fades to black — seamless cut to next section
    tl.to(section, {
      opacity: 0,
      duration: 2,
      ease: 'power2.inOut',
    }, 'handoff')

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, []) // refs are stable after mount
}
