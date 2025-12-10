import React from "react";

export default function HowItWorks(){
  return (
    <section id="how" className="py-16 bg-gradient-to-b from-transparent to-[#03060a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-white">Wie NILL funktioniert</h3>
          <p className="text-gray-300 mt-2">Einfache Integration in 3 Schritten</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-xl font-bold text-white mb-2">1</div>
            <div className="text-white font-semibold">Konto & Postfach verbinden</div>
            <p className="text-gray-300 text-sm mt-2">Sichere OAuth Verbindung zu Mailprovider / IMAP</p>
          </div>

          <div className="glass p-6 rounded-xl text-center">
            <div className="text-xl font-bold text-white mb-2">2</div>
            <div className="text-white font-semibold">Regeln & Routing konfigurieren</div>
            <p className="text-gray-300 text-sm mt-2">Automatische Zuordnung & Eskalation</p>
          </div>

          <div className="glass p-6 rounded-xl text-center">
            <div className="text-xl font-bold text-white mb-2">3</div>
            <div className="text-white font-semibold">Automatisch ausführen</div>
            <p className="text-gray-300 text-sm mt-2">Live-Analyse, Zusammenfassungen & Aktionen</p>
          </div>
        </div>
      </div>
    </section>
  );
}
