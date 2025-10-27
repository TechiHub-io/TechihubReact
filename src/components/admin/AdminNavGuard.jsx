// src/components/admin/AdminNavGuard.jsx
'use client';
import { useAdminAuth } from '@/hooks/useAdminAuth';

/**
 * Component that only renders its children if the user is a super admin
 * Useful for conditionally showing admin-only navigation items or buttons
 */
export default function AdminNavGuard({ children, fallback = null }) {
  const { isAdmin } = useAdminAuth();
  
  if (!isAdmin) {
    return fallback;
  }
  
  return children;
}

/**
 * Hook to check if current user should see admin features
 */
export function useAdminNavGuard() {
  const { isAdmin, isLoadingAuth } = useAdminAuth();
  
  return {
    showAdminFeatures: isAdmin,
    isLoading: isLoadingAuth
  };
}