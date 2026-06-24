import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setUser(null);
    localStorage.removeItem('phoenix_user');
  }, []);

  useEffect(() => {
    // Verify session with backend on load
    const verifySession = async () => {
      const stored = localStorage.getItem('phoenix_user');
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        // Try to hit a protected endpoint to verify the token is valid
        const { data } = await api.get('/profile');
        if (data.success && data.data) {
          setUser(data.data);
          localStorage.setItem('phoenix_user', JSON.stringify(data.data));
        } else {
          clearAuth();
        }
      } catch {
        // Token expired and refresh also failed — clear everything
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [clearAuth]);

  const login = async (email, password, rememberMe = false) => {
    const { data } = await api.post('/auth/user/login', { email, password, rememberMe });
    return data; // returns { otpRequired: true, email, rememberMe } — tokens issued after OTP
  };

  const verifyOtp = async (email, otp, rememberMe = false) => {
    const { data } = await api.post('/auth/user/verify-otp', { email, otp, rememberMe });
    if (data.success) {
      const userData = data.data.user;
      setUser(userData);
      localStorage.setItem('phoenix_user', JSON.stringify(userData));
    }
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/user/logout');
    } catch {
      // Ignore logout errors
    }
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, verifyOtp, logout, isAuthenticated: !!user, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
