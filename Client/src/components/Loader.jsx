import React from 'react';

const Loader = ({ message = 'Loading BookStore...' }) => {
  return (
    <div className="flex flex-col align-center justify-center gap-md" style={{ minHeight: '300px', width: '100%' }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid var(--accent-light)',
        borderTop: '4px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>
        {message}
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
