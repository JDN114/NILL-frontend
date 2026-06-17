// src/components/ui/Card.jsx
import React from "react";

export default function Card({ title, description, children, className = "" }) {
  return (
    <div
      className={`bg-[var(--bg-panel)] rounded-xl p-6 shadow-md transition-all ${className}`}
    >
      {title && (
        <h2 className="text-lg font-semibold text-[var(--nill-primary)] mb-1">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm text-[var(--text-muted)] mb-4">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
