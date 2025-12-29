import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 top-0 left-0">
      <div className="backdrop-blur-sm bg-white/3 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="NILL" className="h-10" />
            <span className="text-white font-semibold tracking-tight">NILL</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm relative">
            <a href="#home" className="text-gray-200 hover:text-white">Home</a>

    {/* Dropdown Über NILL */}
    <div
      className="relative"
      onMouseEnter={() => setAboutOpen(true)}
      onMouseLeave={() => setAboutOpen(false)}
    >
      <button className="text-gray-300 hover:text-white flex items-center gap-1">
        Über NILL
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
    
      {/* Dropdown Panel */}
      {aboutOpen && (
        <div className="absolute top-full left-0 mt-2 w-44 bg-black/80 backdrop-blur-xl rounded-md shadow-lg border border-white/10 py-2">
          <Link to="/about-nill" className="block px-4 py-2 text-gray-200 hover:bg-white/10">
            Über uns
          </Link>
          <Link to="/founder" className="block px-4 py-2 text-gray-200 hover:bg-white/10">
            Founder
          </Link>
          <Link to="/roadmap" className="block px-4 py-2 text-gray-200 hover:bg-white/10">
            Roadmap
          </Link>
        </div>
      )}
    </div>
            <a href="#features" className="text-gray-300 hover:text-white">Features</a>
            <a href="#sustainability" className="text-gray-300 hover:text-white">Nachhaltigkeit</a>
            <a href="#contact" className="text-gray-300 hover:text-white">Kontakt</a>

            <Link to="/login" className="px-3 py-2 border border-white/10 rounded text-white">Login</Link>
            <Link to="/register" className="px-3 py-2 rounded bg-[var(--brand)] text-white">Registrieren</Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setOpen(true)} className="p-2 rounded hover:bg-white/5">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 w-80 h-full bg-[#071023] p-6">
            <button onClick={() => setOpen(false)} className="mb-6 p-2 rounded text-white">Close</button>
            <ul className="flex flex-col gap-4 text-gray-200">

              <li><a href="#home" onClick={() => setOpen(false)}>Home</a></li>

              {/* Mobile Dropdown simplified */}
              <li><Link to="/about-nill" onClick={() => setOpen(false)}>Über uns</Link></li>
              <li><Link to="/founder" onClick={() => setOpen(false)}>Founder</Link></li>
              <li><Link to="/roadmap" onClick={() => setOpen(false)}>Roadmap</Link></li>

              <li><a href="#features" onClick={() => setOpen(false)}>Features</a></li>
              <li><a href="#sustainability" onClick={() => setOpen(false)}>Nachhaltigkeit</a></li>
              <li><a href="#contact" onClick={() => setOpen(false)}>Kontakt</a></li>

              <li><Link to="/login" onClick={() => setOpen(false)}>Login</Link></li>
              <li><Link to="/register" onClick={() => setOpen(false)}>Registrieren</Link></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
