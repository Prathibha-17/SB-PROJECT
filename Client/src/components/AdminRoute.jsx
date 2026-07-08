import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loader message="Verifying admin credentials..." />;
  }

  if (!user || !isAdmin) {
    // Redirect non-admins to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
