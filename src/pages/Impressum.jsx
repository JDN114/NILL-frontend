import React from "react";

export default function Impressum() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20 text-white">
      <h1 className="text-3xl font-bold mb-6">Impressum</h1>

      <p><strong>NILLAI</strong> – Inh. Julian David Nill</p>

      <p className="mt-2">
        <strong>Vertreten durch:</strong><br />
        Julian David Nill
      </p>

      <p className="mt-2">
        <strong>Adresse:</strong><br />
        {/* TODO: Mörikestraße 9, 72116 Mössingen */}
      </p>

      <p className="mt-2">
        <strong>Kontakt:</strong><br />
        {/* TODO: nillai@de */}
      </p>

      <p className="mt-6 text-gray-300 text-sm">
        Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: Julian David Nill
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-3">Haftungshinweis</h2>
      <p className="text-gray-300">
        Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung
        für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten
        sind ausschließlich deren Betreiber verantwortlich.
      </p>
    </section>
  );
}
