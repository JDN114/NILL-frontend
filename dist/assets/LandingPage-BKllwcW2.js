import{a as u,j as e}from"./vendor-react--hPKs4bs.js";import{u as ne,T as $e,C as ie,R as Je,a as Qe,A as et,S as tt,F as st,B as Ke,b as ee,c as me,d as ue,V as Ie,e as nt,f as at,g as rt,E as ot,h as it,U as ct}from"./vendor-three-DyQZHLDt.js";import{L as lt,F as dt,M as ht,a as X,u as ae,R as Ce}from"./chrome-M84so5cN.js";/* empty css                */import"./vendor-misc-CMqYbET0.js";import"./vendor-router-BxWC8dWZ.js";function mt(){const n=document.createElement("canvas");n.width=1024,n.height=512;const s=n.getContext("2d");s.fillStyle="#d4d6dc",s.fillRect(0,0,1024,512);for(let r=0;r<2400;r++)s.fillStyle=`rgba(${100+(Math.random()*40|0)},${100+(Math.random()*40|0)},${110+(Math.random()*40|0)},${.08+Math.random()*.12})`,s.fillRect(Math.random()*1024,Math.random()*512,1+Math.random()*3,1);s.strokeStyle="rgba(20,22,28,.55)",s.lineWidth=1.2;for(let r=0;r<1024;r+=64)s.beginPath(),s.moveTo(r,0),s.lineTo(r,512),s.stroke();for(let r=0;r<512;r+=64)s.beginPath(),s.moveTo(0,r),s.lineTo(1024,r),s.stroke();s.fillStyle="rgba(40,44,52,.7)";for(let r=8;r<1024;r+=32)for(let i=8;i<512;i+=32)s.fillRect(r,i,1.5,1.5);for(let r=0;r<14;r++){const i=Math.random()*844,h=Math.random()*422,l=80+Math.random()*100,c=40+Math.random()*60;s.strokeStyle="rgba(15,17,22,.7)",s.lineWidth=2,s.strokeRect(i,h,l,c),s.fillStyle="rgba(50,55,65,.18)",s.fillRect(i,h,l,c)}for(let r=0;r<60;r++)s.fillStyle=`rgba(${30+(Math.random()*40|0)},${28+(Math.random()*30|0)},${28+(Math.random()*30|0)},${.15+Math.random()*.25})`,s.fillRect(Math.random()*1024,Math.random()*512,30+Math.random()*120,1+Math.random()*3);s.fillStyle="rgba(220,200,40,.55)",s.font="bold 14px monospace",["CAUTION","HATCH-A4","MOD-7","EXT-VENT","HIGH-V","NILL-OS"].forEach((r,i)=>s.fillText(r,60+i*160,40+i%2*220));const o=new ie(n);return o.wrapS=o.wrapT=Je,o.anisotropy=8,o}function ut(){const n=document.createElement("canvas");n.width=512,n.height=256;const s=n.getContext("2d"),o=s.createLinearGradient(0,0,512,256);o.addColorStop(0,"#0a1840"),o.addColorStop(.5,"#1a3878"),o.addColorStop(1,"#0a1d54"),s.fillStyle=o,s.fillRect(0,0,512,256);const r=32,i=32;for(let l=0;l<512;l+=r)for(let c=0;c<256;c+=i){const w=.8+Math.random()*.3;s.fillStyle=`rgba(${30*w|0},${60*w|0},${140*w|0},.95)`,s.fillRect(l+1,c+1,r-2,i-2);const S=s.createLinearGradient(l,c,l+r,c+i);S.addColorStop(0,"rgba(120,180,255,.18)"),S.addColorStop(.5,"rgba(255,255,255,.05)"),S.addColorStop(1,"rgba(20,40,90,.2)"),s.fillStyle=S,s.fillRect(l+1,c+1,r-2,i-2),s.fillStyle="rgba(180,190,210,.4)",s.fillRect(l+r/2-.5,c+1,1,i-2)}s.strokeStyle="rgba(8,12,28,.85)",s.lineWidth=1;for(let l=0;l<=512;l+=r)s.beginPath(),s.moveTo(l,0),s.lineTo(l,256),s.stroke();for(let l=0;l<=256;l+=i)s.beginPath(),s.moveTo(0,l),s.lineTo(512,l),s.stroke();const h=new ie(n);return h.anisotropy=8,h}function pt(){const a=document.createElement("canvas");a.width=a.height=128;const t=a.getContext("2d"),n=t.createRadialGradient(64,64,0,64,64,64);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.3,"rgba(255,255,255,.5)"),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,128,128),new ie(a)}function vt(){const a=document.createElement("canvas");a.width=512,a.height=64;const t=a.getContext("2d");t.fillStyle="#181a20",t.fillRect(0,0,512,64);for(let n=0;n<24;n++){const s=20+n*20,o=t.createRadialGradient(s+6,32,0,s+6,32,12);o.addColorStop(0,"rgba(255,240,200,1)"),o.addColorStop(.4,"rgba(180,220,255,.85)"),o.addColorStop(1,"rgba(40,80,160,0)"),t.fillStyle=o,t.fillRect(s-6,16,24,32),t.strokeStyle="#2a2d35",t.lineWidth=2,t.strokeRect(s,22,12,20)}return new ie(a)}function ft(a){const t=$e,n=mt(),s=ut(),o=pt(),r=vt(),i=new t.MeshStandardMaterial({map:n,color:16777215,metalness:.65,roughness:.42}),h=new t.MeshStandardMaterial({map:n,color:10133680,metalness:.7,roughness:.5}),l=new t.MeshStandardMaterial({color:13041468,emissive:7178772,emissiveIntensity:.9,metalness:.5,roughness:.35}),c=new t.MeshStandardMaterial({color:1842982,metalness:.75,roughness:.55}),w=new t.MeshStandardMaterial({color:13148234,metalness:.85,roughness:.25,emissive:3811848,emissiveIntensity:.15}),S=new t.MeshStandardMaterial({map:s,metalness:.7,roughness:.35,emissive:661560,emissiveIntensity:.18,side:t.DoubleSide}),N=new t.MeshBasicMaterial({map:r,transparent:!0,opacity:.95}),M=new t.Group;a.add(M),[-1,0,1].forEach((v,d)=>{const p=new t.Mesh(new t.CylinderGeometry(.88,.88,.92,32),i);if(p.rotation.z=Math.PI/2,p.position.x=v*1,M.add(p),d<2){const f=new t.Mesh(new t.CylinderGeometry(.94,.94,.12,32),w);f.rotation.z=Math.PI/2,f.position.x=v*1+.5,M.add(f)}const y=new t.Mesh(new t.CylinderGeometry(.881,.881,.22,32,1,!0),N);y.rotation.z=Math.PI/2,y.position.x=v*1,M.add(y)}),[-1.5,1.5].forEach(v=>{const d=new t.Mesh(new t.SphereGeometry(.88,32,16,0,Math.PI*2,0,Math.PI/2),i);d.rotation.z=v>0?-Math.PI/2:Math.PI/2,d.position.x=v,M.add(d)});const T=new t.Group;T.position.y=.82,T.add(new t.Mesh(new t.CylinderGeometry(.32,.38,.15,24),i));const b=new t.Mesh(new t.SphereGeometry(.3,24,16,0,Math.PI*2,0,Math.PI/2),new t.MeshStandardMaterial({color:4880568,metalness:.9,roughness:.08,emissive:3823736,emissiveIntensity:.45,transparent:!0,opacity:.88}));b.position.y=.075,T.add(b);for(let v=0;v<6;v++){const d=v/6*Math.PI*2,p=new t.Mesh(new t.BoxGeometry(.012,.3,.012),c);p.position.set(Math.cos(d)*.27,.075,Math.sin(d)*.27),p.rotation.y=-d,T.add(p)}M.add(T),[-2.55,2.55].forEach(v=>{const d=new t.Group;d.position.x=v;const p=new t.Mesh(new t.CylinderGeometry(.58,.58,1.5,24),i);p.rotation.z=Math.PI/2,d.add(p);const y=new t.Mesh(new t.SphereGeometry(.58,24,16,0,Math.PI*2,0,Math.PI/2),w);y.rotation.z=v>0?-Math.PI/2:Math.PI/2,y.position.x=v>0?.75:-.75,d.add(y);const f=new t.Mesh(new t.TorusGeometry(.58,.03,8,24),l);f.rotation.y=Math.PI/2,f.position.x=v>0?.75:-.75,d.add(f);const A=new t.Mesh(new t.CylinderGeometry(.581,.581,.18,24,1,!0),N);A.rotation.z=Math.PI/2,d.add(A);for(let Y=0;Y<8;Y++){const U=Y/8*Math.PI*2,J=new t.Mesh(new t.BoxGeometry(.08,.04,.15),c);J.position.set((Math.random()-.5)*1,Math.cos(U)*.6,Math.sin(U)*.6),J.lookAt(J.position.x,0,0),d.add(J)}const L=new t.Mesh(new t.BoxGeometry(.4,.15,.12),c);L.position.set(0,-.62,0),d.add(L);const R=new t.Mesh(new t.CylinderGeometry(.04,.04,1.4,8),w);R.rotation.z=Math.PI/2,R.position.set(0,.58,.15),d.add(R),a.add(d)});const z=(v,d)=>{const p=new t.Group;p.position.x=v,[[-.13,-.13],[.13,-.13],[-.13,.13],[.13,.13]].forEach(([y,f])=>{const A=new t.Mesh(new t.CylinderGeometry(.018,.018,d,6),c);A.rotation.z=Math.PI/2,A.position.set(0,y,f),p.add(A)});for(let y=0;y<4;y++){const f=-d/2+(y+.5)*(d/4),A=new t.Mesh(new t.CylinderGeometry(.012,.012,.36,6),c);A.position.set(f,0,0),A.rotation.z=Math.PI/4,p.add(A);const L=new t.Mesh(new t.CylinderGeometry(.012,.012,.36,6),c);L.position.set(f,0,0),L.rotation.x=Math.PI/4,p.add(L)}return[-d/2,d/2].forEach(y=>{const f=new t.Mesh(new t.TorusGeometry(.18,.015,6,12),c);f.rotation.y=Math.PI/2,f.position.x=y,p.add(f)}),p};a.add(z(-1.7,.65)),a.add(z(1.7,.65));const I=[];[-1,1].forEach(v=>{const d=new t.Group,p=new t.Mesh(new t.CylinderGeometry(.13,.13,.35,12),h);p.position.y=v*.9,d.add(p);const y=new t.Mesh(new t.CylinderGeometry(.07,.07,1.7,10),h);y.position.y=v*1.95,d.add(y);const f=new t.Mesh(new t.SphereGeometry(.14,16,12),w);f.position.y=v*2.85,d.add(f),[-1,1].forEach(A=>{const L=new t.Group;L.position.set(A*2.4,v*2.85,0);const R=new t.Mesh(new t.PlaneGeometry(4.6,1.55,16,4),S);R.rotation.y=Math.PI/2*(A>0?1:-1),L.add(R);const Y=new t.Mesh(new t.BoxGeometry(.08,1.55,4.6),h);L.add(Y);const U=new t.Mesh(new t.BoxGeometry(.18,.25,.25),c);U.position.x=A>0?-2.3:2.3,L.add(U),d.add(L),I.push(L)}),a.add(d)}),[-1,1].forEach(v=>{const d=new t.Mesh(new t.PlaneGeometry(1.2,.9),new t.MeshStandardMaterial({color:15790312,metalness:.1,roughness:.8,side:t.DoubleSide,emissive:2105376,emissiveIntensity:.05}));d.position.set(v*1.7,0,.85),d.rotation.x=Math.PI/2,a.add(d);const p=new t.Mesh(new t.BoxGeometry(1.2,.04,.04),c);p.position.set(v*1.7,0,.85),a.add(p)});const C=new t.Group;C.position.set(.4,0,1);const G=new t.Mesh(new t.CylinderGeometry(.05,.05,.55,10),h);G.position.y=.27,C.add(G);const j=new t.Mesh(new t.SphereGeometry(.08,12,10),w);j.position.y=.55,C.add(j);const P=new t.Mesh(new t.SphereGeometry(.42,24,16,0,Math.PI*2,0,Math.PI/2.5),new t.MeshStandardMaterial({color:15658724,metalness:.4,roughness:.3,side:t.DoubleSide}));P.position.y=.65,P.rotation.x=-.4,C.add(P);const D=new t.Mesh(new t.ConeGeometry(.06,.18,10),c);D.position.set(0,.82,.15),D.rotation.x=Math.PI,C.add(D);for(let v=0;v<3;v++){const d=v/3*Math.PI*2,p=new t.Mesh(new t.CylinderGeometry(.006,.006,.25,6),c);p.position.set(Math.cos(d)*.12,.75,.08+Math.sin(d)*.12),p.rotation.x=.4,p.rotation.z=d,C.add(p)}a.add(C);const x=new t.Group;x.position.set(-.6,0,1);const O=new t.Mesh(new t.CylinderGeometry(.025,.025,.8,8),c);O.position.y=.4,x.add(O);const B=new t.Mesh(new t.SphereGeometry(.04,8,8),l);B.position.y=.82,x.add(B),a.add(x);const $=new t.Mesh(new t.CylinderGeometry(.32,.42,.48,24),h);$.position.set(0,-.85,.35),$.rotation.x=Math.PI/2,a.add($);const te=new t.Mesh(new t.TorusGeometry(.34,.04,10,24),l);te.position.set(0,-1.05,.35),te.rotation.x=Math.PI/2,a.add(te);for(let v=0;v<4;v++){const d=v/4*Math.PI*2+Math.PI/4,p=new t.Mesh(new t.CylinderGeometry(.022,.022,.15,6),c);p.position.set(Math.cos(d)*.36,-1.05,.35+Math.sin(d)*.36),p.rotation.z=-Math.PI/2,a.add(p)}[[3.2,0,0],[-3.2,0,0],[0,1,1],[0,-1,1]].forEach(([v,d,p])=>{const y=new t.Group;y.position.set(v,d,p);for(let f=0;f<4;f++){const A=f/4*Math.PI*2,L=new t.Mesh(new t.ConeGeometry(.04,.12,8),c);L.position.set(Math.cos(A)*.08,Math.sin(A)*.08,0),L.rotation.x=Math.PI/2,y.add(L)}a.add(y)});const ce=[];[[0,-2.9,.15],[0,-2.9,-.15],[0,-1.1,.35],[0,-1.1,-.05],[-3.2,0,0],[3.2,0,0]].forEach(([v,d,p])=>{const y=new t.Sprite(new t.SpriteMaterial({map:o,color:6336767,transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));y.scale.set(2.8,2.8,1),y.position.set(v,d,p),a.add(y);const f=new t.Sprite(new t.SpriteMaterial({map:o,color:15267071,transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));f.scale.set(.7,.7,1),f.position.set(v,d,p),a.add(f),ce.push({outer:y,inner:f})});const q=[];[[3.4,0,0,16724048],[-3.4,0,0,13041468],[0,2.95,1.2,16777215],[0,-2.95,1.2,16777215],[0,0,1.4,16747068],[0,0,-1.4,6741503]].forEach(([v,d,p,y])=>{const f=new t.Mesh(new t.SphereGeometry(.05,10,10),new t.MeshBasicMaterial({color:y,transparent:!0}));f.position.set(v,d,p);const A=new t.Sprite(new t.SpriteMaterial({map:o,color:y,transparent:!0,opacity:.6,blending:t.AdditiveBlending,depthWrite:!1}));A.scale.set(.4,.4,1),f.add(A),a.add(f),q.push({mesh:f,halo:A})});const K=[new t.Vector3(0,.82,.2),new t.Vector3(-2.4,2.85,0),new t.Vector3(.4,.65,1)],_=K.map((v,d)=>{const p=new t.Sprite(new t.SpriteMaterial({map:o,color:[13041468,3732944,8019199][d],transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));return p.scale.set(3.5,3.5,1),p.position.copy(v),a.add(p),p});return{thrusterGlows:ce,navLights:q,focusHalos:_,FOCUS_ANCHORS:K,solarWings:I,dishGroup:C}}const xt=u.forwardRef(function({thrusterProxy:t,focusProxy:n,stationProxy:s},o){const r=u.useRef(),i=u.useRef(null);return u.useImperativeHandle(o,()=>r.current,[]),u.useEffect(()=>{if(!r.current)return;const h=ft(r.current);return i.current=h,()=>{i.current=null}},[]),ne(({clock:h})=>{if(!i.current)return;const l=h.elapsedTime,c=(t==null?void 0:t.intensity)??0,w=(n==null?void 0:n.value)??-1,{thrusterGlows:S,navLights:N,focusHalos:M,solarWings:T,dishGroup:b}=i.current;T.forEach((z,I)=>{z.rotation.z=Math.sin(l*.06+I*1.4)*.22}),b.rotation.y=Math.sin(l*.05)*.3,b.rotation.x=Math.sin(l*.041+.7)*.08,S.forEach(({outer:z,inner:I},C)=>{const G=Math.sin(l*9+C*.8)*.5+.5;z.material.opacity=c*(.18+G*.07),I.material.opacity=c*(.45+G*.12)}),N.forEach(({mesh:z},I)=>{const C=Math.sin(l*(2.1+I*.43)+I*1.9)>.3;z.material.opacity=C?1:.04}),M.forEach((z,I)=>{const C=I===w?.36+Math.sin(l*1.8)*.07:0;z.material.opacity+=(C-z.material.opacity)*.06})}),e.jsx("group",{ref:r})}),gt=`
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
`;function wt(){const a=u.useRef(),{surfaceMat:t,atmoMat:n}=u.useMemo(()=>{const s=new Ie(Math.cos(-53*Math.PI/180)*Math.cos(135*Math.PI/180),Math.sin(-53*Math.PI/180),Math.cos(-53*Math.PI/180)*Math.sin(135*Math.PI/180)).normalize(),o=new me({uniforms:{uTime:{value:0},uSunDir:{value:s.clone()},uSeaLevel:{value:-.02},uCloudOpacity:{value:.45},uCloudSpeed:{value:.65},uCityLights:{value:1},uAtmoStrength:{value:.65}},vertexShader:`
        varying vec3 vLP; varying vec3 vWP; varying vec3 vWN;
        void main(){
          vLP = position;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWP = wp.xyz;
          vWN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:gt+`
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
      `}),r=new me({side:nt,transparent:!0,depthWrite:!1,blending:ue,uniforms:{uSunDir:{value:s.clone()},uAtmoStrength:{value:.55}},vertexShader:`
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
      `});return{surfaceMat:o,atmoMat:r}},[]);return ne(({clock:s})=>{t.uniforms.uTime.value=s.elapsedTime,a.current&&(a.current.rotation.y=s.elapsedTime*.075)}),e.jsxs("group",{ref:a,position:[-7.8,-7.9,-14.2],scale:1.34,children:[e.jsx("mesh",{material:t,children:e.jsx("sphereGeometry",{args:[2.7,96,64]})}),e.jsx("mesh",{material:n,children:e.jsx("sphereGeometry",{args:[2.92,64,48]})})]})}function yt(){const{geometry:t,material:n}=u.useMemo(()=>{const s=new Float32Array(6600),o=new Float32Array(2200),r=new Float32Array(2200*3),i=new Float32Array(2200);for(let c=0;c<2200;c++){const w=60+Math.random()*70,S=Math.random()*Math.PI*2,N=Math.acos(2*Math.random()-1);s[c*3]=w*Math.sin(N)*Math.cos(S),s[c*3+1]=w*Math.sin(N)*Math.sin(S),s[c*3+2]=w*Math.cos(N),o[c]=.4+Math.random()*1.4,i[c]=Math.random()*Math.PI*2;const M=Math.random();r[c*3]=M<.15?1:M>.85?.7:.95,r[c*3+1]=M<.15?.85:M>.85?.8:.95,r[c*3+2]=M<.15?.7:M>.85?1:.95}const h=new Ke;h.setAttribute("position",new ee(s,3)),h.setAttribute("starSize",new ee(o,1)),h.setAttribute("color",new ee(r,3)),h.setAttribute("twinkle",new ee(i,1));const l=new me({uniforms:{uTime:{value:0}},vertexShader:`
        attribute float starSize; attribute vec3 color; attribute float twinkle;
        uniform float uTime;
        varying vec3 vC; varying float vTw;
        void main(){
          vC = color;
          vTw = .72 + .28 * sin(uTime * 1.6 + twinkle * 7.);
          vec4 mv = modelViewMatrix * vec4(position, 1.);
          gl_PointSize = starSize * (.85 + .3 * sin(uTime * 1.1 + twinkle * 5.)) * (700. / -mv.z);
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
      `,transparent:!0,depthWrite:!1,blending:ue});return{geometry:h,material:l}},[]);return ne(({clock:s})=>{n.uniforms.uTime.value=s.elapsedTime}),e.jsx("points",{geometry:t,material:n})}function Mt(){const{geometry:a,material:t}=u.useMemo(()=>{const s=new Float32Array(660),o=new Float32Array(220),r=new Float32Array(220);for(let l=0;l<220;l++)s[l*3]=(Math.random()-.5)*30,s[l*3+1]=(Math.random()-.5)*18,s[l*3+2]=-6+Math.random()*14,o[l]=.25+Math.random()*.9,r[l]=.3+Math.random()*1;const i=new Ke;i.setAttribute("position",new ee(s,3)),i.setAttribute("aSpeed",new ee(o,1)),i.setAttribute("starSize",new ee(r,1));const h=new me({uniforms:{uTime:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:ue});return{geometry:i,material:h}},[]);return ne(({clock:n})=>{t.uniforms.uTime.value=n.elapsedTime}),e.jsx("points",{geometry:a,material:t})}function jt(){const a=u.useMemo(()=>{const t=document.createElement("canvas");t.width=t.height=256;const n=t.getContext("2d"),s=n.createRadialGradient(128,128,0,128,128,128);return s.addColorStop(0,"rgba(255,244,220,.95)"),s.addColorStop(.18,"rgba(255,210,150,.38)"),s.addColorStop(.5,"rgba(255,170,90,.08)"),s.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=s,n.fillRect(0,0,256,256),new at({map:new ie(t),transparent:!0,opacity:.5,blending:ue,depthWrite:!1,fog:!1})},[]);return ne(({clock:t})=>{a.opacity=.46+Math.sin(t.elapsedTime*.8)*.06}),e.jsx("sprite",{material:a,position:[44.7,22.3,31.3],scale:[30,30,1]})}function bt({cameraProxy:a,lookProxy:t,fovProxy:n,thrusterProxy:s}){const{camera:o}=rt(),r=u.useMemo(()=>new Ie,[]),i=u.useMemo(()=>new Ie,[]);return u.useEffect(()=>{o.position.set(0,1.6,30),o.fov=36,o.updateProjectionMatrix()},[]),ne(({clock:h},l)=>{const c=h.elapsedTime,w=Math.min(l,1/20),S=Math.sin(c*.19)*.06,N=Math.sin(c*.13)*.04,M=Math.sin(c*.07)*.05,b=((s==null?void 0:s.intensity)??0)*.045,z=b*Math.sin(c*31.7)*(.6+.4*Math.sin(c*13.1)),I=b*Math.sin(c*27.3+1.7)*(.6+.4*Math.cos(c*17.9));i.set(((a==null?void 0:a.x)??0)+S+z,((a==null?void 0:a.y)??0)+N+I,((a==null?void 0:a.z)??16)+M),o.position.lerp(i,1-Math.pow(1-.18,w*60)),r.set(((t==null?void 0:t.x)??0)+Math.sin(c*.17)*.025+z*.5,((t==null?void 0:t.y)??0)+Math.cos(c*.21)*.02+I*.5,(t==null?void 0:t.z)??0),o.lookAt(r),n&&Math.abs(o.fov-n.value)>.05&&(o.fov+=(n.value-o.fov)*(1-Math.pow(1-.12,w*60)),o.updateProjectionMatrix())}),null}function St({issGroupRef:a,stationProxy:t,cameraProxy:n,lookProxy:s,thrusterProxy:o,fovProxy:r,focusProxy:i,onReady:h}){return u.useEffect(()=>{h==null||h()},[h]),e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{color:2107456,intensity:.4}),e.jsx("directionalLight",{color:16774364,intensity:2.8,position:[10,5,7]}),e.jsx("directionalLight",{color:4880568,intensity:1.05,position:[6,-8,-4]}),e.jsx("directionalLight",{color:8965375,intensity:.5,position:[-7,3,-5]}),e.jsx(yt,{}),e.jsx(wt,{}),e.jsx(Mt,{}),e.jsx(jt,{}),e.jsx(u.Suspense,{fallback:null,children:e.jsx(xt,{ref:a,thrusterProxy:o,focusProxy:i})}),e.jsx(bt,{cameraProxy:n,lookProxy:s,fovProxy:r,thrusterProxy:o})]})}function Nt({active:a=!0,issGroupRef:t,stationProxy:n,cameraProxy:s,lookProxy:o,thrusterProxy:r,fovProxy:i,focusProxy:h,onLoaded:l}){return e.jsx(Qe,{frameloop:a?"always":"never",dpr:[1,1.4],gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},style:{width:"100%",height:"100%",background:"#02030a"},camera:{fov:36,near:.1,far:300,position:[0,1.6,30]},onCreated:({gl:c,scene:w})=>{c.toneMapping=et,c.toneMappingExposure=1.15,c.outputColorSpace=tt,w.fog=new st(131850,.014)},children:e.jsx(St,{issGroupRef:t,stationProxy:n,cameraProxy:s,lookProxy:o,thrusterProxy:r,fovProxy:i,focusProxy:h,onReady:l})})}function zt(a){return a?a.split(/(<em>[^<]*<\/em>|\n)/g).map((t,n)=>{if(t===`
`)return e.jsx("br",{},n);const s=t.match(/^<em>([^<]*)<\/em>$/);return s?e.jsx("em",{children:s[1]},n):t||null}):null}const Pt=u.forwardRef(function({index:t=0,total:n=3,tag:s,title:o,description:r,stats:i,position:h="tr",state:l="future"},c){const w=["iss-card",`pos-${h}`,l==="active"?"is-active":"",l==="past"?"is-past":""].filter(Boolean).join(" ");return e.jsxs("article",{ref:c,className:w,"aria-hidden":l!=="active",children:[e.jsxs("div",{className:"iss-card-index",children:[e.jsx("em",{children:String(t+1).padStart(2,"0")}),e.jsx("span",{children:"/"}),e.jsx("span",{children:String(n).padStart(2,"0")})]}),s&&e.jsx("div",{className:"iss-card-tag",children:s}),o&&e.jsx("h3",{children:zt(o)}),r&&e.jsx("p",{children:r}),i&&i.length>0&&e.jsx("div",{className:"iss-card-stats",children:i.map(([S,N],M)=>e.jsxs("div",{className:"iss-card-stat",children:[e.jsx("span",{className:"iss-card-stat-num",children:S}),e.jsx("span",{className:"iss-card-stat-lbl",children:N})]},M))})]})}),V=(a,t,n)=>a+(t-a)*n,Ye=(a,t,n)=>a<t?t:a>n?n:a,It=a=>{const t=Ye(a,0,1);return t*t*t*(t*(t*6-15)+10)},oe=[{p:0,cam:{x:0,y:1.6,z:30},look:{x:0,y:0,z:0},rotX:.05,rotY:.2,rotZ:0,fov:36,thruster:0,focus:-1,card:-1,phase:"approach"},{p:.08,cam:{x:0,y:.7,z:13.5},look:{x:0,y:.1,z:0},rotX:.18,rotY:.85,rotZ:.04,fov:40,thruster:.3,focus:-1,card:-1,phase:"active"},{p:.17,cam:{x:-1.9,y:1.8,z:6.4},look:{x:0,y:.6,z:.2},rotX:-.06,rotY:1.55,rotZ:-.04,fov:38,thruster:0,focus:0,card:0,phase:"reveal"},{p:.3,cam:{x:-2.15,y:1.7,z:6.15},look:{x:0,y:.62,z:.2},rotX:-.05,rotY:1.63,rotZ:-.04,fov:38,thruster:0,focus:0,card:0,phase:"reveal"},{p:.39,cam:{x:3.6,y:-.1,z:8},look:{x:-.4,y:1.4,z:0},rotX:.08,rotY:2.55,rotZ:.08,fov:44,thruster:0,focus:1,card:1,phase:"reveal"},{p:.52,cam:{x:3.85,y:.05,z:7.7},look:{x:-.4,y:1.42,z:0},rotX:.09,rotY:2.63,rotZ:.08,fov:44,thruster:0,focus:1,card:1,phase:"reveal"},{p:.61,cam:{x:-2.3,y:-.6,z:6.6},look:{x:.4,y:-.05,z:.9},rotX:.18,rotY:3.45,rotZ:-.05,fov:36,thruster:0,focus:2,card:2,phase:"reveal"},{p:.74,cam:{x:-2.52,y:-.5,z:6.35},look:{x:.4,y:-.03,z:.9},rotX:.19,rotY:3.53,rotZ:-.05,fov:36,thruster:0,focus:2,card:2,phase:"reveal"},{p:.88,cam:{x:0,y:2.9,z:19.5},look:{x:0,y:-.8,z:-1.8},rotX:.28,rotY:4.25,rotZ:-.05,fov:46,thruster:.6,focus:-1,card:-1,phase:"outro"},{p:1,cam:{x:0,y:3.3,z:21.5},look:{x:0,y:-1,z:-2.2},rotX:.3,rotY:4.4,rotZ:-.06,fov:47,thruster:.25,focus:-1,card:-1,phase:"outro"}];function Ct(a){let t=0;for(;t<oe.length-2&&a>oe[t+1].p;)t++;const n=oe[t],s=oe[Math.min(t+1,oe.length-1)],o=s.p-n.p,r=o>1e-5?It((a-n.p)/o):0;return{cam:{x:V(n.cam.x,s.cam.x,r),y:V(n.cam.y,s.cam.y,r),z:V(n.cam.z,s.cam.z,r)},look:{x:V(n.look.x,s.look.x,r),y:V(n.look.y,s.look.y,r),z:V(n.look.z,s.look.z,r)},rotX:V(n.rotX,s.rotX,r),rotY:V(n.rotY,s.rotY,r),rotZ:V(n.rotZ,s.rotZ,r),fov:V(n.fov,s.fov,r),thruster:V(n.thruster,s.thruster,r),focus:r>.5?s.focus:n.focus,card:r>.5?s.card:n.card,phase:r>.5?s.phase:n.phase}}function At({sectionRef:a,issGroupRef:t,stationProxy:n,cameraProxy:s,lookProxy:o,thrusterProxy:r,fovProxy:i,focusProxy:h,onPhaseChange:l,onCardChange:c,damping:w=.07}={}){u.useEffect(()=>{if(!(a!=null&&a.current)){console.warn("[ISS] sectionRef.current ist null – RAF wurde nicht gestartet");return}let S=0,N=0,M=0,T=-2,b="",z=!0,I=performance.now();const C=()=>{const j=a.current;if(!j)return;const P=j.getBoundingClientRect(),D=document.documentElement.clientHeight||window.innerHeight,x=j.offsetHeight-D;if(x<=0){N=0;return}N=Ye(-P.top/x,0,1)},G=()=>{if(!z)return;S=requestAnimationFrame(G),C();const j=performance.now(),P=Math.min((j-I)/1e3,1/20);I=j;const D=1-Math.pow(1-w,P*60);M=V(M,N,D),Math.abs(M-N)<1e-4&&(M=N);const x=Ct(M),O=j/1e3;s&&(s.x=x.cam.x,s.y=x.cam.y,s.z=x.cam.z),o&&(o.x=x.look.x,o.y=x.look.y,o.z=x.look.z),n&&(n.rotX=x.rotX,n.rotY=x.rotY,n.rotZ=x.rotZ),r&&(r.intensity=x.thruster),i&&(i.value=x.fov),h&&(h.value=x.focus);const B=t==null?void 0:t.current;B&&(B.position.x=Math.sin(O*.31)*.04,B.position.y=Math.sin(O*.23)*.055,B.position.z=Math.sin(O*.17)*.03,B.rotation.x=x.rotX+Math.sin(O*.07)*.005,B.rotation.y=x.rotY+Math.sin(O*.09)*.008,B.rotation.z=x.rotZ+Math.sin(O*.11)*.004),x.card!==T&&(T=x.card,c&&c(x.card)),x.phase!==b&&(b=x.phase,l&&l(x.phase))};return S=requestAnimationFrame(G),()=>{z=!1,cancelAnimationFrame(S)}},[a,t,n,s,o,r,i,h,l,c,w])}const ze=[{tag:"Observation Layer",title:`Intelligente
<em>Beobachtung</em>`,description:"NILL überwacht jeden Kanal wie aus der Cupola — Postfach, Belege, Lager, Schichten. Alles in einer Ansicht, ohne tote Winkel.",stats:[["24/7","aktiv"],["5","Module"],["1","Ansicht"]],position:"tr"},{tag:"Distributed Power",title:`Adaptive
<em>Architektur</em>`,description:"Wie Solar-Arrays, die sich zur Sonne drehen — NILLs Module skalieren, balancieren und heilen sich selbst, bevor du es bemerkst.",stats:[["DE","gehostet"],["100 %","Ökostrom"],["DSGVO","konform"]],position:"tl"},{tag:"Deep Space Link",title:`Autonome
<em>Orchestrierung</em>`,description:"Die Schüssel zeigt nach draußen — NILL spricht mit Banken, Behörden, Lieferanten. Workloads finden ihren Weg, ohne dass du ein Ticket öffnest.",stats:[["1.200+","Aufgaben/Tag"],["−60 %","Handarbeit"],["0","Tickets"]],position:"br"}];function Tt(){const a=u.useRef(null),t=u.useRef(null),n=[u.useRef(null),u.useRef(null),u.useRef(null)],[s,o]=u.useState(-1),[r,i]=u.useState("approach"),[h,l]=u.useState(!1),[c,w]=u.useState(!1),[S,N]=u.useState({x:"0.00",y:"0.00",z:"0.00"});u.useEffect(()=>{const j=a.current;if(!j)return;const P=new IntersectionObserver(([D])=>w(D.isIntersecting),{rootMargin:"25% 0px"});return P.observe(j),()=>P.disconnect()},[]);const M=u.useMemo(()=>({rotX:0,rotY:0,rotZ:0}),[]),T=u.useMemo(()=>({x:0,y:1.6,z:30}),[]),b=u.useMemo(()=>({x:0,y:0,z:0}),[]),z=u.useMemo(()=>({intensity:0}),[]),I=u.useMemo(()=>({value:36}),[]),C=u.useMemo(()=>({value:-1}),[]);At({sectionRef:a,issGroupRef:t,stationProxy:M,cameraProxy:T,lookProxy:b,thrusterProxy:z,fovProxy:I,focusProxy:C,onCardChange:o,onPhaseChange:i,damping:.07}),u.useEffect(()=>{if(!c)return;let j=0,P=0;const D=x=>{j=requestAnimationFrame(D),!(x-P<120)&&(P=x,N({x:T.x.toFixed(2),y:T.y.toFixed(2),z:T.z.toFixed(2)}))};return j=requestAnimationFrame(D),()=>cancelAnimationFrame(j)},[T,c]);const G=j=>j===s?"active":s>j?"past":"future";return e.jsx("section",{ref:a,className:`iss-section ${h?"iss-loaded":""}`,"data-screen-label":"ISS",children:e.jsxs("div",{className:"iss-sticky","data-phase":r,children:[e.jsx("div",{className:"iss-canvas-wrap",children:e.jsx(Nt,{active:c,issGroupRef:t,stationProxy:M,cameraProxy:T,lookProxy:b,thrusterProxy:z,fovProxy:I,focusProxy:C,onLoaded:()=>l(!0)})}),e.jsx("div",{className:"iss-bar top","aria-hidden":"true"}),e.jsx("div",{className:"iss-bar bot","aria-hidden":"true"}),e.jsx("div",{className:"iss-grain","aria-hidden":"true"}),e.jsxs("div",{className:"iss-hud tl",children:[e.jsxs("div",{children:[e.jsx("span",{className:"dot"}),"NILL · MISSION CONTROL"]}),e.jsx("div",{className:"label",children:"Orbital Layer · v1"})]}),e.jsxs("div",{className:"iss-hud tr",children:[e.jsx("div",{className:"label",children:"REF · NILL-OS / ISS-04"}),e.jsx("div",{className:"value",children:"50° 06′ 45″ N · 8° 40′ 56″ E"})]}),e.jsxs("div",{className:"iss-hud bl",children:[e.jsx("div",{className:"label",children:"CAMERA"}),e.jsxs("div",{className:"value",children:["x ",e.jsx("em",{children:S.x}),"  y ",e.jsx("em",{children:S.y}),"  z ",e.jsx("em",{children:S.z})]})]}),e.jsxs("div",{className:"iss-hud br",children:[e.jsx("div",{className:"label",children:"STATUS"}),e.jsx("div",{className:"value",children:r==="approach"?"APPROACH — STAND-BY":r==="reveal"?"REVEAL — MODULE FOCUS":"NOMINAL — TRACKING"})]}),e.jsx("div",{className:"iss-intro","aria-hidden":r!=="approach",children:e.jsxs("div",{className:"iss-intro-inner",children:[e.jsxs("span",{className:"eyebrow",children:[e.jsx("span",{className:"pip"}),"NILL · MISSION CONTROL"]}),e.jsxs("h2",{children:["Das Betriebssystem, das dein",e.jsx("br",{}),"Unternehmen ",e.jsx("em",{children:"im Orbit"})," hält."]}),e.jsx("p",{children:"Stell dir NILL als Raumstation vor: ein zentrales System, das alle Module deines Betriebs verbindet. Beobachtung, Energie, Kommunikation — orchestriert von einer KI, die nie schläft."})]})}),e.jsx("div",{className:"iss-outro","aria-hidden":r!=="outro",children:e.jsxs("div",{className:"iss-outro-inner",children:[e.jsxs("span",{className:"eyebrow",children:[e.jsx("span",{className:"pip"}),"READY · LAUNCH WINDOW OPEN"]}),e.jsxs("h2",{children:["Eine Plattform.",e.jsx("br",{}),"Ein Login. ",e.jsx("em",{children:"Alle Module."})]}),e.jsx("p",{children:"NILL hält deinen Betrieb in der Umlaufbahn — 24/7, ohne Tickets, ohne Bauchschmerzen. Bereit, die Station zu betreten?"}),e.jsxs("a",{className:"iss-outro-cta",href:"#cta",children:["Demo anfragen ",e.jsx("span",{className:"arrow",children:"→"})]})]})}),e.jsx("div",{className:"iss-card-stage",children:ze.map((j,P)=>e.jsx(Pt,{ref:n[P],index:P,total:ze.length,tag:j.tag,title:j.title,description:j.description,stats:j.stats,position:j.position,state:G(P)},P))}),e.jsx("div",{className:"iss-progress","aria-hidden":"true",children:ze.map((j,P)=>e.jsx("div",{className:`iss-progress-dot ${P===s?"active":P<s?"passed":""}`},P))}),e.jsxs("div",{className:`iss-scroll-hint ${r!=="approach"?"hidden":""}`,children:[e.jsx("span",{children:"scroll · mission"}),e.jsx("span",{className:"iss-scroll-hint-line"})]})]})})}let Be=!1;function kt(){Be||(Be=!0,document.title="NILL — Intelligenz, die mitarbeitet.")}function Lt(){const a=u.useRef(null);return u.useEffect(()=>{let t,n=0,s=1,o=0;const r=()=>{s=Math.max(1,document.documentElement.scrollHeight-innerHeight)};addEventListener("resize",r);const i=()=>{t=requestAnimationFrame(i),o++%120===0&&r();const h=window.scrollY/s;n+=(h-n)*.12,a.current&&(a.current.style.transform=`scaleX(${n})`)};return t=requestAnimationFrame(i),()=>{cancelAnimationFrame(t),removeEventListener("resize",r)}},[]),e.jsx("div",{className:"scroll-progress","aria-hidden":"true",children:e.jsx("span",{ref:a})})}function Ue(a){u.useEffect(()=>{const t=a.current;if(!t)return;const n=o=>{const r=t.getBoundingClientRect();t.style.setProperty("--mx",(o.clientX-r.left)/r.width*100+"%"),t.style.setProperty("--my",(o.clientY-r.top)/r.height*100+"%");const i=(o.clientY-r.top-r.height/2)/r.height*-4,h=(o.clientX-r.left-r.width/2)/r.width*4;t.style.transform=`translateY(-4px) perspective(900px) rotateX(${i}deg) rotateY(${h}deg)`},s=()=>t.style.transform="";return t.addEventListener("mousemove",n),t.addEventListener("mouseleave",s),()=>{t.removeEventListener("mousemove",n),t.removeEventListener("mouseleave",s)}},[])}function se({className:a,style:t,children:n}){const s=u.useRef(null);return Ue(s),e.jsx("article",{ref:s,className:`card ${a||""}`,style:t,children:n})}const Ae=`
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
`,Oe=`
  varying vec3 vLP;varying vec3 vWP;varying vec3 vWN;
  void main(){
    vLP=position;
    vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;
    vWN=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*wp;
  }
`,Et=`
  varying vec3 vWP;varying vec3 vWN;
  void main(){
    vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;
    vWN=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*wp;
  }
`,Wt=`
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
`;function Ve(a){return Ae+`
    varying vec3 vLP;varying vec3 vWP;varying vec3 vWN;
    uniform float uTime;uniform vec3 uSunPos;uniform vec3 uAtmo;
    ${a}
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
  `}const Ft=`
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
`,_t=`
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
`,Rt=`
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
`,Gt=`
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
`,He=`
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
`,Dt=`
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
`,Bt=Ae+`
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
`;function Ot(a){const t=$e,n=new t.WebGLRenderer({canvas:a,antialias:!0,powerPreference:"high-performance"});n.setPixelRatio(Math.min(devicePixelRatio,2)),n.setClearColor(131850,1);const s=new ot(n),o=new t.Scene,r=new t.PerspectiveCamera(42,2,.1,300);r.position.set(0,1.8,11),r.lookAt(0,0,0),s.addPass(new it(o,r));const i=new ct(new t.Vector2(window.innerWidth,window.innerHeight),.45,.6,.55);s.addPass(i);const h=2200,l=new Float32Array(h*3),c=new Float32Array(h),w=new Float32Array(h*3),S=new Float32Array(h);for(let m=0;m<h;m++){S[m]=Math.random()*Math.PI*2;const k=60+Math.random()*70,g=Math.random()*Math.PI*2,W=Math.acos(2*Math.random()-1);l[m*3]=k*Math.sin(W)*Math.cos(g),l[m*3+1]=k*Math.sin(W)*Math.sin(g),l[m*3+2]=k*Math.cos(W),c[m]=.4+Math.random()*1.4;const E=Math.random();w[m*3]=E<.15?1:E>.85?.7:.95,w[m*3+1]=E<.15?.85:E>.85?.8:.95,w[m*3+2]=E<.15?.7:E>.85?1:.95}const N=new t.BufferGeometry;N.setAttribute("position",new t.BufferAttribute(l,3)),N.setAttribute("starSize",new t.BufferAttribute(c,1)),N.setAttribute("color",new t.BufferAttribute(w,3)),N.setAttribute("twinkle",new t.BufferAttribute(S,1));const M=new t.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:"attribute float starSize;attribute vec3 color;attribute float twinkle;uniform float uTime;varying vec3 vC;varying float vTw;void main(){vC=color;vTw=.72+.28*sin(uTime*1.6+twinkle*7.);vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=starSize*(.85+.3*sin(uTime*1.1+twinkle*5.))*(700./-mv.z);gl_Position=projectionMatrix*mv;}",fragmentShader:"varying vec3 vC;varying float vTw;void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.25,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(vC,a*.85*vTw);}",transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}),T=new t.Points(N,M);o.add(T);const b=new t.Group;b.rotation.x=-.55,b.rotation.z=.07,o.add(b);const z=new t.Group;b.add(z);const I=new t.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:"varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:Ae+`
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
    `}),C=new t.Mesh(new t.SphereGeometry(.92,64,48),I);z.add(C);const G=m=>{const k=document.createElement("canvas");k.width=k.height=256;const g=k.getContext("2d"),W=g.createRadialGradient(128,128,0,128,128,128);m.forEach(([Q,H])=>W.addColorStop(Q,H)),g.fillStyle=W,g.fillRect(0,0,256,256);const E=new t.CanvasTexture(k);return E.minFilter=t.LinearFilter,E},j=(m,k,g)=>{const W=new t.Sprite(new t.SpriteMaterial({map:k,transparent:!0,opacity:g,blending:t.AdditiveBlending,depthWrite:!1,depthTest:!1}));return W.scale.set(m,m,1),z.add(W),W},P=G([[0,"rgba(0,0,0,0)"],[.55,"rgba(255,130,40,.08)"],[.75,"rgba(120,80,220,.12)"],[1,"rgba(0,0,0,0)"]]),D=G([[0,"rgba(0,0,0,0)"],[.6,"rgba(80,60,180,.06)"],[.85,"rgba(198,255,60,.05)"],[1,"rgba(0,0,0,0)"]]),x=j(10,P,.48),O=j(17,D,.24),B=[{r:2.2,sz:.3,spd:.26,phase:.3,tilt:.03,surf:Ft,atmo:[.55,.9,.22],atmoI:.55},{r:3.05,sz:.4,spd:.19,phase:1.6,tilt:-.05,surf:_t,atmo:[.18,.88,.9],atmoI:.48},{r:3.88,sz:.28,spd:.15,phase:3,tilt:.04,surf:Rt,atmo:[.92,.28,.2],atmoI:.38},{r:4.92,sz:.55,spd:.11,phase:4.7,tilt:-.03,surf:Gt,atmo:[.88,.68,.35],atmoI:.42,rings:!0},{r:6.08,sz:.34,spd:.09,phase:5.9,tilt:.05,surf:He,atmo:[.72,.7,.66],atmoI:.22},{r:7.12,sz:.22,spd:.07,phase:1.2,tilt:-.04,surf:Dt,atmo:[.78,1,.28],atmoI:.5,future:!0}],$=new t.Vector3,te=[];B.forEach(m=>{const k=new t.Mesh(new t.RingGeometry(m.r-.005,m.r+.005,160),new t.MeshBasicMaterial({color:16777215,transparent:!0,opacity:m.future?.04:.07,side:t.DoubleSide,depthWrite:!1}));k.rotation.x=Math.PI/2+m.tilt,b.add(k);const g=m.rings?64:56,W=new t.ShaderMaterial({uniforms:{uTime:{value:0},uSunPos:{value:new t.Vector3},uAtmo:{value:new t.Color(...m.atmo)}},vertexShader:Oe,fragmentShader:Ve(m.surf)}),E=new t.Mesh(new t.SphereGeometry(m.sz,g,Math.round(g*.65)),W);b.add(E);const Q=new t.ShaderMaterial({side:t.FrontSide,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,uniforms:{uSunPos:{value:new t.Vector3},uColor:{value:new t.Color(...m.atmo)},uIntensity:{value:m.future?.28:m.atmoI}},vertexShader:Et,fragmentShader:Wt}),H=new t.Mesh(new t.SphereGeometry(m.sz*1.12,32,22),Q);b.add(H);let Z=null;if(m.rings){const de=m.sz*1.55,he=m.sz*2.72;Z=new t.Mesh(new t.RingGeometry(de,he,140,1),new t.ShaderMaterial({side:t.DoubleSide,transparent:!0,depthWrite:!1,uniforms:{uInner:{value:de},uOuter:{value:he},uSunPos:{value:new t.Vector3}},vertexShader:"varying vec3 vLP;varying vec3 vWP;void main(){vLP=position;vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}",fragmentShader:Bt})),Z.rotation.x=-Math.PI/2+.2,Z.rotation.z=.1,b.add(Z)}te.push({mesh:E,pMat:W,atmo:H,atmoMat:Q,ring:Z,def:m})});const ce=G([[0,"rgba(225,250,255,1)"],[.25,"rgba(150,210,255,.6)"],[.6,"rgba(80,140,255,.12)"],[1,"rgba(0,0,0,0)"]]),q=new t.Sprite(new t.SpriteMaterial({map:ce,transparent:!0,opacity:.95,blending:t.AdditiveBlending,depthWrite:!1}));q.scale.set(.55,.55,1),b.add(q);const K=64,_=new Float32Array(K*3),v=new Float32Array(K);for(let m=0;m<K;m++)v[m]=m/K;const d=new t.BufferGeometry;d.setAttribute("position",new t.BufferAttribute(_,3).setUsage(t.DynamicDrawUsage)),d.setAttribute("age",new t.BufferAttribute(v,1));const p=new t.ShaderMaterial({vertexShader:"attribute float age;varying float vA;void main(){vA=1.-age;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=(1.-age)*(95./-mv.z)+1.5;gl_Position=projectionMatrix*mv;}",fragmentShader:"varying float vA;void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.1,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(mix(vec3(.35,.55,1.),vec3(.85,.95,1.),vA),a*vA*.6);}",transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}),y=new t.Points(d,p);b.add(y);let f=Math.random()*Math.PI*2;const A=3.4,L=.62,R=new t.Vector3,Y=new t.ShaderMaterial({uniforms:{uTime:{value:0},uSunPos:{value:new t.Vector3},uAtmo:{value:new t.Color(.7,.7,.66)}},vertexShader:Oe,fragmentShader:Ve(He)}),U=new t.Mesh(new t.SphereGeometry(.085,26,18),Y);b.add(U);let J=0,Te=0,pe=0,ve=0,ke=0;const Le=m=>{J=m.clientX/innerWidth-.5,Te=m.clientY/innerHeight-.5},Ee=()=>{ke=Math.min(window.scrollY/innerHeight,1.2)};addEventListener("pointermove",Le,{passive:!0}),addEventListener("scroll",Ee,{passive:!0});const fe=()=>{const m=a.parentElement;if(!m)return;const k=m.clientWidth,g=m.clientHeight;n.setSize(k,g,!1),s.setSize(k,g),r.aspect=k/g,r.updateProjectionMatrix()};fe(),addEventListener("resize",fe);const We=performance.now();let xe=We,ge=0,we=!1,le=0,Fe=!1;const _e=()=>{if(!we)return;ge=requestAnimationFrame(_e);const m=performance.now(),k=Math.min((m-xe)/1e3,1/20);xe=m;const g=(m-We)/1e3;pe+=(J-pe)*.05,ve+=(Te-ve)*.05,le+=(ke-le)*.06;const W=1-Math.pow(1-Math.min(1,g/2.8),3);r.position.set(0,1.8+(1-W)*1.7,11+(1-W)*4.6),r.lookAt(0,0,0),b.rotation.y=g*.028+pe*.26-(1-W)*.65,b.rotation.x=-.55+ve*.09-le*.16,b.position.y=-le*.7,I.uniforms.uTime.value=g,C.rotation.y=g*.07,C.scale.setScalar(1+Math.sin(g*.9)*.018),x.material.opacity=.46+Math.sin(g*1.1)*.04,O.material.opacity=.22+Math.sin(g*.7+1.2)*.04,x.material.rotation=g*.02,O.material.rotation=-g*.015,z.getWorldPosition($),T.rotation.y=g*.003,M.uniforms.uTime.value=g;const E=A/(1+L*Math.cos(f));f+=k*1.35/(E*E),R.set(Math.cos(f)*E,Math.sin(f)*E*.16,Math.sin(f)*E),q.position.copy(R);const Q=.3+1.1/E;if(q.scale.set(Q,Q,1),Fe){for(let F=K-1;F>0;F--)_[F*3]=_[(F-1)*3],_[F*3+1]=_[(F-1)*3+1],_[F*3+2]=_[(F-1)*3+2];_[0]=R.x,_[1]=R.y,_[2]=R.z}else{Fe=!0;for(let F=0;F<K;F++)_[F*3]=R.x,_[F*3+1]=R.y,_[F*3+2]=R.z}d.attributes.position.needsUpdate=!0;const H=B[3],Z=H.phase+g*H.spd,de=Math.cos(Z)*H.r,he=Math.sin(Z*.55+H.tilt*4)*.22,Ze=Math.sin(Z)*H.r,ye=g*.85;U.position.set(de+Math.cos(ye)*1.18,he+Math.sin(ye)*.26,Ze+Math.sin(ye)*1.18),U.rotation.y=g*.3,Y.uniforms.uTime.value=g,Y.uniforms.uSunPos.value.copy($);for(const{mesh:F,pMat:De,atmo:Xe,atmoMat:qe,ring:Me,def:re}of te){const je=re.phase+g*re.spd,be=Math.cos(je)*re.r,Se=Math.sin(je*.55+re.tilt*4)*.22,Ne=Math.sin(je)*re.r;F.position.set(be,Se,Ne),F.rotation.y+=k*.18,De.uniforms.uTime.value=g,De.uniforms.uSunPos.value.copy($),Xe.position.set(be,Se,Ne),qe.uniforms.uSunPos.value.copy($),Me&&(Me.position.set(be,Se,Ne),Me.material.uniforms.uSunPos.value.copy($))}s.render()},Re=m=>{m!==we&&(we=m,m?(xe=performance.now(),ge=requestAnimationFrame(_e)):cancelAnimationFrame(ge))},Ge=new IntersectionObserver(([m])=>Re(m.isIntersecting),{rootMargin:"25% 0px"});return Ge.observe(a),()=>{Ge.disconnect(),Re(!1),removeEventListener("pointermove",Le),removeEventListener("scroll",Ee),removeEventListener("resize",fe),s.dispose(),n.dispose()}}function Vt(){const a=u.useRef(null);return u.useEffect(()=>{if(a.current)return Ot(a.current)},[]),e.jsx("canvas",{ref:a,style:{position:"absolute",inset:0,zIndex:0,display:"block",width:"100%",height:"100%"}})}function Ht({onCTA:a}){const[t,n]=u.useState(!1);return u.useEffect(()=>{const s=setTimeout(()=>n(!0),80);return()=>clearTimeout(s)},[]),e.jsxs("section",{className:`hero${t?" revealed":""}`,id:"top",children:[e.jsx(Vt,{}),e.jsxs("div",{className:"hero-chips","aria-hidden":"true",children:[e.jsxs("span",{className:"chip c1",children:[e.jsx("span",{className:"chip-dot"}),e.jsx("span",{children:"KI aktiv"})]}),e.jsxs("span",{className:"chip c2",children:[e.jsx("span",{className:"chip-dot"}),e.jsx("span",{children:"47 Mails sortiert"})]}),e.jsxs("span",{className:"chip c3",children:[e.jsx("span",{className:"chip-dot"}),e.jsx("span",{children:"Rechnung gebucht"})]}),e.jsxs("span",{className:"chip c4",children:[e.jsx("span",{className:"chip-dot"}),e.jsx("span",{children:"Dienstplan aktualisiert"})]})]}),e.jsxs("div",{className:"wrap hero-inner",children:[e.jsx("span",{className:"eyebrow hero-eyebrow",children:"KI-Betriebssystem für Unternehmen"}),e.jsxs("h1",{"aria-label":"Intelligenz, die mitarbeitet.",children:[e.jsx("span",{className:"word",children:e.jsx("span",{children:"Intelligenz,"})}),e.jsx("br",{}),e.jsx("span",{className:"word",children:e.jsx("span",{children:"die "})}),e.jsx("span",{className:"word",children:e.jsx("span",{children:e.jsx("em",{children:"mit­arbeitet."})})})]}),e.jsxs("p",{className:"lead",children:["NILL verbindet ",e.jsx("strong",{style:{color:"var(--ink)",fontWeight:500},children:"Postfach, Buchhaltung, Inventur, Zeiterfassung"})," und ",e.jsx("strong",{style:{color:"var(--ink)",fontWeight:500},children:"Teamverwaltung"})," zu einem einzigen System — gesteuert von einer KI, die Arbeit erkennt, entscheidet und erledigt."]}),e.jsxs("div",{className:"hero-cta",children:[e.jsxs(X,{className:"btn btn-primary",href:"/register",children:[e.jsx("span",{children:"Kostenlos registrieren"}),e.jsx("span",{className:"arrow",children:"→"})]}),e.jsxs(X,{className:"btn btn-ghost",href:"/login",children:[e.jsx("span",{children:"Login"}),e.jsx("span",{className:"arrow",children:"→"})]}),e.jsxs(X,{className:"btn btn-ghost",onClick:s=>{s.preventDefault(),a("Demo")},href:"#",children:[e.jsx("span",{children:"Live-Demo"}),e.jsx("span",{className:"arrow",children:"↓"})]})]}),e.jsxs("p",{className:"hero-trial-note",style:{marginTop:16,fontSize:13,lineHeight:1.5,color:"rgba(239,237,231,.5)",letterSpacing:".01em"},children:[e.jsx("span",{style:{color:"var(--accent)",fontWeight:500},children:"14 Tage kostenlos"})," testen — keine Kreditkarte nötig."]})]}),e.jsxs("div",{className:"hero-meta",children:[e.jsx("span",{children:"NILL · KI-Betriebssystem"}),e.jsxs("div",{className:"scroll-ind",children:[e.jsx("span",{children:"scroll"}),e.jsx("div",{className:"scroll-bar"})]}),e.jsx("span",{children:"DE · Made in Germany"})]})]})}function $t(){const a=e.jsxs(e.Fragment,{children:["Postfach ",e.jsx("em",{children:"·"})," Buchhaltung ",e.jsx("span",{className:"ticker-sep"})," Inventur ",e.jsx("em",{children:"·"})," Zeiterfassung ",e.jsx("span",{className:"ticker-sep"})," Team­verwaltung ",e.jsx("em",{children:"·"})," Sekretärin ",e.jsx("span",{className:"ticker-sep"})," ",e.jsx("em",{children:"Ein Login."})," ",e.jsx("span",{className:"ticker-sep"}),"Postfach ",e.jsx("em",{children:"·"})," Buchhaltung ",e.jsx("span",{className:"ticker-sep"})," Inventur ",e.jsx("em",{children:"·"})," Zeiterfassung ",e.jsx("span",{className:"ticker-sep"})," Team­verwaltung ",e.jsx("em",{children:"·"})," Sekretärin ",e.jsx("span",{className:"ticker-sep"})," ",e.jsx("em",{children:"Ein Login."})," ",e.jsx("span",{className:"ticker-sep"})]});return e.jsx("div",{className:"ticker",children:e.jsx("div",{className:"ticker-track","aria-hidden":"true",children:e.jsx("span",{children:a})})})}function Kt({onCTA:a}){const[t,n]=ae();return e.jsx("section",{id:"produkte",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:`section-head reveal${n?" in":""}`,ref:t,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Module — 05 live · 01 in Entwicklung"}),e.jsxs("h2",{children:["Sechs Module. ",e.jsx("br",{}),e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)",fontFamily:"var(--serif)",fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'},children:"Eine"})," Intelligenz."]})]}),e.jsx("p",{className:"lead",children:"Jedes Modul steht für sich — doch gemeinsam werden sie zu einem Gehirn, das dein Unternehmen versteht."})]}),e.jsxs(Ce,{stagger:!0,className:"bento",children:[e.jsxs(se,{className:"k1",children:[e.jsx("div",{className:"viz","aria-hidden":"true",children:e.jsxs("svg",{viewBox:"0 0 600 380",preserveAspectRatio:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"mg",x1:"0",y1:"0",x2:"1",y2:"1",children:[e.jsx("stop",{offset:"0",stopColor:"#c6ff3c",stopOpacity:".25"}),e.jsx("stop",{offset:"1",stopColor:"#c6ff3c",stopOpacity:"0"})]})}),e.jsx("g",{transform:"translate(260,40)",opacity:".8",children:[0,60,120,180].map((s,o)=>e.jsxs("g",{className:"mail-row",transform:`translate(0,${s})`,children:[e.jsx("rect",{width:"300",height:"48",rx:"8",fill:o===0?"url(#mg)":"rgba(255,255,255,.03)",stroke:"rgba(255,255,255,.08)"}),e.jsx("circle",{cx:"22",cy:"24",r:"6",fill:["#c6ff3c","#7a5cff","#38f5d0","#ff4d8d"][o]}),e.jsx("rect",{x:"42",y:"16",width:[120,100,140,80][o],height:"6",rx:"3",fill:"rgba(255,255,255,.6)"}),e.jsx("rect",{x:"42",y:"28",width:[200,180,160,220][o],height:"4",rx:"2",fill:"rgba(255,255,255,.2)"})]},s))})]})}),e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"01"})," · Postfach"]}),e.jsxs("h3",{children:["E-Mails, die sich ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"selbst beantworten."})]}),e.jsx("p",{children:"Kategorisieren, priorisieren, Antworten schreiben — NILL liest mit und arbeitet voraus."})]})]}),e.jsxs(se,{className:"k2",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"02"})," · Buchhaltung"]}),e.jsxs("h3",{children:["Belege buchen. ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"Ohne dich."})]}),e.jsx("p",{children:"Rechnungen per Mail, Scan oder Foto — NILL erkennt, kontiert, verbucht und bereitet auf."})]}),e.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap",fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)"},children:["DATEV-ready","OCR","GoBD-konform"].map(s=>e.jsx("span",{style:{padding:"6px 10px",border:"1px solid var(--line)",borderRadius:99},children:s},s))})]}),e.jsx(se,{className:"k3",children:e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"03"})," · Inventur"]}),e.jsxs("h3",{children:["Bestände, die sich ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"selbst zählen."})]}),e.jsx("p",{children:"Automatische Fortschreibung, Meldegrenzen mit Benachrichtigung."})]})}),e.jsxs(se,{className:"k4",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"04"})," · Zeiterfassung"]}),e.jsxs("h3",{children:["Zeit erfasst sich ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"per Klick."})]}),e.jsx("p",{children:"Per App oder Browser. NILL weist Projekte zu und berechnet Überstunden."})]}),e.jsxs("div",{style:{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)",display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{children:"EuGH-konform"}),e.jsx("span",{children:"GPS-optional"})]})]}),e.jsxs(se,{className:"k5",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"05"})," · Team­verwaltung"]}),e.jsxs("h3",{children:["Das Team im ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"Autopilot."})]}),e.jsx("p",{children:"Urlaub, Krankmeldungen, Dienstpläne, Onboarding — vorbereitet von der KI."})]}),e.jsx("div",{style:{display:"flex"},children:["MK","LS","JH","+9"].map((s,o)=>e.jsx("span",{className:"avatar",style:{width:28,height:28,fontSize:10,marginLeft:o?-10:0,background:o?["linear-gradient(135deg,var(--accent),var(--accent-4))","linear-gradient(135deg,var(--accent-3),var(--accent-2))","linear-gradient(135deg,var(--accent-4),var(--accent-3))"][o-1]:void 0},children:s},s))})]}),e.jsxs(se,{className:"k6",style:{background:"linear-gradient(90deg,#0c0c10,#12130c)",borderColor:"rgba(198,255,60,.2)"},children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"06"})," · KI Sekretärin"]}),e.jsxs("h3",{children:["Nimmt Anrufe entgegen. ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"Rund um die Uhr."})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:14},children:[e.jsx("span",{className:"badge",children:"In Bearbeitung — Q3 / 2026"}),e.jsxs(X,{className:"btn btn-ghost",style:{padding:"10px 18px"},onClick:s=>{s.preventDefault(),a("Frühzugang")},href:"#",children:[e.jsx("span",{children:"Frühzugang sichern"}),e.jsx("span",{className:"arrow",children:"→"})]})]})]})]})]})})}function Pe({id:a,eyebrow:t,title:n,lead:s,to:o}){const[r,i]=ae();return e.jsx("section",{id:a,children:e.jsx("div",{className:"wrap",children:e.jsxs("div",{className:`section-head reveal${i?" in":""}`,ref:r,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:t}),e.jsx("h2",{dangerouslySetInnerHTML:{__html:n}})]}),e.jsxs("div",{children:[e.jsx("p",{className:"lead",children:s}),e.jsxs(X,{className:"btn btn-primary",to:o,style:{marginTop:26},children:[e.jsx("span",{children:"Mehr erfahren"}),e.jsx("span",{className:"arrow",children:"→"})]})]})]})})})}function Yt(){const[a,t]=ae(),n=u.useRef(null),[s,o]=u.useState(0);return u.useEffect(()=>{if(!t||!n.current)return;const r=performance.now(),i=h=>{const l=Math.min(1,(h-r)/1600);o(Math.round((1-Math.pow(1-l,3))*87)),l<1&&requestAnimationFrame(i)};requestAnimationFrame(i)},[t]),e.jsx("section",{style:{padding:"40px 0 120px"},children:e.jsx("div",{className:"wrap",children:e.jsxs("div",{className:`stats stagger${t?" in":""}`,ref:a,children:[e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"3,5"}),e.jsx("span",{children:"×"})]}),e.jsx("div",{className:"label",children:"Schneller im Alltag"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("span",{ref:n,children:s}),e.jsx("em",{children:"%"})]}),e.jsx("div",{className:"label",children:"Weniger manuelle Arbeit"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"24"}),e.jsx("span",{children:"/"}),e.jsx("em",{children:"7"})]}),e.jsx("div",{className:"label",children:"KI im Einsatz"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"05"}),e.jsx("span",{children:"·"}),e.jsx("em",{children:"01"})]}),e.jsx("div",{className:"label",children:"Module live · Ein Login"})]})]})})})}const Ut=[{tier:"Solo",sub:"Für Einzelunternehmer & kleine Büros",price:"25",per:"€ / Monat · 1–2 Nutzer",items:["E-Mail, Kalender & Buchhaltung","OCR-Belegerfassung & DATEV-ready","Rechnungserstellung & PDF-Export","KI-Kategorisierung & Vorschläge","E-Mail-Support"],pop:!1},{tier:"Team",sub:"Für wachsende Teams & KMUs",price:"50",per:"€ / Monat · bis 10 Nutzer",items:["Alles aus Solo — für bis zu 10 Nutzer","Lohnbuchhaltung & HR-Verwaltung","Arbeitszeiterfassung & Stempeluhr","Urlaubs- & Abwesenheitsverwaltung","Priority-Support"],pop:!0},{tier:"Business",sub:"Für größere Unternehmen",price:"90",per:"€ / Monat · 10+ Nutzer",items:["Alles aus Team — unbegrenzte Nutzer","API-Zugang & Webhooks (folgt Q4 2026)","Erweiterte KI-Automatisierungen","Priorisierter Support mit SLA-Garantie"],pop:!1}];function Zt({tier:a,sub:t,price:n,per:s,items:o,pop:r}){const i=u.useRef(null);return Ue(i),e.jsxs("article",{ref:i,className:`price${r?" pop":""}`,children:[r&&e.jsx("span",{className:"pop-chip",children:"Meistgewählt"}),e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",style:r?{color:"var(--accent)"}:{},children:a}),e.jsx("h3",{style:{marginTop:12},children:t})]}),e.jsxs("div",{className:"price-tag",children:[e.jsx("span",{className:"num",style:n.length>3?{fontSize:52}:{},children:n}),s&&e.jsx("span",{className:"per",children:s})]}),e.jsx("ul",{children:o.map(h=>e.jsx("li",{children:h},h))}),e.jsxs(X,{className:`btn ${r?"btn-primary":"btn-ghost"}`,href:"/pricing",children:[e.jsx("span",{children:"Mehr Erfahren"}),e.jsx("span",{className:"arrow",children:"→"})]})]})}function Xt({onCTA:a}){const[t,n]=ae();return e.jsx("section",{id:"preise",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:`section-head reveal${n?" in":""}`,ref:t,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Preise — einfach gehalten"}),e.jsxs("h2",{children:["Eins. Zwei. ",e.jsx("br",{}),e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)",fontFamily:"var(--serif)",fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'},children:"Drei."})]})]}),e.jsx("p",{className:"lead",children:"Transparent. Ohne versteckte Kosten. Monatlich kündbar."})]}),e.jsx(Ce,{stagger:!0,className:"pricing-grid",children:Ut.map(s=>e.jsx(Zt,{...s},s.tier))})]})})}function qt(){const[a,t]=ae(),n=[["Wo werden meine Daten gespeichert?","Alle Daten liegen verschlüsselt auf Servern in Deutschland (Frankfurt). Wir sind nach DSGVO geprüft und bieten auf Wunsch eine Private-Cloud-Instanz."],["Ersetzt NILL meinen Steuerberater?","Nein — NILL bereitet alles so auf, dass dein Steuerberater deutlich weniger Zeit braucht. DATEV-ready Export sorgt für reibungslose Übergabe."],["Wie lange dauert das Onboarding?","Die meisten Teams sind in 48 Stunden produktiv. Wir unterstützen bei der Einrichtung deiner E-Mail-Konten und Module."],["Was passiert, wenn die KI einen Fehler macht?",'Jede automatische Aktion ist standardmäßig im "Vorschlags-Modus". Du entscheidest, was direkt geht, was freigegeben werden muss, und was dokumentiert wird.'],["Wie nachhaltig ist NILL wirklich?","Unsere Kern-Infrastruktur läuft auf 100 % Ökostrom in Frankfurt. Drittanbieter kompensieren wir zu 105 % über Gold-Standard-Projekte. Jährlicher Nachhaltigkeitsbericht auf Anfrage."]];return e.jsx("section",{id:"faq",children:e.jsxs("div",{className:"wrap-tight",children:[e.jsx("div",{className:`section-head reveal${t?" in":""}`,ref:a,style:{marginBottom:40},children:e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Antworten auf das Naheliegende"}),e.jsx("h2",{children:"FAQ."})]})}),e.jsx(Ce,{stagger:!0,className:"faq",children:n.map(([s,o])=>e.jsxs("details",{children:[e.jsx("summary",{children:s}),e.jsx("p",{className:"a",children:o})]},s))})]})})}function Jt({onCTA:a}){const[t,n]=ae();return e.jsx("section",{id:"cta",className:"cta-big",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("h2",{className:`reveal${n?" in":""}`,ref:t,children:["Lass deine KI ",e.jsx("br",{}),e.jsx("em",{children:"anfangen"}),e.jsx("br",{}),"zu arbeiten."]}),e.jsxs("div",{className:`cta-sub reveal reveal-delay-1${n?" in":""}`,children:[e.jsx("p",{className:"lead",children:"30 Minuten Live-Demo mit einem unserer Produktspezialisten. Wir zeigen dir direkt an deinem Use-Case, wie NILL arbeitet."}),e.jsxs("div",{style:{display:"flex",gap:12,flexWrap:"wrap"},children:[e.jsxs(X,{className:"btn btn-primary",onClick:s=>{s.preventDefault(),a("Termin")},href:"#",children:[e.jsx("span",{children:"Termin buchen"}),e.jsx("span",{className:"arrow",children:"→"})]}),e.jsxs(X,{className:"btn btn-ghost",href:"#produkte",children:[e.jsx("span",{children:"Module"}),e.jsx("span",{className:"arrow",children:"↑"})]})]})]})]})})}function rs(){kt();const[a,t]=u.useState(null),n=u.useCallback(o=>t(o||"default"),[]),s=u.useCallback(()=>t(null),[]);return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"vignette","aria-hidden":"true"}),e.jsx(Lt,{}),e.jsx(lt,{}),e.jsx(Ht,{onCTA:n}),e.jsx(Tt,{}),e.jsx($t,{}),e.jsx(Kt,{onCTA:n}),e.jsx(Pe,{id:"wie",eyebrow:"Wie es arbeitet — 05 Schritte",title:'Ein Tag, von der <em style="font-style:italic;color:var(--accent);font-family:var(--serif)">KI</em> geführt.',lead:"Von der ersten Mail um 07:48 bis zum neuen Dienstplan um 16:48 — sieh Schritt für Schritt, wie NILL einen kompletten Arbeitstag durch alle Module begleitet.",to:"/wie-es-arbeitet"}),e.jsx(Yt,{}),e.jsx(Xt,{onCTA:n}),e.jsx(Pe,{id:"app",eyebrow:"Progressive Web App · ohne App Store",title:'NILL als App. <em style="font-style:italic;color:var(--accent)">Ohne Store.</em>',lead:"Direkt aus dem Browser installiert — auf iOS, Android, macOS und Windows. Offline-fähig, mit Push-Benachrichtigungen und ohne Update-Zwang.",to:"/app"}),e.jsx(Pe,{id:"nachhaltigkeit",eyebrow:"Nachhaltigkeit",title:'Intelligenz mit <em style="font-style:italic;color:var(--accent)">Verantwortung.</em>',lead:"100 % Ökostrom in Frankfurt, kompensierte Drittanbieter und ein jährlicher Nachhaltigkeitsbericht. Wie NILL Effizienz und Klimaschutz zusammenbringt.",to:"/nachhaltigkeit"}),e.jsx(qt,{}),e.jsx(Jt,{onCTA:n}),e.jsx(dt,{}),e.jsx(ht,{intent:a,onClose:s})]})}export{rs as default};
