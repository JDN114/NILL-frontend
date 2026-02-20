import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { GmailProvider } from "./context/GmailContext";

import LandingPage from "./components/LandingPage";
import Login from "./pages/Login";
import DashboardLanding from "./pages/DashboardLanding";
import EmailsPage from "./pages/EmailsPage";
import SettingsPage from "./pages/SettingsPage";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import Register from "./pages/Register";
import AboutNillPage from "./pages/AboutNillPage";
import AboutUsPage from "./pages/AboutUsPage";
import Founder from "./pages/Founder";
import Roadmap from "./pages/Roadmap";
import RedeemCoupon from "./pages/RedeemCouponPage";
import AdminPage from "./pages/AdminPage";
import VerifyEmail from "./pages/VerifyEmail";
import VerificationSuccess from "./pages/VerificationSuccess";
import VerificationFailed from "./pages/VerificationFailed";
import AccountingPage from "./pages/AccountingPage";

/* 🔥 Workflow Imports */
import WorkflowLanding from "./pages/WorkflowLanding";
import WorkflowTasks from "./pages/WorkflowTasks";
import WorkflowTime from "./pages/WorkflowTime";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <GmailProvider>
      <Router>
        <Routes>

          {/* ================= Öffentlich ================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Impressum" element={<Impressum />} />
          <Route path="/Datenschutz" element={<Datenschutz />} />
          <Route path="/about-nill" element={<AboutNillPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verification-success" element={<VerificationSuccess />} />
          <Route path="/verification-failed" element={<VerificationFailed />} />

          {/* ================= Geschützt ================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLanding />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/emails"
            element={
              <ProtectedRoute>
                <EmailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/accounting"
            element={
              <ProtectedRoute>
                <AccountingPage />
              </ProtectedRoute>
            }
          />

          {/* 🔒 Coupons */}
          <Route
            path="/redeem-coupon"
            element={
              <ProtectedRoute>
                <RedeemCoupon />
              </ProtectedRoute>
            }
          />

          {/* 🔒 Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* ================= Workflow ================= */}

          <Route
            path="/workflow"
            element={
              <ProtectedRoute>
                <WorkflowLanding />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workflow/tasks"
            element={
              <ProtectedRoute>
                <WorkflowTasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workflow/time"
            element={
              <ProtectedRoute>
                <WorkflowTime />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </GmailProvider>
  );
}

export default App;
