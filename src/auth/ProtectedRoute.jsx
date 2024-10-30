import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const token = localStorage.getItem('authToken');

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const hasAccess = isAuthenticated && allowedRoles.includes(currentUser?.role);
  if (!hasAccess) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
