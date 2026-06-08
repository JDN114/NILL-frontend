// src/App.jsx
import React, { Suspense, useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { GmailProvider } from "./context/GmailContext";
import { OutlookProvider } from "./context/OutlookContext";
import { MailProvider } from "./context/MailContext";
import { ImapProvider } from "./context/ImapContext";

import ProtectedRoute from "./ProtectedRoute";
import AdminGuard from "./components/AdminGuard";
import CookieBanner from "./components/CookieBanner";
import TrialBanner from "./components/TrialBanner";
import RouteTracker from "./components/RouteTracker";
import Footer from "./components/Footer";
import FeatureRoute from "./FeatureRoute";
import useInactivityLogout from "./hooks/useInactivityLogout";
import { useAuth } from "./context/AuthContext";

const LandingPage            = React.lazy(() => import("./pages/LandingPage.jsx"));
const Login                  = React.lazy(() => import("./pages/Login"));
const Register               = React.lazy(() => import("./pages/Register"));
const OnboardingPage         = React.lazy(() => import("./pages/OnboardingPage"));
const DashboardLanding       = React.lazy(() => import("./pages/DashboardLanding"));
const EmailsPage             = React.lazy(() => import("./pages/EmailsPage"));
const SettingsPage           = React.lazy(() => import("./pages/SettingsPage"));
const AccountingPage         = React.lazy(() => import("./pages/AccountingPage"));
const KalenderLanding        = React.lazy(() => import("./pages/KalenderLanding"));
const WorkflowLanding        = React.lazy(() => import("./pages/WorkflowLanding"));
const WorkflowTasks          = React.lazy(() => import("./pages/WorkflowTasks"));
const WorkflowTime           = React.lazy(() => import("./pages/WorkflowTime"));
const WorkflowTeam           = React.lazy(() => import("./pages/WorkflowTeam"));
const TransactionPage        = React.lazy(() => import("./pages/TransactionPage"));
const AdminPage              = React.lazy(() => import("./pages/AdminPage"));
const RedeemCoupon           = React.lazy(() => import("./pages/RedeemCouponPage"));
const Pricing                = React.lazy(() => import("./pages/PricingPage"));
const Impressum              = React.lazy(() => import("./pages/Impressum"));
const Datenschutz            = React.lazy(() => import("./pages/Datenschutz"));
const AboutNillPage          = React.lazy(() => import("./pages/AboutNillPage"));
const AboutUsPage            = React.lazy(() => import("./pages/AboutUsPage"));
const Founder                = React.lazy(() => import("./pages/Founder"));
const Roadmap                = React.lazy(() => import("./pages/Roadmap"));
const VerifyEmail            = React.lazy(() => import("./pages/VerifyEmail"));
const ResetPasswordPage      = React.lazy(() => import("./pages/ResetPasswordPage"));
const VerificationSuccess    = React.lazy(() => import("./pages/VerificationSuccess"));
const VerificationFailed     = React.lazy(() => import("./pages/VerificationFailed"));
const InviteAcceptPage       = React.lazy(() => import("./pages/InviteAcceptPage"));
const UpgradePage            = React.lazy(() => import("./pages/UpgradePage"));
const AGB                    = React.lazy(() => import("./pages/AGB"));
const ChangelogPage          = React.lazy(() => import("./pages/ChangelogPage"));
const SicherheitPage         = React.lazy(() => import("./pages/SicherheitPage"));
const KarrierePage           = React.lazy(() => import("./pages/KarrierePage"));
const WorkflowDeliveryNotes  = React.lazy(() => import("./pages/Workflow_delivery_notes_page.jsx"));
const HrDocuments            = React.lazy(() => import("./pages/HrDocuments.jsx"));
const NILLModule             = React.lazy(() => import("./pages/NILLModule.jsx"));
const CallsModule            = React.lazy(() => import("./pages/CallsModule.jsx"));
const ArbeitsStationPage     = React.lazy(() => import("./pages/ArbeitsStationPage.jsx"));
const ArbeitsStationKalender   = React.lazy(() => import("./pages/station/ArbeitsStationKalender.jsx"));
const ArbeitsStationAufgaben   = React.lazy(() => import("./pages/station/ArbeitsStationAufgaben.jsx"));
const ArbeitsStationZeit       = React.lazy(() => import("./pages/station/ArbeitsStationZeit.jsx"));
const ArbeitsStationHR         = React.lazy(() => import("./pages/station/ArbeitsStationHR.jsx"));
const ArbeitsStationSchichtplan  = React.lazy(() => import("./pages/station/ArbeitsStationSchichtplan.jsx"));
const ArbeitsStationLieferscheine = React.lazy(() => import("./pages/station/ArbeitsStationLieferscheine.jsx"));
const ArbeitsStationInventur   = React.lazy(() => import("./pages/station/ArbeitsStationInventur.jsx"));
const Widerruf               = React.lazy(() => import("./pages/Widerruf.jsx"));
const Barrierefreiheit       = React.lazy(() => import("./pages/Barrierefreiheit"));
const CheckoutPage           = React.lazy(() => import("./pages/CheckoutPage.jsx"));

function PushNotification() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const handler = (e) => {
      if (e.data?.type !== "PUSH") return;
      const id = Date.now();
      setItems(prev => [...prev.slice(-2), { id, title: e.data.title, body: e.data.body, url: e.data.url }]);
      setTimeout(() => setItems(prev => prev.filter(x => x.id !== id)), 5000);
    };
    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, []);

  if (!items.length) return null;
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 99999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {items.map(n => (
        <div key={n.id}
          onClick={() => { window.location.href = n.url || "/"; }}
          style={{
            pointerEvents: "all", cursor: "pointer",
            display: "flex", alignItems: "flex-start", gap: "0.65rem",
            background: "rgba(18,18,16,0.92)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: 12, padding: "0.7rem 0.9rem",
            width: 300, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            animation: "nill-push-in 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg,#d4af37,#a07830)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#000",
          }}>N</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#efeee7", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(239,237,231,0.55)", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{n.body}</div>
          </div>
        </div>
      ))}
      <style>{`@keyframes nill-push-in{from{opacity:0;transform:translateX(24px) scale(0.96)}to{opacity:1;transform:translateX(0) scale(1)}}`}</style>
    </div>
  );
}

