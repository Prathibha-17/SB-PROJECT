import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingBag, ShieldAlert } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minHeight: 'calc(100vh - var(--header-height))',
      position: 'sticky',
      top: 'var(--header-height)',
      height: 'calc(100vh - var(--header-height))',
      flexShrink: 0
    }} id="admin-sidebar">
      {/* Title */}
      <div className="flex align-center gap-sm" style={{ padding: '8px 12px 16px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
        <ShieldAlert style={{ color: 'var(--accent)' }} size={20} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
          Admin Controls
        </span>
      </div>

      {/* Nav Items */}
      <NavLink
        to="/admin"
        end
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.95rem',
          fontWeight: 500,
          backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
          color: isActive ? 'var(--accent-hover)' : 'var(--text-secondary)',
          transition: 'all var(--transition-fast)'
        })}
        className="sidebar-link"
      >
        <LayoutDashboard size={18} />
        <span>Dashboard Stats</span>
      </NavLink>

      <NavLink
        to="/admin/books"
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.95rem',
          fontWeight: 500,
          backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
          color: isActive ? 'var(--accent-hover)' : 'var(--text-secondary)',
          transition: 'all var(--transition-fast)'
        })}
        className="sidebar-link"
      >
        <BookOpen size={18} />
        <span>Manage Books</span>
      </NavLink>

      <NavLink
        to="/admin/orders"
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.95rem',
          fontWeight: 500,
          backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
          color: isActive ? 'var(--accent-hover)' : 'var(--text-secondary)',
          transition: 'all var(--transition-fast)'
        })}
        className="sidebar-link"
      >
        <ShoppingBag size={18} />
        <span>Manage Orders</span>
      </NavLink>

      <style>{`
        @media (max-width: 768px) {
          #admin-sidebar {
            width: 70px !important;
            padding: 16px 8px !important;
            align-items: center;
          }
          #admin-sidebar span {
            display: none !important;
          }
          .sidebar-link {
            justify-content: center;
            padding: 12px !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
