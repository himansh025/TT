import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

const Pagination = memo(({ 
    currentPage = 1, 
    totalPages = 1, 
    onPageChange,
    showPageNumbers = true,
    edgePageCount = 1,
    middlePageCount = 3,
    showDots = true,
    totalItems = 0,
    itemsPerPage = 10,
    showItemsInfo = true,
    className = ''
  }) => {
    const getPageNumbers = useMemo(() => {
      if (totalPages <= middlePageCount + edgePageCount * 2) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
  
      let pages = [];
      // Add first pages
      for (let i = 1; i <= edgePageCount; i++) {
        pages.push(i);
      }
  
      // Add middle pages centered around current page
      const middleStart = Math.max(
        edgePageCount + 1,
        Math.min(currentPage - Math.floor(middlePageCount / 2), totalPages - middlePageCount - edgePageCount + 1)
      );
      
      if (showDots && middleStart > edgePageCount + 1) {
        pages.push('...');
      }
  
      for (let i = 0; i < middlePageCount && middleStart + i <= totalPages - edgePageCount; i++) {
        pages.push(middleStart + i);
      }
  
      // Add last pages
      if (showDots && totalPages - edgePageCount > pages[pages.length - 1] + 1) {
        pages.push('...');
      }
  
      for (let i = totalPages - edgePageCount + 1; i <= totalPages; i++) {
        if (i > pages[pages.length - 1]) {
          pages.push(i);
        }
      }
  
      return pages;
    }, [currentPage, totalPages, edgePageCount, middlePageCount, showDots]);
  
    const goToPage = useCallback((page) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    }, [currentPage, totalPages, onPageChange]);
  
    return (
      <div className={`flex items-center justify-between ${className}`}>
        {showItemsInfo && (
          <div className="text-sm text-gray-500">
            Showing data {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {showPageNumbers && getPageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">...</span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 rounded-sm text-sm ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  });

  export default Pagination;