import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { isApiCancel } from '../services/api';
import { readAdminToken, saveAdminToken, clearAdminToken, isRejectedAdminSession } from '../services/adminSession';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(readAdminToken);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const [verificationAttempt, setVerificationAttempt] = useState(0);

  const logout = useCallback(() => {
    clearAdminToken();
    setToken('');
    setAdmin(null);
    setSessionError('');
  }, []);

  const retrySession = useCallback(() => {
    setIsAuthLoading(true);
    setVerificationAttempt((attempt) => attempt + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const verifyToken = async () => {
      setSessionError('');
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
          setSessionError('Could not check your saved session. Please retry or sign in below.');
        }
      } catch (err) {
        if (isApiCancel(err)) return;
        if (isRejectedAdminSession(err)) logout();
        else setSessionError('The sign-in service is temporarily unavailable. Please retry your saved session or sign in below.');
      } finally {
        if (!controller.signal.aborted) setIsAuthLoading(false);
      }
    };

    verifyToken();

    return () => controller.abort();
  }, [token, logout, verificationAttempt]);

  const login = useCallback(async (username, password) => {
    setSessionError('');
    try {
      const res = await api.post('/api/auth/login', { username, password });
      if (res.data?.success) {
        const receivedToken = res.data.token;
        saveAdminToken(receivedToken);
        setToken(receivedToken);
        setAdmin(res.data.admin);
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || (err.code === 'ECONNABORTED' ? 'The sign-in service is taking longer than expected. Please try again.' : err.response ? 'Sign-in is unavailable. Please try again shortly.' : 'Could not reach the sign-in service. Please try again.'),
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
        saveAdminToken(receivedToken);
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
        saveAdminToken(res.data.token);
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
        sessionError,
        retrySession,
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
