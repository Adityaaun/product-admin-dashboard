'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  total: number;
  limit: number;
  page: number;
}

export default function Pagination({ total, limit, page }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / limit) || 1;
  const safePage = Math.min(page, totalPages);
  const startItem = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const endItem = Math.min(safePage * limit, total);

  const updateUrl = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateUrl(newPage, limit);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    // Reset to page 1 when changing page size
    updateUrl(1, newLimit);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border border-slate-200 bg-white px-5 py-4 mt-6 rounded-2xl shadow-sm">
      <div className="flex sm:flex-1 sm:items-center sm:justify-between w-full">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{total === 0 ? 0 : startItem}</span> to{' '}
            <span className="font-semibold text-slate-900">{endItem}</span> of{' '}
            <span className="font-semibold text-slate-900">{total}</span>
          </p>
          <select
            value={limit}
            onChange={handleLimitChange}
            className="block w-28 rounded-lg border-0 py-1.5 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6 bg-slate-50 hover:bg-white cursor-pointer"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className="relative inline-flex items-center rounded-l-xl px-3 py-2 text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="relative inline-flex items-center px-5 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 bg-white focus:outline-offset-0 z-10">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages || total === 0}
              className="relative inline-flex items-center rounded-r-xl px-3 py-2 text-slate-500 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
