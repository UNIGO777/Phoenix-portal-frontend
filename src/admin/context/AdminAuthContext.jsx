import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem('phoenix_admin');
  }, []);

  useEffect(() => {
    const verifySession = async () => {
      const stored = localStorage.getItem('phoenix_admin');
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        // Verify token is valid by hitting admin profile endpoint
        const { data } = await api.get('/admin/profile');
        if (data.success && data.data) {
          setAdmin(data.data);
          localStorage.setItem('phoenix_admin', JSON.stringify(data.data));
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

  const login = async (email, password) => {
    const { data } = await api.post('/auth/admin/login', { email, password });
    if (data.success) {
      const adminData = data.data.admin;
      setAdmin(adminData);
      localStorage.setItem('phoenix_admin', JSON.stringify(adminData));
    }
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/admin/logout');
    } catch {
      // Ignore logout errors
    }
    clearAuth();
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin, clearAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
