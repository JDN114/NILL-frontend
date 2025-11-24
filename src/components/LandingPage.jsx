import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import heroImage from "../assets/hero-bg.jpg";

export default function LandingPage() {
   const [menuOpen, setMenuOpen] = useState(false);

   return (
     <div className="relative min-h-screen font-sans text-gray-900 bg-white">
       {/* HEADER */}
       <header className="fixed w-full z-50 flex items-center justify-between px-6 py-4 bg-white bg-opacity-80 backdrop-blur-md shadow-md transition-all">
         <div className="flex items-center">
           <button
             className="mr-4 md:hidden"
             onClick={() => setMenuOpen(!menuOpen)}
           >
             <svg
               className="w-6 h-6 text-gray-800"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg"
             >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
             </svg>
           </button>
           <img src={logo} alt="Logo" className="h-12 w-auto" />
         </div>
         <nav className="hidden md:flex space-x-6 items-center font-medium">
           <Link to="/login" className="text-gray-800 hover:text-primary transition font-semibold">Login</Link>
           <Link to="/contact" className="text-gray-800 hover:text-primary transition font-semibold">Kontakt</Link>
         </nav>
       </header>

       {/* SLIDE-OUT MENU */}
       <div
         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform ${
           menuOpen ? "translate-x-0" : "-translate-x-full"
         } transition-transform duration-300 ease-in-out z-40 md:hidden`}
       >
         <div className="flex justify-end p-4">
           <button onClick={() => setMenuOpen(false)}>
             <svg
               className="w-6 h-6 text-gray-800"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
             >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
             </svg>
           </button>
         </div>
         <ul className="flex flex-col p-6 space-y-6 text-lg font-medium">
           <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
           <li><Link to="/about" onClick={() => setMenuOpen(false)}>Über uns</Link></li>
           <li><Link to="/nachhaltigkeit" onClick={() => setMenuOpen(false)}>Nachhaltigkeit</Link></li>
           <li><Link to="/impressum" onClick={() => setMenuOpen(false)}>Impressum</Link></li>
           <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Kontakt</Link></li>
           <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
         </ul>
       </div>

       {/* HERO SECTION */}
       <main
         className="flex flex-col justify-center items-center text-center h-screen px-6 md:px-0"
         style={{
           backgroundImage: `url(${heroImage})`,
           backgroundSize: "cover",
           backgroundPosition: "center",
         }}
       >
         <div className="bg-black bg-opacity-50 rounded-lg p-8 max-w-4xl">
           <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading">
             Smarte Email Automation mit NILL
           </h1>
           <p className="text-lg md:text-2xl text-gray-200 mb-8">
             Spare Zeit und steigere Produktivität – AI-gesteuerte Kategorisierung und Zusammenfassung.
           </p>
           <div className="flex flex-col md:flex-row gap-4 justify-center">
             <Link
               to="/login"
               className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:-translate-y-1"
             >
               Jetzt starten
             </Link>
             <Link
               to="/contact"
               className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition transform hover:-translate-y-1"
             >
               Kontakt
             </Link>
           </div>
         </div>
       </main>

       {/* FEATURES / SECTIONS */}
       <section className="py-20 bg-gray-50">
         <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
           <div className="transition transform hover:-translate-y-2 hover:shadow-lg p-6 rounded-lg bg-white">
             <h3 className="text-2xl font-semibold mb-4">Über uns</h3>
             <p className="text-gray-600">
               Wir entwickeln innovative Lösungen, um Unternehmenskommunikation zu automatisieren.
             </p>
           </div>
           <div className="transition transform hover:-translate-y-2 hover:shadow-lg p-6 rounded-lg bg-white">
             <h3 className="text-2xl font-semibold mb-4">Nachhaltigkeit</h3>
             <p className="text-gray-600">
               Effiziente Prozesse sparen Zeit und Ressourcen – gut für dich und die Umwelt.
             </p>
           </div>
           <div className="transition transform hover:-translate-y-2 hover:shadow-lg p-6 rounded-lg bg-white">
             <h3 className="text-2xl font-semibold mb-4">Kontakt</h3>
             <p className="text-gray-600">
               Bei Fragen stehen wir jederzeit bereit. Einfach über das Kontaktformular schreiben.
             </p>
           </div>
         </div>
       </section>

       {/* CTA SECTION */}
       <section className="py-20 bg-primary text-white text-center">
         <h2 className="text-3xl md:text-4xl font-semibold mb-6">Bereit für smartere Emails?</h2>
         <Link
           to="/login"
           className="bg-white text-primary px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
         >
           Jetzt starten
         </Link>
       </section>

       {/* FOOTER */}
       <footer className="py-8 bg-gray-900 text-gray-400 text-center">
         <p>&copy; {new Date().getFullYear()} NILL Email Automation. Alle Rechte vorbehalten.</p>
         <div className="mt-4 flex justify-center space-x-6">
           <Link to="/impressum" className="hover:text-white">Impressum</Link>
           <Link to="/contact" className="hover:text-white">Kontakt</Link>
           <Link to="/nachhaltigkeit" className="hover:text-white">Nachhaltigkeit</Link>
         </div>
       </footer>
     </div>
   );
}


