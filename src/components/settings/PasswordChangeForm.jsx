// src/components/settings/PasswordChangeForm.jsx
import React, { useState, useEffect } from 'react';
import { usePasswordChange } from '@/hooks/usePasswordChange';
import { Eye, EyeOff, Check, X, AlertCircle, Info } from 'lucide-react';

export default function PasswordChangeForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [currentPasswordTouched, setCurrentPasswordTouched] = useState(false);

  const { loading, error, success, handlePasswordChange, clearMessages, validatePassword } = usePasswordChange();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await handlePasswordChange(
      formData.currentPassword,
      formData.newPassword,
      formData.confirmPassword
    );

    if (result) {
      // Clear form on success
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setCurrentPasswordTouched(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error || success) {
      clearMessages();
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!formData.newPassword) return null;
    const errors = validatePassword(formData.newPassword);
    const strength = 4 - errors.length;
    return { strength, errors };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Change Password
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Update your password to keep your account secure
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>Password changed successfully!</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              onFocus={() => setCurrentPasswordTouched(true)}
              onBlur={() => setCurrentPasswordTouched(true)}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                currentPasswordTouched && !formData.currentPassword 
                  ? 'border-amber-400 dark:border-amber-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              required
              placeholder="Enter your current password"
              autoComplete="new-password"  
              data-lpignore="true"         
              data-form-type="other"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Message for empty current password */}
          {currentPasswordTouched && !formData.currentPassword && (
            <div className="mt-2 flex items-start space-x-2 text-sm text-amber-600 dark:text-amber-400">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Please enter your current password to proceed with the password change</span>
            </div>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.newPassword && passwordStrength && (
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.strength === 0 ? 'bg-red-500 w-1/4' :
                      passwordStrength.strength === 1 ? 'bg-orange-500 w-2/4' :
                      passwordStrength.strength === 2 ? 'bg-yellow-500 w-3/4' :
                      passwordStrength.strength === 3 ? 'bg-blue-500 w-full' :
                      'bg-green-500 w-full'
                    }`}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.strength < 2 ? 'text-red-500' :
                  passwordStrength.strength < 4 ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {passwordStrength.strength < 2 ? 'Weak' :
                   passwordStrength.strength < 4 ? 'Good' : 'Strong'}
                </span>
              </div>

              {passwordStrength.errors.length > 0 && (
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {passwordStrength.errors.map((error, index) => (
                    <li key={index} className="flex items-center">
                      <X className="h-3 w-3 text-red-500 mr-1" />
                      {error}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className="mt-1 flex items-center text-xs">
              {formData.newPassword === formData.confirmPassword ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <Check className="h-3 w-3 mr-1" />
                  Passwords match
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <X className="h-3 w-3 mr-1" />
                  Passwords do not match
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0CCE68] hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
}