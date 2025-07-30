import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI } from '../lib/axios'; // ✅ Correct named import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const login = (jwt, userData) => {
    setToken(jwt);
    setUser(userData);
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  const loadUser = async () => {
    try {
      const res = await AuthAPI.get('/me'); // ✅ Uses AuthAPI instance
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to load user", err);
      logout(); // token might be invalid
    }
  };

  useEffect(() => {
    if (token && !user) {
      loadUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
