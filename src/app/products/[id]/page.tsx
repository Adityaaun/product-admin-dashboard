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
      <div className="flex flex-col items-center justify-center py-24 bg-white shadow-sm border border-slate-200 rounded-2xl">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-sm font-medium text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (error === 'NOT_FOUND') {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 mb-6 border border-slate-100">
          <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Product Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">The product you are looking for does not exist, has been removed, or is currently unavailable.</p>
        <Link href="/products" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-500 transition-all">
          Back to Products
        </Link>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-6 border border-red-100">
          <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-slate-900 font-bold text-xl mb-2">Failed to load product</p>
        <p className="text-red-600 font-medium mb-8 text-sm">{error || 'An unexpected error occurred'}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <Link href="/products" className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center transition-colors px-2">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <div className="flex space-x-3">
          <Link
            href={`/products/${product.id}/edit`}
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
          >
            <svg className="mr-2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Product
          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center justify-center rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-100 transition-all"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {deleteError && (
        <div className="rounded-xl bg-red-50 p-4 shadow-sm border border-red-100 flex items-center gap-3">
          <svg className="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-red-800">{deleteError}</p>
        </div>
      )}

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="p-8 bg-slate-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
            <div className="w-full h-64 sm:h-80 bg-white rounded-2xl flex items-center justify-center mb-6 overflow-hidden border border-slate-100 shadow-sm p-4">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={product.images?.[0] || product.thumbnail || ''} alt={product.title} className="max-h-full object-contain mix-blend-multiply" />
            </div>
            {(product.images?.length || 0) > 1 && (
              <div className="flex space-x-3 overflow-x-auto w-full pb-2">
                {product.images?.map((img, idx) => (
                  <div key={idx} className="h-20 w-20 flex-shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden p-2 shadow-sm cursor-pointer hover:border-blue-400 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${product.title} preview ${idx}`} className="h-full w-full object-contain mix-blend-multiply" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-10 flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase tracking-wider">
                {product.category.replace('-', ' ')}
              </span>
              <span className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-700">
                <svg className="h-4 w-4 text-amber-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {product.rating}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-2">{product.title}</h1>
            {product.brand && <p className="text-sm font-medium text-slate-500 mb-6">Brand: <span className="text-slate-900">{product.brand}</span></p>}
            
            <div className="flex items-baseline mb-8">
              <span className="text-4xl sm:text-5xl font-black text-slate-900">${product.price.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="ml-4 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <p className="text-slate-600 mb-8 flex-1 text-sm sm:text-base leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-slate-100 pt-8 mt-auto">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Stock Status</h4>
                <p className={`text-sm font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>
              {product.sku && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">SKU</h4>
                  <p className="text-sm font-bold text-slate-900 font-mono">{product.sku}</p>
                </div>
              )}
              {product.warrantyInformation && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Warranty</h4>
                  <p className="text-sm font-medium text-slate-900">{product.warrantyInformation}</p>
                </div>
              )}
              {product.shippingInformation && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Shipping</h4>
                  <p className="text-sm font-medium text-slate-900">{product.shippingInformation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-slate-100 bg-white">
            <h3 className="text-lg font-bold leading-6 text-slate-900">Customer Reviews</h3>
          </div>
          <ul className="divide-y divide-slate-100">
            {product.reviews.map((review, idx) => (
              <li key={idx} className="p-6 sm:p-8 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shadow-sm">
                      {review.reviewerName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-bold text-slate-900">{review.reviewerName}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="text-amber-400 text-sm tracking-widest">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 italic border-l-2 border-slate-200 pl-4 py-1 ml-16">{review.comment}</p>
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
