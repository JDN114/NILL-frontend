// src/pages/DashboardLanding.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PageLayout from "../components/layout/PageLayout";
import Card from "../components/ui/Card";
import api from "../services/api";

import { useAuth } from "../context/AuthContext";
import WelcomeToNILLModal from "../components/WelcomeToNILLModal";
import GuidedTourModal from "../components/GuidedTourModal";

export default function DashboardLanding() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [userName, setUserName] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { hasFeature, isCompanyAdmin, org } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me/profile");
        setUserName(res.data.name || null);
      } catch (err) {
        console.error("Fehler beim Laden des Benutzers:", err);
      }
    };

    const checkOnboarding = async () => {
      try {
        const res = await api.get("/me/onboarding-status");
        if (res.data.is_subscription_active && !res.data.has_seen_onboarding) {
          setShowWelcome(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await api.get("/me/notifications");
        setNotifications(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
    checkOnboarding();
    fetchNotifications();
  }, []);

  const handleWelcomeClose = async () => {
    setShowWelcome(false);
    setTimeout(() => setShowTour(true), 400);
    try {
      await api.post("/me/onboarding-complete");
    } catch (err) {
      console.error(err);
    }
  };

  const handleTourFinish = () => setShowTour(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cards = [
    { title: "Emails",        description: "Postfach, Filter & Kategorien",    link: "/dashboard/emails",     feature: "email" },
    { title: "Buchhaltung",   description: "Rechnungen, Einnahmen & Ausgaben",  link: "/dashboard/accounting", feature: "accounting" },
    { title: "Kalender",      description: "Termine, Planung & Events",         link: "/dashboard/calendar",   feature: "calendar" },
    { title: "Team",          description: "Tasks, Prozesse & Rollen",          link: "/dashboard/workflow",   feature: null },
    { title: "Einstellungen", description: "Gmail Verbindung & Account",        link: "/dashboard/settings",   feature: null, adminOnly: true },
  ].filter(card => !card.adminOnly || isCompanyAdmin());

  return (
    <>
      <WelcomeToNILLModal isOpen={showWelcome} onClose={handleWelcomeClose} />
      <GuidedTourModal isOpen={showTour} onFinish={handleTourFinish} />

      <PageLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-gradient-to-br from-zinc-900/70 to-zinc-800/50 p-8 mb-8 shadow-lg overflow-hidden"
        >
          <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            {org?.name
              ? `Willkommen zurück, ${org.name}!`
              : userName
              ? `Willkommen zurück, ${userName}!`
              : "Willkommen zurück!"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 text-lg md:text-xl"
          >
            Mit NILL Zeit und Geld sparen.
          </motion.p>

          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 space-y-2"
            >
              {notifications.slice(0, 3).map((n, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 p-3 rounded-lg text-gray-200 text-sm"
                >
                  {n.message}
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const unlocked = !card.feature || hasFeature(card.feature);
            return (
              <motion.div
                key={idx}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ delay: 0.1 * idx }}
              >
                {unlocked ? (
                  <Link
                    to={card.link}
                    className="focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-lg"
                  >
                    <Card
                      title={card.title}
                      description={card.description}
                      className="hover:shadow-lg transition"
                    />
                  </Link>
                ) : (
                  <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5 flex flex-col gap-2 opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-2">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-500 shrink-0"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className="text-white font-medium text-sm">
                        {card.title}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">{card.description}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Für deine Rolle nicht freigeschaltet
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </PageLayout>
    </>
  );
}
