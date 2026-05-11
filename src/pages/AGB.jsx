import React, { useEffect } from "react";

export default function AGB() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.it-recht-kanzlei.de/js/itrk-legaltext.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-6 py-20 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Allgemeine Geschäftsbedingungen (AGB)
      </h1>

      <div
        className="itrk-legaltext"
        data-itrk-legaltext-url="https://itrk.legal/1yEr.4V.17NW-iframe.html"
      ></div>
    </section>
  );
}
