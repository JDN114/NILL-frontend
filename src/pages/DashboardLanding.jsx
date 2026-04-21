// src/pages/DashboardLanding.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PageLayout from "../components/layout/PageLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import WelcomeToNILLModal from "../components/WelcomeToNILLModal";
import GuidedTourModal from "../components/GuidedTourModal";

/* ─── Design Tokens (inline, kein Tailwind-Konflikt) ────────────── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .nd-root { --bg:#040407; --bg2:#08080c; --ink:#efede7; --ink-dim:rgba(239,237,231,.5); --ink-faint:rgba(239,237,231,.12); --line:rgba(239,237,231,.07); --glass:rgba(255,255,255,.035); --accent:#c6ff3c; --a2:#7a5cff; --a3:#ff4d8d; --a4:#38f5d0; --serif:"Fraunces",Georgia,serif; --sans:"Inter",system-ui,sans-serif; --mono:"JetBrains Mono",monospace; --r:14px; --r2:20px; }

  /* Welcome strip */
  .nd-welcome { position:relative; border-radius:var(--r2); border:1px solid var(--line); background:linear-gradient(135deg,rgba(122,92,255,.08),rgba(198,255,60,.04)); padding:32px 36px; margin-bottom:32px; overflow:hidden; }
  .nd-welcome::before { content:""; position:absolute; inset:-60%; background:radial-gradient(50% 40% at 30% 30%,rgba(122,92,255,.12),transparent 60%); pointer-events:none; }
  .nd-welcome-eyebrow { font-family:var(--mono); font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--ink-dim); display:flex; align-items:center; gap:8px; margin-bottom:12px; }
  .nd-welcome-eyebrow::before { content:""; width:16px; height:1px; background:currentColor; opacity:.5; }
  .nd-welcome h1 { font-family:var(--serif); font-weight:400; font-size:clamp(24px,3.5vw,40px); letter-spacing:-.025em; line-height:.95; color:var(--ink); margin:0 0 8px; }
  .nd-welcome h1 em { font-style:italic; color:var(--accent); }
  .nd-welcome-sub { font-size:14px; color:var(--ink-dim); margin:0; line-height:1.5; }

  /* Notification pills */
  .nd-notifs { margin-top:20px; display:flex; flex-direction:column; gap:8px; }
  .nd-notif { display:flex; align-items:flex-start; gap:10px; background:rgba(255,255,255,.03); border:1px solid var(--line); border-radius:10px; padding:10px 14px; font-size:13px; color:var(--ink-dim); }
  .nd-notif-nill { background:rgba(122,92,255,.07); border-color:rgba(122,92,255,.2); cursor:pointer; transition:background .2s,border-color .2s; }
  .nd-notif-nill:hover { background:rgba(122,92,255,.13); border-color:rgba(122,92,255,.35); }
  .nd-notif-label { font-family:var(--mono); font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:var(--a2); }
  .nd-notif-action { margin-left:auto; flex-shrink:0; font-family:var(--mono); font-size:10px; letter-spacing:.1em; text-transform:uppercase; background:rgba(198,255,60,.1); border:1px solid rgba(198,255,60,.25); color:var(--accent); border-radius:99px; padding:3px 9px; white-space:nowrap; }

  /* Section label */
  .nd-section-label { font-family:var(--mono); font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:var(--ink-dim); margin-bottom:16px; display:flex; align-items:center; gap:10px; }
  .nd-section-label::after { content:""; flex:1; height:1px; background:var(--line); }

  /* Grid */
  .nd-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:12px; }

  /* Base card */
  .nd-card { position:relative; border-radius:var(--r2); border:1px solid var(--line); background:var(--glass); padding:24px; display:flex; flex-direction:column; gap:14px; transition:border-color .25s,background .25s,transform .3s; cursor:pointer; text-decoration:none; overflow:hidden; }
  .nd-card:hover { border-color:var(--ink-faint); background:rgba(255,255,255,.05); transform:translateY(-2px); }
  .nd-card-icon { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.05); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .nd-card-title { font-family:var(--serif); font-weight:400; font-size:20px; letter-spacing:-.02em; color:var(--ink); line-height:1; }
  .nd-card-desc { font-size:12px; color:var(--ink-dim); line-height:1.45; margin:0; }
  .nd-card-arrow { margin-top:auto; font-family:var(--mono); font-size:11px; color:var(--ink-dim); display:flex; align-items:center; gap:6px; transition:color .2s,gap .2s; }
  .nd-card:hover .nd-card-arrow { color:var(--ink); gap:10px; }

  /* NILL card */
  .nd-card-nill { border-color:rgba(122,92,255,.25); background:linear-gradient(135deg,rgba(122,92,255,.08),rgba(56,245,208,.04)); }
  .nd-card-nill:hover { border-color:rgba(122,92,255,.45); background:linear-gradient(135deg,rgba(122,92,255,.13),rgba(56,245,208,.07)); }
  .nd-card-nill .nd-card-icon { background:rgba(122,92,255,.15); border-color:rgba(122,92,255,.3); }
  .nd-card-nill .nd-card-arrow { color:rgba(122,92,255,.7); }
  .nd-card-nill:hover .nd-card-arrow { color:var(--a2); }
  .nd-nill-badge { font-family:var(--mono); font-size:10px; color:var(--a2); background:rgba(122,92,255,.12); border:1px solid rgba(122,92,255,.2); border-radius:99px; padding:2px 10px; letter-spacing:.1em; align-self:flex-start; }
  .nd-nill-modules { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
  .nd-nill-module { background:rgba(122,92,255,.08); border:1px solid rgba(122,92,255,.15); border-radius:8px; padding:8px 4px; text-align:center; }
  .nd-nill-module-icon { font-size:14px; }
  .nd-nill-module-label { font-family:var(--mono); font-size:9px; letter-spacing:.1em; color:rgba(122,92,255,.8); margin-top:3px; text-transform:uppercase; }
  .nd-action-dot { position:absolute; top:16px; right:16px; width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 8px rgba(198,255,60,.6); }

  /* Locked card */
  .nd-card-locked { opacity:.45; cursor:pointer; }
  .nd-card-locked:hover { opacity:.65; transform:none; }
  .nd-lock-icon { color:var(--ink-faint); }

  @media(max-width:600px) {
    .nd-welcome { padding:24px 20px; }
    .nd-grid { grid-template-columns:1fr 1fr; }
  }
`;

const ICONS = {
  nill:          "◈",
  emails:        "✉",
  accounting:    "◎",
  calendar:      "▦",
  team:          "⌘",
  settings:      "◉",
};

const NILL_ICONS = {
  travel: "✈️", application: "👤", contract: "📄",
  onboarding: "🚀", competitor: "🔍", meeting: "📅",
  daily: "◈", default: "◈",
};

export default function DashboardLanding() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour]       = useState(false);
  const [userName, setUserName]       = useState(null);
  const [notifications, setNotifications]         = useState([]);
  const [nillNotifications, setNillNotifications] = useState([]);
  const { hasFeature, hasModule, isCompanyAdmin, org } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/me/profile").then(r => setUserName(r.data.name || null)).catch(() => {});
    api.get("/me/onboarding-status").then(r => {
      if (r.data.is_subscription_active && !r.data.has_seen_onboarding) setShowWelcome(true);
    }).catch(() => {});
    api.get("/me/notifications").then(r => setNotifications(r.data || [])).catch(() => {});
    api.get("/nill/notifications/dashboard").then(r => setNillNotifications(r.data || [])).catch(() => {});
  }, []);

  const handleWelcomeClose = async () => {
    setShowWelcome(false);
    setTimeout(() => setShowTour(true), 400);
    api.post("/me/onboarding-complete").catch(() => {});
  };

  const cards = [
    { key: "nill",        title: "NILL",          desc: "KI-Sekretärin",                    link: "/dashboard/nill-secretary", feature: "nill",       module: "nill",       isNill: true },
    { key: "emails",      title: "E-Mails",        desc: "Postfach, Filter & Kategorien",    link: "/dashboard/emails",         feature: "email",      module: "emails"      },
    { key: "accounting",  title: "Buchhaltung",    desc: "Rechnungen, Einnahmen & Ausgaben", link: "/dashboard/accounting",     feature: "accounting", module: "accounting"  },
    { key: "calendar",    title: "Kalender",       desc: "Termine, Planung & Events",        link: "/dashboard/calendar",       feature: "calendar",   module: "calendar"    },
    { key: "team",        title: "Team",           desc: "Tasks, Prozesse & Rollen",         link: "/dashboard/workflow",       feature: null,         module: null          },
    { key: "settings",    title: "Einstellungen",  desc: "Account & Verbindungen",            link: "/dashboard/settings",       feature: null,         module: null,         adminOnly: true },
  ].filter(c => !c.adminOnly || isCompanyAdmin());

  const actionCount = nillNotifications.filter(n => n.requires_action).length;
  const greeting    = org?.name ?? userName ?? null;
  const hour        = new Date().getHours();
  const timeOfDay   = hour < 12 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";

  return (
    <>
      <style>{S}</style>
      <WelcomeToNILLModal isOpen={showWelcome} onClose={handleWelcomeClose} />
      <GuidedTourModal isOpen={showTour} onFinish={() => setShowTour(false)} />

      <PageLayout>
        <div className="nd-root">

          {/* ── Welcome ── */}
          <motion.div
            className="nd-welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
          >
            <div className="nd-welcome-eyebrow">Dashboard</div>
            <h1>
              {greeting
                ? <>{timeOfDay}, <em>{greeting}.</em></>
                : <>{timeOfDay}<em>.</em></>
              }
            </h1>
            <p className="nd-welcome-sub">
              {actionCount > 0
                ? `NILL hat ${actionCount} Aufgabe${actionCount !== 1 ? "n" : ""} für dich vorbereitet.`
                : "Alles im grünen Bereich — keine offenen Aufgaben."}
            </p>

            {/* Notifications */}
            {(notifications.length > 0 || nillNotifications.length > 0) && (
              <div className="nd-notifs">
                {notifications.slice(0, 2).map((n, i) => (
                  <div key={i} className="nd-notif">{n.message}</div>
                ))}
                {nillNotifications.slice(0, 3).map((n, i) => (
                  <div
                    key={i}
                    className="nd-notif nd-notif-nill"
                    onClick={() => navigate(`/dashboard/nill?module=${n.module || "applications"}`)}
                  >
                    <span>{NILL_ICONS[n.type] || NILL_ICONS.default}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="nd-notif-label">NILL</div>
                      <div style={{ marginTop: 2 }}>{n.message}</div>
                    </div>
                    {n.requires_action && (
                      <span className="nd-notif-action">Aktion</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Module ── */}
          <div className="nd-section-label">Module</div>

          <div className="nd-grid">
            {cards.map((card, idx) => {
              const unlocked = (!card.module || hasModule(card.module)) &&
                               (!card.feature || hasFeature(card.feature));

              if (!unlocked) {
                return (
                  <motion.div
                    key={card.key}
                    className={`nd-card nd-card-locked`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * .05 }}
                    onClick={() => navigate("/upgrade", {
                      state: { from: "/dashboard", feature: card.feature, module: card.module }
                    })}
                  >
                    <div className="nd-card-icon nd-lock-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <div>
                      <div className="nd-card-title">{card.title}</div>
                      <p className="nd-card-desc">{card.desc}</p>
                    </div>
                  </motion.div>
                );
              }

              if (card.isNill) {
                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .03 }}
                  >
                    <Link to={card.link} className="nd-card nd-card-nill" style={{ display: "flex" }}>
                      {actionCount > 0 && <span className="nd-action-dot" />}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                        <div className="nd-card-icon">◈</div>
                        <div>
                          <div className="nd-card-title">NILL</div>
                          <div className="nd-nill-badge">KI-Sekretärin</div>
                        </div>
                      </div>
                      <div className="nd-nill-modules">
                        {[{ label: "Bewerb.", icon: "👤" }, { label: "Reisen", icon: "✈️" }, { label: "Meetings", icon: "📅" }].map(m => (
                          <div key={m.label} className="nd-nill-module">
                            <div className="nd-nill-module-icon">{m.icon}</div>
                            <div className="nd-nill-module-label">{m.label}</div>
                          </div>
                        ))}
                      </div>
                      <p className="nd-card-desc" style={{ marginTop: 4 }}>
                        {nillNotifications.length > 0
                          ? `${nillNotifications.length} neue Meldung${nillNotifications.length !== 1 ? "en" : ""}`
                          : "Keine offenen Aufgaben"}
                      </p>
                      <div className="nd-card-arrow">Öffnen <span>→</span></div>
                    </Link>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * .05 }}
                >
                  <Link to={card.link} className="nd-card" style={{ display: "flex" }}>
                    <div className="nd-card-icon">{ICONS[card.key] || "◎"}</div>
                    <div>
                      <div className="nd-card-title">{card.title}</div>
                      <p className="nd-card-desc">{card.desc}</p>
                    </div>
                    <div className="nd-card-arrow">Öffnen <span>→</span></div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

        </div>
      </PageLayout>
    </>
  );
}