function PageLoader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#04070f" }}>
      <style>{`@keyframes nill-spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ width: 24, height: 24, border: "2px solid rgba(197,165,114,0.25)", borderTopColor: "#c5a572", borderRadius: "50%", animation: "nill-spin 0.65s linear infinite" }} />
    </div>
  );
}

function InactivityGuard() {
  const { user } = useAuth();
  const location = useLocation();
  // ArbeitsStation is a kiosk — a shared, always-on display. Never log out due to
  // inactivity while on any /station route.
  const isStation = location.pathname.startsWith("/station");
  useInactivityLogout(!!user && !isStation);
  return null;
}

function ConditionalFooter() {
  const location = useLocation();
  if (location.pathname.startsWith("/station")) return null;
  if (location.pathname.startsWith("/dashboard")) return null;
  return <Footer />;
}

function StationBackButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromStation = sessionStorage.getItem("nill_from_station") === "1";
  if (!fromStation || location.pathname.startsWith("/station")) return null;
  return (
    <button
      onClick={() => { sessionStorage.removeItem("nill_from_station"); navigate("/station"); }}
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 9998,
        padding: "0.55rem 1.1rem",
        background: "rgba(4,7,15,0.92)",
        border: "1px solid rgba(197,165,114,0.35)",
        borderRadius: 99,
        color: "#c5a572",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.72rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", gap: 6,
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      ← ArbeitsStation
    </button>
  );
}

function App() {
  return (
    <AuthProvider>
      <GmailProvider>
        <OutlookProvider>
          <ImapProvider>
          <MailProvider>
            <Router>
              <InactivityGuard />
              <RouteTracker />
              <CookieBanner />
              <TrialBanner />
              <PushNotification />
              <StationBackButton />
              <Suspense fallback={<PageLoader />}>
                <Routes>

                {/* Public */}
                  <Route path="/" element={
                    window.matchMedia("(display-mode: standalone)").matches
                      ? <Navigate to="/login" replace />
                      : <LandingPage />
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verification-success" element={<VerificationSuccess />} />
                  <Route path="/verification-failed" element={<VerificationFailed />} />
                  <Route path="/Impressum" element={<Impressum />} />
                  <Route path="/Datenschutz" element={<Datenschutz />} />
                  <Route path="/agb" element={<AGB />} />
                  <Route path="/about-nill" element={<AboutNillPage />} />
                  <Route path="/about-us" element={<AboutUsPage />} />
                  <Route path="/ueber-uns" element={<AboutUsPage />} />
                  <Route path="/changelog" element={<ChangelogPage />} />
                  <Route path="/sicherheit" element={<SicherheitPage />} />
                  <Route path="/karriere" element={<KarrierePage />} />
                  <Route path="/founder" element={<Founder />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/invite/:token" element={<InviteAcceptPage />} />
                  <Route path="/Widerruf" element={<Widerruf />} />
                  <Route path="/barrierefreiheit" element={<Barrierefreiheit />} />

                  {/* Öffentliche Checkout-Seite für Endkunden (Zahlungslink) */}
                  <Route path="/zahlen/:token" element={<CheckoutPage />} />
                  <Route path="/zahlen/:token/erfolg" element={<CheckoutPage />} />

                  {/* Upgrade / Access Denied */}
                  <Route path="/upgrade" element={
                    <ProtectedRoute><UpgradePage /></ProtectedRoute>
                  }/>

                  {/* Protected — Login + aktiver Plan erforderlich */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute><DashboardLanding /></ProtectedRoute>
                  }/>

                  {/* E-Mail — requires feature "email" + module "emails" */}
                  <Route path="/dashboard/emails" element={
                    <ProtectedRoute>
                      <FeatureRoute feature="email" module="emails">
                        <EmailsPage />
                      </FeatureRoute>
                    </ProtectedRoute>
                  }/>

                  {/* Kalender — requires module "calendar" (admin bypass via hasFeature) */}
                  <Route path="/dashboard/calendar" element={
                    <ProtectedRoute>
                      <FeatureRoute feature="calendar" module="calendar">
                        <KalenderLanding />
                      </FeatureRoute>
                    </ProtectedRoute>
                  }/>

                  {/* Buchhaltung — requires feature "accounting" + module "accounting" */}
                  <Route path="/dashboard/accounting" element={
                    <ProtectedRoute>
                      <FeatureRoute feature="accounting" module="accounting">
                        <AccountingPage />
                      </FeatureRoute>
                    </ProtectedRoute>
                  }/>
                  <Route path="/dashboard/accounting/Transaction" element={
                    <ProtectedRoute>
                      <FeatureRoute feature="accounting" module="accounting">
                        <TransactionPage />
                      </FeatureRoute>
                    </ProtectedRoute>
                  }/>

                  {/* Workflow — kein Feature-Guard, aber Team-Tab intern per AdminGuard */}
                  <Route path="/dashboard/workflow" element={
                    <ProtectedRoute><WorkflowLanding /></ProtectedRoute>
                  }/>
                  <Route path="/dashboard/workflow/tasks" element={
                    <ProtectedRoute><WorkflowTasks /></ProtectedRoute>
                  }/>
                  <Route path="/dashboard/workflow/time" element={
                    <ProtectedRoute><WorkflowTime /></ProtectedRoute>
                  }/>
                  <Route path="/dashboard/workflow/team" element={
                    <ProtectedRoute>
                      <AdminGuard><WorkflowTeam /></AdminGuard>
                    </ProtectedRoute>
                  }/>
                  <Route path="/dashboard/workflow/Delivery-notes" element={
                    <ProtectedRoute>
                      <AdminGuard><WorkflowDeliveryNotes /></AdminGuard>
                    </ProtectedRoute>
                  }/>
                  <Route path="/dashboard/workflow/hr-documents" element={
                    <ProtectedRoute><HrDocuments /></ProtectedRoute>
                  }/>

                  <Route path="/redeem-coupon" element={
                    <ProtectedRoute><RedeemCoupon /></ProtectedRoute>
                  }/>

                  {/* Company Admin only */}
                  <Route path="/dashboard/settings" element={
                    <ProtectedRoute><SettingsPage /></ProtectedRoute>
                  }/>

                  {/* NILL Superadmin */}
                  <Route path="/admin" element={
                    <ProtectedRoute><AdminPage /></ProtectedRoute>
                  }/>
                  <Route path="/dashboard/NILL-Secretary" element={
                    <ProtectedRoute><NILLModule /></ProtectedRoute>
                  }/>
                  <Route path="/dashboard/NILL-Secretary/Calls" element={
                    <ProtectedRoute><CallsModule /></ProtectedRoute>
                  }/>

                  {/* ArbeitsStation — tablet/kiosk interface */}
                  <Route path="/station" element={
                    <ProtectedRoute><ArbeitsStationPage /></ProtectedRoute>
                  }/>
                  <Route path="/station/calendar" element={
                    <ProtectedRoute><ArbeitsStationKalender /></ProtectedRoute>
                  }/>
                  <Route path="/station/tasks" element={
                    <ProtectedRoute><ArbeitsStationAufgaben /></ProtectedRoute>
                  }/>
                  <Route path="/station/time" element={
                    <ProtectedRoute><ArbeitsStationZeit /></ProtectedRoute>
                  }/>
                  <Route path="/station/hr-documents" element={
                    <ProtectedRoute><ArbeitsStationHR /></ProtectedRoute>
                  }/>
                  <Route path="/station/schichtplan" element={
                    <ProtectedRoute><ArbeitsStationSchichtplan /></ProtectedRoute>
                  }/>
                  <Route path="/station/lieferscheine" element={
                    <ProtectedRoute><ArbeitsStationLieferscheine /></ProtectedRoute>
                  }/>
                  <Route path="/station/inventur" element={
                    <ProtectedRoute><ArbeitsStationInventur /></ProtectedRoute>
                  }/>
                </Routes>
              </Suspense>
              <ConditionalFooter />
            </Router>
          </MailProvider>
          </ImapProvider>
        </OutlookProvider>
      </GmailProvider>
    </AuthProvider>
  );
}

export default App;
