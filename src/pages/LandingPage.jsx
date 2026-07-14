import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from 'three';
import ISSSection from '../sections/iss/ISSSection'
import { useReveal, Reveal, MagBtn, LandingNav, Footer, Modal } from '../components/landing/chrome'
import '../styles/landing.css'


// One-time page side-effects (CSS is bundled via landing.css; Three.js is the
// bundled npm package — the old global /three.min.js loader is gone)
let __initialized = false;
function ensureInit() {
  if (__initialized) return;
  __initialized = true;
  document.title = "NILL — Intelligenz, die mitarbeitet.";
}


/* ─── HOOKS ─────────────────────────────────────────────── */
/* useReveal / Reveal / MagBtn now live in ../components/landing/chrome */

/* Page scroll progress bar under the nav */
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf, cur = 0, max = 1, frame = 0;
    // scrollHeight pro Frame lesen erzwingt Layout-Recalc, sobald irgendeine
    // Animation Layout dirty macht — nur alle ~2s und bei Resize messen
    const measure = () => { max = Math.max(1, document.documentElement.scrollHeight - innerHeight); };
    addEventListener('resize', measure);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (frame++ % 120 === 0) measure();
      const target = window.scrollY / max;
      cur += (target - cur) * 0.12;
      if (ref.current) ref.current.style.transform = `scaleX(${cur})`;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', measure); };
  }, []);
  return <div className="scroll-progress" aria-hidden="true"><span ref={ref}/></div>;
}

/* ─── CARD ───────────────────────────────────────────────── */
/* The 3D tilt + mouse-follow glow was removed: the scroll reveal plus a
   quiet CSS hover lift carry the interaction without the gimmick. */
function TiltCard({ className, style, children }) {
  return <article className={`card ${className||''}`} style={style}>{children}</article>;
}

/* ─── THREE.JS HERO CANVAS ───────────────────────────────── */

const NOISE_LIB = `
  vec3 _m3(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 _m4(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 _perm(vec4 x){return _m4(((x*34.)+1.)*x);}
  vec4 _ts(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=_m3(i);
    vec4 p=_perm(_perm(_perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    vec3 ns=D.wyz/7.-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
    vec4 xx=x_*ns.x+ns.yyyy;vec4 yy=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(xx)-abs(yy);
    vec4 b0=vec4(xx.xy,yy.xy);vec4 b1=vec4(xx.zw,yy.zw);
    vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 P0=vec3(a0.xy,h.x);vec3 P1=vec3(a0.zw,h.y);vec3 P2=vec3(a1.xy,h.z);vec3 P3=vec3(a1.zw,h.w);
    vec4 norm=_ts(vec4(dot(P0,P0),dot(P1,P1),dot(P2,P2),dot(P3,P3)));
    P0*=norm.x;P1*=norm.y;P2*=norm.z;P3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
    return 42.*dot(m*m,vec4(dot(P0,x0),dot(P1,x1),dot(P2,x2),dot(P3,x3)));
  }
  float fbm3(vec3 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*snoise(p);p*=2.07;a*=.5;}return v;}
  float fbm2(vec3 p){return snoise(p)*.5+snoise(p*2.05+vec3(11.3,5.7,4.1))*.25;}
  float ridged(vec3 p){float v=0.,a=.55;for(int i=0;i<3;i++){float n=1.-abs(snoise(p));v+=a*n*n;p=p*2.1+vec3(3.1,7.7,1.3);a*=.5;}return v;}
  /* ACES filmic (Narkowicz fit) + gamma — photographic highlight rolloff
     instead of the flat Reinhard curve */
  vec3 tonemap(vec3 x){
    x*=1.15;
    vec3 r=(x*(2.51*x+.03))/(x*(2.43*x+.59)+.14);
    return pow(clamp(r,0.,1.),vec3(1./2.2));
  }
`;

const PLANET_VERT = `
  varying vec3 vLP;varying vec3 vWP;varying vec3 vWN;
  void main(){
    vLP=position;
    vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;
    vWN=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*wp;
  }
`;

const ATMO_VERT = `
  varying vec3 vWP;varying vec3 vWN;
  void main(){
    vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;
    vWN=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*wp;
  }
`;

const ATMO_FRAG = `
  uniform vec3 uSunPos;uniform vec3 uColor;uniform float uIntensity;
  varying vec3 vWP;varying vec3 vWN;
  void main(){
    vec3 wN=normalize(vWN);
    vec3 vD=normalize(cameraPosition-vWP);
    vec3 sD=normalize(uSunPos-vWP);
    float rim=pow(1.-max(dot(wN,vD),0.),2.6);
    float sunF=max(dot(wN,sD)*.55+.45,0.);
    /* Rayleigh-ish hue shift: the lit limb keeps the atmosphere color,
       the terminator warms up like a sunset ring */
    vec3 col=mix(uColor*vec3(1.25,.62,.38),uColor,smoothstep(.12,.55,sunF));
    float alpha=rim*uIntensity*sunF;
    gl_FragColor=vec4(col*alpha,alpha);
  }
`;

/* Surface shaders implement ONE function
     void surf(vec3 op, out vec3 col, out float spec, out vec3 emit)
   so the (expensive) fbm/snoise field is evaluated once per fragment —
   the old getSurf/getSpec/getEmit trio recomputed the same noise 3×. */
