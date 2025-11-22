import React from "react";
import Logo from "./Logo";
  export default function Footer() {
   return (
     <footer className="footer" role="contentinfo">
       <div className="container inner">
         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
           <Logo width={100} height={28} />
           <div style={{ marginLeft: 6 }}>
             <div style={{ fontWeight: 700, color: "#e6eefc" }}>NILL</div>
             <div className="small">Simple. Fast. Efficient.</div>
           </div>
         </div>

         <div className="links" aria-hidden>
           <a href="#features">Features</a>
           <a href="#about">About</a>
           <a href="#contact">Contact</a>
         </div>

         <div className="copy" style={{ minWidth: 240, textAlign: "right" }}>
           © {new Date().getFullYear()} NILL AI — All rights reserved.
         </div>
       </div>
     </footer>
   );
}

