// src/App.jsx
import React, { Suspense, useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { ThemeProvider, ThemeApplier } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import { AuthProvider } from "./context/AuthContext";
import { GmailProvider } from "./context/GmailContext";
import { OutlookProvider } from "./context/OutlookContext";
import { MailProvider } from "./context/MailContext";
import { ImapProvider } from "./context/ImapContext";

import ProtectedRoute from "./ProtectedRoute";
import AdminGuard from "./components/AdminGuard";
import NillAdminGuard from "./components/NillAdminGuard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import CookieBanner from "./components/CookieBanner";
import TrialBanner from "./components/TrialBanner";
import RouteTracker from "./components/RouteTracker";
import Footer from "./components/Footer";
import FeatureRoute from "./FeatureRoute";
import useInactivityLogout from "./hooks/useInactivityLogout";
import { useAuth } from "./context/AuthContext";
import { lazyWithRetry } from "./utils/lazyWithRetry";

const LandingPage            = lazyWithRetry(() => import("./pages/LandingPage.jsx"));
const Login                  = lazyWithRetry(() => import("./pages/Login"));
const Register               = lazyWithRetry(() => import("./pages/Register"));
const OnboardingPage         = lazyWithRetry(() => import("./pages/OnboardingPage"));
const DashboardLanding       = lazyWithRetry(() => import("./pages/DashboardLanding"));
const EmailsPage             = lazyWithRetry(() => import("./pages/EmailsPage"));
const SettingsPage           = lazyWithRetry(() => import("./pages/SettingsPage"));
const AusweisPage            = lazyWithRetry(() => import("./pages/AusweisPage"));
const AccountingPage         = lazyWithRetry(() => import("./pages/AccountingPage"));
const KalenderLanding        = lazyWithRetry(() => import("./pages/KalenderLanding"));
const WorkflowLanding        = lazyWithRetry(() => import("./pages/WorkflowLanding"));
const WorkflowTasks          = lazyWithRetry(() => import("./pages/WorkflowTasks"));
const WorkflowTime           = lazyWithRetry(() => import("./pages/WorkflowTime"));
const WorkflowTeam           = lazyWithRetry(() => import("./pages/WorkflowTeam"));
const TransactionPage        = lazyWithRetry(() => import("./pages/TransactionPage"));
const AdminPage              = lazyWithRetry(() => import("./pages/AdminPage"));
const RedeemCoupon           = lazyWithRetry(() => import("./pages/RedeemCouponPage"));
const Pricing                = lazyWithRetry(() => import("./pages/PricingPage"));
const Impressum              = lazyWithRetry(() => import("./pages/Impressum"));
const Datenschutz            = lazyWithRetry(() => import("./pages/Datenschutz"));
const AboutNillPage          = lazyWithRetry(() => import("./pages/AboutNillPage"));
const AboutUsPage            = lazyWithRetry(() => import("./pages/AboutUsPage"));
const Founder                = lazyWithRetry(() => import("./pages/Founder"));
const Roadmap                = lazyWithRetry(() => import("./pages/Roadmap"));
const VerifyEmail            = lazyWithRetry(() => import("./pages/VerifyEmail"));
const ResetPasswordPage      = lazyWithRetry(() => import("./pages/ResetPasswordPage"));
const VerificationSuccess    = lazyWithRetry(() => import("./pages/VerificationSuccess"));
const VerificationFailed     = lazyWithRetry(() => import("./pages/VerificationFailed"));
const InviteAcceptPage       = lazyWithRetry(() => import("./pages/InviteAcceptPage"));
const UpgradePage            = lazyWithRetry(() => import("./pages/UpgradePage"));
const AGB                    = lazyWithRetry(() => import("./pages/AGB"));
const ChangelogPage          = lazyWithRetry(() => import("./pages/ChangelogPage"));
const SicherheitPage         = lazyWithRetry(() => import("./pages/SicherheitPage"));
const GobdPage               = lazyWithRetry(() => import("./pages/GobdPage"));
const KarrierePage           = lazyWithRetry(() => import("./pages/KarrierePage"));
const WorkflowDeliveryNotes  = lazyWithRetry(() => import("./pages/Workflow_delivery_notes_page.jsx"));
const HrDocuments            = lazyWithRetry(() => import("./pages/HrDocuments.jsx"));
const NILLModule             = lazyWithRetry(() => import("./pages/NILLModule.jsx"));
const CallsModule            = lazyWithRetry(() => import("./pages/CallsModule.jsx"));
const ArbeitsStationPage     = lazyWithRetry(() => import("./pages/ArbeitsStationPage.jsx"));
const ArbeitsStationKalender   = lazyWithRetry(() => import("./pages/station/ArbeitsStationKalender.jsx"));
const ArbeitsStationAufgaben   = lazyWithRetry(() => import("./pages/station/ArbeitsStationAufgaben.jsx"));
const ArbeitsStationZeit       = lazyWithRetry(() => import("./pages/station/ArbeitsStationZeit.jsx"));
const ArbeitsStationHR         = lazyWithRetry(() => import("./pages/station/ArbeitsStationHR.jsx"));
const ArbeitsStationSchichtplan  = lazyWithRetry(() => import("./pages/station/ArbeitsStationSchichtplan.jsx"));
const ArbeitsStationLieferscheine = lazyWithRetry(() => import("./pages/station/ArbeitsStationLieferscheine.jsx"));
const ArbeitsStationInventur   = lazyWithRetry(() => import("./pages/station/ArbeitsStationInventur.jsx"));
const Widerruf               = lazyWithRetry(() => import("./pages/Widerruf.jsx"));
const Barrierefreiheit       = lazyWithRetry(() => import("./pages/Barrierefreiheit"));
const CheckoutPage           = lazyWithRetry(() => import("./pages/CheckoutPage.jsx"));
const WieEsArbeitetPage      = lazyWithRetry(() => import("./pages/WieEsArbeitetPage.jsx"));
const AppPage                = lazyWithRetry(() => import("./pages/AppPage.jsx"));
const NachhaltigkeitPage     = lazyWithRetry(() => import("./pages/NachhaltigkeitPage.jsx"));

function PushNotification() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const handler = (e) => {
      // OS notification was clicked — the service worker focused this window
      // and asks us to route client-side to the notification's destination.
      if (e.data?.type === "NAVIGATE" && e.data.url) {
        try {
          const u = new URL(e.data.url, window.location.origin);
          if (u.origin === window.location.origin) navigate(u.pathname + u.search + u.hash);
          else window.location.href = e.data.url;
        } catch {
          window.location.href = e.data.url;
        }
        return;
      }
      if (e.data?.type !== "PUSH") return;
      const id = Date.now();
      setItems(prev => [...prev.slice(-2), { id, title: e.data.title, body: e.data.body, url: e.data.url }]);
      setTimeout(() => setItems(prev => prev.filter(x => x.id !== id)), 5000);
    };
    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, [navigate]);

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

