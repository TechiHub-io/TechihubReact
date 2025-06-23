// src/lib/api/messages.js
import api from './index';

export const messagesApi = {
  getConversations: () => api.get('/conversations/'),
  
  getConversationById: (id) => api.get(`/conversations/${id}/`),
  
  createConversation: (data) => api.post('/conversations/', data),
  
  getMessages: (conversationId, params) => 
    api.get(`/conversations/${conversationId}/messages/`, { params }),
  
  sendMessage: (conversationId, data) => 
    api.post(`/conversations/${conversationId}/messages/`, data),
  
  markConversationAsRead: (conversationId) => 
    api.post(`/conversations/${conversationId}/read/`),
  
  deleteConversation: (conversationId) => 
    api.delete(`/conversations/${conversationId}/`),
  
  // Notifications
  getNotifications: (params) => api.get('/notifications/', { params }),
  
  getUnreadNotificationCount: () => api.get('/notifications/unread/'),
  
  markNotificationAsRead: (id) => api.post(`/notifications/${id}/read/`),
  
  markAllNotificationsAsRead: () => api.post('/notifications/read-all/'),
};