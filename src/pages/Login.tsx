import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      await login(email, password);
    } catch {
      setError("Login fehlgeschlagen");
    }
  };

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
}
