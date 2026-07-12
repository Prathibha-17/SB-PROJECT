import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bookstore_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to parse cart items:", err);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('bookstore_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.bookId === book.id);
      const qtyToAdd = parseInt(quantity) || 1;
      
      if (existing) {
        // Limit to available book stock
        const newQty = Math.min(book.stock, existing.quantity + qtyToAdd);
        return prev.map(item => 
          item.bookId === book.id 
            ? { ...item, quantity: newQty } 
            : item
        );
      } else {
        return [...prev, {
          bookId: book.id,
          title: book.title,
          price: book.price,
          coverUrl: book.coverUrl,
          quantity: Math.min(book.stock, qtyToAdd),
          stock: book.stock
        }];
      }
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems(prev => prev.filter(item => item.bookId !== bookId));
  };

  const updateQuantity = (bookId, newQty, maxStock) => {
    const qty = parseInt(newQty);
    if (qty <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    // Ensure quantity doesn't exceed stock
    const sanitizedQty = maxStock !== undefined ? Math.min(maxStock, qty) : qty;
    
    setCartItems(prev => 
      prev.map(item => 
        item.bookId === bookId 
          ? { ...item, quantity: sanitizedQty } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = parseFloat(cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2));

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
