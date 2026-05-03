import React from "react";

export default function AGB() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20 text-white">
      <h1 className="text-3xl font-bold mb-6">Allgemeine Geschäftsbedingungen (AGB)</h1>

      <p className="text-gray-300 mb-6">Stand: Mai 2025</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">§ 1 Geltungsbereich</h2>
      <p className="text-gray-300 mb-4">
        Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen NILLAI
        (Inh. Julian David Nill, Mörikestraße 9, 72116 Mössingen) und den Nutzern der
        Plattform NILL.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">§ 2 Leistungsumfang</h2>
      <p className="text-gray-300 mb-4">
        NILL stellt eine webbasierte Business-Management-Plattform bereit, die Module für
        Buchhaltung, Workflow, E-Mail, Kalender und Lohnbuchhaltung umfasst. Der genaue
        Leistungsumfang richtet sich nach dem jeweils gewählten Tarif.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">§ 3 Vertragsschluss & Nutzungskonto</h2>
      <p className="text-gray-300 mb-4">
        Der Vertrag kommt durch die Registrierung und Bestätigung der E-Mail-Adresse
        zustande. Der Nutzer ist verpflichtet, seine Zugangsdaten vertraulich zu behandeln
        und NILL unverzüglich über eine unbefugte Nutzung zu informieren.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">§ 4 Preise & Zahlung</h2>
      <p className="text-gray-300 mb-4">
        Die aktuellen Preise sind auf der Preisseite einsehbar. Die Abrechnung erfolgt
        monatlich oder jährlich im Voraus. Alle Preise verstehen sich zzgl. der gesetzlichen
        Mehrwertsteuer.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">§ 5 Kündigung</h2>
      <p className="text-gray-300 mb-4">
        Der Vertrag kann jederzeit zum Ende des laufenden Abrechnungszeitraums gekündigt
        werden. Die Kündigung erfolgt über die Einstellungen im Dashboard oder per E-Mail
        an hello@nill.ai.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">§ 6 Haftungsbeschränkung</h2>
      <p className="text-gray-300 mb-4">
        NILL haftet nicht für indirekte Schäden, entgangenen Gewinn oder Datenverluste,
        soweit dies gesetzlich zulässig ist. Die Haftung ist auf den im letzten Monat
        gezahlten Nutzungsbetrag begrenzt.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">§ 7 Datenschutz</h2>
      <p className="text-gray-300 mb-4">
        Es gilt die gesonderte{" "}
        <a href="/Datenschutz" className="underline text-white hover:text-gray-300">
          Datenschutzerklärung
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">§ 8 Anwendbares Recht</h2>
      <p className="text-gray-300 mb-4">
        Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
        Gerichtsstand ist, soweit gesetzlich zulässig, Mössingen.
      </p>

      <p className="text-gray-400 text-sm mt-10">
        Bei Fragen: <a href="mailto:hello@nill.ai" className="underline">hello@nill.ai</a>
      </p>
    </section>
  );
}
