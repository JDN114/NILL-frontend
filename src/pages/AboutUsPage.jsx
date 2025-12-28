import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AboutUsPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const principles = [
    {
      title: "Tradition",
      text: "NILL ist ein Name mit Geschichte – geprägt von Ehrgeiz, Integrität und Bodenständigkeit.",
    },
    {
      title: "Besessenheit",
      text: "Wir geben uns nur mit Exzellenz zufrieden. Perfektion ist unser Anspruch.",
    },
    {
      title: "Willensstärke",
      text: "Wir glauben daran, Probleme nicht zu umgehen – sondern zu lösen.",
    },
  ];

  return (
    <section className="pt-28 pb-28 bg-gradient-to-b from-[#03060a] to-[#071023] text-center px-6">
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-white mb-4"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        Über uns
      </motion.h1>

      <motion.p
        className="text-gray-300 max-w-4xl mx-auto text-lg leading-relaxed"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.8 }}
      >
        Hallo! Ich bin <strong className="text-white">Julian David Nill</strong> —
        Gründer von NILL — geboren in der Nähe von Tübingen.
        Seit Jahren fasziniert mich, wie Technologie das Leben der Menschen
        verbessern kann. Künstliche Intelligenz ist keine Zukunftsvision
        mehr, sondern Realität – vergleichbar mit dem Internetboom der
        frühen 2000er. Jetzt ist der Moment, die Welle zu reiten –
        oder unterzugehen.
      </motion.p>

      {/* Akronym – stylisch hervorgehoben */}
      <motion.div
        className="mt-16 mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--brand)] mb-6">
          NILL – Neural Intelligence for Less Labour
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          <strong className="text-white">Neuronale Intelligenz für weniger Arbeit</strong> –
          ein Akronym, das unsere Mission widerspiegelt:
          Technologie soll Arbeit nicht ersetzen –
          sondern Menschen stärken.
        </p>
      </motion.div>

      {/* Werte als Karten – ähnlich Sustainability */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {principles.map((p, i) => (
          <motion.div
            key={i}
            className="glass p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            variants={fadeUp}
          >
            <h3 className="text-xl font-semibold text-white">{p.title}</h3>
            <p className="text-gray-300 mt-3 text-sm">{p.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Mission Statement */}
      <motion.div
        className="max-w-4xl mx-auto mt-20 text-gray-300 text-lg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
        variants={fadeUp}
      >
        <p>
          Ja, KI wird Arbeitswelt und Gesellschaft verändern –
          und Verantwortung ist dabei entscheidend.
          Bei NILL stellen wir sicher, dass Technologie Menschen
          nicht verdrängt, sondern befähigt:
        </p>

        <p className="text-2xl md:text-3xl font-bold text-white mt-6">
          „Mensch & Maschine – gemeinsam stärker als allein.“
        </p>

        <p className="mt-6">
          Unser Ziel: Monotone Arbeit automatisieren – damit Zeit
          für Kreativität, Innovation und Menschlichkeit bleibt.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="mt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        variants={fadeUp}
      >
        <Link
          to="/"
          className="px-6 py-3 bg-[var(--brand)] text-white rounded-lg shadow-lg hover:bg-[var(--brand-hover)] transition"
        >
          Zurück zur Startseite
        </Link>
      </motion.div>
    </section>
  );
}
