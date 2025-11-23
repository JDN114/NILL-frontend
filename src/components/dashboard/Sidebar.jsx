import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
   const { logout } = useContext(AuthContext);

   return (
     <div style={{
       width: "220px",
       background: "#111827",
       color: "white",
       padding: "20px",
       display: "flex",
       flexDirection: "column",
       gap: "15px"
     }}>

       <h2 style={{ marginBottom: "30px" }}>NILL Dashboard</h2>
       <Link to="/dashboard" style={{ color: "white" }}>Home</Link>
       <Link to="/dashboard/email-ai" style={{ color: "white" }}>Email AI</Link>
       <Link to="/dashboard/calendar" style={{ color: "white" }}>Calendar</Link>
       <Link to="/dashboard/meetings" style={{ color: "white" }}>Meetings</Link>
       <Link to="/dashboard/projects" style={{ color: "white" }}>Projects</Link>
       <Link to="/dashboard/accounting" style={{ color: "white" }}>Accounting</Link>
       <Link to="/dashboard/settings" style={{ color: "white" }}>Settings</Link>

       <button
          onClick={logout}
          style={{ marginTop: "30px", background: "#ef4444", padding: "8px", border: "none", cursor: "pointer" }}
       >
          Logout
       </button>
     </div>
   );
}

