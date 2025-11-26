import React from "react";
import HeroImg from "../assets/images/hero-image.png";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071023] via-[#081426] to-[#03060a] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
              Automatisiere <span style={{ color: "#C5A572" }}>Routineaufgaben</span> — fokus auf das Wesentliche.
            </h1>

            <p className="text-gray-300 max-w-xl">
              NILL ist deine KI-basierte Assistenzplattform: E-Mail-Automatisierung, intelligente Zusammenfassungen, Terminplanung und mehr — datenschutzbewusst und energieeffizient.
            </p>

            <div className="flex gap-4">
              <a href="/register" className="inline-flex items-center gap-2 bg-white text-[#111827] px-5 py-3 rounded-lg font-semibold shadow hover:shadow-lg transition transform hover:-translate-y-0.5">
                Kostenlos testen
              </a>
              <a href="#about" className="inline-flex items-center gap-2 border border-white/10 text-white px-5 py-3 rounded-lg hover:bg-white/5 transition">Mehr erfahren</a>
            </div>

            <div className="flex gap-4 mt-6">
              <div className="glass p-4 rounded-xl">
                <div className="text-sm text-gray-100 font-semibold">Email AI</div>
                <div className="text-xs text-gray-300">Kategorisierung & Zusammenfassung</div>
              </div>
              <div className="glass p-4 rounded-xl">
                <div className="text-sm text-gray-100 font-semibold">Terminplanung</div>
                <div className="text-xs text-gray-300">Automatisch & smart</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl transform transition hover:scale-[1.02]">
              <img src={HeroImg} alt="Hero" className="w-full h-auto object-cover" />
            </div>

            <div className="absolute -left-10 -bottom-10 bg-white/6 border border-white/4 p-4 rounded-xl w-56 animate-floaty">
              <div className="text-xs text-gray-100 font-semibold">Realtime Insights</div>
              <div className="text-[12px] text-gray-300">Actionable suggestions for follow-ups</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
