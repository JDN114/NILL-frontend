import React from "react";
import FeatureCard from "./FeatureCard";

export default function FeaturesGrid() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mt-8">Unsere Kernfeatures</h2> {/* <--- mt-8 für minimalen Abstand */}
        <p className="text-gray-300 mt-2">
          Von automatisierter Email-Zusammenfassung - Bis zur Projektplanung und Buchhaltung.
          Mit NILL, sparen sie Geld - Und Zeit.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard title="E-Mail-Kategorisierung" desc="Automatische Zuordnung nach Absender & Thema" />
        <FeatureCard title="Zusammenfassungen" desc="Threads kurz & verständlich zusammenfassen" />
        <FeatureCard title="Autom. Antworten" desc="Vorschläge und Templates generieren" />
        <FeatureCard title="Terminplanung" desc="Kalenderintegration & Terminvorschläge" />
        <FeatureCard title="Dokument-Extraktion" desc="OCR + NLP für Verträge & Rechnungen" />
        <FeatureCard title="Anomalie Erkennung" desc="Ungewöhnliches Kommunikationsverhalten erkennen" />
      </div>
    </section>
  );
}
