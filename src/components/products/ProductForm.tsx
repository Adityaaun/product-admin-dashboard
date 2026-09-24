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
    <div className="bg-white shadow sm:rounded-lg p-6 max-w-2xl mx-auto">
      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Product successfully {isEdit ? 'updated' : 'created'}! Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      {apiError && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
            Title <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${errors.title ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'}`}
            />
            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
            Description <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${errors.description ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'}`}
            />
            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="number"
                step="0.01"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${errors.price ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'}`}
              />
              {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900">
              Stock <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="number"
                step="1"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${errors.stock ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'}`}
              />
              {errors.stock && <p className="mt-2 text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${errors.category ? 'ring-red-300 focus:ring-red-500' : 'ring-gray-300 focus:ring-blue-600'}`}
            />
            {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-4 border-t border-gray-200 pt-6">
          <Link
            href={isEdit ? `/products/${initialData?.id}` : '/products'}
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="inline-flex justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 flex-shrink-0"
          >
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
