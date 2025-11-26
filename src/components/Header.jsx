import React, { useState } from "react";
import { Link } from "react-router-dom"; // falls du Router nutzt
import Logo from "../assets/images/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 top-0 left-0">
      <div className="backdrop-blur-sm bg-white/50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="NILL Logo" className="h-10 w-auto" />
            <span className="font-semibold text-gray-800">NILL</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-gray-700 hover:text-gray-900 transition">Home</a>
            <a href="#about" className="text-gray-700 hover:text-gray-900 transition">Über uns</a>
            <a href="#sustainability" className="text-gray-700 hover:text-gray-900 transition">Nachhaltigkeit</a>
            <a href="#kontakt" className="text-gray-700 hover:text-gray-900 transition">Kontakt</a>
            <a href="/login" className="px-4 py-2 rounded-md border border-gray-200 text-gray-800 hover:bg-gray-100 transition">Login</a>
            <a href="/register" className="px-4 py-2 rounded-md bg-[#111827] text-white hover:opacity-95 transition">Account</a>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile floating menu (controlled by parent or open state) */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 w-80 h-full bg-white shadow-lg p-6">
            <button onClick={() => setOpen(false)} className="mb-6 p-2 rounded hover:bg-gray-100">
              Close
            </button>
            <ul className="flex flex-col gap-4 text-gray-800">
              <li><a href="#home" onClick={() => setOpen(false)}>Home</a></li>
              <li><a href="#about" onClick={() => setOpen(false)}>Über uns</a></li>
              <li><a href="#sustainability" onClick={() => setOpen(false)}>Nachhaltigkeit</a></li>
              <li><a href="#kontakt" onClick={() => setOpen(false)}>Kontakt</a></li>
              <li><a href="/login" onClick={() => setOpen(false)}>Login</a></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
