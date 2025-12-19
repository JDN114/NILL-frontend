import { createContext, useContext, useState, ReactNode } from "react";
import api, { setAuthToken } from "../services/api";

interface AuthContextProps {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const t = res.data.access_token;
    setToken(t);
    setAuthToken(t);
  };

  const logout = () => {
    setToken(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
