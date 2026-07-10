import{a as u,j as e}from"./vendor-react--hPKs4bs.js";import{u as ne,T as Xe,C as ce,R as nt,a as at,A as it,S as ot,F as rt,B as qe,b as X,c as pe,d as ue,V as Te,e as ct,f as lt,g as dt,E as mt,h as ht,U as pt}from"./vendor-three-CSoBu3Eo.js";import{L as ut,F as vt,M as ft,a as se,u as ae,R as Le}from"./chrome-D51xpfb2.js";/* empty css                */import"./vendor-misc-xcvkua7f.js";import"./vendor-router-B9EJrQcr.js";function xt(){const n=document.createElement("canvas");n.width=1024,n.height=512;const s=n.getContext("2d");s.fillStyle="#d4d6dc",s.fillRect(0,0,1024,512);for(let i=0;i<2400;i++)s.fillStyle=`rgba(${100+(Math.random()*40|0)},${100+(Math.random()*40|0)},${110+(Math.random()*40|0)},${.08+Math.random()*.12})`,s.fillRect(Math.random()*1024,Math.random()*512,1+Math.random()*3,1);s.strokeStyle="rgba(20,22,28,.55)",s.lineWidth=1.2;for(let i=0;i<1024;i+=64)s.beginPath(),s.moveTo(i,0),s.lineTo(i,512),s.stroke();for(let i=0;i<512;i+=64)s.beginPath(),s.moveTo(0,i),s.lineTo(1024,i),s.stroke();s.fillStyle="rgba(40,44,52,.7)";for(let i=8;i<1024;i+=32)for(let r=8;r<512;r+=32)s.fillRect(i,r,1.5,1.5);for(let i=0;i<14;i++){const r=Math.random()*844,v=Math.random()*422,h=80+Math.random()*100,c=40+Math.random()*60;s.strokeStyle="rgba(15,17,22,.7)",s.lineWidth=2,s.strokeRect(r,v,h,c),s.fillStyle="rgba(50,55,65,.18)",s.fillRect(r,v,h,c)}for(let i=0;i<60;i++)s.fillStyle=`rgba(${30+(Math.random()*40|0)},${28+(Math.random()*30|0)},${28+(Math.random()*30|0)},${.15+Math.random()*.25})`,s.fillRect(Math.random()*1024,Math.random()*512,30+Math.random()*120,1+Math.random()*3);s.fillStyle="rgba(220,200,40,.55)",s.font="bold 14px monospace",["CAUTION","HATCH-A4","MOD-7","EXT-VENT","HIGH-V","NILL-OS"].forEach((i,r)=>s.fillText(i,60+r*160,40+r%2*220));const o=new ce(n);return o.wrapS=o.wrapT=nt,o.anisotropy=8,o}function gt(){const n=document.createElement("canvas");n.width=512,n.height=256;const s=n.getContext("2d"),o=s.createLinearGradient(0,0,512,256);o.addColorStop(0,"#0a1840"),o.addColorStop(.5,"#1a3878"),o.addColorStop(1,"#0a1d54"),s.fillStyle=o,s.fillRect(0,0,512,256);const i=32,r=32;for(let h=0;h<512;h+=i)for(let c=0;c<256;c+=r){const b=.8+Math.random()*.3;s.fillStyle=`rgba(${30*b|0},${60*b|0},${140*b|0},.95)`,s.fillRect(h+1,c+1,i-2,r-2);const S=s.createLinearGradient(h,c,h+i,c+r);S.addColorStop(0,"rgba(120,180,255,.18)"),S.addColorStop(.5,"rgba(255,255,255,.05)"),S.addColorStop(1,"rgba(20,40,90,.2)"),s.fillStyle=S,s.fillRect(h+1,c+1,i-2,r-2),s.fillStyle="rgba(180,190,210,.4)",s.fillRect(h+i/2-.5,c+1,1,r-2)}s.strokeStyle="rgba(8,12,28,.85)",s.lineWidth=1;for(let h=0;h<=512;h+=i)s.beginPath(),s.moveTo(h,0),s.lineTo(h,256),s.stroke();for(let h=0;h<=256;h+=r)s.beginPath(),s.moveTo(0,h),s.lineTo(512,h),s.stroke();const v=new ce(n);return v.anisotropy=8,v}function wt(){const a=document.createElement("canvas");a.width=a.height=128;const t=a.getContext("2d"),n=t.createRadialGradient(64,64,0,64,64,64);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.3,"rgba(255,255,255,.5)"),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,128,128),new ce(a)}function yt(){const a=document.createElement("canvas");a.width=512,a.height=64;const t=a.getContext("2d");t.fillStyle="#181a20",t.fillRect(0,0,512,64);for(let n=0;n<24;n++){const s=20+n*20,o=t.createRadialGradient(s+6,32,0,s+6,32,12);o.addColorStop(0,"rgba(255,240,200,1)"),o.addColorStop(.4,"rgba(180,220,255,.85)"),o.addColorStop(1,"rgba(40,80,160,0)"),t.fillStyle=o,t.fillRect(s-6,16,24,32),t.strokeStyle="#2a2d35",t.lineWidth=2,t.strokeRect(s,22,12,20)}return new ce(a)}function Mt(a){const t=Xe,n=xt(),s=gt(),o=wt(),i=yt(),r=new t.MeshStandardMaterial({map:n,color:16777215,metalness:.65,roughness:.42}),v=new t.MeshStandardMaterial({map:n,color:10133680,metalness:.7,roughness:.5}),h=new t.MeshStandardMaterial({color:13041468,emissive:7178772,emissiveIntensity:.9,metalness:.5,roughness:.35}),c=new t.MeshStandardMaterial({color:1842982,metalness:.75,roughness:.55}),b=new t.MeshStandardMaterial({color:13148234,metalness:.85,roughness:.25,emissive:3811848,emissiveIntensity:.15}),S=new t.MeshStandardMaterial({map:s,metalness:.7,roughness:.35,emissive:661560,emissiveIntensity:.18,side:t.DoubleSide}),P=new t.MeshBasicMaterial({map:i,transparent:!0,opacity:.95}),x=new t.Group;a.add(x),[-1,0,1].forEach((p,l)=>{const d=new t.Mesh(new t.CylinderGeometry(.88,.88,.92,32),r);if(d.rotation.z=Math.PI/2,d.position.x=p*1,x.add(d),l<2){const f=new t.Mesh(new t.CylinderGeometry(.94,.94,.12,32),b);f.rotation.z=Math.PI/2,f.position.x=p*1+.5,x.add(f)}const w=new t.Mesh(new t.CylinderGeometry(.881,.881,.22,32,1,!0),P);w.rotation.z=Math.PI/2,w.position.x=p*1,x.add(w)}),[-1.5,1.5].forEach(p=>{const l=new t.Mesh(new t.SphereGeometry(.88,32,16,0,Math.PI*2,0,Math.PI/2),r);l.rotation.z=p>0?-Math.PI/2:Math.PI/2,l.position.x=p,x.add(l)});const z=new t.Group;z.position.y=.82,z.add(new t.Mesh(new t.CylinderGeometry(.32,.38,.15,24),r));const A=new t.Mesh(new t.SphereGeometry(.3,24,16,0,Math.PI*2,0,Math.PI/2),new t.MeshStandardMaterial({color:4880568,metalness:.9,roughness:.08,emissive:3823736,emissiveIntensity:.45,transparent:!0,opacity:.88}));A.position.y=.075,z.add(A);for(let p=0;p<6;p++){const l=p/6*Math.PI*2,d=new t.Mesh(new t.BoxGeometry(.012,.3,.012),c);d.position.set(Math.cos(l)*.27,.075,Math.sin(l)*.27),d.rotation.y=-l,z.add(d)}x.add(z),[-2.55,2.55].forEach(p=>{const l=new t.Group;l.position.x=p;const d=new t.Mesh(new t.CylinderGeometry(.58,.58,1.5,24),r);d.rotation.z=Math.PI/2,l.add(d);const w=new t.Mesh(new t.SphereGeometry(.58,24,16,0,Math.PI*2,0,Math.PI/2),b);w.rotation.z=p>0?-Math.PI/2:Math.PI/2,w.position.x=p>0?.75:-.75,l.add(w);const f=new t.Mesh(new t.TorusGeometry(.58,.03,8,24),h);f.rotation.y=Math.PI/2,f.position.x=p>0?.75:-.75,l.add(f);const k=new t.Mesh(new t.CylinderGeometry(.581,.581,.18,24,1,!0),P);k.rotation.z=Math.PI/2,l.add(k);for(let K=0;K<8;K++){const Y=K/8*Math.PI*2,F=new t.Mesh(new t.BoxGeometry(.08,.04,.15),c);F.position.set((Math.random()-.5)*1,Math.cos(Y)*.6,Math.sin(Y)*.6),F.lookAt(F.position.x,0,0),l.add(F)}const L=new t.Mesh(new t.BoxGeometry(.4,.15,.12),c);L.position.set(0,-.62,0),l.add(L);const B=new t.Mesh(new t.CylinderGeometry(.04,.04,1.4,8),b);B.rotation.z=Math.PI/2,B.position.set(0,.58,.15),l.add(B),a.add(l)});const C=(p,l)=>{const d=new t.Group;d.position.x=p,[[-.13,-.13],[.13,-.13],[-.13,.13],[.13,.13]].forEach(([w,f])=>{const k=new t.Mesh(new t.CylinderGeometry(.018,.018,l,6),c);k.rotation.z=Math.PI/2,k.position.set(0,w,f),d.add(k)});for(let w=0;w<4;w++){const f=-l/2+(w+.5)*(l/4),k=new t.Mesh(new t.CylinderGeometry(.012,.012,.36,6),c);k.position.set(f,0,0),k.rotation.z=Math.PI/4,d.add(k);const L=new t.Mesh(new t.CylinderGeometry(.012,.012,.36,6),c);L.position.set(f,0,0),L.rotation.x=Math.PI/4,d.add(L)}return[-l/2,l/2].forEach(w=>{const f=new t.Mesh(new t.TorusGeometry(.18,.015,6,12),c);f.rotation.y=Math.PI/2,f.position.x=w,d.add(f)}),d};a.add(C(-1.7,.65)),a.add(C(1.7,.65));const y=[];[-1,1].forEach(p=>{const l=new t.Group,d=new t.Mesh(new t.CylinderGeometry(.13,.13,.35,12),v);d.position.y=p*.9,l.add(d);const w=new t.Mesh(new t.CylinderGeometry(.07,.07,1.7,10),v);w.position.y=p*1.95,l.add(w);const f=new t.Mesh(new t.SphereGeometry(.14,16,12),b);f.position.y=p*2.85,l.add(f),[-1,1].forEach(k=>{const L=new t.Group;L.position.set(k*2.4,p*2.85,0);const B=new t.Mesh(new t.PlaneGeometry(4.6,1.55,16,4),S);B.rotation.y=Math.PI/2*(k>0?1:-1),L.add(B);const K=new t.Mesh(new t.BoxGeometry(.08,1.55,4.6),v);L.add(K);const Y=new t.Mesh(new t.BoxGeometry(.18,.25,.25),c);Y.position.x=k>0?-2.3:2.3,L.add(Y),l.add(L),y.push(L)}),a.add(l)}),[-1,1].forEach(p=>{const l=new t.Mesh(new t.PlaneGeometry(1.2,.9),new t.MeshStandardMaterial({color:15790312,metalness:.1,roughness:.8,side:t.DoubleSide,emissive:2105376,emissiveIntensity:.05}));l.position.set(p*1.7,0,.85),l.rotation.x=Math.PI/2,a.add(l);const d=new t.Mesh(new t.BoxGeometry(1.2,.04,.04),c);d.position.set(p*1.7,0,.85),a.add(d)});const I=new t.Group;I.position.set(.4,0,1);const $=new t.Mesh(new t.CylinderGeometry(.05,.05,.55,10),v);$.position.y=.27,I.add($);const M=new t.Mesh(new t.SphereGeometry(.08,12,10),b);M.position.y=.55,I.add(M);const N=new t.Mesh(new t.SphereGeometry(.42,24,16,0,Math.PI*2,0,Math.PI/2.5),new t.MeshStandardMaterial({color:15658724,metalness:.4,roughness:.3,side:t.DoubleSide}));N.position.y=.65,N.rotation.x=-.4,I.add(N);const G=new t.Mesh(new t.ConeGeometry(.06,.18,10),c);G.position.set(0,.82,.15),G.rotation.x=Math.PI,I.add(G);for(let p=0;p<3;p++){const l=p/3*Math.PI*2,d=new t.Mesh(new t.CylinderGeometry(.006,.006,.25,6),c);d.position.set(Math.cos(l)*.12,.75,.08+Math.sin(l)*.12),d.rotation.x=.4,d.rotation.z=l,I.add(d)}a.add(I);const g=new t.Group;g.position.set(-.6,0,1);const V=new t.Mesh(new t.CylinderGeometry(.025,.025,.8,8),c);V.position.y=.4,g.add(V);const _=new t.Mesh(new t.SphereGeometry(.04,8,8),h);_.position.y=.82,g.add(_),a.add(g);const q=new t.Mesh(new t.CylinderGeometry(.32,.42,.48,24),v);q.position.set(0,-.85,.35),q.rotation.x=Math.PI/2,a.add(q);const ie=new t.Mesh(new t.TorusGeometry(.34,.04,10,24),h);ie.position.set(0,-1.05,.35),ie.rotation.x=Math.PI/2,a.add(ie);for(let p=0;p<4;p++){const l=p/4*Math.PI*2+Math.PI/4,d=new t.Mesh(new t.CylinderGeometry(.022,.022,.15,6),c);d.position.set(Math.cos(l)*.36,-1.05,.35+Math.sin(l)*.36),d.rotation.z=-Math.PI/2,a.add(d)}[[3.2,0,0],[-3.2,0,0],[0,1,1],[0,-1,1]].forEach(([p,l,d])=>{const w=new t.Group;w.position.set(p,l,d);for(let f=0;f<4;f++){const k=f/4*Math.PI*2,L=new t.Mesh(new t.ConeGeometry(.04,.12,8),c);L.position.set(Math.cos(k)*.08,Math.sin(k)*.08,0),L.rotation.x=Math.PI/2,w.add(L)}a.add(w)});const J=[];[[0,-2.9,.15],[0,-2.9,-.15],[0,-1.1,.35],[0,-1.1,-.05],[-3.2,0,0],[3.2,0,0]].forEach(([p,l,d])=>{const w=new t.Sprite(new t.SpriteMaterial({map:o,color:6336767,transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));w.scale.set(2.8,2.8,1),w.position.set(p,l,d),a.add(w);const f=new t.Sprite(new t.SpriteMaterial({map:o,color:15267071,transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));f.scale.set(.7,.7,1),f.position.set(p,l,d),a.add(f),J.push({outer:w,inner:f})});const Z=[];[[3.4,0,0,16724048],[-3.4,0,0,13041468],[0,2.95,1.2,16777215],[0,-2.95,1.2,16777215],[0,0,1.4,16747068],[0,0,-1.4,6741503]].forEach(([p,l,d,w])=>{const f=new t.Mesh(new t.SphereGeometry(.05,10,10),new t.MeshBasicMaterial({color:w,transparent:!0}));f.position.set(p,l,d);const k=new t.Sprite(new t.SpriteMaterial({map:o,color:w,transparent:!0,opacity:.6,blending:t.AdditiveBlending,depthWrite:!1}));k.scale.set(.4,.4,1),f.add(k),a.add(f),Z.push({mesh:f,halo:k})});const oe=[new t.Vector3(0,.82,.2),new t.Vector3(-2.4,2.85,0),new t.Vector3(.4,.65,1)],ve=oe.map((p,l)=>{const d=new t.Sprite(new t.SpriteMaterial({map:o,color:[13041468,3732944,8019199][l],transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));return d.scale.set(3.5,3.5,1),d.position.copy(p),a.add(d),d});return{thrusterGlows:J,navLights:Z,focusHalos:ve,FOCUS_ANCHORS:oe,solarWings:y,dishGroup:I}}const bt=u.forwardRef(function({thrusterProxy:t,focusProxy:n},s){const o=u.useRef(),i=u.useRef(null);return u.useImperativeHandle(s,()=>o.current,[]),u.useEffect(()=>{if(!o.current)return;const r=Mt(o.current);return i.current=r,()=>{i.current=null}},[]),ne(({clock:r})=>{if(!i.current)return;const v=r.elapsedTime,h=(t==null?void 0:t.intensity)??0,c=(n==null?void 0:n.value)??-1,{thrusterGlows:b,navLights:S,focusHalos:P,solarWings:x,dishGroup:z}=i.current;x.forEach((A,C)=>{A.rotation.z=Math.sin(v*.06+C*1.4)*.22}),z.rotation.y=Math.sin(v*.05)*.3,z.rotation.x=Math.sin(v*.041+.7)*.08,b.forEach(({outer:A,inner:C},y)=>{const I=Math.sin(v*9+y*.8)*.5+.5;A.material.opacity=h*(.18+I*.07),C.material.opacity=h*(.45+I*.12)}),S.forEach(({mesh:A},C)=>{const y=Math.sin(v*(2.1+C*.43)+C*1.9)>.3;A.material.opacity=y?1:.04}),P.forEach((A,C)=>{const y=C===c?.36+Math.sin(v*1.8)*.07:0;A.material.opacity+=(y-A.material.opacity)*.06})}),e.jsx("group",{ref:o})}),jt=`
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
`;function St(){const a=u.useRef(),{surfaceMat:t,atmoMat:n}=u.useMemo(()=>{const s=new Te(Math.cos(-53*Math.PI/180)*Math.cos(135*Math.PI/180),Math.sin(-53*Math.PI/180),Math.cos(-53*Math.PI/180)*Math.sin(135*Math.PI/180)).normalize(),o=new pe({uniforms:{uTime:{value:0},uSunDir:{value:s.clone()},uSeaLevel:{value:-.02},uCloudOpacity:{value:.45},uCloudSpeed:{value:.65},uCityLights:{value:1},uAtmoStrength:{value:.65}},vertexShader:`
        varying vec3 vLP; varying vec3 vWP; varying vec3 vWN;
        void main(){
          vLP = position;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWP = wp.xyz;
          vWN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:jt+`
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
      `}),i=new pe({side:ct,transparent:!0,depthWrite:!1,blending:ue,uniforms:{uSunDir:{value:s.clone()},uAtmoStrength:{value:.55}},vertexShader:`
        varying vec3 vWN; varying vec3 vWP;
        void main(){
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWP = wp.xyz; vWN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:`
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
      `});return{surfaceMat:o,atmoMat:i}},[]);return ne(({clock:s})=>{t.uniforms.uTime.value=s.elapsedTime,a.current&&(a.current.rotation.y=s.elapsedTime*.045)}),e.jsxs("group",{ref:a,position:[-7.8,-7.9,-14.2],scale:1.34,children:[e.jsx("mesh",{material:t,children:e.jsx("sphereGeometry",{args:[2.7,96,64]})}),e.jsx("mesh",{material:n,children:e.jsx("sphereGeometry",{args:[2.92,64,48]})})]})}function Nt(){const{geometry:t,material:n}=u.useMemo(()=>{const s=new Float32Array(6600),o=new Float32Array(2200),i=new Float32Array(2200*3),r=new Float32Array(2200);for(let c=0;c<2200;c++){const b=60+Math.random()*70,S=Math.random()*Math.PI*2,P=Math.acos(2*Math.random()-1);s[c*3]=b*Math.sin(P)*Math.cos(S),s[c*3+1]=b*Math.sin(P)*Math.sin(S),s[c*3+2]=b*Math.cos(P),o[c]=.4+Math.random()*1.4,r[c]=Math.random()*Math.PI*2;const x=Math.random();i[c*3]=x<.15?1:x>.85?.7:.95,i[c*3+1]=x<.15?.85:x>.85?.8:.95,i[c*3+2]=x<.15?.7:x>.85?1:.95}const v=new qe;v.setAttribute("position",new X(s,3)),v.setAttribute("starSize",new X(o,1)),v.setAttribute("color",new X(i,3)),v.setAttribute("twinkle",new X(r,1));const h=new pe({uniforms:{uTime:{value:0}},vertexShader:`
        attribute float starSize; attribute vec3 color; attribute float twinkle;
        uniform float uTime;
        varying vec3 vC; varying float vTw;
        void main(){
          vC = color;
          vTw = .84 + .16 * sin(uTime * 1.2 + twinkle * 7.);
          vec4 mv = modelViewMatrix * vec4(position, 1.);
          gl_PointSize = starSize * (.92 + .16 * sin(uTime * .9 + twinkle * 5.)) * (700. / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,fragmentShader:`
        varying vec3 vC; varying float vTw;
        void main(){
          vec2 uv = gl_PointCoord - .5;
          float a = 1. - smoothstep(.25, .5, length(uv));
          if(a < .01) discard;
          gl_FragColor = vec4(vC, a * .85 * vTw);
        }
      `,transparent:!0,depthWrite:!1,blending:ue});return{geometry:v,material:h}},[]);return ne(({clock:s})=>{n.uniforms.uTime.value=s.elapsedTime}),e.jsx("points",{geometry:t,material:n})}function zt(){const{geometry:a,material:t}=u.useMemo(()=>{const s=new Float32Array(660),o=new Float32Array(220),i=new Float32Array(220);for(let h=0;h<220;h++)s[h*3]=(Math.random()-.5)*30,s[h*3+1]=(Math.random()-.5)*18,s[h*3+2]=-6+Math.random()*14,o[h]=.25+Math.random()*.9,i[h]=.3+Math.random()*1;const r=new qe;r.setAttribute("position",new X(s,3)),r.setAttribute("aSpeed",new X(o,1)),r.setAttribute("starSize",new X(i,1));const v=new pe({uniforms:{uTime:{value:0}},vertexShader:`
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
      `,fragmentShader:`
        varying float vA;
        void main(){
          vec2 uv = gl_PointCoord - .5;
          float a = 1. - smoothstep(.15, .5, length(uv));
          if(a < .01) discard;
          gl_FragColor = vec4(vec3(.82, .88, 1.), a * vA * .26);
        }
      `,transparent:!0,depthWrite:!1,blending:ue});return{geometry:r,material:v}},[]);return ne(({clock:n})=>{t.uniforms.uTime.value=n.elapsedTime}),e.jsx("points",{geometry:a,material:t})}function Pt(){const a=u.useMemo(()=>{const t=document.createElement("canvas");t.width=t.height=256;const n=t.getContext("2d"),s=n.createRadialGradient(128,128,0,128,128,128);return s.addColorStop(0,"rgba(255,244,220,.95)"),s.addColorStop(.18,"rgba(255,210,150,.38)"),s.addColorStop(.5,"rgba(255,170,90,.08)"),s.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=s,n.fillRect(0,0,256,256),new lt({map:new ce(t),transparent:!0,opacity:.5,blending:ue,depthWrite:!1,fog:!1})},[]);return ne(({clock:t})=>{a.opacity=.46+Math.sin(t.elapsedTime*.8)*.06}),e.jsx("sprite",{material:a,position:[44.7,22.3,31.3],scale:[30,30,1]})}function Ct({cameraProxy:a,lookProxy:t,fovProxy:n,thrusterProxy:s}){const{camera:o}=dt(),i=u.useMemo(()=>new Te,[]),r=u.useMemo(()=>new Te,[]);return u.useEffect(()=>{o.position.set(0,1.6,30),o.fov=36,o.updateProjectionMatrix()},[]),ne(({clock:v},h)=>{const c=v.elapsedTime,b=Math.min(h,1/20),S=Math.sin(c*.19)*.06,P=Math.sin(c*.13)*.04,x=Math.sin(c*.07)*.05,A=((s==null?void 0:s.intensity)??0)*.045,C=A*Math.sin(c*31.7)*(.6+.4*Math.sin(c*13.1)),y=A*Math.sin(c*27.3+1.7)*(.6+.4*Math.cos(c*17.9));r.set(((a==null?void 0:a.x)??0)+S+C,((a==null?void 0:a.y)??0)+P+y,((a==null?void 0:a.z)??16)+x),o.position.lerp(r,1-Math.pow(1-.18,b*60)),i.set(((t==null?void 0:t.x)??0)+Math.sin(c*.17)*.025+C*.5,((t==null?void 0:t.y)??0)+Math.cos(c*.21)*.02+y*.5,(t==null?void 0:t.z)??0),o.lookAt(i),n&&Math.abs(o.fov-n.value)>.05&&(o.fov+=(n.value-o.fov)*(1-Math.pow(1-.12,b*60)),o.updateProjectionMatrix())}),null}function kt({issGroupRef:a,cameraProxy:t,lookProxy:n,thrusterProxy:s,fovProxy:o,focusProxy:i,onReady:r}){return u.useEffect(()=>{r==null||r()},[r]),e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{color:2107456,intensity:.4}),e.jsx("directionalLight",{color:16774364,intensity:2.8,position:[10,5,7]}),e.jsx("directionalLight",{color:4880568,intensity:1.05,position:[6,-8,-4]}),e.jsx("directionalLight",{color:8965375,intensity:.5,position:[-7,3,-5]}),e.jsx(Nt,{}),e.jsx(St,{}),e.jsx(zt,{}),e.jsx(Pt,{}),e.jsx(u.Suspense,{fallback:null,children:e.jsx(bt,{ref:a,thrusterProxy:s,focusProxy:i})}),e.jsx(Ct,{cameraProxy:t,lookProxy:n,fovProxy:o,thrusterProxy:s})]})}function At({active:a=!0,issGroupRef:t,stationProxy:n,cameraProxy:s,lookProxy:o,thrusterProxy:i,fovProxy:r,focusProxy:v,onLoaded:h}){return a?e.jsx(at,{frameloop:a?"always":"never",dpr:[1,1.4],gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},style:{width:"100%",height:"100%",background:"#02030a"},camera:{fov:36,near:.1,far:300,position:[0,1.6,30]},onCreated:({gl:c,scene:b})=>{c.toneMapping=it,c.toneMappingExposure=1.15,c.outputColorSpace=ot,b.fog=new rt(131850,.014)},children:e.jsx(kt,{issGroupRef:t,stationProxy:n,cameraProxy:s,lookProxy:o,thrusterProxy:i,fovProxy:r,focusProxy:v,onReady:h})}):e.jsx("div",{style:{width:"100%",height:"100%",background:"#02030a"},"aria-hidden":"true"})}function It(a){return a?a.split(/(<em>[^<]*<\/em>|\n)/g).map((t,n)=>{if(t===`
`)return e.jsx("br",{},n);const s=t.match(/^<em>([^<]*)<\/em>$/);return s?e.jsx("em",{children:s[1]},n):t||null}):null}const Tt=u.forwardRef(function({index:t=0,total:n=3,tag:s,title:o,description:i,stats:r,position:v="tr",state:h="future"},c){const b=["iss-card",`pos-${v}`,h==="active"?"is-active":"",h==="past"?"is-past":""].filter(Boolean).join(" ");return e.jsxs("article",{ref:c,className:b,"aria-hidden":h!=="active",children:[e.jsxs("div",{className:"iss-card-index",children:[e.jsx("em",{children:String(t+1).padStart(2,"0")}),e.jsx("span",{children:"/"}),e.jsx("span",{children:String(n).padStart(2,"0")})]}),s&&e.jsx("div",{className:"iss-card-tag",children:s}),o&&e.jsx("h3",{children:It(o)}),i&&e.jsx("p",{children:i}),r&&r.length>0&&e.jsx("div",{className:"iss-card-stats",children:r.map(([S,P],x)=>e.jsxs("div",{className:"iss-card-stat",children:[e.jsx("span",{className:"iss-card-stat-num",children:S}),e.jsx("span",{className:"iss-card-stat-lbl",children:P})]},x))})]})}),O=(a,t,n)=>a+(t-a)*n,Je=(a,t,n)=>a<t?t:a>n?n:a,Lt=a=>{const t=Je(a,0,1);return t*t*t*(t*(t*6-15)+10)},re=[{p:0,cam:{x:0,y:1.6,z:30},look:{x:0,y:0,z:0},rotX:.05,rotY:.2,rotZ:0,fov:36,thruster:0,focus:-1,card:-1,phase:"approach"},{p:.08,cam:{x:0,y:.7,z:13.5},look:{x:0,y:.1,z:0},rotX:.18,rotY:.85,rotZ:.04,fov:40,thruster:.3,focus:-1,card:-1,phase:"active"},{p:.17,cam:{x:-1.9,y:1.8,z:6.4},look:{x:0,y:.6,z:.2},rotX:-.06,rotY:1.55,rotZ:-.04,fov:38,thruster:0,focus:0,card:0,phase:"reveal"},{p:.3,cam:{x:-2.15,y:1.7,z:6.15},look:{x:0,y:.62,z:.2},rotX:-.05,rotY:1.63,rotZ:-.04,fov:38,thruster:0,focus:0,card:0,phase:"reveal"},{p:.39,cam:{x:3.6,y:-.1,z:8},look:{x:-.4,y:1.4,z:0},rotX:.08,rotY:2.55,rotZ:.08,fov:44,thruster:0,focus:1,card:1,phase:"reveal"},{p:.52,cam:{x:3.85,y:.05,z:7.7},look:{x:-.4,y:1.42,z:0},rotX:.09,rotY:2.63,rotZ:.08,fov:44,thruster:0,focus:1,card:1,phase:"reveal"},{p:.61,cam:{x:-2.3,y:-.6,z:6.6},look:{x:.4,y:-.05,z:.9},rotX:.18,rotY:3.45,rotZ:-.05,fov:36,thruster:0,focus:2,card:2,phase:"reveal"},{p:.74,cam:{x:-2.52,y:-.5,z:6.35},look:{x:.4,y:-.03,z:.9},rotX:.19,rotY:3.53,rotZ:-.05,fov:36,thruster:0,focus:2,card:2,phase:"reveal"},{p:.88,cam:{x:0,y:2.9,z:19.5},look:{x:0,y:-.8,z:-1.8},rotX:.28,rotY:4.25,rotZ:-.05,fov:46,thruster:.6,focus:-1,card:-1,phase:"outro"},{p:1,cam:{x:0,y:3.3,z:21.5},look:{x:0,y:-1,z:-2.2},rotX:.3,rotY:4.4,rotZ:-.06,fov:47,thruster:.25,focus:-1,card:-1,phase:"outro"}];function Et(a){let t=0;for(;t<re.length-2&&a>re[t+1].p;)t++;const n=re[t],s=re[Math.min(t+1,re.length-1)],o=s.p-n.p,i=o>1e-5?Lt((a-n.p)/o):0;return{cam:{x:O(n.cam.x,s.cam.x,i),y:O(n.cam.y,s.cam.y,i),z:O(n.cam.z,s.cam.z,i)},look:{x:O(n.look.x,s.look.x,i),y:O(n.look.y,s.look.y,i),z:O(n.look.z,s.look.z,i)},rotX:O(n.rotX,s.rotX,i),rotY:O(n.rotY,s.rotY,i),rotZ:O(n.rotZ,s.rotZ,i),fov:O(n.fov,s.fov,i),thruster:O(n.thruster,s.thruster,i),focus:i>.5?s.focus:n.focus,card:i>.5?s.card:n.card,phase:i>.5?s.phase:n.phase}}function Rt({sectionRef:a,issGroupRef:t,stationProxy:n,cameraProxy:s,lookProxy:o,thrusterProxy:i,fovProxy:r,focusProxy:v,onPhaseChange:h,onCardChange:c,damping:b=.07}={}){u.useEffect(()=>{if(!(a!=null&&a.current)){console.warn("[ISS] sectionRef.current ist null – RAF wurde nicht gestartet");return}let S=0,P=0,x=0,z=-2,A="",C=!0,y=performance.now();const I=()=>{const M=a.current;if(!M)return;const N=M.getBoundingClientRect(),G=document.documentElement.clientHeight||window.innerHeight,g=M.offsetHeight-G;if(g<=0){P=0;return}P=Je(-N.top/g,0,1)},$=()=>{if(!C)return;S=requestAnimationFrame($),I();const M=performance.now(),N=Math.min((M-y)/1e3,1/20);y=M;const G=1-Math.pow(1-b,N*60);x=O(x,P,G),Math.abs(x-P)<1e-4&&(x=P);const g=Et(x),V=M/1e3;s&&(s.x=g.cam.x,s.y=g.cam.y,s.z=g.cam.z),o&&(o.x=g.look.x,o.y=g.look.y,o.z=g.look.z),n&&(n.rotX=g.rotX,n.rotY=g.rotY,n.rotZ=g.rotZ),i&&(i.intensity=g.thruster),r&&(r.value=g.fov),v&&(v.value=g.focus);const _=t==null?void 0:t.current;_&&(_.position.x=Math.sin(V*.31)*.04,_.position.y=Math.sin(V*.23)*.055,_.position.z=Math.sin(V*.17)*.03,_.rotation.x=g.rotX+Math.sin(V*.07)*.005,_.rotation.y=g.rotY+Math.sin(V*.09)*.008,_.rotation.z=g.rotZ+Math.sin(V*.11)*.004),g.card!==z&&(z=g.card,c&&c(g.card)),g.phase!==A&&(A=g.phase,h&&h(g.phase))};return S=requestAnimationFrame($),()=>{C=!1,cancelAnimationFrame(S)}},[a,t,n,s,o,i,r,v,h,c,b])}const Ae=[{tag:"Observation Layer",title:`Intelligente
<em>Beobachtung</em>`,description:"NILL überwacht jeden Kanal wie aus der Cupola — Postfach, Aufgaben, Lager, Schichten. Alles in einer Ansicht, ohne tote Winkel.",stats:[["24/7","aktiv"],["5","Module"],["1","Ansicht"]],position:"tr"},{tag:"Distributed Power",title:`Adaptive
<em>Architektur</em>`,description:"Wie Solar-Arrays, die sich zur Sonne drehen — NILLs Module skalieren, balancieren und heilen sich selbst, bevor du es bemerkst.",stats:[["DE","gehostet"],["100 %","Ökostrom"],["DSGVO","konform"]],position:"tl"},{tag:"Deep Space Link",title:`Autonome
<em>Orchestrierung</em>`,description:"Die Schüssel zeigt nach draußen — NILL spricht mit Gmail, Outlook und deinem Lager. Aufgaben finden ihren Weg, ohne dass du ein Ticket öffnest.",stats:[["3","Mail-Anbindungen"],["24/7","synchron"],["0","Tickets"]],position:"br"}];function Wt(){const a=u.useRef(null),t=u.useRef(null),n=[u.useRef(null),u.useRef(null),u.useRef(null)],[s,o]=u.useState(-1),[i,r]=u.useState("approach"),[v,h]=u.useState(!1),[c,b]=u.useState(!1),[S,P]=u.useState({x:"0.00",y:"0.00",z:"0.00"});u.useEffect(()=>{const M=a.current;if(!M)return;const N=new IntersectionObserver(([G])=>b(G.isIntersecting),{rootMargin:"25% 0px"});return N.observe(M),()=>N.disconnect()},[]);const x=u.useMemo(()=>({rotX:0,rotY:0,rotZ:0}),[]),z=u.useMemo(()=>({x:0,y:1.6,z:30}),[]),A=u.useMemo(()=>({x:0,y:0,z:0}),[]),C=u.useMemo(()=>({intensity:0}),[]),y=u.useMemo(()=>({value:36}),[]),I=u.useMemo(()=>({value:-1}),[]);Rt({sectionRef:a,issGroupRef:t,stationProxy:x,cameraProxy:z,lookProxy:A,thrusterProxy:C,fovProxy:y,focusProxy:I,onCardChange:o,onPhaseChange:r,damping:.07}),u.useEffect(()=>{if(!c)return;let M=0,N=0;const G=g=>{M=requestAnimationFrame(G),!(g-N<120)&&(N=g,P({x:z.x.toFixed(2),y:z.y.toFixed(2),z:z.z.toFixed(2)}))};return M=requestAnimationFrame(G),()=>cancelAnimationFrame(M)},[z,c]);const $=M=>M===s?"active":s>M?"past":"future";return e.jsx("section",{ref:a,className:`iss-section ${v?"iss-loaded":""}`,"data-screen-label":"ISS",children:e.jsxs("div",{className:"iss-sticky","data-phase":i,children:[e.jsx("div",{className:"iss-canvas-wrap",children:e.jsx(At,{active:c,issGroupRef:t,stationProxy:x,cameraProxy:z,lookProxy:A,thrusterProxy:C,fovProxy:y,focusProxy:I,onLoaded:()=>h(!0)})}),e.jsx("div",{className:"iss-bar top","aria-hidden":"true"}),e.jsx("div",{className:"iss-bar bot","aria-hidden":"true"}),e.jsx("div",{className:"iss-grain","aria-hidden":"true"}),e.jsxs("div",{className:"iss-hud tl",children:[e.jsxs("div",{children:[e.jsx("span",{className:"dot"}),"NILL · MISSION CONTROL"]}),e.jsx("div",{className:"label",children:"Orbital Layer · v1"})]}),e.jsxs("div",{className:"iss-hud tr",children:[e.jsx("div",{className:"label",children:"REF · NILL-OS / ISS-04"}),e.jsx("div",{className:"value",children:"50° 06′ 45″ N · 8° 40′ 56″ E"})]}),e.jsxs("div",{className:"iss-hud bl",children:[e.jsx("div",{className:"label",children:"CAMERA"}),e.jsxs("div",{className:"value",children:["x ",e.jsx("em",{children:S.x}),"  y ",e.jsx("em",{children:S.y}),"  z ",e.jsx("em",{children:S.z})]})]}),e.jsxs("div",{className:"iss-hud br",children:[e.jsx("div",{className:"label",children:"STATUS"}),e.jsx("div",{className:"value",children:i==="approach"?"APPROACH — STAND-BY":i==="reveal"?"REVEAL — MODULE FOCUS":"NOMINAL — TRACKING"})]}),e.jsx("div",{className:"iss-intro","aria-hidden":i!=="approach",children:e.jsxs("div",{className:"iss-intro-inner",children:[e.jsxs("span",{className:"eyebrow",children:[e.jsx("span",{className:"pip"}),"NILL · MISSION CONTROL"]}),e.jsxs("h2",{children:["Die Arbeitsstation, die dein",e.jsx("br",{}),"Unternehmen ",e.jsx("em",{children:"im Orbit"})," hält."]}),e.jsx("p",{children:"Stell dir NILL als Raumstation vor: ein zentrales System, das alle Module deines Betriebs verbindet. Beobachtung, Energie, Kommunikation — orchestriert von einer KI, die nie schläft."})]})}),e.jsx("div",{className:"iss-outro","aria-hidden":i!=="outro",children:e.jsxs("div",{className:"iss-outro-inner",children:[e.jsxs("span",{className:"eyebrow",children:[e.jsx("span",{className:"pip"}),"READY · LAUNCH WINDOW OPEN"]}),e.jsxs("h2",{children:["Eine Plattform.",e.jsx("br",{}),"Ein Login. ",e.jsx("em",{children:"Alle Module."})]}),e.jsx("p",{children:"NILL hält deinen Betrieb in der Umlaufbahn — 24/7, ohne Tickets, ohne Bauchschmerzen. Bereit, die Station zu betreten?"}),e.jsx("a",{className:"iss-outro-cta",href:"#cta",children:"Demo anfragen"})]})}),e.jsx("div",{className:"iss-card-stage",children:Ae.map((M,N)=>e.jsx(Tt,{ref:n[N],index:N,total:Ae.length,tag:M.tag,title:M.title,description:M.description,stats:M.stats,position:M.position,state:$(N)},N))}),e.jsx("div",{className:"iss-progress","aria-hidden":"true",children:Ae.map((M,N)=>e.jsx("div",{className:`iss-progress-dot ${N===s?"active":N<s?"passed":""}`},N))}),e.jsxs("div",{className:`iss-scroll-hint ${i!=="approach"?"hidden":""}`,children:[e.jsx("span",{children:"scroll · mission"}),e.jsx("span",{className:"iss-scroll-hint-line"})]})]})})}let Ze=!1;function Gt(){Ze||(Ze=!0,document.title="NILL — Intelligenz, die mitarbeitet.")}function _t(){const a=u.useRef(null);return u.useEffect(()=>{let t,n=0,s=1,o=0;const i=()=>{s=Math.max(1,document.documentElement.scrollHeight-innerHeight)};addEventListener("resize",i);const r=()=>{t=requestAnimationFrame(r),o++%120===0&&i();const v=window.scrollY/s;n+=(v-n)*.12,a.current&&(a.current.style.transform=`scaleX(${n})`)};return t=requestAnimationFrame(r),()=>{cancelAnimationFrame(t),removeEventListener("resize",i)}},[]),e.jsx("div",{className:"scroll-progress","aria-hidden":"true",children:e.jsx("span",{ref:a})})}function te({className:a,style:t,children:n}){return e.jsx("article",{className:`card ${a||""}`,style:t,children:n})}const Ee=`
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
`,Ke=`
  varying vec3 vLP;varying vec3 vWP;varying vec3 vWN;
  void main(){
    vLP=position;
    vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;
    vWN=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*wp;
  }
`,Ft=`
  varying vec3 vWP;varying vec3 vWN;
  void main(){
    vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;
    vWN=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*wp;
  }
`,Dt=`
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
`;function Ye(a){return Ee+`
    varying vec3 vLP;varying vec3 vWP;varying vec3 vWN;
    uniform float uTime;uniform vec3 uSunPos;uniform vec3 uAtmo;
    ${a}
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
  `}const Bt=`
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
`,Ot=`
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
`,Vt=`
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
`,Ht=`
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
`,Ue=`
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
`,$t=`
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
`,Zt=Ee+`
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
`;function Kt(a){const t=Xe,n=new t.WebGLRenderer({canvas:a,antialias:!0,powerPreference:"high-performance"});let s=Math.min(devicePixelRatio,1.5);n.setPixelRatio(s),n.setClearColor(131850,1);const o=new mt(n,new t.WebGLRenderTarget(1,1,{type:t.HalfFloatType,samples:4})),i=new t.Scene,r=new t.PerspectiveCamera(42,2,.1,300);r.position.set(0,1.8,11),r.lookAt(0,0,0),o.addPass(new ht(i,r));const v=new pt(new t.Vector2(window.innerWidth,window.innerHeight),.34,.5,.86);o.addPass(v);const h=3400,c=new Float32Array(h*3),b=new Float32Array(h),S=new Float32Array(h*3),P=new t.Vector3(.32,.86,.4).normalize(),x=new t.Vector3;for(let m=0;m<h;m++){const T=60+Math.random()*70,E=Math.random()*Math.PI*2,j=Math.acos(2*Math.random()-1);if(x.set(Math.sin(j)*Math.cos(E),Math.sin(j)*Math.sin(E),Math.cos(j)),m%100<55){const D=x.dot(P)*.84;x.addScaledVector(P,-D).normalize()}c[m*3]=x.x*T,c[m*3+1]=x.y*T,c[m*3+2]=x.z*T,b[m]=.3+Math.pow(Math.random(),3)*1.7;const W=Math.random();S[m*3]=W<.1?1:W>.88?.72:.96,S[m*3+1]=W<.1?.8:W>.88?.82:.94,S[m*3+2]=W<.1?.62:W>.88?1:.9}const z=new t.BufferGeometry;z.setAttribute("position",new t.BufferAttribute(c,3)),z.setAttribute("starSize",new t.BufferAttribute(b,1)),z.setAttribute("color",new t.BufferAttribute(S,3));const A=new t.ShaderMaterial({vertexShader:"attribute float starSize;attribute vec3 color;varying vec3 vC;void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=starSize*(700./-mv.z);gl_Position=projectionMatrix*mv;}",fragmentShader:"varying vec3 vC;void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.22,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(vC,a*.8);}",transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}),C=new t.Points(z,A);i.add(C);const y=new t.Group;y.rotation.x=-.55,y.rotation.z=.07,i.add(y);const I=new t.Group;y.add(I);const $=new t.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:"varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:Ee+`
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
    `}),M=new t.Mesh(new t.SphereGeometry(.92,64,48),$);I.add(M);const N=m=>{const T=document.createElement("canvas");T.width=T.height=256;const E=T.getContext("2d"),j=E.createRadialGradient(128,128,0,128,128,128);m.forEach(([D,U])=>j.addColorStop(D,U)),E.fillStyle=j,E.fillRect(0,0,256,256);const W=new t.CanvasTexture(T);return W.minFilter=t.LinearFilter,W},G=(m,T,E)=>{const j=new t.Sprite(new t.SpriteMaterial({map:T,transparent:!0,opacity:E,blending:t.AdditiveBlending,depthWrite:!1,depthTest:!1}));return j.scale.set(m,m,1),I.add(j),j},g=N([[0,"rgba(0,0,0,0)"],[.55,"rgba(255,130,40,.08)"],[.75,"rgba(255,180,90,.09)"],[1,"rgba(0,0,0,0)"]]),V=N([[0,"rgba(0,0,0,0)"],[.6,"rgba(255,150,60,.05)"],[.85,"rgba(255,225,170,.04)"],[1,"rgba(0,0,0,0)"]]),_=G(10,g,.3),q=G(17,V,.14),ie=.85,J=[{r:2.2,sz:.3,phase:.3,tilt:.03,rot:.16,surf:Bt,atmo:[.3,.55,.95],atmoI:.55},{r:3.05,sz:.4,phase:1.6,tilt:-.05,rot:.11,surf:Ot,atmo:[.55,.75,.9],atmoI:.3},{r:3.88,sz:.28,phase:3,tilt:.04,rot:.15,surf:Vt,atmo:[.85,.55,.35],atmoI:.22},{r:4.92,sz:.55,phase:4.7,tilt:-.03,rot:.42,surf:Ht,atmo:[.82,.7,.5],atmoI:.35,rings:!0},{r:6.08,sz:.34,phase:5.9,tilt:.05,rot:.03,surf:Ue,atmo:[.55,.54,.52],atmoI:.1},{r:7.12,sz:.22,phase:1.2,tilt:-.04,rot:.12,surf:$t,atmo:[.55,.85,.3],atmoI:.4,future:!0}];J.forEach(m=>{m.spd=ie/Math.pow(m.r,1.5)});const Z=new t.Vector3,oe=[];J.forEach(m=>{const T=new t.Mesh(new t.RingGeometry(m.r-.005,m.r+.005,160),new t.MeshBasicMaterial({color:16777215,transparent:!0,opacity:m.future?.04:.07,side:t.DoubleSide,depthWrite:!1}));T.rotation.x=Math.PI/2+m.tilt,y.add(T);const E=m.rings?64:56,j=new t.ShaderMaterial({uniforms:{uTime:{value:0},uSunPos:{value:new t.Vector3},uAtmo:{value:new t.Color(...m.atmo)}},vertexShader:Ke,fragmentShader:Ye(m.surf)}),W=new t.Mesh(new t.SphereGeometry(m.sz,E,Math.round(E*.65)),j);y.add(W);const D=new t.ShaderMaterial({side:t.FrontSide,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,uniforms:{uSunPos:{value:new t.Vector3},uColor:{value:new t.Color(...m.atmo)},uIntensity:{value:m.future?.28:m.atmoI}},vertexShader:Ft,fragmentShader:Dt}),U=new t.Mesh(new t.SphereGeometry(m.sz*1.055,32,22),D);y.add(U);let H=null;if(m.rings){const Q=m.sz*1.55,he=m.sz*2.72;H=new t.Mesh(new t.RingGeometry(Q,he,140,1),new t.ShaderMaterial({side:t.DoubleSide,transparent:!0,depthWrite:!1,uniforms:{uInner:{value:Q},uOuter:{value:he},uSunPos:{value:new t.Vector3}},vertexShader:"varying vec3 vLP;varying vec3 vWP;void main(){vLP=position;vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}",fragmentShader:Zt})),H.rotation.x=-Math.PI/2+.2,H.rotation.z=.1,y.add(H)}oe.push({mesh:W,pMat:j,atmo:U,atmoMat:D,ring:H,def:m})});const ve=N([[0,"rgba(225,250,255,1)"],[.25,"rgba(150,210,255,.6)"],[.6,"rgba(80,140,255,.12)"],[1,"rgba(0,0,0,0)"]]),p=new t.Sprite(new t.SpriteMaterial({map:ve,transparent:!0,opacity:.95,blending:t.AdditiveBlending,depthWrite:!1}));p.scale.set(.55,.55,1),y.add(p);const l=64,d=new Float32Array(l*3),w=new Float32Array(l);for(let m=0;m<l;m++)w[m]=m/l;const f=new t.BufferGeometry;f.setAttribute("position",new t.BufferAttribute(d,3).setUsage(t.DynamicDrawUsage)),f.setAttribute("age",new t.BufferAttribute(w,1));const k=new t.ShaderMaterial({vertexShader:"attribute float age;varying float vA;void main(){vA=1.-age;vec3 p=position+normalize(position)*age*age*1.8;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=(1.-age)*(95./-mv.z)+1.5;gl_Position=projectionMatrix*mv;}",fragmentShader:"varying float vA;void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.1,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(mix(vec3(.35,.55,1.),vec3(.85,.95,1.),vA),a*vA*.55);}",transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}),L=new t.Points(f,k);y.add(L);let B=Math.random()*Math.PI*2;const K=3.4,Y=.62,F=new t.Vector3,fe=new t.ShaderMaterial({uniforms:{uTime:{value:0},uSunPos:{value:new t.Vector3},uAtmo:{value:new t.Color(.7,.7,.66)}},vertexShader:Ke,fragmentShader:Ye(Ue)}),xe=new t.Mesh(new t.SphereGeometry(.085,26,18),fe);y.add(xe);let Re=0,We=0,ge=0,we=0,Ge=0;const _e=m=>{Re=m.clientX/innerWidth-.5,We=m.clientY/innerHeight-.5},Fe=()=>{Ge=Math.min(window.scrollY/innerHeight,1.2)};addEventListener("pointermove",_e,{passive:!0}),addEventListener("scroll",Fe,{passive:!0});const le=()=>{const m=a.parentElement;if(!m)return;const T=m.clientWidth,E=m.clientHeight;n.setSize(T,E,!1),o.setSize(T,E),r.aspect=T/E,r.updateProjectionMatrix()};le(),addEventListener("resize",le);const De=performance.now();let ye=De,Me=0,be=!1,de=0,Be=!1,je=0,me=-60;const Oe=()=>{if(!be)return;Me=requestAnimationFrame(Oe);const m=performance.now(),T=(m-ye)/1e3,E=Math.min(T,1/20);ye=m,me++,me>0&&(je+=T),me===90&&(je/90>.024&&s>1&&(s=Math.max(1,s-.25),n.setPixelRatio(s),o.setPixelRatio(s),le()),je=0,me=0);const j=(m-De)/1e3;ge+=(Re-ge)*.05,we+=(We-we)*.05,de+=(Ge-de)*.06;const W=1-Math.pow(1-Math.min(1,j/3.2),5);r.position.set(0,1.8+(1-W)*1.7,11+(1-W)*4.6),r.lookAt(0,0,0),y.rotation.y=j*.028+ge*.26-(1-W)*.65,y.rotation.x=-.55+we*.09-de*.16,y.position.y=-de*.7,$.uniforms.uTime.value=j,M.rotation.y=j*.07,M.scale.setScalar(1+Math.sin(j*.9)*.006),_.material.opacity=.3+Math.sin(j*1.1)*.03,q.material.opacity=.14+Math.sin(j*.7+1.2)*.03,_.material.rotation=j*.02,q.material.rotation=-j*.015,I.getWorldPosition(Z),C.rotation.y=j*.003;const D=K/(1+Y*Math.cos(B));B+=E*1.35/(D*D),F.set(Math.cos(B)*D,Math.sin(B)*D*.16,Math.sin(B)*D),p.position.copy(F);const U=.3+1.1/D;if(p.scale.set(U,U,1),Be){for(let R=l-1;R>0;R--)d[R*3]=d[(R-1)*3],d[R*3+1]=d[(R-1)*3+1],d[R*3+2]=d[(R-1)*3+2];d[0]=F.x,d[1]=F.y,d[2]=F.z}else{Be=!0;for(let R=0;R<l;R++)d[R*3]=F.x,d[R*3+1]=F.y,d[R*3+2]=F.z}f.attributes.position.needsUpdate=!0;const H=J[3],Q=H.phase+j*H.spd,he=Math.cos(Q)*H.r,Qe=Math.sin(Q*.55+H.tilt*4)*.09,et=Math.sin(Q)*H.r,Se=j*.85;xe.position.set(he+Math.cos(Se)*1.18,Qe+Math.sin(Se)*.26,et+Math.sin(Se)*1.18),xe.rotation.y=j*.3,fe.uniforms.uTime.value=j,fe.uniforms.uSunPos.value.copy(Z);for(const{mesh:R,pMat:$e,atmo:tt,atmoMat:st,ring:Ne,def:ee}of oe){const ze=ee.phase+j*ee.spd,Pe=Math.cos(ze)*ee.r,Ce=Math.sin(ze*.55+ee.tilt*4)*.09,ke=Math.sin(ze)*ee.r;R.position.set(Pe,Ce,ke),R.rotation.y+=E*ee.rot,$e.uniforms.uTime.value=j,$e.uniforms.uSunPos.value.copy(Z),tt.position.set(Pe,Ce,ke),st.uniforms.uSunPos.value.copy(Z),Ne&&(Ne.position.set(Pe,Ce,ke),Ne.material.uniforms.uSunPos.value.copy(Z))}o.render()},Ve=m=>{m!==be&&(be=m,m?(ye=performance.now(),Me=requestAnimationFrame(Oe)):cancelAnimationFrame(Me))},He=new IntersectionObserver(([m])=>Ve(m.isIntersecting),{rootMargin:"25% 0px"});return He.observe(a),()=>{He.disconnect(),Ve(!1),removeEventListener("pointermove",_e),removeEventListener("scroll",Fe),removeEventListener("resize",le),o.dispose(),n.dispose()}}function Yt(){const a=u.useRef(null),t=u.useRef(null),[n,s]=u.useState(!0);return u.useEffect(()=>{const o=a.current;if(!o)return;const i=new IntersectionObserver(([r])=>s(r.isIntersecting),{rootMargin:"25% 0px"});return i.observe(o),()=>i.disconnect()},[]),u.useEffect(()=>{if(!(!n||!t.current))return Kt(t.current)},[n]),e.jsx("div",{ref:a,style:{position:"absolute",inset:0,zIndex:0,background:"#02030a"},"aria-hidden":"true",children:n&&e.jsx("canvas",{ref:t,style:{position:"absolute",inset:0,zIndex:0,display:"block",width:"100%",height:"100%"}})})}function Ut({onCTA:a}){const[t,n]=u.useState(!1);return u.useEffect(()=>{const s=setTimeout(()=>n(!0),80);return()=>clearTimeout(s)},[]),e.jsxs("section",{className:`hero${t?" revealed":""}`,id:"top",children:[e.jsx(Yt,{}),e.jsxs("div",{className:"wrap hero-inner",children:[e.jsx("span",{className:"eyebrow hero-eyebrow",children:"Die smarte Arbeitsstation für Betriebe"}),e.jsxs("h1",{"aria-label":"Intelligenz, die mitarbeitet.",children:[e.jsx("span",{className:"word",children:e.jsx("span",{children:"Intelligenz,"})}),e.jsx("br",{}),e.jsx("span",{className:"word",children:e.jsx("span",{children:"die "})}),e.jsx("span",{className:"word",children:e.jsx("span",{children:e.jsx("em",{children:"mit­arbeitet."})})})]}),e.jsxs("p",{className:"lead",children:["NILL verbindet ",e.jsx("strong",{children:"Postfach, Aufgaben, Lieferscheine, Inventur, Zeiterfassung"})," und ",e.jsx("strong",{children:"Teamverwaltung"})," zu einer Arbeitsstation — unterstützt von einer KI, die mitliest und Arbeit vorbereitet."]}),e.jsxs("div",{className:"hero-cta",children:[e.jsx(se,{className:"btn btn-primary",href:"/register",children:e.jsx("span",{children:"Kostenlos registrieren"})}),e.jsx(se,{className:"btn btn-ghost",onClick:s=>{s.preventDefault(),a("Demo")},href:"#",children:e.jsx("span",{children:"Live-Demo"})})]}),e.jsx("p",{className:"hero-trial-note",children:"14 Tage kostenlos testen — keine Kreditkarte nötig."})]}),e.jsxs("div",{className:"hero-meta",children:[e.jsx("span",{children:"NILL · Arbeitsstation"}),e.jsxs("div",{className:"scroll-ind",children:[e.jsx("span",{children:"scroll"}),e.jsx("div",{className:"scroll-bar"})]}),e.jsx("span",{children:"DE · Made in Germany"})]})]})}function Xt(){const a=e.jsxs(e.Fragment,{children:["Postfach ",e.jsx("span",{className:"ticker-sep"})," Aufgaben ",e.jsx("span",{className:"ticker-sep"})," Inventur ",e.jsx("span",{className:"ticker-sep"})," Zeiterfassung ",e.jsx("span",{className:"ticker-sep"})," Team­verwaltung ",e.jsx("span",{className:"ticker-sep"})," Lieferscheine ",e.jsx("span",{className:"ticker-sep"})," ",e.jsx("em",{children:"Ein Login."})," ",e.jsx("span",{className:"ticker-sep"}),"Postfach ",e.jsx("span",{className:"ticker-sep"})," Aufgaben ",e.jsx("span",{className:"ticker-sep"})," Inventur ",e.jsx("span",{className:"ticker-sep"})," Zeiterfassung ",e.jsx("span",{className:"ticker-sep"})," Team­verwaltung ",e.jsx("span",{className:"ticker-sep"})," Lieferscheine ",e.jsx("span",{className:"ticker-sep"})," ",e.jsx("em",{children:"Ein Login."})," ",e.jsx("span",{className:"ticker-sep"})]});return e.jsx("div",{className:"ticker",children:e.jsx("div",{className:"ticker-track","aria-hidden":"true",children:e.jsx("span",{children:a})})})}function qt({onCTA:a}){const[t,n]=ae();return e.jsx("section",{id:"produkte",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:`section-head reveal${n?" in":""}`,ref:t,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Module — 05 live · 01 in Entwicklung"}),e.jsxs("h2",{children:["Sechs Module. ",e.jsx("br",{}),e.jsx("em",{children:"Eine"})," Intelligenz."]})]}),e.jsx("p",{className:"lead",children:"Jedes Modul steht für sich. Zusammen sind sie ein System, das deinen Betrieb kennt."})]}),e.jsxs(Le,{stagger:!0,className:"bento",children:[e.jsxs(te,{className:"k1",children:[e.jsx("div",{className:"viz","aria-hidden":"true",children:e.jsxs("svg",{viewBox:"0 0 600 380",preserveAspectRatio:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"mg",x1:"0",y1:"0",x2:"1",y2:"1",children:[e.jsx("stop",{offset:"0",stopColor:"#c6ff3c",stopOpacity:".18"}),e.jsx("stop",{offset:"1",stopColor:"#c6ff3c",stopOpacity:"0"})]})}),e.jsx("g",{transform:"translate(260,40)",opacity:".8",children:[0,60,120,180].map((s,o)=>e.jsxs("g",{className:"mail-row",transform:`translate(0,${s})`,children:[e.jsx("rect",{width:"300",height:"48",rx:"6",fill:o===0?"url(#mg)":"rgba(255,255,255,.03)",stroke:"rgba(255,255,255,.08)"}),e.jsx("circle",{cx:"22",cy:"24",r:"6",fill:o===0?"#c6ff3c":"rgba(239,237,231,.25)"}),e.jsx("rect",{x:"42",y:"16",width:[120,100,140,80][o],height:"6",rx:"3",fill:"rgba(255,255,255,.6)"}),e.jsx("rect",{x:"42",y:"28",width:[200,180,160,220][o],height:"4",rx:"2",fill:"rgba(255,255,255,.2)"})]},s))})]})}),e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"01"})," · Postfach"]}),e.jsx("h3",{children:"E-Mails, die sich selbst beantworten."}),e.jsx("p",{children:"Kategorisieren, priorisieren, Antworten schreiben — NILL liest mit und arbeitet voraus."})]})]}),e.jsxs(te,{className:"k2",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"02"})," · Aufgaben & Lieferscheine"]}),e.jsx("h3",{children:"Der Tag plant sich von selbst."}),e.jsx("p",{children:"Aufgaben fürs ganze Team, Lieferscheine per Foto erfasst — direkt an der Station im Tablet- und Kiosk-Modus."})]}),e.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap",fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)"},children:["Tablet & Kiosk","Foto-Erfassung","PDF-Export"].map(s=>e.jsx("span",{style:{padding:"6px 10px",border:"1px solid var(--line)",borderRadius:99},children:s},s))})]}),e.jsx(te,{className:"k3",children:e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"03"})," · Inventur"]}),e.jsx("h3",{children:"Bestände, die sich selbst zählen."}),e.jsx("p",{children:"Automatische Fortschreibung, Meldegrenzen mit Benachrichtigung."})]})}),e.jsxs(te,{className:"k4",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"04"})," · Zeiterfassung"]}),e.jsx("h3",{children:"Zeit erfasst sich per Klick."}),e.jsx("p",{children:"Per App oder Browser. NILL weist Projekte zu und berechnet Überstunden."})]}),e.jsxs("div",{style:{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)",display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{children:"EuGH-konform"}),e.jsx("span",{children:"GPS-optional"})]})]}),e.jsxs(te,{className:"k5",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"05"})," · Team­verwaltung"]}),e.jsx("h3",{children:"Das Team, ohne Zettelwirtschaft."}),e.jsx("p",{children:"Urlaub, Krankmeldungen, Dienstpläne, Onboarding — vorbereitet von der KI."})]}),e.jsx("div",{style:{display:"flex"},children:["MK","LS","JH","+9"].map((s,o)=>e.jsx("span",{className:"avatar",style:{width:28,height:28,fontSize:10,marginLeft:o?-10:0},children:s},s))})]}),e.jsxs(te,{className:"k6",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"06"})," · KI Sekretärin"]}),e.jsx("h3",{children:"Nimmt Anrufe entgegen. Rund um die Uhr."})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:14},children:[e.jsx("span",{className:"badge",children:"In Bearbeitung — Q3 / 2026"}),e.jsx(se,{className:"btn btn-ghost",style:{padding:"10px 18px"},onClick:s=>{s.preventDefault(),a("Frühzugang")},href:"#",children:e.jsx("span",{children:"Frühzugang sichern"})})]})]})]})]})})}function Ie({id:a,eyebrow:t,title:n,lead:s,to:o}){const[i,r]=ae();return e.jsx("section",{id:a,children:e.jsx("div",{className:"wrap",children:e.jsxs("div",{className:`section-head reveal${r?" in":""}`,ref:i,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:t}),e.jsx("h2",{dangerouslySetInnerHTML:{__html:n}})]}),e.jsxs("div",{children:[e.jsx("p",{className:"lead",children:s}),e.jsx(se,{className:"btn btn-primary",to:o,style:{marginTop:26},children:e.jsx("span",{children:"Mehr erfahren"})})]})]})})})}function Jt(){const[a,t]=ae();return e.jsx("section",{style:{padding:"40px 0 120px"},children:e.jsx("div",{className:"wrap",children:e.jsxs("div",{className:`stats stagger${t?" in":""}`,ref:a,children:[e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"30"}),e.jsx("span",{children:"€"})]}),e.jsx("div",{className:"label",children:"Pro Monat · alle Mitarbeiter"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"05"}),e.jsx("span",{children:"·"}),e.jsx("em",{children:"01"})]}),e.jsx("div",{className:"label",children:"Module live · Ein Login"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"100"}),e.jsx("span",{children:"%"})]}),e.jsx("div",{className:"label",children:"Gehostet in Deutschland"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"48"}),e.jsx("span",{children:"h"})]}),e.jsx("div",{className:"label",children:"Bis dein Team produktiv ist"})]})]})})})}const Qt=[{tier:"Arbeitsstation",sub:"Die smarte Arbeitsstation für deinen Betrieb — Tablet & Kiosk",price:"30",per:"€ / Monat · unbegrenzte Stationen & Mitarbeiter",items:["Zeiterfassung mit QR-Mitarbeiterausweis","Aufgaben- & Taskmanagement fürs ganze Team","Lieferscheine, Inventur & Bestandsführung","E-Mail-Integration: Gmail, Outlook & IMAP","Teamverwaltung, Rollen & HR-Dokumente"],pop:!0}];function es({tier:a,sub:t,price:n,per:s,items:o,pop:i}){return e.jsxs("article",{className:`price${i?" pop":""}`,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:a}),e.jsx("h3",{style:{marginTop:12},children:t})]}),e.jsxs("div",{className:"price-tag",children:[e.jsx("span",{className:"num",style:n.length>3?{fontSize:52}:{},children:n}),s&&e.jsx("span",{className:"per",children:s})]}),e.jsx("ul",{children:o.map(r=>e.jsx("li",{children:r},r))}),e.jsx(se,{className:`btn ${i?"btn-primary":"btn-ghost"}`,href:"/pricing",children:e.jsx("span",{children:"Details ansehen"})})]})}function ts(){const[a,t]=ae();return e.jsx("section",{id:"preise",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:`section-head reveal${t?" in":""}`,ref:a,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Preise — einfach gehalten"}),e.jsxs("h2",{children:["Ein Preis. ",e.jsx("br",{}),e.jsx("em",{children:"Fertig."})]})]}),e.jsx("p",{className:"lead",children:"Transparent. Ohne versteckte Kosten. Monatlich kündbar. Die Komplett-Suite mit KI Sekretärin ist in Entwicklung — Details auf der Preisseite."})]}),e.jsx(Le,{className:"pricing-grid",style:{gridTemplateColumns:"minmax(0,420px)",justifyContent:"center"},children:Qt.map(n=>e.jsx(es,{...n},n.tier))})]})})}function ss(){const[a,t]=ae(),n=[["Wo werden meine Daten gespeichert?","Alle Daten liegen verschlüsselt auf Servern in Deutschland (Frankfurt). Wir sind nach DSGVO geprüft und bieten auf Wunsch eine Private-Cloud-Instanz."],["Was genau ist die Arbeitsstation?","Ein Tablet- oder Kiosk-Arbeitsplatz für deinen Betrieb: Zeiterfassung per QR-Ausweis, Aufgaben, Lieferscheine und Inventur — ein Preis, beliebig viele Mitarbeiter."],["Wie lange dauert das Onboarding?","Die meisten Teams sind in 48 Stunden produktiv. Wir unterstützen bei der Einrichtung deiner E-Mail-Konten und Module."],["Was passiert, wenn die KI einen Fehler macht?",'Jede automatische Aktion ist standardmäßig im "Vorschlags-Modus". Du entscheidest, was direkt geht, was freigegeben werden muss, und was dokumentiert wird.'],["Wie nachhaltig ist NILL wirklich?","Unsere Kern-Infrastruktur läuft auf 100 % Ökostrom in Frankfurt. Drittanbieter kompensieren wir zu 105 % über Gold-Standard-Projekte. Jährlicher Nachhaltigkeitsbericht auf Anfrage."]];return e.jsx("section",{id:"faq",children:e.jsxs("div",{className:"wrap-tight",children:[e.jsx("div",{className:`section-head reveal${t?" in":""}`,ref:a,style:{marginBottom:40},children:e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Antworten auf das Naheliegende"}),e.jsx("h2",{children:"FAQ."})]})}),e.jsx(Le,{stagger:!0,className:"faq",children:n.map(([s,o])=>e.jsxs("details",{children:[e.jsx("summary",{children:s}),e.jsx("p",{className:"a",children:o})]},s))})]})})}function ns({onCTA:a}){const[t,n]=ae();return e.jsx("section",{id:"cta",className:"cta-big",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("h2",{className:`reveal${n?" in":""}`,ref:t,children:["Weniger ",e.jsx("br",{}),e.jsx("em",{children:"Verwaltung."}),e.jsx("br",{}),"Mehr Betrieb."]}),e.jsxs("div",{className:`cta-sub reveal reveal-delay-1${n?" in":""}`,children:[e.jsx("p",{className:"lead",children:"30 Minuten Live-Demo — direkt mit dem Gründer, an deinem echten Arbeitstag. Kein Sales-Team, keine Folien."}),e.jsx("div",{style:{display:"flex",gap:12,flexWrap:"wrap"},children:e.jsx(se,{className:"btn btn-primary",onClick:s=>{s.preventDefault(),a("Termin")},href:"#",children:e.jsx("span",{children:"Termin buchen"})})})]})]})})}function ds(){Gt();const[a,t]=u.useState(null),n=u.useCallback(o=>t(o||"default"),[]),s=u.useCallback(()=>t(null),[]);return e.jsxs(e.Fragment,{children:[e.jsx(_t,{}),e.jsx(ut,{}),e.jsx(Ut,{onCTA:n}),e.jsx(Wt,{}),e.jsx(Xt,{}),e.jsx(qt,{onCTA:n}),e.jsx(Ie,{id:"wie",eyebrow:"Wie es arbeitet — 05 Schritte",title:"Ein Tag, von der <em>KI</em> geführt.",lead:"Von der ersten Mail um 07:48 bis zum neuen Dienstplan um 16:48 — sieh Schritt für Schritt, wie NILL einen kompletten Arbeitstag durch alle Module begleitet.",to:"/wie-es-arbeitet"}),e.jsx(Jt,{}),e.jsx(ts,{onCTA:n}),e.jsx(Ie,{id:"app",eyebrow:"Progressive Web App · ohne App Store",title:"NILL als App. <em>Ohne Store.</em>",lead:"Direkt aus dem Browser installiert — auf iOS, Android, macOS und Windows. Offline-fähig, mit Push-Benachrichtigungen und ohne Update-Zwang.",to:"/app"}),e.jsx(Ie,{id:"nachhaltigkeit",eyebrow:"Nachhaltigkeit",title:"Intelligenz mit <em>Verantwortung.</em>",lead:"100 % Ökostrom in Frankfurt, kompensierte Drittanbieter und ein jährlicher Nachhaltigkeitsbericht. Wie NILL Effizienz und Klimaschutz zusammenbringt.",to:"/nachhaltigkeit"}),e.jsx(ss,{}),e.jsx(ns,{onCTA:n}),e.jsx(vt,{}),e.jsx(ft,{intent:a,onClose:s})]})}export{ds as default};
