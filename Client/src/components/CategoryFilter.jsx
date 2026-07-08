import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      overflowX: 'auto',
      paddingBottom: '8px',
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none' // IE/Edge
    }} className="no-scrollbar">
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            {category}
          </button>
        );
      })}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;
