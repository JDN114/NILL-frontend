import React from "react";

export default function Pricing(){
  const plans = [
    {title:"Starter", price:"49€", features:["Email parsing", "Summaries"]},
    {title:"Business", price:"149€", features:["All Starter + Calendar Integration"]},
    {title:"Enterprise", price:"Custom", features:["SLA, On-prem, Custom Models"]}
  ];
  return (
    <section id="pricing" className="py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-2xl font-semibold text-white mb-6">Pricing</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p,i) => (
            <div key={i} className="glass p-6 rounded-2xl">
              <h4 className="text-xl font-semibold text-white">{p.title}</h4>
              <div className="text-3xl font-bold text-white my-4">{p.price}</div>
              <ul className="text-gray-300 mb-4">
                {p.features.map((f,idx)=> <li key={idx}>• {f}</li>)}
              </ul>
              <a href="/register" className="inline-block px-4 py-2 rounded bg-[var(--brand)] text-white">Choose</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
