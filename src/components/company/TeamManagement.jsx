// src/components/company/TeamManagement.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { useCompany } from '@/hooks/useCompany';
import TeamMemberCard from './TeamMemberCard';
import { 
  UserPlus, 
  Mail, 
  Users,
  AlertCircle 
} from 'lucide-react';

export default function TeamManagement() {
  const { 
    company,
    loading: companyLoading 
  } = useCompany();
  
  const { 
    teamMembers, 
    teamInvitations, 
    fetchTeamMembers, 
    fetchTeamInvitations, 
    sendInvitation, 
    cancelInvitation, 
    removeTeamMember, 
    updateTeamMemberRole, 
    loading,
    error,
    clearError,
    hasPendingInvitations // Watch for changes in invitations
  } = useStore(state => ({
    teamMembers: state.teamMembers,
    teamInvitations: state.teamInvitations,
    fetchTeamMembers: state.fetchTeamMembers,
    fetchTeamInvitations: state.fetchTeamInvitations,
    sendInvitation: state.sendInvitation,
    cancelInvitation: state.cancelInvitation,
    removeTeamMember: state.removeTeamMember,
    updateTeamMemberRole: state.updateTeamMemberRole,
    loading: state.loading,
    error: state.error,
    clearError: state.clearError,
    hasPendingInvitations: state.hasPendingInvitations
  }));
  
  // Invitation form state
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'viewer'
  });
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');
  
  // Show invitation form
  const [showInviteForm, setShowInviteForm] = useState(false);
  
  // Confirmation modal for remove
  const [removeConfirm, setRemoveConfirm] = useState({
    show: false,
    id: null,
    name: '',
    type: '' // 'member' or 'invitation'
  });
  
  // Load team members and invitations on component mount
  useEffect(() => {
    const loadTeamData = async () => {
      if (!company?.id) return;
      
      try {
        await Promise.all([
          fetchTeamMembers(company.id),
          fetchTeamInvitations(company.id)
        ]);
      } catch (error) {
        console.error('Error loading team data:', error);
      }
    };
    
    loadTeamData();
  }, [company?.id]);

  // Auto-refresh team data when invitations change (someone accepts invitation)
  useEffect(() => {
    const refreshTeamData = async () => {
      if (company?.id) {
        try {
          await Promise.all([
            fetchTeamMembers(company.id),
            fetchTeamInvitations(company.id)
          ]);
        } catch (error) {
          console.error('Error refreshing team data:', error);
        }
      }
    };
    
    refreshTeamData();
  }, [hasPendingInvitations]); // Re-run when invitation status changes
  
  // Handle invitation form changes
  const handleInviteFormChange = (e) => {
    const { name, value } = e.target;
    setInviteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle invitation submission
  const handleSendInvitation = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!company?.id) {
      console.error('Company ID is required');
      return;
    }
    
    try {
      await sendInvitation(company.id, inviteForm);
      
      // Reset form
      setInviteForm({
        email: '',
        role: 'viewer'
      });
      
      setShowInviteForm(false);
      
      // Show success message
      setSuccessMessage('Invitation sent successfully!');
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };
  
  // Show confirmation modal for removal
  const confirmRemove = (id, name, type) => {
    setRemoveConfirm({
      show: true,
      id,
      name,
      type
    });
  };
  
  // Cancel remove confirmation
  const cancelRemoveConfirm = () => {
    setRemoveConfirm({
      show: false,
      id: null,
      name: '',
      type: ''
    });
  };
  
  // Proceed with removal
  const confirmRemoveAction = async () => {
    if (!removeConfirm.id || !company?.id) return;
    
    try {
      if (removeConfirm.type === 'member') {
        await removeTeamMember(company.id, removeConfirm.id);
      } else if (removeConfirm.type === 'invitation') {
        await cancelInvitation(company.id, removeConfirm.id);
      }
      
      // Reset confirmation modal
      cancelRemoveConfirm();
      
      // Show success message
      setSuccessMessage(
        removeConfirm.type === 'member'
          ? 'Team member removed successfully!'
          : 'Invitation cancelled successfully!'
      );
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error(`Error removing ${removeConfirm.type}:`, error);
    }
  };
  
  // Handle role update
  const handleRoleUpdate = async (memberId, newRole) => {
    if (!company?.id) return;
    
    try {
      await updateTeamMemberRole(company.id, memberId, { role: newRole });
      
      // Show success message
      setSuccessMessage('Role updated successfully!');
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating member role:', error);
    }
  };
  
  if (companyLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Team Management
        </h1>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Team members section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Members ({teamMembers.length})
            </h2>
          </div>
          
          <button
            onClick={() => setShowInviteForm(true)}
            className="flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite New Member
          </button>
        </div>
        
        {teamMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No team members yet.
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Invite team members to collaborate on your company account.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onRoleUpdate={(newRole) => handleRoleUpdate(member.id, newRole)}
                onRemove={() => confirmRemove(member.id, member.user_name || member.user_email, 'member')}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Invitations section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <Mail className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pending Invitations ({teamInvitations.length})
          </h2>
        </div>
        
        {teamInvitations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No pending invitations.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Invited On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {teamInvitations.map((invitation) => (
                  <tr key={invitation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {invitation.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {invitation.role_display || invitation.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(invitation.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => confirmRemove(invitation.id, invitation.email, 'invitation')}
                        className="text-red-500 hover:text-red-700"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Invite member form modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Invite Team Member
            </h3>
            
            <form onSubmit={handleSendInvitation}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={inviteForm.email}
                  onChange={handleInviteFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role*
                </label>
                <select
                  id="role"
                  name="role"
                  value={inviteForm.role}
                  onChange={handleInviteFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68] dark:bg-gray-700 dark:text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              
              <div className="mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Note about roles:
                  </h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>
                      <strong>Admin:</strong> Can manage all company settings, jobs, and team members
                    </li>
                    <li>
                      <strong>Recruiter:</strong> Can post and manage jobs and review applications
                    </li>
                    <li>
                      <strong>Viewer:</strong> Can view jobs and applications (read-only)
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Remove confirmation modal */}
      {removeConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm {removeConfirm.type === 'member' ? 'Removal' : 'Cancellation'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {removeConfirm.type === 'member' 
                ? `Are you sure you want to remove ${removeConfirm.name} from your team?` 
                : `Are you sure you want to cancel the invitation to ${removeConfirm.name}?`}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelRemoveConfirm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveAction}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                {removeConfirm.type === 'member' ? 'Remove' : 'Cancel Invitation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}