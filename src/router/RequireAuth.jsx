import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';

export default function RequireAuth({ children }) {
  const user = getCurrentUser();
  const location = useLocation();
  if (!user) {
    // Redirect to login and preserve attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
