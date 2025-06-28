// src/app/dashboard/invitations/page.js
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/hooks/useZustandStore';
import { useNotification } from '@/hooks/useNotification';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Building2, Users, Calendar, Check, X } from 'lucide-react';

export default function InvitationsPage() {
  const router = useRouter();
  const { user } = useStore((state) => ({ user: state.user }));
  const { showSuccess, showError } = useNotification();
  
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingInvitation, setProcessingInvitation] = useState(null);

  useEffect(() => {
    // Get invitations from login response or fetch them
    const pendingInvitations = sessionStorage.getItem('pending_invitations');
    if (pendingInvitations) {
      setInvitations(JSON.parse(pendingInvitations));
      sessionStorage.removeItem('pending_invitations');
    }
    setLoading(false);
  }, []);

  const handleAcceptInvitation = async (invitation) => {
    setProcessingInvitation(invitation.id);
    
    try {
      const response = await fetch(`/api/v1/companies/invitations/${invitation.token}/accept/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        showSuccess(`Successfully joined ${invitation.company_name}!`);
        setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
        
        // If no more invitations, redirect to appropriate dashboard
        if (invitations.length === 1) {
          router.push('/dashboard/employer');
        }
      } else {
        const error = await response.json();
        showError(error.detail || 'Failed to accept invitation');
      }
    } catch (error) {
      showError('Failed to accept invitation');
    } finally {
      setProcessingInvitation(null);
    }
  };

  const handleDeclineInvitation = async (invitation) => {
    setProcessingInvitation(invitation.id);
    
    try {
      // You can add a decline endpoint or just remove from UI
      setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
      showSuccess('Invitation declined');
      
      // If no more invitations, redirect to appropriate dashboard
      if (invitations.length === 1) {
        router.push(user.is_employer ? '/dashboard/employer' : '/dashboard/jobseeker');
      }
    } catch (error) {
      showError('Failed to decline invitation');
    } finally {
      setProcessingInvitation(null);
    }
  };

  const handleSkipForNow = () => {
    router.push(user.is_employer ? '/dashboard/employer' : '/dashboard/jobseeker');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Company Invitations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You have {invitations.length} pending invitation(s) to join companies
          </p>
        </div>

        {invitations.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No pending invitations
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              All invitations have been processed
            </p>
            <button
              onClick={() => router.push('/dashboard/employer')}
              className="px-6 py-2 bg-[#0CCE68] text-white rounded-lg hover:bg-[#0BBE58]"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#0CCE68]/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-[#0CCE68]" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {invitation.company_name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Role: <span className="font-medium">{invitation.role}</span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Invited by: <span className="font-medium">{invitation.invited_by}</span>
                      </p>
                      
                      {invitation.expires_at && (
                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDeclineInvitation(invitation)}
                      disabled={processingInvitation === invitation.id}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      <X className="w-4 h-4 mr-1 inline" />
                      Decline
                    </button>
                    
                    <button
                      onClick={() => handleAcceptInvitation(invitation)}
                      disabled={processingInvitation === invitation.id}
                      className="px-4 py-2 bg-[#0CCE68] text-white rounded-lg hover:bg-[#0BBE58] disabled:opacity-50"
                    >
                      {processingInvitation === invitation.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-1"></div>
                      ) : (
                        <Check className="w-4 h-4 mr-1 inline" />
                      )}
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-6">
              <button
                onClick={handleSkipForNow}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Skip for now, I'll handle this later
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}