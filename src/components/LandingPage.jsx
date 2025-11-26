import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#071028] text-gray-100">
      <Header />
      <main className="pt-24">
        <Hero />

        {/* About / Features */}
        <section id="about" className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Was NILL für dein Unternehmen macht</h2>
              <p className="text-gray-300 mb-6">
                NILL automatisiert repetitive Office-Aufgaben – E-Mail-Parsing, Terminplanung, Dokumentenextraktion, Priorisierung und Follow-ups. Reduziere Zeitaufwand, steigere Präzision.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <li className="bg-white/5 p-4 rounded-lg">E-Mail Kategorisierung</li>
                <li className="bg-white/5 p-4 rounded-lg">Automatische Zusammenfassungen</li>
                <li className="bg-white/5 p-4 rounded-lg">Terminplanung & Kalender</li>
                <li className="bg-white/5 p-4 rounded-lg">Vertragsextraktion (OCR)</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-tr from-white/5 to-white/3 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Schnellstart</h3>
              <p className="text-gray-300 mb-4">In 3 Schritten zur Automatisierung: 1) Konto anlegen 2) Postfach verbinden 3) Regeln prüfen.</p>
              <div className="flex gap-3">
                <a href="/register" className="px-4 py-2 bg-[#111827] text-white rounded-md">Konto erstellen</a>
                <a href="/contact" className="px-4 py-2 border border-white/20 text-white rounded-md">Kontakt</a>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section id="sustainability" className="bg-gradient-to-b from-transparent to-[#071028] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-bold mb-4">Nachhaltigkeit</h3>
            <p className="text-gray-300">NILL läuft auf energieeffizienten, klimaneutralen Servern und nutzt optimierte Inferenzabläufe, um CO₂ zu sparen.</p>
          </div>
        </section>

        {/* Kontakt / CTA */}
        <section id="kontakt" className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h4 className="text-2xl font-semibold mb-4">Bereit für den nächsten Schritt?</h4>
            <p className="text-gray-300 mb-6">Teste NILL kostenlos für 14 Tage.</p>
            <a href="/register" className="inline-block bg-[#111827] text-white px-8 py-3 rounded-lg font-semibold shadow hover:opacity-95 transition">Jetzt starten</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
