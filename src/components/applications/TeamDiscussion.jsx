// src/components/applications/TeamDiscussion.jsx - Team conversations about applications
import React, { useState, useEffect } from 'react';
import { useTeamCollaboration } from '@/hooks/useTeamCollaboration';
import { useTeam } from '@/hooks/useTeam';
import { useStore } from '@/hooks/useZustandStore';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils/date';
import { 
  Users, 
  MessageCircle, 
  Plus, 
  Send,
  User,
  ArrowRight
} from 'lucide-react';

export default function TeamDiscussion({ applicationId, applicantName, className = "" }) {
  const router = useRouter();
  const { createTeamConversation, loading, error } = useTeamCollaboration();
  const { members, fetchTeamMembers } = useTeam();
  const { company, user } = useStore(state => ({ 
    company: state.company,
    user: state.user 
  }));
  
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [discussionSubject, setDiscussionSubject] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  // Load team members
  useEffect(() => {
    if (company?.id) {
      fetchTeamMembers(company.id);
    }
  }, [company?.id]);

  // Initialize with default subject and message
  useEffect(() => {
    if (applicantName && !discussionSubject) {
      setDiscussionSubject(`Discussion about ${applicantName}'s application`);
      setInitialMessage(`Hi team, I'd like to get your thoughts on ${applicantName}'s application. Please share your feedback when you have a chance to review.`);
    }
  }, [applicantName, discussionSubject]);

  // Handle member selection
  const handleMemberToggle = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Handle create discussion
  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    
    if (selectedMembers.length === 0 || !discussionSubject.trim() || !initialMessage.trim()) {
      return;
    }

    try {
      const conversation = await createTeamConversation(
        applicationId,
        selectedMembers,
        discussionSubject.trim(),
        initialMessage.trim()
      );
      
      // Navigate to the conversation
      router.push(`/messages/${conversation.id}`);
    } catch (error) {
      console.error('Failed to create team discussion:', error);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Team Discussion
        </h3>
        
        <button
          onClick={() => setShowCreateDiscussion(!showCreateDiscussion)}
          className="inline-flex items-center px-3 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Start Discussion
        </button>
      </div>

      {!showCreateDiscussion ? (
        /* Default State */
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Collaborate with Your Team
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start a conversation with your team members to discuss this candidate's application and gather feedback.
          </p>
          <button
            onClick={() => setShowCreateDiscussion(true)}
            className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Team Discussion
          </button>
        </div>
      ) : (
        /* Create Discussion Form */
        <form onSubmit={handleCreateDiscussion} className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discussion Subject
            </label>
            <input
              type="text"
              value={discussionSubject}
              onChange={(e) => setDiscussionSubject(e.target.value)}
              placeholder="What would you like to discuss?"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
            />
          </div>

          {/* Team Members Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Include Team Members
            </label>
            
            {members.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>No team members found</p>
                <p className="text-sm">Invite team members to collaborate on applications</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {members.filter(member => member.user?.id !== user?.id).map((member) => (
                  <label
                    key={member.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedMembers.includes(member.user?.id)
                        ? 'border-[#0CCE68] bg-[#0CCE68]/5'
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.user?.id)}
                      onChange={() => handleMemberToggle(member.user?.id)}
                      className="h-4 w-4 text-[#0CCE68] focus:ring-[#0CCE68] border-gray-300 dark:border-gray-600 rounded"
                    />
                    
                    <div className="ml-3 flex items-center flex-1">
                      {member.user?.profile_picture ? (
                        <img
                          src={member.user.profile_picture}
                          alt={member.user.full_name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                      
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {member.user?.full_name || 'Unknown Member'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {member.role || 'Team Member'}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Initial Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Initial Message
            </label>
            <textarea
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Start the conversation..."
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowCreateDiscussion(false);
                setSelectedMembers([]);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedMembers.length === 0 || !discussionSubject.trim() || !initialMessage.trim()}
              className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Start Discussion
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}