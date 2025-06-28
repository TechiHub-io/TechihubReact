// src/app/companies/invitations/[token]/page.js
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useNotification } from '@/hooks/useNotification';
import { Building2, Users, Calendar, Check, LogIn, UserPlus, X } from 'lucide-react';

export default function InvitationAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token;
  
  const { isAuthenticated, user, acceptInvitation, logout } = useStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    acceptInvitation: state.acceptInvitation,
    logout: state.logout
  }));
  
  const { showSuccess, showError } = useNotification();
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch invitation details - this doesn't need to exist as an endpoint
  // since we can't get invitation details without knowing the company_id
  // Instead, we'll handle this during the accept process
  useEffect(() => {
    // Just set loading to false since we'll handle validation during acceptance
    setLoading(false);
  }, [token]);

  // Handle accepting invitation (when user is logged in)
  const handleAcceptInvitation = async () => {
    if (!isAuthenticated) {
      showError('Please log in to accept this invitation');
      return;
    }

    setProcessing(true);
    
    try {
      // The acceptInvitation method uses the correct API endpoint:
      // POST /api/v1/companies/invitations/{token}/accept/
      const result = await acceptInvitation(token);
      
      // The API response should include invitation details
      showSuccess(`Successfully joined ${result.company_name || 'the company'}!`);
      
      // Redirect based on user type
      if (user.is_employer) {
        router.push('/dashboard/employer');
      } else {
        router.push('/dashboard/jobseeker');
      }
    } catch (error) {
      // Handle specific error cases
      if (error.message.includes('expired')) {
        setError('This invitation has expired');
      } else if (error.message.includes('already accepted')) {
        setError('This invitation has already been accepted');
      } else if (error.message.includes('different email')) {
        setError('This invitation is for a different email address');
      } else {
        setError(error.message || 'Failed to accept invitation');
      }
    } finally {
      setProcessing(false);
    }
  };

  // Handle logout (when wrong user is logged in)
  const handleLogout = () => {
    logout();
    // After logout, the user will see login/register options
  };

  // Handle login redirect
  const handleLogin = () => {
    // Store invitation token for after login
    sessionStorage.setItem('pending_invitation_token', token);
    router.push('/auth/login');
  };

  // Handle register redirect
  const handleRegister = () => {
    // Store invitation token for after registration
    sessionStorage.setItem('pending_invitation_token', token);
    router.push('/auth/register/employer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Invalid Invitation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-[#0CCE68] text-white rounded-lg hover:bg-[#0BBE58]"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#0CCE68]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-[#0CCE68]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              You've Been Invited!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join a company team on Techhub
            </p>
          </div>

          {/* Invitation Token Display (for debugging - remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
              Token: {token}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isAuthenticated ? (
              // User not logged in
              <>
                <button
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#0CCE68] text-white rounded-lg hover:bg-[#0BBE58] font-medium"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log in to Accept
                </button>
                
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?
                </div>
                
                <button
                  onClick={handleRegister}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account & Accept
                </button>
              </>
            ) : (
              // User is logged in - attempt to accept invitation
              <button
                onClick={handleAcceptInvitation}
                disabled={processing}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#0CCE68] text-white rounded-lg hover:bg-[#0BBE58] font-medium disabled:opacity-50"
              >
                {processing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {processing ? 'Accepting...' : 'Accept Invitation'}
              </button>
            )}

            {/* Alternative logout option if needed */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm"
              >
                Use a different account
              </button>
            )}
          </div>

          {/* Info Text */}
          <div className="text-center mt-6 text-xs text-gray-500 dark:text-gray-400">
            Click "Accept Invitation" to join the company team
          </div>
        </div>
      </div>
    </div>
  );
}