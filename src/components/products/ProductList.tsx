import { Product } from '@/types/product';
import Link from 'next/link';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow mt-4">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">Adjust your search or filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Mobile Cards (hidden on medium screens and up) */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="h-48 w-full bg-gray-100 flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.thumbnail} alt={product.title} className="h-full object-contain" />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">★ {product.rating}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock} in stock
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href={`/products/${product.id}`}
                  className="block w-full text-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (hidden on small screens) */}
      <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Image</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="h-10 w-10 object-contain rounded" src={product.thumbnail} alt="" />
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                  {product.title}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{product.category.replace('-', ' ')}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">★ {product.rating}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${product.stock > 0 ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Link href={`/products/${product.id}`} className="text-blue-600 hover:text-blue-900">
                    View<span className="sr-only">, {product.title}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
