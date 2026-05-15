// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
import Widerruf from "./pages/Widerruf.jsx";
import useInactivityLogout from "./hooks/useInactivityLogout";
import { useAuth } from "./context/AuthContext";

function InactivityGuard() {
  const { user } = useAuth();
  useInactivityLogout(!!user);
  return null;
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
