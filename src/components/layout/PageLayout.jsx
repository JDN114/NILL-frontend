import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const NO_PADDING_ROUTES = ["/dashboard/emails"];

export default function PageLayout({ children, noScroll, noScrollMobileOnly, footer }) {
  const { pathname } = useLocation();
  const noPadding = NO_PADDING_ROUTES.some(r => pathname.startsWith(r));
  // noScroll = fixed viewport shell on ALL sizes; noScrollMobileOnly = fixed shell
  // only on mobile, normal document scroll on desktop (so long pages just scroll).
  const fixedHeight = noPadding || noScroll;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nill-page-main { padding-bottom: calc(62px + env(safe-area-inset-bottom, 0)) !important; }
          .nill-page-fixed { height: calc(100dvh - 64px) !important; }
        }
        /* Mobile-only fixed shell: lock to the viewport and let the inner pane
           scroll on phones; on desktop these are no-ops so the page scrolls
           normally with the document. Breakpoint matches SettingsPage (700px). */
        @media (max-width: 700px) {
          .nill-shell-mobilefixed { height: 100dvh !important; overflow: hidden !important; display: flex !important; flex-direction: column !important; }
          .nill-main-mobilefixed { flex: 1 !important; min-height: 0 !important; overflow: hidden !important; }
        }
        /* Dashboard (noScroll) shell: on phones, stop fighting the viewport.
           Instead of clipping content with a fixed 100dvh / overflow:hidden
           shell — which cuts off the lower module tiles and hides the footer
           behind the bottom tab bar — let the page scroll naturally with the
           document. Sticky navbar + fixed bottom nav stay as chrome; content is
           padded to clear the tab bar. One scroll container = native feel. */
        @media (max-width: 768px) {
          .nill-shell-noscroll {
            height: auto !important;
            min-height: 100dvh !important;
            overflow: visible !important;
            padding-bottom: calc(62px + env(safe-area-inset-bottom, 0)) !important;
          }
          .nill-shell-noscroll .nill-page-main {
            overflow: visible !important;
            min-height: 0 !important;
            flex: 0 0 auto !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
      <div
        className={`min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] ${noScrollMobileOnly ? "nill-shell-mobilefixed" : ""} ${noScroll && !noPadding ? "nill-shell-noscroll" : ""}`}
        style={fixedHeight ? {display:"flex",flexDirection:"column",height:"100dvh",overflow:"hidden"} : {}}
      >
        <Navbar />
        {noPadding ? (
          <div className="nill-page-fixed" style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            {children}
          </div>
        ) : noScroll ? (
          <>
            <main className="nill-page-main p-4 sm:p-6 max-w-7xl mx-auto w-full" style={{flex:1,overflow:"hidden",minHeight:0,boxSizing:"border-box"}}>
              {children}
            </main>
            {footer}
          </>
        ) : noScrollMobileOnly ? (
          <>
            <main className="nill-page-main nill-main-mobilefixed p-4 sm:p-6 max-w-7xl mx-auto w-full" style={{boxSizing:"border-box"}}>
              {children}
            </main>
            {footer}
          </>
        ) : (
          <main className="nill-page-main p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        )}
      </div>
    </>
  );
}
