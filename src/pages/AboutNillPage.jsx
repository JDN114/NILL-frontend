import React from "react";
import PageLayout from "../components/layout/PageLayout";

export default function AboutNillPage() {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-6">Über NILL</h1>

        <p className="text-gray-300 mb-4">
          NILL ist Ihre zentrale KI-gestützte Plattform, die es Ihnen ermöglicht,
          E-Mails, Dokumente und Projekte effizient zu verwalten. Mit einem
          einzigen Konto erhalten Sie Zugang zu einer Vielzahl von Funktionen,
          die automatisiert, intelligent und auf Ihre Bedürfnisse zugeschnitten
          sind.
        </p>

        <p className="text-gray-300 mb-4">
          Über das Dashboard können Sie verschiedene Aufgaben gleichzeitig steuern,
          von E-Mail-Kategorisierung und Zusammenfassungen bis hin zu Projektplanung
          und Buchhaltungsfunktionen. Alle Prozesse laufen automatisiert ab,
          unterstützt durch moderne KI-Algorithmen, sodass Sie sich auf das Wesentliche
          konzentrieren können.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Nachhaltigkeit bei NILL</h2>

        <p className="text-gray-300 mb-4">
          NILL ist bereits heute klimaneutral. Unsere Server laufen zu 100% mit
          erneuerbarer Energie, und alle unvermeidbaren CO₂-Emissionen werden durch
          fachgerechte Kompensationsmaßnahmen ausgeglichen. So stellen wir sicher,
          dass jeder Klick, jede Analyse und jede Verarbeitung auf unserer Plattform
          umweltfreundlich abläuft.
        </p>

        <p className="text-gray-300 mb-4">
          Unser Ansatz kombiniert nachhaltige Infrastruktur mit leistungsstarker
          Technologie. Die Datenverarbeitung, KI-Auswertungen und Automatisierungen
          erfolgen effizient und ressourcenschonend. Wir setzen auf bewährte
          grüne Technologien und achten darauf, dass unsere Services langfristig
          ökologisch verträglich bleiben.
        </p>

        <p className="text-gray-300 mb-4">
          Mit NILL profitieren Sie also nicht nur von fortschrittlicher Automatisierung,
          sondern unterstützen gleichzeitig eine Plattform, die Verantwortung für
          die Umwelt übernimmt.
        </p>

        <div className="mt-8">
          <a
            href="/register"
            className="inline-block px-6 py-3 bg-[var(--brand)] text-white rounded-lg shadow-lg hover:bg-[var(--brand-hover)] transition"
          >
            Konto erstellen
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
