import React from "react";

export default function Testimonials(){
  const data = [
    { name: "M. Bauer", text: "NILL hat uns 40% Arbeitszeit eingespart." },
    { name: "S. Meier", text: "Schnelle Integration, top Support." },
    { name: "K. Schulz", text: "Sehr zuverlässig." }
  ];
  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-[#071023]">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-2xl font-semibold text-white mb-6">Kundenstimmen</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {data.map((t,i) => (
            <div key={i} className="glass p-6 rounded-xl">
              <p className="text-gray-200">“{t.text}”</p>
              <p className="mt-4 font-semibold text-white">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
