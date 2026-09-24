'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(initialQuery);
  const isInitialMount = useRef(true);
  
  // 1. Typing -> 2. Debounce
  const debouncedValue = useDebounce(inputValue, 500);

  // Sync state if URL changes externally
  useEffect(() => {
    const currentQuery = searchParams.get('q') || '';
    if (currentQuery !== inputValue) {
      const timer = setTimeout(() => setInputValue(currentQuery), 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams, inputValue]);

  // 3. Update URL
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentQuery = searchParams.get('q') || '';
    if (debouncedValue !== currentQuery) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedValue) {
        params.set('q', debouncedValue);
        // Clear category when searching, since API cannot handle both
        params.delete('category');
      } else {
        params.delete('q');
      }
      // Reset to page 1
      params.set('page', '1');
      
      router.push(`?${params.toString()}`);
    }
  }, [debouncedValue, router, searchParams]);

  return (
    <div className="relative w-full max-w-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search products..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
      />
    </div>
  );
}
