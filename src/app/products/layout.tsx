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
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Product Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </ProductMutationsProvider>
  );
}
