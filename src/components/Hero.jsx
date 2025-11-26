import React from "react";
import HeroImg from "../assets/images/hero-image.png";

export default function Hero() {
  return (
    <section id="home" className="relative">
      {/* Background gradient + decorative shapes */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/60 to-[#111827]/50 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: "#F9FAFB" }}>
              Automatisiere <span className="text-[#C5A572]">Routineaufgaben</span> — fokussiere das Wesentliche.
            </h1>
            <p className="max-w-xl text-gray-200 mb-6">
              NILL ist deine KI-basierte Assistenzplattform: E-Mail-Automatisierung, Terminplanung und intelligente Zusammenfassungen — alles automatisiert, datenschutzbewusst und klimafreundlich.
            </p>

            <div className="flex gap-4">
              <a href="/register" className="inline-flex items-center gap-2 bg-white text-[#111827] px-5 py-3 rounded-lg font-semibold shadow hover:shadow-lg transform hover:-translate-y-0.5 transition">
                Kostenlos testen
              </a>
              <a href="#about" className="inline-flex items-center gap-2 border border-white/30 text-white px-5 py-3 rounded-lg hover:bg-white/10 transition">
                Mehr erfahren
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <Statistic title="99% Automatisierbar" subtitle="Weniger manuelle Arbeit" />
              <Statistic title="24/7 Support" subtitle="Immer erreichbar" />
              <Statistic title="CO₂-effizient" subtitle="Grüne Infrastruktur" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-102 transition duration-500">
              <img src={HeroImg} alt="Hero" className="w-full h-auto object-cover" />
            </div>

            {/* subtle floating cards */}
            <div className="absolute -left-8 -bottom-8 bg-white rounded-xl p-4 shadow-md w-56 text-sm">
              <strong className="text-gray-900">Email AI</strong>
              <p className="text-gray-600">Kategorisierung, Zusammenfassungen & Routing.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Statistic({ title, subtitle }) {
  return (
    <div className="bg-white/10 p-3 rounded-lg">
      <p className="text-white font-semibold">{title}</p>
      <p className="text-gray-200 text-sm">{subtitle}</p>
    </div>
  );
}
