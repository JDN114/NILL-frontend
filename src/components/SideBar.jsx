// src/components/Sidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Emails", path: "/emails" },
    { name: "Analyse", path: "/analysis" },
    { name: "Einstellungen", path: "/settings" },
  ];

  return (
    <motion.aside
      initial={{ x: -120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 h-full w-64 p-6 rounded-r-2xl shadow-xl glass bg-gray-900/80 backdrop-blur-md z-50"
      aria-label="Sidebar Navigation"
    >
      <h2 className="text-2xl font-bold text-white mb-10">NILL Dashboard</h2>
      <nav className="flex flex-col gap-3" aria-label="Main Menu">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end
            className={({ isActive }) =>
              [
                "px-4 py-2 rounded-lg text-white font-medium transition-colors",
                isActive ? "bg-white/20" : "hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]",
              ].join(" ")
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
}
