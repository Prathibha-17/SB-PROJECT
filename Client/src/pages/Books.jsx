import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import { SlidersHorizontal, Trash2 } from 'lucide-react';

const Books = () => {
  const { books, categories, loading } = useBooks();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  // Sync category state with search query param (e.g. /books?category=Sci-Fi)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
    // Reset page on filter change
    setCurrentPage(1);
  }, [searchParams, categories]);

  // Reset pagination on search change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Change category URL param
  const handleCategorySelect = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  // Filtered books
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination math
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  if (loading) {
    return <Loader message="Opening catalog shelves..." />;
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '20px' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="section-title text-gradient">Explore Our Collection</h1>
        <p className="section-subtitle" style={{ marginBottom: 0 }}>Browse through books across multiple genres and pick your next read.</p>
      </div>

      {/* Filter Toolbar Card */}
      <div className="card" style={{
        padding: '24px',
        marginBottom: '32px',
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Row 1: Search & Reset */}
        <div className="flex flex-col md:flex-row gap-md align-center justify-between">
          <div style={{ flexGrow: 1, width: '100%' }}>
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>
          {(searchQuery || selectedCategory !== 'All') && (
            <button 
              onClick={handleResetFilters} 
              className="btn btn-secondary flex align-center gap-sm"
              style={{ width: '100%', mdWidth: 'auto', justifySelf: 'flex-end' }}
            >
              <Trash2 size={16} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Row 2: Category Chips */}
        <div className="flex flex-col gap-sm">
          <div className="flex align-center gap-sm" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
            <SlidersHorizontal size={14} />
            <span>CATEGORIES:</span>
          </div>
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect} 
          />
        </div>
      </div>

      {/* Results Section */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Showing <strong>{indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredBooks.length)}</strong> of <strong>{filteredBooks.length}</strong> books
        </p>
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <>
          <div className="grid grid-3">
            {currentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        </>
      ) : (
        <div className="card flex flex-col align-center justify-center gap-md" style={{
          textAlign: 'center',
          padding: '60px 20px',
          borderColor: 'var(--border-color)',
          backgroundColor: 'rgba(30, 30, 30, 0.3)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-secondary)' }}>No Books Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
            We couldn't find any books matching "{searchQuery}" in the category "{selectedCategory}". Please try adjusting your filters or search keywords.
          </p>
          <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Books;
