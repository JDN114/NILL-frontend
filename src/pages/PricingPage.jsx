import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://api.nillai.de";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly/yearly
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState(null);

  const plans = [
    {
      id: "base",
      title: "Base",
      monthlyPrice: 1.500,
      yearlyPrice: 12,
      description: "Ideal für Einzelpersonen und Einstieg.",
      features: [
        "Email Integration",
        "E-Mail Zusammenfassungen",
        "Kategorisierung",
      ],
    },
    {
      id: "advanced",
      title: "Advanced",
      monthlyPrice: 5,
      yearlyPrice: 50,
      highlight: true,
      description: "Für produktive Teams und wachsende Unternehmen.",
      features: [
        "Alles aus Base",
        "Automatisiertes Antworten",
        "Spam-Auto-Löschung nach 30 Tagen",
        "integrierter smarter Kalender",
      ],
    },
    {
      id: "professional",
      title: "Professional",
      monthlyPrice: 10,
      yearlyPrice: 100,
      description: "Maximale Kontrolle und erweiterte KI.",
      features: [
        "Alle Funktionen von Advanced",
        "Erweiterte KI-Features",
        "Buchhaltungsfunktion",
        "Teamerstellung und Verwaltung",
      ],
    },
  ];

  const handleCheckout = async (planId) => {
    setError(null);
    setLoadingPlan(planId);

    try {
      const response = await axios.post(
        `${API_URL}/billing/create-checkout-session`,
        { plan: planId, billing_cycle: billingCycle },
        { withCredentials: true }
      );

      if (response?.data?.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        setError("Checkout konnte nicht gestartet werden.");
      }
    } catch (err) {
      setError("Zahlungsvorgang derzeit nicht verfügbar.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white py-24 px-6">
      <div className="max-w-7xl mx-auto text-center">

        <h1 className="text-4xl font-semibold mb-4">
          Flexible Pläne für jede Organisationsgröße
        </h1>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Skalierbar, mandantenfähig und produktionsbereit. Wählen Sie den passenden Plan für Ihr Unternehmen.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 p-1 rounded-xl backdrop-blur border border-white/10 flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-lg transition ${
                billingCycle === "monthly"
                  ? "bg-[var(--brand)] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monatlich
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-lg transition ${
                billingCycle === "yearly"
                  ? "bg-[var(--brand)] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Jährlich
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 text-red-400 bg-red-900/20 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const price =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 backdrop-blur border transition-all duration-300
                ${
                  plan.highlight
                    ? "border-[var(--brand)] bg-white/5 scale-105 shadow-2xl"
                    : "border-white/10 bg-white/3 hover:bg-white/5"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--brand)] px-4 py-1 text-sm rounded-full font-semibold text-white">
                    Beliebt
                  </div>
                )}

                <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <div className="text-4xl font-bold mb-2">{price}€</div>
                <div className="text-gray-500 text-sm mb-6">
                  {billingCycle === "monthly" ? "pro Monat" : "pro Jahr"}
                </div>

                <ul className="text-gray-300 space-y-2 mb-8 text-left">
                  {Array.isArray(plan.features) &&
                    plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2 text-[var(--brand)]">•</span>
                        {f}
                      </li>
                    ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loadingPlan === plan.id}
                  className="w-full py-3 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-dark)] transition disabled:opacity-50"
                >
                  {loadingPlan === plan.id ? "Weiterleitung..." : "Jetzt starten"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16 text-gray-500 text-sm">
          Alle Preise verstehen sich zzgl. gesetzlicher Mehrwertsteuer. Kündigung jederzeit möglich.
        </div>
      </div>
    </div>
  );
}
