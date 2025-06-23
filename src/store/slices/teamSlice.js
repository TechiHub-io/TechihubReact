// src/store/slices/teamSlice.js
export const createTeamSlice = (set, get) => ({
  // Team state
  teamMembers: [],
  teamInvitations: [],
  loading: false,
  error: null,

  // Actions
  setTeamMembers: (members) => set((state) => {
    state.teamMembers = members;
  }),
  
  setTeamInvitations: (invitations) => set((state) => {
    state.teamInvitations = invitations;
  }),
  
  fetchTeamMembers: async (companyId) => {
    if (!companyId) {
      const currentCompany = get().company;
      if (!currentCompany?.id) {
        set((state) => {
          state.error = 'Company ID is required';
        });
        return [];
      }
      companyId = currentCompany.id;
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/companies/${companyId}/members/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch team members');
      }

      const data = await response.json();

      set((state) => {
        state.teamMembers = data;
        state.loading = false;
      });

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },
  
  fetchTeamInvitations: async (companyId) => {
    if (!companyId) {
      const currentCompany = get().company;
      if (!currentCompany?.id) {
        set((state) => {
          state.error = 'Company ID is required';
        });
        return [];
      }
      companyId = currentCompany.id;
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/companies/${companyId}/invitations/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch team invitations');
      }

      const data = await response.json();

      set((state) => {
        state.teamInvitations = data;
        state.loading = false;
      });

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },
  
  sendInvitation: async (companyId, inviteData) => {
    if (!companyId) {
      const currentCompany = get().company;
      if (!currentCompany?.id) {
        set((state) => {
          state.error = 'Company ID is required';
        });
        return null;
      }
      companyId = currentCompany.id;
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/companies/${companyId}/invitations/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send invitation');
      }

      const data = await response.json();

      set((state) => {
        state.teamInvitations = [...state.teamInvitations, data];
        state.loading = false;
      });

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },
  
  cancelInvitation: async (companyId, invitationId) => {
    if (!companyId) {
      const currentCompany = get().company;
      if (!currentCompany?.id) {
        set((state) => {
          state.error = 'Company ID is required';
        });
        return false;
      }
      companyId = currentCompany.id;
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/companies/${companyId}/invitations/${invitationId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to cancel invitation');
      }

      set((state) => {
        state.teamInvitations = state.teamInvitations.filter(inv => inv.id !== invitationId);
        state.loading = false;
      });

      return true;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },
  
  removeTeamMember: async (companyId, memberId) => {
    if (!companyId) {
      const currentCompany = get().company;
      if (!currentCompany?.id) {
        set((state) => {
          state.error = 'Company ID is required';
        });
        return false;
      }
      companyId = currentCompany.id;
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/companies/${companyId}/members/${memberId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to remove team member');
      }

      set((state) => {
        state.teamMembers = state.teamMembers.filter(member => member.id !== memberId);
        state.loading = false;
      });

      return true;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },
  
  updateTeamMemberRole: async (companyId, memberId, memberData) => {
    if (!companyId) {
      const currentCompany = get().company;
      if (!currentCompany?.id) {
        set((state) => {
          state.error = 'Company ID is required';
        });
        return null;
      }
      companyId = currentCompany.id;
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/companies/${companyId}/members/${memberId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update team member');
      }

      const data = await response.json();

      set((state) => {
        state.teamMembers = state.teamMembers.map(member => 
          member.id === memberId ? data : member
        );
        state.loading = false;
      });

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },
  
  // Utils
  clearError: () => set((state) => {
    state.error = null;
  }),
});