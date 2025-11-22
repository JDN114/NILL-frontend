import React from "react";

/**
  * Hero section. Uses the uploaded image as visual asset.
  * Path used exactly as provided in conversation history.
  */ 

export default function Hero() {
   return (
     <section id="home" className="hero">
       <div className="container hero-grid">
         <div>
           <h1 className="hero-title">Mit NILL, können sie Zeit und Geld effizient sparen.</h1>
           <p className="hero-sub">
             NILL lässt sie repetive Aufgaben in ihrem Unternehmen komplett autonom automatisieren.
             Saubere Email-Kategorisierung, effiziente Meetingzusammenfassung, automatisierte Projektplanung, und auch bald, eine KI-Sekräterin.
           </p>
           <div className="hero-ctas">
             <a className="btn btn-primary" href="#get-started">Get Started</a>
             <a className="btn btn-ghost" href="#features">See Features</a>
           </div>
            <div style={{ marginTop: 22 }}>
             <small className="small">Software, made in Germany</small>
           </div>
         </div>
          <div className="hero-visual">
           <div className="visual-card" aria-hidden>
             {/* ← local image path from upload (you provided this) */}
             <img
               src="/mnt/data/CEE417AD-7EA2-4F3F-BA8A-311BD28915EC.png"
               alt="Illustration"
               style={{ width: "100%", height: "auto", borderRadius: 10 }}
             />
           </div>
         </div>
       </div>
     </section>
   );
}

