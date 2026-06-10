import { Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ISSModel } from './ISSModel'

/* ─── Simplex 3D noise + FBM (ported from the design reference) ─── */
const NOISE_GLSL = /* glsl */`
  vec3  _m3(vec3  x){ return x - floor(x*(1./289.))*289.; }
  vec4  _m4(vec4  x){ return x - floor(x*(1./289.))*289.; }
  vec4  _pm(vec4  x){ return _m4(((x*34.)+1.)*x); }
  vec4  _ts(vec4  r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=_m3(i);
    vec4 p=_pm(_pm(_pm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    vec3 ns=D.wyz/7.-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
    vec4 xx=x_*ns.x+ns.yyyy;vec4 yy=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(xx)-abs(yy);
    vec4 b0=vec4(xx.xy,yy.xy);vec4 b1=vec4(xx.zw,yy.zw);
    vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 P0=vec3(a0.xy,h.x);vec3 P1=vec3(a0.zw,h.y);
    vec3 P2=vec3(a1.xy,h.z);vec3 P3=vec3(a1.zw,h.w);
    vec4 norm=_ts(vec4(dot(P0,P0),dot(P1,P1),dot(P2,P2),dot(P3,P3)));
    P0*=norm.x;P1*=norm.y;P2*=norm.z;P3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(P0,x0),dot(P1,x1),dot(P2,x2),dot(P3,x3)));
  }
  float fbm(vec3 p){ float v=0.,a=.5; for(int i=0;i<5;i++){ v+=a*snoise(p); p*=2.07; a*=.5; } return v; }
`

