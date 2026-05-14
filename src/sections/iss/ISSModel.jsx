import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Procedural texture builders ─────────────────────────────── */
function mkHullTex() {
  const w = 1024, h = 512
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const g = c.getContext('2d')
  g.fillStyle = '#d4d6dc'; g.fillRect(0, 0, w, h)
  for (let i = 0; i < 2400; i++) {
    g.fillStyle = `rgba(${100 + (Math.random() * 40 | 0)},${100 + (Math.random() * 40 | 0)},${110 + (Math.random() * 40 | 0)},${.08 + Math.random() * .12})`
    g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1)
  }
  g.strokeStyle = 'rgba(20,22,28,.55)'; g.lineWidth = 1.2
  for (let x = 0; x < w; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke() }
  for (let y = 0; y < h; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke() }
  g.fillStyle = 'rgba(40,44,52,.7)'
  for (let x = 8; x < w; x += 32) for (let y = 8; y < h; y += 32) g.fillRect(x, y, 1.5, 1.5)
  for (let i = 0; i < 14; i++) {
    const bx = Math.random() * (w - 180), by = Math.random() * (h - 90)
    const bw = 80 + Math.random() * 100, bh = 40 + Math.random() * 60
    g.strokeStyle = 'rgba(15,17,22,.7)'; g.lineWidth = 2; g.strokeRect(bx, by, bw, bh)
    g.fillStyle = 'rgba(50,55,65,.18)'; g.fillRect(bx, by, bw, bh)
  }
  for (let i = 0; i < 60; i++) {
    g.fillStyle = `rgba(${30 + (Math.random() * 40 | 0)},${28 + (Math.random() * 30 | 0)},${28 + (Math.random() * 30 | 0)},${.15 + Math.random() * .25})`
    g.fillRect(Math.random() * w, Math.random() * h, 30 + Math.random() * 120, 1 + Math.random() * 3)
  }
  g.fillStyle = 'rgba(220,200,40,.55)'; g.font = 'bold 14px monospace'
  ;['CAUTION', 'HATCH-A4', 'MOD-7', 'EXT-VENT', 'HIGH-V', 'NILL-OS'].forEach((s, i) =>
    g.fillText(s, 60 + i * 160, 40 + (i % 2) * 220))
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.anisotropy = 8
  return tex
}

function mkSolarTex() {
  const w = 512, h = 256
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const g = c.getContext('2d')
  const grd = g.createLinearGradient(0, 0, w, h)
  grd.addColorStop(0, '#0a1840'); grd.addColorStop(.5, '#1a3878'); grd.addColorStop(1, '#0a1d54')
  g.fillStyle = grd; g.fillRect(0, 0, w, h)
  const cw = 32, ch = 32
  for (let x = 0; x < w; x += cw) {
    for (let y = 0; y < h; y += ch) {
      const v = .8 + Math.random() * .3
      g.fillStyle = `rgba(${30 * v | 0},${60 * v | 0},${140 * v | 0},.95)`
      g.fillRect(x + 1, y + 1, cw - 2, ch - 2)
      const s = g.createLinearGradient(x, y, x + cw, y + ch)
      s.addColorStop(0, 'rgba(120,180,255,.18)')
      s.addColorStop(.5, 'rgba(255,255,255,.05)')
      s.addColorStop(1, 'rgba(20,40,90,.2)')
      g.fillStyle = s; g.fillRect(x + 1, y + 1, cw - 2, ch - 2)
      g.fillStyle = 'rgba(180,190,210,.4)'
      g.fillRect(x + cw / 2 - .5, y + 1, 1, ch - 2)
    }
  }
  g.strokeStyle = 'rgba(8,12,28,.85)'; g.lineWidth = 1
  for (let x = 0; x <= w; x += cw) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke() }
  for (let y = 0; y <= h; y += ch) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke() }
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 8
  return tex
}

