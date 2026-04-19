import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const NO_PADDING_ROUTES = ["/dashboard/emails"];

export default function PageLayout({ children }) {
  const { pathname } = useLocation();
  const noPadding = NO_PADDING_ROUTES.some(r => pathname.startsWith(r));

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]" style={noPadding ? {display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden"} : {}}>
      <Navbar />
      {noPadding ? (
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {children}
        </div>
      ) : (
        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      )}
    </div>
  );
}
