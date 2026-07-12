import React from 'react';
import { Calendar, DollarSign, Package, Truck, User } from 'lucide-react';

const OrderCard = ({ order, isAdmin = false, onUpdateStatus }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'badge-warning';
      case 'Shipped': return 'badge-info';
      case 'Delivered': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="card" style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:align-center justify-between gap-md" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <div className="flex align-center gap-sm" style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ORDER ID:</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>{order.id}</span>
          </div>
          <div className="flex align-center gap-sm text-secondary" style={{ fontSize: '0.85rem' }}>
            <Calendar size={14} />
            <span>Ordered on {formatDate(order.date)}</span>
          </div>
        </div>

        <div className="flex align-center gap-md">
          {/* Status Badge */}
          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
            {order.status}
          </span>

          {/* Admin Status Changer */}
          {isAdmin && onUpdateStatus && (
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          )}
        </div>
      </div>

      {/* Main Order Content */}
      <div className="grid grid-2" style={{ gap: '24px' }}>
        {/* Ordered Books */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={16} />
            <span>Items Ordered</span>
          </h4>
          <div className="flex flex-col gap-sm">
            {order.items.map((item, index) => (
              <div key={index} className="flex align-center gap-md" style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <img 
                  src={item.coverUrl} 
                  alt={item.title} 
                  style={{ width: '40px', height: '52px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                />
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    ₹{item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="flex flex-col gap-lg">
          {/* Shipping Address */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={16} />
              <span>Shipping Details</span>
            </h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {isAdmin && (
                <p className="flex align-center gap-sm" style={{ marginBottom: '4px', color: 'var(--text-primary)' }}>
                  <User size={12} />
                  <span><strong>Customer:</strong> {order.userName}</span>
                </p>
              )}
              <p>{order.shippingDetails.address}</p>
              <p>{order.shippingDetails.city}, {order.shippingDetails.zipCode}</p>
              <p>Phone: {order.shippingDetails.phone}</p>
            </div>
          </div>

          {/* Grand Total */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '16px',
            borderTop: '1px dashed var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'between'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Grand Total:</span>
            <span className="flex align-center" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderCard;
