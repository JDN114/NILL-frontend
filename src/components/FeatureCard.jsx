// FeatureCard.jsx
import React from "react";

export default function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-5 shadow-md hover:shadow-lg flex flex-col gap-3">
      <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg">
        {icon ? <img src={icon} alt="" className="w-6 h-6" /> : null}
      </div>
      <h4 className="text-white font-semibold text-lg">{title}</h4>
      <p className="text-gray-300 text-sm">{desc}</p>
    </div>
  );
}
