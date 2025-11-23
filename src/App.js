import React from 'react';
import LandingPage from './components/LandingPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
   console.log('%c[App] Loaded App component', 'color: blue;');

return (
     <AuthProvider>
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<Login />} />
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />

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

