"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, signup as apiSignup, AuthUser, LoginResponse, logout as apiLogout, fetchCurrentUser } from '@/lib/appClient';
import { ToastProvider } from '@/context/ToastProvider';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (payload: { firstName?: string; lastName?: string; username: string; email?: string; password: string; }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem('shopeasy_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem('shopeasy_token'); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (token) localStorage.setItem('shopeasy_token', token); else localStorage.removeItem('shopeasy_token');
    } catch {}
  }, [token]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem('shopeasy_user', JSON.stringify(user)); else localStorage.removeItem('shopeasy_user');
    } catch {}
  }, [user]);

  // When a token is present try to fetch the authoritative user profile from the API
  useEffect(() => {
    let mounted = true;
    const populate = async () => {
      if (!token) return;
      try {
        const u = await fetchCurrentUser(token);
        if (mounted) setUser(u);
      } catch (e) {
        // If token invalid or fetch fails, clear stored auth
        if (mounted) {
          setToken(null);
          setUser(null);
        }
      }
    };
    populate();
    return () => { mounted = false; };
  }, [token]);

  const doLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res: LoginResponse = await apiLogin(username, password);
      // map dummyjson response
      const mappedUser = res.id ? {
        id: res.id,
        firstName: res.firstName,
        lastName: res.lastName,
        username: res.username,
        email: res.email,
        image: res.image,
      } : null;
      setToken(res.accessToken || null);
      setUser(mappedUser as any);
    } finally {
      setLoading(false);
    }
  };

  const doSignup = async (payload: { firstName?: string; lastName?: string; username: string; email?: string; password: string; }) => {
    setLoading(true);
    try {
      const u = await apiSignup(payload);
      // Note: dummyjson returns created user; no token. We'll auto-login using username/password to obtain token.
      await doLogin(payload.username, payload.password);
    } finally {
      setLoading(false);
    }
  };

  const doLogout = () => {
    apiLogout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login: doLogin, signup: doSignup, logout: doLogout }}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
