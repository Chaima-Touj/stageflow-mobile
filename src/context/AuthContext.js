import React, { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../api/authAPI";
import { getToken, setToken, removeToken } from "../api/client";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  
const toggleTheme = () => setIsDark(!isDark);
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const data = await authAPI.getMe();
      setUser(data.user);
    } catch {
      await removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      await setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      await setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

 const logout = async () => {
  await removeToken();
  setUser(null);
};

  const updateProfile = async (updatedData) => {
    try {
      const data = await authAPI.updateProfile(updatedData);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const refreshUser = async () => {
    try {
      const data = await authAPI.getMe();
      setUser(data.user);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, updateProfile, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);