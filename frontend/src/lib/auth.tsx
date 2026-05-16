'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from './api';

interface User {
  id: number;
  username: string;
  email: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and get user profile
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Auth verification failed', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Protected routes enforcement
  useEffect(() => {
    if (!isLoading) {
      const protectedPaths = ['/dashboard', '/predict', '/patients'];
      const adminPaths = ['/admin'];
      const publicPaths = ['/login', '/register'];

      const isProtected = protectedPaths.some(p => pathname.startsWith(p));
      const isAdmin = adminPaths.some(p => pathname.startsWith(p));
      const isPublicOnly = publicPaths.some(p => pathname.startsWith(p));

      if (isProtected && !user) {
        router.push('/login');
      } else if (isAdmin && user?.role !== 'admin') {
        router.push('/dashboard');
      } else if (isPublicOnly && user) {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
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
