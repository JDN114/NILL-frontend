import { useRef, useState, useEffect } from 'react'
import '../../styles/pwa.css'

/* ──────────────────────────────────────────────────────────────
   PWASection
   ──────────────────────────────────────────────────────────────
   "App ohne App Store" — visual install guide across iOS / Android
   / macOS / Windows. Designed to live between <Pricing/> and
   <Sustainability/> on the NILL landing page.

   - Pure CSS/SVG, no extra dependencies
   - Reuses landing.css tokens (--accent, --ink, etc.)
   - All selectors namespaced .pwa-*
   ────────────────────────────────────────────────────────────── */

function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect() }
    }, { threshold })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return [ref, vis]
}

/* ── Tiny shared bits ─────────────────────────────────── */
const Icon = {
  Bolt: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>
    </svg>
  ),
  Wifi: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 8.5a17 17 0 0 1 20 0M5 12.5a12 12 0 0 1 14 0M8.5 16a7 7 0 0 1 7 0"/>
      <circle cx="12" cy="20" r="1" fill="currentColor"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a2 2 0 0 0 3.4 0"/>
    </svg>
  ),
  Share: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v13M8 7l4-4 4 4"/>
      <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v13M7 12l5 5 5-5"/>
      <path d="M5 21h14"/>
    </svg>
  ),
  Copy: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2.5"/>
      <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
    </svg>
  ),
  Lock: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="11" width="16" height="10" rx="2.5"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  ),
  Apple: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.7c0-2.5 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.8-3.2-.8-1.6 0-3.2 1-4 2.4-1.7 3-.4 7.5 1.3 9.9.8 1.2 1.8 2.5 3 2.5s1.7-.8 3.2-.8 1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.4-2.8-.1 0-2.7-1-2.7-4.1Zm-2.4-7.5c.7-.8 1.1-2 1-3-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.5Z"/>
    </svg>
  ),
  Android: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-11 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm10.9-5.2 1.5-2.6a.3.3 0 0 0-.1-.4.3.3 0 0 0-.4.1l-1.6 2.7c-1.3-.6-2.7-.9-4.3-.9s-3 .3-4.3.9L6.6 4.9a.3.3 0 0 0-.4-.1c-.2.1-.2.3-.1.4l1.5 2.6C5.1 9.1 3.5 11.4 3.2 14h17.6c-.3-2.6-1.9-4.9-4.4-6.2Z"/>
    </svg>
  ),
  Windows: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 5.5 11 4.4v7.1H3V5.5Zm0 13L11 19.6v-7.1H3v6Zm9 1.2L21 21V12.5h-9v7.2Zm0-8.3h9V3l-9 1.3v7.1Z"/>
    </svg>
  ),
}

/* ── Browser-chrome fragments ─────────────────────────── */
function MacChrome({ url, install }) {
  return (
    <div className="pwa-chrome">
      <div className="pwa-chrome-dots"><span/><span/><span/></div>
      <div className="pwa-chrome-url">
        <span className="lock"><Icon.Lock/></span><span>{url}</span>
      </div>
      <div className="pwa-chrome-icons">
        {install && <span className="install"><Icon.Plus/>App</span>}
      </div>
    </div>
  )
}

function MobileUrlBar({ url }) {
  return (
    <div className="pwa-chrome" style={{padding:'6px 10px'}}>
      <div className="pwa-chrome-url" style={{flex:1}}>
        <span className="lock"><Icon.Lock/></span><span>{url}</span>
      </div>
    </div>
  )
}

/* ── Body skeleton inside any mock screen ─────────────── */
function SiteSkeleton() {
  return (
    <div className="pwa-body">
      <div className="pwa-logo">
        <span className="pwa-logo-mark"/>
        <span className="pwa-logo-name">NILL</span>
      </div>
      <div className="pwa-hero">Intelligenz, <em>die mitarbeitet.</em></div>
      <div className="pwa-bar w90"/>
      <div className="pwa-bar w70"/>
      <div className="pwa-bar w50"/>
    </div>
  )
}

/* ── Per-OS install mock ──────────────────────────────── */
function MockIOS() {
  return (
    <div className="pwa-mock phone">
      <div className="pwa-screen">
        <MobileUrlBar url="nillai.de"/>
        <SiteSkeleton/>
        <div className="pwa-sheet" role="presentation">
          <div className="pwa-sheet-row">
            <span>Kopieren</span>
            <span className="ico"><Icon.Copy/></span>
          </div>
          <div className="pwa-sheet-row">
            <span>Lesezeichen</span>
            <span className="ico">★</span>
          </div>
          <div className="pwa-sheet-row hi">
            <span>Zum Home-Bildschirm</span>
            <span className="ico"><Icon.Plus/></span>
          </div>
        </div>
        <div className="pwa-ios-tabbar">
          <span>←</span>
          <span>→</span>
          <span className="share"><Icon.Share/></span>
          <span>▢</span>
          <span>⋮</span>
        </div>
        <div className="pwa-tap" style={{right:'14%',bottom:'42%'}}/>
      </div>
    </div>
  )
}

