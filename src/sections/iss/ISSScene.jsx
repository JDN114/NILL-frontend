import { Suspense, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { ISSModel } from './ISSModel'

/* ─── Distant Earth — FBM continents, animated clouds, city lights ── */
function DistantEarth() {
  const ref = useRef()
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uSunDir: { value: new THREE.Vector3(1, 0.4, 0.6).normalize() },
      uTime:   { value: 0 },
    },
    vertexShader: /* glsl */`
      varying vec3 vN; varying vec3 vWP;
      void main(){
        vN = normalize(normalMatrix * normal);
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWP = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */`
      varying vec3 vN; varying vec3 vWP;
      uniform vec3 uSunDir;
      uniform float uTime;

      float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
      float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }

      float noise3(vec3 p){
        vec3 i = floor(p); vec3 f = fract(p);
        vec3 u = f*f*(3.0-2.0*f);
        return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),u.x),
                       mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),u.x),u.y),
                   mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),u.x),
                       mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),u.x),u.y),u.z);
      }

      float fbm(vec3 p){
        float v=0.0,a=0.5;
        for(int i=0;i<5;i++){ v+=a*noise3(p); p=p*2.0+0.3; a*=0.5; }
        return v;
      }

      void main(){
        vec3 n = normalize(vN);
        float day  = clamp(dot(n, uSunDir), 0.0, 1.0);
        float term = smoothstep(-0.15, 0.15, dot(n, uSunDir));

        // FBM continents
        vec3 pos = normalize(vWP);
        float land = smoothstep(0.45, 0.52, fbm(pos * 2.8 + 0.5));

        // Biome coloring
        float lat  = abs(pos.y);
        float polar = smoothstep(0.72, 0.88, lat);
        vec3 oceanD = vec3(0.02, 0.07, 0.18);
        vec3 oceanL = vec3(0.04, 0.20, 0.42);
        vec3 landC  = mix(
          mix(vec3(0.28,0.38,0.18), vec3(0.55,0.42,0.24), fbm(pos*4.0+1.0)),
          vec3(0.85,0.88,0.92), polar
        );
        vec3 ocean = mix(oceanD, oceanL, term);
        vec3 col   = mix(ocean, landC, land * 0.85);

        // Specular highlight on ocean
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfV = normalize(uSunDir + viewDir);
        float spec = pow(max(dot(n, halfV), 0.0), 48.0) * (1.0 - land) * day;
        col += vec3(0.7, 0.85, 1.0) * spec * 0.5;

        // Animated clouds
        float t = uTime * 0.065;
        float cloud = smoothstep(0.52, 0.60, fbm(pos * 3.4 + vec3(t, t*0.5, 0.0)));
        col = mix(col, vec3(0.92, 0.94, 0.98), cloud * 0.45 * clamp(term + 0.2, 0.0, 1.0));

        // City lights on dark land side
        float dark = 1.0 - term;
        float city = step(0.975, hash(floor(pos * 9.0)));
        col += vec3(1.0, 0.78, 0.45) * city * dark * land * 1.4;

        // Terminator glow
        float termGlow = exp(-abs(dot(n, uSunDir)) * 6.0);
        col += vec3(1.0, 0.55, 0.25) * termGlow * 0.12;

        // Atmosphere rim
        float rim = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
        col += vec3(0.35, 0.55, 0.95) * rim * (0.22 + 0.4 * term);

        // ACES-ish tonemapping
        col = col * (col + 0.0245786) / (col * (0.983729 * col + 0.432951) + 0.238081);
        col = pow(col, vec3(1.0/2.2));

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  }), [])

  useFrame(({ clock }) => { mat.uniforms.uTime.value = clock.elapsedTime })

  return (
    <group position={[-7.4, -7.5, -13.7]}>
      <mesh ref={ref} scale={1.14} material={mat}>
        <sphereGeometry args={[2.7, 64, 48]} />
      </mesh>
      {/* additive atmosphere shell */}
      <mesh scale={1.14}>
        <sphereGeometry args={[2.92, 48, 32]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          uniforms={{}}
          vertexShader={`varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`}
          fragmentShader={`varying vec3 vN; void main(){ float d=pow(1.-abs(vN.z),3.); gl_FragColor=vec4(0.40,0.65,1.0,d*0.55); }`}
        />
      </mesh>
    </group>
  )
}

/* ─── Camera rig — reads the proxies each frame ────────────────── */
function CameraRig({ cameraProxy, lookProxy, fovProxy }) {
  const { camera } = useThree()
  const lookTarget = useMemo(() => new THREE.Vector3(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

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

/* ─── Station animator — reads station/focus proxies ───────────── */
function StationAnimator({ stationProxy, focusProxy, issRef, modelRef }) {
  useFrame(({ clock }) => {
    const g = issRef.current
    if (!g) return
    const t = clock.elapsedTime

    const floatY = Math.sin(t * 0.23) * 0.055
    const floatX = Math.sin(t * 0.31) * 0.04
    const floatZ = Math.sin(t * 0.17) * 0.03

    g.position.x = floatX
    g.position.y = floatY
    g.position.z = floatZ
    g.rotation.x = (stationProxy?.rotX ?? 0) + Math.sin(t * 0.07) * 0.005
    g.rotation.y = (stationProxy?.rotY ?? 0) + Math.sin(t * 0.09) * 0.008
    g.rotation.z = (stationProxy?.rotZ ?? 0) + Math.sin(t * 0.11) * 0.004

    if (modelRef.current && focusProxy) {
      modelRef.current.activeFocus = focusProxy.value
    }
  })
  return null
}

/* ─── Scene content ────────────────────────────────────────────── */
function SceneContent({ stationProxy, cameraProxy, lookProxy, thrusterProxy, fovProxy, focusProxy, onReady }) {
  const issRef = useRef()
  const modelRef = useRef({ activeFocus: -1 })

  useEffect(() => { onReady && onReady() }, [onReady])

  function StationGroup() {
    return (
      <ISSModel
        ref={issRef}
        thrusterIntensity={thrusterProxy?.intensity ?? 0}
        activeFocus={modelRef.current.activeFocus}
      />
    )
  }

  return (
    <>
      <ambientLight color={0x202840} intensity={0.35} />
      <directionalLight color={0xfff4dc} intensity={2.4} position={[10, 5, 7]} />
      <directionalLight color={0x4a78b8} intensity={0.95} position={[6, -8, -4]} />
      <directionalLight color={0x88ccff} intensity={0.45} position={[-7, 3, -5]} />

      <Stars
        radius={120}
        depth={60}
        count={2200}
        factor={4}
        saturation={0.05}
        fade
        speed={0.4}
      />

      <DistantEarth />

      <Suspense fallback={null}>
        <StationGroup />
      </Suspense>

      <CameraRig cameraProxy={cameraProxy} lookProxy={lookProxy} fovProxy={fovProxy} />
      <StationAnimator
        stationProxy={stationProxy}
        focusProxy={focusProxy}
        issRef={issRef}
        modelRef={modelRef}
      />
    </>
  )
}

/* ─── Public component ─────────────────────────────────────────── */
export function ISSScene({
  stationProxy,
  cameraProxy,
  lookProxy,
  thrusterProxy,
  fovProxy,
  focusProxy,
  onLoaded,
}) {
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
