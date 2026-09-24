'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '@/api/products';
import { Product } from '@/types/product';
import ProductForm from '@/components/products/ProductForm';
import { useProductMutations } from '@/context/ProductMutationsContext';
import Link from 'next/link';
import axios from 'axios';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { editedProducts, deletedProductIds, addedProducts } = useProductMutations();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      if (deletedProductIds[id]) {
        setError('NOT_FOUND');
        setLoading(false);
        return;
      }

      // If it's a newly added product that doesn't exist on server yet
      const addedProduct = addedProducts.find(p => String(p.id) === id);
      if (addedProduct) {
        setProduct(editedProducts[id] ? { ...addedProduct, ...editedProducts[id] } : addedProduct);
        setLoading(false);
        return;
      }

      try {
        const data = await getProductById(id);
        const finalData = editedProducts[id] ? { ...data, ...editedProducts[id] } : data;
        setProduct(finalData);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('NOT_FOUND');
        } else {
          setError('Failed to load product for editing.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, editedProducts, deletedProductIds, addedProducts]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error === 'NOT_FOUND') {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">The product you are trying to edit does not exist or has been removed.</p>
        <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
          Back to Products
        </Link>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-red-600 font-medium mb-4">{error || 'An error occurred'}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href={`/products/${id}`} className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Product Details
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-6">
          Edit Product: {product.title}
        </h2>
        <ProductForm initialData={product} isEdit={true} />
      </div>
    </div>
  );
}
