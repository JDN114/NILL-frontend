import React, { useEffect } from "react";
import LegalLayout from "../components/LegalLayout";

export default function Widerruf() {
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
    <LegalLayout title="Widerrufsbelehrung">
      <div
        className="itrk-legaltext"
        data-itrk-legaltext-url="https://itrk.legal/1yEr.3K.17NW-iframe.html"
      ></div>
    </LegalLayout>
  );
}
