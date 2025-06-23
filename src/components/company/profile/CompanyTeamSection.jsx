// src/components/company/profile/CompanyTeamSection.jsx
import React, { useState, useEffect } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { useTeam } from '@/hooks/useTeam';
import { useNotification } from '@/hooks/useNotification';
import { 
  Users, 
  UserPlus, 
  Mail, 
  User, 
  UserCheck, 
  UserX, 
  Edit,
  Save,
  X,
  Trash2
} from 'lucide-react';

export default function CompanyTeamSection({ company, isOwner, companyId }) {
  const { 
    members, 
    invitations, 
    fetchTeamMembers, 
    fetchInvitations, 
    sendInvitation, 
    cancelInvitation, 
    updateMemberRole, 
    removeMember, 
    loading 
  } = useTeam();
  const { showSuccess, showError } = useNotification();
  
  // State for team data and UI
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'admin' });
  const [editMemberId, setEditMemberId] = useState(null);
  const [editRole, setEditRole] = useState('admin');
  
  // Fetch team members and invitations on mount
  useEffect(() => {
    if (companyId) {
      const loadTeamData = async () => {
        try {
          await fetchTeamMembers(companyId);
          await fetchInvitations(companyId);
        } catch (err) {
          console.error('Error loading team data:', err);
        }
      };
      
      loadTeamData();
    }
  }, [companyId]);
  
  // Handle invite input changes
  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setInviteData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle sending invitation
  const handleSendInvitation = async (e) => {
    e.preventDefault();
    
    if (!inviteData.email) {
      showError('Please enter an email address');
      return;
    }
    
    try {
      await sendInvitation(companyId, inviteData);
      showSuccess(`Invitation sent to ${inviteData.email}`);
      setInviteData({ email: '', role: 'member' });
      setShowInviteForm(false);
    } catch (err) {
      showError(err.message || 'Failed to send invitation');
    }
  };
  
  // Handle canceling invitation
  const handleCancelInvitation = async (invitationId) => {
    if (!window.confirm('Are you sure you want to cancel this invitation?')) {
      return;
    }
    
    try {
      await cancelInvitation(companyId, invitationId);
      showSuccess('Invitation canceled successfully');
    } catch (err) {
      showError(err.message || 'Failed to cancel invitation');
    }
  };
  
  // Handle updating member role
  const handleRoleUpdate = async (memberId) => {
    try {
      await updateMemberRole(companyId, memberId, { role: editRole });
      showSuccess('Team member role updated');
      setEditMemberId(null);
    } catch (err) {
      showError(err.message || 'Failed to update member role');
    }
  };
  
  // Handle removing team member
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) {
      return;
    }
    
    try {
      await removeMember(companyId, memberId);
      showSuccess('Team member removed successfully');
    } catch (err) {
      showError(err.message || 'Failed to remove team member');
    }
  };
  
  // Start editing a member's role
  const startEditing = (member) => {
    setEditMemberId(member.id);
    setEditRole(member.role);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditMemberId(null);
  };
  
  // Role options
  const roleOptions = [
    { value: 'admin', label: 'Admin', description: 'Full access to all company settings' },
    { value: 'recruiter', label: 'Recruiter', description: 'Can manage jobs and applications' },
    { value: 'member', label: 'Member', description: 'Limited access to company resources' },
  ];
  
  const hasMembers = members && members.length > 0;
  const hasPendingInvitations = invitations && invitations.length > 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Team Members
        </h2>
        
        {isOwner && !showInviteForm && (
          <button
            onClick={() => setShowInviteForm(true)}
            className="inline-flex items-center px-3 py-1.5 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors text-sm"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Invite Member
          </button>
        )}
      </div>
      
      {/* Invite form */}
      {showInviteForm && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            Invite Team Member
          </h3>
          
          <form onSubmit={handleSendInvitation} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={inviteData.email}
                  onChange={handleInviteChange}
                  required
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                  placeholder="colleague@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={inviteData.role}
                onChange={handleInviteChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {roleOptions.find(r => r.value === inviteData.role)?.description}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
              >
                <X className="w-4 h-4 mr-1 inline" />
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Sending...' : (
                  <>
                    <UserPlus className="w-4 h-4 mr-1 inline" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Team members list */}
      {hasMembers ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                {isOwner && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {members.map((member) => (
                <tr key={member.id || `member-${member.email}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {member.profile_picture ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={member.profile_picture} 
                            alt={member.name} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editMemberId === member.id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                        >
                          {roleOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRoleUpdate(member.id)}
                          className="text-[#0CCE68] hover:text-[#0BBE58]"
                          aria-label="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                          aria-label="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900 dark:text-white capitalize">
                        {member.role || 'Member'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </span>
                  </td>
                  {isOwner && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {member.is_owner ? (
                        <span className="text-gray-500 dark:text-gray-400">
                          Owner
                        </span>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          {editMemberId !== member.id && (
                            <button
                              onClick={() => startEditing(member)}
                              className="text-[#0CCE68] hover:text-[#0BBE58]"
                              aria-label="Edit role"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                            aria-label="Remove member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-md">
          <Users className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
          <p className="text-gray-500 dark:text-gray-400">No team members yet</p>
          { !showInviteForm && (
            <button
              onClick={() => setShowInviteForm(true)}
              className="mt-2 text-[#0CCE68] hover:underline text-sm"
            >
              + Invite your first team member
            </button>
          )}
        </div>
      )}
      
      {/* Pending invitations */}
      {hasPendingInvitations && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            Pending Invitations
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-600">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sent At
                  </th>
                  {isOwner && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {invitations.map((invitation) => (
                  <tr key={invitation.id || `invite-${invitation.email}`} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {invitation.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white capitalize">
                        {invitation.role || 'Member'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(invitation.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    {isOwner && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Cancel
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}