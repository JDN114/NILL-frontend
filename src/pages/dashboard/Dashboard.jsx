import React from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { Outlet } from "react-router-dom"; 

export default function Dashboard() {
   return (
     <div style={{ display: "flex", height: "100vh" }}>
       <Sidebar />
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
         <Outlet />
       </div>
     </div>
   );
}

