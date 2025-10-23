"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, signup as apiSignup, LoginResponse, logout as apiLogout, fetchCurrentUser, FullUser } from '@/lib/appClient';
import { ToastProvider } from '@/context/ToastProvider';

interface AuthContextValue {
  user: FullUser | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (payload: { firstName?: string; lastName?: string; username: string; email?: string; password: string; }) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<FullUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FullUser | null>(() => {
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
        const _u = await fetchCurrentUser(token);
        if (mounted) setUser(_u);
      } catch {
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

  // allow updating the user locally (and persist)
  const updateUser = (patch: Partial<FullUser>) => {
    setUser(prev => {
      const next = { ...(prev || {}), ...patch } as FullUser;
      try {
        localStorage.setItem('shopeasy_user', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

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
      } as FullUser : null;
      // set in state
  setToken(res.accessToken || null);
  setUser(mappedUser);
      // try to merge any existing local cart with server cart for this user
      try {
        if (mappedUser?.id) {
          // lazy import to avoid cycles
          const cartModule = await import('@/lib/cart');
          await cartModule.mergeServerCartFromUser(mappedUser.id as number);
        }
      } catch {
        console.debug('[AuthProvider] merge server cart failed');
      }
      // also persist immediately to localStorage for visibility/debugging
      try {
        if (res.accessToken) localStorage.setItem('shopeasy_token', res.accessToken);
        if (mappedUser) localStorage.setItem('shopeasy_user', JSON.stringify(mappedUser));
        console.debug('[AuthProvider] persisted login to localStorage', { token: res.accessToken, user: mappedUser });
      } catch {
        console.debug('[AuthProvider] failed to persist login to localStorage');
      }
    } finally {
      setLoading(false);
    }
  };

  const doSignup = async (payload: { firstName?: string; lastName?: string; username: string; email?: string; password: string; }) => {
    setLoading(true);
    try {
        await apiSignup(payload);
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
    <AuthContext.Provider value={{ user, token, loading, login: doLogin, signup: doSignup, logout: doLogout, updateUser }}>
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
