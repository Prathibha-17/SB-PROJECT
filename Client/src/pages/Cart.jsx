import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ArrowRight, ShoppingCart, BookOpen } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container flex flex-col align-center justify-center gap-md animate-fade-in" style={{
        padding: '80px 20px',
        textAlign: 'center',
        minHeight: 'calc(100vh - var(--header-height) - 150px)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <ShoppingCart size={32} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '16px' }}>
          It looks like you haven't added any books to your shopping cart yet. Start exploring our catalog to find your next great read.
        </p>
        <Link to="/books" className="btn btn-primary">
          <BookOpen size={16} />
          <span>Browse Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '20px' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="section-title text-gradient">Your Shopping Cart</h1>
        <p className="section-subtitle" style={{ marginBottom: 0 }}>You have selected {cartCount} book(s) to purchase.</p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-3" style={{ gap: '32px', gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
        
        {/* Left Side: Cart Items Table/List */}
        <div className="flex flex-col gap-md">
          {cartItems.map((item) => (
            <div key={item.bookId} className="card flex align-center gap-lg" style={{
              padding: '20px',
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              flexWrap: 'wrap'
            }}>
              {/* Cover Thumbnail */}
              <Link to={`/book/${item.bookId}`} style={{ display: 'block', flexShrink: 0 }}>
                <img 
                  src={item.coverUrl} 
                  alt={item.title} 
                  style={{
                    width: '64px',
                    height: '84px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)'
                  }} 
                />
              </Link>

              {/* Title & Author */}
              <div style={{ flexGrow: 1, minWidth: '150px' }}>
                <Link to={`/book/${item.bookId}`}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {item.title}
                  </h3>
                </Link>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Unit Price: ₹{item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex align-center gap-sm" style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                padding: '4px'
              }}>
                <button
                  onClick={() => updateQuantity(item.bookId, item.quantity - 1, item.stock)}
                  className="flex align-center justify-center"
                  style={{ width: '28px', height: '28px', fontSize: '1.1rem' }}
                  aria-label="Decrease Quantity"
                >
                  <Minus size={14} />
                </button>
                <span style={{ width: '32px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.bookId, item.quantity + 1, item.stock)}
                  className="flex align-center justify-center"
                  style={{ width: '28px', height: '28px', fontSize: '1.1rem' }}
                  aria-label="Increase Quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Subtotal */}
              <div style={{ minWidth: '80px', textAlign: 'right' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>

              {/* Remove Action */}
              <button
                onClick={() => removeFromCart(item.bookId)}
                className="flex align-center justify-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)',
                  border: '1px solid transparent',
                  transition: 'var(--transition-fast)'
                }}
                className="btn-remove-cart"
                title="Remove Item"
                aria-label={`Remove ${item.title} from cart`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary Sidebar */}
        <div className="card flex flex-col gap-lg" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
          position: 'sticky',
          top: '100px'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Order Summary
          </h2>

          <div className="flex flex-col gap-md" style={{ fontSize: '0.95rem' }}>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal ({cartCount} items)</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Tax</span>
              <span>₹0.00</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          <div className="flex justify-between align-center" style={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Order Total</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              ₹{cartTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="btn btn-primary btn-lg flex align-center justify-center gap-sm"
            style={{ width: '100%' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>

          <Link to="/books" style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            Continue Shopping
          </Link>
        </div>

      </div>

      <style>{`
        .btn-remove-cart:hover {
          color: var(--danger) !important;
          background-color: var(--danger-light);
          border-color: rgba(239, 68, 68, 0.2) !important;
        }
        @media (max-width: 1024px) {
          .grid-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
