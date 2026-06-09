import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const NO_PADDING_ROUTES = ["/dashboard/emails"];

export default function PageLayout({ children, noScroll, footer }) {
  const { pathname } = useLocation();
  const noPadding = NO_PADDING_ROUTES.some(r => pathname.startsWith(r));
  const fixedHeight = noPadding || noScroll;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nill-page-main { padding-bottom: calc(62px + env(safe-area-inset-bottom, 0)) !important; }
          .nill-page-fixed { height: calc(100dvh - 64px) !important; }
        }
      `}</style>
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]" style={fixedHeight ? {display:"flex",flexDirection:"column",height:"100dvh",overflow:"hidden"} : {}}>
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
        ) : (
          <main className="nill-page-main p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        )}
      </div>
    </>
  );
}
