import React, { useEffect } from "react";
import LegalLayout from "../components/LegalLayout";

export default function Datenschutz() {
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
    <LegalLayout title="Datenschutzerklärung">
      <div
        className="itrk-legaltext"
        data-itrk-legaltext-url="https://itrk.legal/1yEr.bg.17NW-iframe.html"
      ></div>
    </LegalLayout>
  );
}
