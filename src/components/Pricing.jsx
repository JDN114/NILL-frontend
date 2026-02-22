import React from "react";
import { Link } from "react-router-dom";

export default function Pricing() {
  const plans = [
    {
      id: "base",
      title: "Base",
      price: "0€",
      description: "Für Einzelpersonen und den Einstieg.",
      features: [
        "Email Integration",
        "E-Mail Zusammenfassungen",
        "Kategorisierung",
        "Daten- & Fakten-Extraktion",
      ],
    },
    {
      id: "advanced",
      title: "Advanced",
      price: "5€",
      description: "Mehr Automatisierung für produktive Teams.",
      highlight: true,
      features: [
        "Alles aus Base",
        "Automatisiertes Antworten",
        "Spam-Auto-Löschung",
        "Buchhaltungsfunktionen",
      ],
    },
    {
      id: "professional",
      title: "Professional",
      price: "10€",
      description: "Erweiterte KI & volle Kontrolle.",
      features: [
        "Alle Funktionen von Advanced",
        "Erweiterte KI-Features",
        "Priorisierter Support",
        "Individuelle Anpassungen",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Header */}
        <h3 className="text-3xl font-semibold text-white mb-4">
          Flexible Preisgestaltung
        </h3>
        <p className="text-gray-400 max-w-2xl mx-auto mb-14">
          Skalierbar für Freelancer, Teams und Unternehmen.
          Transparent, flexibel und jederzeit erweiterbar.
        </p>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8">

          {Array.isArray(plans) &&
            plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative glass p-8 rounded-2xl backdrop-blur border transition-all duration-300
                ${
                  plan.highlight
                    ? "border-[var(--brand)] bg-white/5 scale-105 shadow-xl"
                    : "border-white/10 bg-white/3 hover:bg-white/5"
                }`}
              >

                {/* Highlight Badge */}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--brand)] px-4 py-1 text-sm rounded-full font-semibold text-white">
                    Beliebt
                  </div>
                )}

                <h4 className="text-xl font-semibold text-white mb-2">
                  {plan.title}
                </h4>

                <p className="text-gray-400 text-sm mb-6">
                  {plan.description}
                </p>

                <div className="text-4xl font-bold text-white mb-2">
                  {plan.price}
                </div>

                <div className="text-gray-500 text-sm mb-6">
                  pro Monat
                </div>

                <ul className="text-gray-300 mb-8 space-y-2 text-left">
                  {Array.isArray(plan.features) &&
                    plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-[var(--brand)]">•</span>
                        {feature}
                      </li>
                    ))}
                </ul>

                <Link
                  to="/pricing"
                  className="inline-block w-full px-6 py-3 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-dark)] transition"
                >
                  Details ansehen
                </Link>
              </div>
            ))}

        </div>

        {/* Bottom CTA */}
        <div className="mt-16">
          <Link
            to="/pricing"
            className="inline-block px-8 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition"
          >
            Alle Funktionen vergleichen
          </Link>
        </div>

      </div>
    </section>
  );
}
