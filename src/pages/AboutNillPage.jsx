import React from "react";
import { motion } from "framer-motion";

export default function AboutNillPage() {
  const featureList = [
    "Zentrale Steuerung aller KI-Funktionen über das Dashboard",
    "E-Mail-Automatisierung: Kategorisierung, Zusammenfassungen, Extraktion von Daten",
    "Projektplanung & Terminmanagement",
    "Buchhaltung & Dokumenten-Management",
    "CO₂-effiziente Infrastruktur & 100% grüne Server",
    "Skalierbare KI-Lösungen für individuelle Bedürfnisse",
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#071023] to-[#03060a] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 space-y-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Über NILL
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            NILL ist eine intelligente KI-Plattform, die Routineaufgaben automatisiert
            und komplexe Workflows in einem Dashboard zusammenführt – effizient, sicher,
            und klimafreundlich.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12"
        >
          {featureList.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="glass p-6 rounded-2xl shadow-lg hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/10 text-white font-bold">
                  {idx + 1}
                </div>
                <p className="text-white font-semibold">{f}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Nachhaltigkeit Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-green-900/20 p-8 rounded-2xl text-center space-y-4"
        >
          <h2 className="text-3xl font-bold text-white">Nachhaltigkeit bei NILL</h2>
          <p className="text-gray-300">
            Schon jetzt klimaneutral: Unsere Server laufen zu 100% auf erneuerbarer Energie.
            Alles, was nicht direkt grün betrieben werden kann, kompensieren wir fachgerecht.
            Jeder Klick, jede Analyse trägt so aktiv zum Umweltschutz bei, ohne Kompromisse
            bei Leistung oder Sicherheit.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
