import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdminAuthenticated } from '../lib/adminAuth';

/**
 * Route guard for admin pages. Redirects unauthenticated visitors to the
 * admin login screen, remembering where they were trying to go.
 */
export default function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
