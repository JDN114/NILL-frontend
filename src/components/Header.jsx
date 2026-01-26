// src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/images/logo.png";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 top-0 left-0">
      <div className="backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src={Logo} alt="NILL Logo" className="h-10" />
            </Link>
            <span className="text-white font-semibold tracking-tight">NILL</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm relative">
            <Link to="/" className="text-gray-200 hover:text-white">
              Home
            </Link>

            {/* Dropdown Über NILL */}
            <div className="relative group">
              <button
                type="button"
                className="text-gray-300 hover:text-white flex items-center gap-1"
              >
                Über NILL
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-44 bg-black/80 backdrop-blur-xl rounded-md shadow-lg border border-white/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                >
                  <Link
                    to="/about-nill"
                    className="block px-4 py-2 text-gray-200 hover:bg-white/10"
                  >
                    Über uns
                  </Link>
                  <Link
                    to="/founder"
                    className="block px-4 py-2 text-gray-200 hover:bg-white/10"
                  >
                    Founder
                  </Link>
                  <Link
                    to="/roadmap"
                    className="block px-4 py-2 text-gray-200 hover:bg-white/10"
                  >
                    Roadmap
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            <Link to="#features" className="text-gray-300 hover:text-white">
              Features
            </Link>
            <Link to="#sustainability" className="text-gray-300 hover:text-white">
              Nachhaltigkeit
            </Link>
            <Link to="#contact" className="text-gray-300 hover:text-white">
              Kontakt
            </Link>

            <Link
              to="/login"
              className="px-3 py-2 border border-white/10 rounded text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-2 rounded bg-[var(--brand)] text-white"
            >
              Registrieren
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded hover:bg-white/5"
              aria-label="Menü öffnen"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 w-80 h-full bg-[#071023] p-6 overflow-y-auto">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="mb-6 p-2 rounded text-white"
            >
              Schließen
            </button>
            <ul className="flex flex-col gap-4 text-gray-200">
              <li>
                <Link to="/" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-nill" onClick={() => setMobileOpen(false)}>
                  Über uns
                </Link>
              </li>
              <li>
                <Link to="/founder" onClick={() => setMobileOpen(false)}>
                  Founder
                </Link>
              </li>
              <li>
                <Link to="/roadmap" onClick={() => setMobileOpen(false)}>
                  Roadmap
                </Link>
              </li>
              <li>
                <Link to="#features" onClick={() => setMobileOpen(false)}>
                  Features
                </Link>
              </li>
              <li>
                <Link to="#sustainability" onClick={() => setMobileOpen(false)}>
                  Nachhaltigkeit
                </Link>
              </li>
              <li>
                <Link to="#contact" onClick={() => setMobileOpen(false)}>
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  Registrieren
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
