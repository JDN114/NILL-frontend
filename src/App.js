import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
   console.log("%c[App] Loaded App component", "color: blue;");

   return (
     <AuthProvider>
       <BrowserRouter>
         <Routes>

           {/* Public Landing Page */}
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

         </Routes>
       </BrowserRouter>
     </AuthProvider>
   );
}

export default App;

