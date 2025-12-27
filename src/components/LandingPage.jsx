import React, { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturesGrid from "../components/FeaturesGrid";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import Sustainability from "../components/Sustainability";
import ContactForm from "../components/ContactForm";
import CTABar from "../components/CTABar";
import Footer from "../components/Footer";

export default function LandingPageDebug() {
  const [visibleSection, setVisibleSection] = useState("Hero");

  return (
    <div className="min-h-screen">
      <Header />

      <div className="fixed top-24 right-6 bg-gray-800/80 p-4 rounded z-50 flex flex-col gap-2">
        <button onClick={() => setVisibleSection("Hero")} className="text-white">Hero</button>
        <button onClick={() => setVisibleSection("FeaturesGrid")} className="text-white">Features</button>
        <button onClick={() => setVisibleSection("HowItWorks")} className="text-white">How It Works</button>
        <button onClick={() => setVisibleSection("Pricing")} className="text-white">Pricing</button>
        <button onClick={() => setVisibleSection("Sustainability")} className="text-white">Sustainability</button>
        <button onClick={() => setVisibleSection("Contact")} className="text-white">Contact</button>
      </div>

      <main className="pt-24 max-w-7xl mx-auto px-6">
        {visibleSection === "Hero" && <Hero />}
        {visibleSection === "FeaturesGrid" && <FeaturesGrid />}
        {visibleSection === "HowItWorks" && <HowItWorks />}
        {visibleSection === "Pricing" && <Pricing />}
        {visibleSection === "Sustainability" && <Sustainability />}
        {visibleSection === "Contact" && (
          <section id="contact" className="py-16">
            <ContactForm />
          </section>
        )}
      </main>

      <CTABar />
      <Footer />
    </div>
  );
}
