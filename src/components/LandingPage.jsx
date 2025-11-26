import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import FeatureCard from "./FeatureCard";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <Hero />

        <section id="about" className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-white">Was NILL für dein Unternehmen macht</h2>
            <p className="text-gray-300 mt-3">Automatisiere repetitive Aufgaben und gib deinem Team Zeit zurück für strategische Arbeit.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard title="E-Mail Kategorisierung" desc="Automatische Zuordnung zu Teams & Priorisierung" />
            <FeatureCard title="Zusammenfassungen" desc="Lange Threads auf das Wesentliche komprimieren" />
            <FeatureCard title="Follow-up & Erinnerungen" desc="Follow-ups vorschlagen und nachfassen" />
          </div>
        </section>

        <section id="sustainability" className="py-16 bg-gradient-to-b from-transparent to-[#04060b]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-white">Klimafokus</h3>
                <p className="text-gray-300 mt-3">Wir betreiben Infrastruktur auf energieeffizienten Servern und optimieren Modelle für niedrigen Energieverbrauch.</p>
              </div>
              <div>
                <div className="glass p-6 rounded-xl">
                  <p className="text-sm text-gray-200 font-semibold">CO₂-effiziente Architektur</p>
                  <p className="text-xs text-gray-400 mt-2">Optimierte Inferenzpipelines, Green hosting partners</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="kontakt" className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h4 className="text-2xl font-semibold text-white mb-4">Bereit loszulegen?</h4>
            <p className="text-gray-300 mb-6">Teste NILL 14 Tage kostenlos.</p>
            <a href="/register" className="inline-block bg-[var(--brand)] text-white px-8 py-3 rounded-lg font-semibold shadow hover:opacity-95">Jetzt starten</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
