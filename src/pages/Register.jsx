import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   const handleRegister = async (e) => {
     e.preventDefault();
     const res = await registerUser(email, password);

     if (res.message === "User created successfully") {
       alert("Registrierung erfolgreich!");
       navigate("/login");
     } else {
       alert("Fehler: " + res.detail);
     }
   };

   return (
     <div className="auth-container">
       <h2>Registrieren</h2>

       <form onSubmit={handleRegister}>
         <input
           type="email"
           placeholder="Email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           required
         />
 
         <input
           type="password"
           placeholder="Passwort"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           required
         />

         <button type="submit">Konto erstellen</button>
       </form>

       <p>Schon ein Konto? <a href="/login">Login</a></p>
     </div>
   );
}

