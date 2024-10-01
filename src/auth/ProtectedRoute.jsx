import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, currentUser } = useAuth();

  // Check if the user is authenticated and has an allowed role
  const hasAccess = isAuthenticated && allowedRoles.includes(currentUser?.role);

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  if (!hasAccess) {
    // If the user is authenticated but doesn't have access, redirect to home or another page
    return <Navigate to="/" />;
  }

  // If both authenticated and authorized, render the element
  return element;
};

export default ProtectedRoute;