function MockAndroid() {
  return (
    <div className="pwa-mock phone">
      <div className="pwa-screen">
        <MobileUrlBar url="nillai.de"/>
        <SiteSkeleton/>
        <div className="pwa-android-banner">
          <span className="ico">N</span>
          <div className="txt">
            <strong>NILL installieren</strong>
            <span>nillai.de</span>
          </div>
          <span className="cta">Inst.</span>
        </div>
        <div className="pwa-tap" style={{right:'14%',bottom:'14%'}}/>
      </div>
    </div>
  )
}

function MockMacOS() {
  return (
    <div className="pwa-mock">
      <div className="pwa-screen">
        <MacChrome url="nillai.de" install/>
        <SiteSkeleton/>
        <div className="pwa-tap" style={{right:'18%',top:'14%'}}/>
      </div>
    </div>
  )
}

function MockWindows() {
  return (
    <div className="pwa-mock">
      <div className="pwa-screen">
        <div className="pwa-chrome">
          <div className="pwa-chrome-url">
            <span className="lock"><Icon.Lock/></span><span>nillai.de</span>
          </div>
          <div className="pwa-chrome-icons">
            <span className="install"><Icon.Download/>Installieren</span>
          </div>
        </div>
        <SiteSkeleton/>
        <div className="pwa-tap" style={{right:'12%',top:'14%'}}/>
      </div>
    </div>
  )
}

/* ── OS card data ─────────────────────────────────────── */
const OS_CARDS = [
  {
    key: 'ios',
    name: 'iPhone & iPad',
    browser: 'Safari · iOS 16+',
    tag: 'Mobil',
    icon: 'apple',
    Mock: MockIOS,
    steps: [
      <>NILL in <kbd>Safari</kbd> öffnen — <span style={{fontFamily:'var(--mono)',fontSize:12}}>nillai.de</span></>,
      <>Unten auf das <kbd className="accent"><Icon.Share/>Teilen</kbd>-Icon tippen</>,
      <>„<kbd className="accent">Zum Home-Bildschirm</kbd>&quot; wählen — fertig.</>,
    ],
  },
  {
    key: 'android',
    name: 'Android',
    browser: 'Chrome · Edge · Brave',
    tag: 'Mobil',
    icon: 'android',
    Mock: MockAndroid,
    steps: [
      <>NILL in <kbd>Chrome</kbd> öffnen — <span style={{fontFamily:'var(--mono)',fontSize:12}}>nillai.de</span></>,
      <>Banner erscheint — auf <kbd className="accent">Installieren</kbd> tippen.</>,
      <>Alternativ <kbd>⋮ Menü</kbd> → <kbd className="accent">App installieren</kbd>.</>,
    ],
  },
  {
    key: 'macos',
    name: 'macOS',
    browser: 'Safari 17 · Chrome · Edge',
    tag: 'Desktop',
    icon: 'apple',
    Mock: MockMacOS,
    steps: [
      <>NILL im Browser öffnen — <span style={{fontFamily:'var(--mono)',fontSize:12}}>nillai.de</span></>,
      <>In Safari: <kbd>Ablage</kbd> → <kbd className="accent">Zum Dock hinzufügen</kbd>.</>,
      <>In Chrome/Edge: <kbd className="accent"><Icon.Plus/>App-Icon</kbd> in der Adressleiste.</>,
    ],
  },
  {
    key: 'windows',
    name: 'Windows & Linux',
    browser: 'Edge · Chrome · Brave',
    tag: 'Desktop',
    icon: 'windows',
    Mock: MockWindows,
    steps: [
      <>NILL in <kbd>Edge</kbd> oder <kbd>Chrome</kbd> öffnen.</>,
      <>Rechts in der Adressleiste: <kbd className="accent"><Icon.Download/>Installieren</kbd>.</>,
      <>Per <kbd>Strg</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> öffnen — wie eine native App.</>,
    ],
  },
]

const OS_ICON = (key) =>
  key === 'apple'   ? <Icon.Apple/>   :
  key === 'android' ? <Icon.Android/> :
  key === 'windows' ? <Icon.Windows/> :
                      null

/* ── Stylized QR (decorative — not scannable) ─────────── */
function QRBlock() {
  const cells = []
  const SEED = 0x9E3779B9
  let s = SEED
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0, (s & 0xFFFF) / 0xFFFF)
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    if (rnd() > 0.52) cells.push([x, y])
  }
  const finder = (x, y) => (
    <g key={`f${x}${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="#0a0a0c" rx="1"/>
      <rect x={x+1} y={y+1} width="5" height="5" fill="#f3f0e6"/>
      <rect x={x+2} y={y+2} width="3" height="3" fill="#0a0a0c" rx=".5"/>
    </g>
  )
  const isInFinder = (x, y) =>
    (x<7&&y<7) || (x>13&&y<7) || (x<7&&y>13)
  return (
    <div className="pwa-qr" role="img" aria-label="QR-Code zu nillai.de">
      <svg viewBox="0 0 21 21" shapeRendering="crispEdges">
        {cells.filter(([x,y])=>!isInFinder(x,y)).map(([x,y])=>(
          <rect key={`c${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0a0a0c"/>
        ))}
        {finder(0,0)}{finder(14,0)}{finder(0,14)}
      </svg>
      <div className="pwa-qr-logo"/>
    </div>
  )
}

