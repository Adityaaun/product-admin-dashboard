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
      className="block w-full sm:w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:bg-gray-100"
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
