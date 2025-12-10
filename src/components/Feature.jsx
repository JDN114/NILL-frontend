import React from "react";

/* Simple inline SVG icons for features */
const Icon = ({ name }) => {
   if (name === "speed") {
     return (
       <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden>
         <path d="M3 12h3l2-4 4 8 5-10 3 6" stroke="#1e6cff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
     );
   }
   if (name === "api") {
     return (
       <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden>
         <rect x="3" y="6" width="7" height="12" rx="2" stroke="#1e6cff" strokeWidth="1.6"/>
         <rect x="14" y="6" width="7" height="12" rx="2" stroke="#1e6cff" strokeWidth="1.6"/>
       </svg>
     );
   }
   return (
     <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden>
       <circle cx="12" cy="12" r="9" stroke="#1e6cff" strokeWidth="1.6" />
       <path d="M8 12l2 3 4-6" stroke="#1e6cff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
     </svg>
   );
};

export default function Features() {
   const items = [
     { id: 1, icon: "speed", title: "Fast Integration", text: "SDKs and components that plug into your stack in minutes — not days." },
     { id: 2, icon: "api", title: "Stable APIs", text: "Designed for production: predictable behavior, great docs and versioning." },
     { id: 3, icon: "trust", title: "Secure by Design", text: "Enterprise-ready security, privacy controls, and auditability." },
   ];

   return (
     <section id="features" className="features">
       <div className="container">
         <h3 style={{ marginBottom: 18 }}>Features</h3>
         <div className="features-grid">
           {items.map(it => (
             <div className="feature" key={it.id}>
               <div aria-hidden>
                 <Icon name={it.icon} />
               </div>
               <div>
                 <h4>{it.title}</h4>
                 <p>{it.text}</p>
               </div>
             </div>
           ))}
         </div>
       </div>
     </section>
   ); 
}

