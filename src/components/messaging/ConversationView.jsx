// src/components/messaging/ConversationView.jsx - FIXED version
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMessages } from '@/hooks/useMessages';
import { useStore } from '@/hooks/useZustandStore'; // MOVED TO TOP LEVEL
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import Link from 'next/link';
import { ArrowLeft, User, MoreVertical, Phone, Video, Briefcase, Building2 } from 'lucide-react';

export default function ConversationView({ conversationId, onBack }) {
  const router = useRouter();
  
  // ALL HOOKS AT TOP LEVEL
  const { user } = useStore(state => ({ user: state.user })); // MOVED HERE
  
  const { 
    currentConversation, 
    messages, 
    fetchConversation, 
    fetchMessages, 
    sendMessage,
    markConversationAsRead,
    loading, 
    error 
  } = useMessages();
  
  const messagesEndRef = useRef(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Helper function to get other participant (NO HOOKS INSIDE)
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
    
    // If we can't find other participant, take the first one
    if (!otherParticipant) {
      otherParticipant = conversation.participants[0];
    }
    
    // Return with proper name fallbacks
    return {
      ...otherParticipant,
      full_name: otherParticipant.full_name || 
                 `${otherParticipant.first_name || ''} ${otherParticipant.last_name || ''}`.trim() ||
                 'Unknown User',
      first_name: otherParticipant.first_name || 'Unknown',
      last_name: otherParticipant.last_name || 'User'
    };
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load conversation and messages
  useEffect(() => {
    const loadConversationData = async () => {
      if (!conversationId || conversationId === 'new') return;
      
      setIsLoadingMessages(true);
      try {
        // Load conversation details and messages in parallel
        await Promise.all([
          fetchConversation(conversationId),
          fetchMessages(conversationId)
        ]);
        
        // Mark as read
        markConversationAsRead(conversationId);
      } catch (error) {
        console.error('Error loading conversation:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadConversationData();
  }, [conversationId, markConversationAsRead]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (!conversationId || conversationId === 'new') {
      console.error('Cannot send message: Invalid conversation ID');
      return false;
    }

    try {
      await sendMessage(conversationId, content);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  };

  // Show loading state for new/invalid conversations
  if (conversationId === 'new' || !conversationId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Conversation Selected
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Select a conversation from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingMessages && !currentConversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0CCE68]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error Loading Conversation
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/messages')}
            className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  if (!currentConversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Conversation Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This conversation may have been deleted or you don't have access to it.
          </p>
          <button
            onClick={() => router.push('/messages')}
            className="px-4 py-2 bg-[#0CCE68] text-white rounded-md hover:bg-[#0BBE58]"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  // Get other participant info using the helper function
  const otherParticipant = getOtherParticipant(currentConversation);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {/* Mobile back button */}
          <button
            onClick={onBack}
            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Participant info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {otherParticipant?.profile_picture ? (
                <img 
                  src={otherParticipant.profile_picture} 
                  alt={otherParticipant.full_name || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            
            <div>
              <h2 className="font-medium text-gray-900 dark:text-white">
                {otherParticipant.full_name}
              </h2>
              {currentConversation.subject && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentConversation.subject}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {/* <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div> */}
      </div>

      {/* Job Context Banner */}
      {currentConversation.job && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  About this job inquiry
                </h4>
                {/* FIXED: Use the job ID from conversation.job */}
                <Link
                  href={`/jobs/${currentConversation.job.id || currentConversation.job}`}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  View Job →
                </Link>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                {currentConversation.job.title || 'Job Details'}
              </p>
              {currentConversation.job.company_name && (
                <div className="flex items-center mt-1 text-xs text-blue-700 dark:text-blue-300">
                  <Building2 className="w-3 h-3 mr-1" />
                  {currentConversation.job.company_name}
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#0CCE68]"></div>
          </div>
        ) : !Array.isArray(messages) || messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <MessageComposer 
          onSendMessage={handleSendMessage}
          disabled={loading}
        />
      </div>
    </div>
  );
}