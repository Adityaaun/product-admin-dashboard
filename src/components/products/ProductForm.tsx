'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { addProduct, updateProduct } from '@/api/products';
import { useProductMutations } from '@/context/ProductMutationsContext';
import Link from 'next/link';

interface ProductFormProps {
  initialData?: Product;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { addLocalProduct, editLocalProduct } = useProductMutations();

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [stock, setStock] = useState(initialData?.stock?.toString() || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!category.trim()) newErrors.category = 'Category is required.';

    const parsedPrice = parseFloat(price);
    if (!price.trim() || isNaN(parsedPrice) || parsedPrice < 0) {
      newErrors.price = 'Price must be a valid positive number.';
    }

    const parsedStock = parseInt(stock, 10);
    if (!stock.trim() || isNaN(parsedStock) || parsedStock < 0 || !Number.isInteger(parseFloat(stock))) {
      newErrors.stock = 'Stock must be a valid positive integer.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccess(false);

    if (!validate()) return;
    if (isSubmitting) return; // Prevent duplicate requests

    setIsSubmitting(true);

    const productData = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      stock: parseInt(stock, 10),
    };

    try {
      if (isEdit && initialData) {
        const response = await updateProduct(initialData.id, productData);
        editLocalProduct(initialData.id, response);
        setSuccess(true);
        setTimeout(() => {
          router.push(`/products/${initialData.id}`);
        }, 1500);
      } else {
        const response = await addProduct(productData);
        // Ensure new ID exists if DummyJSON fails to generate one properly
        const newProduct = { ...response, id: response.id || Date.now() }; 
        addLocalProduct(newProduct);
        setSuccess(true);
        setTimeout(() => {
          router.push(`/products`);
        }, 1500);
      }
    } catch {
      setApiError('Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-sm border border-slate-200 sm:rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
      {success && (
        <div className="mb-6 rounded-xl bg-emerald-50 p-4 border border-emerald-100 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-emerald-800">
                Product successfully {isEdit ? 'updated' : 'created'}! Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      {apiError && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100 shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-red-800">{apiError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-slate-700">
            Title <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${errors.title ? 'ring-red-300 focus:ring-red-500 bg-red-50' : 'ring-slate-300 focus:ring-blue-600 bg-slate-50 focus:bg-white'}`}
            />
            {errors.title && <p className="mt-2 text-sm font-medium text-red-600">{errors.title}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-slate-700">
            Description <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${errors.description ? 'ring-red-300 focus:ring-red-500 bg-red-50' : 'ring-slate-300 focus:ring-blue-600 bg-slate-50 focus:bg-white'}`}
            />
            {errors.description && <p className="mt-2 text-sm font-medium text-red-600">{errors.description}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-slate-700">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="number"
                step="0.01"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${errors.price ? 'ring-red-300 focus:ring-red-500 bg-red-50' : 'ring-slate-300 focus:ring-blue-600 bg-slate-50 focus:bg-white'}`}
              />
              {errors.price && <p className="mt-2 text-sm font-medium text-red-600">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium leading-6 text-slate-700">
              Stock <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="number"
                step="1"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={`block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${errors.stock ? 'ring-red-300 focus:ring-red-500 bg-red-50' : 'ring-slate-300 focus:ring-blue-600 bg-slate-50 focus:bg-white'}`}
              />
              {errors.stock && <p className="mt-2 text-sm font-medium text-red-600">{errors.stock}</p>}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium leading-6 text-slate-700">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all ${errors.category ? 'ring-red-300 focus:ring-red-500 bg-red-50' : 'ring-slate-300 focus:ring-blue-600 bg-slate-50 focus:bg-white'}`}
            />
            {errors.category && <p className="mt-2 text-sm font-medium text-red-600">{errors.category}</p>}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-x-4 border-t border-slate-200 pt-6">
          <Link
            href={isEdit ? `/products/${initialData?.id}` : '/products'}
            className="text-sm font-semibold leading-6 text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="inline-flex justify-center items-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 disabled:cursor-not-allowed flex-shrink-0 transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
