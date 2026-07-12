import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import SearchBar from '../components/SearchBar';
import { Plus, Edit2, Trash2, X, PlusCircle, Save } from 'lucide-react';

const ManageBooks = () => {
  const { books, categories, addBook, updateBook, deleteBook } = useBooks();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Control
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null); // null means "Add Mode", object means "Edit Mode"

  // Form Fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(categories[1] || 'Sci-Fi');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Check URL query parameters on mount to open Add Modal
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      openAddModal();
      // Clean query parameter from URL
      searchParams.delete('add');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  const openAddModal = () => {
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setCategory(categories[1] || 'Sci-Fi');
    setPrice('');
    setStock('');
    setCoverUrl('');
    setDescription('');
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category);
    setPrice(book.price.toString());
    setStock(book.stock.toString());
    setCoverUrl(book.coverUrl);
    setDescription(book.description);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !author || !price || !stock || !description) {
      setErrorMsg('Please populate all required fields');
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMsg('Price must be a valid positive number');
      return;
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      setErrorMsg('Stock must be a valid positive integer');
      return;
    }

    const payload = {
      title,
      author,
      category,
      price: parsedPrice,
      stock: parsedStock,
      coverUrl: coverUrl || undefined,
      description
    };

    try {
      if (editingBook) {
        // Edit Mode
        await updateBook(editingBook.id, payload);
      } else {
        // Add Mode
        await addBook(payload);
      }
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save book changes');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the book "${title}"?`)) {
      try {
        await deleteBook(id);
      } catch (err) {
        alert(err.message || 'Failed to delete book');
      }
    }
  };

  // Filter books matching search
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-lg animate-fade-in" style={{ padding: '20px 0' }}>
      
      {/* Header */}
      <div className="flex align-center justify-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-title text-gradient" style={{ marginBottom: '4px' }}>Inventory Database</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Create, read, update, and delete bookstore catalog items.</p>
        </div>
        
        <button onClick={openAddModal} className="btn btn-primary flex align-center gap-sm">
          <Plus size={18} />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Quick search catalog by title, author, category..." />
      </div>

      {/* Books Table */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                {/* Cover Column */}
                <td>
                  <img 
                    src={book.coverUrl} 
                    alt={book.title} 
                    style={{ width: '48px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} 
                  />
                </td>

                {/* Title Column */}
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{book.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {book.id}</div>
                </td>

                {/* Author Column */}
                <td>{book.author}</td>

                {/* Category Column */}
                <td>
                  <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                    {book.category}
                  </span>
                </td>

                {/* Price Column */}
                <td style={{ fontWeight: 600 }}>₹{book.price.toFixed(2)}</td>

                {/* Stock Column */}
                <td>
                  {book.stock <= 0 ? (
                    <span className="badge badge-danger">Sold Out</span>
                  ) : (
                    <span style={{ color: book.stock < 5 ? 'var(--warning)' : 'inherit' }}>
                      {book.stock} units
                    </span>
                  )}
                </td>

                {/* Actions Column */}
                <td>
                  <div className="flex align-center justify-center gap-sm">
                    <button 
                      onClick={() => openEditModal(book)}
                      className="btn btn-secondary btn-sm flex align-center justify-center"
                      style={{ padding: '8px', color: 'var(--text-secondary)' }}
                      title="Edit Book Details"
                      aria-label={`Edit details for ${book.title}`}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(book.id, book.title)}
                      className="btn btn-secondary btn-sm flex align-center justify-center"
                      style={{ padding: '8px', color: 'var(--text-muted)' }}
                      title="Delete Book Item"
                      aria-label={`Delete ${book.title}`}
                    >
                      <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal Overlay */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div className="flex align-center justify-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                {editingBook ? 'Edit Book Record' : 'Register New Book'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="modal-close" aria-label="Close dialog">
                <X size={20} />
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="badge badge-danger" style={{
                display: 'block', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center', textTransform: 'none', letterSpacing: 'none'
              }}>
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave}>
              {/* Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="book-title-input">Book Title *</label>
                <input
                  id="book-title-input"
                  type="text"
                  placeholder="e.g. Clean Code Foundations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {/* Author */}
              <div className="form-group">
                <label className="form-label" htmlFor="book-author-input">Author Name *</label>
                <input
                  id="book-author-input"
                  type="text"
                  placeholder="e.g. Robert C. Martin"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="book-category-select">Category Genre *</label>
                <select
                  id="book-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                  style={{ cursor: 'pointer' }}
                >
                  {categories.filter(c => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Price & Stock Row */}
              <div className="grid grid-2" style={{ gap: '16px', marginBottom: '8px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="book-price-input">Price (₹ INR) *</label>
                  <input
                    id="book-price-input"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 29.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="book-stock-input">Stock Quantity *</label>
                  <input
                    id="book-stock-input"
                    type="number"
                    placeholder="e.g. 10"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Cover URL */}
              <div className="form-group">
                <label className="form-label" htmlFor="book-cover-input">Book Cover URL (Optional)</label>
                <input
                  id="book-cover-input"
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Description */}
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label className="form-label" htmlFor="book-description-input">Summary Description *</label>
                <textarea
                  id="book-description-input"
                  placeholder="Provide a detailed book synopsis..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-md" style={{ justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex align-center gap-sm">
                  {editingBook ? <Save size={16} /> : <PlusCircle size={16} />}
                  <span>{editingBook ? 'Save Changes' : 'Register Book'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageBooks;
