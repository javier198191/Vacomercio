'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api';

interface User {
  id: string;
  email: string;
  rol: string;
  telefono?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/auth/me');
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        if (userData.telefono === 'POR_DEFINIR') {
          router.push('/registro/completar-perfil');
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
