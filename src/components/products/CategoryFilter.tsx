'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCategories } from '@/api/categories';
import { Category } from '@/types/product';

export default function CategoryFilter() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || '';
  const currentQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        console.error('Failed to load categories');
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newCategory) {
      params.set('category', newCategory);
      // API cannot handle both search and category filter at the same time
      params.delete('q');
    } else {
      params.delete('category');
    }
    
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={currentCategory}
      onChange={handleChange}
      disabled={!!currentQuery}
      title={currentQuery ? "Clear search to filter by category" : "Filter by category"}
      className="block w-full sm:w-48 rounded-xl border-0 py-2.5 pl-4 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all bg-slate-50 hover:bg-white focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.slug} value={cat.slug}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
