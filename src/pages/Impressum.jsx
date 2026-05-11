import React, { useEffect } from "react";
import LegalLayout from "../components/LegalLayout";

export default function Impressum() {
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
    <LegalLayout title="Impressum">
      <div
        className="itrk-legaltext"
        data-itrk-legaltext-url="https://itrk.legal/1yEr.0.17NW-de-iframe.html"
      ></div>
    </LegalLayout>
  );
}
