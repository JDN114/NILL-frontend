import React from "react";

export default function Datenschutz() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20 text-white">
      <h1 className="text-3xl font-bold mb-8">Datenschutzerklärung</h1>

      <p className="text-gray-300 mb-6">
        Der Schutz Ihrer persönlichen Daten liegt uns am Herzen.
        Wir verarbeiten personenbezogene Daten ausschließlich gemäß der gesetzlichen
        Datenschutzvorschriften (DSGVO).
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Verantwortlicher</h2>
      <p className="text-gray-300">
        NILLAI – Inh. Julian David Nill<br />
        {/* TODO: Deine Anschrift einfügen */}
        <br />
        {/* TODO: Kontakt-E-Mail */}
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. Hosting</h2>
      <p className="text-gray-300">
        Unsere Systeme werden bei der Hetzner Online GmbH (Deutschland) betrieben.
        Die Server werden ausschließlich in Nürnberg in Rechenzentren mit 100%
        erneuerbarer Energie betrieben.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        3. Datenerhebung beim Besuch der Website
      </h2>
      <p className="text-gray-300">
        Beim Aufruf unserer Website werden automatisch technische Daten
        (IP-Adresse – anonymisiert, Browser, Datum/Uhrzeit) erfasst.
        Dies ist notwendig, um die Website sicher und stabil bereitzustellen.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Kontaktaufnahme</h2>
      <p className="text-gray-300">
        Wenn Sie uns kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung
        der Anfrage. Diese Daten werden vertraulich behandelt und nicht an
        unbefugte Dritte weitergegeben.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Cookies</h2>
      <p className="text-gray-300">
        Wir verwenden technisch notwendige Cookies, um grundlegende Funktionen
        unserer Website zu ermöglichen (z. B. Login und Session-Management).
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Rechte der Nutzer</h2>
      <ul className="list-disc list-inside text-gray-300">
        <li>Auskunft über gespeicherte Daten</li>
        <li>Löschung oder Berichtigung</li>
        <li>Einschränkung der Verarbeitung</li>
        <li>Widerruf erteilter Einwilligungen</li>
      </ul>

      <p className="text-gray-300 mt-10 text-sm">
        Änderungen dieser Datenschutzerklärung bleiben vorbehalten.
      </p>
    </section>
  );
}