function mkPlanetFrag(surfCode) {
  return NOISE_LIB + `
    varying vec3 vLP;varying vec3 vWP;varying vec3 vWN;
    uniform float uTime;uniform vec3 uSunPos;uniform vec3 uAtmo;
    ${surfCode}
    void main(){
      vec3 op=normalize(vLP);
      vec3 N=normalize(vWN);
      vec3 S=normalize(uSunPos-vWP);
      vec3 V=normalize(cameraPosition-vWP);
      vec3 col;float spec;vec3 emit;
      surf(op,col,spec,emit);
      float NdL_g=dot(N,S);
      float NdL=max(NdL_g,0.);
      /* slightly super-linear falloff reads like a real photographed
         terminator instead of flat Lambert */
      vec3 diff=col*pow(NdL,1.15);
      vec3 H=normalize(S+V);
      /* Schlick fresnel boosts grazing-angle speculars (ocean sun glint) */
      float fres=pow(1.-max(dot(V,N),0.),5.);
      float specV=pow(max(dot(N,H),0.),40.+spec*260.)*spec*NdL*(.5+.9*fres);
      vec3 specCol=mix(vec3(.9,.95,1.),vec3(1.),spec*.5)*specV;
      float day=smoothstep(-.05,.18,NdL_g);
      vec3 night=col*.006+emit;
      vec3 final=mix(night,diff+specCol+col*.018,day);
      /* warm forward-scatter ring along the terminator, cool rim on the day side */
      float term=smoothstep(-.12,0.,NdL_g)*(1.-smoothstep(0.,.35,NdL_g));
      final+=mix(vec3(1.,.45,.22),uAtmo,.35)*term*.13;
      final+=uAtmo*pow(1.-max(dot(N,V),0.),3.5)*smoothstep(-.05,.3,NdL_g)*.22;
      gl_FragColor=vec4(tonemap(final),1.);
    }
  `;
}

const SURF_EARTH = `
  void surf(vec3 op,out vec3 c,out float spec,out vec3 emit){
    /* domain-warped continents — breaks up the blobby fbm islands */
    vec3 w=vec3(fbm2(op*2.1+13.7),fbm2(op*2.1+7.3),fbm2(op*2.1+3.9))*.32;
    float h=fbm3(op*1.6+w);
    float lat=abs(op.y);
    float land=smoothstep(-.02,.12,h);
    vec3 ocean=mix(vec3(.008,.035,.10),vec3(.03,.16,.30),smoothstep(-.35,-.02,h));
    float arid=smoothstep(-.25,.5,fbm2(op*1.9+4.));
    vec3 landC=mix(vec3(.09,.26,.06),vec3(.55,.42,.18),arid*.85);
    landC=mix(landC,vec3(.04,.15,.03),smoothstep(.5,.9,fbm2(op*2.8+1.2))*.6);
    landC=mix(landC,vec3(.32,.28,.24),smoothstep(.34,.66,h));
    landC=mix(landC,vec3(.93,.96,1.),smoothstep(.56,.78,h));
    landC=mix(landC,vec3(.93,.96,1.),smoothstep(.66,.88,lat));
    c=mix(ocean,landC,land);
    float cl=smoothstep(.04,.55,fbm2(op*2.3+vec3(uTime*.008,0.,uTime*.005)));
    c=mix(c,vec3(.96,.975,1.),cl*.85);
    /* water is the mirror, clouds kill the glint */
    spec=(1.-land)*(1.-cl)*.9+cl*.05;
    /* city lights hug the coastlines, never the open sea or cloud tops */
    float coast=land*(1.-smoothstep(.02,.28,abs(h-.05)));
    emit=vec3(1.,.72,.35)*smoothstep(.35,.65,fbm2(op*5.+2.))*coast*(1.-cl)*.30;
  }
`;

const SURF_ICE = `
  /* Europa-like ice shell: lineae fracture network over smooth plains */
  void surf(vec3 op,out vec3 c,out float spec,out vec3 emit){
    float h=fbm3(op*2.);float rd=ridged(op*2.8);float lat=abs(op.y);
    c=mix(vec3(.55,.62,.66),vec3(.82,.88,.92),smoothstep(-.3,.4,h));
    float crack=smoothstep(.62,.86,ridged(op*4.8+1.7));
    c=mix(c,vec3(.48,.30,.20),crack*.45);
    c=mix(c,vec3(.90,.95,1.),smoothstep(.55,.85,rd)*.5);
    c=mix(c,vec3(.93,.97,1.),smoothstep(.55,.85,lat));
    spec=.30+smoothstep(.4,.85,rd)*.22;
    emit=vec3(0.);
  }
`;

const SURF_MARS = `
  /* geologically dead Mars: oxide plains, basalt shields, polar CO2 caps —
     no glowing lava (that was the cartoon tell) */
  void surf(vec3 op,out vec3 c,out float spec,out vec3 emit){
    vec3 w=vec3(fbm2(op*2.4+5.1),fbm2(op*2.4+9.7),fbm2(op*2.4+1.9))*.25;
    float h=fbm3(op*1.7+w+.3);float rd=ridged(op*2.8);
    c=mix(vec3(.30,.12,.05),vec3(.62,.28,.12),smoothstep(-.35,.6,h));
    c=mix(c,vec3(.74,.47,.28),smoothstep(0.,.6,fbm2(op*4.+1.3))*.45);
    c=mix(c,vec3(.20,.09,.05),smoothstep(.5,.85,rd)*.65);
    c=mix(c,vec3(.92,.90,.86),smoothstep(.80,.93,abs(op.y)));
    spec=.05;
    emit=vec3(0.);
  }
`;

const SURF_GAS = `
  /* Jovian bands with shear turbulence at the band boundaries and one
     anticyclonic storm oval */
  void surf(vec3 op,out vec3 c,out float spec,out vec3 emit){
    float y=op.y;
    float turb=fbm2(vec3(op.x,y*2.2,op.z)*2.+uTime*.015);
    float fine=snoise(vec3(op.x*6.,y*16.,op.z*6.)+uTime*.02)*.5+.5;
    /* shear: turbulence displaces latitude more where bands meet */
    float yb=y+turb*.10*sin(y*7.5);
    float bands=sin(yb*7.5)*(.55+fine*.15);
    c=mix(vec3(.52,.36,.22),vec3(.86,.80,.68),smoothstep(-.6,.6,bands));
    c=mix(c,vec3(.68,.50,.32),smoothstep(.3,.8,abs(y)*.4+turb*.3));
    c=mix(c,vec3(.38,.25,.14),smoothstep(.4,.85,-bands+.1));
    c=mix(c,vec3(.93,.89,.80),smoothstep(.65,.85,sin(yb*18.+turb*3.))*.28);
    /* storm oval with a paler collar, like Jupiter's GRS */
    vec2 sp=(op.xy-vec2(.32,-.09))*vec2(1.2,2.4);
    float spot=exp(-dot(sp,sp)*22.);
    float collar=exp(-dot(sp,sp)*9.)-spot;
    c=mix(c,vec3(.90,.86,.78),max(collar,0.)*.5);
    c=mix(c,vec3(.72,.34,.20),spot*.75);
    c=mix(c,vec3(.88,.62,.46),exp(-dot(sp,sp)*70.)*.6);
    spec=.03;
    emit=vec3(0.);
  }
`;

