import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const NO_PADDING_ROUTES = ["/dashboard/emails"];

export default function PageLayout({ children, noScroll }) {
  const { pathname } = useLocation();
  const noPadding = NO_PADDING_ROUTES.some(r => pathname.startsWith(r));
  const fixedHeight = noPadding || noScroll;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]" style={fixedHeight ? {display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden"} : {}}>
      <Navbar />
      {noPadding ? (
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {children}
        </div>
      ) : noScroll ? (
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full" style={{flex:1,overflow:"hidden",boxSizing:"border-box"}}>
          {children}
        </main>
      ) : (
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      )}
    </div>
  );
}
