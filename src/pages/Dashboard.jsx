import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchDashboardData } from "../services/api";
import { HiOutlineLogout } from "react-icons/hi";
import { FiMenu } from "react-icons/fi";
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
   BarChart,
   Bar,
   Legend,
} from "recharts";

export default function Dashboard() {
   const { token, logout } = useContext(AuthContext);
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [menuOpen, setMenuOpen] = useState(false);

   useEffect(() => {
     const getData = async () => {
       try {
         const response = await fetchDashboardData(token);
         setData(response);
       } catch (err) {
         console.error("Error fetching dashboard data:", err);
       } finally {
         setLoading(false);
       }
     };
     getData();
   }, [token]);

   if (loading)
     return (
       <div className="flex items-center justify-center h-screen">
         <p className="text-xl text-gray-600 animate-pulse">
           Loading dashboard...
         </p>
       </div>
     );

   return (
     <div className="min-h-screen bg-gray-50">
       {/* Header */}
       <header className="bg-white shadow-md fixed w-full z-50">
         <div className="container mx-auto flex justify-between items-center py-4 px-6">
           <div className="flex items-center space-x-4">
             <img src="/logo.svg" alt="NILL Logo" className="h-10 w-auto" />
             <h1 className="text-2xl font-bold text-gray-800">NILL Dashboard</h1>
           </div>
           <div className="flex items-center space-x-4">
             <button
               className="text-gray-700 hover:text-gray-900"
               onClick={() => setMenuOpen(!menuOpen)}
             >
               <FiMenu size={28} />
             </button>
             <button
               className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
               onClick={logout}
             >
               <HiOutlineLogout size={20} />
               Logout
             </button>
           </div>
         </div>

         {/* Slide-in Menu */}
         {menuOpen && (
           <div className="absolute top-full left-0 w-full bg-white shadow-lg py-4">
             <ul className="flex flex-col space-y-2 text-gray-800 px-6">
               <li className="hover:text-blue-600 cursor-pointer">Home</li>
               <li className="hover:text-blue-600 cursor-pointer">Über uns</li>
               <li className="hover:text-blue-600 cursor-pointer">Nachhaltigkeit</li>
               <li className="hover:text-blue-600 cursor-pointer">Impressum</li>
               <li className="hover:text-blue-600 cursor-pointer">Kontakt</li>
               <li className="hover:text-blue-600 cursor-pointer">Login</li>
             </ul>
           </div>
         )}
       </header>

       {/* Main Content */}
       <main className="pt-28 container mx-auto px-6 space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 mb-6">
           Willkommen zurück!
         </h2>

         {/* KPI Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <KpiCard
             title="Neue E-Mails"
             value={data.emails.length}
             color="bg-blue-500"
           />
           <KpiCard
             title="Meetings diese Woche"
             value={data.meetings.length}
             color="bg-green-500"
           />
           <KpiCard
             title="Offene Projekte"
             value={data.projects.length}
             color="bg-yellow-500"
           />
           <KpiCard
             title="Buchungen"
             value={data.accounting.length}
             color="bg-purple-500"
           />
         </div>

         {/* Charts */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-xl shadow-md">
             <h3 className="text-xl font-semibold mb-4 text-gray-800">E-Mail Aktivität</h3>
             <ResponsiveContainer width="100%" height={250}>
               <LineChart data={data.emailActivity}>
                 <XAxis dataKey="day" />
                 <YAxis />
                 <Tooltip />
                 <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} />
               </LineChart>
             </ResponsiveContainer>
           </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
             <h3 className="text-xl font-semibold mb-4 text-gray-800">Projektstatus</h3>
             <ResponsiveContainer width="100%" height={250}>
               <BarChart data={data.projects}>
                 <XAxis dataKey="name" />
                 <YAxis />
                 <Tooltip />
                 <Legend />
                 <Bar dataKey="progress" fill="#10B981" />
               </BarChart>
             </ResponsiveContainer>
           </div>
         </div>
       </main>
     </div>
   );
}

// KPI Card Component
function KpiCard({ title, value, color }) {
   return (
     <div className={`flex flex-col justify-center items-center p-6 rounded-xl shadow-md ${color} text-white`}>
       <p className="text-lg">{title}</p>
       <p className="text-3xl font-bold mt-2">{value}</p>
     </div>
   );
}