const SURF_MOON = `
  /* regolith: highlands, dark maria, bright ray craters */
  void surf(vec3 op,out vec3 c,out float spec,out vec3 emit){
    float h=fbm3(op*2.2);float rd=ridged(op*3.2);
    c=mix(vec3(.60,.59,.57),vec3(.16,.155,.15),smoothstep(.02,-.2,h));
    c+=vec3(.17,.165,.16)*smoothstep(.60,.88,rd)*.9;
    c-=vec3(.07,.065,.06)*smoothstep(.70,.90,ridged(op*6.5+3.))*.8;
    c=mix(c,vec3(.84,.83,.80),smoothstep(.85,.96,snoise(op*18.)*.5+.5)*smoothstep(0.,.3,h)*.6);
    spec=.03;
    emit=vec3(0.);
  }
`;

const SURF_ENERGY = `
  /* the WIP-module planet: dark world with faint auroral filaments —
     stylized on purpose, but no longer radioactively pulsing */
  void surf(vec3 op,out vec3 c,out float spec,out vec3 emit){
    float pulse=.9+.1*sin(uTime*.7);
    float glow=smoothstep(.76,.94,ridged(op*3.2))*pulse;
    c=vec3(.02,.035,.02)+fbm2(op*3.)*.02*vec3(.3,1.,.3);
    c+=vec3(.55,.95,.30)*glow;
    spec=.08;
    emit=vec3(.50,.85,.22)*glow*.35;
  }
`;

/* Saturn-like ring system: translucent C ring, dense bright B ring,
   Cassini division, A ring with Encke gap. Radial profile only — real
   rings have almost no azimuthal structure. */
const RING_FRAG = NOISE_LIB + `
  varying vec3 vLP;varying vec3 vWP;
  uniform float uInner,uOuter;uniform vec3 uSunPos;
  void main(){
    float rr=length(vLP.xy);
    float rn=clamp((rr-uInner)/(uOuter-uInner),0.,1.);
    float grain=fbm2(vec3(rn*160.,0.,0.))*.5+.5;
    /* radial density profile */
    float cRing=smoothstep(0.,.10,rn)*(1.-smoothstep(.10,.30,rn))*.35;
    float bRing=smoothstep(.28,.34,rn)*(1.-smoothstep(.56,.60,rn));
    float aRing=smoothstep(.66,.70,rn)*(1.-smoothstep(.93,1.,rn))*.75;
    float encke=1.-smoothstep(.855,.862,rn)*(1.-smoothstep(.868,.875,rn))*.9;
    float dens=(cRing+bRing+aRing*encke)*(.6+grain*.5);
    /* icy, slightly tan particles; B ring is the brightest */
    vec3 col=mix(vec3(.42,.38,.32),vec3(.88,.84,.76),dens);
    /* lit face vs. light filtering through the unlit face */
    float sunSide=normalize(uSunPos-vWP).y;
    col*=clamp(abs(sunSide)*.7+.35,0.,1.);
    float alpha=clamp(dens,0.,1.)*.92;
    gl_FragColor=vec4(col,alpha);
  }
`;

