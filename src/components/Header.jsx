import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 top-0 left-0">
      <div className="backdrop-blur-sm bg-white/3 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="NILL" className="h-10 w-auto" />
            <span className="font-semibold text-white tracking-tight">NILL</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#home" className="text-gray-200 hover:text-white transition">Home</a>
            <a href="#about" className="text-gray-300 hover:text-white transition">Über uns</a>
            <a href="#sustainability" className="text-gray-300 hover:text-white transition">Nachhaltigkeit</a>
            <a href="#kontakt" className="text-gray-300 hover:text-white transition">Kontakt</a>
            <Link to="/login" className="px-4 py-2 rounded-md border border-white/8 text-white hover:bg-white/5 transition">Login</Link>
            <Link to="/register" className="px-4 py-2 rounded-md bg-[var(--brand)] text-white">Account</Link>
          </nav>

          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 rounded-md hover:bg-white/3 transition">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 w-80 h-full bg-[#071023] shadow-2xl p-6">
            <button onClick={() => setOpen(false)} className="mb-6 p-2 rounded hover:bg-white/3 text-white">Close</button>
            <ul className="flex flex-col gap-4 text-gray-200">
              <li><a href="#home" onClick={() => setOpen(false)}>Home</a></li>
              <li><a href="#about" onClick={() => setOpen(false)}>Über uns</a></li>
              <li><a href="#sustainability" onClick={() => setOpen(false)}>Nachhaltigkeit</a></li>
              <li><a href="#kontakt" onClick={() => setOpen(false)}>Kontakt</a></li>
              <li><Link to="/login" onClick={() => setOpen(false)}>Login</Link></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
