// src/store/slices/messagesSlice.js
export const createMessagesSlice = (set, get) => ({
  // Messages state
  conversations: [],
  currentConversation: null,
  messages: [],
  unreadCount: 0,
  pagination: {
    page: 1,
    pageSize: 20,
    totalPages: 1,
    totalCount: 0,
    hasMore: false
  },
  loading: false,
  error: null,

  // Basic actions
  setConversations: (conversations) => set((state) => {
    state.conversations = conversations;
  }),

  setCurrentConversation: (conversation) => set((state) => {
    state.currentConversation = conversation;
  }),

  setMessages: (messages) => set((state) => {
    state.messages = messages;
  }),

  setUnreadCount: (count) => set((state) => {
    state.unreadCount = count;
  }),

  // Reset pagination to default
  resetPagination: () => set((state) => {
    state.pagination = {
      page: 1,
      pageSize: 20,
      totalPages: 1,
      totalCount: 0,
      hasMore: false
    };
  }),

  // Update pagination
  updatePagination: (paginationData) => set((state) => {
    state.pagination = {
      ...state.pagination,
      ...paginationData
    };
  }),

  // Fetch all conversations
  fetchConversations: async (filters = {}) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      // Prepare query parameters for pagination
      const params = new URLSearchParams({
        page: filters.page || get().pagination.page,
        page_size: filters.pageSize || get().pagination.pageSize,
        ...filters
      });
      
      // Clean up empty params
      Object.keys(params).forEach(key => 
        !params[key] && params.delete(key)
      );

      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/conversations/?${params}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch conversations');
      }

      const data = await response.json();
      
      // Handle both paginated and non-paginated responses
      const results = data.results || data;
      const totalCount = data.count || results.length || 0;
      const totalPages = data.total_pages || Math.ceil(totalCount / get().pagination.pageSize) || 1;
      const hasMore = data.next ? true : false;

      set((state) => {
        state.conversations = results;
        state.pagination = {
          ...state.pagination,
          totalPages,
          totalCount,
          hasMore,
          page: filters.page || state.pagination.page
        };
        state.loading = false;
      });

      return results;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      set((state) => {
        state.error = error.message || 'Failed to fetch conversations';
        state.loading = false;
      });
      throw error;
    }
  },

  // Fetch a single conversation by ID
  fetchConversation: async (conversationId) => {
    if (!conversationId) {
      set((state) => {
        state.error = 'Conversation ID is required';
      });
      return null;
    }

    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/conversations/${conversationId}/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch conversation');
      }

      const data = await response.json();

      set((state) => {
        state.currentConversation = data;
        state.loading = false;
      });

      return data;
    } catch (error) {
      console.error(`Error fetching conversation ${conversationId}:`, error);
      set((state) => {
        state.error = error.message || 'Failed to fetch conversation';
        state.loading = false;
      });
      throw error;
    }
  },

  // Fetch messages for a conversation
  fetchMessages: async (conversationId, page = 1, pageSize = 50) => {
    if (!conversationId) {
      set((state) => {
        state.error = 'Conversation ID is required';
      });
      return [];
    }

    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      // Prepare query parameters for pagination
      const params = new URLSearchParams({
        page,
        page_size: pageSize
      });

      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/conversations/${conversationId}/messages/?${params}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch messages');
      }

      const data = await response.json();
      
      // Handle both paginated and non-paginated responses
      const results = data.results || data;
      const totalCount = data.count || results.length || 0;
      const totalPages = data.total_pages || Math.ceil(totalCount / pageSize) || 1;
      const hasMore = data.next ? true : false;

      set((state) => {
        // For message pagination: append or replace based on page
        state.messages = page > 1 
          ? [...state.messages, ...results]
          : results;
        
        state.pagination = {
          ...state.pagination,
          totalPages,
          totalCount,
          hasMore,
          page
        };
        state.loading = false;
      });

      // Mark messages as read
      if (results && results.length > 0) {
        get().markConversationAsRead(conversationId);
      }

      return results;
    } catch (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
      set((state) => {
        state.error = error.message || 'Failed to fetch messages';
        state.loading = false;
      });
      throw error;
    }
  },

  // Load more messages (for infinite scrolling)
  loadMoreMessages: async (conversationId) => {
    const currentPage = get().pagination.page;
    const hasMore = get().pagination.hasMore;
    
    if (!hasMore) return [];
    
    return get().fetchMessages(conversationId, currentPage + 1);
  },

  // Create new conversation
  createConversation: async (conversationData) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/conversations/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create conversation');
      }

      const data = await response.json();

      set((state) => {
        state.conversations = [data, ...state.conversations];
        state.currentConversation = data;
        state.loading = false;
      });

      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      set((state) => {
        state.error = error.message || 'Failed to create conversation';
        state.loading = false;
      });
      throw error;
    }
  },

  // Send a message
  sendMessage: async (conversationId, content) => {
    if (!conversationId) {
      set((state) => {
        state.error = 'Conversation ID is required';
      });
      return null;
    }

    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/conversations/${conversationId}/messages/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send message');
      }

      const data = await response.json();

      set((state) => {
        // Add new message to the list
        state.messages = [...state.messages, data];
        
        // Update last message in the conversation list
        state.conversations = state.conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              last_message: data
            };
          }
          return conv;
        });
        
        state.loading = false;
      });

      return data;
    } catch (error) {
      console.error(`Error sending message to conversation ${conversationId}:`, error);
      set((state) => {
        state.error = error.message || 'Failed to send message';
        state.loading = false;
      });
      throw error;
    }
  },

  // Mark conversation as read
  markConversationAsRead: async (conversationId) => {
    if (!conversationId) return false;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/conversations/${conversationId}/read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error marking conversation ${conversationId} as read:`, errorData);
        return false;
      }

      // Update unread count
      get().fetchUnreadCount();
      return true;
    } catch (error) {
      console.error(`Error marking conversation ${conversationId} as read:`, error);
      return false;
    }
  },

  // Fetch unread message count
  fetchUnreadCount: async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/conversations/unread-count/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching unread count:', errorData);
        return 0;
      }

      const data = await response.json();
      const count = data.count || 0;

      set((state) => {
        state.unreadCount = count;
      });

      return count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  // Clear error
  clearError: () => set((state) => {
    state.error = null;
  }),
});