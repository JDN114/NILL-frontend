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
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 h-full w-64 p-6 rounded-r-2xl shadow-xl glass"
    >
      <h2 className="text-2xl font-bold text-white mb-10">NILL Dashboard</h2>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );
}
