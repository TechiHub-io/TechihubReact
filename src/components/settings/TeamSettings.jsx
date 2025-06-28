// src/components/settings/TeamSettings.jsx
import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Users, UserPlus, Mail, Shield, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function TeamSettings() {
  const { 
    company, 
    fetchTeamMembers, 
    fetchTeamInvitations, 
    sendInvitation,
    teamMembers, 
    teamInvitations,
    loading: teamLoading,
    error: teamError,
    clearError
  } = useStore(state => ({
    company: state.company,
    fetchTeamMembers: state.fetchTeamMembers,
    fetchTeamInvitations: state.fetchTeamInvitations,
    sendInvitation: state.sendInvitation,
    teamMembers: state.teamMembers || [],
    teamInvitations: state.teamInvitations || [],
    loading: state.loading,
    error: state.error,
    clearError: state.clearError
  }));
  
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [sendingInvite, setSendingInvite] = useState(false);

  useEffect(() => {
    if (company?.id) {
      loadTeamData();
    }
  }, [company?.id]);

  // Clear errors when component mounts
  useEffect(() => {
    if (teamError) {
      clearError();
    }
  }, []);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTeamMembers(company.id),
        fetchTeamInvitations(company.id)
      ]);
    } catch (error) {
      console.error('Failed to load team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail || !company?.id) return;

    setSendingInvite(true);
    try {
      await sendInvitation(company.id, {
        email: inviteEmail.toLowerCase(), // Normalize email
        role: inviteRole
      });
      
      // Clear form on success
      setInviteEmail('');
      setInviteRole('viewer');
      
      // Refresh invitations data
      await fetchTeamInvitations(company.id);
    } catch (error) {
      console.error('Failed to send invitation:', error);
    } finally {
      setSendingInvite(false);
    }
  };

  // Safely extract data - now both should be arrays
  const safeTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
  const safeInvitations = Array.isArray(teamInvitations) ? teamInvitations : [];
  
  // Calculate role counts from team members
  const roleCount = {
    owner: safeTeamMembers.filter(m => m.role === 'owner').length,
    admin: safeTeamMembers.filter(m => m.role === 'admin').length,
    recruiter: safeTeamMembers.filter(m => m.role === 'recruiter').length,
    viewer: safeTeamMembers.filter(m => m.role === 'viewer').length,
  };

  // Count pending invitations (not accepted)
  const pendingInvites = safeInvitations.filter(inv => !inv.is_accepted).length;
  const acceptedInvites = safeInvitations.filter(inv => inv.is_accepted).length;
  const totalInvitations = safeInvitations.length;
  
  // Calculate total team size (active members + pending invites)
  const totalTeamSize = safeTeamMembers.length + pendingInvites;

  const isLoading = loading || teamLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Team Management
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Overview of your team members and invitations
          </p>
        </div>
        
        {/* Refresh button */}
        <button
          onClick={loadTeamData}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-[#0CCE68] disabled:opacity-50 transition-colors"
          title="Refresh team data"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error display */}
      {teamError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{teamError}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0CCE68]"></div>
        </div>
      ) : (
        <>
          {/* Team Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {roleCount.owner}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Owners</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {roleCount.admin}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <UserPlus className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {roleCount.recruiter}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recruiters</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {pendingInvites}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Summary */}
          <div className="p-4 bg-gradient-to-r from-[#0CCE68]/10 to-[#364187]/10 rounded-lg border border-[#0CCE68]/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Team Summary
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {safeTeamMembers.length} active member{safeTeamMembers.length !== 1 ? 's' : ''}, {pendingInvites} pending invitation{pendingInvites !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-[#0CCE68]">
                  {totalTeamSize}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Team</p>
              </div>
            </div>
          </div>

          {/* Invitations Summary */}
          {totalInvitations > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Team Invitations
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {totalInvitations} total invitation{totalInvitations !== 1 ? 's' : ''} • {acceptedInvites} accepted • {pendingInvites} pending
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-blue-900 dark:text-blue-100">
                    {totalInvitations}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Total Invites</p>
                </div>
              </div>
              
              {/* Recent Invitations Preview */}
              {safeInvitations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-blue-800 dark:text-blue-200">Recent Invitations:</p>
                  {safeInvitations.slice(0, 3).map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-900 dark:text-blue-100 font-medium">
                          {invitation.email}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                          {invitation.role_display}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded font-medium ${
                          invitation.is_accepted 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        }`}>
                          {invitation.is_accepted ? 'Accepted' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {safeInvitations.length > 3 && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      +{safeInvitations.length - 3} more invitation{safeInvitations.length - 3 !== 1 ? 's' : ''}...
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Invite Section */}
          {/* <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Quick Invite
            </h4>
            <div className="flex space-x-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                disabled={sendingInvite}
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
                disabled={sendingInvite}
              >
                <option value="viewer">Viewer</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={handleSendInvitation}
                disabled={!inviteEmail || sendingInvite}
                className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {sendingInvite && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>{sendingInvite ? 'Sending...' : 'Send Invite'}</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Invite team members to help manage your company and job postings.
            </p>
          </div> */}

          {/* Link to Full Team Management */}
          <Link
            href="/dashboard/employer/team"
            className="flex items-center justify-between p-4 border border-[#0CCE68] rounded-lg hover:bg-[#0CCE68]/5 transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-[#0CCE68]" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Manage Full Team
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  View all members, edit roles, and manage permissions
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-[#0CCE68] group-hover:translate-x-1 transition-transform" />
          </Link>

       
        </>
      )}
    </div>
  );
}