const FOOTER_HIDDEN = ["/station", "/dashboard", "/Impressum", "/Datenschutz", "/agb", "/Widerruf"];

function ConditionalFooter() {
  const location = useLocation();
  if (FOOTER_HIDDEN.some(p => location.pathname.startsWith(p))) return null;
  return <Footer />;
}

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <GmailProvider>
        <OutlookProvider>
          <ImapProvider>
          <MailProvider>
            <Router>
              <ThemeApplier />
              <InactivityGuard />
              <RouteTracker />
              <CookieBanner />
              <TrialBanner />
              <PushNotification />
              <Suspense fallback={<PageLoader />}>
                <ErrorBoundary>
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
                  <Route path="/gobd" element={<GobdPage />} />
                  <Route path="/karriere" element={<KarrierePage />} />
                  <Route path="/founder" element={<Founder />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/invite/:token" element={<InviteAcceptPage />} />
                  <Route path="/Widerruf" element={<Widerruf />} />
                  <Route path="/barrierefreiheit" element={<Barrierefreiheit />} />

                  {/* Marketing-Sektionen, ausgelagert von der Landingpage */}
                  <Route path="/wie-es-arbeitet" element={<WieEsArbeitetPage />} />
                  <Route path="/app" element={<AppPage />} />
                  <Route path="/nachhaltigkeit" element={<NachhaltigkeitPage />} />

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

                  {/* Mitarbeiter-Ausweis — schneller Direktzugriff auf den QR-Badge */}
                  <Route path="/ausweis" element={
                    <ProtectedRoute><AusweisPage /></ProtectedRoute>
                  }/>

                  {/* Company Admin only */}
                  <Route path="/dashboard/settings" element={
                    <ProtectedRoute><SettingsPage /></ProtectedRoute>
                  }/>

                  {/* NILL Superadmin */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <NillAdminGuard><AdminPage /></NillAdminGuard>
                    </ProtectedRoute>
                  }/>
                  <Route path="/dashboard/NILL-Secretary" element={
                    <ProtectedRoute>
                      <FeatureRoute module="nill">
                        <NILLModule />
                      </FeatureRoute>
                    </ProtectedRoute>
                  }/>
                  <Route path="/dashboard/NILL-Secretary/Calls" element={
                    <ProtectedRoute>
                      <FeatureRoute module="nill">
                        <CallsModule />
                      </FeatureRoute>
                    </ProtectedRoute>
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

                  {/* Catch-all — never leave an unknown route blank. Notifications
                      delivered before a route rename (or any stray deep link) land
                      here and are sent to the dashboard instead of a white screen. */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
                </ErrorBoundary>
              </Suspense>
              <ConditionalFooter />
              <ThemeToggle />
            </Router>
          </MailProvider>
          </ImapProvider>
        </OutlookProvider>
      </GmailProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
