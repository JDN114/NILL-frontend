// src/components/HowItWorks.jsx
import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Konto & Postfach verbinden",
      desc: "Sichere OAuth-Verbindung zu deinem E-Mail-Account herstellen und direkt im NILL-Dashboard verwalten."
    },
    {
      number: "2",
      title: "Regeln & Automatisierung konfigurieren",
      desc: "KI-gestützte Filter, Routing und Regeln einstellen, um E-Mails automatisch zu kategorisieren, zu priorisieren und weiterzuleiten."
    },
    {
      number: "3",
      title: "Automatisch ausführen lassen",
      desc: "E-Mails analysieren, Zusammenfassungen erstellen und Aktionen ausführen – alles live über das Dashboard, gesteuert von unserer KI."
    }
  ];

  return (
    <section id="how" className="py-16 bg-gradient-to-b from-transparent to-[#03060a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-semibold text-white">Wie NILL funktioniert</h3>
          <p className="text-gray-300 mt-3">
            Mit deinem NILL-Konto steuerst du E-Mail- und Kommunikationsaufgaben in 3 einfachen Schritten.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="glass p-6 rounded-xl text-center">
              <div className="text-xl font-bold text-white mb-2">{step.number}</div>
              <div className="text-white font-semibold mb-2">{step.title}</div>
              <p className="text-gray-300 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
