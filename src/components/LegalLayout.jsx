import React from "react";

export default function LegalLayout({ title, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Glow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] left-[-150px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-cyan-300 backdrop-blur-md">
            Rechtliche Informationen
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tight">
            {title}
          </h1>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-cyan-500/40 via-white/10 to-transparent" />
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-cyan-500/5 p-6 md:p-10">
          <div className="legal-content prose prose-invert max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
