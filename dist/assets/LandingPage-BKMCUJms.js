import{a as h,j as e}from"./vendor-react--hPKs4bs.js";import{u as se,T as $e,C as oe,R as qe,a as Qe,A as Je,S as et,F as tt,B as Ke,b as ee,c as he,d as ve,V as Ae,e as nt,f as st,g as at,E as it,h as rt,U as ot}from"./vendor-three-CSoBu3Eo.js";import{L as ct,F as lt,M as dt,a as X,u as ae,R as Ie}from"./chrome-D1LhQF26.js";/* empty css                */import"./vendor-misc-xcvkua7f.js";import"./vendor-router-B9EJrQcr.js";function mt(){const s=document.createElement("canvas");s.width=1024,s.height=512;const n=s.getContext("2d");n.fillStyle="#d4d6dc",n.fillRect(0,0,1024,512);for(let i=0;i<2400;i++)n.fillStyle=`rgba(${100+(Math.random()*40|0)},${100+(Math.random()*40|0)},${110+(Math.random()*40|0)},${.08+Math.random()*.12})`,n.fillRect(Math.random()*1024,Math.random()*512,1+Math.random()*3,1);n.strokeStyle="rgba(20,22,28,.55)",n.lineWidth=1.2;for(let i=0;i<1024;i+=64)n.beginPath(),n.moveTo(i,0),n.lineTo(i,512),n.stroke();for(let i=0;i<512;i+=64)n.beginPath(),n.moveTo(0,i),n.lineTo(1024,i),n.stroke();n.fillStyle="rgba(40,44,52,.7)";for(let i=8;i<1024;i+=32)for(let o=8;o<512;o+=32)n.fillRect(i,o,1.5,1.5);for(let i=0;i<14;i++){const o=Math.random()*844,v=Math.random()*422,l=80+Math.random()*100,c=40+Math.random()*60;n.strokeStyle="rgba(15,17,22,.7)",n.lineWidth=2,n.strokeRect(o,v,l,c),n.fillStyle="rgba(50,55,65,.18)",n.fillRect(o,v,l,c)}for(let i=0;i<60;i++)n.fillStyle=`rgba(${30+(Math.random()*40|0)},${28+(Math.random()*30|0)},${28+(Math.random()*30|0)},${.15+Math.random()*.25})`,n.fillRect(Math.random()*1024,Math.random()*512,30+Math.random()*120,1+Math.random()*3);n.fillStyle="rgba(220,200,40,.55)",n.font="bold 14px monospace",["CAUTION","HATCH-A4","MOD-7","EXT-VENT","HIGH-V","NILL-OS"].forEach((i,o)=>n.fillText(i,60+o*160,40+o%2*220));const r=new oe(s);return r.wrapS=r.wrapT=qe,r.anisotropy=8,r}function ht(){const s=document.createElement("canvas");s.width=512,s.height=256;const n=s.getContext("2d"),r=n.createLinearGradient(0,0,512,256);r.addColorStop(0,"#0a1840"),r.addColorStop(.5,"#1a3878"),r.addColorStop(1,"#0a1d54"),n.fillStyle=r,n.fillRect(0,0,512,256);const i=32,o=32;for(let l=0;l<512;l+=i)for(let c=0;c<256;c+=o){const y=.8+Math.random()*.3;n.fillStyle=`rgba(${30*y|0},${60*y|0},${140*y|0},.95)`,n.fillRect(l+1,c+1,i-2,o-2);const S=n.createLinearGradient(l,c,l+i,c+o);S.addColorStop(0,"rgba(120,180,255,.18)"),S.addColorStop(.5,"rgba(255,255,255,.05)"),S.addColorStop(1,"rgba(20,40,90,.2)"),n.fillStyle=S,n.fillRect(l+1,c+1,i-2,o-2),n.fillStyle="rgba(180,190,210,.4)",n.fillRect(l+i/2-.5,c+1,1,o-2)}n.strokeStyle="rgba(8,12,28,.85)",n.lineWidth=1;for(let l=0;l<=512;l+=i)n.beginPath(),n.moveTo(l,0),n.lineTo(l,256),n.stroke();for(let l=0;l<=256;l+=o)n.beginPath(),n.moveTo(0,l),n.lineTo(512,l),n.stroke();const v=new oe(s);return v.anisotropy=8,v}function vt(){const a=document.createElement("canvas");a.width=a.height=128;const t=a.getContext("2d"),s=t.createRadialGradient(64,64,0,64,64,64);return s.addColorStop(0,"rgba(255,255,255,1)"),s.addColorStop(.3,"rgba(255,255,255,.5)"),s.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=s,t.fillRect(0,0,128,128),new oe(a)}function ut(){const a=document.createElement("canvas");a.width=512,a.height=64;const t=a.getContext("2d");t.fillStyle="#181a20",t.fillRect(0,0,512,64);for(let s=0;s<24;s++){const n=20+s*20,r=t.createRadialGradient(n+6,32,0,n+6,32,12);r.addColorStop(0,"rgba(255,240,200,1)"),r.addColorStop(.4,"rgba(180,220,255,.85)"),r.addColorStop(1,"rgba(40,80,160,0)"),t.fillStyle=r,t.fillRect(n-6,16,24,32),t.strokeStyle="#2a2d35",t.lineWidth=2,t.strokeRect(n,22,12,20)}return new oe(a)}function pt(a){const t=$e,s=mt(),n=ht(),r=vt(),i=ut(),o=new t.MeshStandardMaterial({map:s,color:16777215,metalness:.65,roughness:.42}),v=new t.MeshStandardMaterial({map:s,color:10133680,metalness:.7,roughness:.5}),l=new t.MeshStandardMaterial({color:13041468,emissive:7178772,emissiveIntensity:.9,metalness:.5,roughness:.35}),c=new t.MeshStandardMaterial({color:1842982,metalness:.75,roughness:.55}),y=new t.MeshStandardMaterial({color:13148234,metalness:.85,roughness:.25,emissive:3811848,emissiveIntensity:.15}),S=new t.MeshStandardMaterial({map:n,metalness:.7,roughness:.35,emissive:661560,emissiveIntensity:.18,side:t.DoubleSide}),N=new t.MeshBasicMaterial({map:i,transparent:!0,opacity:.95}),j=new t.Group;a.add(j),[-1,0,1].forEach((p,d)=>{const u=new t.Mesh(new t.CylinderGeometry(.88,.88,.92,32),o);if(u.rotation.z=Math.PI/2,u.position.x=p*1,j.add(u),d<2){const f=new t.Mesh(new t.CylinderGeometry(.94,.94,.12,32),y);f.rotation.z=Math.PI/2,f.position.x=p*1+.5,j.add(f)}const M=new t.Mesh(new t.CylinderGeometry(.881,.881,.22,32,1,!0),N);M.rotation.z=Math.PI/2,M.position.x=p*1,j.add(M)}),[-1.5,1.5].forEach(p=>{const d=new t.Mesh(new t.SphereGeometry(.88,32,16,0,Math.PI*2,0,Math.PI/2),o);d.rotation.z=p>0?-Math.PI/2:Math.PI/2,d.position.x=p,j.add(d)});const I=new t.Group;I.position.y=.82,I.add(new t.Mesh(new t.CylinderGeometry(.32,.38,.15,24),o));const x=new t.Mesh(new t.SphereGeometry(.3,24,16,0,Math.PI*2,0,Math.PI/2),new t.MeshStandardMaterial({color:4880568,metalness:.9,roughness:.08,emissive:3823736,emissiveIntensity:.45,transparent:!0,opacity:.88}));x.position.y=.075,I.add(x);for(let p=0;p<6;p++){const d=p/6*Math.PI*2,u=new t.Mesh(new t.BoxGeometry(.012,.3,.012),c);u.position.set(Math.cos(d)*.27,.075,Math.sin(d)*.27),u.rotation.y=-d,I.add(u)}j.add(I),[-2.55,2.55].forEach(p=>{const d=new t.Group;d.position.x=p;const u=new t.Mesh(new t.CylinderGeometry(.58,.58,1.5,24),o);u.rotation.z=Math.PI/2,d.add(u);const M=new t.Mesh(new t.SphereGeometry(.58,24,16,0,Math.PI*2,0,Math.PI/2),y);M.rotation.z=p>0?-Math.PI/2:Math.PI/2,M.position.x=p>0?.75:-.75,d.add(M);const f=new t.Mesh(new t.TorusGeometry(.58,.03,8,24),l);f.rotation.y=Math.PI/2,f.position.x=p>0?.75:-.75,d.add(f);const A=new t.Mesh(new t.CylinderGeometry(.581,.581,.18,24,1,!0),N);A.rotation.z=Math.PI/2,d.add(A);for(let Y=0;Y<8;Y++){const U=Y/8*Math.PI*2,Q=new t.Mesh(new t.BoxGeometry(.08,.04,.15),c);Q.position.set((Math.random()-.5)*1,Math.cos(U)*.6,Math.sin(U)*.6),Q.lookAt(Q.position.x,0,0),d.add(Q)}const L=new t.Mesh(new t.BoxGeometry(.4,.15,.12),c);L.position.set(0,-.62,0),d.add(L);const G=new t.Mesh(new t.CylinderGeometry(.04,.04,1.4,8),y);G.rotation.z=Math.PI/2,G.position.set(0,.58,.15),d.add(G),a.add(d)});const z=(p,d)=>{const u=new t.Group;u.position.x=p,[[-.13,-.13],[.13,-.13],[-.13,.13],[.13,.13]].forEach(([M,f])=>{const A=new t.Mesh(new t.CylinderGeometry(.018,.018,d,6),c);A.rotation.z=Math.PI/2,A.position.set(0,M,f),u.add(A)});for(let M=0;M<4;M++){const f=-d/2+(M+.5)*(d/4),A=new t.Mesh(new t.CylinderGeometry(.012,.012,.36,6),c);A.position.set(f,0,0),A.rotation.z=Math.PI/4,u.add(A);const L=new t.Mesh(new t.CylinderGeometry(.012,.012,.36,6),c);L.position.set(f,0,0),L.rotation.x=Math.PI/4,u.add(L)}return[-d/2,d/2].forEach(M=>{const f=new t.Mesh(new t.TorusGeometry(.18,.015,6,12),c);f.rotation.y=Math.PI/2,f.position.x=M,u.add(f)}),u};a.add(z(-1.7,.65)),a.add(z(1.7,.65));const C=[];[-1,1].forEach(p=>{const d=new t.Group,u=new t.Mesh(new t.CylinderGeometry(.13,.13,.35,12),v);u.position.y=p*.9,d.add(u);const M=new t.Mesh(new t.CylinderGeometry(.07,.07,1.7,10),v);M.position.y=p*1.95,d.add(M);const f=new t.Mesh(new t.SphereGeometry(.14,16,12),y);f.position.y=p*2.85,d.add(f),[-1,1].forEach(A=>{const L=new t.Group;L.position.set(A*2.4,p*2.85,0);const G=new t.Mesh(new t.PlaneGeometry(4.6,1.55,16,4),S);G.rotation.y=Math.PI/2*(A>0?1:-1),L.add(G);const Y=new t.Mesh(new t.BoxGeometry(.08,1.55,4.6),v);L.add(Y);const U=new t.Mesh(new t.BoxGeometry(.18,.25,.25),c);U.position.x=A>0?-2.3:2.3,L.add(U),d.add(L),C.push(L)}),a.add(d)}),[-1,1].forEach(p=>{const d=new t.Mesh(new t.PlaneGeometry(1.2,.9),new t.MeshStandardMaterial({color:15790312,metalness:.1,roughness:.8,side:t.DoubleSide,emissive:2105376,emissiveIntensity:.05}));d.position.set(p*1.7,0,.85),d.rotation.x=Math.PI/2,a.add(d);const u=new t.Mesh(new t.BoxGeometry(1.2,.04,.04),c);u.position.set(p*1.7,0,.85),a.add(u)});const T=new t.Group;T.position.set(.4,0,1);const H=new t.Mesh(new t.CylinderGeometry(.05,.05,.55,10),v);H.position.y=.27,T.add(H);const b=new t.Mesh(new t.SphereGeometry(.08,12,10),y);b.position.y=.55,T.add(b);const P=new t.Mesh(new t.SphereGeometry(.42,24,16,0,Math.PI*2,0,Math.PI/2.5),new t.MeshStandardMaterial({color:15658724,metalness:.4,roughness:.3,side:t.DoubleSide}));P.position.y=.65,P.rotation.x=-.4,T.add(P);const R=new t.Mesh(new t.ConeGeometry(.06,.18,10),c);R.position.set(0,.82,.15),R.rotation.x=Math.PI,T.add(R);for(let p=0;p<3;p++){const d=p/3*Math.PI*2,u=new t.Mesh(new t.CylinderGeometry(.006,.006,.25,6),c);u.position.set(Math.cos(d)*.12,.75,.08+Math.sin(d)*.12),u.rotation.x=.4,u.rotation.z=d,T.add(u)}a.add(T);const g=new t.Group;g.position.set(-.6,0,1);const B=new t.Mesh(new t.CylinderGeometry(.025,.025,.8,8),c);B.position.y=.4,g.add(B);const D=new t.Mesh(new t.SphereGeometry(.04,8,8),l);D.position.y=.82,g.add(D),a.add(g);const $=new t.Mesh(new t.CylinderGeometry(.32,.42,.48,24),v);$.position.set(0,-.85,.35),$.rotation.x=Math.PI/2,a.add($);const te=new t.Mesh(new t.TorusGeometry(.34,.04,10,24),l);te.position.set(0,-1.05,.35),te.rotation.x=Math.PI/2,a.add(te);for(let p=0;p<4;p++){const d=p/4*Math.PI*2+Math.PI/4,u=new t.Mesh(new t.CylinderGeometry(.022,.022,.15,6),c);u.position.set(Math.cos(d)*.36,-1.05,.35+Math.sin(d)*.36),u.rotation.z=-Math.PI/2,a.add(u)}[[3.2,0,0],[-3.2,0,0],[0,1,1],[0,-1,1]].forEach(([p,d,u])=>{const M=new t.Group;M.position.set(p,d,u);for(let f=0;f<4;f++){const A=f/4*Math.PI*2,L=new t.Mesh(new t.ConeGeometry(.04,.12,8),c);L.position.set(Math.cos(A)*.08,Math.sin(A)*.08,0),L.rotation.x=Math.PI/2,M.add(L)}a.add(M)});const ce=[];[[0,-2.9,.15],[0,-2.9,-.15],[0,-1.1,.35],[0,-1.1,-.05],[-3.2,0,0],[3.2,0,0]].forEach(([p,d,u])=>{const M=new t.Sprite(new t.SpriteMaterial({map:r,color:6336767,transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));M.scale.set(2.8,2.8,1),M.position.set(p,d,u),a.add(M);const f=new t.Sprite(new t.SpriteMaterial({map:r,color:15267071,transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));f.scale.set(.7,.7,1),f.position.set(p,d,u),a.add(f),ce.push({outer:M,inner:f})});const q=[];[[3.4,0,0,16724048],[-3.4,0,0,13041468],[0,2.95,1.2,16777215],[0,-2.95,1.2,16777215],[0,0,1.4,16747068],[0,0,-1.4,6741503]].forEach(([p,d,u,M])=>{const f=new t.Mesh(new t.SphereGeometry(.05,10,10),new t.MeshBasicMaterial({color:M,transparent:!0}));f.position.set(p,d,u);const A=new t.Sprite(new t.SpriteMaterial({map:r,color:M,transparent:!0,opacity:.6,blending:t.AdditiveBlending,depthWrite:!1}));A.scale.set(.4,.4,1),f.add(A),a.add(f),q.push({mesh:f,halo:A})});const K=[new t.Vector3(0,.82,.2),new t.Vector3(-2.4,2.85,0),new t.Vector3(.4,.65,1)],_=K.map((p,d)=>{const u=new t.Sprite(new t.SpriteMaterial({map:r,color:[13041468,3732944,8019199][d],transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));return u.scale.set(3.5,3.5,1),u.position.copy(p),a.add(u),u});return{thrusterGlows:ce,navLights:q,focusHalos:_,FOCUS_ANCHORS:K,solarWings:C,dishGroup:T}}const ft=h.forwardRef(function({thrusterProxy:t,focusProxy:s},n){const r=h.useRef(),i=h.useRef(null);return h.useImperativeHandle(n,()=>r.current,[]),h.useEffect(()=>{if(!r.current)return;const o=pt(r.current);return i.current=o,()=>{i.current=null}},[]),se(({clock:o})=>{if(!i.current)return;const v=o.elapsedTime,l=(t==null?void 0:t.intensity)??0,c=(s==null?void 0:s.value)??-1,{thrusterGlows:y,navLights:S,focusHalos:N,solarWings:j,dishGroup:I}=i.current;j.forEach((x,z)=>{x.rotation.z=Math.sin(v*.06+z*1.4)*.22}),I.rotation.y=Math.sin(v*.05)*.3,I.rotation.x=Math.sin(v*.041+.7)*.08,y.forEach(({outer:x,inner:z},C)=>{const T=Math.sin(v*9+C*.8)*.5+.5;x.material.opacity=l*(.18+T*.07),z.material.opacity=l*(.45+T*.12)}),S.forEach(({mesh:x},z)=>{const C=Math.sin(v*(2.1+z*.43)+z*1.9)>.3;x.material.opacity=C?1:.04}),N.forEach((x,z)=>{const C=z===c?.36+Math.sin(v*1.8)*.07:0;x.material.opacity+=(C-x.material.opacity)*.06})}),e.jsx("group",{ref:r})}),xt=`
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
`;function gt(){const a=h.useRef(),{surfaceMat:t,atmoMat:s}=h.useMemo(()=>{const n=new Ae(Math.cos(-53*Math.PI/180)*Math.cos(135*Math.PI/180),Math.sin(-53*Math.PI/180),Math.cos(-53*Math.PI/180)*Math.sin(135*Math.PI/180)).normalize(),r=new he({uniforms:{uTime:{value:0},uSunDir:{value:n.clone()},uSeaLevel:{value:-.02},uCloudOpacity:{value:.45},uCloudSpeed:{value:.65},uCityLights:{value:1},uAtmoStrength:{value:.65}},vertexShader:`
        varying vec3 vLP; varying vec3 vWP; varying vec3 vWN;
        void main(){
          vLP = position;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWP = wp.xyz;
          vWN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:xt+`
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
      `}),i=new he({side:nt,transparent:!0,depthWrite:!1,blending:ve,uniforms:{uSunDir:{value:n.clone()},uAtmoStrength:{value:.55}},vertexShader:`
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
      `});return{surfaceMat:r,atmoMat:i}},[]);return se(({clock:n})=>{t.uniforms.uTime.value=n.elapsedTime,a.current&&(a.current.rotation.y=n.elapsedTime*.045)}),e.jsxs("group",{ref:a,position:[-7.8,-7.9,-14.2],scale:1.34,children:[e.jsx("mesh",{material:t,children:e.jsx("sphereGeometry",{args:[2.7,96,64]})}),e.jsx("mesh",{material:s,children:e.jsx("sphereGeometry",{args:[2.92,64,48]})})]})}function wt(){const{geometry:t,material:s}=h.useMemo(()=>{const n=new Float32Array(6600),r=new Float32Array(2200),i=new Float32Array(2200*3),o=new Float32Array(2200);for(let c=0;c<2200;c++){const y=60+Math.random()*70,S=Math.random()*Math.PI*2,N=Math.acos(2*Math.random()-1);n[c*3]=y*Math.sin(N)*Math.cos(S),n[c*3+1]=y*Math.sin(N)*Math.sin(S),n[c*3+2]=y*Math.cos(N),r[c]=.4+Math.random()*1.4,o[c]=Math.random()*Math.PI*2;const j=Math.random();i[c*3]=j<.15?1:j>.85?.7:.95,i[c*3+1]=j<.15?.85:j>.85?.8:.95,i[c*3+2]=j<.15?.7:j>.85?1:.95}const v=new Ke;v.setAttribute("position",new ee(n,3)),v.setAttribute("starSize",new ee(r,1)),v.setAttribute("color",new ee(i,3)),v.setAttribute("twinkle",new ee(o,1));const l=new he({uniforms:{uTime:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:ve});return{geometry:v,material:l}},[]);return se(({clock:n})=>{s.uniforms.uTime.value=n.elapsedTime}),e.jsx("points",{geometry:t,material:s})}function yt(){const{geometry:a,material:t}=h.useMemo(()=>{const n=new Float32Array(660),r=new Float32Array(220),i=new Float32Array(220);for(let l=0;l<220;l++)n[l*3]=(Math.random()-.5)*30,n[l*3+1]=(Math.random()-.5)*18,n[l*3+2]=-6+Math.random()*14,r[l]=.25+Math.random()*.9,i[l]=.3+Math.random()*1;const o=new Ke;o.setAttribute("position",new ee(n,3)),o.setAttribute("aSpeed",new ee(r,1)),o.setAttribute("starSize",new ee(i,1));const v=new he({uniforms:{uTime:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:ve});return{geometry:o,material:v}},[]);return se(({clock:s})=>{t.uniforms.uTime.value=s.elapsedTime}),e.jsx("points",{geometry:a,material:t})}function Mt(){const a=h.useMemo(()=>{const t=document.createElement("canvas");t.width=t.height=256;const s=t.getContext("2d"),n=s.createRadialGradient(128,128,0,128,128,128);return n.addColorStop(0,"rgba(255,244,220,.95)"),n.addColorStop(.18,"rgba(255,210,150,.38)"),n.addColorStop(.5,"rgba(255,170,90,.08)"),n.addColorStop(1,"rgba(0,0,0,0)"),s.fillStyle=n,s.fillRect(0,0,256,256),new st({map:new oe(t),transparent:!0,opacity:.5,blending:ve,depthWrite:!1,fog:!1})},[]);return se(({clock:t})=>{a.opacity=.46+Math.sin(t.elapsedTime*.8)*.06}),e.jsx("sprite",{material:a,position:[44.7,22.3,31.3],scale:[30,30,1]})}function jt({cameraProxy:a,lookProxy:t,fovProxy:s,thrusterProxy:n}){const{camera:r}=at(),i=h.useMemo(()=>new Ae,[]),o=h.useMemo(()=>new Ae,[]);return h.useEffect(()=>{r.position.set(0,1.6,30),r.fov=36,r.updateProjectionMatrix()},[]),se(({clock:v},l)=>{const c=v.elapsedTime,y=Math.min(l,1/20),S=Math.sin(c*.19)*.06,N=Math.sin(c*.13)*.04,j=Math.sin(c*.07)*.05,x=((n==null?void 0:n.intensity)??0)*.045,z=x*Math.sin(c*31.7)*(.6+.4*Math.sin(c*13.1)),C=x*Math.sin(c*27.3+1.7)*(.6+.4*Math.cos(c*17.9));o.set(((a==null?void 0:a.x)??0)+S+z,((a==null?void 0:a.y)??0)+N+C,((a==null?void 0:a.z)??16)+j),r.position.lerp(o,1-Math.pow(1-.18,y*60)),i.set(((t==null?void 0:t.x)??0)+Math.sin(c*.17)*.025+z*.5,((t==null?void 0:t.y)??0)+Math.cos(c*.21)*.02+C*.5,(t==null?void 0:t.z)??0),r.lookAt(i),s&&Math.abs(r.fov-s.value)>.05&&(r.fov+=(s.value-r.fov)*(1-Math.pow(1-.12,y*60)),r.updateProjectionMatrix())}),null}function bt({issGroupRef:a,cameraProxy:t,lookProxy:s,thrusterProxy:n,fovProxy:r,focusProxy:i,onReady:o}){return h.useEffect(()=>{o==null||o()},[o]),e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{color:2107456,intensity:.4}),e.jsx("directionalLight",{color:16774364,intensity:2.8,position:[10,5,7]}),e.jsx("directionalLight",{color:4880568,intensity:1.05,position:[6,-8,-4]}),e.jsx("directionalLight",{color:8965375,intensity:.5,position:[-7,3,-5]}),e.jsx(wt,{}),e.jsx(gt,{}),e.jsx(yt,{}),e.jsx(Mt,{}),e.jsx(h.Suspense,{fallback:null,children:e.jsx(ft,{ref:a,thrusterProxy:n,focusProxy:i})}),e.jsx(jt,{cameraProxy:t,lookProxy:s,fovProxy:r,thrusterProxy:n})]})}function St({active:a=!0,issGroupRef:t,stationProxy:s,cameraProxy:n,lookProxy:r,thrusterProxy:i,fovProxy:o,focusProxy:v,onLoaded:l}){return a?e.jsx(Qe,{frameloop:a?"always":"never",dpr:[1,1.4],gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},style:{width:"100%",height:"100%",background:"#02030a"},camera:{fov:36,near:.1,far:300,position:[0,1.6,30]},onCreated:({gl:c,scene:y})=>{c.toneMapping=Je,c.toneMappingExposure=1.15,c.outputColorSpace=et,y.fog=new tt(131850,.014)},children:e.jsx(bt,{issGroupRef:t,stationProxy:s,cameraProxy:n,lookProxy:r,thrusterProxy:i,fovProxy:o,focusProxy:v,onReady:l})}):e.jsx("div",{style:{width:"100%",height:"100%",background:"#02030a"},"aria-hidden":"true"})}function Nt(a){return a?a.split(/(<em>[^<]*<\/em>|\n)/g).map((t,s)=>{if(t===`
`)return e.jsx("br",{},s);const n=t.match(/^<em>([^<]*)<\/em>$/);return n?e.jsx("em",{children:n[1]},s):t||null}):null}const zt=h.forwardRef(function({index:t=0,total:s=3,tag:n,title:r,description:i,stats:o,position:v="tr",state:l="future"},c){const y=["iss-card",`pos-${v}`,l==="active"?"is-active":"",l==="past"?"is-past":""].filter(Boolean).join(" ");return e.jsxs("article",{ref:c,className:y,"aria-hidden":l!=="active",children:[e.jsxs("div",{className:"iss-card-index",children:[e.jsx("em",{children:String(t+1).padStart(2,"0")}),e.jsx("span",{children:"/"}),e.jsx("span",{children:String(s).padStart(2,"0")})]}),n&&e.jsx("div",{className:"iss-card-tag",children:n}),r&&e.jsx("h3",{children:Nt(r)}),i&&e.jsx("p",{children:i}),o&&o.length>0&&e.jsx("div",{className:"iss-card-stats",children:o.map(([S,N],j)=>e.jsxs("div",{className:"iss-card-stat",children:[e.jsx("span",{className:"iss-card-stat-num",children:S}),e.jsx("span",{className:"iss-card-stat-lbl",children:N})]},j))})]})}),O=(a,t,s)=>a+(t-a)*s,Ye=(a,t,s)=>a<t?t:a>s?s:a,Pt=a=>{const t=Ye(a,0,1);return t*t*t*(t*(t*6-15)+10)},re=[{p:0,cam:{x:0,y:1.6,z:30},look:{x:0,y:0,z:0},rotX:.05,rotY:.2,rotZ:0,fov:36,thruster:0,focus:-1,card:-1,phase:"approach"},{p:.08,cam:{x:0,y:.7,z:13.5},look:{x:0,y:.1,z:0},rotX:.18,rotY:.85,rotZ:.04,fov:40,thruster:.3,focus:-1,card:-1,phase:"active"},{p:.17,cam:{x:-1.9,y:1.8,z:6.4},look:{x:0,y:.6,z:.2},rotX:-.06,rotY:1.55,rotZ:-.04,fov:38,thruster:0,focus:0,card:0,phase:"reveal"},{p:.3,cam:{x:-2.15,y:1.7,z:6.15},look:{x:0,y:.62,z:.2},rotX:-.05,rotY:1.63,rotZ:-.04,fov:38,thruster:0,focus:0,card:0,phase:"reveal"},{p:.39,cam:{x:3.6,y:-.1,z:8},look:{x:-.4,y:1.4,z:0},rotX:.08,rotY:2.55,rotZ:.08,fov:44,thruster:0,focus:1,card:1,phase:"reveal"},{p:.52,cam:{x:3.85,y:.05,z:7.7},look:{x:-.4,y:1.42,z:0},rotX:.09,rotY:2.63,rotZ:.08,fov:44,thruster:0,focus:1,card:1,phase:"reveal"},{p:.61,cam:{x:-2.3,y:-.6,z:6.6},look:{x:.4,y:-.05,z:.9},rotX:.18,rotY:3.45,rotZ:-.05,fov:36,thruster:0,focus:2,card:2,phase:"reveal"},{p:.74,cam:{x:-2.52,y:-.5,z:6.35},look:{x:.4,y:-.03,z:.9},rotX:.19,rotY:3.53,rotZ:-.05,fov:36,thruster:0,focus:2,card:2,phase:"reveal"},{p:.88,cam:{x:0,y:2.9,z:19.5},look:{x:0,y:-.8,z:-1.8},rotX:.28,rotY:4.25,rotZ:-.05,fov:46,thruster:.6,focus:-1,card:-1,phase:"outro"},{p:1,cam:{x:0,y:3.3,z:21.5},look:{x:0,y:-1,z:-2.2},rotX:.3,rotY:4.4,rotZ:-.06,fov:47,thruster:.25,focus:-1,card:-1,phase:"outro"}];function At(a){let t=0;for(;t<re.length-2&&a>re[t+1].p;)t++;const s=re[t],n=re[Math.min(t+1,re.length-1)],r=n.p-s.p,i=r>1e-5?Pt((a-s.p)/r):0;return{cam:{x:O(s.cam.x,n.cam.x,i),y:O(s.cam.y,n.cam.y,i),z:O(s.cam.z,n.cam.z,i)},look:{x:O(s.look.x,n.look.x,i),y:O(s.look.y,n.look.y,i),z:O(s.look.z,n.look.z,i)},rotX:O(s.rotX,n.rotX,i),rotY:O(s.rotY,n.rotY,i),rotZ:O(s.rotZ,n.rotZ,i),fov:O(s.fov,n.fov,i),thruster:O(s.thruster,n.thruster,i),focus:i>.5?n.focus:s.focus,card:i>.5?n.card:s.card,phase:i>.5?n.phase:s.phase}}function It({sectionRef:a,issGroupRef:t,stationProxy:s,cameraProxy:n,lookProxy:r,thrusterProxy:i,fovProxy:o,focusProxy:v,onPhaseChange:l,onCardChange:c,damping:y=.07}={}){h.useEffect(()=>{if(!(a!=null&&a.current)){console.warn("[ISS] sectionRef.current ist null – RAF wurde nicht gestartet");return}let S=0,N=0,j=0,I=-2,x="",z=!0,C=performance.now();const T=()=>{const b=a.current;if(!b)return;const P=b.getBoundingClientRect(),R=document.documentElement.clientHeight||window.innerHeight,g=b.offsetHeight-R;if(g<=0){N=0;return}N=Ye(-P.top/g,0,1)},H=()=>{if(!z)return;S=requestAnimationFrame(H),T();const b=performance.now(),P=Math.min((b-C)/1e3,1/20);C=b;const R=1-Math.pow(1-y,P*60);j=O(j,N,R),Math.abs(j-N)<1e-4&&(j=N);const g=At(j),B=b/1e3;n&&(n.x=g.cam.x,n.y=g.cam.y,n.z=g.cam.z),r&&(r.x=g.look.x,r.y=g.look.y,r.z=g.look.z),s&&(s.rotX=g.rotX,s.rotY=g.rotY,s.rotZ=g.rotZ),i&&(i.intensity=g.thruster),o&&(o.value=g.fov),v&&(v.value=g.focus);const D=t==null?void 0:t.current;D&&(D.position.x=Math.sin(B*.31)*.04,D.position.y=Math.sin(B*.23)*.055,D.position.z=Math.sin(B*.17)*.03,D.rotation.x=g.rotX+Math.sin(B*.07)*.005,D.rotation.y=g.rotY+Math.sin(B*.09)*.008,D.rotation.z=g.rotZ+Math.sin(B*.11)*.004),g.card!==I&&(I=g.card,c&&c(g.card)),g.phase!==x&&(x=g.phase,l&&l(g.phase))};return S=requestAnimationFrame(H),()=>{z=!1,cancelAnimationFrame(S)}},[a,t,s,n,r,i,o,v,l,c,y])}const ze=[{tag:"Observation Layer",title:`Intelligente
<em>Beobachtung</em>`,description:"NILL überwacht jeden Kanal wie aus der Cupola — Postfach, Aufgaben, Lager, Schichten. Alles in einer Ansicht, ohne tote Winkel.",stats:[["24/7","aktiv"],["5","Module"],["1","Ansicht"]],position:"tr"},{tag:"Distributed Power",title:`Adaptive
<em>Architektur</em>`,description:"Wie Solar-Arrays, die sich zur Sonne drehen — NILLs Module skalieren, balancieren und heilen sich selbst, bevor du es bemerkst.",stats:[["DE","gehostet"],["100 %","Ökostrom"],["DSGVO","konform"]],position:"tl"},{tag:"Deep Space Link",title:`Autonome
<em>Orchestrierung</em>`,description:"Die Schüssel zeigt nach draußen — NILL spricht mit Gmail, Outlook und deinem Lager. Aufgaben finden ihren Weg, ohne dass du ein Ticket öffnest.",stats:[["3","Mail-Anbindungen"],["24/7","synchron"],["0","Tickets"]],position:"br"}];function Ct(){const a=h.useRef(null),t=h.useRef(null),s=[h.useRef(null),h.useRef(null),h.useRef(null)],[n,r]=h.useState(-1),[i,o]=h.useState("approach"),[v,l]=h.useState(!1),[c,y]=h.useState(!1),[S,N]=h.useState({x:"0.00",y:"0.00",z:"0.00"});h.useEffect(()=>{const b=a.current;if(!b)return;const P=new IntersectionObserver(([R])=>y(R.isIntersecting),{rootMargin:"25% 0px"});return P.observe(b),()=>P.disconnect()},[]);const j=h.useMemo(()=>({rotX:0,rotY:0,rotZ:0}),[]),I=h.useMemo(()=>({x:0,y:1.6,z:30}),[]),x=h.useMemo(()=>({x:0,y:0,z:0}),[]),z=h.useMemo(()=>({intensity:0}),[]),C=h.useMemo(()=>({value:36}),[]),T=h.useMemo(()=>({value:-1}),[]);It({sectionRef:a,issGroupRef:t,stationProxy:j,cameraProxy:I,lookProxy:x,thrusterProxy:z,fovProxy:C,focusProxy:T,onCardChange:r,onPhaseChange:o,damping:.07}),h.useEffect(()=>{if(!c)return;let b=0,P=0;const R=g=>{b=requestAnimationFrame(R),!(g-P<120)&&(P=g,N({x:I.x.toFixed(2),y:I.y.toFixed(2),z:I.z.toFixed(2)}))};return b=requestAnimationFrame(R),()=>cancelAnimationFrame(b)},[I,c]);const H=b=>b===n?"active":n>b?"past":"future";return e.jsx("section",{ref:a,className:`iss-section ${v?"iss-loaded":""}`,"data-screen-label":"ISS",children:e.jsxs("div",{className:"iss-sticky","data-phase":i,children:[e.jsx("div",{className:"iss-canvas-wrap",children:e.jsx(St,{active:c,issGroupRef:t,stationProxy:j,cameraProxy:I,lookProxy:x,thrusterProxy:z,fovProxy:C,focusProxy:T,onLoaded:()=>l(!0)})}),e.jsx("div",{className:"iss-bar top","aria-hidden":"true"}),e.jsx("div",{className:"iss-bar bot","aria-hidden":"true"}),e.jsx("div",{className:"iss-grain","aria-hidden":"true"}),e.jsxs("div",{className:"iss-hud tl",children:[e.jsxs("div",{children:[e.jsx("span",{className:"dot"}),"NILL · MISSION CONTROL"]}),e.jsx("div",{className:"label",children:"Orbital Layer · v1"})]}),e.jsxs("div",{className:"iss-hud tr",children:[e.jsx("div",{className:"label",children:"REF · NILL-OS / ISS-04"}),e.jsx("div",{className:"value",children:"50° 06′ 45″ N · 8° 40′ 56″ E"})]}),e.jsxs("div",{className:"iss-hud bl",children:[e.jsx("div",{className:"label",children:"CAMERA"}),e.jsxs("div",{className:"value",children:["x ",e.jsx("em",{children:S.x}),"  y ",e.jsx("em",{children:S.y}),"  z ",e.jsx("em",{children:S.z})]})]}),e.jsxs("div",{className:"iss-hud br",children:[e.jsx("div",{className:"label",children:"STATUS"}),e.jsx("div",{className:"value",children:i==="approach"?"APPROACH — STAND-BY":i==="reveal"?"REVEAL — MODULE FOCUS":"NOMINAL — TRACKING"})]}),e.jsx("div",{className:"iss-intro","aria-hidden":i!=="approach",children:e.jsxs("div",{className:"iss-intro-inner",children:[e.jsxs("span",{className:"eyebrow",children:[e.jsx("span",{className:"pip"}),"NILL · MISSION CONTROL"]}),e.jsxs("h2",{children:["Die Arbeitsstation, die dein",e.jsx("br",{}),"Unternehmen ",e.jsx("em",{children:"im Orbit"})," hält."]}),e.jsx("p",{children:"Stell dir NILL als Raumstation vor: ein zentrales System, das alle Module deines Betriebs verbindet. Beobachtung, Energie, Kommunikation — orchestriert von einer KI, die nie schläft."})]})}),e.jsx("div",{className:"iss-outro","aria-hidden":i!=="outro",children:e.jsxs("div",{className:"iss-outro-inner",children:[e.jsxs("span",{className:"eyebrow",children:[e.jsx("span",{className:"pip"}),"READY · LAUNCH WINDOW OPEN"]}),e.jsxs("h2",{children:["Eine Plattform.",e.jsx("br",{}),"Ein Login. ",e.jsx("em",{children:"Alle Module."})]}),e.jsx("p",{children:"NILL hält deinen Betrieb in der Umlaufbahn — 24/7, ohne Tickets, ohne Bauchschmerzen. Bereit, die Station zu betreten?"}),e.jsxs("a",{className:"iss-outro-cta",href:"#cta",children:["Demo anfragen ",e.jsx("span",{className:"arrow",children:"→"})]})]})}),e.jsx("div",{className:"iss-card-stage",children:ze.map((b,P)=>e.jsx(zt,{ref:s[P],index:P,total:ze.length,tag:b.tag,title:b.title,description:b.description,stats:b.stats,position:b.position,state:H(P)},P))}),e.jsx("div",{className:"iss-progress","aria-hidden":"true",children:ze.map((b,P)=>e.jsx("div",{className:`iss-progress-dot ${P===n?"active":P<n?"passed":""}`},P))}),e.jsxs("div",{className:`iss-scroll-hint ${i!=="approach"?"hidden":""}`,children:[e.jsx("span",{children:"scroll · mission"}),e.jsx("span",{className:"iss-scroll-hint-line"})]})]})})}let Be=!1;function Tt(){Be||(Be=!0,document.title="NILL — Intelligenz, die mitarbeitet.")}function kt(){const a=h.useRef(null);return h.useEffect(()=>{let t,s=0,n=1,r=0;const i=()=>{n=Math.max(1,document.documentElement.scrollHeight-innerHeight)};addEventListener("resize",i);const o=()=>{t=requestAnimationFrame(o),r++%120===0&&i();const v=window.scrollY/n;s+=(v-s)*.12,a.current&&(a.current.style.transform=`scaleX(${s})`)};return t=requestAnimationFrame(o),()=>{cancelAnimationFrame(t),removeEventListener("resize",i)}},[]),e.jsx("div",{className:"scroll-progress","aria-hidden":"true",children:e.jsx("span",{ref:a})})}function ne({className:a,style:t,children:s}){return e.jsx("article",{className:`card ${a||""}`,style:t,children:s})}const Ce=`
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
`,Lt=`
  varying vec3 vWP;varying vec3 vWN;
  void main(){
    vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;
    vWN=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*wp;
  }
`,Et=`
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
`;function He(a){return Ce+`
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
  `}const Wt=`
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
`,Ft=`
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
`,_t=`
  vec3 getSurf(vec3 op){
    float h=fbm3(op*1.7+.3);float rd=ridged(op*2.8);
    vec3 c=mix(vec3(.22,.05,.02),vec3(.68,.22,.08),smoothstep(-.35,.6,h));
    c=mix(c,vec3(.80,.48,.28),smoothstep(0.,.6,fbm2(op*4.+1.3))*.5);
    c=mix(c,vec3(.22,.05,.02),smoothstep(.45,.82,rd)*.8);
    c=mix(c,vec3(.90,.86,.80),smoothstep(.80,.94,abs(op.y)));
    float lava=smoothstep(.82,.96,ridged(op*3.8));
    c+=vec3(.55,.18,.05)*lava*.4;
    return c;
  }
  float getSpec(vec3 op){return .07;}
  vec3 getEmit(vec3 op){return vec3(.9,.22,.04)*smoothstep(.82,.96,ridged(op*3.8))*.06;}
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
    c=mix(c,vec3(.78,.36,.22),spot*.7);
    vec2 eye=(op.xy-vec2(.32,-.09))*vec2(2.,3.2);
    c=mix(c,vec3(.98,.82,.62),exp(-dot(eye,eye)*80.)*.9);
    return c;
  }
  float getSpec(vec3 op){return .03;}
  vec3 getEmit(vec3 op){return vec3(0.);}
`,Ve=`
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
`,Rt=`
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
`,Dt=Ce+`
  varying vec3 vLP;varying vec3 vWP;
  uniform float uInner,uOuter;uniform vec3 uSunPos;
  void main(){
    float rr=length(vLP.xy);
    float rn=clamp((rr-uInner)/(uOuter-uInner),0.,1.);
    float bands=.5+.5*sin(rn*140.+fbm2(vec3(rn*25.,0.,0.))*4.);
    float detail=fbm2(vec3(rn*70.,atan(vLP.y,vLP.x)*3.,0.));
    float gap1=smoothstep(.30,.34,rn)*(1.-smoothstep(.34,.40,rn));
    float gap2=smoothstep(.68,.71,rn)*(1.-smoothstep(.71,.74,rn));
    vec3 col=mix(vec3(.38,.32,.24),vec3(.86,.78,.62),bands*.8+detail*.25);
    float alpha=.85*(1.-gap1*.94)*(1.-gap2*.80);
    alpha*=smoothstep(0.,.06,rn)*smoothstep(1.,.93,rn)*(.62+detail*.4);
    col*=abs(normalize(uSunPos-vWP).y)*.5+.5;
    gl_FragColor=vec4(col,alpha);
  }
`;function Bt(a){const t=$e,s=new t.WebGLRenderer({canvas:a,antialias:!0,powerPreference:"high-performance"});s.setPixelRatio(Math.min(devicePixelRatio,2)),s.setClearColor(131850,1);const n=new it(s),r=new t.Scene,i=new t.PerspectiveCamera(42,2,.1,300);i.position.set(0,1.8,11),i.lookAt(0,0,0),n.addPass(new rt(r,i));const o=new ot(new t.Vector2(window.innerWidth,window.innerHeight),.45,.6,.55);n.addPass(o);const v=2200,l=new Float32Array(v*3),c=new Float32Array(v),y=new Float32Array(v*3),S=new Float32Array(v);for(let m=0;m<v;m++){S[m]=Math.random()*Math.PI*2;const k=60+Math.random()*70,w=Math.random()*Math.PI*2,W=Math.acos(2*Math.random()-1);l[m*3]=k*Math.sin(W)*Math.cos(w),l[m*3+1]=k*Math.sin(W)*Math.sin(w),l[m*3+2]=k*Math.cos(W),c[m]=.4+Math.random()*1.4;const E=Math.random();y[m*3]=E<.15?1:E>.85?.7:.95,y[m*3+1]=E<.15?.85:E>.85?.8:.95,y[m*3+2]=E<.15?.7:E>.85?1:.95}const N=new t.BufferGeometry;N.setAttribute("position",new t.BufferAttribute(l,3)),N.setAttribute("starSize",new t.BufferAttribute(c,1)),N.setAttribute("color",new t.BufferAttribute(y,3)),N.setAttribute("twinkle",new t.BufferAttribute(S,1));const j=new t.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:"attribute float starSize;attribute vec3 color;attribute float twinkle;uniform float uTime;varying vec3 vC;varying float vTw;void main(){vC=color;vTw=.84+.16*sin(uTime*1.2+twinkle*7.);vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=starSize*(.92+.16*sin(uTime*.9+twinkle*5.))*(700./-mv.z);gl_Position=projectionMatrix*mv;}",fragmentShader:"varying vec3 vC;varying float vTw;void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.25,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(vC,a*.85*vTw);}",transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}),I=new t.Points(N,j);r.add(I);const x=new t.Group;x.rotation.x=-.55,x.rotation.z=.07,r.add(x);const z=new t.Group;x.add(z);const C=new t.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:"varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:Ce+`
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
    `}),T=new t.Mesh(new t.SphereGeometry(.92,64,48),C);z.add(T);const H=m=>{const k=document.createElement("canvas");k.width=k.height=256;const w=k.getContext("2d"),W=w.createRadialGradient(128,128,0,128,128,128);m.forEach(([J,V])=>W.addColorStop(J,V)),w.fillStyle=W,w.fillRect(0,0,256,256);const E=new t.CanvasTexture(k);return E.minFilter=t.LinearFilter,E},b=(m,k,w)=>{const W=new t.Sprite(new t.SpriteMaterial({map:k,transparent:!0,opacity:w,blending:t.AdditiveBlending,depthWrite:!1,depthTest:!1}));return W.scale.set(m,m,1),z.add(W),W},P=H([[0,"rgba(0,0,0,0)"],[.55,"rgba(255,130,40,.08)"],[.75,"rgba(255,180,90,.09)"],[1,"rgba(0,0,0,0)"]]),R=H([[0,"rgba(0,0,0,0)"],[.6,"rgba(255,150,60,.05)"],[.85,"rgba(255,225,170,.04)"],[1,"rgba(0,0,0,0)"]]),g=b(10,P,.48),B=b(17,R,.24),D=[{r:2.2,sz:.3,spd:.26,phase:.3,tilt:.03,surf:Wt,atmo:[.55,.9,.22],atmoI:.55},{r:3.05,sz:.4,spd:.19,phase:1.6,tilt:-.05,surf:Ft,atmo:[.18,.88,.9],atmoI:.48},{r:3.88,sz:.28,spd:.15,phase:3,tilt:.04,surf:_t,atmo:[.92,.28,.2],atmoI:.38},{r:4.92,sz:.55,spd:.11,phase:4.7,tilt:-.03,surf:Gt,atmo:[.88,.68,.35],atmoI:.42,rings:!0},{r:6.08,sz:.34,spd:.09,phase:5.9,tilt:.05,surf:Ve,atmo:[.72,.7,.66],atmoI:.22},{r:7.12,sz:.22,spd:.07,phase:1.2,tilt:-.04,surf:Rt,atmo:[.78,1,.28],atmoI:.5,future:!0}],$=new t.Vector3,te=[];D.forEach(m=>{const k=new t.Mesh(new t.RingGeometry(m.r-.005,m.r+.005,160),new t.MeshBasicMaterial({color:16777215,transparent:!0,opacity:m.future?.04:.07,side:t.DoubleSide,depthWrite:!1}));k.rotation.x=Math.PI/2+m.tilt,x.add(k);const w=m.rings?64:56,W=new t.ShaderMaterial({uniforms:{uTime:{value:0},uSunPos:{value:new t.Vector3},uAtmo:{value:new t.Color(...m.atmo)}},vertexShader:Oe,fragmentShader:He(m.surf)}),E=new t.Mesh(new t.SphereGeometry(m.sz,w,Math.round(w*.65)),W);x.add(E);const J=new t.ShaderMaterial({side:t.FrontSide,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,uniforms:{uSunPos:{value:new t.Vector3},uColor:{value:new t.Color(...m.atmo)},uIntensity:{value:m.future?.28:m.atmoI}},vertexShader:Lt,fragmentShader:Et}),V=new t.Mesh(new t.SphereGeometry(m.sz*1.12,32,22),J);x.add(V);let Z=null;if(m.rings){const de=m.sz*1.55,me=m.sz*2.72;Z=new t.Mesh(new t.RingGeometry(de,me,140,1),new t.ShaderMaterial({side:t.DoubleSide,transparent:!0,depthWrite:!1,uniforms:{uInner:{value:de},uOuter:{value:me},uSunPos:{value:new t.Vector3}},vertexShader:"varying vec3 vLP;varying vec3 vWP;void main(){vLP=position;vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}",fragmentShader:Dt})),Z.rotation.x=-Math.PI/2+.2,Z.rotation.z=.1,x.add(Z)}te.push({mesh:E,pMat:W,atmo:V,atmoMat:J,ring:Z,def:m})});const ce=H([[0,"rgba(225,250,255,1)"],[.25,"rgba(150,210,255,.6)"],[.6,"rgba(80,140,255,.12)"],[1,"rgba(0,0,0,0)"]]),q=new t.Sprite(new t.SpriteMaterial({map:ce,transparent:!0,opacity:.95,blending:t.AdditiveBlending,depthWrite:!1}));q.scale.set(.55,.55,1),x.add(q);const K=64,_=new Float32Array(K*3),p=new Float32Array(K);for(let m=0;m<K;m++)p[m]=m/K;const d=new t.BufferGeometry;d.setAttribute("position",new t.BufferAttribute(_,3).setUsage(t.DynamicDrawUsage)),d.setAttribute("age",new t.BufferAttribute(p,1));const u=new t.ShaderMaterial({vertexShader:"attribute float age;varying float vA;void main(){vA=1.-age;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=(1.-age)*(95./-mv.z)+1.5;gl_Position=projectionMatrix*mv;}",fragmentShader:"varying float vA;void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.1,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(mix(vec3(.35,.55,1.),vec3(.85,.95,1.),vA),a*vA*.6);}",transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}),M=new t.Points(d,u);x.add(M);let f=Math.random()*Math.PI*2;const A=3.4,L=.62,G=new t.Vector3,Y=new t.ShaderMaterial({uniforms:{uTime:{value:0},uSunPos:{value:new t.Vector3},uAtmo:{value:new t.Color(.7,.7,.66)}},vertexShader:Oe,fragmentShader:He(Ve)}),U=new t.Mesh(new t.SphereGeometry(.085,26,18),Y);x.add(U);let Q=0,Te=0,ue=0,pe=0,ke=0;const Le=m=>{Q=m.clientX/innerWidth-.5,Te=m.clientY/innerHeight-.5},Ee=()=>{ke=Math.min(window.scrollY/innerHeight,1.2)};addEventListener("pointermove",Le,{passive:!0}),addEventListener("scroll",Ee,{passive:!0});const fe=()=>{const m=a.parentElement;if(!m)return;const k=m.clientWidth,w=m.clientHeight;s.setSize(k,w,!1),n.setSize(k,w),i.aspect=k/w,i.updateProjectionMatrix()};fe(),addEventListener("resize",fe);const We=performance.now();let xe=We,ge=0,we=!1,le=0,Fe=!1;const _e=()=>{if(!we)return;ge=requestAnimationFrame(_e);const m=performance.now(),k=Math.min((m-xe)/1e3,1/20);xe=m;const w=(m-We)/1e3;ue+=(Q-ue)*.05,pe+=(Te-pe)*.05,le+=(ke-le)*.06;const W=1-Math.pow(1-Math.min(1,w/3.2),5);i.position.set(0,1.8+(1-W)*1.7,11+(1-W)*4.6),i.lookAt(0,0,0),x.rotation.y=w*.028+ue*.26-(1-W)*.65,x.rotation.x=-.55+pe*.09-le*.16,x.position.y=-le*.7,C.uniforms.uTime.value=w,T.rotation.y=w*.07,T.scale.setScalar(1+Math.sin(w*.9)*.006),g.material.opacity=.46+Math.sin(w*1.1)*.04,B.material.opacity=.22+Math.sin(w*.7+1.2)*.04,g.material.rotation=w*.02,B.material.rotation=-w*.015,z.getWorldPosition($),I.rotation.y=w*.003,j.uniforms.uTime.value=w;const E=A/(1+L*Math.cos(f));f+=k*1.35/(E*E),G.set(Math.cos(f)*E,Math.sin(f)*E*.16,Math.sin(f)*E),q.position.copy(G);const J=.3+1.1/E;if(q.scale.set(J,J,1),Fe){for(let F=K-1;F>0;F--)_[F*3]=_[(F-1)*3],_[F*3+1]=_[(F-1)*3+1],_[F*3+2]=_[(F-1)*3+2];_[0]=G.x,_[1]=G.y,_[2]=G.z}else{Fe=!0;for(let F=0;F<K;F++)_[F*3]=G.x,_[F*3+1]=G.y,_[F*3+2]=G.z}d.attributes.position.needsUpdate=!0;const V=D[3],Z=V.phase+w*V.spd,de=Math.cos(Z)*V.r,me=Math.sin(Z*.55+V.tilt*4)*.09,Ue=Math.sin(Z)*V.r,ye=w*.85;U.position.set(de+Math.cos(ye)*1.18,me+Math.sin(ye)*.26,Ue+Math.sin(ye)*1.18),U.rotation.y=w*.3,Y.uniforms.uTime.value=w,Y.uniforms.uSunPos.value.copy($);for(const{mesh:F,pMat:De,atmo:Ze,atmoMat:Xe,ring:Me,def:ie}of te){const je=ie.phase+w*ie.spd,be=Math.cos(je)*ie.r,Se=Math.sin(je*.55+ie.tilt*4)*.09,Ne=Math.sin(je)*ie.r;F.position.set(be,Se,Ne),F.rotation.y+=k*.18,De.uniforms.uTime.value=w,De.uniforms.uSunPos.value.copy($),Ze.position.set(be,Se,Ne),Xe.uniforms.uSunPos.value.copy($),Me&&(Me.position.set(be,Se,Ne),Me.material.uniforms.uSunPos.value.copy($))}n.render()},Ge=m=>{m!==we&&(we=m,m?(xe=performance.now(),ge=requestAnimationFrame(_e)):cancelAnimationFrame(ge))},Re=new IntersectionObserver(([m])=>Ge(m.isIntersecting),{rootMargin:"25% 0px"});return Re.observe(a),()=>{Re.disconnect(),Ge(!1),removeEventListener("pointermove",Le),removeEventListener("scroll",Ee),removeEventListener("resize",fe),n.dispose(),s.dispose()}}function Ot(){const a=h.useRef(null),t=h.useRef(null),[s,n]=h.useState(!0);return h.useEffect(()=>{const r=a.current;if(!r)return;const i=new IntersectionObserver(([o])=>n(o.isIntersecting),{rootMargin:"25% 0px"});return i.observe(r),()=>i.disconnect()},[]),h.useEffect(()=>{if(!(!s||!t.current))return Bt(t.current)},[s]),e.jsx("div",{ref:a,style:{position:"absolute",inset:0,zIndex:0,background:"#02030a"},"aria-hidden":"true",children:s&&e.jsx("canvas",{ref:t,style:{position:"absolute",inset:0,zIndex:0,display:"block",width:"100%",height:"100%"}})})}function Ht({onCTA:a}){const[t,s]=h.useState(!1);return h.useEffect(()=>{const n=setTimeout(()=>s(!0),80);return()=>clearTimeout(n)},[]),e.jsxs("section",{className:`hero${t?" revealed":""}`,id:"top",children:[e.jsx(Ot,{}),e.jsxs("div",{className:"wrap hero-inner",children:[e.jsx("span",{className:"eyebrow hero-eyebrow",children:"Die smarte Arbeitsstation für Betriebe"}),e.jsxs("h1",{"aria-label":"Intelligenz, die mitarbeitet.",children:[e.jsx("span",{className:"word",children:e.jsx("span",{children:"Intelligenz,"})}),e.jsx("br",{}),e.jsx("span",{className:"word",children:e.jsx("span",{children:"die "})}),e.jsx("span",{className:"word",children:e.jsx("span",{children:e.jsx("em",{children:"mit­arbeitet."})})})]}),e.jsxs("p",{className:"lead",children:["NILL verbindet ",e.jsx("strong",{style:{color:"var(--ink)",fontWeight:500},children:"Postfach, Aufgaben, Lieferscheine, Inventur, Zeiterfassung"})," und ",e.jsx("strong",{style:{color:"var(--ink)",fontWeight:500},children:"Teamverwaltung"})," zu einer Arbeitsstation — unterstützt von einer KI, die mitliest und Arbeit vorbereitet."]}),e.jsxs("div",{className:"hero-cta",children:[e.jsxs(X,{className:"btn btn-primary",href:"/register",children:[e.jsx("span",{children:"Kostenlos registrieren"}),e.jsx("span",{className:"arrow",children:"→"})]}),e.jsxs(X,{className:"btn btn-ghost",href:"/login",children:[e.jsx("span",{children:"Login"}),e.jsx("span",{className:"arrow",children:"→"})]}),e.jsxs(X,{className:"btn btn-ghost",onClick:n=>{n.preventDefault(),a("Demo")},href:"#",children:[e.jsx("span",{children:"Live-Demo"}),e.jsx("span",{className:"arrow",children:"↓"})]})]}),e.jsxs("p",{className:"hero-trial-note",style:{marginTop:16,fontSize:13,lineHeight:1.5,color:"rgba(239,237,231,.5)",letterSpacing:".01em"},children:[e.jsx("span",{style:{color:"var(--accent)",fontWeight:500},children:"14 Tage kostenlos"})," testen — keine Kreditkarte nötig."]})]}),e.jsxs("div",{className:"hero-meta",children:[e.jsx("span",{children:"NILL · Arbeitsstation"}),e.jsxs("div",{className:"scroll-ind",children:[e.jsx("span",{children:"scroll"}),e.jsx("div",{className:"scroll-bar"})]}),e.jsx("span",{children:"DE · Made in Germany"})]})]})}function Vt(){const a=e.jsxs(e.Fragment,{children:["Postfach ",e.jsx("em",{children:"·"})," Aufgaben ",e.jsx("span",{className:"ticker-sep"})," Inventur ",e.jsx("em",{children:"·"})," Zeiterfassung ",e.jsx("span",{className:"ticker-sep"})," Team­verwaltung ",e.jsx("em",{children:"·"})," Lieferscheine ",e.jsx("span",{className:"ticker-sep"})," ",e.jsx("em",{children:"Ein Login."})," ",e.jsx("span",{className:"ticker-sep"}),"Postfach ",e.jsx("em",{children:"·"})," Aufgaben ",e.jsx("span",{className:"ticker-sep"})," Inventur ",e.jsx("em",{children:"·"})," Zeiterfassung ",e.jsx("span",{className:"ticker-sep"})," Team­verwaltung ",e.jsx("em",{children:"·"})," Lieferscheine ",e.jsx("span",{className:"ticker-sep"})," ",e.jsx("em",{children:"Ein Login."})," ",e.jsx("span",{className:"ticker-sep"})]});return e.jsx("div",{className:"ticker",children:e.jsx("div",{className:"ticker-track","aria-hidden":"true",children:e.jsx("span",{children:a})})})}function $t({onCTA:a}){const[t,s]=ae();return e.jsx("section",{id:"produkte",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:`section-head reveal${s?" in":""}`,ref:t,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Module — 05 live · 01 in Entwicklung"}),e.jsxs("h2",{children:["Sechs Module. ",e.jsx("br",{}),e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)",fontFamily:"var(--serif)",fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'},children:"Eine"})," Intelligenz."]})]}),e.jsx("p",{className:"lead",children:"Jedes Modul steht für sich — doch gemeinsam werden sie zu einem Gehirn, das dein Unternehmen versteht."})]}),e.jsxs(Ie,{stagger:!0,className:"bento",children:[e.jsxs(ne,{className:"k1",children:[e.jsx("div",{className:"viz","aria-hidden":"true",children:e.jsxs("svg",{viewBox:"0 0 600 380",preserveAspectRatio:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"mg",x1:"0",y1:"0",x2:"1",y2:"1",children:[e.jsx("stop",{offset:"0",stopColor:"#c6ff3c",stopOpacity:".25"}),e.jsx("stop",{offset:"1",stopColor:"#c6ff3c",stopOpacity:"0"})]})}),e.jsx("g",{transform:"translate(260,40)",opacity:".8",children:[0,60,120,180].map((n,r)=>e.jsxs("g",{className:"mail-row",transform:`translate(0,${n})`,children:[e.jsx("rect",{width:"300",height:"48",rx:"8",fill:r===0?"url(#mg)":"rgba(255,255,255,.03)",stroke:"rgba(255,255,255,.08)"}),e.jsx("circle",{cx:"22",cy:"24",r:"6",fill:["#c6ff3c","#7a5cff","#38f5d0","#ff4d8d"][r]}),e.jsx("rect",{x:"42",y:"16",width:[120,100,140,80][r],height:"6",rx:"3",fill:"rgba(255,255,255,.6)"}),e.jsx("rect",{x:"42",y:"28",width:[200,180,160,220][r],height:"4",rx:"2",fill:"rgba(255,255,255,.2)"})]},n))})]})}),e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"01"})," · Postfach"]}),e.jsxs("h3",{children:["E-Mails, die sich ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"selbst beantworten."})]}),e.jsx("p",{children:"Kategorisieren, priorisieren, Antworten schreiben — NILL liest mit und arbeitet voraus."})]})]}),e.jsxs(ne,{className:"k2",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"02"})," · Aufgaben & Lieferscheine"]}),e.jsxs("h3",{children:["Der Tag plant sich ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"von selbst."})]}),e.jsx("p",{children:"Aufgaben fürs ganze Team, Lieferscheine per Foto erfasst — direkt an der Station im Tablet- und Kiosk-Modus."})]}),e.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap",fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)"},children:["Tablet & Kiosk","Foto-Erfassung","PDF-Export"].map(n=>e.jsx("span",{style:{padding:"6px 10px",border:"1px solid var(--line)",borderRadius:99},children:n},n))})]}),e.jsx(ne,{className:"k3",children:e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"03"})," · Inventur"]}),e.jsxs("h3",{children:["Bestände, die sich ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"selbst zählen."})]}),e.jsx("p",{children:"Automatische Fortschreibung, Meldegrenzen mit Benachrichtigung."})]})}),e.jsxs(ne,{className:"k4",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"04"})," · Zeiterfassung"]}),e.jsxs("h3",{children:["Zeit erfasst sich ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"per Klick."})]}),e.jsx("p",{children:"Per App oder Browser. NILL weist Projekte zu und berechnet Überstunden."})]}),e.jsxs("div",{style:{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)",display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{children:"EuGH-konform"}),e.jsx("span",{children:"GPS-optional"})]})]}),e.jsxs(ne,{className:"k5",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"05"})," · Team­verwaltung"]}),e.jsxs("h3",{children:["Das Team im ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"Autopilot."})]}),e.jsx("p",{children:"Urlaub, Krankmeldungen, Dienstpläne, Onboarding — vorbereitet von der KI."})]}),e.jsx("div",{style:{display:"flex"},children:["MK","LS","JH","+9"].map((n,r)=>e.jsx("span",{className:"avatar",style:{width:28,height:28,fontSize:10,marginLeft:r?-10:0,background:r?["linear-gradient(135deg,var(--accent),var(--accent-4))","linear-gradient(135deg,var(--accent-3),var(--accent-2))","linear-gradient(135deg,var(--accent-4),var(--accent-3))"][r-1]:void 0},children:n},n))})]}),e.jsxs(ne,{className:"k6",style:{background:"linear-gradient(90deg,#0c0c10,#12130c)",borderColor:"rgba(198,255,60,.2)"},children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"06"})," · KI Sekretärin"]}),e.jsxs("h3",{children:["Nimmt Anrufe entgegen. ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"Rund um die Uhr."})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:14},children:[e.jsx("span",{className:"badge",children:"In Bearbeitung — Q3 / 2026"}),e.jsxs(X,{className:"btn btn-ghost",style:{padding:"10px 18px"},onClick:n=>{n.preventDefault(),a("Frühzugang")},href:"#",children:[e.jsx("span",{children:"Frühzugang sichern"}),e.jsx("span",{className:"arrow",children:"→"})]})]})]})]})]})})}function Pe({id:a,eyebrow:t,title:s,lead:n,to:r}){const[i,o]=ae();return e.jsx("section",{id:a,children:e.jsx("div",{className:"wrap",children:e.jsxs("div",{className:`section-head reveal${o?" in":""}`,ref:i,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:t}),e.jsx("h2",{dangerouslySetInnerHTML:{__html:s}})]}),e.jsxs("div",{children:[e.jsx("p",{className:"lead",children:n}),e.jsxs(X,{className:"btn btn-primary",to:r,style:{marginTop:26},children:[e.jsx("span",{children:"Mehr erfahren"}),e.jsx("span",{className:"arrow",children:"→"})]})]})]})})})}function Kt(){const[a,t]=ae(),s=h.useRef(null),[n,r]=h.useState(0);return h.useEffect(()=>{if(!t||!s.current)return;const i=performance.now(),o=v=>{const l=Math.min(1,(v-i)/1600);r(Math.round((1-Math.pow(1-l,3))*87)),l<1&&requestAnimationFrame(o)};requestAnimationFrame(o)},[t]),e.jsx("section",{style:{padding:"40px 0 120px"},children:e.jsx("div",{className:"wrap",children:e.jsxs("div",{className:`stats stagger${t?" in":""}`,ref:a,children:[e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"3,5"}),e.jsx("span",{children:"×"})]}),e.jsx("div",{className:"label",children:"Schneller im Alltag"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("span",{ref:s,children:n}),e.jsx("em",{children:"%"})]}),e.jsx("div",{className:"label",children:"Weniger manuelle Arbeit"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"24"}),e.jsx("span",{children:"/"}),e.jsx("em",{children:"7"})]}),e.jsx("div",{className:"label",children:"KI im Einsatz"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"05"}),e.jsx("span",{children:"·"}),e.jsx("em",{children:"01"})]}),e.jsx("div",{className:"label",children:"Module live · Ein Login"})]})]})})})}const Yt=[{tier:"Arbeitsstation",sub:"Die smarte Arbeitsstation für deinen Betrieb — Tablet & Kiosk",price:"30",per:"€ / Monat · unbegrenzte Stationen & Mitarbeiter",items:["Zeiterfassung mit QR-Mitarbeiterausweis","Aufgaben- & Taskmanagement fürs ganze Team","Lieferscheine, Inventur & Bestandsführung","E-Mail-Integration: Gmail, Outlook & IMAP","Teamverwaltung, Rollen & HR-Dokumente"],pop:!0}];function Ut({tier:a,sub:t,price:s,per:n,items:r,pop:i}){return e.jsxs("article",{className:`price${i?" pop":""}`,children:[i&&e.jsx("span",{className:"pop-chip",children:"Meistgewählt"}),e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",style:i?{color:"var(--accent)"}:{},children:a}),e.jsx("h3",{style:{marginTop:12},children:t})]}),e.jsxs("div",{className:"price-tag",children:[e.jsx("span",{className:"num",style:s.length>3?{fontSize:52}:{},children:s}),n&&e.jsx("span",{className:"per",children:n})]}),e.jsx("ul",{children:r.map(o=>e.jsx("li",{children:o},o))}),e.jsxs(X,{className:`btn ${i?"btn-primary":"btn-ghost"}`,href:"/pricing",children:[e.jsx("span",{children:"Mehr Erfahren"}),e.jsx("span",{className:"arrow",children:"→"})]})]})}function Zt(){const[a,t]=ae();return e.jsx("section",{id:"preise",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:`section-head reveal${t?" in":""}`,ref:a,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Preise — einfach gehalten"}),e.jsxs("h2",{children:["Ein Preis. ",e.jsx("br",{}),e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)",fontFamily:"var(--serif)",fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'},children:"Fertig."})]})]}),e.jsx("p",{className:"lead",children:"Transparent. Ohne versteckte Kosten. Monatlich kündbar. Die Komplett-Suite mit KI Sekretärin ist in Entwicklung — Details auf der Preisseite."})]}),e.jsx(Ie,{className:"pricing-grid",style:{gridTemplateColumns:"minmax(0,420px)",justifyContent:"center"},children:Yt.map(s=>e.jsx(Ut,{...s},s.tier))})]})})}function Xt(){const[a,t]=ae(),s=[["Wo werden meine Daten gespeichert?","Alle Daten liegen verschlüsselt auf Servern in Deutschland (Frankfurt). Wir sind nach DSGVO geprüft und bieten auf Wunsch eine Private-Cloud-Instanz."],["Was genau ist die Arbeitsstation?","Ein Tablet- oder Kiosk-Arbeitsplatz für deinen Betrieb: Zeiterfassung per QR-Ausweis, Aufgaben, Lieferscheine und Inventur — ein Preis, beliebig viele Mitarbeiter."],["Wie lange dauert das Onboarding?","Die meisten Teams sind in 48 Stunden produktiv. Wir unterstützen bei der Einrichtung deiner E-Mail-Konten und Module."],["Was passiert, wenn die KI einen Fehler macht?",'Jede automatische Aktion ist standardmäßig im "Vorschlags-Modus". Du entscheidest, was direkt geht, was freigegeben werden muss, und was dokumentiert wird.'],["Wie nachhaltig ist NILL wirklich?","Unsere Kern-Infrastruktur läuft auf 100 % Ökostrom in Frankfurt. Drittanbieter kompensieren wir zu 105 % über Gold-Standard-Projekte. Jährlicher Nachhaltigkeitsbericht auf Anfrage."]];return e.jsx("section",{id:"faq",children:e.jsxs("div",{className:"wrap-tight",children:[e.jsx("div",{className:`section-head reveal${t?" in":""}`,ref:a,style:{marginBottom:40},children:e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Antworten auf das Naheliegende"}),e.jsx("h2",{children:"FAQ."})]})}),e.jsx(Ie,{stagger:!0,className:"faq",children:s.map(([n,r])=>e.jsxs("details",{children:[e.jsx("summary",{children:n}),e.jsx("p",{className:"a",children:r})]},n))})]})})}function qt({onCTA:a}){const[t,s]=ae();return e.jsx("section",{id:"cta",className:"cta-big",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("h2",{className:`reveal${s?" in":""}`,ref:t,children:["Lass deine KI ",e.jsx("br",{}),e.jsx("em",{children:"anfangen"}),e.jsx("br",{}),"zu arbeiten."]}),e.jsxs("div",{className:`cta-sub reveal reveal-delay-1${s?" in":""}`,children:[e.jsx("p",{className:"lead",children:"30 Minuten Live-Demo mit einem unserer Produktspezialisten. Wir zeigen dir direkt an deinem Use-Case, wie NILL arbeitet."}),e.jsxs("div",{style:{display:"flex",gap:12,flexWrap:"wrap"},children:[e.jsxs(X,{className:"btn btn-primary",onClick:n=>{n.preventDefault(),a("Termin")},href:"#",children:[e.jsx("span",{children:"Termin buchen"}),e.jsx("span",{className:"arrow",children:"→"})]}),e.jsxs(X,{className:"btn btn-ghost",href:"#produkte",children:[e.jsx("span",{children:"Module"}),e.jsx("span",{className:"arrow",children:"↑"})]})]})]})]})})}function an(){Tt();const[a,t]=h.useState(null),s=h.useCallback(r=>t(r||"default"),[]),n=h.useCallback(()=>t(null),[]);return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"vignette","aria-hidden":"true"}),e.jsx(kt,{}),e.jsx(ct,{}),e.jsx(Ht,{onCTA:s}),e.jsx(Ct,{}),e.jsx(Vt,{}),e.jsx($t,{onCTA:s}),e.jsx(Pe,{id:"wie",eyebrow:"Wie es arbeitet — 05 Schritte",title:'Ein Tag, von der <em style="font-style:italic;color:var(--accent);font-family:var(--serif)">KI</em> geführt.',lead:"Von der ersten Mail um 07:48 bis zum neuen Dienstplan um 16:48 — sieh Schritt für Schritt, wie NILL einen kompletten Arbeitstag durch alle Module begleitet.",to:"/wie-es-arbeitet"}),e.jsx(Kt,{}),e.jsx(Zt,{onCTA:s}),e.jsx(Pe,{id:"app",eyebrow:"Progressive Web App · ohne App Store",title:'NILL als App. <em style="font-style:italic;color:var(--accent)">Ohne Store.</em>',lead:"Direkt aus dem Browser installiert — auf iOS, Android, macOS und Windows. Offline-fähig, mit Push-Benachrichtigungen und ohne Update-Zwang.",to:"/app"}),e.jsx(Pe,{id:"nachhaltigkeit",eyebrow:"Nachhaltigkeit",title:'Intelligenz mit <em style="font-style:italic;color:var(--accent)">Verantwortung.</em>',lead:"100 % Ökostrom in Frankfurt, kompensierte Drittanbieter und ein jährlicher Nachhaltigkeitsbericht. Wie NILL Effizienz und Klimaschutz zusammenbringt.",to:"/nachhaltigkeit"}),e.jsx(Xt,{}),e.jsx(qt,{onCTA:s}),e.jsx(lt,{}),e.jsx(dt,{intent:a,onClose:n})]})}export{an as default};