/* ── Main section ─────────────────────────────────────── */
export default function PWASection({ onCTA }) {
  const [headRef, headVis] = useReveal()
  const [gridRef, gridVis] = useReveal(0.04)

  return (
    <section id="app" className="pwa-section" data-screen-label="PWA">
      <div className="wrap">

        <div className={`pwa-head reveal${headVis?' in':''}`} ref={headRef}>
          <div>
            <span className="eyebrow">Progressive Web App · ohne App Store</span>
            <h2 style={{marginTop:24}}>
              Eine App. <em>Auf jedem Gerät.</em><br/>
              Direkt aus dem <em>Browser.</em>
            </h2>
          </div>
          <div>
            <p className="lead">
              NILL ist eine Progressive Web App — also eine ganz normale Website, die sich
              auf Wunsch wie eine native App verhält. Kein App-Store, keine Installation
              im klassischen Sinn, immer auf dem aktuellsten Stand.
            </p>
            <div className="pwa-badges">
              <span className="pwa-badge"><span className="dot"/>Offline-fähig</span>
              <span className="pwa-badge"><span className="dot"/>Push-Benachrichtigungen</span>
              <span className="pwa-badge muted"><span className="dot"/>Auto-Update</span>
              <span className="pwa-badge muted"><span className="dot"/>~3 MB</span>
            </div>
          </div>
        </div>

        <div className={`pwa-features reveal${headVis?' in':''}`}>
          <div className="pwa-feature">
            <div className="pwa-feature-ico"><Icon.Bolt/></div>
            <div>
              <h4>Startet wie eine native App</h4>
              <p>Eigenes Icon am Home-Bildschirm oder Dock. Ohne Browser-Chrome, im eigenen Fenster.</p>
            </div>
          </div>
          <div className="pwa-feature">
            <div className="pwa-feature-ico"><Icon.Wifi/></div>
            <div>
              <h4>Funktioniert auch offline</h4>
              <p>Belege fotografieren, Notizen erfassen — wird synchronisiert, sobald wieder Netz da ist.</p>
            </div>
          </div>
          <div className="pwa-feature">
            <div className="pwa-feature-ico"><Icon.Bell/></div>
            <div>
              <h4>Benachrichtigungen, wenn&apos;s zählt</h4>
              <p>Neue Mail mit Freigabe? Beleg vom Steuerberater? Push direkt auf Handy oder Desktop.</p>
            </div>
          </div>
        </div>

        <div className={`pwa-grid reveal${gridVis?' in':''}`} ref={gridRef}>
          {OS_CARDS.map(({ key, name, browser, tag, icon, Mock, steps }, i) => (
            <article
              key={key}
              className="pwa-card"
              onMouseMove={(e)=>{
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%')
                e.currentTarget.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%')
              }}
            >
              <header className="pwa-card-head">
                <div className="pwa-os">
                  <div className={`pwa-os-mark ${key}`}>{OS_ICON(icon)}</div>
                  <div>
                    <div className="pwa-os-name">{name}</div>
                    <div className="pwa-os-browser">{browser}</div>
                  </div>
                </div>
                <span className="pwa-tag">0{i+1} · {tag}</span>
              </header>

              <Mock/>

              <ol className="pwa-steps">
                {steps.map((s, idx) => (
                  <li key={idx} className={`pwa-step${idx===1?' hi':''}`}>
                    <span className="pwa-step-n">{idx+1}</span>
                    <span className="pwa-step-txt">{s}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <div className="pwa-footer reveal in">
          <QRBlock/>
          <div className="pwa-footer-text">
            <span className="eyebrow">Jetzt ausprobieren</span>
            <h3>Scannen, öffnen, <em>installieren.</em></h3>
            <p>Smartphone-Kamera auf den Code richten oder die URL direkt im Browser deiner Wahl öffnen — der Rest dauert keine 10 Sekunden.</p>
          </div>
          <a
            className="pwa-footer-url"
            href="https://nillai.de"
            onClick={(e)=>{
              if (!navigator.clipboard) return
              e.preventDefault()
              navigator.clipboard.writeText('https://nillai.de')
              window.open('https://nillai.de','_blank')
            }}
          >
            <span>nillai.de</span>
            <span className="copy"><Icon.Copy/></span>
          </a>
        </div>

      </div>
    </section>
  )
}