function mkHaloTex() {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(.3, 'rgba(255,255,255,.5)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function mkWindowTex() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 64
  const g = c.getContext('2d'); g.fillStyle = '#181a20'; g.fillRect(0, 0, 512, 64)
  for (let i = 0; i < 24; i++) {
    const x = 20 + i * 20
    const grd = g.createRadialGradient(x + 6, 32, 0, x + 6, 32, 12)
    grd.addColorStop(0, 'rgba(255,240,200,1)')
    grd.addColorStop(.4, 'rgba(180,220,255,.85)')
    grd.addColorStop(1, 'rgba(40,80,160,0)')
    g.fillStyle = grd; g.fillRect(x - 6, 16, 24, 32)
    g.strokeStyle = '#2a2d35'; g.lineWidth = 2; g.strokeRect(x, 22, 12, 20)
  }
  return new THREE.CanvasTexture(c)
}

/* ─── Build full ISS geometry into a Group ────────────────────── */
function buildISSIntoGroup(rootGroup) {
  const T = THREE
  const hullTex   = mkHullTex()
  const solarTex  = mkSolarTex()
  const haloTex   = mkHaloTex()
  const winTex    = mkWindowTex()

  const hullMat     = new T.MeshStandardMaterial({ map: hullTex, color: 0xffffff, metalness: .65, roughness: .42 })
  const hullMatDark = new T.MeshStandardMaterial({ map: hullTex, color: 0x9aa0b0, metalness: .7, roughness: .5 })
  const accentMat   = new T.MeshStandardMaterial({ color: 0xc6ff3c, emissive: 0x6d8a14, emissiveIntensity: .9, metalness: .5, roughness: .35 })
  const darkMat     = new T.MeshStandardMaterial({ color: 0x1c1f26, metalness: .75, roughness: .55 })
  const goldFoilMat = new T.MeshStandardMaterial({ color: 0xc8a04a, metalness: .85, roughness: .25, emissive: 0x3a2a08, emissiveIntensity: .15 })
  const panelMat    = new T.MeshStandardMaterial({ map: solarTex, metalness: .7, roughness: .35, emissive: 0x0a1838, emissiveIntensity: .18, side: T.DoubleSide })
  const winMat      = new T.MeshBasicMaterial({ map: winTex, transparent: true, opacity: .95 })

  /* HUB */
  const hubGroup = new T.Group()
  rootGroup.add(hubGroup)
  ;[-1, 0, 1].forEach((seg, i) => {
    const m = new T.Mesh(new T.CylinderGeometry(.88, .88, .92, 32), hullMat)
    m.rotation.z = Math.PI / 2; m.position.x = seg * 1.0; hubGroup.add(m)
    if (i < 2) {
      const flange = new T.Mesh(new T.CylinderGeometry(.94, .94, .12, 32), goldFoilMat)
      flange.rotation.z = Math.PI / 2; flange.position.x = seg * 1.0 + .5; hubGroup.add(flange)
    }
    const wstrip = new T.Mesh(new T.CylinderGeometry(.881, .881, .22, 32, 1, true), winMat)
    wstrip.rotation.z = Math.PI / 2; wstrip.position.x = seg * 1.0; hubGroup.add(wstrip)
  })
  ;[-1.5, 1.5].forEach(x => {
    const cap = new T.Mesh(new T.SphereGeometry(.88, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), hullMat)
    cap.rotation.z = x > 0 ? -Math.PI / 2 : Math.PI / 2; cap.position.x = x; hubGroup.add(cap)
  })

  /* CUPOLA */
  const cupolaGroup = new T.Group(); cupolaGroup.position.y = .82
  cupolaGroup.add(new T.Mesh(new T.CylinderGeometry(.32, .38, .15, 24), hullMat))
  const cupolaDome = new T.Mesh(
    new T.SphereGeometry(.3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new T.MeshStandardMaterial({
      color: 0x4a78b8, metalness: .9, roughness: .08,
      emissive: 0x3a5878, emissiveIntensity: .45,
      transparent: true, opacity: .88,
    }),
  )
  cupolaDome.position.y = .075; cupolaGroup.add(cupolaDome)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    const strut = new T.Mesh(new T.BoxGeometry(.012, .3, .012), darkMat)
    strut.position.set(Math.cos(a) * .27, .075, Math.sin(a) * .27)
    strut.rotation.y = -a; cupolaGroup.add(strut)
  }
  hubGroup.add(cupolaGroup)

  /* SIDE PRESSURISED MODULES */
  ;[-2.55, 2.55].forEach(x => {
    const modGroup = new T.Group(); modGroup.position.x = x
    const m = new T.Mesh(new T.CylinderGeometry(.58, .58, 1.5, 24), hullMat)
    m.rotation.z = Math.PI / 2; modGroup.add(m)
    const cap = new T.Mesh(new T.SphereGeometry(.58, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), goldFoilMat)
    cap.rotation.z = x > 0 ? -Math.PI / 2 : Math.PI / 2
    cap.position.x = x > 0 ? .75 : -.75; modGroup.add(cap)
    const rim = new T.Mesh(new T.TorusGeometry(.58, .03, 8, 24), accentMat)
    rim.rotation.y = Math.PI / 2; rim.position.x = x > 0 ? .75 : -.75; modGroup.add(rim)
    const wstrip = new T.Mesh(new T.CylinderGeometry(.581, .581, .18, 24, 1, true), winMat)
    wstrip.rotation.z = Math.PI / 2; modGroup.add(wstrip)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const greeble = new T.Mesh(new T.BoxGeometry(.08, .04, .15), darkMat)
      greeble.position.set((Math.random() - .5) * 1.0, Math.cos(angle) * .6, Math.sin(angle) * .6)
      greeble.lookAt(greeble.position.x, 0, 0); modGroup.add(greeble)
    }
    const eqBox = new T.Mesh(new T.BoxGeometry(.4, .15, .12), darkMat)
    eqBox.position.set(0, -.62, 0); modGroup.add(eqBox)
    const pipe = new T.Mesh(new T.CylinderGeometry(.04, .04, 1.4, 8), goldFoilMat)
    pipe.rotation.z = Math.PI / 2; pipe.position.set(0, .58, .15); modGroup.add(pipe)
    rootGroup.add(modGroup)
  })

  /* TRUSS SPACE-FRAMES */
  const buildTruss = (xPos, len) => {
    const tg = new T.Group(); tg.position.x = xPos
    ;[[-.13, -.13], [.13, -.13], [-.13, .13], [.13, .13]].forEach(([y, z]) => {
      const l = new T.Mesh(new T.CylinderGeometry(.018, .018, len, 6), darkMat)
      l.rotation.z = Math.PI / 2; l.position.set(0, y, z); tg.add(l)
    })
    for (let i = 0; i < 4; i++) {
      const sx = -len / 2 + (i + .5) * (len / 4)
      const d1 = new T.Mesh(new T.CylinderGeometry(.012, .012, .36, 6), darkMat)
      d1.position.set(sx, 0, 0); d1.rotation.z = Math.PI / 4; tg.add(d1)
      const d2 = new T.Mesh(new T.CylinderGeometry(.012, .012, .36, 6), darkMat)
      d2.position.set(sx, 0, 0); d2.rotation.x = Math.PI / 4; tg.add(d2)
    }
    ;[-len / 2, len / 2].forEach(ex => {
      const r = new T.Mesh(new T.TorusGeometry(.18, .015, 6, 12), darkMat)
      r.rotation.y = Math.PI / 2; r.position.x = ex; tg.add(r)
    })
    return tg
  }
  rootGroup.add(buildTruss(-1.7, .65))
  rootGroup.add(buildTruss(1.7, .65))

  /* SOLAR ARRAYS */
  ;[-1, 1].forEach(side => {
    const armGroup = new T.Group()
    const yokeBase = new T.Mesh(new T.CylinderGeometry(.13, .13, .35, 12), hullMatDark)
    yokeBase.position.y = side * .9; armGroup.add(yokeBase)
    const arm = new T.Mesh(new T.CylinderGeometry(.07, .07, 1.7, 10), hullMatDark)
    arm.position.y = side * 1.95; armGroup.add(arm)
    const gimbal = new T.Mesh(new T.SphereGeometry(.14, 16, 12), goldFoilMat)
    gimbal.position.y = side * 2.85; armGroup.add(gimbal)
    ;[-1, 1].forEach(wingX => {
      const wing = new T.Group(); wing.position.set(wingX * 2.4, side * 2.85, 0)
      const panel = new T.Mesh(new T.PlaneGeometry(4.6, 1.55, 16, 4), panelMat)
      panel.rotation.y = Math.PI / 2 * (wingX > 0 ? 1 : -1); wing.add(panel)
      const beam = new T.Mesh(new T.BoxGeometry(.08, 1.55, 4.6), hullMatDark); wing.add(beam)
      const bracket = new T.Mesh(new T.BoxGeometry(.18, .25, .25), darkMat)
      bracket.position.x = wingX > 0 ? -2.3 : 2.3; wing.add(bracket)
      armGroup.add(wing)
    })
    rootGroup.add(armGroup)
  })

  /* THERMAL RADIATOR PANELS */
  ;[-1, 1].forEach(side => {
    const rad = new T.Mesh(
      new T.PlaneGeometry(1.2, .9),
      new T.MeshStandardMaterial({ color: 0xf0f0e8, metalness: .1, roughness: .8, side: T.DoubleSide, emissive: 0x202020, emissiveIntensity: .05 }),
    )
    rad.position.set(side * 1.7, 0, .85); rad.rotation.x = Math.PI / 2; rootGroup.add(rad)
    const rib = new T.Mesh(new T.BoxGeometry(1.2, .04, .04), darkMat)
    rib.position.set(side * 1.7, 0, .85); rootGroup.add(rib)
  })

  /* DEEP-SPACE COMMS DISH */
  const dishGroup = new T.Group(); dishGroup.position.set(.4, 0, 1.0)
  const dishStem = new T.Mesh(new T.CylinderGeometry(.05, .05, .55, 10), hullMatDark)
  dishStem.position.y = .27; dishGroup.add(dishStem)
  const dishGimbal = new T.Mesh(new T.SphereGeometry(.08, 12, 10), goldFoilMat)
  dishGimbal.position.y = .55; dishGroup.add(dishGimbal)
  const dish = new T.Mesh(
    new T.SphereGeometry(.42, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.5),
    new T.MeshStandardMaterial({ color: 0xeeeee4, metalness: .4, roughness: .3, side: T.DoubleSide }),
  )
  dish.position.y = .65; dish.rotation.x = -.4; dishGroup.add(dish)
  const horn = new T.Mesh(new T.ConeGeometry(.06, .18, 10), darkMat)
  horn.position.set(0, .82, .15); horn.rotation.x = Math.PI; dishGroup.add(horn)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2
    const strut = new T.Mesh(new T.CylinderGeometry(.006, .006, .25, 6), darkMat)
    strut.position.set(Math.cos(a) * .12, .75, .08 + Math.sin(a) * .12)
    strut.rotation.x = .4; strut.rotation.z = a; dishGroup.add(strut)
  }
  rootGroup.add(dishGroup)

  /* SECONDARY ANTENNA */
  const ant2 = new T.Group(); ant2.position.set(-.6, 0, 1.0)
  const ant2Stem = new T.Mesh(new T.CylinderGeometry(.025, .025, .8, 8), darkMat)
  ant2Stem.position.y = .4; ant2.add(ant2Stem)
  const ant2Tip = new T.Mesh(new T.SphereGeometry(.04, 8, 8), accentMat)
  ant2Tip.position.y = .82; ant2.add(ant2Tip)
  rootGroup.add(ant2)

  /* DOCKING PORT */
  const dock = new T.Mesh(new T.CylinderGeometry(.32, .42, .48, 24), hullMatDark)
  dock.position.set(0, -.85, .35); dock.rotation.x = Math.PI / 2; rootGroup.add(dock)
  const dockRing = new T.Mesh(new T.TorusGeometry(.34, .04, 10, 24), accentMat)
  dockRing.position.set(0, -1.05, .35); dockRing.rotation.x = Math.PI / 2; rootGroup.add(dockRing)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    const post = new T.Mesh(new T.CylinderGeometry(.022, .022, .15, 6), darkMat)
    post.position.set(Math.cos(a) * .36, -1.05, .35 + Math.sin(a) * .36)
    post.rotation.z = -Math.PI / 2; rootGroup.add(post)
  }

  /* RCS THRUSTER QUADS */
  ;[[3.2, 0, 0], [-3.2, 0, 0], [0, 1.0, 1.0], [0, -1.0, 1.0]].forEach(([x, y, z]) => {
    const quad = new T.Group(); quad.position.set(x, y, z)
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2
      const nozzle = new T.Mesh(new T.ConeGeometry(.04, .12, 8), darkMat)
      nozzle.position.set(Math.cos(a) * .08, Math.sin(a) * .08, 0)
      nozzle.rotation.x = Math.PI / 2; quad.add(nozzle)
    }
    rootGroup.add(quad)
  })

  /* THRUSTER GLOW SPRITES */
  const thrusterGlows = []
  ;[[0, -2.9, .15], [0, -2.9, -.15], [0, -1.1, .35], [0, -1.1, -.05], [-3.2, 0, 0], [3.2, 0, 0]].forEach(([x, y, z]) => {
    const outer = new T.Sprite(new T.SpriteMaterial({ map: haloTex, color: 0x60b0ff, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }))
    outer.scale.set(2.8, 2.8, 1); outer.position.set(x, y, z); rootGroup.add(outer)
    const inner = new T.Sprite(new T.SpriteMaterial({ map: haloTex, color: 0xe8f4ff, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }))
    inner.scale.set(.7, .7, 1); inner.position.set(x, y, z); rootGroup.add(inner)
    thrusterGlows.push({ outer, inner })
  })

  /* NAV LIGHTS */
  const navLights = []
  ;[[3.4, 0, 0, 0xff3050],
    [-3.4, 0, 0, 0xc6ff3c],
    [0, 2.95, 1.2, 0xffffff],
    [0, -2.95, 1.2, 0xffffff],
    [0, 0, 1.4, 0xff8a3c],
    [0, 0, -1.4, 0x66ddff]].forEach(([x, y, z, color]) => {
    const mesh = new T.Mesh(new T.SphereGeometry(.05, 10, 10), new T.MeshBasicMaterial({ color, transparent: true }))
    mesh.position.set(x, y, z)
    const halo = new T.Sprite(new T.SpriteMaterial({ map: haloTex, color, transparent: true, opacity: .6, blending: T.AdditiveBlending, depthWrite: false }))
    halo.scale.set(.4, .4, 1); mesh.add(halo)
    rootGroup.add(mesh); navLights.push({ mesh, halo })
  })

  /* MODULE FOCUS HALOS */
  const FOCUS_ANCHORS = [
    new T.Vector3(0,    0.82,  0.20),
    new T.Vector3(-2.4, 2.85,  0.00),
    new T.Vector3(0.40, 0.65,  1.00),
  ]
  const focusHalos = FOCUS_ANCHORS.map((p, i) => {
    const h = new T.Sprite(new T.SpriteMaterial({
      map: haloTex,
      color: [0xc6ff3c, 0x38f5d0, 0x7a5cff][i],
      transparent: true, opacity: 0,
      blending: T.AdditiveBlending, depthWrite: false,
    }))
    h.scale.set(3.5, 3.5, 1)
    h.position.copy(p)
    rootGroup.add(h)
    return h
  })

  return { thrusterGlows, navLights, focusHalos, FOCUS_ANCHORS }
}

