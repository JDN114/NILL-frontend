import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
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

function useTilt(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const mv = e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
      el.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
      const rx = ((e.clientY-r.top-r.height/2)/r.height)*-4;
      const ry = ((e.clientX-r.left-r.width/2)/r.width)*4;
      el.style.transform = `translateY(-4px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const ml = () => el.style.transform = '';
    el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', ml);
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', ml); };
  }, []);
}

/* ─── TILT CARD ──────────────────────────────────────────── */
function TiltCard({ className, style, children }) {
  const ref = useRef(null);
  useTilt(ref);
  return <article ref={ref} className={`card ${className||''}`} style={style}>{children}</article>;
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
  vec3 tonemap(vec3 c){c=c/(c+1.);return pow(clamp(c,0.,1.),vec3(1./2.2));}
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
    float rim=pow(1.-max(dot(wN,vD),0.),2.2);
    float sunF=pow(max(dot(wN,sD)*.55+.45,0.),1.);
    float alpha=rim*uIntensity*sunF;
    gl_FragColor=vec4(uColor*alpha,alpha);
  }
`;

function mkPlanetFrag(surfCode) {
  return NOISE_LIB + `
    varying vec3 vLP;varying vec3 vWP;varying vec3 vWN;
    uniform float uTime;uniform vec3 uSunPos;uniform vec3 uAtmo;
    ${surfCode}
    void main(){
      vec3 op=normalize(vLP);
      vec3 worldN=normalize(vWN);
      vec3 sunDir=normalize(uSunPos-vWP);
      vec3 viewDir=normalize(cameraPosition-vWP);
      vec3 col=getSurf(op);
      float spec=getSpec(op);
      vec3 emit=getEmit(op);
      float NdotL_geo=dot(worldN,sunDir);
      float NdotL=max(NdotL_geo,0.);
      vec3 diff=col*NdotL;
      vec3 hv=normalize(sunDir+viewDir);
      float NdotH=max(dot(worldN,hv),0.);
      float specV=pow(NdotH,20.+spec*200.)*spec*NdotL;
      vec3 specCol=mix(vec3(.9,.96,1.),vec3(1.),spec*.5)*specV;
      float dayBlend=smoothstep(-.06,.20,NdotL_geo);
      vec3 final=mix(col*.010+emit,diff+specCol+col*.028,dayBlend);
      float termFac=smoothstep(-.15,0.,NdotL_geo)*(1.-smoothstep(0.,.4,NdotL_geo));
      final+=uAtmo*termFac*.20;
      final+=uAtmo*pow(1.-max(dot(worldN,viewDir),0.),3.)*smoothstep(0.,.3,NdotL_geo)*.25;
      gl_FragColor=vec4(tonemap(final),1.);
    }
  `;
}

const SURF_EARTH = `
  vec3 getSurf(vec3 op){
    float h=fbm3(op*1.5);float lat=abs(op.y);
    float land=smoothstep(-.02,.15,h);
    vec3 ocean=mix(vec3(.02,.08,.22),vec3(.04,.22,.38),smoothstep(-.4,-.02,h));
    float arid=smoothstep(-.25,.5,fbm2(op*1.9+4.));
    vec3 land3d=mix(vec3(.11,.30,.07),vec3(.62,.48,.20),arid*.85);
    land3d=mix(land3d,vec3(.05,.18,.04),smoothstep(.5,.9,fbm2(op*2.8+1.2))*.6);
    land3d=mix(land3d,vec3(.34,.30,.26),smoothstep(.38,.72,h));
    land3d=mix(land3d,vec3(.93,.96,1.),smoothstep(.60,.82,h));
    land3d=mix(land3d,vec3(.93,.96,1.),smoothstep(.68,.90,lat));
    vec3 c=mix(ocean,land3d,land);
    c=mix(c,vec3(.95,.97,1.),smoothstep(.06,.5,fbm2(op*2.1+vec3(uTime*.009,0.,uTime*.006)))*.5);
    return c;
  }
  float getSpec(vec3 op){
    float h=fbm3(op*1.5);
    return (1.-smoothstep(-.02,.15,h))*(1.-smoothstep(.06,.5,fbm2(op*2.1+vec3(uTime*.009,0.,uTime*.006)))*.5)*.85;
  }
  vec3 getEmit(vec3 op){
    float h=fbm3(op*1.5);float land=smoothstep(-.02,.15,h);
    return vec3(1.,.78,.42)*smoothstep(.3,.6,fbm2(op*4.+2.))*land*.12;
  }
`;

const SURF_ICE = `
  vec3 getSurf(vec3 op){
    float h=fbm3(op*2.);float rd=ridged(op*2.8);float lat=abs(op.y);
    vec3 c=mix(vec3(.02,.08,.20),vec3(.12,.48,.62),smoothstep(-.25,.35,h));
    c=mix(c,vec3(.84,.95,1.),smoothstep(.52,.80,rd));
    c=mix(c,vec3(.01,.06,.18),smoothstep(.65,.88,ridged(op*4.8+1.7))*.6);
    c=mix(c,vec3(.84,.95,1.),smoothstep(.50,.82,lat));
    c+=vec3(.08,.35,.55)*smoothstep(.70,.90,rd)*.22;
    return c;
  }
  float getSpec(vec3 op){return .55+smoothstep(.4,.85,ridged(op*2.8))*.38;}
  vec3 getEmit(vec3 op){return vec3(0.);}
`;

const SURF_MARS = `
  vec3 getSurf(vec3 op){
    float h=fbm3(op*1.7+.3);float rd=ridged(op*2.8);
    vec3 c=mix(vec3(.22,.05,.02),vec3(.68,.22,.08),smoothstep(-.35,.6,h));
    c=mix(c,vec3(.80,.48,.28),smoothstep(0.,.6,fbm2(op*4.+1.3))*.5);
    c=mix(c,vec3(.22,.05,.02),smoothstep(.45,.82,rd)*.8);
    c=mix(c,vec3(.90,.86,.80),smoothstep(.80,.94,abs(op.y)));
    float lava=smoothstep(.82,.96,ridged(op*3.8));
    c+=vec3(1.4,.38,.07)*lava*(.75+.25*sin(uTime*1.8));
    return c;
  }
  float getSpec(vec3 op){return .07;}
  vec3 getEmit(vec3 op){return vec3(.9,.22,.04)*smoothstep(.82,.96,ridged(op*3.8))*.18;}
`;

const SURF_GAS = `
  vec3 getSurf(vec3 op){
    float y=op.y;
    float turb=fbm2(vec3(op.x,y*2.2,op.z)*2.+uTime*.02);
    float fine=snoise(op*7.+uTime*.03)*.5+.5;
    float bands=sin(y*7.5+turb*2.8)*(.5+fine*.2);
    vec3 c=mix(vec3(.56,.32,.12),vec3(.92,.84,.68),smoothstep(-.6,.6,bands));
    c=mix(c,vec3(.74,.52,.28),smoothstep(.3,.8,abs(y)*.4+turb*.3));
    c=mix(c,vec3(.40,.22,.08),smoothstep(.4,.85,-bands+.1));
    c=mix(c,vec3(.96,.91,.78),smoothstep(.65,.85,sin(y*18.+turb*5.))*.3);
    vec2 sp=(op.xy-vec2(.32,-.09))*vec2(1.2,2.);
    float spot=exp(-dot(sp,sp)*22.);
    c=mix(c,vec3(.90,.45,.70),spot*.75);
    vec2 eye=(op.xy-vec2(.32,-.09))*vec2(2.,3.2);
    c=mix(c,vec3(.98,.82,.62),exp(-dot(eye,eye)*80.)*.9);
    return c;
  }
  float getSpec(vec3 op){return .03;}
  vec3 getEmit(vec3 op){return vec3(0.);}
`;

const SURF_MOON = `
  vec3 getSurf(vec3 op){
    float h=fbm3(op*2.2);float rd=ridged(op*3.2);
    vec3 c=mix(vec3(.72,.70,.66),vec3(.18,.17,.16),smoothstep(.02,-.2,h));
    c+=vec3(.20,.19,.18)*smoothstep(.60,.88,rd)*.9;
    c-=vec3(.08,.07,.07)*smoothstep(.70,.90,ridged(op*6.5+3.))*.8;
    c=mix(c,vec3(.90,.88,.84),smoothstep(.85,.96,snoise(op*18.)*.5+.5)*smoothstep(0.,.3,h)*.6);
    return c;
  }
  float getSpec(vec3 op){return .04;}
  vec3 getEmit(vec3 op){return vec3(0.);}
`;

const SURF_ENERGY = `
  vec3 getSurf(vec3 op){
    float pulse=.8+.2*sin(uTime*1.3);
    float glow=smoothstep(.72,.92,ridged(op*3.2))*pulse;
    vec3 c=vec3(.03,.06,.02)+fbm2(op*3.)*.03*vec3(.3,1.,.2);
    c+=vec3(1.3,2.,.42)*glow;
    c+=vec3(.8,1.35,.20)*smoothstep(.78,.96,ridged(op*5.5+1.5))*pulse*.55;
    return c;
  }
  float getSpec(vec3 op){return .10;}
  vec3 getEmit(vec3 op){return vec3(.76,1.18,.19)*smoothstep(.72,.92,ridged(op*3.2))*(.8+.2*sin(uTime*1.3))*.28;}
`;

const RING_FRAG = NOISE_LIB + `
  varying vec3 vLP;varying vec3 vWP;
  uniform float uInner,uOuter;uniform vec3 uSunPos;
  void main(){
    float rr=length(vLP.xy);
    float rn=clamp((rr-uInner)/(uOuter-uInner),0.,1.);
    float bands=.5+.5*sin(rn*140.+fbm2(vec3(rn*25.,0.,0.))*4.);
    float detail=fbm2(vec3(rn*70.,atan(vLP.y,vLP.x)*3.,0.));
    float gap1=smoothstep(.30,.34,rn)*(1.-smoothstep(.34,.40,rn));
    float gap2=smoothstep(.68,.71,rn)*(1.-smoothstep(.71,.74,rn));
    vec3 col=mix(vec3(.30,.20,.50),vec3(.80,.70,1.),bands*.8+detail*.25);
    float alpha=.85*(1.-gap1*.94)*(1.-gap2*.80);
    alpha*=smoothstep(0.,.06,rn)*smoothstep(1.,.93,rn)*(.62+detail*.4);
    col*=abs(normalize(uSunPos-vWP).y)*.5+.5;
    gl_FragColor=vec4(col,alpha);
  }
`;

function buildScene(canvas) {
  const T = THREE;
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  // 1.25 statt 1.5: die Planeten-Shader (fbm/snoise pro Pixel) sind teuer —
  // auf Retina ~30 % weniger Fragment-Last, visuell kaum unterscheidbar
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x02030a, 1);

  const composer = new EffectComposer(renderer)

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(42, 2, 0.1, 300);
  camera.position.set(0, 1.8, 11.0);
  camera.lookAt(0, 0, 0);

  composer.addPass(new RenderPass(scene, camera))
  const bloomPass = new UnrealBloomPass(
    new T.Vector2(window.innerWidth, window.innerHeight),
    0.45,  // strength — was 1.1, halved+ to kill the blown-out hero glow
    0.6,   // radius
    0.55   // threshold — was 0.12 (everything bloomed); now only the sun core blooms
  )
  composer.addPass(bloomPass)

  /* STARS — ISS-quality shader: 2200 stars, color-tinted, same GLSL as ISSScene */
  const N = 2200;
  const sp = new Float32Array(N * 3);
  const ss = new Float32Array(N);
  const sc = new Float32Array(N * 3);
  const stw = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    stw[i] = Math.random() * Math.PI * 2;
    const r = 60 + Math.random() * 70, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    sp[i*3]   = r * Math.sin(ph) * Math.cos(th);
    sp[i*3+1] = r * Math.sin(ph) * Math.sin(th);
    sp[i*3+2] = r * Math.cos(ph);
    ss[i] = 0.4 + Math.random() * 1.4;
    const tint = Math.random();
    sc[i*3]   = tint < .15 ? 1   : (tint > .85 ? .7  : .95);
    sc[i*3+1] = tint < .15 ? .85 : (tint > .85 ? .8  : .95);
    sc[i*3+2] = tint < .15 ? .7  : (tint > .85 ? 1   : .95);
  }
  const sGeo = new T.BufferGeometry();
  sGeo.setAttribute('position', new T.BufferAttribute(sp, 3));
  sGeo.setAttribute('starSize', new T.BufferAttribute(ss, 1));
  sGeo.setAttribute('color', new T.BufferAttribute(sc, 3));
  sGeo.setAttribute('twinkle', new T.BufferAttribute(stw, 1));
  const starMat = new T.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `attribute float starSize;attribute vec3 color;attribute float twinkle;uniform float uTime;varying vec3 vC;varying float vTw;void main(){vC=color;vTw=.72+.28*sin(uTime*1.6+twinkle*7.);vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=starSize*(.85+.3*sin(uTime*1.1+twinkle*5.))*(700./-mv.z);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying vec3 vC;varying float vTw;void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.25,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(vC,a*.85*vTw);}`,
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
        float t=uTime*.22;
        float n1=fbm3(vP*1.8+t);
        float n2=fbm2(vP*3.-t*.7);
        float gran=snoise(vP*12.+t)*.5+.5;
        vec3 col=mix(vec3(.08,.03,.01),vec3(.98,.40,.07),smoothstep(-.4,.5,n1));
        col=mix(col,vec3(1.,.88,.68),smoothstep(.3,.8,n1+n2*.2));
        col+=vec3(.80,1.,.28)*pow(max(gran-.5,0.),4.)*1.1;
        col=mix(col,vec3(.08,.03,.01),smoothstep(.4,.9,-n2)*.5);
        float limb=pow(max(dot(normalize(vN),vec3(0,0,1)),0.),.42);
        col*=.3+limb*.95; col*=1.25;
        gl_FragColor=vec4(col,1.);
      }
    `
  });
  const sunCore = new T.Mesh(new T.SphereGeometry(.92, 64, 48), sunMat);
  sunGroup.add(sunCore);

  /* Sun glow — sprites only (no BackSide sphere rings) */
  const mkGlowCanvas = (stops) => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    stops.forEach(([t, col]) => gr.addColorStop(t, col));
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    const tex = new T.CanvasTexture(c); tex.minFilter = T.LinearFilter; return tex;
  };
  const mkSprite = (size, tex, op) => {
    const s = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false, depthTest: false }));
    s.scale.set(size, size, 1);
    sunGroup.add(s); return s;
  };
  // Bright flare halo removed — left the sun blown-out/too bright in the hero.
  const coronaTex1 = mkGlowCanvas([[0,'rgba(0,0,0,0)'],[.55,'rgba(255,130,40,.08)'],[.75,'rgba(120,80,220,.12)'],[1,'rgba(0,0,0,0)']]);
  const coronaTex2 = mkGlowCanvas([[0,'rgba(0,0,0,0)'],[.6,'rgba(80,60,180,.06)'],[.85,'rgba(198,255,60,.05)'],[1,'rgba(0,0,0,0)']]);
  const corona1      = mkSprite(10.0, coronaTex1, .48);
  const corona2      = mkSprite(17.0, coronaTex2, .24);

  /* PLANET MODULES */
  const modules = [
    { r:2.20,sz:.30,spd:.26,phase:.3,  tilt:.03,  surf:SURF_EARTH,  atmo:[.55,.90,.22],atmoI:.55 },
    { r:3.05,sz:.40,spd:.19,phase:1.6, tilt:-.05, surf:SURF_ICE,    atmo:[.18,.88,.90],atmoI:.48 },
    { r:3.88,sz:.28,spd:.15,phase:3.0, tilt:.04,  surf:SURF_MARS,   atmo:[.92,.28,.20],atmoI:.38 },
    { r:4.92,sz:.55,spd:.11,phase:4.7, tilt:-.03, surf:SURF_GAS,    atmo:[.88,.68,.35],atmoI:.42,rings:true },
    { r:6.08,sz:.34,spd:.09,phase:5.9, tilt:.05,  surf:SURF_MOON,   atmo:[.72,.70,.66],atmoI:.22 },
    { r:7.12,sz:.22,spd:.07,phase:1.2, tilt:-.04, surf:SURF_ENERGY, atmo:[.78,1.,.28], atmoI:.50,future:true },
  ];

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
    const atmo = new T.Mesh(new T.SphereGeometry(m.sz*1.12, 32, 22), atmoMat);
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
    vertexShader: `attribute float age;varying float vA;void main(){vA=1.-age;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=(1.-age)*(95./-mv.z)+1.5;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `varying float vA;void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.1,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(mix(vec3(.35,.55,1.),vec3(.85,.95,1.),vA),a*vA*.6);}`,
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
    composer.setSize(w,h);
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
  const animate = () => {
    if (!running) return;
    rafId = requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min((now-last)/1000, 1/20);
    last = now;
    const t = (now-start)/1000;
    mx+=(tmx-mx)*.05; my+=(tmy-my)*.05;
    sScroll+=(scrollYv-sScroll)*.06;
    // Cinematic fly-in over the first ~2.8s
    const ie = 1-Math.pow(1-Math.min(1,t/2.8),3);
    camera.position.set(0, 1.8+(1-ie)*1.7, 11.0+(1-ie)*4.6);
    camera.lookAt(0,0,0);
    system.rotation.y = t*.028+mx*.26-(1-ie)*.65;
    system.rotation.x = -.55+my*.09-sScroll*.16;
    system.position.y = -sScroll*.7;
    sunMat.uniforms.uTime.value = t;
    sunCore.rotation.y = t*.07;
    sunCore.scale.setScalar(1+Math.sin(t*.9)*.018);
    corona1.material.opacity = .46+Math.sin(t*1.1)*.04;
    corona2.material.opacity = .22+Math.sin(t*.7+1.2)*.04;
    corona1.material.rotation = t*.02;
    corona2.material.rotation = -t*.015;
    sunGroup.getWorldPosition(sunWorldPos);
    stars.rotation.y = t*.003;
    starMat.uniforms.uTime.value = t;
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
    const gx=Math.cos(ga)*gd.r, gy=Math.sin(ga*.55+gd.tilt*4.)*.22, gz=Math.sin(ga)*gd.r;
    const ma=t*.85;
    gasMoon.position.set(gx+Math.cos(ma)*1.18, gy+Math.sin(ma)*.26, gz+Math.sin(ma)*1.18);
    gasMoon.rotation.y = t*.3;
    gasMoonMat.uniforms.uTime.value = t;
    gasMoonMat.uniforms.uSunPos.value.copy(sunWorldPos);
    for (const {mesh,pMat,atmo,atmoMat,ring,def} of planets) {
      const a=def.phase+t*def.spd;
      const px=Math.cos(a)*def.r, py=Math.sin(a*.55+def.tilt*4.)*.22, pz=Math.sin(a)*def.r;
      mesh.position.set(px,py,pz); mesh.rotation.y+=dt*.18;
      pMat.uniforms.uTime.value=t; pMat.uniforms.uSunPos.value.copy(sunWorldPos);
      atmo.position.set(px,py,pz); atmoMat.uniforms.uSunPos.value.copy(sunWorldPos);
      if(ring){ring.position.set(px,py,pz);ring.material.uniforms.uSunPos.value.copy(sunWorldPos);}
    }
    composer.render();
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
    composer.dispose();
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
  // (disposes renderer/composer, drops the GL context) so only ONE of the two
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
      <div className="hero-chips" aria-hidden="true">
        <span className="chip c1"><span className="chip-dot"/><span>KI aktiv</span></span>
        <span className="chip c2"><span className="chip-dot"/><span>47 Mails sortiert</span></span>
        <span className="chip c3"><span className="chip-dot"/><span>Rechnung gebucht</span></span>
        <span className="chip c4"><span className="chip-dot"/><span>Dienstplan aktualisiert</span></span>
      </div>
      <div className="wrap hero-inner">
        <span className="eyebrow hero-eyebrow">KI-Betriebssystem für Unternehmen</span>
        <h1 aria-label="Intelligenz, die mitarbeitet.">
          <span className="word"><span>Intelligenz,</span></span><br/>
          <span className="word"><span>die </span></span>
          <span className="word"><span><em>mit­arbeitet.</em></span></span>
        </h1>
        <p className="lead">
          NILL verbindet <strong style={{color:'var(--ink)',fontWeight:500}}>Postfach, Buchhaltung, Inventur, Zeiterfassung</strong> und <strong style={{color:'var(--ink)',fontWeight:500}}>Teamverwaltung</strong> zu einem einzigen System — gesteuert von einer KI, die Arbeit erkennt, entscheidet und erledigt.
        </p>
        <div className="hero-cta">
          <MagBtn className="btn btn-primary" href="/register"><span>Kostenlos registrieren</span><span className="arrow">→</span></MagBtn>
          <MagBtn className="btn btn-ghost" href="/login"><span>Login</span><span className="arrow">→</span></MagBtn>
          <MagBtn className="btn btn-ghost" onClick={e=>{e.preventDefault();onCTA('Demo')}} href="#"><span>Live-Demo</span><span className="arrow">↓</span></MagBtn>
        </div>
        <p className="hero-trial-note" style={{
          marginTop:16, fontSize:13, lineHeight:1.5,
          color:'rgba(239,237,231,.5)', letterSpacing:'.01em'
        }}>
          <span style={{color:'var(--accent)',fontWeight:500}}>14 Tage kostenlos</span> testen — keine Kreditkarte nötig.
        </p>
      </div>
      <div className="hero-meta">
        <span>NILL · KI-Betriebssystem</span>
        <div className="scroll-ind"><span>scroll</span><div className="scroll-bar"/></div>
        <span>DE · Made in Germany</span>
      </div>
    </section>
  );
}