function buildScene(canvas) {
  const T = THREE;
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  // 1.5 cap: the per-pixel fbm/snoise shaders scale quadratically with
  // resolution; 1.5 + MSAA is visually indistinguishable from native 2×
  let pixRatio = Math.min(devicePixelRatio, 1.5);
  renderer.setPixelRatio(pixRatio);
  renderer.setClearColor(0x02030a, 1);

  // Kein Post-Processing mehr: Bloom war der Glow — direkter Renderer-Output,
  // Canvas-MSAA übernimmt das Anti-Aliasing.
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(42, 2, 0.1, 300);
  camera.position.set(0, 1.8, 11.0);
  camera.lookAt(0, 0, 0);

  /* STARS — static field (no atmosphere in space, so no twinkle).
     Brightness follows a power law (few bright, many faint), colors span
     real stellar temperatures, and ~55 % of the stars concentrate along a
     tilted great circle → a believable Milky Way band. */
  const N = 3400;
  const sp = new Float32Array(N * 3);
  const ss = new Float32Array(N);
  const sc = new Float32Array(N * 3);
  const bandN = new T.Vector3(0.32, 0.86, 0.40).normalize(); // galactic plane normal
  const tmpV = new T.Vector3();
  for (let i = 0; i < N; i++) {
    const r = 60 + Math.random() * 70, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    tmpV.set(
      Math.sin(ph) * Math.cos(th),
      Math.sin(ph) * Math.sin(th),
      Math.cos(ph)
    );
    if (i % 100 < 55) {
      // squash the component along the band normal → star settles near the plane
      const d = tmpV.dot(bandN) * (1 - 0.16);
      tmpV.addScaledVector(bandN, -d).normalize();
    }
    sp[i*3]   = tmpV.x * r;
    sp[i*3+1] = tmpV.y * r;
    sp[i*3+2] = tmpV.z * r;
    ss[i] = 0.30 + Math.pow(Math.random(), 3) * 1.7;
    // color temperature: many warm-white dwarfs, few blue giants / red giants
    const tint = Math.random();
    sc[i*3]   = tint < .10 ? 1   : (tint > .88 ? .72 : .96);
    sc[i*3+1] = tint < .10 ? .80 : (tint > .88 ? .82 : .94);
    sc[i*3+2] = tint < .10 ? .62 : (tint > .88 ? 1   : .90);
  }
  const sGeo = new T.BufferGeometry();
  sGeo.setAttribute('position', new T.BufferAttribute(sp, 3));
  sGeo.setAttribute('starSize', new T.BufferAttribute(ss, 1));
  sGeo.setAttribute('color', new T.BufferAttribute(sc, 3));
  const starMat = new T.ShaderMaterial({
    vertexShader: `attribute float starSize;attribute vec3 color;varying vec3 vC;void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=starSize*(700./-mv.z);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying vec3 vC;void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.22,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(vC,a*.8);}`,
    transparent: true, depthWrite: false, blending: T.AdditiveBlending
  });
  const stars = new T.Points(sGeo, starMat);
  scene.add(stars);

  /* SYSTEM */
  const system = new T.Group();
  system.rotation.x = -0.55;
  system.rotation.z = 0.07;
  scene.add(system);

  /* SUN */
  const sunGroup = new T.Group();
  system.add(sunGroup);

  const sunMat = new T.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: NOISE_LIB + `
      varying vec3 vP;varying vec3 vN;uniform float uTime;
      void main(){
        float t=uTime*.18;
        /* domain-warped convection cells — supergranulation */
        vec3 w=vec3(fbm2(vP*2.2+t),fbm2(vP*2.2+t+5.1),fbm2(vP*2.2+t+9.7))*.4;
        float n1=fbm3(vP*1.8+w+t);
        float gran=snoise(vP*14.+t*1.4)*.5+.5;
        /* photosphere: hot near-white cells over deep orange lanes —
           high contrast is what makes granulation read as plasma */
        vec3 col=mix(vec3(.72,.26,.04),vec3(1.,.78,.42),smoothstep(-.45,.45,n1));
        col=mix(col,vec3(1.,.94,.80),smoothstep(.30,.80,n1));
        col+=vec3(1.,.85,.5)*pow(max(gran-.55,0.),3.)*1.6;
        col=mix(col,vec3(.42,.13,.02),smoothstep(.5,.95,-n1)*.6);
        /* empirical solar limb darkening: I(mu) ≈ .35+.65*mu^.8 */
        float mu=max(dot(normalize(vN),vec3(0,0,1)),0.);
        col*=.35+.65*pow(mu,.8);
        col*=1.35;
        gl_FragColor=vec4(col,1.);
      }
    `
  });
  const sunCore = new T.Mesh(new T.SphereGeometry(.92, 64, 48), sunMat);
  sunGroup.add(sunCore);

  /* Radial-Sprite-Textur — nur noch für den Kometenkopf gebraucht;
     die Sonnen-Korona-Sprites (der Glow) sind raus. */
  const mkGlowCanvas = (stops) => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    stops.forEach(([t, col]) => gr.addColorStop(t, col));
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    const tex = new T.CanvasTexture(c); tex.minFilter = T.LinearFilter; return tex;
  };

  /* PLANET MODULES — orbital speed follows Kepler's third law (v ∝ r^-3/2,
     k=0.85 keeps the innermost planet at its previous pace); `rot` is the
     axial spin (gas giants rotate fastest, tidally-locked moon barely). */
  const KEPLER = 0.85;
  const modules = [
    { r:2.20,sz:.30,phase:.3,  tilt:.03,  rot:.16, surf:SURF_EARTH,  atmo:[.30,.55,.95],atmoI:.55 },
    { r:3.05,sz:.40,phase:1.6, tilt:-.05, rot:.11, surf:SURF_ICE,    atmo:[.55,.75,.90],atmoI:.30 },
    { r:3.88,sz:.28,phase:3.0, tilt:.04,  rot:.15, surf:SURF_MARS,   atmo:[.85,.55,.35],atmoI:.22 },
    { r:4.92,sz:.55,phase:4.7, tilt:-.03, rot:.42, surf:SURF_GAS,    atmo:[.82,.70,.50],atmoI:.35,rings:true },
    { r:6.08,sz:.34,phase:5.9, tilt:.05,  rot:.03, surf:SURF_MOON,   atmo:[.55,.54,.52],atmoI:.10 },
    { r:7.12,sz:.22,phase:1.2, tilt:-.04, rot:.12, surf:SURF_ENERGY, atmo:[.55,.85,.30],atmoI:.40,future:true },
  ];
  modules.forEach(m => { m.spd = KEPLER / Math.pow(m.r, 1.5); });

  const sunWorldPos = new T.Vector3();
  const planets = [];

  modules.forEach(m => {
    // Orbit ring
    const orb = new T.Mesh(
      new T.RingGeometry(m.r-.005, m.r+.005, 160),
      new T.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:m.future?.04:.07, side:T.DoubleSide, depthWrite:false })
    );
    orb.rotation.x = Math.PI/2 + m.tilt;
    system.add(orb);

    // Planet — 60×40 segments for solid 60fps
    const segs = m.rings ? 64 : 56;
    const pMat = new T.ShaderMaterial({
      uniforms: { uTime:{value:0}, uSunPos:{value:new T.Vector3()}, uAtmo:{value:new T.Color(...m.atmo)} },
      vertexShader: PLANET_VERT,
      fragmentShader: mkPlanetFrag(m.surf)
    });
    const mesh = new T.Mesh(new T.SphereGeometry(m.sz, segs, Math.round(segs*.65)), pMat);
    system.add(mesh);

    // Atmosphere
    const atmoMat = new T.ShaderMaterial({
      side:T.FrontSide, transparent:true, depthWrite:false, blending:T.AdditiveBlending,
      uniforms:{ uSunPos:{value:new T.Vector3()}, uColor:{value:new T.Color(...m.atmo)}, uIntensity:{value:m.future?.28:m.atmoI} },
      vertexShader:ATMO_VERT, fragmentShader:ATMO_FRAG
    });
    // thin shell — real atmospheres are a sliver, not a 12 % halo
    const atmo = new T.Mesh(new T.SphereGeometry(m.sz*1.055, 32, 22), atmoMat);
    system.add(atmo);

    // Saturn rings
    let ring = null;
    if (m.rings) {
      const rIn=m.sz*1.55, rOut=m.sz*2.72;
      ring = new T.Mesh(
        new T.RingGeometry(rIn,rOut,140,1),
        new T.ShaderMaterial({
          side:T.DoubleSide, transparent:true, depthWrite:false,
          uniforms:{ uInner:{value:rIn},uOuter:{value:rOut},uSunPos:{value:new T.Vector3()} },
          vertexShader:`varying vec3 vLP;varying vec3 vWP;void main(){vLP=position;vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}`,
          fragmentShader:RING_FRAG
        })
      );
      ring.rotation.x=-Math.PI/2+.20; ring.rotation.z=.10;
      system.add(ring);
    }
    planets.push({mesh,pMat,atmo,atmoMat,ring,def:m});
  });

  /* COMET — eccentric orbit with particle trail */
  const cometTex = mkGlowCanvas([[0,'rgba(225,250,255,1)'],[.25,'rgba(150,210,255,.6)'],[.6,'rgba(80,140,255,.12)'],[1,'rgba(0,0,0,0)']]);
  const cometCore = new T.Sprite(new T.SpriteMaterial({ map: cometTex, transparent: true, opacity: .95, blending: T.AdditiveBlending, depthWrite: false }));
  cometCore.scale.set(.55, .55, 1);
  system.add(cometCore);
  const TRAIL = 64;
  const trailPos = new Float32Array(TRAIL * 3);
  const trailAge = new Float32Array(TRAIL);
  for (let i = 0; i < TRAIL; i++) trailAge[i] = i / TRAIL;
  const trailGeo = new T.BufferGeometry();
  trailGeo.setAttribute('position', new T.BufferAttribute(trailPos, 3).setUsage(T.DynamicDrawUsage));
  trailGeo.setAttribute('age', new T.BufferAttribute(trailAge, 1));
  const trailMat = new T.ShaderMaterial({
    /* real comet tails point AWAY from the sun (radiation pressure), not
       along the orbit — the sun sits at the system origin, so pushing each
       trail point outward by its age fans the tail anti-solar */
    vertexShader: `attribute float age;varying float vA;void main(){vA=1.-age;vec3 p=position+normalize(position)*age*age*1.8;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=(1.-age)*(95./-mv.z)+1.5;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying float vA;void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.1,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(mix(vec3(.35,.55,1.),vec3(.85,.95,1.),vA),a*vA*.55);}`,
    transparent: true, depthWrite: false, blending: T.AdditiveBlending
  });
  const cometTrail = new T.Points(trailGeo, trailMat);
  system.add(cometTrail);
  let cometTheta = Math.random() * Math.PI * 2;
  const cometP = 3.4, cometE = .62;
  const cometPos = new T.Vector3();

  /* MOON of the gas giant */
  const gasMoonMat = new T.ShaderMaterial({
    uniforms: { uTime:{value:0}, uSunPos:{value:new T.Vector3()}, uAtmo:{value:new T.Color(.7,.7,.66)} },
    vertexShader: PLANET_VERT, fragmentShader: mkPlanetFrag(SURF_MOON)
  });
  const gasMoon = new T.Mesh(new T.SphereGeometry(.085, 26, 18), gasMoonMat);
  system.add(gasMoon);

  /* INTERACTION */
  let tmx=0,tmy=0,mx=0,my=0,scrollYv=0;
  const onPointer = e => { tmx=(e.clientX/innerWidth)-.5; tmy=(e.clientY/innerHeight)-.5; };
  const onScroll  = () => { scrollYv=Math.min(window.scrollY/innerHeight,1.2); };
  addEventListener('pointermove', onPointer, {passive:true});
  addEventListener('scroll',      onScroll,  {passive:true});

  const onResize = () => {
    const el = canvas.parentElement;
    if (!el) return;
    const w=el.clientWidth, h=el.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  };
  onResize();
  addEventListener('resize', onResize);

  /* LOOP — läuft nur, solange der Hero im Viewport ist. Ohne Pause rendert
     die Szene beim Scrollen durch die restliche Seite ständig weiter und
     frisst GPU/Main-Thread (spürbares Lag bis runter zur Sustainability). */
  const start=performance.now(); let last=start, rafId=0, running=false;
  let sScroll=0, trailInit=false;
  // Adaptive resolution: sample real frame time over 90-frame windows
  // (first 60 frames skipped — shader compile stalls) and step the pixel
  // ratio down 0.25 at a time while the GPU can't hold ~42fps.
  let perfAcc=0, perfN=-60;
  const animate = () => {
    if (!running) return;
    rafId = requestAnimationFrame(animate);
    const now = performance.now();
    const raw = (now-last)/1000;
    const dt = Math.min(raw, 1/20);
    last = now;
    perfN++;
    if (perfN > 0) perfAcc += raw;
    if (perfN === 90) {
      if (perfAcc/90 > 0.024 && pixRatio > 1) {
        pixRatio = Math.max(1, pixRatio - 0.25);
        renderer.setPixelRatio(pixRatio);
        onResize();
      }
      perfAcc = 0; perfN = 0;
    }
    const t = (now-start)/1000;
    mx+=(tmx-mx)*.05; my+=(tmy-my)*.05;
    sScroll+=(scrollYv-sScroll)*.06;
    // Cinematic fly-in — quintic ease-out settles without a visible stop
    const ie = 1-Math.pow(1-Math.min(1,t/3.2),5);
    camera.position.set(0, 1.8+(1-ie)*1.7, 11.0+(1-ie)*4.6);
    camera.lookAt(0,0,0);
    system.rotation.y = t*.028+mx*.26-(1-ie)*.65;
    system.rotation.x = -.55+my*.09-sScroll*.16;
    system.position.y = -sScroll*.7;
    sunMat.uniforms.uTime.value = t;
    sunCore.rotation.y = t*.07;
    sunCore.scale.setScalar(1+Math.sin(t*.9)*.006);
    sunGroup.getWorldPosition(sunWorldPos);
    stars.rotation.y = t*.003;
    // Comet — Kepler-ish sweep, faster near perihelion
    const cr = cometP/(1+cometE*Math.cos(cometTheta));
    cometTheta += dt*1.35/(cr*cr);
    cometPos.set(Math.cos(cometTheta)*cr, Math.sin(cometTheta)*cr*.16, Math.sin(cometTheta)*cr);
    cometCore.position.copy(cometPos);
    const cs=.3+1.1/cr; cometCore.scale.set(cs,cs,1);
    if (!trailInit) {
      trailInit = true;
      for (let i=0;i<TRAIL;i++){trailPos[i*3]=cometPos.x;trailPos[i*3+1]=cometPos.y;trailPos[i*3+2]=cometPos.z;}
    } else {
      for (let i=TRAIL-1;i>0;i--){trailPos[i*3]=trailPos[(i-1)*3];trailPos[i*3+1]=trailPos[(i-1)*3+1];trailPos[i*3+2]=trailPos[(i-1)*3+2];}
      trailPos[0]=cometPos.x;trailPos[1]=cometPos.y;trailPos[2]=cometPos.z;
    }
    trailGeo.attributes.position.needsUpdate = true;
    // Moon around the gas giant
    const gd=modules[3], ga=gd.phase+t*gd.spd;
    const gx=Math.cos(ga)*gd.r, gy=Math.sin(ga*.55+gd.tilt*4.)*.09, gz=Math.sin(ga)*gd.r;
    const ma=t*.85;
    gasMoon.position.set(gx+Math.cos(ma)*1.18, gy+Math.sin(ma)*.26, gz+Math.sin(ma)*1.18);
    gasMoon.rotation.y = t*.3;
    gasMoonMat.uniforms.uTime.value = t;
    gasMoonMat.uniforms.uSunPos.value.copy(sunWorldPos);
    for (const {mesh,pMat,atmo,atmoMat,ring,def} of planets) {
      const a=def.phase+t*def.spd;
      const px=Math.cos(a)*def.r, py=Math.sin(a*.55+def.tilt*4.)*.09, pz=Math.sin(a)*def.r;
      mesh.position.set(px,py,pz); mesh.rotation.y+=dt*def.rot;
      pMat.uniforms.uTime.value=t; pMat.uniforms.uSunPos.value.copy(sunWorldPos);
      atmo.position.set(px,py,pz); atmoMat.uniforms.uSunPos.value.copy(sunWorldPos);
      if(ring){ring.position.set(px,py,pz);ring.material.uniforms.uSunPos.value.copy(sunWorldPos);}
    }
    renderer.render(scene, camera);
  };
  const setRunning = (on) => {
    if (on === running) return;
    running = on;
    if (on) { last = performance.now(); rafId = requestAnimationFrame(animate); }
    else cancelAnimationFrame(rafId);
  };
  const io = new IntersectionObserver(
    ([e]) => setRunning(e.isIntersecting),
    { rootMargin: '25% 0px' }
  );
  io.observe(canvas);

  return () => {
    io.disconnect();
    setRunning(false);
    removeEventListener('pointermove',onPointer);
    removeEventListener('scroll',onScroll);
    removeEventListener('resize',onResize);
    renderer.dispose();
  };
}

