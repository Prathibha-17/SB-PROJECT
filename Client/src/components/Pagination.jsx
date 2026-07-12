import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex align-center justify-center gap-sm" style={{ marginTop: '40px' }}>
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-secondary btn-sm flex align-center justify-center"
        style={{
          width: '38px',
          height: '38px',
          padding: 0,
          opacity: currentPage === 1 ? 0.4 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
        }}
        aria-label="Previous Page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {pages.map(page => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              width: '38px',
              height: '38px',
              padding: 0,
              borderRadius: 'var(--radius-md)'
            }}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-secondary btn-sm flex align-center justify-center"
        style={{
          width: '38px',
          height: '38px',
          padding: 0,
          opacity: currentPage === totalPages ? 0.4 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
        }}
        aria-label="Next Page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
