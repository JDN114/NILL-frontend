import React from "react";
import HeroImg from "../assets/images/hero-image.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiClock, FiCloud } from "react-icons/fi";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#071023] to-[#03060a] opacity-95" />

      <div className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Linke Seite: Text, Button, Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
              Automatisiere <span className="text-[var(--accent)]">Routineaufgaben</span> <br />
              und spare wertvolle Zeit
            </h1>

            <p className="text-gray-300 text-lg md:text-xl">
              NILL bündelt E-Mail-Automatisierung, Zusammenfassungen, Projektplanung und Buchhaltung in einer intelligenten KI-Plattform.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link 
                to="/about-nill" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition"
              >
                Mehr erfahren
              </Link>
            </div>

            {/* Feature Highlights */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -5 }} className="glass p-4 rounded-xl flex items-center gap-3">
                <FiCheckCircle className="text-[var(--accent)] w-6 h-6"/>
                <div>
                  <div className="font-semibold text-white">99% Automatisierbar</div>
                  <div className="text-gray-300 text-sm">Weniger manuelle Arbeit</div>
                </div>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="glass p-4 rounded-xl flex items-center gap-3">
                <FiClock className="text-[var(--accent)] w-6 h-6"/>
                <div>
                  <div className="font-semibold text-white">24/7 Support</div>
                  <div className="text-gray-300 text-sm">Immer erreichbar</div>
                </div>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="glass p-4 rounded-xl flex items-center gap-3">
                <FiCloud className="text-[var(--accent)] w-6 h-6"/>
                <div>
                  <div className="font-semibold text-white">CO₂-effizient</div>
                  <div className="text-gray-300 text-sm">Green hosting & nachhaltige Server</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Hero Bild */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <img 
              src={HeroImg} 
              alt="Hero" 
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
