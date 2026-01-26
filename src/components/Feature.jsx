// src/components/Feature.jsx
import React from "react";

interface FeatureItem {
  id: number;
  icon: "speed" | "api" | "trust";
  title: string;
  text: string;
}

interface IconProps {
  name: FeatureItem["icon"];
}

// ------------------------
// Inline SVGs als Icons
// ------------------------
const Icon: React.FC<IconProps> = ({ name }) => {
  switch (name) {
    case "speed":
      return (
        <svg
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 12h3l2-4 4 8 5-10 3 6"
            stroke="#1e6cff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "api":
      return (
        <svg
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="6"
            width="7"
            height="12"
            rx="2"
            stroke="#1e6cff"
            strokeWidth="1.6"
          />
          <rect
            x="14"
            y="6"
            width="7"
            height="12"
            rx="2"
            stroke="#1e6cff"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "trust":
    default:
      return (
        <svg
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" stroke="#1e6cff" strokeWidth="1.6" />
          <path
            d="M8 12l2 3 4-6"
            stroke="#1e6cff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

// ------------------------
// Features Component
// ------------------------
export default function Features() {
  const items: FeatureItem[] = [
    {
      id: 1,
      icon: "speed",
      title: "Fast Integration",
      text: "SDKs and components that plug into your stack in minutes — not days.",
    },
    {
      id: 2,
      icon: "api",
      title: "Stable APIs",
      text: "Designed for production: predictable behavior, great docs and versioning.",
    },
    {
      id: 3,
      icon: "trust",
      title: "Secure by Design",
      text: "Enterprise-ready security, privacy controls, and auditability.",
    },
  ];

  return (
    <section id="features" className="features" aria-label="Platform Features">
      <div className="container">
        <h3 className="text-white font-bold text-2xl mb-4">Features</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              className="feature bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition-colors"
              key={it.id}
            >
              <div className="mb-2" aria-hidden="true">
                <Icon name={it.icon} />
              </div>
              <div>
                <h4 className="text-white font-semibold">{it.title}</h4>
                <p className="text-gray-300 text-sm">{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