/* ─── ISSModel — R3F component ─────────────────────────────────── */
export const ISSModel = forwardRef(function ISSModel({ thrusterProxy, focusProxy, stationProxy }, ref) {
  const groupRef = useRef()
  const internalsRef = useRef(null)

  useImperativeHandle(ref, () => groupRef.current, [])

  useEffect(() => {
    if (!groupRef.current) return
    const internals = buildISSIntoGroup(groupRef.current)
    internalsRef.current = internals
    return () => { internalsRef.current = null }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    if (groupRef.current) {
      const g = groupRef.current
      g.position.x = Math.sin(t * 0.31) * 0.04
      g.position.y = Math.sin(t * 0.23) * 0.055
      g.position.z = Math.sin(t * 0.17) * 0.03
      g.rotation.x = (stationProxy?.rotX ?? 0) + Math.sin(t * 0.07) * 0.005
      g.rotation.y = t * 0.10 + (stationProxy?.rotY ?? 0) + Math.sin(t * 0.09) * 0.008
      g.rotation.z = (stationProxy?.rotZ ?? 0) + Math.sin(t * 0.11) * 0.004
    }

    if (!internalsRef.current) return
    const intensity = thrusterProxy?.intensity ?? 0
    const activeFocus = focusProxy?.value ?? -1
    const { thrusterGlows, navLights, focusHalos } = internalsRef.current

    thrusterGlows.forEach(({ outer, inner }, i) => {
      const pulse = Math.sin(t * 9.0 + i * 0.8) * 0.5 + 0.5
      outer.material.opacity = intensity * (0.18 + pulse * 0.07)
      inner.material.opacity = intensity * (0.45 + pulse * 0.12)
    })

    navLights.forEach(({ mesh }, i) => {
      const on = Math.sin(t * (2.1 + i * 0.43) + i * 1.9) > 0.3
      mesh.material.opacity = on ? 1 : 0.04
    })

    focusHalos.forEach((h, i) => {
      const target = i === activeFocus ? (0.36 + Math.sin(t * 1.8) * 0.07) : 0
      h.material.opacity += (target - h.material.opacity) * 0.06
    })
  })

  return <group ref={groupRef} />
})
