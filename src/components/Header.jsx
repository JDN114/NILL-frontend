// src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/images/logo.png";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Animation Variants
  const fadeSlideDown = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } };
  const pulseBtn = { scale: [1, 1.05, 1], transition: { duration: 1.2, repeat: Infinity } };

  return (
    <header className="fixed w-full z-50 top-0 left-0">
      <div className="backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src={Logo} alt="NILL Logo" className="h-10" />
            </Link>
            <span className="text-white font-semibold tracking-tight text-lg md:text-xl">
              NILL
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm relative">
            <Link to="/" className="text-gray-200 hover:text-white transition-colors duration-200">
              Home
            </Link>

            {/* Dropdown Über NILL */}
            <div className="relative group">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                className="text-gray-300 hover:text-white flex items-center gap-1 transition"
              >
                Über NILL
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </motion.button>

              <AnimatePresence>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeSlideDown}
                  transition={{ duration: 0.25 }}
                  className="absolute top-full left-0 mt-2 w-44 bg-black/80 backdrop-blur-xl rounded-md shadow-lg border border-white/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                >
                  {[
                    { label: "Über uns", link: "/about-nill" },
                    { label: "Founder", link: "/founder" },
                    { label: "Roadmap", link: "/roadmap" }
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.link}
                      className="block px-4 py-2 text-gray-200 hover:bg-white/10 rounded transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {["Features", "Nachhaltigkeit", "Kontakt"].map((item, idx) => (
              <Link
                key={idx}
                to={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item}
              </Link>
            ))}

            {/* Buttons */}
            <motion.div className="flex items-center gap-2">
              <motion(Link) to="/login" whileHover={{ scale: 1.05 }} className="px-3 py-2 border border-white/10 rounded text-white transition">
                Login
              </motion(Link)>
              <motion(Link) to="/register" animate={pulseBtn} className="px-3 py-2 rounded bg-[var(--brand)] text-white transition">
                Registrieren
              </motion(Link)>
            </motion.div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded hover:bg-white/5 transition"
              aria-label="Menü öffnen"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 w-80 h-full bg-[#071023] p-6 overflow-y-auto shadow-xl"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="mb-6 p-2 rounded text-white"
              >
                Schließen
              </button>
              <ul className="flex flex-col gap-4 text-gray-200">
                {[
                  { label: "Home", link: "/" },
                  { label: "Über uns", link: "/about-nill" },
                  { label: "Founder", link: "/founder" },
                  { label: "Roadmap", link: "/roadmap" },
                  { label: "Features", link: "#features" },
                  { label: "Nachhaltigkeit", link: "#sustainability" },
                  { label: "Kontakt", link: "#contact" },
                  { label: "Login", link: "/login" },
                  { label: "Registrieren", link: "/register" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.link} onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
