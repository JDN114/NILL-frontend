import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import api from "../services/api";

import WelcomeToNILLModal from "../components/WelcomeToNILLModal";
import GuidedTourModal from "../components/GuidedTourModal";

export default function DashboardLanding() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [userName, setUserName] = useState("");  
  const [notifications, setNotifications] = useState([]);

  // ----------------------------
  // Backend API: User info & onboarding
  // ----------------------------
  useEffect(() => {
    const loadUserAndOnboarding = async () => {
      try {
        const res = await api.get("/me/profile");
        setUserName(res.data.name || "User");

        const onboard = await api.get("/me/onboarding-status");
        if (onboard.data.is_subscription_active && !onboard.data.has_seen_onboarding) {
          setShowWelcome(true);
        }
      } catch (err) {
        console.error("Fehler beim Laden von User/Onboarding:", err);
      }
    };
    loadUserAndOnboarding();
  }, []);

  // ----------------------------
  // Notifications laden
  // ----------------------------
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await api.get("/me/notifications?limit=5");
        setNotifications(res.data);
      } catch (err) {
        console.error("Fehler beim Laden der Benachrichtigungen:", err);
      }
    };
    loadNotifications();
  }, []);

  const handleWelcomeClose = async () => {
    setShowWelcome(false);
    setTimeout(() => setShowTour(true), 400);
    try {
      await api.post("/me/onboarding-complete");
    } catch (err) {
      console.error("Fehler beim Setzen von has_seen_onboarding:", err);
    }
  };

  const handleTourFinish = () => setShowTour(false);

  return (
    <>
      <WelcomeToNILLModal isOpen={showWelcome} onClose={handleWelcomeClose} />
      <GuidedTourModal isOpen={showTour} onFinish={handleTourFinish} />

      <PageLayout>
        {/* ------------------ Hero Section ------------------ */}
        <div className="mb-10 relative p-6 bg-gradient-to-r from-purple-700 to-blue-600 rounded-2xl text-white shadow-lg overflow-hidden">
          <h1 className="text-3xl md:text-4xl font-bold animate-fade-in">
            Willkommen zurück, {userName}!
          </h1>
          <p className="mt-2 text-lg animate-fade-in delay-200">
            Dein Dashboard für E-Mails, Buchhaltung und Team-Management
          </p>

          {notifications.length > 0 && (
            <div className="mt-4 space-y-2">
              {notifications.map((note, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 px-4 py-2 rounded-lg text-sm animate-slide-up"
                >
                  {note.message}
                </div>
              ))}
            </div>
          )}

          {/* Optional: kleine animierte Kreise als Dekoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full animate-pulse-slow"></div>
        </div>

        {/* ------------------ Navigation Cards ------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Link to="/dashboard/emails" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
            <Card title="Emails" description="Postfach, Filter & Kategorien" className="hover:shadow-lg transition animate-fade-in" />
          </Link>

          <Link to="/dashboard/accounting" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
            <Card title="Buchhaltung" description="Rechnungen, Einnahmen & Ausgaben" className="hover:shadow-lg transition animate-fade-in delay-100" />
          </Link>

          <Link to="/dashboard/calendar" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
            <Card title="Kalender" description="Termine, Planung & Events" className="hover:shadow-lg transition animate-fade-in delay-200" />
          </Link>

          <Link to="/dashboard/workflow" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
            <Card title="Team" description="Tasks, Prozesse & Rollen" className="hover:shadow-lg transition animate-fade-in delay-300" />
          </Link>

          <Link to="/dashboard/settings" className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg">
            <Card title="Einstellungen" description="Gmail Verbindung & Account" className="hover:shadow-lg transition animate-fade-in delay-400" />
          </Link>
        </div>
      </PageLayout>
    </>
  );
}
