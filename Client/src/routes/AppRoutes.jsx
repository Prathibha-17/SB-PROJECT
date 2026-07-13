import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guard components
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

// Customer Facing Pages
import Home from '../pages/Home';
import Books from '../pages/Books';
import BookDetails from '../pages/BookDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Admin Facing Pages
import AdminDashboard from '../pages/AdminDashboard';
import ManageBooks from '../pages/ManageBooks';
import ManageOrders from '../pages/ManageOrders';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ========================================================
          PUBLIC CUSTOMER ROUTES
         ======================================================== */}
      <Route path="/" element={
        <MainLayout>
          <Home />
        </MainLayout>
      } />
      
      <Route path="/books" element={
        <MainLayout>
          <Books />
        </MainLayout>
      } />
      
      <Route path="/book/:id" element={
        <MainLayout>
          <BookDetails />
        </MainLayout>
      } />
      
      <Route path="/cart" element={
        <MainLayout>
          <Cart />
        </MainLayout>
      } />

      {/* ========================================================
          AUTHENTICATION ROUTES (Unprotected/redirected if already logged in)
         ======================================================== */}
      <Route path="/login" element={
        <MainLayout>
          <Login />
        </MainLayout>
      } />
      
      <Route path="/register" element={
        <MainLayout>
          <Register />
        </MainLayout>
      } />

      {/* ========================================================
          PROTECTED CUSTOMER ROUTES
         ======================================================== */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <MainLayout>
            <Checkout />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <MainLayout>
            <Profile />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* ========================================================
          ADMIN PROTECTED ROUTES
         ======================================================== */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </AdminRoute>
      } />
      
      <Route path="/admin/books" element={
        <AdminRoute>
          <AdminLayout>
            <ManageBooks />
          </AdminLayout>
        </AdminRoute>
      } />
      
      <Route path="/admin/orders" element={
        <AdminRoute>
          <AdminLayout>
            <ManageOrders />
          </AdminLayout>
        </AdminRoute>
      } />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
