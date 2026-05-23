import{a as p,j as e}from"./vendor-react--hPKs4bs.js";import{L as K}from"./vendor-router-DHr2oj4b.js";import{u as pe,T as be,C as ne,R as ye,a as je,F as we,B as Ne,b as oe,S as ce,A as ue,V as de,c as ke,d as Me}from"./vendor-three-oPrSP0YR.js";/* empty css                */import"./vendor-misc-DR5OIT6T.js";function Se(){const r=document.createElement("canvas");r.width=1024,r.height=512;const a=r.getContext("2d");a.fillStyle="#d4d6dc",a.fillRect(0,0,1024,512);for(let s=0;s<2400;s++)a.fillStyle=`rgba(${100+(Math.random()*40|0)},${100+(Math.random()*40|0)},${110+(Math.random()*40|0)},${.08+Math.random()*.12})`,a.fillRect(Math.random()*1024,Math.random()*512,1+Math.random()*3,1);a.strokeStyle="rgba(20,22,28,.55)",a.lineWidth=1.2;for(let s=0;s<1024;s+=64)a.beginPath(),a.moveTo(s,0),a.lineTo(s,512),a.stroke();for(let s=0;s<512;s+=64)a.beginPath(),a.moveTo(0,s),a.lineTo(1024,s),a.stroke();a.fillStyle="rgba(40,44,52,.7)";for(let s=8;s<1024;s+=32)for(let l=8;l<512;l+=32)a.fillRect(s,l,1.5,1.5);for(let s=0;s<14;s++){const l=Math.random()*844,c=Math.random()*422,o=80+Math.random()*100,d=40+Math.random()*60;a.strokeStyle="rgba(15,17,22,.7)",a.lineWidth=2,a.strokeRect(l,c,o,d),a.fillStyle="rgba(50,55,65,.18)",a.fillRect(l,c,o,d)}for(let s=0;s<60;s++)a.fillStyle=`rgba(${30+(Math.random()*40|0)},${28+(Math.random()*30|0)},${28+(Math.random()*30|0)},${.15+Math.random()*.25})`,a.fillRect(Math.random()*1024,Math.random()*512,30+Math.random()*120,1+Math.random()*3);a.fillStyle="rgba(220,200,40,.55)",a.font="bold 14px monospace",["CAUTION","HATCH-A4","MOD-7","EXT-VENT","HIGH-V","NILL-OS"].forEach((s,l)=>a.fillText(s,60+l*160,40+l%2*220));const i=new ne(r);return i.wrapS=i.wrapT=ye,i.anisotropy=8,i}function ze(){const r=document.createElement("canvas");r.width=512,r.height=256;const a=r.getContext("2d"),i=a.createLinearGradient(0,0,512,256);i.addColorStop(0,"#0a1840"),i.addColorStop(.5,"#1a3878"),i.addColorStop(1,"#0a1d54"),a.fillStyle=i,a.fillRect(0,0,512,256);const s=32,l=32;for(let o=0;o<512;o+=s)for(let d=0;d<256;d+=l){const b=.8+Math.random()*.3;a.fillStyle=`rgba(${30*b|0},${60*b|0},${140*b|0},.95)`,a.fillRect(o+1,d+1,s-2,l-2);const w=a.createLinearGradient(o,d,o+s,d+l);w.addColorStop(0,"rgba(120,180,255,.18)"),w.addColorStop(.5,"rgba(255,255,255,.05)"),w.addColorStop(1,"rgba(20,40,90,.2)"),a.fillStyle=w,a.fillRect(o+1,d+1,s-2,l-2),a.fillStyle="rgba(180,190,210,.4)",a.fillRect(o+s/2-.5,d+1,1,l-2)}a.strokeStyle="rgba(8,12,28,.85)",a.lineWidth=1;for(let o=0;o<=512;o+=s)a.beginPath(),a.moveTo(o,0),a.lineTo(o,256),a.stroke();for(let o=0;o<=256;o+=l)a.beginPath(),a.moveTo(0,o),a.lineTo(512,o),a.stroke();const c=new ne(r);return c.anisotropy=8,c}function Ie(){const n=document.createElement("canvas");n.width=n.height=128;const t=n.getContext("2d"),r=t.createRadialGradient(64,64,0,64,64,64);return r.addColorStop(0,"rgba(255,255,255,1)"),r.addColorStop(.3,"rgba(255,255,255,.5)"),r.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=r,t.fillRect(0,0,128,128),new ne(n)}function Pe(){const n=document.createElement("canvas");n.width=512,n.height=64;const t=n.getContext("2d");t.fillStyle="#181a20",t.fillRect(0,0,512,64);for(let r=0;r<24;r++){const a=20+r*20,i=t.createRadialGradient(a+6,32,0,a+6,32,12);i.addColorStop(0,"rgba(255,240,200,1)"),i.addColorStop(.4,"rgba(180,220,255,.85)"),i.addColorStop(1,"rgba(40,80,160,0)"),t.fillStyle=i,t.fillRect(a-6,16,24,32),t.strokeStyle="#2a2d35",t.lineWidth=2,t.strokeRect(a,22,12,20)}return new ne(n)}function Le(n){const t=be,r=Se(),a=ze(),i=Ie(),s=Pe(),l=new t.MeshStandardMaterial({map:r,color:16777215,metalness:.65,roughness:.42}),c=new t.MeshStandardMaterial({map:r,color:10133680,metalness:.7,roughness:.5}),o=new t.MeshStandardMaterial({color:13041468,emissive:7178772,emissiveIntensity:.9,metalness:.5,roughness:.35}),d=new t.MeshStandardMaterial({color:1842982,metalness:.75,roughness:.55}),b=new t.MeshStandardMaterial({color:13148234,metalness:.85,roughness:.25,emissive:3811848,emissiveIntensity:.15}),w=new t.MeshStandardMaterial({map:a,metalness:.7,roughness:.35,emissive:661560,emissiveIntensity:.18,side:t.DoubleSide}),f=new t.MeshBasicMaterial({map:s,transparent:!0,opacity:.95}),N=new t.Group;n.add(N),[-1,0,1].forEach((v,m)=>{const x=new t.Mesh(new t.CylinderGeometry(.88,.88,.92,32),l);if(x.rotation.z=Math.PI/2,x.position.x=v*1,N.add(x),m<2){const g=new t.Mesh(new t.CylinderGeometry(.94,.94,.12,32),b);g.rotation.z=Math.PI/2,g.position.x=v*1+.5,N.add(g)}const y=new t.Mesh(new t.CylinderGeometry(.881,.881,.22,32,1,!0),f);y.rotation.z=Math.PI/2,y.position.x=v*1,N.add(y)}),[-1.5,1.5].forEach(v=>{const m=new t.Mesh(new t.SphereGeometry(.88,32,16,0,Math.PI*2,0,Math.PI/2),l);m.rotation.z=v>0?-Math.PI/2:Math.PI/2,m.position.x=v,N.add(m)});const S=new t.Group;S.position.y=.82,S.add(new t.Mesh(new t.CylinderGeometry(.32,.38,.15,24),l));const I=new t.Mesh(new t.SphereGeometry(.3,24,16,0,Math.PI*2,0,Math.PI/2),new t.MeshStandardMaterial({color:4880568,metalness:.9,roughness:.08,emissive:3823736,emissiveIntensity:.45,transparent:!0,opacity:.88}));I.position.y=.075,S.add(I);for(let v=0;v<6;v++){const m=v/6*Math.PI*2,x=new t.Mesh(new t.BoxGeometry(.012,.3,.012),d);x.position.set(Math.cos(m)*.27,.075,Math.sin(m)*.27),x.rotation.y=-m,S.add(x)}N.add(S),[-2.55,2.55].forEach(v=>{const m=new t.Group;m.position.x=v;const x=new t.Mesh(new t.CylinderGeometry(.58,.58,1.5,24),l);x.rotation.z=Math.PI/2,m.add(x);const y=new t.Mesh(new t.SphereGeometry(.58,24,16,0,Math.PI*2,0,Math.PI/2),b);y.rotation.z=v>0?-Math.PI/2:Math.PI/2,y.position.x=v>0?.75:-.75,m.add(y);const g=new t.Mesh(new t.TorusGeometry(.58,.03,8,24),o);g.rotation.y=Math.PI/2,g.position.x=v>0?.75:-.75,m.add(g);const k=new t.Mesh(new t.CylinderGeometry(.581,.581,.18,24,1,!0),f);k.rotation.z=Math.PI/2,m.add(k);for(let h=0;h<8;h++){const M=h/8*Math.PI*2,j=new t.Mesh(new t.BoxGeometry(.08,.04,.15),d);j.position.set((Math.random()-.5)*1,Math.cos(M)*.6,Math.sin(M)*.6),j.lookAt(j.position.x,0,0),m.add(j)}const P=new t.Mesh(new t.BoxGeometry(.4,.15,.12),d);P.position.set(0,-.62,0),m.add(P);const G=new t.Mesh(new t.CylinderGeometry(.04,.04,1.4,8),b);G.rotation.z=Math.PI/2,G.position.set(0,.58,.15),m.add(G),n.add(m)});const L=(v,m)=>{const x=new t.Group;x.position.x=v,[[-.13,-.13],[.13,-.13],[-.13,.13],[.13,.13]].forEach(([y,g])=>{const k=new t.Mesh(new t.CylinderGeometry(.018,.018,m,6),d);k.rotation.z=Math.PI/2,k.position.set(0,y,g),x.add(k)});for(let y=0;y<4;y++){const g=-m/2+(y+.5)*(m/4),k=new t.Mesh(new t.CylinderGeometry(.012,.012,.36,6),d);k.position.set(g,0,0),k.rotation.z=Math.PI/4,x.add(k);const P=new t.Mesh(new t.CylinderGeometry(.012,.012,.36,6),d);P.position.set(g,0,0),P.rotation.x=Math.PI/4,x.add(P)}return[-m/2,m/2].forEach(y=>{const g=new t.Mesh(new t.TorusGeometry(.18,.015,6,12),d);g.rotation.y=Math.PI/2,g.position.x=y,x.add(g)}),x};n.add(L(-1.7,.65)),n.add(L(1.7,.65)),[-1,1].forEach(v=>{const m=new t.Group,x=new t.Mesh(new t.CylinderGeometry(.13,.13,.35,12),c);x.position.y=v*.9,m.add(x);const y=new t.Mesh(new t.CylinderGeometry(.07,.07,1.7,10),c);y.position.y=v*1.95,m.add(y);const g=new t.Mesh(new t.SphereGeometry(.14,16,12),b);g.position.y=v*2.85,m.add(g),[-1,1].forEach(k=>{const P=new t.Group;P.position.set(k*2.4,v*2.85,0);const G=new t.Mesh(new t.PlaneGeometry(4.6,1.55,16,4),w);G.rotation.y=Math.PI/2*(k>0?1:-1),P.add(G);const h=new t.Mesh(new t.BoxGeometry(.08,1.55,4.6),c);P.add(h);const M=new t.Mesh(new t.BoxGeometry(.18,.25,.25),d);M.position.x=k>0?-2.3:2.3,P.add(M),m.add(P)}),n.add(m)}),[-1,1].forEach(v=>{const m=new t.Mesh(new t.PlaneGeometry(1.2,.9),new t.MeshStandardMaterial({color:15790312,metalness:.1,roughness:.8,side:t.DoubleSide,emissive:2105376,emissiveIntensity:.05}));m.position.set(v*1.7,0,.85),m.rotation.x=Math.PI/2,n.add(m);const x=new t.Mesh(new t.BoxGeometry(1.2,.04,.04),d);x.position.set(v*1.7,0,.85),n.add(x)});const C=new t.Group;C.position.set(.4,0,1);const z=new t.Mesh(new t.CylinderGeometry(.05,.05,.55,10),c);z.position.y=.27,C.add(z);const u=new t.Mesh(new t.SphereGeometry(.08,12,10),b);u.position.y=.55,C.add(u);const E=new t.Mesh(new t.SphereGeometry(.42,24,16,0,Math.PI*2,0,Math.PI/2.5),new t.MeshStandardMaterial({color:15658724,metalness:.4,roughness:.3,side:t.DoubleSide}));E.position.y=.65,E.rotation.x=-.4,C.add(E);const T=new t.Mesh(new t.ConeGeometry(.06,.18,10),d);T.position.set(0,.82,.15),T.rotation.x=Math.PI,C.add(T);for(let v=0;v<3;v++){const m=v/3*Math.PI*2,x=new t.Mesh(new t.CylinderGeometry(.006,.006,.25,6),d);x.position.set(Math.cos(m)*.12,.75,.08+Math.sin(m)*.12),x.rotation.x=.4,x.rotation.z=m,C.add(x)}n.add(C);const D=new t.Group;D.position.set(-.6,0,1);const te=new t.Mesh(new t.CylinderGeometry(.025,.025,.8,8),d);te.position.y=.4,D.add(te);const ae=new t.Mesh(new t.SphereGeometry(.04,8,8),o);ae.position.y=.82,D.add(ae),n.add(D);const O=new t.Mesh(new t.CylinderGeometry(.32,.42,.48,24),c);O.position.set(0,-.85,.35),O.rotation.x=Math.PI/2,n.add(O);const H=new t.Mesh(new t.TorusGeometry(.34,.04,10,24),o);H.position.set(0,-1.05,.35),H.rotation.x=Math.PI/2,n.add(H);for(let v=0;v<4;v++){const m=v/4*Math.PI*2+Math.PI/4,x=new t.Mesh(new t.CylinderGeometry(.022,.022,.15,6),d);x.position.set(Math.cos(m)*.36,-1.05,.35+Math.sin(m)*.36),x.rotation.z=-Math.PI/2,n.add(x)}[[3.2,0,0],[-3.2,0,0],[0,1,1],[0,-1,1]].forEach(([v,m,x])=>{const y=new t.Group;y.position.set(v,m,x);for(let g=0;g<4;g++){const k=g/4*Math.PI*2,P=new t.Mesh(new t.ConeGeometry(.04,.12,8),d);P.position.set(Math.cos(k)*.08,Math.sin(k)*.08,0),P.rotation.x=Math.PI/2,y.add(P)}n.add(y)});const X=[];[[0,-2.9,.15],[0,-2.9,-.15],[0,-1.1,.35],[0,-1.1,-.05],[-3.2,0,0],[3.2,0,0]].forEach(([v,m,x])=>{const y=new t.Sprite(new t.SpriteMaterial({map:i,color:6336767,transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));y.scale.set(2.8,2.8,1),y.position.set(v,m,x),n.add(y);const g=new t.Sprite(new t.SpriteMaterial({map:i,color:15267071,transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));g.scale.set(.7,.7,1),g.position.set(v,m,x),n.add(g),X.push({outer:y,inner:g})});const J=[];[[3.4,0,0,16724048],[-3.4,0,0,13041468],[0,2.95,1.2,16777215],[0,-2.95,1.2,16777215],[0,0,1.4,16747068],[0,0,-1.4,6741503]].forEach(([v,m,x,y])=>{const g=new t.Mesh(new t.SphereGeometry(.05,10,10),new t.MeshBasicMaterial({color:y,transparent:!0}));g.position.set(v,m,x);const k=new t.Sprite(new t.SpriteMaterial({map:i,color:y,transparent:!0,opacity:.6,blending:t.AdditiveBlending,depthWrite:!1}));k.scale.set(.4,.4,1),g.add(k),n.add(g),J.push({mesh:g,halo:k})});const V=[new t.Vector3(0,.82,.2),new t.Vector3(-2.4,2.85,0),new t.Vector3(.4,.65,1)],Q=V.map((v,m)=>{const x=new t.Sprite(new t.SpriteMaterial({map:i,color:[13041468,3732944,8019199][m],transparent:!0,opacity:0,blending:t.AdditiveBlending,depthWrite:!1}));return x.scale.set(3.5,3.5,1),x.position.copy(v),n.add(x),x});return{thrusterGlows:X,navLights:J,focusHalos:Q,FOCUS_ANCHORS:V}}const Ce=p.forwardRef(function({thrusterProxy:t,focusProxy:r,stationProxy:a},i){const s=p.useRef(),l=p.useRef(null);return p.useImperativeHandle(i,()=>s.current,[]),p.useEffect(()=>{if(!s.current)return;const c=Le(s.current);return l.current=c,()=>{l.current=null}},[]),pe(({clock:c})=>{if(!l.current)return;const o=c.elapsedTime,d=(t==null?void 0:t.intensity)??0,b=(r==null?void 0:r.value)??-1,{thrusterGlows:w,navLights:f,focusHalos:N}=l.current;w.forEach(({outer:S,inner:I},L)=>{const C=Math.sin(o*9+L*.8)*.5+.5;S.material.opacity=d*(.18+C*.07),I.material.opacity=d*(.45+C*.12)}),f.forEach(({mesh:S},I)=>{const L=Math.sin(o*(2.1+I*.43)+I*1.9)>.3;S.material.opacity=L?1:.04}),N.forEach((S,I)=>{const L=I===b?.36+Math.sin(o*1.8)*.07:0;S.material.opacity+=(L-S.material.opacity)*.06})}),e.jsx("group",{ref:s})}),Te=`
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
`;function Ee(){const n=p.useRef(),{surfaceMat:t,atmoMat:r}=p.useMemo(()=>{const a=new de(Math.cos(-53*Math.PI/180)*Math.cos(135*Math.PI/180),Math.sin(-53*Math.PI/180),Math.cos(-53*Math.PI/180)*Math.sin(135*Math.PI/180)).normalize(),i=new ce({uniforms:{uTime:{value:0},uSunDir:{value:a.clone()},uSeaLevel:{value:-.02},uCloudOpacity:{value:.45},uCloudSpeed:{value:.65},uCityLights:{value:1},uAtmoStrength:{value:0}},vertexShader:`
        varying vec3 vLP; varying vec3 vWP; varying vec3 vWN;
        void main(){
          vLP = position;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWP = wp.xyz;
          vWN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:Te+`
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
      `}),s=new ce({side:ke,transparent:!0,depthWrite:!1,blending:ue,uniforms:{uSunDir:{value:a.clone()},uAtmoStrength:{value:.55}},vertexShader:`
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
      `});return{surfaceMat:i,atmoMat:s}},[]);return pe(({clock:a})=>{t.uniforms.uTime.value=a.elapsedTime,n.current&&(n.current.rotation.y=a.elapsedTime*.075)}),e.jsxs("group",{ref:n,position:[-7.4,-7.5,-13.7],scale:1.14,children:[e.jsx("mesh",{material:t,children:e.jsx("sphereGeometry",{args:[2.7,96,64]})}),e.jsx("mesh",{material:r,children:e.jsx("sphereGeometry",{args:[2.92,64,48]})})]})}function Ae(){const{geometry:t,material:r}=p.useMemo(()=>{const a=new Float32Array(6600),i=new Float32Array(2200),s=new Float32Array(2200*3);for(let o=0;o<2200;o++){const d=60+Math.random()*70,b=Math.random()*Math.PI*2,w=Math.acos(2*Math.random()-1);a[o*3]=d*Math.sin(w)*Math.cos(b),a[o*3+1]=d*Math.sin(w)*Math.sin(b),a[o*3+2]=d*Math.cos(w),i[o]=.4+Math.random()*1.4;const f=Math.random();s[o*3]=f<.15?1:f>.85?.7:.95,s[o*3+1]=f<.15?.85:f>.85?.8:.95,s[o*3+2]=f<.15?.7:f>.85?1:.95}const l=new Ne;l.setAttribute("position",new oe(a,3)),l.setAttribute("starSize",new oe(i,1)),l.setAttribute("color",new oe(s,3));const c=new ce({uniforms:{},vertexShader:`
        attribute float starSize; attribute vec3 color;
        varying vec3 vC;
        void main(){
          vC = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.);
          gl_PointSize = starSize * (700. / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,fragmentShader:`
        varying vec3 vC;
        void main(){
          vec2 uv = gl_PointCoord - .5;
          float a = 1. - smoothstep(.25, .5, length(uv));
          if(a < .01) discard;
          gl_FragColor = vec4(vC, a * .85);
        }
      `,transparent:!0,depthWrite:!1,blending:ue});return{geometry:l,material:c}},[]);return e.jsx("points",{geometry:t,material:r})}function Fe({cameraProxy:n,lookProxy:t,fovProxy:r}){const{camera:a}=Me(),i=p.useMemo(()=>new de,[]),s=p.useMemo(()=>new de,[]);return p.useEffect(()=>{a.position.set(0,1.6,28),a.fov=36,a.updateProjectionMatrix()},[]),pe(({clock:l})=>{const c=l.elapsedTime,o=Math.sin(c*.19)*.06,d=Math.sin(c*.13)*.04,b=Math.sin(c*.07)*.05;s.set(((n==null?void 0:n.x)??0)+o,((n==null?void 0:n.y)??0)+d,((n==null?void 0:n.z)??16)+b),a.position.lerp(s,.18),i.set(((t==null?void 0:t.x)??0)+Math.sin(c*.17)*.025,((t==null?void 0:t.y)??0)+Math.cos(c*.21)*.02,(t==null?void 0:t.z)??0),a.lookAt(i),r&&Math.abs(a.fov-r.value)>.05&&(a.fov+=(r.value-a.fov)*.12,a.updateProjectionMatrix())}),null}function We({issGroupRef:n,stationProxy:t,cameraProxy:r,lookProxy:a,thrusterProxy:i,fovProxy:s,focusProxy:l,onReady:c}){return p.useEffect(()=>{c==null||c()},[c]),e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{color:2107456,intensity:.35}),e.jsx("directionalLight",{color:16774364,intensity:2.4,position:[10,5,7]}),e.jsx("directionalLight",{color:4880568,intensity:.95,position:[6,-8,-4]}),e.jsx("directionalLight",{color:8965375,intensity:.45,position:[-7,3,-5]}),e.jsx(Ae,{}),e.jsx(Ee,{}),e.jsx(p.Suspense,{fallback:null,children:e.jsx(Ce,{ref:n,thrusterProxy:i,focusProxy:l})}),e.jsx(Fe,{cameraProxy:r,lookProxy:a,fovProxy:s})]})}function Re({issGroupRef:n,stationProxy:t,cameraProxy:r,lookProxy:a,thrusterProxy:i,fovProxy:s,focusProxy:l,onLoaded:c}){return e.jsx(je,{dpr:[1,1.6],gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},style:{width:"100%",height:"100%",background:"#02030a"},camera:{fov:36,near:.1,far:300,position:[0,1.6,28]},onCreated:({scene:o})=>{o.fog=new we(131850,.025)},children:e.jsx(We,{issGroupRef:n,stationProxy:t,cameraProxy:r,lookProxy:a,thrusterProxy:i,fovProxy:s,focusProxy:l,onReady:c})})}function De(n){return n?n.split(/(<em>[^<]*<\/em>|\n)/g).map((t,r)=>{if(t===`
`)return e.jsx("br",{},r);const a=t.match(/^<em>([^<]*)<\/em>$/);return a?e.jsx("em",{children:a[1]},r):t||null}):null}const Ge=p.forwardRef(function({index:t=0,total:r=3,tag:a,title:i,description:s,stats:l,position:c="tr",state:o="future"},d){const b=["iss-card",`pos-${c}`,o==="active"?"is-active":"",o==="past"?"is-past":""].filter(Boolean).join(" ");return e.jsxs("article",{ref:d,className:b,"aria-hidden":o!=="active",children:[e.jsxs("div",{className:"iss-card-index",children:[e.jsx("em",{children:String(t+1).padStart(2,"0")}),e.jsx("span",{children:"/"}),e.jsx("span",{children:String(r).padStart(2,"0")})]}),a&&e.jsx("div",{className:"iss-card-tag",children:a}),i&&e.jsx("h3",{children:De(i)}),s&&e.jsx("p",{children:s}),l&&l.length>0&&e.jsx("div",{className:"iss-card-stats",children:l.map(([w,f],N)=>e.jsxs("div",{className:"iss-card-stat",children:[e.jsx("span",{className:"iss-card-stat-num",children:w}),e.jsx("span",{className:"iss-card-stat-lbl",children:f})]},N))})]})}),W=(n,t,r)=>n+(t-n)*r,fe=(n,t,r)=>n<t?t:n>r?r:n,Be=n=>{const t=fe(n,0,1);return t*t*t*(t*(t*6-15)+10)},ee=[{p:0,cam:{x:0,y:1.6,z:28},look:{x:0,y:0,z:0},rotX:.05,rotY:.2,rotZ:0,fov:36,thruster:0,focus:-1,card:-1,phase:"approach"},{p:.1,cam:{x:0,y:.7,z:13.5},look:{x:0,y:.1,z:0},rotX:.18,rotY:.85,rotZ:.04,fov:40,thruster:.25,focus:-1,card:-1,phase:"active"},{p:.26,cam:{x:-1.9,y:1.8,z:6.4},look:{x:0,y:.6,z:.2},rotX:-.06,rotY:1.55,rotZ:-.04,fov:38,thruster:0,focus:0,card:0,phase:"reveal"},{p:.46,cam:{x:3.6,y:-.1,z:8},look:{x:-.4,y:1.4,z:0},rotX:.08,rotY:2.55,rotZ:.08,fov:44,thruster:0,focus:1,card:1,phase:"reveal"},{p:.66,cam:{x:-2.3,y:-.6,z:6.6},look:{x:.4,y:-.05,z:.9},rotX:.18,rotY:3.45,rotZ:-.05,fov:36,thruster:0,focus:2,card:2,phase:"reveal"},{p:.86,cam:{x:0,y:2.9,z:19.5},look:{x:0,y:-.8,z:-1.8},rotX:.28,rotY:4.25,rotZ:-.05,fov:46,thruster:.55,focus:-1,card:-1,phase:"outro"},{p:1,cam:{x:0,y:3.4,z:23},look:{x:0,y:-1.1,z:-2.4},rotX:.3,rotY:4.45,rotZ:-.06,fov:48,thruster:.25,focus:-1,card:-1,phase:"outro"}];function Oe(n){let t=0;for(;t<ee.length-2&&n>ee[t+1].p;)t++;const r=ee[t],a=ee[Math.min(t+1,ee.length-1)],i=a.p-r.p,s=i>1e-5?Be((n-r.p)/i):0;return{cam:{x:W(r.cam.x,a.cam.x,s),y:W(r.cam.y,a.cam.y,s),z:W(r.cam.z,a.cam.z,s)},look:{x:W(r.look.x,a.look.x,s),y:W(r.look.y,a.look.y,s),z:W(r.look.z,a.look.z,s)},rotX:W(r.rotX,a.rotX,s),rotY:W(r.rotY,a.rotY,s),rotZ:W(r.rotZ,a.rotZ,s),fov:W(r.fov,a.fov,s),thruster:W(r.thruster,a.thruster,s),focus:s>.65?a.focus:r.focus,card:s>.65?a.card:r.card,phase:s>.65?a.phase:r.phase}}function _e({sectionRef:n,issGroupRef:t,stationProxy:r,cameraProxy:a,lookProxy:i,thrusterProxy:s,fovProxy:l,focusProxy:c,onPhaseChange:o,onCardChange:d,damping:b=.07}={}){p.useEffect(()=>{if(!(n!=null&&n.current)){console.warn("[ISS] sectionRef.current ist null – RAF wurde nicht gestartet");return}let w=0,f=0,N=0,S=-2,I="",L=!0;const C=()=>{const u=n.current;if(!u)return;const E=u.getBoundingClientRect(),T=document.documentElement.clientHeight||window.innerHeight,D=u.offsetHeight-T;if(D<=0){f=0;return}f=fe(-E.top/D,0,1)},z=()=>{if(!L)return;w=requestAnimationFrame(z),C(),N=W(N,f,b),Math.abs(N-f)<1e-4&&(N=f);const u=Oe(N),E=performance.now()/1e3;a&&(a.x=u.cam.x,a.y=u.cam.y,a.z=u.cam.z),i&&(i.x=u.look.x,i.y=u.look.y,i.z=u.look.z),r&&(r.rotX=u.rotX,r.rotY=u.rotY,r.rotZ=u.rotZ),s&&(s.intensity=u.thruster),l&&(l.value=u.fov),c&&(c.value=u.focus);const T=t==null?void 0:t.current;T&&(T.position.x=Math.sin(E*.31)*.04,T.position.y=Math.sin(E*.23)*.055,T.position.z=Math.sin(E*.17)*.03,T.rotation.x=u.rotX+Math.sin(E*.07)*.005,T.rotation.y=u.rotY+Math.sin(E*.09)*.008,T.rotation.z=u.rotZ+Math.sin(E*.11)*.004),u.card!==S&&(S=u.card,d&&d(u.card)),u.phase!==I&&(I=u.phase,o&&o(u.phase))};return w=requestAnimationFrame(z),()=>{L=!1,cancelAnimationFrame(w)}},[n,t,r,a,i,s,l,c,o,d,b])}const le=[{tag:"Observation Layer",title:`Intelligente
<em>Beobachtung</em>`,description:"NILL überwacht jeden Kanal wie aus der Cupola — Postfach, Belege, Lager, Schichten. Alles in einer Ansicht, ohne tote Winkel.",stats:[["99,99 %","uptime"],["<2 ms","latenz"],["24/7","aktiv"]],position:"tr"},{tag:"Distributed Power",title:`Adaptive
<em>Architektur</em>`,description:"Wie Solar-Arrays, die sich zur Sonne drehen — NILLs Module skalieren, balancieren und heilen sich selbst, bevor du es bemerkst.",stats:[["400+","knoten"],["0,4 ms","failover"],["∞","skalierung"]],position:"tl"},{tag:"Deep Space Link",title:`Autonome
<em>Orchestrierung</em>`,description:"Die Schüssel zeigt nach draußen — NILL spricht mit Banken, Behörden, Lieferanten. Workloads finden ihren Weg, ohne dass du ein Ticket öffnest.",stats:[["1.200+","aufgaben/tag"],["−60 %","manuelle arbeit"],["3 s","cold start"]],position:"br"}];function Ke(){const n=p.useRef(null),t=p.useRef(null),r=[p.useRef(null),p.useRef(null),p.useRef(null)],[a,i]=p.useState(-1),[s,l]=p.useState("approach"),[c,o]=p.useState(!1),[d,b]=p.useState({x:"0.00",y:"0.00",z:"0.00"}),w=p.useMemo(()=>({rotX:0,rotY:0,rotZ:0}),[]),f=p.useMemo(()=>({x:0,y:1.6,z:28}),[]),N=p.useMemo(()=>({x:0,y:0,z:0}),[]),S=p.useMemo(()=>({intensity:0}),[]),I=p.useMemo(()=>({value:36}),[]),L=p.useMemo(()=>({value:-1}),[]);_e({sectionRef:n,issGroupRef:t,stationProxy:w,cameraProxy:f,lookProxy:N,thrusterProxy:S,fovProxy:I,focusProxy:L,onCardChange:i,onPhaseChange:l,damping:.07}),p.useEffect(()=>{let z=0,u=0;const E=T=>{z=requestAnimationFrame(E),!(T-u<120)&&(u=T,b({x:f.x.toFixed(2),y:f.y.toFixed(2),z:f.z.toFixed(2)}))};return z=requestAnimationFrame(E),()=>cancelAnimationFrame(z)},[f]);const C=z=>z===a?"active":a>z?"past":"future";return e.jsx("section",{ref:n,className:`iss-section ${c?"iss-loaded":""}`,"data-screen-label":"ISS",children:e.jsxs("div",{className:"iss-sticky","data-phase":s,children:[e.jsx("div",{className:"iss-canvas-wrap",children:e.jsx(Re,{issGroupRef:t,stationProxy:w,cameraProxy:f,lookProxy:N,thrusterProxy:S,fovProxy:I,focusProxy:L,onLoaded:()=>o(!0)})}),e.jsx("div",{className:"iss-bar top","aria-hidden":"true"}),e.jsx("div",{className:"iss-bar bot","aria-hidden":"true"}),e.jsx("div",{className:"iss-grain","aria-hidden":"true"}),e.jsxs("div",{className:"iss-hud tl",children:[e.jsxs("div",{children:[e.jsx("span",{className:"dot"}),"NILL · MISSION CONTROL"]}),e.jsx("div",{className:"label",children:"Orbital Layer · v1"})]}),e.jsxs("div",{className:"iss-hud tr",children:[e.jsx("div",{className:"label",children:"REF · NILL-OS / ISS-04"}),e.jsx("div",{className:"value",children:"42° 06′ 18″ N · 5° 23′ 41″ E"})]}),e.jsxs("div",{className:"iss-hud bl",children:[e.jsx("div",{className:"label",children:"CAMERA"}),e.jsxs("div",{className:"value",children:["x ",e.jsx("em",{children:d.x}),"  y ",e.jsx("em",{children:d.y}),"  z ",e.jsx("em",{children:d.z})]})]}),e.jsxs("div",{className:"iss-hud br",children:[e.jsx("div",{className:"label",children:"STATUS"}),e.jsx("div",{className:"value",children:s==="approach"?"APPROACH — STAND-BY":s==="reveal"?"REVEAL — MODULE FOCUS":"NOMINAL — TRACKING"})]}),e.jsx("div",{className:"iss-intro","aria-hidden":s!=="approach",children:e.jsxs("div",{className:"iss-intro-inner",children:[e.jsxs("span",{className:"eyebrow",children:[e.jsx("span",{className:"pip"}),"NILL · MISSION CONTROL"]}),e.jsxs("h2",{children:["Das Betriebssystem, das dein",e.jsx("br",{}),"Unternehmen ",e.jsx("em",{children:"im Orbit"})," hält."]}),e.jsx("p",{children:"Stell dir NILL als Raumstation vor: ein zentrales System, das alle Module deines Betriebs verbindet. Beobachtung, Energie, Kommunikation — orchestriert von einer KI, die nie schläft."})]})}),e.jsx("div",{className:"iss-outro","aria-hidden":s!=="outro",children:e.jsxs("div",{className:"iss-outro-inner",children:[e.jsxs("span",{className:"eyebrow",children:[e.jsx("span",{className:"pip"}),"READY · LAUNCH WINDOW OPEN"]}),e.jsxs("h2",{children:["Eine Plattform.",e.jsx("br",{}),"Ein Login. ",e.jsx("em",{children:"Alle Module."})]}),e.jsx("p",{children:"NILL hält deinen Betrieb in der Umlaufbahn — 24/7, ohne Tickets, ohne Bauchschmerzen. Bereit, die Station zu betreten?"}),e.jsxs("a",{className:"iss-outro-cta",href:"#cta",children:["Demo anfragen ",e.jsx("span",{className:"arrow",children:"→"})]})]})}),e.jsx("div",{className:"iss-card-stage",children:le.map((z,u)=>e.jsx(Ge,{ref:r[u],index:u,total:le.length,tag:z.tag,title:z.title,description:z.description,stats:z.stats,position:z.position,state:C(u)},u))}),e.jsx("div",{className:"iss-progress","aria-hidden":"true",children:le.map((z,u)=>e.jsx("div",{className:`iss-progress-dot ${u===a?"active":u<a?"passed":""}`},u))}),e.jsxs("div",{className:`iss-scroll-hint ${s!=="approach"?"hidden":""}`,children:[e.jsx("span",{children:"scroll · mission"}),e.jsx("span",{className:"iss-scroll-hint-line"})]})]})})}const $e=`
:root{
  --bg:#02030a;--bg-2:#06070f;--ink:#efede7;--ink-dim:rgba(239,237,231,.5);--ink-faint:rgba(239,237,231,.14);
  --line:rgba(239,237,231,.07);--glass:rgba(255,255,255,.035);--glass-strong:rgba(255,255,255,.06);
  --accent:#c6ff3c;--accent-2:#7a5cff;--accent-3:#ff4d8d;--accent-4:#38f5d0;
  --serif:"Fraunces","Iowan Old Style",Georgia,serif;
  --sans:"Inter",system-ui,sans-serif;--mono:"JetBrains Mono",monospace;
  --radius:18px;--radius-lg:28px;--ease:cubic-bezier(.2,.7,.2,1);--ease-out:cubic-bezier(.16,1,.3,1);
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden}
html{scroll-behavior:smooth}
img,svg,canvas{display:block;max-width:100%}
a{color:inherit;text-decoration:none;cursor:pointer}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
::selection{background:var(--accent);color:#000}

.vignette{position:fixed;inset:0;pointer-events:none;z-index:99;background:radial-gradient(140% 90% at 50% 10%,transparent 60%,rgba(0,0,0,.55) 100%)}
.wrap{width:min(1320px,100% - 48px);margin-inline:auto}
.wrap-tight{width:min(1040px,100% - 48px);margin-inline:auto}

.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-dim);display:inline-flex;align-items:center;gap:10px}
.eyebrow::before{content:"";width:22px;height:1px;background:currentColor;opacity:.6}

h1,h2,h3,h4{font-family:var(--serif);font-weight:400;font-variation-settings:"opsz" 144,"SOFT" 0,"WONK" 0;letter-spacing:-.02em;line-height:.95}
h1{font-size:clamp(56px,11vw,176px)}
h2{font-size:clamp(40px,7vw,112px);letter-spacing:-.025em}
h3{font-size:clamp(28px,3.4vw,52px);letter-spacing:-.02em}
p{font-size:clamp(15px,1.1vw,18px);line-height:1.55;color:var(--ink-dim)}
.lead{font-size:clamp(17px,1.4vw,22px);line-height:1.45;color:var(--ink);max-width:56ch}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:60;padding:18px 0;transition:backdrop-filter .4s,background .4s}
.nav.scrolled{backdrop-filter:blur(14px) saturate(140%);background:rgba(8,8,10,.55);border-bottom:1px solid var(--line)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;gap:24px}
.brand{display:flex;align-items:center;gap:12px;font-family:var(--serif);font-size:22px;letter-spacing:-.02em}
.brand-mark{width:28px;height:28px;border-radius:8px;background:conic-gradient(from 210deg,var(--accent),var(--accent-4),var(--accent-2),var(--accent-3),var(--accent));position:relative;overflow:hidden}
.brand-mark::after{content:"";position:absolute;inset:4px;border-radius:5px;background:var(--bg)}
.brand-mark::before{content:"";position:absolute;inset:-50%;background:conic-gradient(from 0deg,transparent 0 340deg,rgba(255,255,255,.6) 355deg,transparent 360deg);animation:spin 6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.nav ul{display:flex;gap:8px;list-style:none}
.nav ul a{font-size:13px;color:var(--ink-dim);padding:8px 14px;border-radius:99px;transition:color .25s,background .25s}
.nav ul a:hover{color:var(--ink);background:var(--glass)}
.nav-auth{display:flex;align-items:center;gap:8px}
.btn-auth{font-size:13px;color:var(--ink);padding:9px 16px;border-radius:99px;border:1px solid var(--line);background:transparent;transition:border-color .25s,background .25s,color .25s}
.btn-auth:hover{border-color:var(--ink);background:var(--glass)}
.btn-auth.primary{background:var(--accent);color:#050505;border-color:var(--accent)}
.btn-auth.primary:hover{background:#fff;border-color:#fff;color:#050505}
@media(max-width:860px){.nav ul{display:none}.btn-auth{padding:8px 12px;font-size:12px}}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:10px;padding:13px 22px;border-radius:99px;font-size:14px;font-weight:500;position:relative;overflow:hidden;isolation:isolate;transition:transform .35s var(--ease-out),color .3s}
.btn-primary{background:var(--accent);color:#050505}
.btn-primary::after{content:"";position:absolute;inset:0;z-index:-1;background:#fff;transform:translateY(101%);transition:transform .5s var(--ease-out)}
.btn-primary:hover::after{transform:translateY(0)}
.btn-ghost{border:1px solid var(--line);color:var(--ink);background:transparent}
.btn-ghost:hover{border-color:var(--ink);background:var(--glass)}
.btn .arrow{display:inline-block;transition:transform .3s var(--ease-out)}
.btn:hover .arrow{transform:translateX(4px)}

/* HERO */
.hero{position:relative;min-height:100vh;min-height:100svh;padding:140px 0 0;display:flex;align-items:center;overflow:hidden}
.hero::after{content:"";position:absolute;left:0;right:0;bottom:0;height:24vh;background:linear-gradient(to bottom,transparent,#02030a);z-index:2;pointer-events:none}
.iss-section{margin-top:-22vh!important}
.hero-inner{position:relative;z-index:3;width:100%}
.hero-eyebrow{margin-bottom:24px}
.hero h1{margin-bottom:28px;max-width:14ch}
.hero h1 .word{display:inline-block;overflow:hidden;vertical-align:baseline}
.hero h1 .word>span{display:inline-block;transform:translateY(110%);transition:transform 1.1s var(--ease-out)}
.hero.revealed h1 .word>span{transform:translateY(0)}
.hero h1 em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.hero .lead{margin-bottom:44px;opacity:0;transform:translateY(20px);transition:opacity .9s .6s,transform .9s .6s var(--ease-out)}
.hero.revealed .lead{opacity:1;transform:none}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;opacity:0;transform:translateY(20px);transition:opacity .9s .85s,transform .9s .85s var(--ease-out)}
.hero.revealed .hero-cta{opacity:1;transform:none}
.hero-meta{position:absolute;left:24px;right:24px;bottom:26px;z-index:3;display:flex;justify-content:space-between;align-items:end;font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim)}
.scroll-ind{display:flex;align-items:center;gap:10px}
.scroll-bar{width:1px;height:44px;background:var(--line);position:relative;overflow:hidden}
.scroll-bar::after{content:"";position:absolute;left:0;right:0;top:-50%;height:50%;background:var(--accent);animation:scrollbar 2.2s infinite}
@keyframes scrollbar{0%{top:-50%}100%{top:100%}}

/* CHIPS */
.hero-chips{position:absolute;inset:0;z-index:1;pointer-events:none}
.chip{position:absolute;padding:8px 14px;border-radius:99px;background:var(--glass-strong);border:1px solid var(--line);backdrop-filter:blur(14px);font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:var(--ink);display:inline-flex;align-items:center;gap:8px;animation:float 9s ease-in-out infinite}
.chip-dot{width:6px;height:6px;border-radius:50%;background:var(--accent)}
.chip.c1{top:18%;left:6%;animation-delay:-1s}
.chip.c2{top:30%;right:8%;animation-delay:-3s}
.chip.c3{bottom:24%;left:12%;animation-delay:-5s}
.chip.c4{bottom:32%;right:14%;animation-delay:-7s}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}

/* TICKER */
.ticker{border-block:1px solid var(--line);padding:22px 0;overflow:hidden;background:linear-gradient(to right,var(--bg-2),var(--bg) 50%,var(--bg-2))}
.ticker-track{display:flex;gap:64px;white-space:nowrap;animation:ticker 40s linear infinite;font-family:var(--serif);font-size:clamp(24px,3vw,40px);letter-spacing:-.02em}
.ticker-track span{display:inline-flex;align-items:center;gap:64px;color:var(--ink)}
.ticker-track em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100}
.ticker-sep{width:8px;height:8px;background:var(--accent);border-radius:50%;display:inline-block}
@keyframes ticker{to{transform:translateX(-50%)}}

section{position:relative;padding:160px 0}
.section-head{display:flex;justify-content:space-between;align-items:end;gap:40px;margin-bottom:72px}
.section-head h2{max-width:16ch}
.section-head .lead{max-width:36ch}
@media(max-width:780px){.section-head{flex-direction:column;align-items:flex-start}}
.reveal{opacity:0;transform:translateY(40px);transition:opacity 1s var(--ease-out),transform 1s var(--ease-out)}
.reveal.in{opacity:1;transform:none}
.reveal-delay-1{transition-delay:.08s}

/* BENTO */
.bento{display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:200px;gap:16px}
.card{position:relative;overflow:hidden;border-radius:var(--radius-lg);background:radial-gradient(120% 100% at 0% 0%,rgba(255,255,255,.035),transparent 50%),linear-gradient(180deg,#0b0b10,#060609);border:1px solid var(--line);padding:28px;display:flex;flex-direction:column;justify-content:space-between;transition:transform .6s var(--ease-out),border-color .5s;isolation:isolate}
.card::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(600px 300px at var(--mx,50%) var(--my,0%),rgba(198,255,60,.08),transparent 55%);opacity:0;transition:opacity .5s}
.card:hover::before{opacity:1}
.card:hover{border-color:rgba(245,243,238,.16);transform:translateY(-4px)}
.card .tag{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim);display:inline-flex;gap:8px;align-items:center}
.card .n{color:var(--accent)}
.card h3{margin-top:18px}
.card p{margin-top:10px;max-width:32ch}
.k1{grid-column:span 7;grid-row:span 2}.k2{grid-column:span 5;grid-row:span 2}
.k3{grid-column:span 4;grid-row:span 2}.k4{grid-column:span 4;grid-row:span 2}
.k5{grid-column:span 4;grid-row:span 2}.k6{grid-column:span 12;grid-row:span 1}
.k6{flex-direction:row!important;align-items:center!important;justify-content:space-between!important;gap:30px!important}
.badge{padding:6px 12px;border-radius:99px;background:rgba(198,255,60,.12);color:var(--accent);font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase}
@media(max-width:1020px){.bento{grid-template-columns:repeat(6,1fr);grid-auto-rows:180px}.k1{grid-column:span 6}.k2{grid-column:span 6}.k3,.k4,.k5{grid-column:span 3}.k6{grid-column:span 6;flex-direction:column!important;align-items:flex-start!important}}
@media(max-width:620px){.bento{grid-template-columns:1fr}.card{grid-column:1/-1!important}}
.viz{position:absolute;inset:0;pointer-events:none;z-index:0}
.mail-row{opacity:0;transform:translateX(40px);animation:slideIn 4s var(--ease-out) infinite}
.mail-row:nth-child(2){animation-delay:-1s}.mail-row:nth-child(3){animation-delay:-2s}.mail-row:nth-child(4){animation-delay:-3s}
@keyframes slideIn{0%{opacity:0;transform:translateX(40px)}20%{opacity:1;transform:translateX(0)}70%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(-40px)}}

/* FEATURE STICKY */
.feature-sticky{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:flex-start}
.step-item{padding:22vh 0;border-top:1px solid var(--line)}
.step-item:first-child{border-top:0}
.step-item h3{margin-bottom:18px}
.step-item p{max-width:40ch;color:var(--ink)}
.visual-col{position:sticky;top:18vh;height:64vh;border-radius:var(--radius-lg);border:1px solid var(--line);background:linear-gradient(180deg,#08080d,#040407);overflow:hidden}
.feature-visual{position:absolute;inset:0;display:grid;place-items:center}
.device{width:84%;aspect-ratio:4/3;border-radius:14px;background:linear-gradient(180deg,#0f0f14,#07070b);border:1px solid var(--line);padding:18px;position:relative;overflow:hidden;box-shadow:0 60px 120px rgba(0,0,0,.75),inset 0 1px 0 rgba(255,255,255,.04)}
.device-dots{display:flex;gap:6px;margin-bottom:16px}
.device-dots span{width:10px;height:10px;border-radius:50%;background:var(--line)}
.device-frame{position:absolute;inset:46px 18px 18px;border-radius:8px;background:#06060a;overflow:hidden;border:1px solid var(--line)}
.scene{position:absolute;inset:0;opacity:0;transition:opacity .6s var(--ease-out)}
.scene.active{opacity:1}
.inbox-row{display:grid;grid-template-columns:24px 120px 1fr 60px;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line);font-size:12px}
.inbox-row.hi{background:rgba(198,255,60,.05)}
.inbox-dot{width:8px;height:8px;border-radius:50%;background:var(--accent-2)}
.inbox-name{color:var(--ink)}.inbox-snippet{color:var(--ink-dim);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.inbox-time{color:var(--ink-dim);text-align:right;font-family:var(--mono);font-size:10px}
.ai-reply{margin:14px;padding:14px;border-radius:10px;background:rgba(198,255,60,.06);border:1px solid rgba(198,255,60,.25);font-size:12px;line-height:1.55;color:var(--ink);position:relative}
.ai-reply::before{content:"KI-ANTWORT";position:absolute;top:-8px;left:12px;background:var(--bg);padding:0 6px;font-family:var(--mono);font-size:9px;letter-spacing:.2em;color:var(--accent)}
.typing{display:inline-block;width:6px;height:12px;background:var(--accent);animation:blink .9s infinite;vertical-align:middle}
@keyframes blink{50%{opacity:0}}
.ledger-head,.ledger-row{display:grid;grid-template-columns:70px 1fr 90px 80px;gap:10px;padding:10px 14px;font-size:11px;align-items:center}
.ledger-head{color:var(--ink-dim);font-family:var(--mono);letter-spacing:.15em;text-transform:uppercase;border-bottom:1px solid var(--line)}
.ledger-row{border-bottom:1px solid var(--line);font-size:12px}
.cat{display:inline-block;padding:3px 8px;border-radius:99px;background:var(--glass);font-family:var(--mono);font-size:10px;color:var(--ink)}
.amount{font-family:var(--mono);text-align:right}.amount.neg{color:var(--accent-3)}.amount.pos{color:var(--accent)}
.ocr-blip{position:absolute;right:14px;top:14px;font-family:var(--mono);font-size:10px;color:var(--accent);display:flex;gap:6px;align-items:center}
.ocr-pulse{width:6px;height:6px;background:var(--accent);border-radius:50%;animation:pulse 1.4s infinite}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.8);opacity:0}}
.inv-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:14px}
.inv-cell{aspect-ratio:1;border-radius:8px;border:1px solid var(--line);display:grid;place-items:center;font-family:var(--mono);font-size:10px;color:var(--ink-dim)}
.inv-cell.lo{background:rgba(255,77,141,.12);border-color:rgba(255,77,141,.4);color:var(--accent-3)}
.inv-cell.ok{background:rgba(198,255,60,.06);border-color:rgba(198,255,60,.3);color:var(--accent)}
.inv-legend{padding:0 14px 14px;display:flex;gap:14px;font-family:var(--mono);font-size:10px;color:var(--ink-dim)}
.inv-legend span::before{content:"";display:inline-block;width:8px;height:8px;margin-right:6px;background:var(--accent);border-radius:2px}
.inv-legend span.lo::before{background:var(--accent-3)}
.time-ring{position:absolute;inset:0;display:grid;place-items:center}
.time-svg{width:60%;aspect-ratio:1}
.team-list{padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.team-tile{padding:14px;border:1px solid var(--line);border-radius:10px;display:flex;gap:12px;align-items:center}
.avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--accent-2),var(--accent-4));display:grid;place-items:center;font-family:var(--mono);font-size:12px;color:#000;font-weight:600}
.team-name{font-size:12px}.team-role{font-size:10px;color:var(--ink-dim);font-family:var(--mono)}
.step-index{font-family:var(--mono);font-size:12px;letter-spacing:.2em;color:var(--ink-dim);margin-bottom:16px}
.step-index em{font-style:normal;color:var(--accent)}
@media(max-width:980px){.feature-sticky{grid-template-columns:1fr}.visual-col{position:relative;top:0;height:440px}.step-item{padding:60px 0}}

/* STATS */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:60px 0}
.stat .num{font-family:var(--serif);font-size:clamp(56px,7vw,96px);letter-spacing:-.04em;line-height:1;display:flex;align-items:baseline;gap:4px}
.stat .num em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 80,"WONK" 1}
.stat .label{margin-top:8px;font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim)}
@media(max-width:780px){.stats{grid-template-columns:repeat(2,1fr)}}

/* QUOTES */
.quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.quote{padding:28px;border-radius:var(--radius-lg);border:1px solid var(--line);background:var(--glass);display:flex;flex-direction:column;gap:18px;transition:transform .5s var(--ease-out),border-color .3s}
.quote:hover{transform:translateY(-4px);border-color:var(--ink-faint)}
.quote blockquote{font-family:var(--serif);font-size:22px;line-height:1.3;letter-spacing:-.01em}
.quote blockquote em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.quote footer{display:flex;align-items:center;gap:12px;margin-top:auto}
.quote footer .name{font-size:13px}.quote footer .role{font-size:11px;color:var(--ink-dim);font-family:var(--mono)}
@media(max-width:860px){.quotes{grid-template-columns:1fr}}

/* PRICING */
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;perspective:1400px}
.price{padding:34px;border-radius:var(--radius-lg);border:1px solid var(--line);background:linear-gradient(180deg,#0a0a0e,#060609);display:flex;flex-direction:column;gap:22px;position:relative;transition:transform .5s var(--ease-out),border-color .3s,box-shadow .5s}
.price.pop{border-color:rgba(198,255,60,.4);background:radial-gradient(120% 80% at 0% 0%,rgba(198,255,60,.07),transparent 50%),linear-gradient(180deg,#0c0d08,#070805);box-shadow:0 30px 80px rgba(198,255,60,.07)}
.price-tag{display:flex;align-items:baseline;gap:8px}
.price-tag .num{font-family:var(--serif);font-size:72px;letter-spacing:-.04em;line-height:1}
.price-tag .per{font-family:var(--mono);font-size:12px;color:var(--ink-dim);letter-spacing:.1em}
.price ul{list-style:none;display:flex;flex-direction:column;gap:10px;padding-top:18px;border-top:1px solid var(--line)}
.price ul li{font-size:14px;display:flex;align-items:flex-start;gap:10px;color:var(--ink)}
.price ul li::before{content:"";width:16px;height:16px;border-radius:50%;background:radial-gradient(circle,var(--accent) 0 35%,transparent 36%);border:1px solid rgba(198,255,60,.4);flex:0 0 16px;margin-top:3px}
.pop-chip{position:absolute;top:-12px;left:28px;padding:6px 12px;border-radius:99px;background:var(--accent);color:#000;font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase}
@media(max-width:860px){.pricing-grid{grid-template-columns:1fr}}

/* NACHHALTIGKEIT */
#nachhaltigkeit{background:radial-gradient(60% 90% at 20% 10%,rgba(56,245,208,.05),transparent 60%),radial-gradient(50% 80% at 85% 80%,rgba(198,255,60,.05),transparent 60%)}
.nh-hero{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center;padding:20px 0 60px}
.nh-leaf{position:relative;aspect-ratio:1;border-radius:32px;overflow:hidden;background:radial-gradient(80% 60% at 30% 20%,rgba(198,255,60,.35),transparent 60%),radial-gradient(70% 60% at 80% 90%,rgba(56,245,208,.3),transparent 60%),linear-gradient(135deg,#0a1210,#041011);border:1px solid rgba(198,255,60,.18);display:flex;align-items:center;justify-content:center}
.nh-leaf svg{width:65%;height:65%;filter:drop-shadow(0 0 40px rgba(198,255,60,.35))}
.nh-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:60px}
.nh-stat{padding:28px;border-radius:var(--radius-lg);background:radial-gradient(120% 100% at 0% 0%,rgba(198,255,60,.05),transparent 55%),linear-gradient(180deg,#0a120f,#050a08);border:1px solid rgba(198,255,60,.12)}
.nh-stat .val{font-family:var(--serif);font-size:clamp(44px,5vw,68px);letter-spacing:-.03em;line-height:1;color:var(--ink);font-variation-settings:"opsz" 144,"SOFT" 40,"WONK" 0}
.nh-stat .val em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.nh-stat .lbl{font-family:var(--mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-dim);margin-top:14px;display:block}
.nh-stat p{margin-top:14px;font-size:14px}
.nh-pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px}
.nh-pillar{padding:28px;border-radius:var(--radius-lg);background:linear-gradient(180deg,#080b0a,#040707);border:1px solid var(--line);position:relative;overflow:hidden}
.nh-pillar::before{content:"";position:absolute;inset:0;background:radial-gradient(400px 200px at 0% 0%,rgba(56,245,208,.06),transparent 60%)}
.nh-pillar .num{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--accent)}
.nh-pillar h3{font-size:clamp(22px,2.2vw,30px);margin-top:14px}
.nh-pillar p{margin-top:12px;font-size:15px}
.nh-pledge{margin-top:60px;padding:44px;border-radius:var(--radius-lg);border:1px solid rgba(198,255,60,.2);background:radial-gradient(60% 90% at 100% 0%,rgba(198,255,60,.08),transparent 60%),linear-gradient(180deg,rgba(198,255,60,.025),transparent);display:flex;justify-content:space-between;align-items:center;gap:30px;flex-wrap:wrap}
.nh-pledge .big{font-family:var(--serif);font-size:clamp(22px,2.4vw,32px);line-height:1.25;max-width:48ch;letter-spacing:-.015em}
.nh-pledge .big em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
@media(max-width:1020px){.nh-hero{grid-template-columns:1fr;gap:32px}.nh-stats,.nh-pillars{grid-template-columns:1fr 1fr}}
@media(max-width:620px){.nh-stats,.nh-pillars{grid-template-columns:1fr}.nh-pledge{padding:28px}}

/* FAQ */
.faq{display:flex;flex-direction:column;border-top:1px solid var(--line)}
.faq details{border-bottom:1px solid var(--line);padding:22px 4px;transition:background .3s}
.faq details[open]{background:linear-gradient(to right,rgba(198,255,60,.02),transparent 60%)}
.faq summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:24px;font-family:var(--serif);font-size:clamp(22px,2.2vw,30px);letter-spacing:-.015em;cursor:pointer}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font-family:var(--mono);font-size:28px;color:var(--accent);transition:transform .3s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq .a{padding:14px 0 4px;color:var(--ink-dim);max-width:70ch}

/* BIG CTA */
.cta-big{position:relative;padding:180px 0;overflow:hidden;isolation:isolate}
.cta-big::before{content:"";position:absolute;inset:-20%;background:radial-gradient(60% 50% at 20% 30%,rgba(122,92,255,.30),transparent 60%),radial-gradient(50% 60% at 80% 70%,rgba(198,255,60,.22),transparent 60%),radial-gradient(40% 40% at 60% 20%,rgba(255,77,141,.20),transparent 60%);filter:blur(50px);z-index:-1;animation:blobshift 14s ease-in-out infinite}
@keyframes blobshift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(3%,-2%) scale(1.05)}66%{transform:translate(-2%,3%) scale(.97)}}
.cta-big h2{font-size:clamp(64px,12vw,180px)}
.cta-big h2 em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.cta-sub{display:flex;justify-content:space-between;align-items:end;margin-top:40px;gap:30px}
.cta-sub .lead{max-width:40ch}

/* FOOTER */
footer{border-top:1px solid var(--line);padding:80px 0 40px}
.foot-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:40px;align-items:flex-start;padding-bottom:80px}
.foot-grid h4{font-family:var(--mono);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:16px;font-weight:500}
.foot-grid ul{list-style:none;display:flex;flex-direction:column;gap:8px}
.foot-grid a{font-size:14px;color:var(--ink)}.foot-grid a:hover{color:var(--accent)}
.wordmark{font-family:var(--serif);font-size:clamp(90px,22vw,360px);letter-spacing:-.05em;line-height:.85;padding-top:30px;border-top:1px solid var(--line);overflow:hidden}
.wordmark em{font-style:italic;color:var(--accent);font-variation-settings:"opsz" 144,"SOFT" 100,"WONK" 1}
.foot-meta{display:flex;justify-content:space-between;font-family:var(--mono);font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-dim);padding-top:24px}
@media(max-width:860px){.foot-grid{grid-template-columns:repeat(2,1fr)}}

/* MODAL */
.modal-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .3s}
.modal-overlay.open{opacity:1;pointer-events:all}
.modal-bg{position:absolute;inset:0;background:rgba(2,6,12,.72);backdrop-filter:blur(18px)}
.modal-panel{position:relative;width:min(560px,100%);background:linear-gradient(180deg,rgba(18,22,28,.96),rgba(10,13,18,.98));border:1px solid var(--line);border-radius:20px;padding:34px;box-shadow:0 40px 120px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.04);transform:translateY(18px) scale(.98);transition:transform .5s var(--ease-out)}
.modal-overlay.open .modal-panel{transform:none}
.modal-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--ink-dim);text-transform:uppercase;margin-bottom:10px}
.modal-panel h3{font-family:var(--serif);font-weight:300;font-size:34px;line-height:1;letter-spacing:-.02em;margin:0 0 8px;color:var(--ink)}
.modal-panel h3 em{color:var(--accent);font-style:italic}
.modal-panel p.sub{margin:0 0 22px;color:var(--ink-dim);font-size:15px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.form-field{margin-bottom:12px}
label{display:block;font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--ink-dim);text-transform:uppercase;margin-bottom:6px}
input,textarea{width:100%;background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:10px;padding:12px 14px;color:var(--ink);font:inherit;font-size:14px;outline:none;transition:border-color .2s,background .2s}
input:focus,textarea:focus{border-color:var(--accent);background:rgba(176,255,102,.04)}
textarea{min-height:92px;resize:vertical}
.modal-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px}
.modal-actions small{color:var(--ink-dim);font-size:12px}
.modal-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--ink-dim);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}
.modal-close:hover{background:rgba(255,255,255,.06);color:var(--ink)}
@media(max-width:540px){.form-row{grid-template-columns:1fr}}
`;let he=!1,xe=!1;function He(){if(he)return;he=!0;const n=document.createElement("style");if(n.textContent=$e,document.head.appendChild(n),document.title="NILL — Intelligenz, die mitarbeitet.",!window.THREE&&!xe){xe=!0;const t=document.createElement("script");t.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",document.head.appendChild(t)}}function $(n=.12){const t=p.useRef(null),[r,a]=p.useState(!1);return p.useEffect(()=>{if(!t.current)return;const i=new IntersectionObserver(([s])=>{s.isIntersecting&&(a(!0),i.disconnect())},{threshold:n});return i.observe(t.current),()=>i.disconnect()},[]),[t,r]}function ge(n){p.useEffect(()=>{const t=n.current;if(!t)return;const r=i=>{const s=t.getBoundingClientRect();t.style.setProperty("--mx",(i.clientX-s.left)/s.width*100+"%"),t.style.setProperty("--my",(i.clientY-s.top)/s.height*100+"%");const l=(i.clientY-s.top-s.height/2)/s.height*-4,c=(i.clientX-s.left-s.width/2)/s.width*4;t.style.transform=`translateY(-4px) perspective(900px) rotateX(${l}deg) rotateY(${c}deg)`},a=()=>t.style.transform="";return t.addEventListener("mousemove",r),t.addEventListener("mouseleave",a),()=>{t.removeEventListener("mousemove",r),t.removeEventListener("mouseleave",a)}},[])}function Ve(n){p.useEffect(()=>{const t=n.current;if(!t)return;const r=i=>{const s=t.getBoundingClientRect();t.style.transform=`translate(${(i.clientX-s.left-s.width/2)/s.width*18}px,${(i.clientY-s.top-s.height/2)/s.height*18}px)`},a=()=>t.style.transform="";return t.addEventListener("mousemove",r),t.addEventListener("mouseleave",a),()=>{t.removeEventListener("mousemove",r),t.removeEventListener("mouseleave",a)}},[])}function R({className:n,children:t,onClick:r,href:a}){const i=p.useRef(null);return Ve(i),a?e.jsx("a",{ref:i,href:a,className:n,onClick:r,children:t}):e.jsx("button",{ref:i,className:n,onClick:r,children:t})}function Z({className:n,style:t,children:r}){const a=p.useRef(null);return ge(a),e.jsx("article",{ref:a,className:`card ${n||""}`,style:t,children:r})}const me=`
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
`,Ye=`
  varying vec3 vLP;varying vec3 vWP;varying vec3 vWN;
  void main(){
    vLP=position;
    vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;
    vWN=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*wp;
  }
`,Ue=`
  varying vec3 vWP;varying vec3 vWN;
  void main(){
    vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;
    vWN=normalize(mat3(modelMatrix)*normal);
    gl_Position=projectionMatrix*viewMatrix*wp;
  }
`,qe=`
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
`;function Ze(n){return me+`
    varying vec3 vLP;varying vec3 vWP;varying vec3 vWN;
    uniform float uTime;uniform vec3 uSunPos;uniform vec3 uAtmo;
    ${n}
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
  `}const Xe=`
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
`,Je=`
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
`,Qe=`
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
`,et=`
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
`,tt=`
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
`,at=`
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
`,nt=me+`
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
`;function rt(n){const t=THREE,r=new t.WebGLRenderer({canvas:n,antialias:!1,powerPreference:"high-performance"});r.setPixelRatio(Math.min(devicePixelRatio,1)),r.setClearColor(131850,1);const a=new t.Scene,i=new t.PerspectiveCamera(42,2,.1,300);i.position.set(0,1.8,11),i.lookAt(0,0,0);const s=2200,l=new Float32Array(s*3),c=new Float32Array(s),o=new Float32Array(s*3);for(let h=0;h<s;h++){const M=60+Math.random()*70,j=Math.random()*Math.PI*2,A=Math.acos(2*Math.random()-1);l[h*3]=M*Math.sin(A)*Math.cos(j),l[h*3+1]=M*Math.sin(A)*Math.sin(j),l[h*3+2]=M*Math.cos(A),c[h]=.4+Math.random()*1.4;const F=Math.random();o[h*3]=F<.15?1:F>.85?.7:.95,o[h*3+1]=F<.15?.85:F>.85?.8:.95,o[h*3+2]=F<.15?.7:F>.85?1:.95}const d=new t.BufferGeometry;d.setAttribute("position",new t.BufferAttribute(l,3)),d.setAttribute("starSize",new t.BufferAttribute(c,1)),d.setAttribute("color",new t.BufferAttribute(o,3));const b=new t.ShaderMaterial({uniforms:{},vertexShader:"attribute float starSize;attribute vec3 color;varying vec3 vC;void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=starSize*(700./-mv.z);gl_Position=projectionMatrix*mv;}",fragmentShader:"varying vec3 vC;void main(){vec2 uv=gl_PointCoord-.5;float a=1.-smoothstep(.25,.5,length(uv));if(a<.01)discard;gl_FragColor=vec4(vC,a*.85);}",transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}),w=new t.Points(d,b);a.add(w);const f=new t.Group;f.rotation.x=-.55,f.rotation.z=.07,a.add(f);const N=new t.Group;f.add(N);const S=new t.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:"varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:me+`
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
        col*=.3+limb*.95; col*=1.7;
        gl_FragColor=vec4(col,1.);
      }
    `}),I=new t.Mesh(new t.SphereGeometry(.92,64,48),S);N.add(I);const L=h=>{const M=document.createElement("canvas");M.width=M.height=256;const j=M.getContext("2d"),A=j.createRadialGradient(128,128,0,128,128,128);h.forEach(([Y,U])=>A.addColorStop(Y,U)),j.fillStyle=A,j.fillRect(0,0,256,256);const F=new t.CanvasTexture(M);return F.minFilter=t.LinearFilter,F},C=(h,M,j)=>{const A=new t.Sprite(new t.SpriteMaterial({map:M,transparent:!0,opacity:j,blending:t.AdditiveBlending,depthWrite:!1,depthTest:!1}));return A.scale.set(h,h,1),N.add(A),A},z=L([[0,"rgba(255,240,190,1)"],[.2,"rgba(255,150,50,.5)"],[.55,"rgba(198,255,60,.12)"],[1,"rgba(0,0,0,0)"]]),u=L([[0,"rgba(0,0,0,0)"],[.55,"rgba(255,130,40,.08)"],[.75,"rgba(120,80,220,.12)"],[1,"rgba(0,0,0,0)"]]),E=L([[0,"rgba(0,0,0,0)"],[.6,"rgba(80,60,180,.06)"],[.85,"rgba(198,255,60,.05)"],[1,"rgba(0,0,0,0)"]]),T=C(5.5,z,.82),D=C(10,u,.48),te=C(17,E,.24),ae=[{r:2.2,sz:.3,spd:.26,phase:.3,tilt:.03,surf:Xe,atmo:[.55,.9,.22],atmoI:.55},{r:3.05,sz:.4,spd:.19,phase:1.6,tilt:-.05,surf:Je,atmo:[.18,.88,.9],atmoI:.48},{r:3.88,sz:.28,spd:.15,phase:3,tilt:.04,surf:Qe,atmo:[.92,.28,.2],atmoI:.38},{r:4.92,sz:.55,spd:.11,phase:4.7,tilt:-.03,surf:et,atmo:[.88,.68,.35],atmoI:.42,rings:!0},{r:6.08,sz:.34,spd:.09,phase:5.9,tilt:.05,surf:tt,atmo:[.72,.7,.66],atmoI:.22},{r:7.12,sz:.22,spd:.07,phase:1.2,tilt:-.04,surf:at,atmo:[.78,1,.28],atmoI:.5,future:!0}],O=new t.Vector3,H=[];ae.forEach(h=>{const M=new t.Mesh(new t.RingGeometry(h.r-.005,h.r+.005,160),new t.MeshBasicMaterial({color:16777215,transparent:!0,opacity:h.future?.04:.07,side:t.DoubleSide,depthWrite:!1}));M.rotation.x=Math.PI/2+h.tilt,f.add(M);const j=h.rings?64:56,A=new t.ShaderMaterial({uniforms:{uTime:{value:0},uSunPos:{value:new t.Vector3},uAtmo:{value:new t.Color(...h.atmo)}},vertexShader:Ye,fragmentShader:Ze(h.surf)}),F=new t.Mesh(new t.SphereGeometry(h.sz,j,Math.round(j*.65)),A);f.add(F);const Y=new t.ShaderMaterial({side:t.FrontSide,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,uniforms:{uSunPos:{value:new t.Vector3},uColor:{value:new t.Color(...h.atmo)},uIntensity:{value:h.future?.28:h.atmoI}},vertexShader:Ue,fragmentShader:qe}),U=new t.Mesh(new t.SphereGeometry(h.sz*1.12,32,22),Y);f.add(U);let B=null;if(h.rings){const _=h.sz*1.55,q=h.sz*2.72;B=new t.Mesh(new t.RingGeometry(_,q,140,1),new t.ShaderMaterial({side:t.DoubleSide,transparent:!0,depthWrite:!1,uniforms:{uInner:{value:_},uOuter:{value:q},uSunPos:{value:new t.Vector3}},vertexShader:"varying vec3 vLP;varying vec3 vWP;void main(){vLP=position;vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}",fragmentShader:nt})),B.rotation.x=-Math.PI/2+.2,B.rotation.z=.1,f.add(B)}H.push({mesh:F,pMat:A,atmo:U,atmoMat:Y,ring:B,def:h})});let X=0,J=0,V=0,Q=0,v=0;const m=h=>{X=h.clientX/innerWidth-.5,J=h.clientY/innerHeight-.5},x=()=>{v=Math.min(window.scrollY/innerHeight,1.2)};addEventListener("pointermove",m,{passive:!0}),addEventListener("scroll",x,{passive:!0});const y=()=>{const h=n.parentElement;if(!h)return;const M=h.clientWidth,j=h.clientHeight;r.setSize(M,j,!1),i.aspect=M/j,i.updateProjectionMatrix()};y(),addEventListener("resize",y);const g=performance.now();let k=g,P;const G=()=>{P=requestAnimationFrame(G);const h=performance.now(),M=Math.min((h-k)/1e3,1/20);k=h;const j=(h-g)/1e3;V+=(X-V)*.05,Q+=(J-Q)*.05,f.rotation.y=j*.028+V*.26,f.rotation.x=-.55+Q*.09-v*.16,f.position.y=-v*.7,S.uniforms.uTime.value=j,I.rotation.y=j*.07,I.scale.setScalar(1+Math.sin(j*.9)*.018),D.material.opacity=.46+Math.sin(j*1.1)*.04,te.material.opacity=.22+Math.sin(j*.7+1.2)*.04,T.material.opacity=.8+Math.sin(j*1.2)*.07,N.getWorldPosition(O),w.rotation.y=j*.003;for(const{mesh:A,pMat:F,atmo:Y,atmoMat:U,ring:B,def:_}of H){const q=_.phase+j*_.spd,re=Math.cos(q)*_.r,se=Math.sin(q*.55+_.tilt*4)*.22,ie=Math.sin(q)*_.r;A.position.set(re,se,ie),A.rotation.y+=M*.18,F.uniforms.uTime.value=j,F.uniforms.uSunPos.value.copy(O),Y.position.set(re,se,ie),U.uniforms.uSunPos.value.copy(O),B&&(B.position.set(re,se,ie),B.material.uniforms.uSunPos.value.copy(O))}r.render(a,i)};return G(),()=>{cancelAnimationFrame(P),removeEventListener("pointermove",m),removeEventListener("scroll",x),removeEventListener("resize",y),r.dispose()}}function st(){const n=p.useRef(null),[t,r]=p.useState(!!window.THREE);return p.useEffect(()=>{if(window.THREE){r(!0);return}const a=setInterval(()=>{window.THREE&&(clearInterval(a),r(!0))},50);return()=>clearInterval(a)},[]),p.useEffect(()=>{if(!(!n.current||!window.THREE))return rt(n.current)},[t]),e.jsx("canvas",{ref:n,style:{position:"absolute",inset:0,zIndex:0,display:"block",width:"100%",height:"100%"}})}function it({onDemo:n}){const[t,r]=p.useState(!1);return p.useEffect(()=>{const a=()=>r(window.scrollY>40);return a(),addEventListener("scroll",a,{passive:!0}),()=>removeEventListener("scroll",a)},[]),e.jsx("header",{className:`nav${t?" scrolled":""}`,id:"nav",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("a",{className:"brand",href:"#top",children:[e.jsx("span",{className:"brand-mark","aria-hidden":"true"}),e.jsx("span",{children:"NILL"})]}),e.jsx("nav",{"aria-label":"Primary",children:e.jsxs("ul",{children:[e.jsx("li",{children:e.jsx("a",{href:"#produkte",children:"Produkte"})}),e.jsx("li",{children:e.jsx("a",{href:"#wie",children:"Wie es arbeitet"})}),e.jsx("li",{children:e.jsx("a",{href:"#preise",children:"Preise"})}),e.jsx("li",{children:e.jsx("a",{href:"#nachhaltigkeit",children:"Nachhaltigkeit"})}),e.jsx("li",{children:e.jsx("a",{href:"#faq",children:"FAQ"})})]})}),e.jsxs("div",{className:"nav-auth",children:[e.jsx("a",{href:"https://nillai.de/login",className:"btn-auth",children:"Login"}),e.jsx("a",{href:"https://nillai.de/register",className:"btn-auth primary",children:"Registrieren"})]})]})})}function ot({onCTA:n}){const[t,r]=p.useState(!1);return p.useEffect(()=>{const a=setTimeout(()=>r(!0),80);return()=>clearTimeout(a)},[]),e.jsxs("section",{className:`hero${t?" revealed":""}`,id:"top",children:[e.jsx(st,{}),e.jsxs("div",{className:"hero-chips","aria-hidden":"true",children:[e.jsxs("span",{className:"chip c1",children:[e.jsx("span",{className:"chip-dot"}),e.jsx("span",{children:"KI aktiv"})]}),e.jsxs("span",{className:"chip c2",children:[e.jsx("span",{className:"chip-dot",style:{background:"var(--accent-4)"}}),e.jsx("span",{children:"47 Mails sortiert"})]}),e.jsxs("span",{className:"chip c3",children:[e.jsx("span",{className:"chip-dot",style:{background:"var(--accent-2)"}}),e.jsx("span",{children:"Rechnung gebucht"})]}),e.jsxs("span",{className:"chip c4",children:[e.jsx("span",{className:"chip-dot",style:{background:"var(--accent-3)"}}),e.jsx("span",{children:"Dienstplan aktualisiert"})]})]}),e.jsxs("div",{className:"wrap hero-inner",children:[e.jsx("span",{className:"eyebrow hero-eyebrow",children:"KI-Betriebssystem für Unternehmen"}),e.jsxs("h1",{"aria-label":"Intelligenz, die mitarbeitet.",children:[e.jsx("span",{className:"word",children:e.jsx("span",{children:"Intelligenz,"})}),e.jsx("br",{}),e.jsx("span",{className:"word",children:e.jsx("span",{children:"die "})}),e.jsx("span",{className:"word",children:e.jsx("span",{children:e.jsx("em",{children:"mit­arbeitet."})})})]}),e.jsxs("p",{className:"lead",children:["NILL verbindet ",e.jsx("strong",{style:{color:"var(--ink)",fontWeight:500},children:"Postfach, Buchhaltung, Inventur, Zeiterfassung"})," und ",e.jsx("strong",{style:{color:"var(--ink)",fontWeight:500},children:"Teamverwaltung"})," zu einem einzigen System — gesteuert von einer KI, die Arbeit erkennt, entscheidet und erledigt."]}),e.jsxs("div",{className:"hero-cta",children:[e.jsxs(R,{className:"btn btn-primary",href:"https://app.nillai.de/register",children:[e.jsx("span",{children:"Kostenlos registrieren"}),e.jsx("span",{className:"arrow",children:"→"})]}),e.jsxs(R,{className:"btn btn-ghost",href:"https://app.nillai.de/login",children:[e.jsx("span",{children:"Login"}),e.jsx("span",{className:"arrow",children:"→"})]}),e.jsxs(R,{className:"btn btn-ghost",onClick:a=>{a.preventDefault(),n("Demo")},href:"#",children:[e.jsx("span",{children:"Live-Demo"}),e.jsx("span",{className:"arrow",children:"↓"})]})]})]}),e.jsxs("div",{className:"hero-meta",children:[e.jsx("span",{children:"NILL v4 · Stand 2026"}),e.jsxs("div",{className:"scroll-ind",children:[e.jsx("span",{children:"scroll"}),e.jsx("div",{className:"scroll-bar"})]}),e.jsx("span",{children:"DE · Made in Germany"})]})]})}function lt(){const n=e.jsxs(e.Fragment,{children:["Postfach ",e.jsx("em",{children:"·"})," Buchhaltung ",e.jsx("span",{className:"ticker-sep"})," Inventur ",e.jsx("em",{children:"·"})," Zeiterfassung ",e.jsx("span",{className:"ticker-sep"})," Team­verwaltung ",e.jsx("em",{children:"·"})," Sekretärin ",e.jsx("span",{className:"ticker-sep"})," ",e.jsx("em",{children:"Ein Login."})," ",e.jsx("span",{className:"ticker-sep"}),"Postfach ",e.jsx("em",{children:"·"})," Buchhaltung ",e.jsx("span",{className:"ticker-sep"})," Inventur ",e.jsx("em",{children:"·"})," Zeiterfassung ",e.jsx("span",{className:"ticker-sep"})," Team­verwaltung ",e.jsx("em",{children:"·"})," Sekretärin ",e.jsx("span",{className:"ticker-sep"})," ",e.jsx("em",{children:"Ein Login."})," ",e.jsx("span",{className:"ticker-sep"})]});return e.jsx("div",{className:"ticker",children:e.jsx("div",{className:"ticker-track","aria-hidden":"true",children:e.jsx("span",{children:n})})})}function ct({onCTA:n}){const[t,r]=$();return e.jsx("section",{id:"produkte",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:`section-head reveal${r?" in":""}`,ref:t,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Module — 05 live · 01 in Entwicklung"}),e.jsxs("h2",{children:["Sechs Module. ",e.jsx("br",{}),e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)",fontFamily:"var(--serif)",fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'},children:"Eine"})," Intelligenz."]})]}),e.jsx("p",{className:"lead",children:"Jedes Modul steht für sich — doch gemeinsam werden sie zu einem Gehirn, das dein Unternehmen versteht."})]}),e.jsxs("div",{className:"bento reveal in",children:[e.jsxs(Z,{className:"k1",children:[e.jsx("div",{className:"viz","aria-hidden":"true",children:e.jsxs("svg",{viewBox:"0 0 600 380",preserveAspectRatio:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"mg",x1:"0",y1:"0",x2:"1",y2:"1",children:[e.jsx("stop",{offset:"0",stopColor:"#c6ff3c",stopOpacity:".25"}),e.jsx("stop",{offset:"1",stopColor:"#c6ff3c",stopOpacity:"0"})]})}),e.jsx("g",{transform:"translate(260,40)",opacity:".8",children:[0,60,120,180].map((a,i)=>e.jsxs("g",{className:"mail-row",transform:`translate(0,${a})`,children:[e.jsx("rect",{width:"300",height:"48",rx:"8",fill:i===0?"url(#mg)":"rgba(255,255,255,.03)",stroke:"rgba(255,255,255,.08)"}),e.jsx("circle",{cx:"22",cy:"24",r:"6",fill:["#c6ff3c","#7a5cff","#38f5d0","#ff4d8d"][i]}),e.jsx("rect",{x:"42",y:"16",width:[120,100,140,80][i],height:"6",rx:"3",fill:"rgba(255,255,255,.6)"}),e.jsx("rect",{x:"42",y:"28",width:[200,180,160,220][i],height:"4",rx:"2",fill:"rgba(255,255,255,.2)"})]},a))})]})}),e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"01"})," · Postfach"]}),e.jsxs("h3",{children:["E-Mails, die sich ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"selbst beantworten."})]}),e.jsx("p",{children:"Kategorisieren, priorisieren, Antworten schreiben — NILL liest mit und arbeitet voraus."})]})]}),e.jsxs(Z,{className:"k2",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"02"})," · Buchhaltung"]}),e.jsxs("h3",{children:["Belege buchen. ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"Ohne dich."})]}),e.jsx("p",{children:"Rechnungen per Mail, Scan oder Foto — NILL erkennt, kontiert, verbucht und bereitet auf."})]}),e.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap",fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)"},children:["DATEV-ready","OCR","GoBD-konform"].map(a=>e.jsx("span",{style:{padding:"6px 10px",border:"1px solid var(--line)",borderRadius:99},children:a},a))})]}),e.jsx(Z,{className:"k3",children:e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"03"})," · Inventur"]}),e.jsxs("h3",{children:["Bestände, die sich ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"selbst zählen."})]}),e.jsx("p",{children:"Automatische Fortschreibung, Meldegrenzen mit Benachrichtigung."})]})}),e.jsxs(Z,{className:"k4",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"04"})," · Zeiterfassung"]}),e.jsxs("h3",{children:["Zeit erfasst sich ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"per Klick."})]}),e.jsx("p",{children:"Per App oder Browser. NILL weist Projekte zu und berechnet Überstunden."})]}),e.jsxs("div",{style:{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)",display:"flex",justifyContent:"space-between"},children:[e.jsx("span",{children:"EuGH-konform"}),e.jsx("span",{children:"GPS-optional"})]})]}),e.jsxs(Z,{className:"k5",children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"05"})," · Team­verwaltung"]}),e.jsxs("h3",{children:["Das Team im ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"Autopilot."})]}),e.jsx("p",{children:"Urlaub, Krankmeldungen, Dienstpläne, Onboarding — vorbereitet von der KI."})]}),e.jsx("div",{style:{display:"flex"},children:["MK","LS","JH","+9"].map((a,i)=>e.jsx("span",{className:"avatar",style:{width:28,height:28,fontSize:10,marginLeft:i?-10:0,background:i?["linear-gradient(135deg,var(--accent),var(--accent-4))","linear-gradient(135deg,var(--accent-3),var(--accent-2))","linear-gradient(135deg,var(--accent-4),var(--accent-3))"][i-1]:void 0},children:a},a))})]}),e.jsxs(Z,{className:"k6",style:{background:"linear-gradient(90deg,#0c0c10,#12130c)",borderColor:"rgba(198,255,60,.2)"},children:[e.jsxs("div",{children:[e.jsxs("span",{className:"tag",children:[e.jsx("span",{className:"n",children:"06"})," · KI Sekretärin"]}),e.jsxs("h3",{children:["Nimmt Anrufe entgegen. ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)"},children:"Rund um die Uhr."})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:14},children:[e.jsx("span",{className:"badge",children:"In Bearbeitung — Q3 / 2026"}),e.jsxs(R,{className:"btn btn-ghost",style:{padding:"10px 18px"},onClick:a=>{a.preventDefault(),n("Frühzugang")},href:"#",children:[e.jsx("span",{children:"Frühzugang sichern"}),e.jsx("span",{className:"arrow",children:"→"})]})]})]})]})]})})}function dt(){const[n,t]=p.useState("inbox"),[r,a]=p.useState(314),[i,s]=$();p.useEffect(()=>{const c=document.querySelectorAll(".step-item"),o=new IntersectionObserver(d=>{d.forEach(b=>{if(!b.isIntersecting)return;const w=b.target.dataset.scene;t(w),w==="time"&&a(314*.28)})},{rootMargin:"-45% 0px -45% 0px",threshold:0});return c.forEach(d=>o.observe(d)),()=>o.disconnect()},[]);const l=["X-101","A-22","B-09","T-77","R-3","Q-41","P-18","S-54","D-09","M-66","V-12","N-88","K-2","Z-99","H-14","J-5","L-8","F-31"];return e.jsx("section",{id:"wie",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:`section-head reveal${s?" in":""}`,ref:i,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Wie es arbeitet — 05 Schritte"}),e.jsxs("h2",{children:["Ein Tag, ",e.jsx("br",{}),"von der ",e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)",fontFamily:"var(--serif)",fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'},children:"KI"})," geführt."]})]}),e.jsx("p",{className:"lead",children:"Scroll dich durch einen typischen Arbeitstag mit NILL."})]}),e.jsxs("div",{className:"feature-sticky",children:[e.jsx("div",{className:"text-col",children:[{scene:"inbox",idx:"01",title:"07:48 — Die erste Mail liegt schon vorbereitet bereit.",text:"NILL hat die Nacht durchgearbeitet. 47 E-Mails gesichtet, 12 Antworten vorformuliert, 3 zur Freigabe bereit."},{scene:"ledger",idx:"02",title:"09:15 — Der Handwerker schickt die Rechnung per Foto.",text:"OCR, Kontierung, Zuordnung zum richtigen Projekt, Vorbereitung für DATEV — in 4 Sekunden."},{scene:"inventory",idx:"03",title:"11:02 — Zwei Artikel rutschen unter die Meldegrenze.",text:"NILL kennt deinen Lieferanten, deine Rabattstufen, deine historische Liefertreue. Die Nachbestellung liegt auf deinem Schreibtisch."},{scene:"time",idx:"04",title:"13:30 — Mittagspause. Per Klick erfasst.",text:"App oder Browser öffnen, Projekt wählen, starten. NILL berechnet Projekte, Pausen und Überstunden. EuGH-konform."},{scene:"team",idx:"05",title:"16:48 — Zwei Krankmeldungen, ein Dienstplan neu.",text:"NILL zeigt die Lücken, informiert die betroffenen Kunden und schlägt den passenden Springer vor (folgt Q4 2026)."}].map(({scene:c,idx:o,title:d,text:b})=>e.jsxs("div",{className:"step-item","data-scene":c,children:[e.jsxs("div",{className:"step-index",children:[e.jsx("em",{children:o})," / ",["Postfach","Buchhaltung","Inventur","Zeiterfassung","Team­verwaltung"][parseInt(o)-1]]}),e.jsx("h3",{children:d}),e.jsx("p",{children:b})]},c))}),e.jsx("div",{className:"visual-col",children:e.jsx("div",{className:"feature-visual",children:e.jsxs("div",{className:"device",children:[e.jsxs("div",{className:"device-dots",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]}),e.jsxs("div",{className:"device-frame",children:[e.jsxs("div",{className:`scene${n==="inbox"?" active":""}`,children:[e.jsxs("div",{className:"inbox-row hi",children:[e.jsx("span",{className:"inbox-dot",style:{background:"var(--accent)"}}),e.jsx("span",{className:"inbox-name",children:"Kunde Müller GmbH"}),e.jsx("span",{className:"inbox-snippet",children:"Re: Angebot Sanierung — vielen Dank …"}),e.jsx("span",{className:"inbox-time",children:"07:48"})]}),e.jsxs("div",{className:"inbox-row",children:[e.jsx("span",{className:"inbox-dot"}),e.jsx("span",{className:"inbox-name",children:"DATEV"}),e.jsx("span",{className:"inbox-snippet",children:"Monatsreporting bereit"}),e.jsx("span",{className:"inbox-time",children:"06:02"})]}),e.jsxs("div",{className:"inbox-row",children:[e.jsx("span",{className:"inbox-dot",style:{background:"var(--accent-3)"}}),e.jsx("span",{className:"inbox-name",children:"L. Schröder"}),e.jsx("span",{className:"inbox-snippet",children:"Urlaubsantrag 12.—19.08."}),e.jsx("span",{className:"inbox-time",children:"05:55"})]}),e.jsxs("div",{className:"ai-reply",children:["Sehr geehrte Frau Müller, vielen Dank für Ihre Rückmeldung. Wir bestätigen den Termin am ",e.jsx("strong",{children:"23.04. um 09:00 Uhr"})," …",e.jsx("span",{className:"typing"})]})]}),e.jsxs("div",{className:`scene${n==="ledger"?" active":""}`,children:[e.jsxs("div",{className:"ocr-blip",children:[e.jsx("span",{className:"ocr-pulse"}),"OCR läuft"]}),e.jsxs("div",{className:"ledger-head",children:[e.jsx("span",{children:"Datum"}),e.jsx("span",{children:"Beleg"}),e.jsx("span",{children:"Konto"}),e.jsx("span",{children:"Betrag"})]}),e.jsxs("div",{className:"ledger-row",children:[e.jsx("span",{children:"09.15"}),e.jsxs("span",{children:["Rechnung ",e.jsx("span",{className:"cat",children:"Elektro Baum"})]}),e.jsx("span",{children:"3400"}),e.jsx("span",{className:"amount neg",children:"−487,20"})]}),e.jsxs("div",{className:"ledger-row",children:[e.jsx("span",{children:"09.14"}),e.jsxs("span",{children:["Abschlag ",e.jsx("span",{className:"cat",children:"Müller GmbH"})]}),e.jsx("span",{children:"8400"}),e.jsx("span",{className:"amount pos",children:"+3.200,00"})]}),e.jsxs("div",{className:"ledger-row",children:[e.jsx("span",{children:"08.55"}),e.jsxs("span",{children:["Kraftstoff ",e.jsx("span",{className:"cat",children:"Tank AG"})]}),e.jsx("span",{children:"4600"}),e.jsx("span",{className:"amount neg",children:"−128,40"})]})]}),e.jsxs("div",{className:`scene${n==="inventory"?" active":""}`,children:[e.jsx("div",{className:"inv-grid",children:l.map((c,o)=>e.jsx("div",{className:`inv-cell${[2,7,14].includes(o)?" lo":" ok"}`,children:c},c))}),e.jsxs("div",{className:"inv-legend",children:[e.jsx("span",{children:"OK"}),e.jsx("span",{className:"lo",children:"Unterbestand"})]})]}),e.jsx("div",{className:`scene${n==="time"?" active":""}`,children:e.jsx("div",{className:"time-ring",children:e.jsxs("svg",{className:"time-svg",viewBox:"0 0 120 120",children:[e.jsx("circle",{cx:"60",cy:"60",r:"50",fill:"none",stroke:"rgba(255,255,255,.06)",strokeWidth:"8"}),e.jsx("circle",{cx:"60",cy:"60",r:"50",fill:"none",stroke:"var(--accent)",strokeWidth:"8",strokeLinecap:"round",strokeDasharray:"314",strokeDashoffset:r,style:{transform:"rotate(-90deg)",transformOrigin:"60px 60px",transition:"stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)"}}),e.jsx("text",{x:"60",y:"56",textAnchor:"middle",fontFamily:"JetBrains Mono,monospace",fontSize:"14",fill:"#efede7",children:"06:22"}),e.jsx("text",{x:"60",y:"72",textAnchor:"middle",fontFamily:"JetBrains Mono,monospace",fontSize:"9",fill:"rgba(239,237,231,.4)",letterSpacing:"2",children:"PROJEKT A"})]})})}),e.jsx("div",{className:`scene${n==="team"?" active":""}`,children:e.jsxs("div",{className:"team-list",children:[e.jsxs("div",{className:"team-tile",children:[e.jsx("span",{className:"avatar",children:"MK"}),e.jsxs("div",{children:[e.jsx("div",{className:"team-name",children:"M. Keller"}),e.jsx("div",{className:"team-role",children:"im Dienst"})]})]}),e.jsxs("div",{className:"team-tile",style:{borderColor:"rgba(255,77,141,.3)",background:"rgba(255,77,141,.04)"},children:[e.jsx("span",{className:"avatar",style:{background:"linear-gradient(135deg,var(--accent-3),var(--accent-2))"},children:"LS"}),e.jsxs("div",{children:[e.jsx("div",{className:"team-name",children:"L. Schröder"}),e.jsx("div",{className:"team-role",style:{color:"var(--accent-3)"},children:"krank"})]})]}),e.jsxs("div",{className:"team-tile",children:[e.jsx("span",{className:"avatar",style:{background:"linear-gradient(135deg,var(--accent),var(--accent-4))"},children:"JH"}),e.jsxs("div",{children:[e.jsx("div",{className:"team-name",children:"J. Hänisch"}),e.jsx("div",{className:"team-role",children:"im Dienst"})]})]}),e.jsxs("div",{className:"team-tile",style:{borderColor:"rgba(255,77,141,.3)",background:"rgba(255,77,141,.04)"},children:[e.jsx("span",{className:"avatar",style:{background:"linear-gradient(135deg,var(--accent-4),var(--accent-3))"},children:"TB"}),e.jsxs("div",{children:[e.jsx("div",{className:"team-name",children:"T. Baumann"}),e.jsx("div",{className:"team-role",style:{color:"var(--accent-3)"},children:"krank"})]})]}),e.jsxs("div",{className:"team-tile",style:{gridColumn:"1/-1",borderColor:"rgba(198,255,60,.4)",background:"rgba(198,255,60,.05)"},children:[e.jsx("span",{className:"avatar",style:{background:"var(--accent)"},children:"KI"}),e.jsxs("div",{children:[e.jsx("div",{className:"team-name",children:"Vorschlag: Springer F. Wolf für Di. 08–14 Uhr"}),e.jsx("div",{className:"team-role",style:{color:"var(--accent)"},children:"warten auf Freigabe"})]})]})]})})]})]})})})]})]})})}function pt(){const[n,t]=$(),r=p.useRef(null),[a,i]=p.useState(0);return p.useEffect(()=>{if(!t||!r.current)return;const s=performance.now(),l=c=>{const o=Math.min(1,(c-s)/1600);i(Math.round((1-Math.pow(1-o,3))*87)),o<1&&requestAnimationFrame(l)};requestAnimationFrame(l)},[t]),e.jsx("section",{style:{padding:"40px 0 120px"},children:e.jsx("div",{className:"wrap",children:e.jsxs("div",{className:`stats reveal${t?" in":""}`,ref:n,children:[e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"3,5"}),e.jsx("span",{children:"×"})]}),e.jsx("div",{className:"label",children:"Schneller im Alltag"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("span",{ref:r,children:a}),e.jsx("em",{children:"%"})]}),e.jsx("div",{className:"label",children:"Weniger manuelle Arbeit"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"24"}),e.jsx("span",{children:"/"}),e.jsx("em",{children:"7"})]}),e.jsx("div",{className:"label",children:"KI im Einsatz"})]}),e.jsxs("div",{className:"stat",children:[e.jsxs("div",{className:"num",children:[e.jsx("em",{children:"05"}),e.jsx("span",{children:"·"}),e.jsx("em",{children:"01"})]}),e.jsx("div",{className:"label",children:"Module live · Ein Login"})]})]})})})}function mt({onCTA:n}){const[t,r]=$();return e.jsx("section",{id:"preise",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:`section-head reveal${r?" in":""}`,ref:t,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Preise — einfach gehalten"}),e.jsxs("h2",{children:["Eins. Zwei. ",e.jsx("br",{}),e.jsx("em",{style:{fontStyle:"italic",color:"var(--accent)",fontFamily:"var(--serif)",fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'},children:"Drei."})]})]}),e.jsx("p",{className:"lead",children:"Transparent. Ohne versteckte Kosten. Monatlich kündbar."})]}),e.jsx("div",{className:"pricing-grid reveal in",children:[{tier:"Solo",sub:"Für Einzelunternehmer & kleine Büros",price:"25",per:"€ / Monat · 1–2 Nutzer",items:["E-Mail, Kalender & Buchhaltung","OCR-Belegerfassung & DATEV-ready","Rechnungserstellung & PDF-Export","KI-Kategorisierung & Vorschläge","E-Mail-Support"],pop:!1},{tier:"Team",sub:"Für wachsende Teams & KMUs",price:"50",per:"€ / Monat · bis 10 Nutzer",items:["Alles aus Solo — für bis zu 10 Nutzer","Lohnbuchhaltung & HR-Verwaltung","Arbeitszeiterfassung & Stempeluhr","Urlaubs- & Abwesenheitsverwaltung","Priority-Support"],pop:!0},{tier:"Business",sub:"Für größere Unternehmen",price:"90",per:"€ / Monat · 10+ Nutzer",items:["Alles aus Team — unbegrenzte Nutzer","API-Zugang & Webhooks (folgt Q4 2026)","Erweiterte KI-Automatisierungen","Priorisierter Support mit SLA-Garantie"],pop:!1}].map(({tier:a,sub:i,price:s,per:l,items:c,pop:o})=>{const d=p.useRef(null);return ge(d),e.jsxs("article",{ref:d,className:`price${o?" pop":""}`,children:[o&&e.jsx("span",{className:"pop-chip",children:"Meistgewählt"}),e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",style:o?{color:"var(--accent)"}:{},children:a}),e.jsx("h3",{style:{marginTop:12},children:i})]}),e.jsxs("div",{className:"price-tag",children:[e.jsx("span",{className:"num",style:s.length>3?{fontSize:52}:{},children:s}),l&&e.jsx("span",{className:"per",children:l})]}),e.jsx("ul",{children:c.map(b=>e.jsx("li",{children:b},b))}),e.jsxs(R,{className:`btn ${o?"btn-primary":"btn-ghost"}`,href:"/pricing",children:[e.jsx("span",{children:"Mehr Erfahren"}),e.jsx("span",{className:"arrow",children:"→"})]})]},a)})})]})})}function ht({onCTA:n}){const[t,r]=$();return e.jsx("section",{id:"nachhaltigkeit",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:`section-head reveal${r?" in":""}`,ref:t,children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Verantwortung statt Fußnote"}),e.jsxs("h2",{children:["Software, die ",e.jsx("em",{children:"nicht heizt."})]})]}),e.jsxs("p",{className:"lead",children:["KI verbraucht Strom. Also nehmen wir es ernst: NILL läuft auf erneuerbaren Energien — und was nicht grün geht, wird ",e.jsx("strong",{style:{color:"var(--ink)",fontWeight:500},children:"transparent kompensiert"}),"."]})]}),e.jsxs("div",{className:"nh-hero reveal in",children:[e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",style:{color:"var(--accent)"},children:"Unser Anspruch"}),e.jsxs("h3",{style:{marginTop:20,fontSize:"clamp(34px,4.4vw,64px)",letterSpacing:"-.02em",lineHeight:1.02},children:["100 % ",e.jsx("em",{children:"erneuerbar"})," ·",e.jsx("br",{}),"100 % ",e.jsx("em",{children:"kompensiert."})]}),e.jsxs("p",{children:["Wir betreiben unsere Infrastruktur bei Rechenzentren mit nachweislich erneuerbarer Energie. Jeder Baustein, der sich noch nicht vollständig grün betreiben lässt, wird über ",e.jsx("strong",{style:{color:"var(--ink)",fontWeight:500},children:"zertifizierte Gold-Standard-Projekte"})," ausgeglichen."]})]}),e.jsx("div",{className:"nh-leaf","aria-hidden":"true",children:e.jsxs("svg",{viewBox:"0 0 200 200",fill:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"leafG",x1:"0",y1:"0",x2:"1",y2:"1",children:[e.jsx("stop",{offset:"0",stopColor:"#c6ff3c"}),e.jsx("stop",{offset:"1",stopColor:"#38f5d0"})]})}),e.jsx("path",{d:"M100 20 C 45 55, 25 115, 45 165 C 95 170, 150 140, 170 80 C 155 55, 130 35, 100 20 Z",fill:"url(#leafG)",opacity:".9"}),e.jsx("path",{d:"M100 20 C 95 80, 80 130, 45 165",stroke:"#0a0a10",strokeWidth:"3",strokeLinecap:"round",fill:"none",opacity:".55"})]})})]}),e.jsx("div",{className:"nh-stats reveal in",children:[["100 %","Rechenzentrum erneuerbar","Frankfurt — Stromversorgung aus erneuerbaren Energien."],["<2 g","CO₂ pro KI-Anfrage","Effiziente Modelle, Caching, Batching — jede Operation wird gemessen."],["105 %","Überkompensation","Wir kompensieren 5 % mehr als unser Fußabdruck."]].map(([a,i,s])=>e.jsxs("div",{className:"nh-stat",children:[e.jsx("div",{className:"val",children:e.jsx("em",{children:a})}),e.jsx("span",{className:"lbl",children:i}),e.jsx("p",{children:s})]},i))}),e.jsx("div",{className:"nh-pillars reveal in",children:[["01 / Strom","Grünstrom zuerst.","Primärinfrastruktur bei Anbietern mit 100 % Ökostrom."],["02 / Effizienz","Jedes Watt zählt.","Modell-Routing spart Tokens. Idle-Hardware schläft automatisch."],["03 / Kompensation","Gold Standard.","Zertifizierte Waldschutz- & Clean-Cooking-Projekte — mit öffentlicher Seriennummer."]].map(([a,i,s])=>e.jsxs("article",{className:"nh-pillar",children:[e.jsx("span",{className:"num",children:a}),e.jsx("h3",{children:i}),e.jsx("p",{children:s})]},a))}),e.jsxs("div",{className:"nh-pledge reveal in",children:[e.jsxs("div",{className:"big",children:[e.jsx("em",{children:"Transparenter Nachhaltigkeitsbericht"})," — jährlich, als PDF, mit Stromquellen, Emissionen und Kompensations-Zertifikaten."]}),e.jsxs(R,{className:"btn btn-ghost",onClick:a=>{a.preventDefault(),n("Nachhaltigkeitsbericht")},href:"#",children:[e.jsx("span",{children:"Bericht anfordern"}),e.jsx("span",{className:"arrow",children:"→"})]})]})]})})}function xt(){const[n,t]=$(),r=[["Wo werden meine Daten gespeichert?","Alle Daten liegen verschlüsselt auf Servern in Deutschland (Frankfurt). Wir sind nach DSGVO geprüft und bieten auf Wunsch eine Private-Cloud-Instanz."],["Ersetzt NILL meinen Steuerberater?","Nein — NILL bereitet alles so auf, dass dein Steuerberater deutlich weniger Zeit braucht. DATEV-ready Export sorgt für reibungslose Übergabe."],["Wie lange dauert das Onboarding?","Die meisten Teams sind in 48 Stunden produktiv. Wir unterstützen bei der Einrichtung deiner E-Mail-Konten und Module."],["Was passiert, wenn die KI einen Fehler macht?",'Jede automatische Aktion ist standardmäßig im "Vorschlags-Modus". Du entscheidest, was direkt geht, was freigegeben werden muss, und was dokumentiert wird.'],["Wie nachhaltig ist NILL wirklich?","Unsere Kern-Infrastruktur läuft auf 100 % Ökostrom in Frankfurt. Drittanbieter kompensieren wir zu 105 % über Gold-Standard-Projekte. Jährlicher Nachhaltigkeitsbericht auf Anfrage."]];return e.jsx("section",{id:"faq",children:e.jsxs("div",{className:"wrap-tight",children:[e.jsx("div",{className:`section-head reveal${t?" in":""}`,ref:n,style:{marginBottom:40},children:e.jsxs("div",{children:[e.jsx("span",{className:"eyebrow",children:"Antworten auf das Naheliegende"}),e.jsx("h2",{children:"FAQ."})]})}),e.jsx("div",{className:"faq reveal in",children:r.map(([a,i])=>e.jsxs("details",{children:[e.jsx("summary",{children:a}),e.jsx("p",{className:"a",children:i})]},a))})]})})}function vt({onCTA:n}){const[t,r]=$();return e.jsx("section",{id:"cta",className:"cta-big",children:e.jsxs("div",{className:"wrap",children:[e.jsxs("h2",{className:`reveal${r?" in":""}`,ref:t,children:["Lass deine KI ",e.jsx("br",{}),e.jsx("em",{children:"anfangen"}),e.jsx("br",{}),"zu arbeiten."]}),e.jsxs("div",{className:`cta-sub reveal reveal-delay-1${r?" in":""}`,children:[e.jsx("p",{className:"lead",children:"30 Minuten Live-Demo mit einem unserer Produktspezialisten. Wir zeigen dir direkt an deinem Use-Case, wie NILL arbeitet."}),e.jsxs("div",{style:{display:"flex",gap:12,flexWrap:"wrap"},children:[e.jsxs(R,{className:"btn btn-primary",onClick:a=>{a.preventDefault(),n("Termin")},href:"#",children:[e.jsx("span",{children:"Termin buchen"}),e.jsx("span",{className:"arrow",children:"→"})]}),e.jsxs(R,{className:"btn btn-ghost",href:"#produkte",children:[e.jsx("span",{children:"Module"}),e.jsx("span",{className:"arrow",children:"↑"})]})]})]})]})})}function ut(){return e.jsx("footer",{children:e.jsxs("div",{className:"wrap",children:[e.jsxs("div",{className:"foot-grid",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"brand",style:{marginBottom:18},children:[e.jsx("span",{className:"brand-mark"}),e.jsx("span",{children:"NILL"})]}),e.jsx("p",{style:{maxWidth:"32ch"},children:"Das KI-Betriebssystem für Unternehmen. Gebaut in Deutschland, gehostet in Frankfurt."})]}),e.jsxs("div",{children:[e.jsx("h4",{children:"Produkt"}),e.jsxs("ul",{children:[e.jsx("li",{children:e.jsx("a",{href:"#produkte",children:"Module"})}),e.jsx("li",{children:e.jsx("a",{href:"#preise",children:"Preise"})}),e.jsx("li",{children:e.jsx("a",{href:"#faq",children:"FAQ"})}),e.jsx("li",{children:e.jsx(K,{to:"/changelog",children:"Changelog"})})]})]}),e.jsxs("div",{children:[e.jsx("h4",{children:"Unternehmen"}),e.jsxs("ul",{children:[e.jsx("li",{children:e.jsx(K,{to:"/ueber-uns",children:"Über uns"})}),e.jsx("li",{children:e.jsx(K,{to:"/karriere",children:"Karriere"})})]})]}),e.jsxs("div",{children:[e.jsx("h4",{children:"Rechtliches"}),e.jsxs("ul",{children:[e.jsx("li",{children:e.jsx(K,{to:"/Impressum",children:"Impressum"})}),e.jsx("li",{children:e.jsx(K,{to:"/Datenschutz",children:"Datenschutz"})}),e.jsx("li",{children:e.jsx(K,{to:"/agb",children:"AGB"})}),e.jsx("li",{children:e.jsx(K,{to:"/sicherheit",children:"Sicherheit"})})]})]})]}),e.jsxs("div",{className:"wordmark",children:["NILL",e.jsx("em",{children:"."})]}),e.jsxs("div",{className:"foot-meta",children:[e.jsx("span",{children:"© 2026 NILL AI - Inh. Julian David Nill · nillai.de"}),e.jsx("span",{children:"Made with intelligence · Frankfurt a.M."})]})]})})}const ve={Demo:{t:"Live-Demo <em>anfragen.</em>",s:"Terminvorschlag per Mail, persönlich via Videocall."},Paket:{t:"Paket <em>wählen.</em>",s:"Wir konfigurieren Module & Preis gemeinsam."},Gespräch:{t:"Kurzes <em>Gespräch.</em>",s:"15 Minuten reichen. Ehrliche Beratung, kein Sales-Druck."},Frühzugang:{t:"Frühzugang <em>sichern.</em>",s:"Erste Plätze gehen an Frühanfragen."},Termin:{t:"Termin <em>buchen.</em>",s:"Sag uns Zeitraum und Kanal — Telefon, Videocall oder vor Ort."},default:{t:"Lass uns <em>reden.</em>",s:"Kurz ein paar Infos — wir melden uns innerhalb von 24 h zurück."}};function ft({intent:n,onClose:t}){const[r,a]=p.useState(!1),i=ve[n]||ve.default;p.useEffect(()=>{a(!1)},[n]),p.useEffect(()=>{const l=c=>{c.key==="Escape"&&t()};return addEventListener("keydown",l),()=>removeEventListener("keydown",l)},[t]),p.useEffect(()=>(document.body.style.overflow=n?"hidden":"",()=>{document.body.style.overflow=""}),[n]);const s=l=>{l.preventDefault();const c=new FormData(l.target),o=(c.get("name")||"").trim(),d=(c.get("email")||"").trim();if(!o||!d){l.target.reportValidity();return}const b=encodeURIComponent(`NILL · ${n||"Anfrage"} — ${o}`),w=encodeURIComponent(`Anliegen: ${n||"—"}
Name: ${o}
Firma: ${c.get("company")||"—"}
E-Mail: ${d}

${c.get("message")||""}`);window.location.href=`mailto:hallo@nillai.de?subject=${b}&body=${w}`,a(!0)};return e.jsxs("div",{className:`modal-overlay${n?" open":""}`,onClick:l=>{(l.target===l.currentTarget||l.target.classList.contains("modal-bg"))&&t()},children:[e.jsx("div",{className:"modal-bg"}),e.jsxs("div",{className:"modal-panel",children:[e.jsx("button",{className:"modal-close",onClick:t,type:"button","aria-label":"Schließen",children:"×"}),r?e.jsxs("div",{style:{textAlign:"center",padding:"10px 0"},children:[e.jsx("div",{className:"modal-eyebrow",children:"Gesendet · ✓"}),e.jsxs("h3",{children:["Danke, ",e.jsx("em",{children:"wir sind dran."})]}),e.jsx("p",{style:{margin:"0 auto",maxWidth:"40ch"},children:"Deine Anfrage ist im Postfach. Ein Mensch antwortet innerhalb weniger Stunden."}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginTop:22},children:e.jsx(R,{className:"btn btn-ghost",onClick:t,children:e.jsx("span",{children:"Schließen"})})})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"modal-eyebrow",children:["NILL · ",n||"Anfrage"]}),e.jsx("h3",{dangerouslySetInnerHTML:{__html:i.t}}),e.jsx("p",{className:"sub",children:i.s}),e.jsxs("form",{onSubmit:s,autoComplete:"on",noValidate:!0,children:[e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"mn",children:"Name"}),e.jsx("input",{id:"mn",name:"name",required:!0,placeholder:"Vor- und Nachname"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"mc",children:"Unternehmen"}),e.jsx("input",{id:"mc",name:"company",placeholder:"Firmenname"})]})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"me",children:"E-Mail"}),e.jsx("input",{id:"me",name:"email",type:"email",required:!0,placeholder:"du@firma.de"})]}),e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"mp",children:["Telefon ",e.jsx("span",{style:{opacity:.5},children:"· optional"})]}),e.jsx("input",{id:"mp",name:"phone",placeholder:"+49 ..."})]})]}),e.jsxs("div",{className:"form-field",children:[e.jsx("label",{htmlFor:"mm",children:"Nachricht"}),e.jsx("textarea",{id:"mm",name:"message",placeholder:"Welches Modul interessiert dich?"})]}),e.jsxs("div",{className:"modal-actions",children:[e.jsx("small",{children:'Per Klick auf „Senden" wird dein Mailprogramm geöffnet.'}),e.jsxs(R,{className:"btn btn-primary",children:[e.jsx("span",{children:"Senden"}),e.jsx("span",{className:"arrow",children:"→"})]})]})]})]})]})]})}function Nt(){He();const[n,t]=p.useState(null),r=p.useCallback(i=>t(i||"default"),[]),a=p.useCallback(()=>t(null),[]);return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"vignette","aria-hidden":"true"}),e.jsx(it,{onDemo:r}),e.jsx(ot,{onCTA:r}),e.jsx(Ke,{}),e.jsx(lt,{}),e.jsx(ct,{onCTA:r}),e.jsx(dt,{}),e.jsx(pt,{}),e.jsx(mt,{onCTA:r}),e.jsx(ht,{onCTA:r}),e.jsx(xt,{}),e.jsx(vt,{onCTA:r}),e.jsx(ut,{}),e.jsx(ft,{intent:n,onClose:a})]})}export{Nt as default};
