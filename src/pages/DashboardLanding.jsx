import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";

import WelcomeToNILLModal from "../components/WelcomeToNILLModal";
import GuidedTourModal from "../components/GuidedTourModal";

export default function DashboardLanding() {
  const location = useLocation();

  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isCheckoutSuccess = params.get("checkout") === "success";

    if (isCheckoutSuccess) {
      setShowWelcome(true);

      // Entfernt ?checkout=success aus der URL
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [location]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);

    // Smooth Übergang zur Tour
    setTimeout(() => {
      setShowTour(true);
    }, 400);
  };

  const handleTourFinish = () => {
    setShowTour(false);
  };

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
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Zur Landingpage
            </button>
          </Link>
        </div>

        {/* 🔳 Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          <Link
            to="/dashboard/emails"
            className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg"
          >
            <Card
              title="Emails"
              description="Postfach, Filter & Kategorien"
              className="hover:shadow-lg transition"
            />
          </Link>

          <Link
            to="/dashboard/accounting"
            className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg"
          >
            <Card
              title="Buchhaltung"
              description="Rechnungen, Einnahmen & Ausgaben"
              className="hover:shadow-lg transition"
            />
          </Link>

          <Link
            to="/dashboard/calendar"
            className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg"
          >
            <Card
              title="Kalender"
              description="Termine, Planung & Events"
              className="hover:shadow-lg transition"
            />
          </Link>

          <Link
            to="/dashboard/workflow"
            className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg"
          >
            <Card
              title="Team"
              description="Tasks, Prozesse & Rollen"
              className="hover:shadow-lg transition"
            />
          </Link>

          <Link
            to="/dashboard/settings"
            className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg"
          >
            <Card
              title="Einstellungen"
              description="Gmail Verbindung & Account"
              className="hover:shadow-lg transition"
            />
          </Link>

        </div>
      </PageLayout>
    </>
  );
}
