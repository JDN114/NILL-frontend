// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Emails from "./Emails";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]); // Dynamisch erweiterbar

  // Falls du Kategorien dynamisch aus dem Backend laden willst:
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("/api/email/categories");
        setCategories(["All", ...res.data]);
      } catch (err) {
        console.error("Fehler beim Laden der Kategorien:", err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#03060a] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black/30 backdrop-blur-md p-6 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">NILL Dashboard</h1>
        <nav className="space-y-4">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                selectedCategory === cat
                  ? "bg-[var(--accent)] text-black"
                  : "hover:bg-white/10"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">
          {selectedCategory === "All" ? "Alle Emails" : selectedCategory}
        </h2>

        {/* Emails-Komponente */}
        <Emails selectedCategory={selectedCategory} />
      </main>
    </div>
  );
}
