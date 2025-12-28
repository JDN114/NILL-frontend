import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiCalendar, FiFileText, FiTrendingUp, FiShield } from "react-icons/fi";

export default function AboutNillPage() {
  const features = [
    {
      icon: <FiMail size={32} />,
      title: "E-Mail Automatisierung",
      desc: "Alle eingehenden E-Mails werden intelligent kategorisiert, zusammengefasst und auf Wunsch automatisch beantwortet – alles über dein NILL Dashboard.",
    },
    {
      icon: <FiCalendar size={32} />,
      title: "Projekt- & Terminplanung",
      desc: "NILL erkennt Termine und Deadlines automatisch aus deinen E-Mails und Dokumenten und hilft dir, alles im Kalender zu organisieren.",
    },
    {
      icon: <FiFileText size={32} />,
      title: "Dokumenten- & Daten-Extraktion",
      desc: "Verträge, Rechnungen oder wichtige Dokumente werden analysiert, relevante Informationen extrahiert und in deinem Dashboard bereitgestellt.",
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: "Buchhaltungsfunktionen",
      desc: "Automatisierte Erfassung von Einnahmen, Ausgaben und wichtigen Kennzahlen – NILL spart Zeit und reduziert Fehlerquellen.",
    },
    {
      icon: <FiShield size={32} />,
      title: "Sicherheit & Datenschutz",
      desc: "Alle Daten werden DSGVO-konform verarbeitet, unser Hosting läuft klimaneutral auf Hetzner-Servern in Deutschland, mit CO₂-Kompensation für alles, was nicht 100% grün ist.",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-transparent to-[#03060a] py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Über NILL
        </motion.h1>
        <motion.p
          className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl mb-16"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          NILL ist deine zentrale KI-Plattform für intelligente E-Mail- und Dokumentenprozesse. 
          Vom Posteingang bis zur Buchhaltung – alles zentral über ein Dashboard steuerbar, 
          effizient, sicher und klimaneutral.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              className="glass p-6 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col items-center text-center"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="text-[var(--accent)] mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-300 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Nachhaltigkeit & Verantwortung</h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm md:text-base">
            NILL ist bereits heute klimaneutral. Unsere Server laufen zu 100% mit erneuerbarer Energie 
            und alles, was nicht 100% grün betrieben werden kann, wird über CO₂-Kompensation fachgerecht ausgeglichen. 
            Jeder Klick, jede Verarbeitung und jede Analyse trägt so zu einem verantwortungsvollen Umgang mit Ressourcen bei.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
