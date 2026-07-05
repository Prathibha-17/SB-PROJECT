import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import { Star, ShoppingCart, ArrowLeft, ShieldAlert, Award, RefreshCcw } from 'lucide-react';
import api from '../services/api';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const details = await api.books.getById(id);
        setBook(details);
      } catch (err) {
        console.error(err);
        setError("We couldn't locate this book in our database.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleIncrement = () => {
    if (quantity < book.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (book && book.stock > 0) {
      addToCart(book, quantity);
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 3000);
    }
  };

  if (loading) return <Loader message="Opening book details page..." />;

  if (error || !book) {
    return (
      <div className="container flex flex-col align-center justify-center gap-md animate-fade-in" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <ShieldAlert size={48} style={{ color: 'var(--danger)' }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Book Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>{error || "The book could not be loaded."}</p>
        <Link to="/books" className="btn btn-primary btn-sm flex align-center gap-sm">
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = book.stock <= 0;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '20px' }}>
      
      {/* Back Button */}
      <Link to="/books" className="flex align-center gap-sm text-secondary" style={{ marginBottom: '32px', fontSize: '0.95rem', width: 'fit-content' }}>
        <ArrowLeft size={16} />
        <span>Back to Books Catalog</span>
      </Link>

      {/* Details Grid */}
      <div className="grid grid-2" style={{ gap: '48px', alignItems: 'start' }}>
        
        {/* Left Side: Book Cover Card */}
        <div className="flex justify-center" style={{ position: 'sticky', top: '100px' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '380px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg), 0 20px 50px rgba(0,0,0,0.5)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            aspectRatio: '3/4'
          }}>
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            {isOutOfStock && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--danger)',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Details Info */}
        <div className="flex flex-col gap-lg">
          {/* Header Info */}
          <div>
            <span className="badge badge-accent" style={{ marginBottom: '16px' }}>{book.category}</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.1 }}>{book.title}</h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>by <strong style={{ color: 'var(--text-primary)' }}>{book.author}</strong></p>
            
            {/* Rating */}
            <div className="flex align-center gap-sm">
              <div className="flex align-center" style={{ color: 'var(--warning)' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < Math.floor(book.rating) ? "currentColor" : "none"} 
                    style={{ marginRight: '2px' }} 
                  />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>{book.rating.toFixed(1)}</span>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{book.reviews} customer reviews</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          {/* Pricing */}
          <div className="flex align-center gap-xl">
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>PRICE</span>
              <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                ₹{book.price.toFixed(2)}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>AVAILABILITY</span>
              {isOutOfStock ? (
                <span className="badge badge-danger" style={{ padding: '6px 12px' }}>Unavailable</span>
              ) : (
                <span className="badge badge-success" style={{ padding: '6px 12px' }}>
                  {book.stock} left in stock
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{book.description}</p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          {/* Add to Cart Actions */}
          {!isOutOfStock && (
            <div className="flex flex-col gap-sm">
              <div className="flex align-center gap-md" style={{ flexWrap: 'wrap' }}>
                {/* Quantity adjust */}
                <div className="flex align-center" style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  overflow: 'hidden'
                }}>
                  <button 
                    onClick={handleDecrement}
                    className="flex align-center justify-center"
                    style={{ width: '44px', height: '44px', fontWeight: 'bold', fontSize: '1.2rem' }}
                    aria-label="Decrease Quantity"
                  >
                    -
                  </button>
                  <span style={{ width: '44px', textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="flex align-center justify-center"
                    style={{ width: '44px', height: '44px', fontWeight: 'bold', fontSize: '1.2rem' }}
                    aria-label="Increase Quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-lg flex align-center gap-sm"
                  style={{ flexGrow: 1, padding: '14px 28px' }}
                >
                  <ShoppingCart size={18} />
                  <span>Add to Shopping Cart</span>
                </button>
              </div>

              {addedMessage && (
                <div className="badge badge-success animate-fade-in" style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'center',
                  textTransform: 'none',
                  letterSpacing: 'none',
                  marginTop: '8px'
                }}>
                  Successfully added {quantity} item(s) to your cart!
                </div>
              )}
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="grid grid-2" style={{ gap: '16px', marginTop: '16px' }}>
            <div className="flex align-center gap-sm" style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)'
            }}>
              <Award size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Original Edition Guarantee</span>
            </div>
            <div className="flex align-center gap-sm" style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)'
            }}>
              <RefreshCcw size={18} style={{ color: 'var(--success)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Easy Return within 7 Days</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookDetails;
