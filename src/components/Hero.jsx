// src/components/Hero.jsx
import React from "react";
import HeroImg from "../assets/images/hero-image.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  const features = [
    {
      title: "Automatisiere Routineaufgaben",
      subtitle: "Weniger manuelle Arbeit, mehr Fokus auf das Wesentliche"
    },
    {
      title: "Smart & Transparent",
      subtitle: "Alle Aktivitäten auf einen Blick"
    },
    {
      title: "Nachhaltig & Effizient",
      subtitle: "Green Hosting & ressourcenschonend"
    }
  ];

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Subtiler Hintergrund */}
      <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/80 to-zinc-800/70" />

      <div className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Linke Seite: Text & Features */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
              Automatisiere <span className="text-[var(--accent)]">Routineaufgaben</span> <br />
              und spare wertvolle Zeit
            </h1>

            <p className="text-gray-300 text-lg md:text-xl max-w-xl">
              NILL bündelt E-Mail-Automatisierung, Projektplanung und Buchhaltung in einer intelligenten KI-Plattform – 
              für mehr Übersicht, Effizienz und Kontrolle.
            </p>

            <div className="mt-6 flex gap-4 flex-wrap">
              <Link 
                to="/about-nill"
                className="inline-flex items-center px-6 py-3 bg-[var(--accent)] text-black font-semibold rounded-lg shadow-md hover:scale-[1.03] transition"
              >
                Mehr erfahren
              </Link>
            </div>

            {/* Feature Highlights */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((f, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  className="bg-white/5 p-4 rounded-xl flex flex-col gap-2"
                >
                  <div className="font-semibold text-white">{f.title}</div>
                  <div className="text-gray-300 text-sm">{f.subtitle}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rechte Seite: Hero Bild */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            {/* Soft Glow Kreise */}
            <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-pink-500/10 blur-2xl" />
            
            <img 
              src={HeroImg} 
              alt="Illustration der NILL Plattform mit automatisierten Prozessen" 
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