function HeroCanvas() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  // Mount the WebGL canvas only while the hero is (near) the viewport. The ISS
  // section lower on the page runs its own r3f WebGL context — keeping both
  // contexts alive at once janks the page and can hit the browser's per-page
  // context cap on mobile. By unmounting offscreen, buildScene's cleanup runs
  // (disposes the renderer, drops the GL context) so only ONE of the two
  // hero/ISS contexts is ever live at a time.
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setMounted(e.isIntersecting),
      { rootMargin: '25% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;
    return buildScene(canvasRef.current);
  }, [mounted]);

  return (
    <div
      ref={wrapRef}
      style={{position:'absolute',inset:0,zIndex:0,background:'#02030a'}}
      aria-hidden="true"
    >
      {mounted && (
        <canvas ref={canvasRef} style={{position:'absolute',inset:0,zIndex:0,display:'block',width:'100%',height:'100%'}}/>
      )}
    </div>
  );
}

/* ─── HERO ───────────────────────────────────────────────── */
function Hero({ onCTA }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { const t = setTimeout(() => setRevealed(true), 80); return () => clearTimeout(t); }, []);
  return (
    <section className={`hero${revealed?' revealed':''}`} id="top">
      <HeroCanvas />
      <div className="wrap hero-inner">
        <span className="eyebrow hero-eyebrow">Die smarte Arbeitsstation für Betriebe</span>
        <h1 aria-label="Intelligenz, die mitarbeitet.">
          <span className="word"><span>Intelligenz,</span></span><br/>
          <span className="word"><span>die </span></span>
          <span className="word"><span><em>mit­arbeitet.</em></span></span>
        </h1>
        <p className="lead">
          NILL verbindet <strong>Postfach, Aufgaben, Lieferscheine, Inventur, Zeiterfassung</strong> und <strong>Teamverwaltung</strong> zu einer Arbeitsstation — unterstützt von einer KI, die mitliest und Arbeit vorbereitet.
        </p>
        <div className="hero-cta">
          <MagBtn className="btn btn-primary" href="/register"><span>Kostenlos registrieren</span></MagBtn>
          <MagBtn className="btn btn-ghost" onClick={e=>{e.preventDefault();onCTA('Demo')}} href="#"><span>Live-Demo</span></MagBtn>
        </div>
        <p className="hero-trial-note">14 Tage kostenlos testen — keine Kreditkarte nötig.</p>
      </div>
      <div className="hero-meta">
        <span>NILL · Arbeitsstation</span>
        <div className="scroll-ind"><span>scroll</span><div className="scroll-bar"/></div>
        <span>DE · Made in Germany</span>
      </div>
    </section>
  );
}

