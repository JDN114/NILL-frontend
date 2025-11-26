import React from "react";

export default function Footer() {
  return (
    <footer className="bg-transparent text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="font-semibold text-white">NILL</p>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} NILL. Alle Rechte vorbehalten.</p>
        </div>

        <div className="flex gap-4">
          <a href="/impressum" className="text-gray-400 hover:text-white">Impressum</a>
          <a href="/datenschutz" className="text-gray-400 hover:text-white">Datenschutz</a>
          <a href="/kontakt" className="text-gray-400 hover:text-white">Kontakt</a>
        </div>
      </div>
    </footer>
  );
}
