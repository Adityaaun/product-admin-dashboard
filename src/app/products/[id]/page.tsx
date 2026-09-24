'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById, deleteProduct } from '@/api/products';
import { Product } from '@/types/product';
import Link from 'next/link';
import axios from 'axios';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useProductMutations } from '@/context/ProductMutationsContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { editedProducts, deletedProductIds, addedProducts, deleteLocalProduct } = useProductMutations();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      if (deletedProductIds[id]) {
        setError('NOT_FOUND');
        setLoading(false);
        return;
      }
      
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
          setError('Failed to load product details.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, editedProducts, deletedProductIds, addedProducts]);

  const handleDelete = async () => {
    if (isDeleting) return; // duplicate request protection
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteProduct(id);
      deleteLocalProduct(id);
      setIsDeleteModalOpen(false);
      // Let the modal close smoothly before navigating away
      setTimeout(() => {
        router.push('/products');
      }, 150);
    } catch {
      setDeleteError('Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

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
        <p className="text-gray-500 mb-8 text-lg">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link href="/products" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>
        <div className="flex space-x-3">
          <Link
            href={`/products/${product.id}/edit`}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>

      {deleteError && (
        <div className="rounded-md bg-red-50 p-4 shadow-sm border border-red-200">
          <p className="text-sm font-medium text-red-800">{deleteError}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="p-6 bg-gray-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
            <div className="w-full h-64 sm:h-80 bg-white rounded-lg flex items-center justify-center mb-4 overflow-hidden border border-gray-200 p-2">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={product.images?.[0] || product.thumbnail || ''} alt={product.title} className="max-h-full object-contain" />
            </div>
            {(product.images?.length || 0) > 1 && (
              <div className="flex space-x-2 overflow-x-auto w-full py-2">
                {product.images?.map((img, idx) => (
                  <div key={idx} className="h-16 w-16 flex-shrink-0 bg-white border border-gray-200 rounded overflow-hidden p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${product.title} preview ${idx}`} className="h-full w-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase tracking-wider">
                {product.category.replace('-', ' ')}
              </span>
              <span className="flex items-center text-sm font-medium text-gray-700">
                <span className="text-yellow-400 mr-1 text-lg">★</span> {product.rating}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            {product.brand && <p className="text-sm text-gray-500 mb-4">Brand: {product.brand}</p>}
            
            <div className="flex items-baseline mb-6">
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="ml-3 text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-6 flex-1 text-sm sm:text-base">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Status</h4>
                <p className={`mt-1 text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>
              {product.sku && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</h4>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{product.sku}</p>
                </div>
              )}
              {product.warrantyInformation && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty</h4>
                  <p className="mt-1 text-sm text-gray-900">{product.warrantyInformation}</p>
                </div>
              )}
              {product.shippingInformation && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping</h4>
                  <p className="mt-1 text-sm text-gray-900">{product.shippingInformation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">Customer Reviews</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {product.reviews.map((review, idx) => (
              <li key={idx} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold shadow-sm">
                      {review.reviewerName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-bold text-gray-900">{review.reviewerName}</p>
                      <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                    <span className="text-yellow-400 text-sm tracking-widest">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic border-l-4 border-gray-200 pl-4 py-1">{review.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isConfirming={isDeleting}
      />
    </div>
  );
}
