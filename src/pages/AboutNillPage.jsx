import React from "react";
import { motion } from "framer-motion";
import { FiShield, FiZap, FiGlobe } from "react-icons/fi";

export default function AboutNillPage() {
  return (
    <section className="min-h-screen py-24 bg-gradient-to-b from-[#03060a] to-[#071023]">
      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* Titel */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-6"
        >
          Über NILL
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-300 text-lg md:text-xl mb-12"
        >
          NILL ist deine zentrale Plattform für KI-gesteuerte Automatisierung. Von E-Mail-Management über Projektplanung bis hin zu Buchhaltung – alles in einem Dashboard steuerbar.
        </motion.p>

        {/* Interaktive Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            className="glass p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transition"
          >
            <FiZap className="text-[var(--accent)] w-10 h-10 mb-4"/>
            <h3 className="text-xl font-semibold text-white mb-2">KI-gesteuerte Effizienz</h3>
            <p className="text-gray-300 text-sm">
              Automatisiere Routineaufgaben, spare Zeit und erhöhe die Produktivität, ohne Komplexität.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            className="glass p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transition"
          >
            <FiShield className="text-[var(--accent)] w-10 h-10 mb-4"/>
            <h3 className="text-xl font-semibold text-white mb-2">Sicherheit & Datenschutz</h3>
            <p className="text-gray-300 text-sm">
              Alle Daten werden sicher verarbeitet. Wir setzen auf DSGVO-konforme Praktiken und transparente Verwaltung.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            className="glass p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transition"
          >
            <FiGlobe className="text-[var(--accent)] w-10 h-10 mb-4"/>
            <h3 className="text-xl font-semibold text-white mb-2">Nachhaltigkeit</h3>
            <p className="text-gray-300 text-sm">
              Klimaneutrale Infrastruktur, 100% erneuerbare Energie für unsere Server und CO₂-Kompensation für alles, was nicht grün betrieben werden kann.
            </p>
          </motion.div>
        </div>

        {/* Längerer Textbereich */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-16 space-y-6 text-left text-gray-300"
        >
          <p>
            Mit NILL erhältst du eine Plattform, die sich ständig weiterentwickelt: 
            Bald wirst du noch mehr KI-Funktionen steuern können, wie z.B. intelligente Priorisierung von E-Mails, automatische Zusammenfassungen ganzer Projekte oder erweiterte Buchhaltungsprozesse. 
          </p>
          <p>
            Unsere Mission ist es, KI zugänglich, intuitiv und transparent zu gestalten. Jeder Klick, jede Analyse und jede Automatisierung unterstützt nicht nur Effizienz, sondern auch nachhaltiges Handeln.
          </p>
          <p>
            So kombinieren wir leistungsstarke Technologie mit Verantwortung – für dein Business und unsere Umwelt.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
