import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { initialCategories } from '../services/dummyData';
import { useAuth } from './AuthContext';

const BookContext = createContext(null);

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const auth = useAuth();
  const user = auth ? auth.user : null;

  // Load books and orders when component mounts or user state changes
  useEffect(() => {
    loadAllData();
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    
    // 1. Fetch public books list
    try {
      const allBooks = await api.books.getAll();
      setBooks(allBooks);
      const cats = ['All', ...new Set(allBooks.map(b => b.category))];
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load books catalog:", err);
      setError(err.message || "Failed to load books");
    }

    // 2. Fetch orders list (requires token/admin auth)
    try {
      const token = localStorage.getItem('bookstore_token');
      if (token) {
        const allOrders = await api.orders.getAll();
        setOrders(allOrders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]); // Clean orders if fetch fails (e.g. not an admin)
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const allBooks = await api.books.getAll();
      setBooks(allBooks);
      const cats = ['All', ...new Set(allBooks.map(b => b.category))];
      setCategories(cats);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const allOrders = await api.orders.getAll();
      setOrders(allOrders);
    } catch (err) {
      console.error(err);
    }
  };

  const addBook = async (bookData) => {
    setLoading(true);
    try {
      const newBook = await api.books.create(bookData);
      setBooks(prev => {
        const updated = [newBook, ...prev];
        const cats = ['All', ...new Set(updated.map(b => b.category))];
        setCategories(cats);
        return updated;
      });
      return newBook;
    } catch (err) {
      setError(err.message || "Failed to add book");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id, bookData) => {
    setLoading(true);
    try {
      const updated = await api.books.update(id, bookData);
      setBooks(prev => {
        const list = prev.map(b => b.id === id ? updated : b);
        const cats = ['All', ...new Set(list.map(b => b.category))];
        setCategories(cats);
        return list;
      });
      return updated;
    } catch (err) {
      setError(err.message || "Failed to update book");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    setLoading(true);
    try {
      await api.books.delete(id);
      setBooks(prev => {
        const filtered = prev.filter(b => b.id !== id);
        const cats = ['All', ...new Set(filtered.map(b => b.category))];
        setCategories(cats);
        return filtered;
      });
    } catch (err) {
      setError(err.message || "Failed to delete book");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (orderData) => {
    setLoading(true);
    try {
      const newOrder = await api.orders.create(orderData);
      setOrders(prev => [newOrder, ...prev]);
      // Reload books to update stock values
      await fetchBooks();
      return newOrder;
    } catch (err) {
      setError(err.message || "Failed to place order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const updated = await api.orders.updateStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      return updated;
    } catch (err) {
      console.error("Failed to update status:", err);
      throw err;
    }
  };

  const value = {
    books,
    orders,
    categories,
    loading,
    error,
    fetchBooks,
    fetchOrders,
    addBook,
    updateBook,
    deleteBook,
    placeOrder,
    updateOrderStatus
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
