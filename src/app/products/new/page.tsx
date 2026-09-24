'use client';

import ProductForm from '@/components/products/ProductForm';
import Link from 'next/link';

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/products" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-6">
          Add New Product
        </h2>
        <ProductForm />
      </div>
    </div>
  );
}
