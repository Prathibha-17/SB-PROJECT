import React, { useState } from 'react';
import { useBooks } from '../context/BookContext';
import OrderCard from '../components/OrderCard';
import { ListOrdered, Filter, Search } from 'lucide-react';

const ManageOrders = () => {
  const { orders, updateOrderStatus } = useBooks();
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchId, setSearchId] = useState('');

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      alert("Failed to update order status: " + err.message);
    }
  };

  // Filter orders based on status & Search ID
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchId.toLowerCase()) || 
                          order.userName.toLowerCase().includes(searchId.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = ['All', 'Pending', 'Shipped', 'Delivered'];

  return (
    <div className="flex flex-col gap-lg animate-fade-in" style={{ padding: '20px 0' }}>
      
      {/* Header */}
      <div>
        <h1 className="section-title text-gradient" style={{ marginBottom: '4px' }}>Order Fulfillment</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Track orders, modify delivery status, and review customer shipping information.</p>
      </div>

      {/* Filter Row */}
      <div className="card grid grid-2" style={{
        padding: '24px',
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        gap: '24px',
        gridTemplateColumns: '1fr 1fr'
      }}>
        {/* Status Filter Tab Buttons */}
        <div className="flex flex-col gap-sm">
          <label className="form-label flex align-center gap-sm">
            <Filter size={14} />
            <span>FILTER BY STATUS:</span>
          </label>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)' }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Search ID / Customer Input */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label flex align-center gap-sm" htmlFor="order-search">
            <Search size={14} />
            <span>SEARCH BY ID / CUSTOMER:</span>
          </label>
          <input
            id="order-search"
            type="text"
            placeholder="e.g. ORD-9481 or Alex..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="form-input"
            style={{ padding: '8px 16px' }}
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="flex flex-col gap-lg">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              isAdmin={true}
              onUpdateStatus={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="card flex flex-col align-center justify-center gap-md" style={{
          textAlign: 'center', padding: '60px 20px', borderColor: 'var(--border-color)',
          backgroundColor: 'rgba(30, 30, 30, 0.3)'
        }}>
          <ListOrdered size={36} style={{ color: 'var(--text-muted)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No Matching Orders</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
            We couldn't find any orders matching status "{statusFilter}" or keyword "{searchId}".
          </p>
        </div>
      )}

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

export default ManageOrders;
