import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Emails from "./pages/Emails";
import ProtectedRoute from "./ProtectedRoute";
import ConnectEmail from "./pages/ConnectEmail";
import GmailCallback from "./pages/GmailCallback";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landingpage */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/emails" element={<Emails />} />
        <Route path="/emails" element={<ProtectedRoute><Emails /></ProtectedRoute>} />
        <Route path="/connect-email" element={<ProtectedRoute><ConnectEmail /></ProtectedRoute>} />
        <Route path="/gmail/callback" element={<GmailCallback />} />
      </Routes>
    </BrowserRouter>
  );
}
