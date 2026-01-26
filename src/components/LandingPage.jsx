// src/components/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Hero from "./Hero";
import FeaturesGrid from "./FeaturesGrid";
import HowItWorks from "./HowItWorks";
import Pricing from "./Pricing";
import Sustainability from "./Sustainability";
import ContactForm from "./ContactForm";
import CTABar from "./CTABar";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#03060a] text-white">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <Hero>
          <div className="mt-6">
            <Link to="/about-nill">
              <button className="px-6 py-3 bg-[var(--brand)] text-white rounded-lg shadow-lg hover:bg-[var(--brand-hover)] transition-colors">
                Mehr erfahren
              </button>
            </Link>
          </div>
        </Hero>

        {/* Features Grid */}
        <FeaturesGrid />

        {/* How It Works */}
        <HowItWorks />

        {/* Pricing Section */}
        <Pricing />

        {/* Sustainability Section */}
        <Sustainability>
          <div className="mt-6 text-center">
            <Link to="/about-nill">
              <button className="px-6 py-3 bg-[var(--brand)] text-white rounded-lg shadow-lg hover:bg-[var(--brand-hover)] transition-colors">
                Mehr erfahren
              </button>
            </Link>
          </div>
        </Sustainability>

        {/* Contact Form */}
        <section id="contact" className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <ContactForm />
          </div>
        </section>

        {/* Call to Action */}
        <CTABar />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
