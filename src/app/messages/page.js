// src/app/messages/page.js 
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/hooks/useZustandStore';
import { useMessages } from '@/hooks/useMessages';
import { Search, User, Plus, MessageCircle, Briefcase, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function MessagesPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer } = useStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isEmployer: state.isEmployer
  }));
  
  // Use the messaging hook instead of store
  const {
    conversations,
    fetchConversations,
    loading,
    error
  } = useMessages();
  
  // Search input state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load conversations on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    fetchConversations();
  }, [isAuthenticated, fetchConversations, router]);
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => {
    const searchString = searchTerm.toLowerCase();
    
    // Check subject
    if (conversation.subject?.toLowerCase().includes(searchString)) {
      return true;
    }
    
    // Check participants
    const hasMatchingParticipant = conversation.participants?.some(
      participant => 
        participant.first_name?.toLowerCase().includes(searchString) ||
        participant.last_name?.toLowerCase().includes(searchString) ||
        participant.full_name?.toLowerCase().includes(searchString) ||
        participant.email?.toLowerCase().includes(searchString)
    );
    
    if (hasMatchingParticipant) {
      return true;
    }
    
    // Check job title
    if (conversation.job?.title?.toLowerCase().includes(searchString)) {
      return true;
    }
    
    // Check last message
    if (conversation.last_message?.content?.toLowerCase().includes(searchString)) {
      return true;
    }
    
    return false;
  });
  
  // Format date for display
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
      // Less than a week ago - show day name
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };
  
  // Get conversation type badge
  const getConversationTypeBadge = (conversation) => {
    if (!conversation.conversation_type) return null;
    
    const typeConfig = {
      job_inquiry: { 
        label: 'Job Inquiry', 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
        icon: Briefcase
      },
      job_application: { // Added this type
        label: 'Application', 
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        icon: Briefcase
      },
      general: { 
        label: 'General', 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        icon: MessageCircle
      },
      system: { 
        label: 'System', 
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
        icon: Building2
      }
    };
    
    const config = typeConfig[conversation.conversation_type] || typeConfig.general;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };
  
  // Get the other participant (not current user)
  const getOtherParticipant = (conversation) => {
    if (!conversation.participants || conversation.participants.length === 0) {
      return { full_name: 'Unknown User', email: '' };
    }
    
    // For now, take the first participant since we don't have current user ID
    // In a real app, you'd filter out the current user
    return conversation.participants[0] || { full_name: 'Unknown User', email: '' };
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Messages
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isEmployer 
                ? 'Communicate with job candidates and manage inquiries' 
                : 'Connect with employers and ask questions about opportunities'
              }
            </p>
          </div>
          
          {/* New Message button - different behavior for employers vs job seekers */}
          {isEmployer ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Employers receive messages from job seekers
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Contact employers through job listings
            </div>
          )}
        </div>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isEmployer 
              ? "Search conversations with candidates..." 
              : "Search conversations with employers..."
            }
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-[#0CCE68] focus:border-[#0CCE68]"
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}
        
        {/* Loading state */}
        {loading && conversations.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0CCE68]"></div>
          </div>
        )}
        
        {/* Conversations list */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {filteredConversations.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <MessageCircle className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {conversations.length > 0 ? 'No conversations found' : 'No conversations yet'}
              </h3>
              <p className="text-center max-w-sm">
                {conversations.length > 0 
                  ? 'Try a different search term to find conversations.' 
                  : isEmployer 
                    ? 'When job seekers contact you about positions, their messages will appear here.'
                    : 'Start conversations by contacting employers about job opportunities you\'re interested in.'
                }
              </p>
              {!isEmployer && conversations.length === 0 && (
                <Link
                  href="/dashboard/jobseeker/jobs/search"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Link>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                const hasUnread = conversation.unread_count > 0;
                
                return (
                  <li key={conversation.id}>
                    <Link 
                      href={`/messages/${conversation.id}`}
                      className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="flex-shrink-0 mr-4 relative">
                          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                            {otherParticipant?.profile_picture ? (
                              <img 
                                src={otherParticipant.profile_picture} 
                                alt={otherParticipant.full_name || 'User'} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                            )}
                          </div>
                          
                          {/* Unread indicator */}
                          {hasUnread && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#0CCE68] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={`text-base font-medium truncate ${
                              hasUnread 
                                ? 'text-gray-900 dark:text-white font-semibold' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {otherParticipant.full_name || otherParticipant.first_name + ' ' + (otherParticipant.last_name || '') || 'Unknown User'}
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                              {formatDate(conversation.last_message?.created_at || conversation.created_at)}
                            </span>
                          </div>
                          
                          {/* Subject */}
                          {conversation.subject && (
                            <p className={`text-sm truncate mb-1 ${
                              hasUnread 
                                ? 'text-gray-900 dark:text-gray-100 font-medium' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {conversation.subject}
                            </p>
                          )}
                          
                          {/* Last message */}
                          {conversation.last_message?.content && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">
                              {conversation.last_message.content}
                            </p>
                          )}
                          
                          {/* Tags */}
                          <div className="flex items-center space-x-2">
                            {getConversationTypeBadge(conversation)}
                            
                            {conversation.job && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                <Briefcase className="w-3 h-3 mr-1" />
                                {conversation.job.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        {/* Quick actions for job seekers */}
        {!isEmployer && conversations.length === 0 && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
              Ready to connect with employers?
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Browse job listings and use the "Contact Employer" button to start conversations about opportunities that interest you.
            </p>
            <div className="flex space-x-3">
              <Link
                href="/dashboard/jobseeker/jobs/search"
                className="inline-flex items-center px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58] transition-colors"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Browse Jobs
              </Link>
              <Link
                href="/dashboard/jobseeker/saved-jobs"
                className="inline-flex items-center px-4 py-2 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
              >
                View Saved Jobs
              </Link>
            </div>
          </div>
        )}
        
        {/* Loading indicator for additional conversations */}
        {loading && conversations.length > 0 && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#0CCE68]"></div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}