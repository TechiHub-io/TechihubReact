// src/hooks/useMessageNotifications.js
import { useEffect } from 'react';
import { useMessagesStore } from './useZustandStore';
import { useNotification } from './useNotification';

export default function useMessageNotifications() {
  const { 
    unreadCount, 
    fetchUnreadCount, 
    conversations, 
    fetchConversations 
  } = useMessagesStore();
  
  const { showInfo } = useNotification();
  
  // Fetch unread count periodically
  useEffect(() => {
    // Fetch initial unread count
    fetchUnreadCount();
    
    // Update unread count every minute
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 60000); // Every minute
    
    return () => clearInterval(intervalId);
  }, [fetchUnreadCount]);
  
  // Fetch conversations when unread count changes and is greater than 0
  useEffect(() => {
    if (unreadCount > 0 && (!conversations || conversations.length === 0)) {
      fetchConversations();
    }
  }, [unreadCount, conversations, fetchConversations]);
  
  // Show notification when unread count increases
  useEffect(() => {
    if (unreadCount > 0) {
      showInfo(`You have ${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`);
    }
  }, [unreadCount, showInfo]);
  
  return {
    unreadCount,
    fetchUnreadCount
  };
}