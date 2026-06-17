import React from "react";
import { Link } from "react-router-dom";

// Warte-Rabatt auf die Komplett-Suite, solange Buchhaltung & NILL Sekretärin
// noch in Entwicklung sind. Hält die Landing-Section mit der PricingPage konsistent.
const WAIT_DISCOUNT = 0.3;
const SUITE_FROM = 25; // Solo monatlich
const suiteFromDiscounted = Math.round(SUITE_FROM * (1 - WAIT_DISCOUNT));

// Die Arbeitsstation ist das heute verfügbare Produkt und wird zuerst beworben.
const STATION_FEATURES = [
  "Smarte Arbeitsstation — Tablet- & Kiosk-Modus",
  "Zeiterfassung mit QR-Mitarbeiterausweis",
  "Aufgaben- & Taskmanagement fürs ganze Team",
  "Lieferscheine, Inventur & Bestandsführung",
  "E-Mail-Integration: Gmail, Outlook & IMAP",
  "Teamverwaltung, Rollen & HR-Dokumente",
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-transparent">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border border-[var(--brand)]/40 text-[var(--brand)]">
            Jetzt verfügbar
          </span>
          <h3 className="text-3xl font-semibold text-white mb-4">
            Die smarte Arbeitsstation
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Zeiterfassung, Taskmanagement, Lieferscheine und Inventur — sofort
            einsatzbereit. Ein Preis, beliebig viele Mitarbeiter, ohne Wartezeit.
          </p>
        </div>

        {/* Arbeitsstation — Hauptangebot */}
        <div className="relative glass p-8 md:p-10 rounded-2xl backdrop-blur border border-[var(--brand)] bg-white/5 shadow-xl">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--brand)] px-4 py-1 text-sm rounded-full font-semibold text-white">
            Sofort verfügbar
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-2xl font-semibold text-white mb-2">
                Arbeitsstation
              </h4>
              <p className="text-gray-400 text-sm mb-6">
                Die smarte Arbeitsstation für Ihren Betrieb — Tablet & Kiosk.
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold text-white">30€</span>
                <span className="text-gray-500 text-sm">/ Monat</span>
              </div>
              <div className="text-gray-500 text-sm mb-8">
                Unbegrenzte Stationen & Mitarbeiter
              </div>

              <Link
                to="/pricing"
                className="inline-block w-full text-center px-6 py-3 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-dark)] transition"
              >
                Jetzt starten
              </Link>
            </div>

            <ul className="text-gray-300 space-y-3 text-left">
              {STATION_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-[var(--brand)]">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* NILL Komplett-Suite — sekundär, mit WIP-Hinweis & Warte-Rabatt */}
        <div className="mt-8 glass p-6 md:p-8 rounded-2xl backdrop-blur border border-white/10 bg-white/3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-xl font-semibold text-white">
                  NILL Komplett-Suite
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase border border-[var(--brand)]/30 text-[var(--brand)]">
                  −{Math.round(WAIT_DISCOUNT * 100)}% Warte-Rabatt
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-xl">
                Inkl. <span className="text-white">Buchhaltung</span> und{" "}
                <span className="text-white">NILL Sekretärin</span> — beide aktuell
                noch in Entwicklung (WIP). Wer jetzt bucht, zahlt bis zum Go-Live
                weniger und wird als Erstes freigeschaltet.
              </p>
            </div>

            <div className="text-left md:text-right shrink-0">
              <div className="flex items-baseline gap-2 md:justify-end mb-3">
                <span className="text-lg text-gray-500 line-through">ab {SUITE_FROM}€</span>
                <span className="text-3xl font-bold text-white">ab {suiteFromDiscounted}€</span>
                <span className="text-gray-500 text-sm">/ Monat</span>
              </div>
              <Link
                to="/pricing"
                className="inline-block px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition"
              >
                Alle Pläne ansehen
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
