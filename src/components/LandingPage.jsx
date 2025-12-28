import React from "react";
import { Link } from "react-router-dom";
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
        {/* Hero Section */}
        <Hero>
          <div className="mt-6">
            <Link to="/about-nill">
              <button className="px-6 py-3 bg-[var(--brand)] text-white rounded-lg shadow-lg hover:bg-[var(--brand-hover)] transition">
                Mehr erfahren
              </button>
            </Link>
          </div>
        </Hero>

        {/* Features */}
        <FeaturesGrid />

        {/* How it Works */}
        <HowItWorks />

        {/* Pricing */}
        <Pricing />

        {/* Sustainability Section */}
        <Sustainability>
          <div className="mt-6">
            <Link to="/about-nill">
              <button className="px-6 py-3 bg-[var(--brand)] text-white rounded-lg shadow-lg hover:bg-[var(--brand-hover)] transition">
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

        <CTABar />
      </main>
      <Footer />
    </div>
  );
}
