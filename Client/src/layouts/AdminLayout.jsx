import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="app-wrapper">
      {/* Navbar Shared with Customer Facing Pages */}
      <Navbar />

      {/* Main Admin Console Layout */}
      <div className="flex" style={{ paddingTop: 'var(--header-height)', minHeight: '100vh', boxSizing: 'border-box' }}>
        
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Console Workspace */}
        <main style={{
          flexGrow: 1,
          padding: '40px 32px',
          overflowY: 'auto',
          boxSizing: 'border-box',
          backgroundColor: 'var(--bg-primary)'
        }} id="admin-main-view">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #admin-main-view {
            padding: 24px 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
