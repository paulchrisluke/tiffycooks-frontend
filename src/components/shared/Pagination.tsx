'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center space-x-2 my-8">
      {currentPage > 1 && (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
        >
          Previous
        </Link>
      )}
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isCurrentPage = page === currentPage;
        
        return (
          <Link
            key={page}
            href={createPageURL(page)}
            className={`px-4 py-2 text-sm border rounded ${
              isCurrentPage
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
        >
          Next
        </Link>
      )}
    </div>
  );
}

export default Pagination; 