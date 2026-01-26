// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 text-gray-300" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-white font-semibold">NILL</h4>
          <p className="text-sm text-gray-400">© {currentYear} NILL</p>
        </div>

        <div>
          <a
            href="/impressum"
            className="block text-gray-300 hover:text-white"
            rel="noopener noreferrer"
          >
            Impressum
          </a>
          <a
            href="/datenschutz"
            className="block text-gray-300 hover:text-white"
            rel="noopener noreferrer"
          >
            Datenschutz
          </a>
        </div>

        <div>
          <p className="text-gray-300">
            Kontakt:{" "}
            <a
              href="mailto:hello@nill.ai"
              className="text-white hover:underline"
              rel="noopener noreferrer"
            >
              hello@nill.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
