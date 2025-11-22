import React, { useState } from "react";
import Logo from "./Logo";

export default function Header() {
   const [open, setOpen] = useState(false);

   return (
     <header className="header">
       <div className="container header-inner">
         <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
           <a href="/" aria-label="home" className="logo-inline">
             <Logo width={110} height={34} />
           </a>
           <span className="small">Modern AI Landing</span>
         </div>

         <nav className="nav" aria-label="Main Navigation">
           <a href="#home">Home</a>
           <a href="#features">Features</a>
           <a href="#about">About</a>
           <a href="#contact">Contact</a>
         </nav>

         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
           <a className="cta" href="#get-started">Get Started</a>
           <button
             className="mobile-toggle"
             aria-expanded={open}
             aria-label="Open menu"
             onClick={() => setOpen((s) => !s)}
           >
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
               <path d="M3 6h18M3 12h18M3 18h18" stroke="#0f1724" strokeWidth="1.6" strokeLinecap="round"/>
             </svg>
           </button>
         </div>

         {/* Mobile Menu */}
         <div className={`mobile-menu ${open ? "open" : ""}`} role="menu">
           <a href="#home" onClick={() => setOpen(false)}>Home</a>
           <a href="#features" onClick={() => setOpen(false)}>Features</a>
           <a href="#about" onClick={() => setOpen(false)}>About</a>
           <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
         </div>
       </div>
     </header>
   );
}

