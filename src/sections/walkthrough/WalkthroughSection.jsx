import { useRef, useEffect, useState } from "react";
import "../../styles/landing.css";

/* ──────────────────────────────────────────────────────────────
   WalkthroughSection — "Ein Tag, von der KI geführt."
   The scroll-driven 05-step run-through of a workday across every
   module (formerly inline in LandingPage as <FeatureWalkthrough/>).
   Now lives on its own page: /wie-es-arbeitet.
   ────────────────────────────────────────────────────────────── */

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, vis];
}

export default function WalkthroughSection() {
  const [activeScene, setActiveScene] = useState('inbox');
  const [arcDash, setArcDash] = useState(314);
  const [ref, vis] = useReveal();

  useEffect(() => {
    // Pick the step whose center is nearest the viewport center. More robust than a
    // thin-band IntersectionObserver: the tall step-items (22vh padding) can scroll
    // straight past a 10%-tall detection band, leaving the scene stuck on the first.
    const steps = [...document.querySelectorAll('.step-item')];
    if (!steps.length) return;
    let raf = 0;
    const pick = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = steps[0], bestDist = Infinity;
      for (const s of steps) {
        const r = s.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) { bestDist = dist; best = s; }
      }
      const key = best.dataset.scene;
      setActiveScene(prev => (prev === key ? prev : key));
      setArcDash(key === 'time' ? 314 * 0.28 : 314);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(pick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    pick();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const SKUS = ['X-101','A-22','B-09','T-77','R-3','Q-41','P-18','S-54','D-09','M-66','V-12','N-88','K-2','Z-99','H-14','J-5','L-8','F-31'];

  return (
    <section id="wie">
      <div className="wrap">
        <div className={`section-head reveal${vis?' in':''}`} ref={ref}>
          <div><span className="eyebrow">Wie es arbeitet — 05 Schritte</span><h2>Ein Tag, <br/>von der <em style={{fontStyle:'italic',color:'var(--accent)',fontFamily:'var(--serif)',fontVariationSettings:'"opsz" 144,"SOFT" 100,"WONK" 1'}}>KI</em> geführt.</h2></div>
          <p className="lead">Scroll dich durch einen typischen Arbeitstag mit NILL.</p>
        </div>
        <div className="feature-sticky">
          <div className="text-col">
            {[
              {scene:'inbox',  idx:'01',title:'07:48 — Die erste Mail liegt schon vorbereitet bereit.',text:'NILL hat die Nacht durchgearbeitet. 47 E-Mails gesichtet, 12 Antworten vorformuliert, 3 zur Freigabe bereit.'},
              {scene:'ledger', idx:'02',title:'09:15 — Der Handwerker schickt die Rechnung per Foto.',text:'OCR, Kontierung, Zuordnung zum richtigen Projekt, Vorbereitung für DATEV — in 4 Sekunden.'},
              {scene:'inventory',idx:'03',title:'11:02 — Zwei Artikel rutschen unter die Meldegrenze.',text:'NILL kennt deinen Lieferanten, deine Rabattstufen, deine historische Liefertreue. Die Nachbestellung liegt auf deinem Schreibtisch.'},
              {scene:'time',   idx:'04',title:'13:30 — Mittagspause. Per Klick erfasst.',text:'App oder Browser öffnen, Projekt wählen, starten. NILL berechnet Projekte, Pausen und Überstunden. EuGH-konform.'},
              {scene:'team',   idx:'05',title:'16:48 — Zwei Krankmeldungen, ein Dienstplan neu.',text:'NILL zeigt die Lücken, informiert die betroffenen Kunden und schlägt den passenden Springer vor (folgt Q4 2026).'},
            ].map(({scene,idx,title,text})=>(
              <div key={scene} className="step-item" data-scene={scene}>
                <div className="step-index"><em>{idx}</em> / {['Postfach','Buchhaltung','Inventur','Zeiterfassung','Team­verwaltung'][parseInt(idx)-1]}</div>
                <h3>{title}</h3><p>{text}</p>
              </div>
            ))}
          </div>
          <div className="visual-col">
            <div className="feature-visual">
              <div className="device">
                <div className="device-dots"><span/><span/><span/></div>
                <div className="device-frame">
                  <div className={`scene${activeScene==='inbox'?' active':''}`}>
                    <div className="inbox-row hi"><span className="inbox-dot" style={{background:'var(--accent)'}}/><span className="inbox-name">Kunde Müller GmbH</span><span className="inbox-snippet">Re: Angebot Sanierung — vielen Dank …</span><span className="inbox-time">07:48</span></div>
                    <div className="inbox-row"><span className="inbox-dot"/><span className="inbox-name">DATEV</span><span className="inbox-snippet">Monatsreporting bereit</span><span className="inbox-time">06:02</span></div>
                    <div className="inbox-row"><span className="inbox-dot" style={{background:'var(--accent-3)'}}/><span className="inbox-name">L. Schröder</span><span className="inbox-snippet">Urlaubsantrag 12.—19.08.</span><span className="inbox-time">05:55</span></div>
                    <div className="ai-reply">Sehr geehrte Frau Müller, vielen Dank für Ihre Rückmeldung. Wir bestätigen den Termin am <strong>23.04. um 09:00 Uhr</strong> …<span className="typing"/></div>
                  </div>
                  <div className={`scene${activeScene==='ledger'?' active':''}`}>
                    <div className="ocr-blip"><span className="ocr-pulse"/>OCR läuft</div>
                    <div className="ledger-head"><span>Datum</span><span>Beleg</span><span>Konto</span><span>Betrag</span></div>
                    <div className="ledger-row"><span>09.15</span><span>Rechnung <span className="cat">Elektro Baum</span></span><span>3400</span><span className="amount neg">−487,20</span></div>
                    <div className="ledger-row"><span>09.14</span><span>Abschlag <span className="cat">Müller GmbH</span></span><span>8400</span><span className="amount pos">+3.200,00</span></div>
                    <div className="ledger-row"><span>08.55</span><span>Kraftstoff <span className="cat">Tank AG</span></span><span>4600</span><span className="amount neg">−128,40</span></div>
                  </div>
                  <div className={`scene${activeScene==='inventory'?' active':''}`}>
                    <div className="inv-grid">{SKUS.map((sku,i)=><div key={sku} className={`inv-cell${[2,7,14].includes(i)?' lo':' ok'}`}>{sku}</div>)}</div>
                    <div className="inv-legend"><span>OK</span><span className="lo">Unterbestand</span></div>
                  </div>
                  <div className={`scene${activeScene==='time'?' active':''}`}>
                    <div className="time-ring">
                      <svg className="time-svg" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8"/>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" strokeDasharray="314" strokeDashoffset={arcDash} style={{transform:'rotate(-90deg)',transformOrigin:'60px 60px',transition:'stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)'}}/>
                        <text x="60" y="56" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="14" fill="#efede7">06:22</text>
                        <text x="60" y="72" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="rgba(239,237,231,.4)" letterSpacing="2">PROJEKT A</text>
                      </svg>
                    </div>
                  </div>
                  <div className={`scene${activeScene==='team'?' active':''}`}>
                    <div className="team-list">
                      <div className="team-tile"><span className="avatar">MK</span><div><div className="team-name">M. Keller</div><div className="team-role">im Dienst</div></div></div>
                      <div className="team-tile" style={{borderColor:'rgba(255,77,141,.3)',background:'rgba(255,77,141,.04)'}}><span className="avatar" style={{background:'linear-gradient(135deg,var(--accent-3),var(--accent-2))'}}>LS</span><div><div className="team-name">L. Schröder</div><div className="team-role" style={{color:'var(--accent-3)'}}>krank</div></div></div>
                      <div className="team-tile"><span className="avatar" style={{background:'linear-gradient(135deg,var(--accent),var(--accent-4))'}}>JH</span><div><div className="team-name">J. Hänisch</div><div className="team-role">im Dienst</div></div></div>
                      <div className="team-tile" style={{borderColor:'rgba(255,77,141,.3)',background:'rgba(255,77,141,.04)'}}><span className="avatar" style={{background:'linear-gradient(135deg,var(--accent-4),var(--accent-3))'}}>TB</span><div><div className="team-name">T. Baumann</div><div className="team-role" style={{color:'var(--accent-3)'}}>krank</div></div></div>
                      <div className="team-tile" style={{gridColumn:'1/-1',borderColor:'rgba(198,255,60,.4)',background:'rgba(198,255,60,.05)'}}><span className="avatar" style={{background:'var(--accent)'}}>KI</span><div><div className="team-name">Vorschlag: Springer F. Wolf für Di. 08–14 Uhr</div><div className="team-role" style={{color:'var(--accent)'}}>warten auf Freigabe</div></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
