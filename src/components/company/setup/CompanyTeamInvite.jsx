// src/components/company/setup/CompanyTeamInvite.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Users, UserPlus, Mail, ShieldCheck, X } from 'lucide-react';

export default function CompanyTeamInvite({ onComplete, onBack, onSkip }) {
  const { company, inviteTeamMember, error } = useStore(state => ({
    company: state.company,
    inviteTeamMember: state.inviteTeamMember,
    error: state.error
  }));

  const [invitations, setInvitations] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [isAdding, setIsAdding] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Populate invitations from company if available
  useEffect(() => {
    if (company?.invitations) {
      setInvitations(company.invitations);
    }
  }, [company]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    
    // Clear validation error when field is edited
    if (validationError) {
      setValidationError('');
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInvite = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setValidationError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }
    
    // Add to pending invitations
    setPendingInvitations(prev => [
      ...prev,
      {
        email: email,
        role: role,
        id: Date.now(), // temporary id
        role_display: roleOptions.find(r => r.value === role)?.label || role
      }
    ]);
    
    // Reset form
    setEmail('');
    setRole('viewer');
    
    // Show success message briefly
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleRemovePendingInvitation = (id) => {
    setPendingInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  const handleSubmitAllInvitations = async () => {
    if (pendingInvitations.length === 0) {
      // If no pending invitations, just move to next step
      // Do NOT remove the cookie here - let CompanySetupPage handle it
      onComplete();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit all pending invitations one by one
      for (const invitation of pendingInvitations) {
        const inviteData = {
          email: invitation.email,
          role: invitation.role
        };
        
        await inviteTeamMember(inviteData);
      }
      
      // Clear pending invitations
      setPendingInvitations([]);
      
      // Complete the setup - call onComplete and let parent handle redirect
      onComplete();
    } catch (err) {
      console.error('Error sending invitations:', err);
      setValidationError('Failed to send invitations. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Role options
  const roleOptions = [
    { value: 'admin', label: 'Administrator', description: 'Can manage jobs, applications, and company settings', icon: <ShieldCheck className="h-4 w-4" /> },
    { value: 'recruiter', label: 'Recruiter', description: 'Can post jobs and manage applications', icon: <Users className="h-4 w-4" /> },
    { value: 'viewer', label: 'Viewer', description: 'Can view jobs and applications but cannot edit', icon: <Mail className="h-4 w-4" /> }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Invite Team Members</h3>
        <p className="text-gray-600 mt-1">Invite colleagues to help manage your company account</p>
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {validationError && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded">
          {validationError}
        </div>
      )}
      
      {showSuccessMessage && (
        <div className="p-4 mb-6 bg-green-50 border border-green-200 text-green-700 rounded flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Team invitation added to your list
        </div>
      )}
      
      {/* List of sent invitations from database */}
      {invitations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-900 mb-3">Sent Invitations</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invitations.map((invitation, index) => (
                  <tr key={invitation.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invitation.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invitation.role_display || roleOptions.find(r => r.value === invitation.role)?.label || invitation.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invitation.is_accepted ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Accepted
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* List of pending invitations */}
      {pendingInvitations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-900 mb-3">New Invitations (Not Yet Sent)</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingInvitations.map((invitation) => (
                  <tr key={invitation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invitation.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invitation.role_display}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => handleRemovePendingInvitation(invitation.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Invite form */}
      <div className="mb-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium text-gray-900 mb-4">Add Team Member</h3>
        
        <form onSubmit={handleInvite}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0CCE68] focus:ring-[#0CCE68] sm:text-sm"
                  placeholder="colleague@company.com"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={handleRoleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0CCE68] focus:ring-[#0CCE68] sm:text-sm"
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>
                <strong>Role description:</strong> {roleOptions.find(r => r.value === role)?.description}
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0CCE68] hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68]"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add to Invitations
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Information note */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-8">
        <div className="flex">
          <div className="flex-shrink-0 text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 text-sm text-blue-700">
            <p>Team members will receive an email invitation with instructions to join your company account.</p>
            <p className="mt-1">As the company owner, you'll have full admin access by default.</p>
            {pendingInvitations.length > 0 && (
              <p className="mt-1 font-medium">You have {pendingInvitations.length} unsent invitation{pendingInvitations.length > 1 ? 's' : ''}. They will be sent when you click "Complete Setup".</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between border-t border-gray-200 pt-6">
      <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68]"
        >
          Back
        </button>
        
        <div className="space-x-3">
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68]"
          >
            Skip
          </button>
          
          <button
            type="button"
            onClick={handleSubmitAllInvitations}
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0CCE68] hover:bg-[#0BBE58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0CCE68] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Complete Setup'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}