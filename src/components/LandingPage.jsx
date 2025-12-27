import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturesGrid from "../components/FeaturesGrid";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import Sustainability from "../components/Sustainability";
import ContactForm from "../components/ContactForm";
import CTABar from "../components/CTABar";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <Hero />
        <FeaturesGrid />
        <HowItWorks />
        <Pricing />
        <Sustainability />
        <section id="contact" className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <ContactForm />
          </div>
        </section>
        <CTABar />
      </main>
      <Footer />
    </div>
  );
}
