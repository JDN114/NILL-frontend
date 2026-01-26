// src/components/FeatureCard.jsx
import React from "react";

interface FeatureCardProps {
  index: number;
  title: string;
  desc: string;
}

export default function FeatureCard({ index, title, desc }: FeatureCardProps) {
  return (
    <div
      className="bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-5 shadow-md hover:shadow-lg flex flex-col gap-3"
      role="group"
      aria-label={`Feature ${index + 1}: ${title}`}
    >
      {/* Nummerierung */}
      <div
        className="flex items-center justify-center w-10 h-10 bg-[var(--brand)] text-white font-bold rounded-full"
        aria-hidden="true"
      >
        {index + 1}
      </div>
      <h4 className="text-white font-semibold text-lg">{title}</h4>
      <p className="text-gray-300 text-sm">{desc}</p>
    </div>
  );
}
