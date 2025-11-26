import React from "react";
import HeroImg from "../assets/images/hero-image.png";
import { motion } from "framer-motion";

export default function Hero(){
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#071023] to-[#03060a] opacity-90"></div>

      <div className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.6 }} className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
              Automatisiere <span className="text-[var(--accent)]">Routineaufgaben</span> — schenke deinem Team Zeit für Strategie.
            </motion.h1>

            <motion.p initial={{ y: 6, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.1 }} className="text-gray-300 max-w-xl">
              NILL ist eine KI-Plattform für E-Mail-Automatisierung, intelligente Zusammenfassungen, Kalender-Integration und Unternehmens-Workflow-Automatisierung — datenschutzkonform und CO₂-effizient.
            </motion.p>

            <div className="flex gap-4">
              <a href="/register" className="inline-flex items-center gap-2 btn-primary px-5 py-3 rounded-lg font-semibold shadow-lg">Kostenlos testen</a>
              <a href="#about" className="inline-flex items-center gap-2 border border-white/10 text-white px-5 py-3 rounded-lg">Mehr erfahren</a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="glass p-3 rounded-lg text-sm">
                <div className="font-semibold text-white">99% Automatisierbar</div>
                <div className="text-gray-300 text-xs">Weniger manuelle Arbeit</div>
              </div>
              <div className="glass p-3 rounded-lg text-sm">
                <div className="font-semibold text-white">24/7 Support</div>
                <div className="text-gray-300 text-xs">Immer erreichbar</div>
              </div>
              <div className="glass p-3 rounded-lg text-sm">
                <div className="font-semibold text-white">CO₂-effizient</div>
                <div className="text-gray-300 text-xs">Green hosting partners</div>
              </div>
            </div>
          </div>

          <motion.div initial={{ scale: 0.98, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:0.6 }} className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition">
              <img src={HeroImg} alt="Hero" className="w-full h-auto object-cover" />
            </div>

            <div className="absolute -left-10 -bottom-10 bg-white/6 border border-white/5 p-3 rounded-xl w-56 animate-floaty">
              <div className="text-xs text-gray-100 font-semibold">Realtime Insights</div>
              <div className="text-[12px] text-gray-300">Actionable suggestions for follow-ups</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
