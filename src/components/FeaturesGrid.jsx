// src/components/FeaturesGrid.tsx
import React from "react";
import FeatureCard from "./FeatureCard";

interface Feature {
  title: string;
  desc: string;
}

const features: Feature[] = [
  { title: "E-Mail-Kategorisierung", desc: "Automatische Zuordnung nach Absender & Inhalt." },
  { title: "Zusammenfassungen", desc: "Threads kurz & verständlich zusammengefasst." },
  { title: "Autom. Antworten", desc: "Vorschläge und Templates für schnelle Antworten." },
  { title: "Projektplanung", desc: "Automatisierte Projektplanung & Aufgabenmanagement." },
  { title: "Buchhaltung", desc: "Buchhaltung einfach gemacht - Automatisierte Extraktion." },
  { title: "Termine & Daten", desc: "Extrahierung von Terminen und wichtigen Fakten." },
];

export default function FeaturesGrid() {
  return (
    <section
      id="features"
      className="max-w-7xl mx-auto px-6 py-16"
      aria-label="Kernfeatures von NILL"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mt-8">
          Unsere Kernfeatures
        </h2>
        <p className="text-gray-300 mt-3">
          Alle Funktionen zentral im NILL-Dashboard steuern – KI-gestützt & effizient.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <FeatureCard
            key={idx}
            index={idx}
            title={feature.title}
            desc={feature.desc}
          />
        ))}
      </div>
    </section>
  );
}
