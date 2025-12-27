import React from "react";

export default function HowItWorks() {
  return (
    <section id="how" className="py-16 bg-gradient-to-b from-transparent to-[#03060a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-semibold text-white">Wie NILL funktioniert</h3>
          <p className="text-gray-300 mt-3">
            Mit deinem NILL-Konto steuern Sie E-Mail- und Kommunikationsaufgaben in 3 einfachen Schritten
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Schritt 1 */}
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-xl font-bold text-white mb-2">1</div>
            <div className="text-white font-semibold mb-2">Konto & Postfach verbinden</div>
            <p className="text-gray-300 text-sm">
              Sichere OAuth-Verbindung zu deinem E-Mail-Account herstellen und direkt im NILL-Dashboard verwalten.
            </p>
          </div>

          {/* Schritt 2 */}
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-xl font-bold text-white mb-2">2</div>
            <div className="text-white font-semibold mb-2">Regeln & Automatisierung konfigurieren</div>
            <p className="text-gray-300 text-sm">
              KI-gestützte Filter, Routing und Regeln einstellen, um E-Mails automatisch zu kategorisieren, zu priorisieren und weiterzuleiten.
            </p>
          </div>

          {/* Schritt 3 */}
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-xl font-bold text-white mb-2">3</div>
            <div className="text-white font-semibold mb-2">Automatisch ausführen lassen</div>
            <p className="text-gray-300 text-sm">
              E-Mails analysieren, Zusammenfassungen erstellen und Aktionen ausführen – alles live über das Dashboard, gesteuert von unserer KI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
