import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [showPw, setShowPw] = useState(false);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

   const handleLogin = async (e) => {
     e.preventDefault();
     setError("");
     setLoading(true);

     try {
       const result = await loginUser(email, password);

       if (result.access_token) {
         localStorage.setItem("token", result.access_token);

         navigate("/dashboard");
       } else {
         setError(result.detail || "Login failed.");
       }
     } catch (err) {
       setError("Server error — bitte später erneut versuchen");
     }

     setLoading(false);
   };

   return (
     <div className="login-wrapper">
       <div className="login-container">

         <h2 className="login-title">Willkommen zurück</h2>

         <form onSubmit={handleLogin} className="login-form">

           <label>Email</label>
           <input
             type="email"
             placeholder="deine@email.com"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
           />

           <label>Passwort</label>
           <div className="password-field">
             <input
               type={showPw ? "text" : "password"}
               placeholder="Passwort"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />

             <button
               type="button"
               className="toggle-password"
               onClick={() => setShowPw(!showPw)}
             >
               {showPw ? "🙈" : "👁"} 
             </button>
           </div>

           {error && <p className="error">{error}</p>}

           <button type="submit" disabled={loading} className="login-button">
             {loading ? "Wird geladen..." : "Einloggen"}
           </button>
         </form>

         <div className="login-footer">
           <Link to="/forgot-password" className="forgot-link">
             Passwort vergessen?
           </Link>

           <p>
             Kein Konto?{" "}
             <Link to="/register" className="register-link">
               Registrieren
             </Link>
           </p>
         </div>
       </div>
     </div>
   );
}

