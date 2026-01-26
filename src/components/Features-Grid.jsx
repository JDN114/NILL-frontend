// src/components/FeaturesGrid.tsx
import React from "react";
import FeatureCard from "./FeatureCard";

interface Feature {
  title: string;
  desc: string;
}

// ------------------------
// FeaturesGrid Component
// ------------------------
export default function FeaturesGrid() {
  const features: Feature[] = [
    { title: "E-Mail-Kategorisierung", desc: "Automatische Zuordnung nach Abteilungen & Priorität" },
    { title: "Zusammenfassungen", desc: "Threads kurz & verständlich zusammenfassen" },
    { title: "Autom. Antworten", desc: "Vorschläge und Templates generieren" },
    { title: "Terminplanung", desc: "Kalenderintegration & Terminvorschläge" },
    { title: "Dokument-Extraktion", desc: "OCR + NLP für Verträge & Rechnungen" },
    { title: "Anomalie Erkennung", desc: "Ungewöhnliches Kommunikationsverhalten erkennen" },
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16" aria-label="Kernfeatures">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white">Unsere Kernfeatures</h2>
        <p className="text-gray-300 mt-2">Von E-Mail-Parsing bis Vertrags-Extraktion — alles modular.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, idx) => (
          <FeatureCard
            key={idx}
            index={idx}
            title={f.title}
            desc={f.desc}
          />
        ))}
      </div>
    </section>
  );
}