/* ─── TICKER ─────────────────────────────────────────────── */
function Ticker() {
  const row = <>
    Postfach <span className="ticker-sep"/> Aufgaben <span className="ticker-sep"/> Inventur <span className="ticker-sep"/> Zeiterfassung <span className="ticker-sep"/> Team­verwaltung <span className="ticker-sep"/> Lieferscheine <span className="ticker-sep"/> <em>Ein Login.</em> <span className="ticker-sep"/>
    Postfach <span className="ticker-sep"/> Aufgaben <span className="ticker-sep"/> Inventur <span className="ticker-sep"/> Zeiterfassung <span className="ticker-sep"/> Team­verwaltung <span className="ticker-sep"/> Lieferscheine <span className="ticker-sep"/> <em>Ein Login.</em> <span className="ticker-sep"/>
  </>;
  return <div className="ticker"><div className="ticker-track" aria-hidden="true"><span>{row}</span></div></div>;
}

/* ─── PRODUCTS ───────────────────────────────────────────── */
function Products({ onCTA }) {
  const [ref, vis] = useReveal();
  return (
    <section id="produkte">
      <div className="wrap">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref}>
          <div><span className="eyebrow">Module — 05 live · 01 in Entwicklung</span><h2>Sechs Module. <br/><em>Eine</em> Intelligenz.</h2></div>
          <p className="lead">Jedes Modul steht für sich. Zusammen sind sie ein System, das deinen Betrieb kennt.</p>
        </div>
        <Reveal stagger className="bento">
          <TiltCard className="k1">
            <div className="viz" aria-hidden="true">
              <svg viewBox="0 0 600 380" preserveAspectRatio="none">
                <defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c6ff3c" stopOpacity=".18"/><stop offset="1" stopColor="#c6ff3c" stopOpacity="0"/></linearGradient></defs>
                <g transform="translate(260,40)" opacity=".8">
                  {[0,60,120,180].map((y,i)=><g key={y} className="mail-row" transform={`translate(0,${y})`}><rect width="300" height="48" rx="6" fill={i===0?"url(#mg)":"rgba(255,255,255,.03)"} stroke="rgba(255,255,255,.08)"/><circle cx="22" cy="24" r="6" fill={i===0?"#c6ff3c":"rgba(239,237,231,.25)"}/><rect x="42" y="16" width={[120,100,140,80][i]} height="6" rx="3" fill="rgba(255,255,255,.6)"/><rect x="42" y="28" width={[200,180,160,220][i]} height="4" rx="2" fill="rgba(255,255,255,.2)"/></g>)}
                </g>
              </svg>
            </div>
            <div><span className="tag"><span className="n">01</span> · Postfach</span><h3>E-Mails, die sich selbst beantworten.</h3><p>Kategorisieren, priorisieren, Antworten schreiben — NILL liest mit und arbeitet voraus.</p></div>
          </TiltCard>
          <TiltCard className="k2">
            <div><span className="tag"><span className="n">02</span> · Aufgaben & Lieferscheine</span><h3>Der Tag plant sich von selbst.</h3><p>Aufgaben fürs ganze Team, Lieferscheine per Foto erfasst — direkt an der Station im Tablet- und Kiosk-Modus.</p></div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-dim)'}}>
              {['Tablet & Kiosk','Foto-Erfassung','PDF-Export'].map(t=><span key={t} style={{padding:'6px 10px',border:'1px solid var(--line)',borderRadius:99}}>{t}</span>)}
            </div>
          </TiltCard>
          <TiltCard className="k3">
            <div><span className="tag"><span className="n">03</span> · Inventur</span><h3>Bestände, die sich selbst zählen.</h3><p>Automatische Fortschreibung, Meldegrenzen mit Benachrichtigung.</p></div>
          </TiltCard>
          <TiltCard className="k4">
            <div><span className="tag"><span className="n">04</span> · Zeiterfassung</span><h3>Zeit erfasst sich per Klick.</h3><p>Per App oder Browser. NILL weist Projekte zu und berechnet Überstunden.</p></div>
            <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-dim)',display:'flex',justifyContent:'space-between'}}><span>EuGH-konform</span><span>GPS-optional</span></div>
          </TiltCard>
          <TiltCard className="k5">
            <div><span className="tag"><span className="n">05</span> · Team­verwaltung</span><h3>Das Team, ohne Zettelwirtschaft.</h3><p>Urlaub, Krankmeldungen, Dienstpläne, Onboarding — vorbereitet von der KI.</p></div>
            <div style={{display:'flex'}}>
              {['MK','LS','JH','+9'].map((l,i)=><span key={l} className="avatar" style={{width:28,height:28,fontSize:10,marginLeft:i?-10:0}}>{l}</span>)}
            </div>
          </TiltCard>
          <TiltCard className="k6">
            <div><span className="tag"><span className="n">06</span> · KI Sekretärin</span><h3>Nimmt Anrufe entgegen. Rund um die Uhr.</h3></div>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <span className="badge">In Bearbeitung — Q3 / 2026</span>
              <MagBtn className="btn btn-ghost" style={{padding:'10px 18px'}} onClick={e=>{e.preventDefault();onCTA('Frühzugang')}} href="#"><span>Frühzugang sichern</span></MagBtn>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── MEHR ÜBER NILL ─────────────────────────────────────
   Die drei Unterseiten (Wie es arbeitet / App / Nachhaltigkeit)
   als EINE kompakte Karten-Reihe statt drei fast leerer
   Vollhöhen-Sektionen — weniger Scroll, klarere Seitenstruktur. */
