'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, clearAccessToken } from '@/lib/auth';

import { ProductMutationsProvider } from '@/context/ProductMutationsContext';

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated()) {
      router.replace('/login');
    }
  }, [mounted, router]);

  const handleLogout = () => {
    clearAccessToken();
    router.replace('/login');
  };

  // Prevent rendering on server to avoid hydration mismatch
  // Also don't render content until we confirm authentication
  if (!mounted || !isAuthenticated()) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <ProductMutationsProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Nexgensis <span className="font-medium text-slate-500">Dashboard</span>
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </ProductMutationsProvider>
  );
}
