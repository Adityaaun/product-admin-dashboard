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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Products Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">Manage your inventory, pricing, and product details.</p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
        >
          <svg className="-ml-0.5 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <CategoryFilter />
          <SortSelect />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-medium text-slate-500">Loading products...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-sm font-semibold text-slate-900">Failed to load data</h3>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
          <button
            onClick={retry}
            className="mt-6 inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
          >
            Try again
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
