/**
 * NeuroTraceX — Authentication Context
 *
 * Custom JWT-based auth stored in localStorage.
 * No Supabase Auth — we handle login/register ourselves.
 * Supabase is still used as the PostgreSQL database.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';

const TOKEN_KEY = 'ntx_auth_token';
const USER_KEY  = 'ntx_auth_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  // Sync JWT token into Axios headers whenever it changes
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [user]);

  /** Register a new account */
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/register', { name, email, password });
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Sign in with email + password */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Sign out — clear token and user */
  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export default AuthContext;
