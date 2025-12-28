import React from "react";
import HeroImg from "../assets/images/hero-image.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#071023] to-[#03060a] opacity-90"></div>

      <div className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.h1 
              initial={{ y: -10, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.6 }}
            >
              Automatisiere <span className="text-[var(--accent)]">Routineaufgaben</span>
            </motion.h1>

            <motion.p 
              initial={{ y: 6, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              NILL ist eine KI-Plattform für E-Mail-Automatisierung, intelligente Zusammenfassungen und mehr.
            </motion.p>

            <div className="flex gap-4">
              {/* Mehr erfahren Button */}
              <Link 
                to="/about-nill" 
                className="inline-flex items-center gap-2 btn-primary"
              >
                Mehr erfahren
              </Link>

              {/* Optional anderer Button, z.B. Registrierung */}
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 border border-white/20 rounded px-4 py-2 text-white"
              >
                Registrieren
              </Link>
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

          {/* Optional: Hero Bild rechts */}
          <div className="hidden lg:block">
            <img src={HeroImg} alt="Hero" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
