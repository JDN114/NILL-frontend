// FeatureCard.jsx
import React from "react";

export default function FeatureCard({ index, title, desc }) {
  return (
    <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-5 shadow-md hover:shadow-lg flex flex-col gap-3">
      {/* Nummerierung */}
      <div className="flex items-center justify-center w-10 h-10 bg-[var(--brand)] text-white font-bold rounded-full">
        {index + 1}
      </div>
      <h4 className="text-white font-semibold text-lg">{title}</h4>
      <p className="text-gray-300 text-sm">{desc}</p>
    </div>
  );
}
