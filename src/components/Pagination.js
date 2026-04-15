'use client'

import Link from 'next/link'

export default function Pagination({ currentPage, totalPages, basePath = '/' }) {
  const pages = []
  const maxVisible = 5
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages, startPage + maxVisible - 1)
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  const getPageUrl = (page) => {
    if (page === 1) return basePath
    return `${basePath}${basePath.endsWith('/') ? '' : '/'}page/${page}`
  }
  
  return (
    <div className="pagination">
      {currentPage > 1 && (
        <Link href={getPageUrl(currentPage - 1)} className="pagination-btn">
          ← Previous
        </Link>
      )}
      
      <div className="pagination-numbers">
        {startPage > 1 && (
          <>
            <Link href={getPageUrl(1)} className="pagination-number">
              1
            </Link>
            {startPage > 2 && <span className="pagination-dots">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`pagination-number ${page === currentPage ? 'active' : ''}`}
          >
            {page}
          </Link>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-dots">...</span>}
            <Link href={getPageUrl(totalPages)} className="pagination-number">
              {totalPages}
            </Link>
          </>
        )}
      </div>
      
      {currentPage < totalPages && (
        <Link href={getPageUrl(currentPage + 1)} className="pagination-btn">
          Next →
        </Link>
      )}
    </div>
  )
}