/* ─── TICKER ─────────────────────────────────────────────── */
function Ticker() {
  const row = <>
    Postfach <em>·</em> Buchhaltung <span className="ticker-sep"/> Inventur <em>·</em> Zeiterfassung <span className="ticker-sep"/> Team­verwaltung <em>·</em> Sekretärin <span className="ticker-sep"/> <em>Ein Login.</em> <span className="ticker-sep"/>
    Postfach <em>·</em> Buchhaltung <span className="ticker-sep"/> Inventur <em>·</em> Zeiterfassung <span className="ticker-sep"/> Team­verwaltung <em>·</em> Sekretärin <span className="ticker-sep"/> <em>Ein Login.</em> <span className="ticker-sep"/>
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
          <div><span className="eyebrow">Module — 05 live · 01 in Entwicklung</span><h2>Sechs Module. <br/><em style={{fontStyle:'italic',color:'var(--accent)',fontFamily:'var(--serif)',fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'}}>Eine</em> Intelligenz.</h2></div>
          <p className="lead">Jedes Modul steht für sich — doch gemeinsam werden sie zu einem Gehirn, das dein Unternehmen versteht.</p>
        </div>
        <Reveal stagger className="bento">
          <TiltCard className="k1">
            <div className="viz" aria-hidden="true">
              <svg viewBox="0 0 600 380" preserveAspectRatio="none">
                <defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c6ff3c" stopOpacity=".25"/><stop offset="1" stopColor="#c6ff3c" stopOpacity="0"/></linearGradient></defs>
                <g transform="translate(260,40)" opacity=".8">
                  {[0,60,120,180].map((y,i)=><g key={y} className="mail-row" transform={`translate(0,${y})`}><rect width="300" height="48" rx="8" fill={i===0?"url(#mg)":"rgba(255,255,255,.03)"} stroke="rgba(255,255,255,.08)"/><circle cx="22" cy="24" r="6" fill={['#c6ff3c','#7a5cff','#38f5d0','#ff4d8d'][i]}/><rect x="42" y="16" width={[120,100,140,80][i]} height="6" rx="3" fill="rgba(255,255,255,.6)"/><rect x="42" y="28" width={[200,180,160,220][i]} height="4" rx="2" fill="rgba(255,255,255,.2)"/></g>)}
                </g>
              </svg>
            </div>
            <div><span className="tag"><span className="n">01</span> · Postfach</span><h3>E-Mails, die sich <em style={{fontStyle:'italic',color:'var(--accent)'}}>selbst beantworten.</em></h3><p>Kategorisieren, priorisieren, Antworten schreiben — NILL liest mit und arbeitet voraus.</p></div>
          </TiltCard>
          <TiltCard className="k2">
            <div><span className="tag"><span className="n">02</span> · Buchhaltung</span><h3>Belege buchen. <em style={{fontStyle:'italic',color:'var(--accent)'}}>Ohne dich.</em></h3><p>Rechnungen per Mail, Scan oder Foto — NILL erkennt, kontiert, verbucht und bereitet auf.</p></div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-dim)'}}>
              {['DATEV-ready','OCR','GoBD-konform'].map(t=><span key={t} style={{padding:'6px 10px',border:'1px solid var(--line)',borderRadius:99}}>{t}</span>)}
            </div>
          </TiltCard>
          <TiltCard className="k3">
            <div><span className="tag"><span className="n">03</span> · Inventur</span><h3>Bestände, die sich <em style={{fontStyle:'italic',color:'var(--accent)'}}>selbst zählen.</em></h3><p>Automatische Fortschreibung, Meldegrenzen mit Benachrichtigung.</p></div>
          </TiltCard>
          <TiltCard className="k4">
            <div><span className="tag"><span className="n">04</span> · Zeiterfassung</span><h3>Zeit erfasst sich <em style={{fontStyle:'italic',color:'var(--accent)'}}>per Klick.</em></h3><p>Per App oder Browser. NILL weist Projekte zu und berechnet Überstunden.</p></div>
            <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-dim)',display:'flex',justifyContent:'space-between'}}><span>EuGH-konform</span><span>GPS-optional</span></div>
          </TiltCard>
          <TiltCard className="k5">
            <div><span className="tag"><span className="n">05</span> · Team­verwaltung</span><h3>Das Team im <em style={{fontStyle:'italic',color:'var(--accent)'}}>Autopilot.</em></h3><p>Urlaub, Krankmeldungen, Dienstpläne, Onboarding — vorbereitet von der KI.</p></div>
            <div style={{display:'flex'}}>
              {['MK','LS','JH','+9'].map((l,i)=><span key={l} className="avatar" style={{width:28,height:28,fontSize:10,marginLeft:i?-10:0,background:i?['linear-gradient(135deg,var(--accent),var(--accent-4))','linear-gradient(135deg,var(--accent-3),var(--accent-2))','linear-gradient(135deg,var(--accent-4),var(--accent-3))'][i-1]:undefined}}>{l}</span>)}
            </div>
          </TiltCard>
          <TiltCard className="k6" style={{background:'linear-gradient(90deg,#0c0c10,#12130c)',borderColor:'rgba(198,255,60,.2)'}}>
            <div><span className="tag"><span className="n">06</span> · KI Sekretärin</span><h3>Nimmt Anrufe entgegen. <em style={{fontStyle:'italic',color:'var(--accent)'}}>Rund um die Uhr.</em></h3></div>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <span className="badge">In Bearbeitung — Q3 / 2026</span>
              <MagBtn className="btn btn-ghost" style={{padding:'10px 18px'}} onClick={e=>{e.preventDefault();onCTA('Frühzugang')}} href="#"><span>Frühzugang sichern</span><span className="arrow">→</span></MagBtn>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── TEASER ─────────────────────────────────────────────
   Short pointer to a spun-off section page (Wie es arbeitet /
   App / Nachhaltigkeit) with a "Mehr erfahren" link. */
function Teaser({ id, eyebrow, title, lead, to }) {
  const [ref, vis] = useReveal();
  return (
    <section id={id}>
      <div className="wrap">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref}>
          <div><span className="eyebrow">{eyebrow}</span><h2 dangerouslySetInnerHTML={{__html:title}}/></div>
          <div>
            <p className="lead">{lead}</p>
            <MagBtn className="btn btn-primary" to={to} style={{marginTop:26}}><span>Mehr erfahren</span><span className="arrow">→</span></MagBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ──────────────────────────────────────────────── */
function Stats() {
  const [ref, vis] = useReveal();
  const countRef = useRef(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!vis || !countRef.current) return;
    const start = performance.now();
    const tick = now => {
      const p = Math.min(1,(now-start)/1600);
      setCount(Math.round((1-Math.pow(1-p,3))*87));
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [vis]);
  return (
    <section style={{padding:'40px 0 120px'}}>
      <div className="wrap">
        <div className={`stats stagger${vis?' in':''}`} ref={ref}>
          <div className="stat"><div className="num"><em>3,5</em><span>×</span></div><div className="label">Schneller im Alltag</div></div>
          <div className="stat"><div className="num"><span ref={countRef}>{count}</span><em>%</em></div><div className="label">Weniger manuelle Arbeit</div></div>
          <div className="stat"><div className="num"><em>24</em><span>/</span><em>7</em></div><div className="label">KI im Einsatz</div></div>
          <div className="stat"><div className="num"><em>05</em><span>·</span><em>01</em></div><div className="label">Module live · Ein Login</div></div>
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ────────────────────────────────────────────── */
const PRICING_TIERS = [
  {tier:'Solo',sub:'Für Einzelunternehmer & kleine Büros',price:'25',per:'€ / Monat · 1–2 Nutzer',items:['E-Mail, Kalender & Buchhaltung','OCR-Belegerfassung & DATEV-ready','Rechnungserstellung & PDF-Export','KI-Kategorisierung & Vorschläge','E-Mail-Support'],pop:false},
  {tier:'Team',sub:'Für wachsende Teams & KMUs',price:'50',per:'€ / Monat · bis 10 Nutzer',items:['Alles aus Solo — für bis zu 10 Nutzer','Lohnbuchhaltung & HR-Verwaltung','Arbeitszeiterfassung & Stempeluhr','Urlaubs- & Abwesenheitsverwaltung','Priority-Support'],pop:true},
  {tier:'Business',sub:'Für größere Unternehmen',price:'90',per:'€ / Monat · 10+ Nutzer',items:['Alles aus Team — unbegrenzte Nutzer','API-Zugang & Webhooks (folgt Q4 2026)','Erweiterte KI-Automatisierungen','Priorisierter Support mit SLA-Garantie'],pop:false},
];
function PricingCard({tier,sub,price,per,items,pop}) {
  const ref2 = useRef(null);
  useTilt(ref2);
  return (
    <article ref={ref2} className={`price${pop?' pop':''}`}>
      {pop && <span className="pop-chip">Meistgewählt</span>}
      <div><span className="eyebrow" style={pop?{color:'var(--accent)'}:{}}>{tier}</span><h3 style={{marginTop:12}}>{sub}</h3></div>
      <div className="price-tag"><span className="num" style={price.length>3?{fontSize:52}:{}}>{price}</span>{per&&<span className="per">{per}</span>}</div>
      <ul>{items.map(i=><li key={i}>{i}</li>)}</ul>
      <MagBtn className={`btn ${pop?'btn-primary':'btn-ghost'}`} href="/pricing"><span>Mehr Erfahren</span><span className="arrow">→</span></MagBtn>
    </article>
  );
}
function Pricing({ onCTA }) {
  const [ref, vis] = useReveal();
  return (
    <section id="preise">
      <div className="wrap">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref}>
          <div><span className="eyebrow">Preise — einfach gehalten</span><h2>Eins. Zwei. <br/><em style={{fontStyle:'italic',color:'var(--accent)',fontFamily:'var(--serif)',fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'}}>Drei.</em></h2></div>
          <p className="lead">Transparent. Ohne versteckte Kosten. Monatlich kündbar.</p>
        </div>
        <Reveal stagger className="pricing-grid">
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
    ['Ersetzt NILL meinen Steuerberater?','Nein — NILL bereitet alles so auf, dass dein Steuerberater deutlich weniger Zeit braucht. DATEV-ready Export sorgt für reibungslose Übergabe.'],
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
        <h2 className={`reveal${vis?' in':''}`} ref={ref}>Lass deine KI <br/><em>anfangen</em><br/>zu arbeiten.</h2>
        <div className={`cta-sub reveal reveal-delay-1${vis?' in':''}`}>
          <p className="lead">30 Minuten Live-Demo mit einem unserer Produktspezialisten. Wir zeigen dir direkt an deinem Use-Case, wie NILL arbeitet.</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <MagBtn className="btn btn-primary" onClick={e=>{e.preventDefault();onCTA('Termin')}} href="#"><span>Termin buchen</span><span className="arrow">→</span></MagBtn>
            <MagBtn className="btn btn-ghost" href="#produkte"><span>Module</span><span className="arrow">↑</span></MagBtn>
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
      <div className="vignette" aria-hidden="true"/>
      <ScrollProgress/>
      <LandingNav/>
      <Hero onCTA={openModal}/>
      <ISSSection />
      <Ticker/>
      <Products onCTA={openModal}/>
      <Teaser
        id="wie"
        eyebrow="Wie es arbeitet — 05 Schritte"
        title='Ein Tag, von der <em style="font-style:italic;color:var(--accent);font-family:var(--serif)">KI</em> geführt.'
        lead="Von der ersten Mail um 07:48 bis zum neuen Dienstplan um 16:48 — sieh Schritt für Schritt, wie NILL einen kompletten Arbeitstag durch alle Module begleitet."
        to="/wie-es-arbeitet"
      />
      <Stats/>
      <Pricing onCTA={openModal}/>
      <Teaser
        id="app"
        eyebrow="Progressive Web App · ohne App Store"
        title='NILL als App. <em style="font-style:italic;color:var(--accent)">Ohne Store.</em>'
        lead="Direkt aus dem Browser installiert — auf iOS, Android, macOS und Windows. Offline-fähig, mit Push-Benachrichtigungen und ohne Update-Zwang."
        to="/app"
      />
      <Teaser
        id="nachhaltigkeit"
        eyebrow="Nachhaltigkeit"
        title='Intelligenz mit <em style="font-style:italic;color:var(--accent)">Verantwortung.</em>'
        lead="100 % Ökostrom in Frankfurt, kompensierte Drittanbieter und ein jährlicher Nachhaltigkeitsbericht. Wie NILL Effizienz und Klimaschutz zusammenbringt."
        to="/nachhaltigkeit"
      />
      <FAQ/>
      <BigCTA onCTA={openModal}/>

      <Footer/>
      <Modal intent={modalIntent} onClose={closeModal}/>
    </>
  );
}