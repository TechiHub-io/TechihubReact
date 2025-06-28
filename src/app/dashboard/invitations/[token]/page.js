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

  // Fetch invitation details
  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
        const response = await fetch(`${API_URL}/companies/invitations/${token}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInvitation(data);
        } else {
          const errorData = await response.json();
          setError(errorData.detail || 'Invalid or expired invitation');
        }
      } catch (error) {
        setError('Failed to load invitation details');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInvitation();
    }
  }, [token]);

  // Handle accepting invitation (when user is logged in)
  const handleAcceptInvitation = async () => {
    if (!isAuthenticated) {
      showError('Please log in to accept this invitation');
      return;
    }

    // Check if logged-in user email matches invitation email
    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      showError(`This invitation is for ${invitation.email}. Please log out and log in with the correct account.`);
      return;
    }

    setProcessing(true);
    
    try {
      await acceptInvitation(token);
      showSuccess(`Successfully joined ${invitation.company_name}!`);
      router.push('/dashboard/employer');
    } catch (error) {
      showError(error.message || 'Failed to accept invitation');
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
    router.push(`/auth/login?email=${encodeURIComponent(invitation.email)}`);
  };

  // Handle register redirect
  const handleRegister = () => {
    // Store invitation token for after registration
    sessionStorage.setItem('pending_invitation_token', token);
    router.push(`/auth/register/employer?email=${encodeURIComponent(invitation.email)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }

  if (error || !invitation) {
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
            {error || 'This invitation link is invalid or has expired.'}
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
              Join {invitation.company_name} on Techhub
            </p>
          </div>

          {/* Invitation Details */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {invitation.company_name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Role: <span className="font-medium ml-1">{invitation.role_display}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

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
            ) : user.email.toLowerCase() === invitation.email.toLowerCase() ? (
              // Correct user is logged in
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
            ) : (
              // Wrong user is logged in
              <div className="space-y-3">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    This invitation is for <strong>{invitation.email}</strong> but you're logged in as <strong>{user.email}</strong>.
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  Log out and use correct account
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-xs text-gray-500 dark:text-gray-400">
            Invited by {invitation.invited_by_name}
          </div>
        </div>
      </div>
    </div>
  );
}