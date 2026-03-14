// src/components/Hero.jsx
import React from "react";
import HeroImg from "../assets/images/hero-image.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiClock, FiCloud } from "react-icons/fi";

export default function Hero() {
  const features = [
    { icon: <FiCheckCircle className="text-[var(--accent)] w-6 h-6" />, title: "99% Automatisierbar", subtitle: "Weniger manuelle Arbeit" },
    { icon: <FiClock className="text-[var(--accent)] w-6 h-6" />, title: "24/7 Support", subtitle: "Immer erreichbar" },
    { icon: <FiCloud className="text-[var(--accent)] w-6 h-6" />, title: "CO₂-effizient", subtitle: "Green hosting & nachhaltige Server" }
  ];

  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const pulseBtn = { scale: [1, 1.03, 1], transition: { duration: 1.2, repeat: Infinity } };

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Subtiler Farbverlauf */}
      <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/80 to-zinc-800/70 opacity-95" />

      <div className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Linke Seite: Text & Features */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.8 }} className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
              Automatisiere <span className="text-[var(--accent)]">Routineaufgaben</span> <br />
              und spare wertvolle Zeit
            </h1>

            <p className="text-gray-300 text-lg md:text-xl">
              NILL bündelt E-Mail-Automatisierung, Zusammenfassungen, Projektplanung und Buchhaltung in einer intelligenten KI-Plattform.
            </p>

            <motion.div whileHover={{ scale: 1.03 }} className="inline-block mt-4">
              <Link 
                to="/about-nill" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-400 transition"
              >
                Mehr erfahren
              </Link>
            </motion.div>

            {/* Feature Highlights */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((f, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  whileHover={{ y: -5 }}
                  className="glass p-4 rounded-xl flex items-center gap-3 backdrop-blur-md bg-white/5"
                >
                  {f.icon}
                  <div>
                    <div className="font-semibold text-white">{f.title}</div>
                    <div className="text-gray-300 text-sm">{f.subtitle}</div>
                  </div>
                </motion.div>
              ))}
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
              alt="Illustration der NILL Plattform mit automatisierten Prozessen" 
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
