import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { setAuthToken } from "../utils/axiosInstance";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
      setAuthToken(savedToken);
    }
  }, []);

  const login = (t) => {
    setToken(t);
    localStorage.setItem("authToken", t);
    setAuthToken(t);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
