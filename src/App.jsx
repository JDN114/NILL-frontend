import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Login from "./pages/Login";
import DashboardLanding from "./pages/DashboardLanding";
import EmailsPage from "./pages/EmailsPage";
import SettingsPage from "./pages/SettingsPage";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import Register from "./pages/Register";
import AboutNillPage from "./pages/AboutNillPage"; // die neue Seite

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLanding />} />
        <Route path="/dashboard/emails" element={<EmailsPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/Impressum" element={<Impressum />} />
        <Route path="/Datenschutz" element={<Datenschutz />} />
        <Route path="/about-nill" element={<AboutNillPage />} /> 
     </Routes>
    </Router>
  );
}

export default App;
