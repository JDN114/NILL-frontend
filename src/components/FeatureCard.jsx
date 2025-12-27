import React from "react";
import FeatureCard from "./FeatureCard";

export default function FeaturesGrid() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12"> {/* etwas mehr Abstand nach unten */}
        <h2 className="text-3xl font-bold text-white mt-8">
          Unsere Kernfeatures
        </h2>
        <p className="text-gray-300 mt-3">
          Von E-Mail-Parsing bis Vertrags-Extraktion — alles automatisiert und
          effizient.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Gap 8 = 2rem Abstand zwischen Cards, für harmonischeren Look */}
        <FeatureCard title="E-Mail-Kategorisierung" desc="Automatische Zuordnung nach Absender & Thema" />
        <FeatureCard title="Zusammenfassungen" desc="Threads kurz & verständlich zusammenfassen" />
        <FeatureCard title="Autom. Antworten" desc="Vorschläge und Templates generieren" />
        <FeatureCard title="Projektplanung" desc="Automatisierte Projektplanung - coming soon" />
        <FeatureCard title="Buchhaltung" desc="Buchhaltung einfach gemacht - Automatisiertes auslesen von Rechnungen und Kontoauszügen" />
        <FeatureCard title="Termine und Daten" desc="Extrahierung von Terminen und Fakten - Sowie Kerninhalte von Verträgen" />
      </div>
    </section>
  );
}
