import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiSettings, FiLogOut, FiBarChart2 } from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <aside className="bg-[#0c111b] text-white w-64 min-h-screen p-6 border-r border-white/10 hidden md:block">
      <h2 className="text-2xl font-bold mb-10 tracking-wide">NILL</h2>

      <nav className="space-y-4">
        <Link to="/dashboard" className="flex items-center gap-3 text-gray-300 hover:text-white transition">
          <FiHome /> Dashboard
        </Link>

        <Link to="/analytics" className="flex items-center gap-3 text-gray-300 hover:text-white transition">
          <FiBarChart2 /> Analytics
        </Link>

        <Link to="/settings" className="flex items-center gap-3 text-gray-300 hover:text-white transition">
          <FiSettings /> Einstellungen
        </Link>
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 text-red-400 hover:text-red-300 transition mt-10"
      >
        <FiLogOut /> Logout
      </button>
    </aside>
  );
}
