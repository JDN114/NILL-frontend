// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { GmailProvider } from "./context/GmailContext";
import { OutlookProvider } from "./context/OutlookContext";
import { MailProvider } from "./context/MailContext";
import { ImapProvider } from "./context/ImapContext";

import ProtectedRoute from "./ProtectedRoute";
import AdminGuard from "./components/AdminGuard";
import CookieBanner from "./components/CookieBanner";
import RouteTracker from "./components/RouteTracker";

import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardLanding from "./pages/DashboardLanding";
import EmailsPage from "./pages/EmailsPage";
import SettingsPage from "./pages/SettingsPage";
import AccountingPage from "./pages/AccountingPage";
import KalenderLanding from "./pages/KalenderLanding";
import WorkflowLanding from "./pages/WorkflowLanding";
import WorkflowTasks from "./pages/WorkflowTasks";
import WorkflowTime from "./pages/WorkflowTime";
import WorkflowTeam from "./pages/WorkflowTeam";
import TransactionPage from "./pages/TransactionPage";
import AdminPage from "./pages/AdminPage";
import RedeemCoupon from "./pages/RedeemCouponPage";
import Pricing from "./pages/PricingPage";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AboutNillPage from "./pages/AboutNillPage";
import AboutUsPage from "./pages/AboutUsPage";
import Founder from "./pages/Founder";
import Roadmap from "./pages/Roadmap";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerificationSuccess from "./pages/VerificationSuccess";
import VerificationFailed from "./pages/VerificationFailed";
import InviteAcceptPage from "./pages/InviteAcceptPage";
import FeatureRoute from "./FeatureRoute";
import UpgradePage from "./pages/UpgradePage";
import AGB from "./pages/AGB";
import ChangelogPage from "./pages/ChangelogPage";
import SicherheitPage from "./pages/SicherheitPage";
import KarrierePage from "./pages/KarrierePage";
import Footer from "./components/Footer";
import WorkflowDeliveryNotes from "./pages/Workflow_delivery_notes_page.jsx";
import HrDocuments from "./pages/HrDocuments.jsx";
import NILLModule from "./pages/NILLModule.jsx";
import CallsModule from "./pages/CallsModule.jsx";
import ArbeitsStationPage from "./pages/ArbeitsStationPage.jsx";
import ArbeitsStationKalender from "./pages/station/ArbeitsStationKalender.jsx";
import ArbeitsStationAufgaben from "./pages/station/ArbeitsStationAufgaben.jsx";
import ArbeitsStationZeit from "./pages/station/ArbeitsStationZeit.jsx";
import ArbeitsStationHR from "./pages/station/ArbeitsStationHR.jsx";
import Widerruf from "./pages/Widerruf.jsx";
import Barrierefreiheit from "./pages/Barrierefreiheit";
import useInactivityLogout from "./hooks/useInactivityLogout";
import { useAuth } from "./context/AuthContext";

function InactivityGuard() {
  const { user } = useAuth();
  useInactivityLogout(!!user);
  return null;
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
              <StationBackButton />
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
	      </Routes>
              <Footer />
            </Router>
          </MailProvider>
          </ImapProvider>
        </OutlookProvider>
      </GmailProvider>
    </AuthProvider>
  );
}

export default App;
