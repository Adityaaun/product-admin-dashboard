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
      <div className="md:hidden space-y-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="h-56 w-full bg-slate-50 flex items-center justify-center p-6 border-b border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.thumbnail} alt={product.title} className="h-full object-contain mix-blend-multiply" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{product.title}</h3>
              <p className="text-sm font-medium text-blue-600 mb-3 capitalize">{product.category.replace('-', ' ')}</p>
              <div className="mt-auto flex justify-between items-center mb-5">
                <span className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    <svg className="h-4 w-4 text-amber-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {product.rating}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {product.stock} left
                  </span>
                </div>
              </div>
              <div className="mt-auto">
                <Link
                  href={`/products/${product.id}`}
                  className="block w-full text-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (hidden on small screens) */}
      <div className="hidden md:block bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/50">
            <tr>
              <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
              <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
              <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
              <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Rating</th>
              <th scope="col" className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Stock</th>
              <th scope="col" className="relative py-4 pl-3 pr-6 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="whitespace-nowrap py-4 pl-6 pr-3">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex-shrink-0 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-1 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="max-h-full max-w-full object-contain mix-blend-multiply" src={product.thumbnail} alt="" />
                    </div>
                    <div className="font-semibold text-slate-900 truncate max-w-[200px] lg:max-w-[300px]">
                      {product.title}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-500 capitalize">{product.category.replace('-', ' ')}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-slate-900">${product.price.toFixed(2)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <div className="flex items-center font-medium text-slate-700">
                    <svg className="h-4 w-4 text-amber-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {product.rating}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                  <Link 
                    href={`/products/${product.id}`} 
                    className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    View
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
