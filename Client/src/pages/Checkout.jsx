import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { MapPin, Phone, Building, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useBooks();
  const navigate = useNavigate();

  // Form states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !city || !zipCode || !phone) {
      setError('Please fill in all shipping fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = await placeOrder({
        userId: user.id,
        userName: user.name,
        items: cartItems.map(item => ({
          bookId: item.bookId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          coverUrl: item.coverUrl
        })),
        shippingDetails: {
          address,
          city,
          zipCode,
          phone
        },
        totalAmount: cartTotal
      });
      
      clearCart();
      setSuccessOrder(order);
    } catch (err) {
      console.error(err);
      setError('Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If order was successfully completed
  if (successOrder) {
    return (
      <div className="container flex flex-col align-center justify-center gap-md animate-fade-in" style={{
        padding: '80px 20px',
        textAlign: 'center',
        minHeight: 'calc(100vh - var(--header-height) - 150px)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--success-light)',
          color: 'var(--success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <CheckCircle2 size={44} />
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '24px', lineHeight: 1.6 }}>
          Thank you for shopping with us, <strong>{user.name}</strong>. Your order has been registered under ID <strong style={{ color: 'var(--text-primary)' }}>{successOrder.id}</strong> and is currently being processed.
        </p>
        
        <div className="flex gap-md" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/profile" className="btn btn-primary">
            <span>View Order History</span>
          </Link>
          <Link to="/" className="btn btn-secondary">
            <span>Go to Home Page</span>
          </Link>
        </div>

        <style>{`
          @keyframes scaleIn {
            0% { transform: scale(0); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // Handle empty checkout attempts
  if (cartItems.length === 0) {
    return (
      <div className="container flex flex-col align-center justify-center gap-md animate-fade-in" style={{
        padding: '60px 20px',
        textAlign: 'center',
        minHeight: 'calc(100vh - var(--header-height) - 150px)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Checkout is Unavailable</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '16px' }}>
          You don't have any items in your shopping cart to checkout.
        </p>
        <Link to="/books" className="btn btn-primary btn-sm">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '20px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="section-title text-gradient">Complete Your Order</h1>
        <p className="section-subtitle" style={{ marginBottom: 0 }}>Review items and specify shipping instructions.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-3" style={{ gap: '32px', gridTemplateColumns: '1.8fr 1.2fr', alignItems: 'start' }}>
        
        {/* Left Side: Shipping Form Card */}
        <div className="card" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Shipping Address
          </h2>

          {error && (
            <div className="badge badge-danger" style={{
              display: 'block',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center',
              textTransform: 'none',
              letterSpacing: 'none'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Street Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="address-input">Street Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="address-input"
                  type="text"
                  placeholder="e.g. 100 Main St, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={loading}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }}
                  required
                />
                <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* City & Zip Code in 2 Columns */}
            <div className="grid grid-2" style={{ gap: '16px', marginBottom: '8px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="city-input">City</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="city-input"
                    type="text"
                    placeholder="e.g. San Francisco"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={loading}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }}
                    required
                  />
                  <Building size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="zipcode-input">ZIP / Postal Code</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="zipcode-input"
                    type="text"
                    placeholder="e.g. 94105"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    disabled={loading}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }}
                    required
                  />
                  <Building size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label" htmlFor="phone-input">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="phone-input"
                  type="tel"
                  placeholder="e.g. +1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }}
                  required
                />
                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Payment Warning */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <ShieldCheck size={28} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span><strong>Cash on Delivery:</strong> For demonstration purposes, only COD is active. No actual transaction occurs.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', gap: '8px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
            >
              <span>{loading ? 'Processing Order...' : 'Place Secure Order'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Right Side: Order Review Card */}
        <div className="card flex flex-col gap-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Review Items
          </h2>

          {/* Book List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '260px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {cartItems.map((item) => (
              <div key={item.bookId} className="flex align-center gap-md" style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <img 
                  src={item.coverUrl} 
                  alt={item.title} 
                  style={{ width: '38px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                />
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Qty: {item.quantity}
                  </p>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          {/* Subtotals & Totals */}
          <div className="flex flex-col gap-sm" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <div className="flex justify-between">
              <span>Items Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span style={{ color: 'var(--success)' }}>FREE</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)', margin: '8px 0' }} />
            <div className="flex justify-between align-center" style={{ color: 'var(--text-primary)' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Grand Total</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

      </div>
      <style>{`
        @media (max-width: 1024px) {
          .grid-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
