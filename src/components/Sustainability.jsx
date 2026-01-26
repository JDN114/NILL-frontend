// src/components/Sustainability.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Sustainability() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "100% Grüne Energie",
      desc: "Alle Server werden mit erneuerbarer Energie betrieben. Jeder Klick zählt!",
    },
    {
      title: "CO₂-Kompensation",
      desc: "Nicht vollständig grüne Prozesse werden durch zertifizierte Kompensationsprojekte ausgeglichen.",
    },
    {
      title: "Verantwortungsvolle KI",
      desc: "Jede Analyse, jede Automation, jede KI-Verarbeitung erfolgt unter Berücksichtigung unserer Umweltbilanz.",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="sustainability"
      className="py-20 bg-gradient-to-b from-[#03060a] to-[#071023] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Überschrift */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          variants={fadeUp}
        >
          Nachhaltigkeit bei NILL
        </motion.h2>

        <motion.p
          className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          variants={fadeUp}
        >
          NILL ist bereits jetzt klimaneutral – wir warten nicht auf morgen. Unsere Server laufen zu 100% mit erneuerbarer Energie, und alles, was nicht vollständig grün betrieben werden kann, wird fachgerecht kompensiert.
        </motion.p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              className="glass p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              variants={cardAnim}
            >
              <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
              <p className="text-gray-300 text-sm">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-gray-400 mt-12 text-sm max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          variants={fadeUp}
        >
          So verbinden wir leistungsstarke KI-Funktionen mit echter Verantwortung für unsere Umwelt – für eine nachhaltige Zukunft, die schon heute beginnt.
        </motion.p>

        <motion.button
          className="mt-8 px-6 py-3 bg-[var(--brand)] text-white rounded-lg shadow-lg hover:bg-[var(--brand-hover)] transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          variants={fadeUp}
          onClick={() => navigate("/about-nill")}
          aria-label="Mehr erfahren über Nachhaltigkeit"
        >
          Mehr erfahren
        </motion.button>
      </div>

      {/* Dekorative Elemente */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-[var(--brand)] opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[var(--brand)] opacity-10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
    </section>
  );
}