const MORE_PAGES = [
  { id:'wie', eyebrow:'Wie es arbeitet', title:'Ein Tag, von der <em>KI</em> geführt.',
    lead:'Von der ersten Mail um 07:48 bis zum neuen Dienstplan um 16:48 — Schritt für Schritt durch alle Module.', to:'/wie-es-arbeitet' },
  { id:'app', eyebrow:'Progressive Web App', title:'NILL als App. <em>Ohne Store.</em>',
    lead:'Direkt aus dem Browser installiert — auf iOS, Android, macOS und Windows. Offline-fähig, mit Push.', to:'/app' },
  { id:'nachhaltigkeit', eyebrow:'Nachhaltigkeit', title:'Intelligenz mit <em>Verantwortung.</em>',
    lead:'100 % Ökostrom in Frankfurt, kompensierte Drittanbieter und ein jährlicher Nachhaltigkeitsbericht.', to:'/nachhaltigkeit' },
];
function MoreSection() {
  const [ref, vis] = useReveal();
  return (
    <section id="mehr">
      <div className="wrap">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref}>
          <div><span className="eyebrow">Vertiefungen — 03 Seiten</span><h2>Mehr über <em>NILL.</em></h2></div>
        </div>
        <Reveal stagger className="more-grid">
          {MORE_PAGES.map(m => (
            <article className="card more-card" id={m.id} key={m.id}>
              <div>
                <span className="eyebrow">{m.eyebrow}</span>
                <h3 dangerouslySetInnerHTML={{__html:m.title}}/>
                <p>{m.lead}</p>
              </div>
              <MagBtn className="btn btn-ghost" to={m.to}><span>Mehr erfahren</span></MagBtn>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ─── STATS ───────────────────────────────────────────────
   Only verifiable facts — no invented benchmark numbers, no
   count-up animation. */
function Stats() {
  const [ref, vis] = useReveal();
  return (
    <section style={{padding:'0 0 140px'}}>
      <div className="wrap">
        <div className={`stats stagger${vis?' in':''}`} ref={ref}>
          <div className="stat"><div className="num"><em>30</em><span>€</span></div><div className="label">Pro Monat · alle Mitarbeiter</div></div>
          <div className="stat"><div className="num"><em>05</em><span>·</span><em>01</em></div><div className="label">Module live · Ein Login</div></div>
          <div className="stat"><div className="num"><em>100</em><span>%</span></div><div className="label">Gehostet in Deutschland</div></div>
          <div className="stat"><div className="num"><em>48</em><span>h</span></div><div className="label">Bis dein Team produktiv ist</div></div>
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ────────────────────────────────────────────── */
const PRICING_TIERS = [
  {tier:'Arbeitsstation',sub:'Die smarte Arbeitsstation für deinen Betrieb — Tablet & Kiosk',price:'30',per:'€ / Monat · unbegrenzte Stationen & Mitarbeiter',items:['Zeiterfassung mit QR-Mitarbeiterausweis','Aufgaben- & Taskmanagement fürs ganze Team','Lieferscheine, Inventur & Bestandsführung','E-Mail-Integration: Gmail, Outlook & IMAP','Teamverwaltung, Rollen & HR-Dokumente'],pop:true},
];
function PricingCard({tier,sub,price,per,items,pop}) {
  return (
    <article className={`price${pop?' pop':''}`}>
      <div><span className="eyebrow">{tier}</span><h3 style={{marginTop:12}}>{sub}</h3></div>
      <div className="price-tag"><span className="num" style={price.length>3?{fontSize:52}:{}}>{price}</span>{per&&<span className="per">{per}</span>}</div>
      <ul>{items.map(i=><li key={i}>{i}</li>)}</ul>
      <MagBtn className={`btn ${pop?'btn-primary':'btn-ghost'}`} href="/pricing"><span>Details ansehen</span></MagBtn>
    </article>
  );
}
function Pricing() {
  const [ref, vis] = useReveal();
  return (
    <section id="preise">
      <div className="wrap">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref}>
          <div><span className="eyebrow">Preise — einfach gehalten</span><h2>Ein Preis. <br/><em>Fertig.</em></h2></div>
          <p className="lead">Transparent. Ohne versteckte Kosten. Monatlich kündbar. Die Komplett-Suite mit KI Sekretärin ist in Entwicklung — Details auf der Preisseite.</p>
        </div>
        <Reveal className="pricing-grid" style={{gridTemplateColumns:'minmax(0,420px)',justifyContent:'center'}}>
          {PRICING_TIERS.map(t => <PricingCard key={t.tier} {...t} />)}
        </Reveal>
      </div>
    </section>
  );
}

/* (old inline Sustainability removed — superseded by sections/sustainability/SustainabilitySection) */

/* ─── FAQ ────────────────────────────────────────────────── */
function FAQ() {
  const [ref, vis] = useReveal();
  const items = [
    ['Wo werden meine Daten gespeichert?','Alle Daten liegen verschlüsselt auf Servern in Deutschland (Frankfurt). Wir sind nach DSGVO geprüft und bieten auf Wunsch eine Private-Cloud-Instanz.'],
    ['Was genau ist die Arbeitsstation?','Ein Tablet- oder Kiosk-Arbeitsplatz für deinen Betrieb: Zeiterfassung per QR-Ausweis, Aufgaben, Lieferscheine und Inventur — ein Preis, beliebig viele Mitarbeiter.'],
    ['Wie lange dauert das Onboarding?','Die meisten Teams sind in 48 Stunden produktiv. Wir unterstützen bei der Einrichtung deiner E-Mail-Konten und Module.'],
    ['Was passiert, wenn die KI einen Fehler macht?','Jede automatische Aktion ist standardmäßig im "Vorschlags-Modus". Du entscheidest, was direkt geht, was freigegeben werden muss, und was dokumentiert wird.'],
    ['Wie nachhaltig ist NILL wirklich?','Unsere Kern-Infrastruktur läuft auf 100 % Ökostrom in Frankfurt. Drittanbieter kompensieren wir zu 105 % über Gold-Standard-Projekte. Jährlicher Nachhaltigkeitsbericht auf Anfrage.'],
  ];
  return (
    <section id="faq">
      <div className="wrap-tight">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref} style={{marginBottom:40}}><div><span className="eyebrow">Antworten auf das Naheliegende</span><h2>FAQ.</h2></div></div>
        <Reveal stagger className="faq">
          {items.map(([q,a])=><details key={q}><summary>{q}</summary><p className="a">{a}</p></details>)}
        </Reveal>
      </div>
    </section>
  );
}

/* ─── BIG CTA ────────────────────────────────────────────── */
function BigCTA({ onCTA }) {
  const [ref, vis] = useReveal();
  return (
    <section id="cta" className="cta-big">
      <div className="wrap">
        <h2 className={`reveal${vis?' in':''}`} ref={ref}>Weniger <br/><em>Verwaltung.</em><br/>Mehr Betrieb.</h2>
        <div className={`cta-sub reveal reveal-delay-1${vis?' in':''}`}>
          <p className="lead">30 Minuten Live-Demo — direkt mit dem Gründer, an deinem echten Arbeitstag. Kein Sales-Team, keine Folien.</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <MagBtn className="btn btn-primary" onClick={e=>{e.preventDefault();onCTA('Termin')}} href="#"><span>Termin buchen</span></MagBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── APP ────────────────────────────────────────────────── */
export default function LandingPage() {
  ensureInit();
  const [modalIntent, setModalIntent] = useState(null);
  const openModal = useCallback((intent) => setModalIntent(intent || 'default'), []);
  const closeModal = useCallback(() => setModalIntent(null), []);

  return (
    <>
      <ScrollProgress/>
      <LandingNav/>
      <Hero onCTA={openModal}/>
      <ISSSection />
      <Ticker/>
      <Products onCTA={openModal}/>
      <Stats/>
      <Pricing onCTA={openModal}/>
      <MoreSection/>
      <FAQ/>
      <BigCTA onCTA={openModal}/>

      <Footer/>
      <Modal intent={modalIntent} onClose={closeModal}/>
    </>
  );
}