import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  totalCount, 
  pageSize, 
  startIndex, 
  endIndex, 
  onPageChange, 
  onPageSizeChange,
  loading = false 
}) => {
  const generatePageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
      {/* Results Info */}
      <div className="text-muted">
        {totalCount > 0 ? (
          <>
            Showing {startIndex} to {endIndex} of {totalCount} results
          </>
        ) : (
          'No results found'
        )}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex align-items-center gap-3">
        {/* Page Size Selector */}
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="pageSize" className="form-label mb-0 text-muted small">
            Show:
          </label>
          <select
            id="pageSize"
            className="form-select form-select-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            disabled={loading}
            style={{ width: 'auto' }}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>

        {/* Page Navigation */}
        <nav aria-label="Products pagination">
          <ul className="pagination pagination-sm mb-0">
            {/* Previous Button */}
            <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={handlePrevious}
                disabled={currentPage <= 1 || loading}
                aria-label="Previous"
              >
                <i className="bi bi-chevron-left"></i>
              </button>
            </li>

            {/* First Page */}
            {generatePageNumbers()[0] > 1 && (
              <>
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => onPageChange(1)}
                    disabled={loading}
                  >
                    1
                  </button>
                </li>
                {generatePageNumbers()[0] > 2 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
              </>
            )}

            {/* Page Numbers */}
            {generatePageNumbers().map(pageNum => (
              <li 
                key={pageNum} 
                className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </button>
              </li>
            ))}

            {/* Last Page */}
            {generatePageNumbers()[generatePageNumbers().length - 1] < totalPages && (
              <>
                {generatePageNumbers()[generatePageNumbers().length - 1] < totalPages - 1 && (
                  <li className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                )}
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => onPageChange(totalPages)}
                    disabled={loading}
                  >
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            {/* Next Button */}
            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={handleNext}
                disabled={currentPage >= totalPages || loading}
                aria-label="Next"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
