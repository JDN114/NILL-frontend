import React from "react";

export default function Pricing() {
  const plans = [
    {
      title: "Base",
      price: "0€",
      features: [
        "Email Integration",
        "E-Mail Zusammenfassungen",
        "Kategorisierung",
        "Daten- & Fakten-Extraktion",
      ],
    },
    {
      title: "Advanced",
      price: "5€",
      features: [
        "Alles aus Base",
        "Automatisiertes Antworten",
        "Automatisches Löschen von Spam nach 30 Tagen",
        "Buchhaltungsfunktionen",
      ],
    },
    {
      title: "Professional",
      price: "10€",
      features: [
        "Alle Funktionen von Advanced",
        "Erweiterte KI-Features",
        "Priorisierter Support",
        "Individuelle Anpassungen",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-2xl font-semibold text-white mb-10">Pricing</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className="glass p-6 rounded-2xl hover:shadow-xl transition">
              <h4 className="text-xl font-semibold text-white mb-4">{plan.title}</h4>
              <div className="text-3xl font-bold text-white my-4">{plan.price}</div>
              <ul className="text-gray-300 mb-6 space-y-2">
                {plan.features.map((f, idx) => (
                  <li key={idx}>• {f}</li>
                ))}
              </ul>
              <a
                href="/register"
                className="inline-block px-6 py-2 rounded bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-dark)] transition"
              >
                Registrieren
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
