/* ────────────────────────────────────────────────────────────
   Shared landing chrome — Nav, Footer, Modal + small primitives.
   Lifted out of LandingPage.jsx so the landing page AND the
   spun-off marketing sub-pages (App / Nachhaltigkeit / Wie es
   arbeitet) share exactly one definition each.
   ──────────────────────────────────────────────────────────── */
import { useRef, useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/landing.css";

/* ─── REVEAL ─────────────────────────────────────────────── */
export function useReveal(threshold = 0.12) {
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

/* Generic scroll-reveal wrapper — stagger=true animates children in cascade */
export function Reveal({ className = '', stagger = false, children, ...rest }) {
  const [ref, vis] = useReveal(0.08);
  return (
    <div ref={ref} className={`${stagger ? 'stagger' : 'reveal'}${vis ? ' in' : ''} ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* ─── MAGNETIC BUTTON ────────────────────────────────────── */
function useMagnetic(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const mv = e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX-r.left-r.width/2)/r.width*18}px,${(e.clientY-r.top-r.height/2)/r.height*18}px)`;
    };
    const ml = () => el.style.transform = '';
    el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', ml);
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', ml); };
  }, []);
}

/* href → plain anchor · to → react-router Link · neither → button */
export function MagBtn({ className, children, onClick, href, to, style }) {
  const ref = useRef(null);
  useMagnetic(ref);
  if (to)   return <Link ref={ref} to={to} className={className} onClick={onClick} style={style}>{children}</Link>;
  if (href) return <a ref={ref} href={href} className={className} onClick={onClick} style={style}>{children}</a>;
  return <button ref={ref} className={className} onClick={onClick} style={style}>{children}</button>;
}

/* ─── NAV ────────────────────────────────────────────────── */
// to → spun-off page (SPA Link) · anchor → section on the landing page
// (smooth-scroll when already on "/", full nav to "/#id" from a sub-page).
const NAV_ITEMS = [
  { label: 'Produkte',         anchor: 'produkte' },
  { label: 'Wie es arbeitet',  to: '/wie-es-arbeitet' },
  { label: 'Preise',           anchor: 'preise' },
  { label: 'App',              to: '/app' },
  { label: 'Nachhaltigkeit',   to: '/nachhaltigkeit' },
  { label: 'FAQ',              anchor: 'faq' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const onLanding = useLocation().pathname === '/';
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn(); addEventListener('scroll', fn, {passive:true});
    return () => removeEventListener('scroll', fn);
  }, []);
  const anchor = id => onLanding ? `#${id}` : `/#${id}`;
  return (
    <header className={`nav${scrolled?' scrolled':''}`} id="nav">
      <div className="wrap">
        {onLanding
          ? <a className="brand" href="#top"><span className="brand-mark" aria-hidden="true"/><span>NILL</span></a>
          : <Link className="brand" to="/"><span className="brand-mark" aria-hidden="true"/><span>NILL</span></Link>}
        <nav aria-label="Primary">
          <ul>
            {NAV_ITEMS.map(item => (
              <li key={item.label}>
                {item.to
                  ? <Link to={item.to}>{item.label}</Link>
                  : <a href={anchor(item.anchor)}>{item.label}</a>}
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-auth">
          <a href="https://nillai.de/login" className="btn-auth">Login</a>
          <a href="https://nillai.de/register" className="btn-auth primary">Registrieren</a>
        </div>
      </div>
    </header>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────── */
export function Footer() {
  const onLanding = useLocation().pathname === '/';
  const anchor = id => onLanding ? `#${id}` : `/#${id}`;
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div><div className="brand" style={{marginBottom:18}}><span className="brand-mark"/><span>NILL</span></div><p style={{maxWidth:'32ch'}}>Das KI-Betriebssystem für Unternehmen. Gebaut in Deutschland, gehostet in Frankfurt.</p></div>
          <div><h4>Produkt</h4><ul>
            <li><a href={anchor('produkte')}>Module</a></li>
            <li><Link to="/wie-es-arbeitet">Wie es arbeitet</Link></li>
            <li><a href={anchor('preise')}>Preise</a></li>
            <li><Link to="/app">App</Link></li>
            <li><Link to="/nachhaltigkeit">Nachhaltigkeit</Link></li>
            <li><a href={anchor('faq')}>FAQ</a></li>
            <li><Link to="/changelog">Changelog</Link></li>
          </ul></div>
          <div><h4>Unternehmen</h4><ul>
            <li><Link to="/ueber-uns">Über uns</Link></li>
            <li><Link to="/karriere">Karriere</Link></li>
          </ul></div>
          <div><h4>Rechtliches</h4><ul>
            <li><Link to="/Impressum">Impressum</Link></li>
            <li><Link to="/Datenschutz">Datenschutz</Link></li>
            <li><Link to="/agb">AGB</Link></li>
            <li><Link to="/sicherheit">Sicherheit</Link></li>
          </ul></div>
        </div>
        <div className="wordmark">NILL<em>.</em></div>
        <div className="foot-meta"><span>© 2026 NILL AI - Inh. Julian David Nill · nillai.de</span><span>Made with intelligence · Frankfurt a.M.</span></div>
      </div>
    </footer>
  );
}

/* ─── MODAL ──────────────────────────────────────────────── */
export const PRESETS = {
  'Demo':         {t:'Live-Demo <em>anfragen.</em>',        s:'Terminvorschlag per Mail, persönlich via Videocall.'},
  'Paket':        {t:'Paket <em>wählen.</em>',              s:'Wir konfigurieren Module & Preis gemeinsam.'},
  'Gespräch':     {t:'Kurzes <em>Gespräch.</em>',           s:'15 Minuten reichen. Ehrliche Beratung, kein Sales-Druck.'},
  'Frühzugang':   {t:'Frühzugang <em>sichern.</em>',        s:'Erste Plätze gehen an Frühanfragen.'},
  'Termin':       {t:'Termin <em>buchen.</em>',             s:'Sag uns Zeitraum und Kanal — Telefon, Videocall oder vor Ort.'},
  'Nachhaltigkeitsbericht': {t:'Nachhaltigkeits&shy;bericht <em>anfordern.</em>', s:'Wir schicken dir unseren aktuellen Bericht per Mail.'},
  'default':      {t:'Lass uns <em>reden.</em>',            s:'Kurz ein paar Infos — wir melden uns innerhalb von 24 h zurück.'},
};

export function Modal({ intent, onClose }) {
  const [sent, setSent] = useState(false);
  const preset = PRESETS[intent] || PRESETS.default;
  useEffect(() => { setSent(false); }, [intent]);
  useEffect(() => {
    const fn = e => { if(e.key==='Escape') onClose(); };
    addEventListener('keydown', fn);
    return () => removeEventListener('keydown', fn);
  }, [onClose]);
  useEffect(() => {
    document.body.style.overflow = intent ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [intent]);

  const submit = e => {
    e.preventDefault();
    const d = new FormData(e.target);
    const name = (d.get('name')||'').trim();
    const email = (d.get('email')||'').trim();
    if (!name || !email) { e.target.reportValidity(); return; }
    const subj = encodeURIComponent(`NILL · ${intent||'Anfrage'} — ${name}`);
    const body = encodeURIComponent(`Anliegen: ${intent||'—'}\nName: ${name}\nFirma: ${d.get('company')||'—'}\nE-Mail: ${email}\n\n${d.get('message')||''}`);
    window.location.href = `mailto:hallo@nillai.de?subject=${subj}&body=${body}`;
    setSent(true);
  };

  return (
    <div className={`modal-overlay${intent?' open':''}`} onClick={e=>{if(e.target===e.currentTarget||e.target.classList.contains('modal-bg'))onClose()}}>
      <div className="modal-bg"/>
      <div className="modal-panel">
        <button className="modal-close" onClick={onClose} type="button" aria-label="Schließen">×</button>
        {!sent ? (
          <>
            <div className="modal-eyebrow">NILL · {intent||'Anfrage'}</div>
            <h3 dangerouslySetInnerHTML={{__html:preset.t}}/>
            <p className="sub">{preset.s}</p>
            <form onSubmit={submit} autoComplete="on" noValidate>
              <div className="form-row">
                <div><label htmlFor="mn">Name</label><input id="mn" name="name" required placeholder="Vor- und Nachname"/></div>
                <div><label htmlFor="mc">Unternehmen</label><input id="mc" name="company" placeholder="Firmenname"/></div>
              </div>
              <div className="form-row">
                <div><label htmlFor="me">E-Mail</label><input id="me" name="email" type="email" required placeholder="du@firma.de"/></div>
                <div><label htmlFor="mp">Telefon <span style={{opacity:.5}}>· optional</span></label><input id="mp" name="phone" placeholder="+49 ..."/></div>
              </div>
              <div className="form-field"><label htmlFor="mm">Nachricht</label><textarea id="mm" name="message" placeholder="Welches Modul interessiert dich?"/></div>
              <div className="modal-actions">
                <small>Per Klick auf „Senden" wird dein Mailprogramm geöffnet.</small>
                <MagBtn className="btn btn-primary"><span>Senden</span><span className="arrow">→</span></MagBtn>
              </div>
            </form>
          </>
        ) : (
          <div style={{textAlign:'center',padding:'10px 0'}}>
            <div className="modal-eyebrow">Gesendet · ✓</div>
            <h3>Danke, <em>wir sind dran.</em></h3>
            <p style={{margin:'0 auto',maxWidth:'40ch'}}>Deine Anfrage ist im Postfach. Ein Mensch antwortet innerhalb weniger Stunden.</p>
            <div style={{display:'flex',justifyContent:'center',marginTop:22}}>
              <MagBtn className="btn btn-ghost" onClick={onClose}><span>Schließen</span></MagBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SUB-PAGE SHELL ─────────────────────────────────────────
   Chrome for the spun-off marketing pages: vignette + nav +
   section(s) + footer + the shared contact modal. `render` gets
   an `onCTA(intent)` opener so sections keep working unchanged. */
export function LandingPageShell({ title, render, mainStyle, mainClassName }) {
  const [intent, setIntent] = useState(null);
  const openModal = useCallback((i) => setIntent(i || 'default'), []);
  const closeModal = useCallback(() => setIntent(null), []);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (title) document.title = title;
  }, [title]);
  return (
    <>
      <div className="vignette" aria-hidden="true"/>
      <LandingNav/>
      <main className={mainClassName} style={{paddingTop:84, ...mainStyle}}>
        {render(openModal)}
      </main>
      <Footer/>
      <Modal intent={intent} onClose={closeModal}/>
    </>
  );
}
