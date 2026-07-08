import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import OrderCard from '../components/OrderCard';
import { BookOpen, Users, ShoppingBag, DollarSign, ArrowRight, ShieldCheck, Plus, ListOrdered } from 'lucide-react';

const AdminDashboard = () => {
  const { books, orders, updateOrderStatus } = useBooks();
  const [totalUsers, setTotalUsers] = useState(0);

  // Retrieve user counts from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('bookstore_users');
    if (savedUsers) {
      try {
        setTotalUsers(JSON.parse(savedUsers).length);
      } catch (e) {
        setTotalUsers(2); // Fallback
      }
    }
  }, []);

  // Compute stats
  const totalBooksCount = books.length;
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Take the 3 most recent orders
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="flex flex-col gap-lg animate-fade-in" style={{ padding: '20px 0' }}>
      
      {/* Title */}
      <div className="flex align-center justify-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-title text-gradient" style={{ marginBottom: '4px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Real-time bookstore stats, catalog health, and order fulfillment status.</p>
        </div>
        
        <div className="flex gap-sm">
          <Link to="/admin/books" className="btn btn-secondary btn-sm flex align-center gap-sm">
            <BookOpen size={16} />
            <span>Manage Catalog</span>
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm flex align-center gap-sm">
            <ListOrdered size={16} />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-4" style={{ gap: '20px' }}>
        
        {/* Metric: Total Books */}
        <div className="card flex align-center gap-lg" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BookOpen size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Total Books</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{totalBooksCount}</span>
          </div>
        </div>

        {/* Metric: Total Users */}
        <div className="card flex align-center gap-lg" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--info)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Total Users</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{totalUsers}</span>
          </div>
        </div>

        {/* Metric: Total Orders */}
        <div className="card flex align-center gap-lg" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Total Orders</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{totalOrdersCount}</span>
          </div>
        </div>

        {/* Metric: Total Revenue */}
        <div className="card flex align-center gap-lg" style={{ padding: '24px', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Total Revenue</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>₹{totalRevenue.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Grid: Quick Actions & Recent Orders */}
      <div className="grid grid-3" style={{ gap: '32px', gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
        
        {/* Quick Tools Box */}
        <div className="card flex flex-col gap-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} style={{ color: 'var(--accent)' }} />
            <span>Quick Console Tools</span>
          </h3>
          
          <div className="flex flex-col gap-md">
            <Link to="/admin/books?add=true" className="btn btn-primary flex align-center justify-between" style={{ padding: '12px 16px', fontSize: '0.9rem' }}>
              <span className="flex align-center gap-sm">
                <Plus size={16} /> Add Book Item
              </span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/admin/orders" className="btn btn-secondary flex align-center justify-between" style={{ padding: '12px 16px', fontSize: '0.9rem' }}>
              <span>View All Order Receipts</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="flex flex-col gap-md">
          <div className="flex align-center justify-between">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Orders</h3>
            <Link to="/admin/orders" className="flex align-center gap-sm text-secondary" style={{ fontSize: '0.85rem' }}>
              <span>Manage all orders</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="flex flex-col gap-lg">
              {recentOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  isAdmin={true} 
                  onUpdateStatus={updateOrderStatus} 
                />
              ))}
            </div>
          ) : (
            <div className="card flex flex-col align-center justify-center gap-md" style={{
              textAlign: 'center', padding: '60px 20px', borderColor: 'var(--border-color)'
            }}>
              <p style={{ color: 'var(--text-muted)' }}>No purchases have been logged yet.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
