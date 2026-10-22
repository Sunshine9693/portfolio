import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sana_admin_token') || '');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAuthLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.success) {
          setAdmin(res.data.admin);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setIsAuthLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      if (res.data?.success) {
        const receivedToken = res.data.token;
        localStorage.setItem('sana_admin_token', receivedToken);
        setToken(receivedToken);
        setAdmin(res.data.admin);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Invalid username or password' };
    }
  };

  const setupAdmin = async (setupToken, username, email, password) => {
    try {
      const res = await axios.post('/api/auth/setup-initial-admin', {
        setupToken,
        username,
        email,
        password
      });
      if (res.data?.success) {
        const receivedToken = res.data.token;
        localStorage.setItem('sana_admin_token', receivedToken);
        setToken(receivedToken);
        setAdmin(res.data.admin);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Setup failed' };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Setup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('sana_admin_token');
    setToken('');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated: !!admin, isAuthLoading, login, setupAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
