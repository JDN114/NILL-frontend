// src/components/ui/Card.jsx
import React from "react";

export default function Card({ title, description, children, className = "" }) {
  return (
    <div
      className={`bg-[var(--bg-panel)] dark:bg-gray-800 rounded-xl p-6 shadow-md transition-all ${className}`}
    >
      {title && (
        <h2 className="text-lg font-semibold text-[var(--nill-primary)] dark:text-white mb-1">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm text-[var(--text-muted)] dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