/* ─── Distant Earth — full FBM biome shader ─────────────────────── */
function DistantEarth() {
  const groupRef = useRef()

  const { surfaceMat, atmoMat } = useMemo(() => {
    const sunDir = new THREE.Vector3(
      Math.cos(-53 * Math.PI / 180) * Math.cos(135 * Math.PI / 180),
      Math.sin(-53 * Math.PI / 180),
      Math.cos(-53 * Math.PI / 180) * Math.sin(135 * Math.PI / 180),
    ).normalize()

    const surfaceMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:         { value: 0 },
        uSunDir:       { value: sunDir.clone() },
        uSeaLevel:     { value: -0.02 },
        uCloudOpacity: { value: 0.45 },
        uCloudSpeed:   { value: 0.65 },
        uCityLights:   { value: 1.0 },
        uAtmoStrength: { value: 0.0 },
      },
      vertexShader: /* glsl */`
        varying vec3 vLP; varying vec3 vWP; varying vec3 vWN;
        void main(){
          vLP = position;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWP = wp.xyz;
          vWN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: NOISE_GLSL + /* glsl */`
        varying vec3 vLP; varying vec3 vWP; varying vec3 vWN;
        uniform float uTime;
        uniform vec3  uSunDir;
        uniform float uSeaLevel;
        uniform float uCloudOpacity;
        uniform float uCloudSpeed;
        uniform float uCityLights;
        uniform float uAtmoStrength;
        float hash3(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
        void main(){
          vec3 op = normalize(vLP);
          vec3 n  = normalize(vWN);
          vec3 viewDir = normalize(cameraPosition - vWP);
          float h   = fbm(op * 1.6);
          float lat = abs(op.y);
          float landMask = smoothstep(uSeaLevel - 0.02, uSeaLevel + 0.10, h);
          vec3 oceanDeep  = vec3(0.012, 0.045, 0.13);
          vec3 oceanShelf = vec3(0.04,  0.20,  0.36);
          vec3 ocean = mix(oceanDeep, oceanShelf, smoothstep(uSeaLevel - 0.40, uSeaLevel - 0.01, h));
          float arid = smoothstep(-0.25, 0.50, fbm(op * 1.9 + vec3(4.1, 2.2, 1.3)));
          vec3 lush     = vec3(0.10, 0.30, 0.09);
          vec3 desert   = vec3(0.66, 0.50, 0.22);
          vec3 forest   = vec3(0.06, 0.18, 0.04);
          vec3 mountain = vec3(0.34, 0.30, 0.26);
          vec3 snow     = vec3(0.95, 0.97, 1.00);
          vec3 land = mix(lush, desert, arid * 0.85);
          land = mix(land, forest,   smoothstep(0.50, 0.90, fbm(op * 2.8 + 1.2)) * 0.55);
          land = mix(land, mountain, smoothstep(0.38, 0.72, h));
          land = mix(land, snow,     smoothstep(0.60, 0.82, h));
          land = mix(land, snow,     smoothstep(0.70, 0.92, lat));
          vec3 surface = mix(ocean, land, landMask);
          float ct = uTime * uCloudSpeed;
          vec3 cp1 = op * 2.1 + vec3(ct * 0.012, 0.0, ct * 0.008);
          float lowClouds = smoothstep(0.02, 0.55, fbm(cp1));
          float cirrus    = smoothstep(0.55, 0.92, fbm(op * 4.2 + vec3(ct * 0.018, 0., ct * 0.005))) * 0.45;
          float clouds    = clamp((lowClouds + cirrus) * uCloudOpacity, 0.0, 1.0);
          float NdotL_raw = dot(n, uSunDir);
          float NdotL     = max(NdotL_raw, 0.0);
          float dayBlend  = smoothstep(-0.06, 0.20, NdotL_raw);
          vec3 diff = surface * NdotL;
          vec3  hv = normalize(uSunDir + viewDir);
          float NdotH = max(dot(n, hv), 0.0);
          vec3  specCol = vec3(1.0, 1.0, 0.95) * pow(NdotH, 80.0) * (1.0 - landMask) * NdotL * 1.6;
          vec3 cloudCol = mix(vec3(0.72, 0.76, 0.85), vec3(1.0), dayBlend);
          vec3 lit = mix(diff + specCol, cloudCol * (0.16 + 0.84 * NdotL), clouds);
          float ch   = hash3(floor(op * 45.0));
          float city = smoothstep(0.93, 1.0, ch) * landMask * (1.0 - dayBlend);
          float halo = smoothstep(0.86, 1.0, ch) * landMask * (1.0 - dayBlend) * 0.25;
          vec3  cityColor = vec3(1.0, 0.78, 0.42) * (city + halo) * uCityLights;
          vec3 ambient = surface * 0.015 * (1.0 - dayBlend);
          float term = smoothstep(-0.18, 0.0, NdotL_raw) * (1.0 - smoothstep(0.0, 0.4, NdotL_raw));
          vec3 termGlow = vec3(0.98, 0.46, 0.18) * term * 0.22 * uAtmoStrength;
          float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
          vec3 rimGlow = vec3(0.36, 0.58, 0.95) * rim * (0.18 + 0.55 * dayBlend) * (uAtmoStrength + 0.4);
          vec3 final = lit + ambient + cityColor + termGlow + rimGlow;
          final = final / (final + 1.0);
          final = pow(clamp(final, 0.0, 1.0), vec3(1.0 / 2.2));
          gl_FragColor = vec4(final, 1.0);
        }
      `,
    })

    const atmoMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSunDir:       { value: sunDir.clone() },
        uAtmoStrength: { value: 0.55 },
      },
      vertexShader: /* glsl */`
        varying vec3 vWN; varying vec3 vWP;
        void main(){
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWP = wp.xyz; vWN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3 vWN; varying vec3 vWP;
        uniform vec3  uSunDir;
        uniform float uAtmoStrength;
        void main(){
          vec3 n  = normalize(vWN);
          vec3 vd = normalize(cameraPosition - vWP);
          float rim = pow(1.0 - max(dot(n, vd), 0.0), 2.6);
          float sun = clamp(dot(n, normalize(uSunDir)) * 0.55 + 0.45, 0.0, 1.0);
          vec3 col = mix(vec3(0.98, 0.50, 0.22), vec3(0.36, 0.58, 0.95), smoothstep(0.0, 0.45, sun));
          float a = rim * uAtmoStrength * (0.35 + 0.65 * sun);
          gl_FragColor = vec4(col * a, a);
        }
      `,
    })
    return { surfaceMat, atmoMat }
  }, [])

  useFrame(({ clock }) => {
    surfaceMat.uniforms.uTime.value = clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.075
    }
  })

  return (
    <group ref={groupRef} position={[-7.4, -7.5, -13.7]} scale={1.14}>
      <mesh material={surfaceMat}>
        <sphereGeometry args={[2.7, 96, 64]} />
      </mesh>
      <mesh material={atmoMat}>
        <sphereGeometry args={[2.92, 64, 48]} />
      </mesh>
    </group>
  )
}

/* ─── Custom starfield with shader ──────────────────────────────── */
function Starfield() {
  const N = 2200
  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(N * 3)
    const siz = new Float32Array(N)
    const col = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const r = 60 + Math.random() * 70
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      pos[i * 3]     = r * Math.sin(ph) * Math.cos(th)
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
      pos[i * 3 + 2] = r * Math.cos(ph)
      siz[i] = 0.4 + Math.random() * 1.4
      const tint = Math.random()
      col[i * 3]     = tint < .15 ? 1 : (tint > .85 ? .7 : .95)
      col[i * 3 + 1] = tint < .15 ? .85 : (tint > .85 ? .8 : .95)
      col[i * 3 + 2] = tint < .15 ? .7 : (tint > .85 ? 1 : .95)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geometry.setAttribute('starSize', new THREE.BufferAttribute(siz, 1))
    geometry.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: /* glsl */`
        attribute float starSize; attribute vec3 color;
        varying vec3 vC;
        void main(){
          vC = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.);
          gl_PointSize = starSize * (700. / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3 vC;
        void main(){
          vec2 uv = gl_PointCoord - .5;
          float a = 1. - smoothstep(.25, .5, length(uv));
          if(a < .01) discard;
          gl_FragColor = vec4(vC, a * .85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geometry, material }
  }, [])

  return <points geometry={geometry} material={material} />
}

/* ─── Orbital dust — drifting particles that sell the velocity ──── */
function OrbitalDust() {
  const { geometry, material } = useMemo(() => {
    const N = 220
    const pos = new Float32Array(N * 3)
    const spd = new Float32Array(N)
    const siz = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - .5) * 30
      pos[i * 3 + 1] = (Math.random() - .5) * 18
      pos[i * 3 + 2] = -6 + Math.random() * 14
      spd[i] = .25 + Math.random() * .9
      siz[i] = .3 + Math.random() * 1.0
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(spd, 1))
    geometry.setAttribute('starSize', new THREE.BufferAttribute(siz, 1))
    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */`
        attribute float aSpeed; attribute float starSize;
        uniform float uTime;
        varying float vA;
        void main(){
          vec3 p = position;
          p.x = mod(p.x + uTime * aSpeed + 15., 30.) - 15.;
          vA = smoothstep(15., 12., abs(p.x));
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          gl_PointSize = starSize * (120. / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        varying float vA;
        void main(){
          vec2 uv = gl_PointCoord - .5;
          float a = 1. - smoothstep(.15, .5, length(uv));
          if(a < .01) discard;
          gl_FragColor = vec4(vec3(.82, .88, 1.), a * vA * .26);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geometry, material }
  }, [])

  useFrame(({ clock }) => { material.uniforms.uTime.value = clock.elapsedTime })

  return <points geometry={geometry} material={material} />
}

/* ─── Sun glare aligned with the key light ──────────────────────── */
function SunGlare() {
  const material = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 256
    const g = c.getContext('2d')
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128)
    gr.addColorStop(0,   'rgba(255,244,220,.95)')
    gr.addColorStop(.18, 'rgba(255,210,150,.38)')
    gr.addColorStop(.5,  'rgba(255,170,90,.08)')
    gr.addColorStop(1,   'rgba(0,0,0,0)')
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256)
    return new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(c),
      transparent: true, opacity: .5,
      blending: THREE.AdditiveBlending,
      depthWrite: false, fog: false,
    })
  }, [])
  useFrame(({ clock }) => {
    material.opacity = .46 + Math.sin(clock.elapsedTime * .8) * .06
  })
  return <sprite material={material} position={[44.7, 22.3, 31.3]} scale={[30, 30, 1]} />
}

/* ─── Camera rig — reads the proxies each frame ─────────────────── */
function CameraRig({ cameraProxy, lookProxy, fovProxy }) {
  const { camera } = useThree()
  const lookTarget = useMemo(() => new THREE.Vector3(), [])
  const tmp        = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    camera.position.set(0, 1.6, 28)
    camera.fov = 36
    camera.updateProjectionMatrix()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const driftX = Math.sin(t * 0.19) * 0.06
    const driftY = Math.sin(t * 0.13) * 0.04
    const driftZ = Math.sin(t * 0.07) * 0.05

    tmp.set(
      (cameraProxy?.x ?? 0) + driftX,
      (cameraProxy?.y ?? 0) + driftY,
      (cameraProxy?.z ?? 16) + driftZ,
    )
    camera.position.lerp(tmp, 0.18)

    lookTarget.set(
      (lookProxy?.x ?? 0) + Math.sin(t * 0.17) * 0.025,
      (lookProxy?.y ?? 0) + Math.cos(t * 0.21) * 0.02,
      (lookProxy?.z ?? 0),
    )
    camera.lookAt(lookTarget)

    if (fovProxy && Math.abs(camera.fov - fovProxy.value) > 0.05) {
      camera.fov += (fovProxy.value - camera.fov) * 0.12
      camera.updateProjectionMatrix()
    }
  })
  return null
}

/* ─── Scene — flat hierarchy, no nested function components ─────── */
function SceneContent({ issGroupRef, stationProxy, cameraProxy, lookProxy, thrusterProxy, fovProxy, focusProxy, onReady }) {
  useEffect(() => { onReady?.() }, [onReady])

  return (
    <>
      <ambientLight color={0x202840} intensity={0.35} />
      <directionalLight color={0xfff4dc} intensity={2.4} position={[10, 5, 7]} />
      <directionalLight color={0x4a78b8} intensity={0.95} position={[6, -8, -4]} />
      <directionalLight color={0x88ccff} intensity={0.45} position={[-7, 3, -5]} />

      <Starfield />
      <DistantEarth />
      <OrbitalDust />
      <SunGlare />

      <Suspense fallback={null}>
        <ISSModel
          ref={issGroupRef}
          thrusterProxy={thrusterProxy}
          focusProxy={focusProxy}
        />
      </Suspense>

      <CameraRig cameraProxy={cameraProxy} lookProxy={lookProxy} fovProxy={fovProxy} />
    </>
  )
}

/* ─── Public component ───────────────────────────────────────────── */
export function ISSScene({ issGroupRef, stationProxy, cameraProxy, lookProxy, thrusterProxy, fovProxy, focusProxy, onLoaded }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', background: '#02030a' }}
      camera={{ fov: 36, near: 0.1, far: 300, position: [0, 1.6, 28] }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.FogExp2(0x02030a, 0.025)
      }}
    >
      <SceneContent
        issGroupRef={issGroupRef}
        stationProxy={stationProxy}
        cameraProxy={cameraProxy}
        lookProxy={lookProxy}
        thrusterProxy={thrusterProxy}
        fovProxy={fovProxy}
        focusProxy={focusProxy}
        onReady={onLoaded}
      />
    </Canvas>
  )
}
