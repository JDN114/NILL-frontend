import React from "react";

/**
  * About section — 2-column layout. Uses the uploaded screenshot/asset as the right-hand visual.
  * The image path is the one you provided in the conversation history.
  */

export default function About() {
   return (
     <section id="about" className="about">
       <div className="container about-grid">
         <div className="text-block">
           <h3>About NILL AI</h3>
           <p>
             Wir bauen ein KI-Modell, welches ihnen bei wiederkehrenden Aufgabensprozessenhelfen soll.
             Unsere Mission ist es, Aufgaben, welche automatisierbar sind, für sie zu übernehmen.
             So sparen sie Geld, und oder Zeit, da sie und ihre Arbeitskräfte sich nun auf Wichtigere Themen konzentrieren können.
           </p>
           <p style={{ marginTop: 12 }}>
             NILL sieht die heutige Zeit als eine neue Bewegung an.
             Wie vor 30 Jahren mit dem Internet, wird auch KI seinen Platz in der Welt finden.
             Unsere Idee ist es, KI umweltfreundlich, sowohl als auch sozial in den Arbeitsmarkt zu integrieren.
             Wir wollen keine Arbeitsplätze auflösen, sondern umgestalten.
           </p>
         </div>

         <div>
           <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 30px rgba(15,23,36,0.08)" }}>
             <img
               src="/mnt/data/DD69BE27-A46D-4E10-A6A9-D1E88EF4ABC3.jpeg"
               alt="About visual"
               style={{ width: "100%", height: "auto", display: "block" }}
             />
           </div>
         </div>
       </div>
     </section>
   );
}

