// src/components/messaging/ConversationList.jsx 
import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/hooks/useZustandStore';
import { Search, User, MessageCircle, Briefcase, Building2 } from 'lucide-react';

export default function ConversationList({ conversations = [], activeId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useStore(state => ({ user: state.user }));

  // Get the other participant (not current user)
  const getOtherParticipant = (conversation) => {
    if (!conversation.participants || conversation.participants.length === 0) {
      return { 
        full_name: 'Unknown User', 
        first_name: 'Unknown', 
        last_name: 'User',
        email: '',
        profile_picture: null 
      };
    }
    
    // Find participant that is not the current user
    let otherParticipant = conversation.participants.find(p => p.id !== user?.id);
    
    // If we can't find other participant or there's only one participant, take the first one
    if (!otherParticipant) {
      otherParticipant = conversation.participants[0];
    }
    
    // Return with fallback values
    return {
      ...otherParticipant,
      full_name: otherParticipant.full_name || 
                 `${otherParticipant.first_name || ''} ${otherParticipant.last_name || ''}`.trim() ||
                 'Unknown User',
      first_name: otherParticipant.first_name || 'Unknown',
      last_name: otherParticipant.last_name || 'User'
    };
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm) return true;
    
    const searchString = searchTerm.toLowerCase();
    const otherParticipant = getOtherParticipant(conversation);
    
    return (
      conversation.subject?.toLowerCase().includes(searchString) ||
      otherParticipant.full_name?.toLowerCase().includes(searchString) ||
      otherParticipant.first_name?.toLowerCase().includes(searchString) ||
      otherParticipant.last_name?.toLowerCase().includes(searchString) ||
      otherParticipant.email?.toLowerCase().includes(searchString) ||
      conversation.job?.title?.toLowerCase().includes(searchString) ||
      conversation.last_message?.content?.toLowerCase().includes(searchString)
    );
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (today.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Conversations
        </h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-8 h-8 mb-3" />
            <p className="text-sm text-center">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const isActive = conversation.id === activeId;
              const hasUnread = conversation.unread_count > 0;

              return (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className={`block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {otherParticipant.profile_picture ? (
                          <img 
                            src={otherParticipant.profile_picture} 
                            alt={otherParticipant.full_name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                      
                      {/* Unread indicator */}
                      {hasUnread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#0CCE68] rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-sm font-medium truncate ${
                          hasUnread 
                            ? 'text-gray-900 dark:text-white font-semibold' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {otherParticipant.full_name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                          {formatDate(conversation.last_message?.created_at || conversation.created_at)}
                        </span>
                      </div>

                      {/* Subject */}
                      {conversation.subject && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-1">
                          {conversation.subject}
                        </p>
                      )}

                      {/* Last message */}
                      {conversation.last_message?.content && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 truncate mb-1">
                          {conversation.last_message.content}
                        </p>
                      )}

                      {/* Job context */}
                      {conversation.job && (
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {conversation.job.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}