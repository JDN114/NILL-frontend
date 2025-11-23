import React, { useState, useContext } from "react";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const { login } = useContext(AuthContext);
   const navigate = useNavigate();

   const handleLogin = async (e) => {
     e.preventDefault();
     const res = await loginUser(email, password);

     if (res.token) {
       login(res.token);
       navigate("/dashboard");
     } else {
       alert("Login failed");
     }
   };

   return (
     <div className="auth-container">
       <h2>Login</h2>

       <form onSubmit={handleLogin}>
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

         <button type="submit">Login</button>
       </form>

       <p>Kein Konto? <a href="/register">Registrieren</a></p>
     </div>
   );
}

