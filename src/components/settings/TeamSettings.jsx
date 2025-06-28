// src/components/settings/TeamSettings.jsx
import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import { Users, UserPlus, Mail, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TeamSettings() {
  const { company, fetchTeamMembers, fetchTeamInvitations, teamMembers, teamInvitations } = useStore(state => ({
    company: state.company,
    fetchTeamMembers: state.fetchTeamMembers,
    fetchTeamInvitations: state.fetchTeamInvitations,
    teamMembers: state.teamMembers || [], // Ensure it's always an array
    teamInvitations: state.teamInvitations || {} // This is a paginated response object
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

  const sendInvitation = async () => {
    if (!inviteEmail || !company?.id) return;

    setSendingInvite(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_FRONT_URL}/companies/${company.id}/invitations/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: inviteEmail,
            role: inviteRole
          }),
        }
      );

      if (response.ok) {
        setInviteEmail('');
        setInviteRole('viewer');
        await fetchTeamInvitations(company.id);
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
    } finally {
      setSendingInvite(false);
    }
  };

  // Safely extract data from paginated responses
  const safeTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
  const safeInvitations = Array.isArray(teamInvitations?.results) ? teamInvitations.results : [];
  
  const roleCount = {
    owner: safeTeamMembers.filter(m => m.role === 'owner').length,
    admin: safeTeamMembers.filter(m => m.role === 'admin').length,
    recruiter: safeTeamMembers.filter(m => m.role === 'recruiter').length,
    viewer: safeTeamMembers.filter(m => m.role === 'viewer').length,
  };

  // Count pending invitations (not accepted)
  const pendingInvites = safeInvitations.filter(inv => !inv.is_accepted).length;
  
  // Get total invitation count from API response
  const totalInvitations = teamInvitations?.count || 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Team Management
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Overview of your team members and invitations
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0CCE68]"></div>
        </div>
      ) : (
        <>
          {/* Team Overview */}
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

          {/* Invitations Summary */}
          {totalInvitations > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Team Invitations
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {totalInvitations} total invitation{totalInvitations !== 1 ? 's' : ''}, {pendingInvites} pending
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
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-blue-800 dark:text-blue-200">Recent Invitations:</p>
                  {safeInvitations.slice(0, 3).map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-900 dark:text-blue-100">{invitation.email}</span>
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                          {invitation.role_display}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded ${
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
                      +{safeInvitations.length - 3} more...
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Invite */}
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
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
              >
                <option value="viewer">Viewer</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={sendInvitation}
                disabled={!inviteEmail || sendingInvite}
                className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sendingInvite ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </div> */}

          {/* Link to Full Team Management */}
          <Link
            href="/dashboard/employer/team"
            className="flex items-center justify-between p-4 border border-[#0CCE68] rounded-lg hover:bg-[#0CCE68]/5 transition-colors"
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
            <ArrowRight className="h-5 w-5 text-[#0CCE68]" />
          </Link>
        </>
      )}
    </div>
  );
}