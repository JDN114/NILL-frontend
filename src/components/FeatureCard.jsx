import React from "react";

export default function FeatureCard({ title, desc, Icon }) {
  return (
    <div className="glass p-6 rounded-2xl shadow hover:shadow-lg transition">
      <div className="flex items-center gap-4">
        {Icon && <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center">{Icon}</div>}
        <div>
          <h4 className="text-white font-semibold">{title}</h4>
          <p className="text-gray-300 text-sm mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}
