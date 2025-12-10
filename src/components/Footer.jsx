import React from "react";

export default function Footer(){
  return (
    <footer className="py-10 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-white font-semibold">NILL</h4>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} NILL</p>
        </div>
        <div>
          <a href="/impressum" className="block text-gray-300">Impressum</a>
          <a href="/datenschutz" className="block text-gray-300">Datenschutz</a>
        </div>
        <div>
          <p className="text-gray-300">Kontakt: <a href="mailto:hello@nill.ai" className="text-white">hello@nill.ai</a></p>
        </div>
      </div>
    </footer>
  );
}
