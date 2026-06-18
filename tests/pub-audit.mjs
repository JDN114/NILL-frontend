import { chromium } from '@playwright/test';
const BASE = 'http://localhost:5173';
const WIDTHS = [320, 360, 390, 414, 430, 768, 834, 1024];
const ROUTES = ['/', '/login', '/pricing', '/app', '/wie-es-arbeitet', '/changelog', '/sicherheit', '/about-nill', '/roadmap', '/nachhaltigkeit'];
const DET = `(()=>{const vw=document.documentElement.clientWidth,docW=document.documentElement.scrollWidth,out=[];if(docW>vw+1){for(const el of document.querySelectorAll('*')){const r=el.getBoundingClientRect();if(r.width===0||r.height===0)continue;if(r.right>vw+1||r.width>vw+1){const cs=getComputedStyle(el);out.push({tag:el.tagName.toLowerCase(),cls:(el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className)||'',id:el.id||'',right:Math.round(r.right),width:Math.round(r.width),pos:cs.position})}}}return{vw,docW,over:docW-vw,offenders:out}})()`;
const b = await chromium.launch();
const ctx = await b.newContext();
const p = await ctx.newPage();
const rep = {};
for (const route of ROUTES) {
  for (const w of WIDTHS) {
    await p.setViewportSize({ width: w, height: 800 });
    try { await p.goto(BASE + route, { waitUntil: 'load', timeout: 8000 }); }
    catch { /* ignore */ }
    await p.waitForTimeout(500);
    let res; try { res = await p.evaluate(DET); } catch { continue; }
    if (res.over > 1) {
      const seen = new Map();
      for (const o of res.offenders) { const k = o.tag + '|' + o.cls + '|' + o.id; if (!seen.has(k) || seen.get(k).width < o.width) seen.set(k, o); }
      rep[route + ' @' + w] = { over: res.over, docW: res.docW, vw: res.vw, off: [...seen.values()].slice(0, 6) };
    }
  }
  process.stdout.write('.');
}
const keys = Object.keys(rep);
console.log('\n==== PUBLIC OVERFLOW REPORT ====');
if (!keys.length) console.log('No overflow on public routes');
else for (const k of keys) { const r = rep[k]; console.log(`\n${k} -> docW ${r.docW} > vw ${r.vw} (+${r.over}px)`); for (const o of r.off) console.log(`   <${o.tag}${o.id ? '#' + o.id : ''} class="${String(o.cls).slice(0, 55)}"> right=${o.right} w=${o.width} ${o.pos}`); }
console.log('\n================================');
await b.close();
