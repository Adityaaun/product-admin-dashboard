'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || '';
  const currentValue = sortBy ? `${sortBy}-${order}` : '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      const [newSortBy, newOrder] = value.split('-');
      params.set('sortBy', newSortBy);
      params.set('order', newOrder);
    } else {
      params.delete('sortBy');
      params.delete('order');
    }
    
    // Changing sort resets page to 1
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="block w-full sm:w-48 rounded-xl border-0 py-2.5 pl-4 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all bg-slate-50 hover:bg-white focus:bg-white cursor-pointer"
    >
      <option value="">Sort by (Default)</option>
      <option value="price-asc">Price (Low to High)</option>
      <option value="price-desc">Price (High to Low)</option>
      <option value="rating-desc">Rating (High to Low)</option>
      <option value="rating-asc">Rating (Low to High)</option>
      <option value="title-asc">Title (A-Z)</option>
      <option value="title-desc">Title (Z-A)</option>
    </select>
  );
}
