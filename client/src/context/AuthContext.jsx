import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { isApiCancel } from '../services/api';

const AuthContext = createContext();
const TOKEN_KEY = 'sana_admin_token';

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setAdmin(null);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const verifyToken = async () => {
      if (!token) {
        setAdmin(null);
        setIsAuthLoading(false);
        return;
      }

      try {
        const res = await api.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (res.data?.success) {
          setAdmin(res.data.admin);
        } else {
          logout();
        }
      } catch (err) {
        if (!isApiCancel(err)) logout();
      } finally {
        if (!controller.signal.aborted) setIsAuthLoading(false);
      }
    };

    verifyToken();

    return () => controller.abort();
  }, [token, logout]);

  const login = useCallback(async (username, password) => {
    try {
      const res = await api.post('/api/auth/login', { username, password });
      if (res.data?.success) {
        const receivedToken = res.data.token;
        localStorage.setItem(TOKEN_KEY, receivedToken);
        setToken(receivedToken);
        setAdmin(res.data.admin);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || (err.response ? 'Sign-in is unavailable. Please try again shortly.' : 'Could not reach the sign-in service. Check your connection and try again.'),
      };
    }
  }, []);

  const setupAdmin = useCallback(async (setupToken, username, email, password) => {
    try {
      const res = await api.post('/api/auth/setup-initial-admin', {
        setupToken,
        username,
        email,
        password,
      });
      if (res.data?.success) {
        const receivedToken = res.data.token;
        localStorage.setItem(TOKEN_KEY, receivedToken);
        setToken(receivedToken);
        setAdmin(res.data.admin);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Setup failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Setup failed',
      };
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const res = await api.post('/api/auth/change-password', { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && res.data.token) {
        localStorage.setItem(TOKEN_KEY, res.data.token);
        setToken(res.data.token);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'Could not change your password.' };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Could not reach the sign-in service. Please try again.' };
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: Boolean(admin),
        isAuthLoading,
        login,
        setupAdmin,
        changePassword,
        logout,
      }}
    >
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
