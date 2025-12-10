import React from "react";

export default function CTABar(){
  return (
    <div className="py-10 bg-gradient-to-r from-[#071023] to-[#06101b]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-xl font-semibold text-white mb-3">Bereit NILL auszuprobieren?</h3>
        <a href="/register" className="inline-block px-6 py-3 rounded btn-primary">Jetzt starten</a>
      </div>
    </div>
  );
}
