// src/hooks/useMessages.js 
import { useState, useCallback } from 'react';
import { useStore } from '@/hooks/useZustandStore';
import useAuthAxios from './useAuthAxios';

export function useMessages() {
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]); // This should be an array
  
  // Get token for API calls
  const { token } = useStore(state => ({
    token: state.token
  }));
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/conversations/`);
      
      // Handle paginated response
      const conversationsData = response.data.results || response.data || [];
      setConversations(conversationsData);
      return conversationsData;
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.message || 'Failed to fetch conversations');
      return [];
    } finally {
      setLoading(false);
    }
  }, [axios]);
  
  // Fetch a single conversation
  const fetchConversation = useCallback(async (conversationId) => {
    if (!conversationId || conversationId === 'new') return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/conversations/${conversationId}/`);
      setCurrentConversation(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching conversation:', err);
      setError(err.message || 'Failed to fetch conversation');
      return null;
    } finally {
      setLoading(false);
    }
  }, [axios]);
  
  // Fetch messages for a conversation - FIXED VERSION
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId || conversationId === 'new') return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages/`);
      
      
      // FIXED: Extract messages from paginated response
      let messagesData = [];
      if (response.data.results) {
        // Paginated response
        messagesData = response.data.results;
      } else if (Array.isArray(response.data)) {
        // Direct array response
        messagesData = response.data;
      } else {
        // Fallback
        messagesData = [];
      }
      
      
      setMessages(messagesData);
      return messagesData;
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Failed to fetch messages');
      setMessages([]); // Set empty array on error
      return [];
    } finally {
      setLoading(false);
    }
  }, [axios]);
  
  // Create a new conversation
  const createConversation = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.post(`${API_URL}/conversations/`, data);
      setCurrentConversation(response.data);
      
      // After creating conversation, fetch its messages
      if (response.data.id) {
        await fetchMessages(response.data.id);
      }
      
      return response.data;
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError(err.message || 'Failed to create conversation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios, fetchMessages]);
  
  // Send a message in a conversation - FIXED VERSION  
  const sendMessage = useCallback(async (conversationId, content) => {
    if (!conversationId || conversationId === 'new') {
      setError('Cannot send message: Invalid conversation ID');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      // Include conversation field as required by API
      const messageData = {
        conversation: conversationId,
        content: content
      };
      
      
      const response = await axios.post(`${API_URL}/conversations/${conversationId}/messages/`, messageData);
      
      
      // Add the new message to our messages list (ensure messages is an array)
      setMessages(prev => {
        const currentMessages = Array.isArray(prev) ? prev : [];
        return [...currentMessages, response.data];
      });
      
      return response.data;
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Failed to send message';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [axios]);
  
  // Mark conversation as read
  const markConversationAsRead = useCallback(async (conversationId) => {
    if (!conversationId || conversationId === 'new') return false;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      await axios.post(`${API_URL}/conversations/${conversationId}/read/`);
      return true;
    } catch (err) {
      console.error('Failed to mark conversation as read:', err);
      return false;
    }
  }, [axios]);
  
  // Get unread count
  const getUnreadCount = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/conversations/unread-count/`);
      return response.data.count || 0;
    } catch (err) {
      console.error('Failed to get unread count:', err);
      return 0;
    }
  }, [axios]);
  
  return {
    loading,
    error,
    conversations,
    currentConversation,
    messages, // This is now guaranteed to be an array
    fetchConversations,
    fetchConversation,
    fetchMessages,
    createConversation,
    sendMessage,
    markConversationAsRead,
    getUnreadCount,
    clearError
  };
}