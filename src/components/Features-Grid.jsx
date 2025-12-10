import React from "react";
import FeatureCard from "./FeatureCard";

export default function FeaturesGrid(){
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white">Unsere Kernfeatures</h2>
        <p className="text-gray-300 mt-2">Von E-Mail-Parsing bis Vertrags-Extraktion — alles modular.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard title="E-Mail-Kategorisierung" desc="Automatische Zuordnung nach Abteilungen & Priorität" />
        <FeatureCard title="Zusammenfassungen" desc="Threads kurz & verständlich zusammenfassen" />
        <FeatureCard title="Autom. Antworten" desc="Vorschläge und Templates generieren" />
        <FeatureCard title="Terminplanung" desc="Kalenderintegration & Terminvorschläge" />
        <FeatureCard title="Dokument-Extraktion" desc="OCR + NLP für Verträge & Rechnungen" />
        <FeatureCard title="Anomalie Erkennung" desc="Ungewöhnliches Kommunikationsverhalten erkennen" />
      </div>
    </section>
  );
}
