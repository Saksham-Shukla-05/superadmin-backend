import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { setAuthToken } from "../utils/axiosInstance";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setAuthToken(savedToken);
    }
  }, []);

  const login = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
    setAuthToken(t);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
