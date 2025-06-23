// src/app/messages/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMessages } from '@/hooks/useMessages';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ConversationList from '@/components/messaging/ConversationList';
import ConversationView from '@/components/messaging/ConversationView';

export default function MessagesPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id;
  
  const [showMobileList, setShowMobileList] = useState(!conversationId || conversationId === 'new');
  
  const { 
    conversations, 
    fetchConversations,
    loading
  } = useMessages();
  
  useEffect(() => {
    // Load all conversations
    fetchConversations();
  }, []);
  
  useEffect(() => {
    // Update mobile view based on conversation ID
    setShowMobileList(!conversationId || conversationId === 'new');
  }, [conversationId]);
  
  const handleBackToList = () => {
    setShowMobileList(true);
    router.push('/messages');
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
          {/* Conversation list - show on mobile only when no conversation is selected */}
          <div className={`md:col-span-1 ${showMobileList ? 'block' : 'hidden md:block'}`}>
            {loading && conversations.length === 0 ? (
              <div className="flex justify-center items-center h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0CCE68]"></div>
              </div>
            ) : (
              <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <ConversationList 
                  conversations={conversations} 
                  activeId={conversationId} 
                />
              </div>
            )}
          </div>
          
          {/* Conversation view - show on mobile only when a conversation is selected */}
          <div className={`md:col-span-2 h-full ${showMobileList ? 'hidden md:block' : 'block'}`}>
            <ConversationView 
              conversationId={conversationId} 
              onBack={handleBackToList} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}