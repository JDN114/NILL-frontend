import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";

import WelcomeToNILLModal from "../components/WelcomeToNILLModal";
import GuidedTourModal from "../components/GuidedTourModal";

export default function DashboardLanding() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // ----------------------------
  // Backend API: Check if onboarding should be shown
  // ----------------------------
  async function checkOnboarding() {
    try {
      const res = await fetch("/me/onboarding-status", { credentials: "include" });

      if (!res.ok) {
        console.warn("Backend returned non-OK:", res.status);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("Backend response is not JSON:", contentType);
        return;
      }

      const data = await res.json();

      if (data.is_subscription_active && !data.has_seen_onboarding) {
        setShowWelcome(true);
      }

    } catch (err) {
      console.error("Fehler beim Abfragen des Onboarding-Status:", err);
    }
  }

  useEffect(() => {
    checkOnboarding();
  }, []);

  // ----------------------------
  // Welcome Modal schließen → Guided Tour starten + DB flag setzen
  // ----------------------------
  const handleWelcomeClose = async () => {
    setShowWelcome(false);

    setTimeout(() => setShowTour(true), 400);

    try {
      await fetch("/me/onboarding-complete", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Fehler beim Setzen von has_seen_onboarding:", err);
    }
  };

  const handleTourFinish = () => setShowTour(false);

  return (
    <>
      {/* ✨ Welcome Modal */}
      <WelcomeToNILLModal
        isOpen={showWelcome}
        onClose={handleWelcomeClose}
      />

      {/* 🚀 Guided Tour */}
      <GuidedTourModal
        isOpen={showTour}
        onFinish={handleTourFinish}
      />

      <PageLayout>
        <h1 className="text-2xl font-bold mb-6 text-white">
          Dashboard
        </h1>

        {/* 🔙 Zur Landingpage */}
        <div className="mb-6 flex justify-center">
          <Link to="/">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
              Zur Landingpage
            </button>
          </Link>
        </div>

        {/* 🔳 Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Link to="/dashboard/emails" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
            <Card title="Emails" description="Postfach, Filter & Kategorien" className="hover:shadow-lg transition" />
          </Link>
          <Link to="/dashboard/accounting" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
            <Card title="Buchhaltung" description="Rechnungen, Einnahmen & Ausgaben" className="hover:shadow-lg transition" />
          </Link>
          <Link to="/dashboard/calendar" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
            <Card title="Kalender" description="Termine, Planung & Events" className="hover:shadow-lg transition" />
          </Link>
          <Link to="/dashboard/workflow" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
            <Card title="Team" description="Tasks, Prozesse & Rollen" className="hover:shadow-lg transition" />
          </Link>
          <Link to="/dashboard/settings" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
            <Card title="Einstellungen" description="Gmail Verbindung & Account" className="hover:shadow-lg transition" />
          </Link>
        </div>
      </PageLayout>
    </>
  );
}
