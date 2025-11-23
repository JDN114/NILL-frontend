import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
   const { logout } = useContext(AuthContext);

   return (
     <div>
       <h1>Dashboard</h1>
       <p>Willkommen! Du bist eingeloggt.</p>

       <button onClick={logout}>Logout</button>
     </div>
   );
}

