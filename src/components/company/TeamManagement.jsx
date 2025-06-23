// src/components/company/TeamManagement.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useTeam } from '@/hooks/useTeam';
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
    members, 
    invitations, 
    fetchTeamMembers, 
    fetchInvitations, 
    sendInvitation, 
    cancelInvitation, 
    removeMember, 
    updateMemberRole, 
    loading,
    error,
    clearError 
  } = useTeam();
  
  // Invitation form state
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'member'
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
          fetchTeamMembers(),
          fetchInvitations()
        ]);
      } catch (error) {
        console.error('Error loading team data:', error);
      }
    };
    
    loadTeamData();
  }, [company?.id]);
  
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
    
    try {
      await sendInvitation(inviteForm);
      
      // Reset form
      setInviteForm({
        email: '',
        role: 'member'
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
    if (!removeConfirm.id) return;
    
    try {
      if (removeConfirm.type === 'member') {
        await removeMember(removeConfirm.id);
      } else if (removeConfirm.type === 'invitation') {
        await cancelInvitation(removeConfirm.id);
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
    try {
      await updateMemberRole(memberId, { role: newRole });
      
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
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Team Management
      </h1>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-green-700 dark:text-green-300">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      
      {/* Team members section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#0CCE68]" />
            Team Members
          </h2>
          
          <button
            onClick={() => setShowInviteForm(true)}
            className="flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite New Member
          </button>
        </div>
        
        {members.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
            <p>No team members yet.</p>
            <p className="mt-1 text-sm">Invite team members to collaborate on your company account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <TeamMemberCard 
                key={member.id}
                member={member}
                onRoleUpdate={handleRoleUpdate}
                onRemove={() => confirmRemove(member.id, member.name || member.email, 'member')}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Invitations section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2 text-[#0CCE68]" />
          Pending Invitations
        </h2>
        
        {invitations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No pending invitations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Role</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Invited On</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invitation) => (
                  <tr 
                    key={invitation.id} 
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      {invitation.email}
                    </td>
                    <td className="px-6 py-4">
                      {invitation.role_display || invitation.role}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(invitation.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Invite Team Member
            </h3>
            
            <form onSubmit={handleSendInvitation}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address*
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={handleInviteFormChange}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  placeholder="colleague@example.com"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role*
                </label>
                <select
                  id="role"
                  name="role"
                  value={inviteForm.role}
                  onChange={handleInviteFormChange}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="viewer">Team Member</option>
                </select>
              </div>
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-yellow-700 dark:text-yellow-300 text-sm mb-4 flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Note about roles:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li><strong>Admin:</strong> Can manage all company settings, jobs, and team members</li>
                    <li><strong>Recruiter:</strong> Can post and manage jobs and review applications</li>
                    <li><strong>Team Member:</strong> Can view jobs and applications</li>
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
                  className="px-4 py-2 bg-[#0CCE68] hover:bg-[#0BBE58] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Confirm {removeConfirm.type === 'member' ? 'Removal' : 'Cancellation'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
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
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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