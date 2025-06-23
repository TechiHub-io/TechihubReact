// src/hooks/usePasswordChange.js
import { useState } from 'react';
import { useStore } from './useZustandStore';

export function usePasswordChange() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { changePassword } = useStore(state => ({
    changePassword: state.changePassword
  }));

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    return errors;
  };

  const handlePasswordChange = async (currentPassword, newPassword, confirmPassword) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validation
    if (!currentPassword) {
      setError('Current password is required');
      setLoading(false);
      return false;
    }

    if (!newPassword || !confirmPassword) {
      setError('New password and confirmation are required');
      setLoading(false);
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return false;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      setLoading(false);
      return false;
    }

    // Password strength validation
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join('. '));
      setLoading(false);
      return false;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to change password');
      setLoading(false);
      return false;
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    handlePasswordChange,
    clearMessages,
    validatePassword
  };
}