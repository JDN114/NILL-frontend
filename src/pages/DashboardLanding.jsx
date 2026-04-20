// src/pages/DashboardLanding.jsx
import { Link, useNavigate } from "react-router-dom";
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
  const [nillNotifications, setNillNotifications] = useState([]);
  const { hasFeature, hasModule, isCompanyAdmin, org } = useAuth();
  const navigate = useNavigate();

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

    // NILL: Tagesabschluss & Dashboard-Benachrichtigungen laden
    const fetchNillNotifications = async () => {
      try {
        const res = await api.get("/nill/notifications/dashboard");
        setNillNotifications(res.data || []);
      } catch (err) {
        // NILL-Benachrichtigungen sind optional – kein harter Fehler
      }
    };

    fetchUser();
    checkOnboarding();
    fetchNotifications();
    fetchNillNotifications();
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

  // NILL-Benachrichtigungs-Icons je nach Typ
  const nillIconMap = {
    travel:      "✈️",
    application: "👤",
    contract:    "📄",
    onboarding:  "🚀",
    competitor:  "🔍",
    meeting:     "📅",
    daily:       "🤖",
    default:     "💬",
  };

  // feature = permission check (Rolle), module = plan check (Org)
  const cards = [
    {
      title: "NILL",
      description: "Deine KI-Sekretärin",
      link: "/dashboard/nill-secretary",
      feature: "nill",
      module: "nill",
      isNill: true,
    },
    { title: "Emails",        description: "Postfach, Filter & Kategorien",    link: "/dashboard/emails",     feature: "email",       module: "emails" },
    { title: "Buchhaltung",   description: "Rechnungen, Einnahmen & Ausgaben",  link: "/dashboard/accounting", feature: "accounting",  module: "accounting" },
    { title: "Kalender",      description: "Termine, Planung & Events",         link: "/dashboard/calendar",   feature: "calendar",    module: "calendar" },
    { title: "Team",          description: "Tasks, Prozesse & Rollen",          link: "/dashboard/workflow",   feature: null,          module: null },
    { title: "Einstellungen", description: "Gmail Verbindung & Account",        link: "/dashboard/settings",   feature: null,          module: null, adminOnly: true },
  ].filter(card => !card.adminOnly || isCompanyAdmin());

  const handleLockedClick = (card) => {
    const moduleOk  = !card.module  || hasModule(card.module);
    const featureOk = !card.feature || hasFeature(card.feature);
    const reason    = !moduleOk ? "module" : "feature";
    navigate("/upgrade", {
      state: {
        from:    "/dashboard",
        feature: card.feature,
        module:  card.module,
        reason,
      },
    });
  };

  return (
    <>
      <WelcomeToNILLModal isOpen={showWelcome} onClose={handleWelcomeClose} />
      <GuidedTourModal isOpen={showTour} onFinish={handleTourFinish} />

      <PageLayout>
        {/* Hero Banner */}
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

          {/* Standard-Benachrichtigungen */}
          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 space-y-2"
            >
              {notifications.slice(0, 3).map((n, idx) => (
                <div key={idx} className="bg-gray-800/50 p-3 rounded-lg text-gray-200 text-sm">
                  {n.message}
                </div>
              ))}
            </motion.div>
          )}

          {/* NILL-Benachrichtigungen im Hero */}
          {nillNotifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 space-y-2"
            >
              {nillNotifications.slice(0, 3).map((n, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/dashboard/nill?module=${n.module || "applications"}`)}
                  className="flex items-start gap-3 bg-indigo-900/40 border border-indigo-700/40 p-3 rounded-xl text-gray-200 text-sm cursor-pointer hover:bg-indigo-900/60 transition"
                >
                  <span className="text-base shrink-0 mt-0.5">
                    {nillIconMap[n.type] || nillIconMap.default}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-indigo-300 text-xs uppercase tracking-wide mr-2">
                      NILL
                    </span>
                    {n.message}
                  </div>
                  {n.requires_action && (
                    <span className="shrink-0 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2 py-0.5">
                      Aktion
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const moduleOk  = !card.module  || hasModule(card.module);
            const featureOk = !card.feature || hasFeature(card.feature);
            const unlocked  = moduleOk && featureOk;

            // NILL bekommt eine besondere Karte
            if (card.isNill && unlocked) {
              return (
                <motion.div
                  key={idx}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ delay: 0.05 }}
                  className="md:col-span-1"
                >
                  <Link
                    to={card.link}
                    className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl block"
                  >
                    <div className="relative rounded-xl border border-indigo-700/50 bg-gradient-to-br from-indigo-950/80 to-indigo-900/40 p-5 flex flex-col gap-3 hover:border-indigo-500/70 hover:shadow-lg hover:shadow-indigo-900/30 transition overflow-hidden">
                      {/* Glow */}
                      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-600/80 flex items-center justify-center text-white font-bold text-base shrink-0">
                          N
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">NILL</p>
                          <p className="text-indigo-300 text-xs">KI-Sekretärin</p>
                        </div>
                        {nillNotifications.filter(n => n.requires_action).length > 0 && (
                          <span className="ml-auto shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">
                            {nillNotifications.filter(n => n.requires_action).length}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        {[
                          { label: "Bewerbungen", icon: "👤" },
                          { label: "Reisen",      icon: "✈️" },
                          { label: "Meetings",    icon: "📅" },
                        ].map(m => (
                          <div key={m.label} className="rounded-lg bg-indigo-900/50 py-1.5 px-1">
                            <div className="text-sm">{m.icon}</div>
                            <div className="text-indigo-300 text-xs mt-0.5 leading-tight">{m.label}</div>
                          </div>
                        ))}
                      </div>

                      <p className="text-indigo-400 text-xs">
                        {nillNotifications.length > 0
                          ? `${nillNotifications.length} neue Meldung${nillNotifications.length !== 1 ? "en" : ""} von NILL`
                          : "Alles erledigt · Keine offenen Aufgaben"}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            }

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
                  <div
                    onClick={() => handleLockedClick(card)}
                    className="rounded-lg border border-gray-800 bg-gray-900/50 p-5 flex flex-col gap-2 opacity-60 cursor-pointer hover:opacity-80 transition"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        width="14" height="14" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        className="text-gray-500 shrink-0"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className="text-white font-medium text-sm">{card.title}</span>
                    </div>
                    <p className="text-gray-500 text-xs">{card.description}</p>
                    <p className="text-gray-600 text-xs mt-1">Für deine Rolle nicht freigeschaltet</p>
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
