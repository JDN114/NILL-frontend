import React from "react";

export default function FeatureCard({ title, desc, icon }) {
  return (
    <div className="glass p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center">{icon}</div>
        <div>
          <h4 className="text-white font-semibold">{title}</h4>
          <p className="text-gray-300 text-sm mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}
