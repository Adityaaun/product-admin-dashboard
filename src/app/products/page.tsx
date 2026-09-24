'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProductsFetch } from '@/hooks/useProductsFetch';
import SearchBar from '@/components/products/SearchBar';
import CategoryFilter from '@/components/products/CategoryFilter';
import SortSelect from '@/components/products/SortSelect';
import ProductList from '@/components/products/ProductList';
import Pagination from '@/components/products/Pagination';
import Link from 'next/link';

function ProductsDashboard() {
  const searchParams = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || '';
  
  // Safe parsing for page and limit to prevent invalid values crashing the app
  const parsedPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  
  const parsedLimit = parseInt(searchParams.get('limit') || '10', 10);
  const limit = isNaN(parsedLimit) || ![10, 20, 50].includes(parsedLimit) ? 10 : parsedLimit;

  const { products, total, loading, error, retry } = useProductsFetch(
    query, category, sortBy, order, page, limit
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Products
        </h2>
        <Link
          href="/products/new"
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <CategoryFilter />
          <SortSelect />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 bg-white rounded-lg shadow">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={retry}
            className="mt-4 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <ProductList products={products} />
          {total > 0 && <Pagination total={total} limit={limit} page={page} />}
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div></div>}>
      <ProductsDashboard />
    </Suspense>
  );
}
