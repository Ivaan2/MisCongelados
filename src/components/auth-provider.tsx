'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingSpinner } from './loading-spinner';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes: string[] = ['/'];
const publicRoutes = ['/login'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = protectedRoutes.some(route => pathname === route);

    if (!user && isProtectedRoute) {
      router.push('/login');
    } else if (user && pathname === '/login') {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <LoadingSpinner />;
  }
  
  // To prevent flicker on protected routes before redirect
  const isProtectedRoute = protectedRoutes.some(route => pathname === route);
  if (!user && isProtectedRoute) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
