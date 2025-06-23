// src/hooks/useTeam.js
import { useState, useCallback, useMemo } from 'react';
import { useStore } from './useZustandStore';
import useAuthAxios from './useAuthAxios';

export function useTeam() {
  const axios = useAuthAxios();
  
  // Initialize state with stable references
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get company from store
  const company = useStore(state => state.company);
  
  // Memoized company ID to prevent unnecessary re-renders
  const companyId = useMemo(() => company?.id, [company?.id]);
  
  // Fetch team members - memoized to prevent infinite loops
  const fetchTeamMembers = useCallback(async (targetCompanyId = companyId) => {
    if (!targetCompanyId) {
      setError('Company ID is required');
      return [];
    }
    
    // Prevent multiple simultaneous requests
    if (loading) {
      return members;
    }
    
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/companies/${targetCompanyId}/members/`);
      
      // Ensure we always get an array
      const membersData = Array.isArray(response.data) ? response.data : [];
      
      // Only update state if data has actually changed
      setMembers(prevMembers => {
        // Simple comparison to avoid unnecessary updates
        if (JSON.stringify(prevMembers) !== JSON.stringify(membersData)) {
          return membersData;
        }
        return prevMembers;
      });
      
      setLoading(false);
      return membersData;
    } catch (error) {
      console.error('Error fetching team members:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to fetch team members');
      setLoading(false);
      return [];
    }
  }, [axios, companyId, loading, members]);
  
  // Fetch pending invitations - memoized
  const fetchInvitations = useCallback(async (targetCompanyId = companyId) => {
    if (!targetCompanyId) {
      setError('Company ID is required');
      return [];
    }
    
    if (loading) {
      return invitations;
    }
    
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/companies/${targetCompanyId}/invitations/`);
      
      const invitationsData = Array.isArray(response.data) ? response.data : [];
      
      setInvitations(prevInvitations => {
        if (JSON.stringify(prevInvitations) !== JSON.stringify(invitationsData)) {
          return invitationsData;
        }
        return prevInvitations;
      });
      
      setLoading(false);
      return invitationsData;
    } catch (error) {
      console.error('Error fetching invitations:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to fetch invitations');
      setLoading(false);
      return [];
    }
  }, [axios, companyId, loading, invitations]);
  
  // Send invitation - memoized
  const sendInvitation = useCallback(async (inviteData, targetCompanyId = companyId) => {
    if (!targetCompanyId) {
      setError('Company ID is required');
      return null;
    }
    
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.post(`${API_URL}/companies/${targetCompanyId}/invitations/`, inviteData);
      
      // Add new invitation safely
      setInvitations(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        const newInvitation = response.data;
        
        // Check if invitation already exists to prevent duplicates
        const exists = prevArray.some(inv => inv.id === newInvitation.id);
        if (exists) {
          return prevArray;
        }
        
        return [...prevArray, newInvitation];
      });
      
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error('Error sending invitation:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to send invitation');
      setLoading(false);
      throw error;
    }
  }, [axios, companyId]);
  
  // Cancel invitation - memoized
  const cancelInvitation = useCallback(async (invitationId, targetCompanyId = companyId) => {
    if (!targetCompanyId || !invitationId) {
      setError('Company ID and invitation ID are required');
      return false;
    }
    
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      await axios.delete(`${API_URL}/companies/${targetCompanyId}/invitations/${invitationId}/`);
      
      // Remove invitation safely
      setInvitations(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.filter(inv => inv.id !== invitationId);
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error canceling invitation:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to cancel invitation');
      setLoading(false);
      throw error;
    }
  }, [axios, companyId]);
  
  // Update member role - memoized
  const updateMemberRole = useCallback(async (memberId, data, targetCompanyId = companyId) => {
    if (!targetCompanyId || !memberId) {
      setError('Company ID and member ID are required');
      return null;
    }
    
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.put(`${API_URL}/companies/${targetCompanyId}/members/${memberId}/`, data);
      
      // Update member safely
      setMembers(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map(member => 
          member.id === memberId ? { ...member, ...response.data } : member
        );
      });
      
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error('Error updating member role:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to update member role');
      setLoading(false);
      throw error;
    }
  }, [axios, companyId]);
  
  // Remove member - memoized
  const removeMember = useCallback(async (memberId, targetCompanyId = companyId) => {
    if (!targetCompanyId || !memberId) {
      setError('Company ID and member ID are required');
      return false;
    }
    
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      await axios.delete(`${API_URL}/companies/${targetCompanyId}/members/${memberId}/`);
      
      // Remove member safely
      setMembers(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.filter(member => member.id !== memberId);
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error removing team member:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to remove team member');
      setLoading(false);
      throw error;
    }
  }, [axios, companyId]);
  
  // Clear error - memoized
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    members,
    invitations,
    loading,
    error,
    companyId,
    fetchTeamMembers,
    fetchInvitations,
    sendInvitation,
    cancelInvitation,
    updateMemberRole,
    removeMember,
    clearError
  }), [
    members,
    invitations,
    loading,
    error,
    companyId,
    fetchTeamMembers,
    fetchInvitations,
    sendInvitation,
    cancelInvitation,
    updateMemberRole,
    removeMember,
    clearError
  ]);
}