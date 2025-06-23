// src/hooks/useTeamCollaboration.js - Updated for real API
import { useState, useCallback } from 'react';
import useAuthAxios from './useAuthAxios';

export function useTeamCollaboration() {
  const axios = useAuthAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get team comments/feedback (using real API)
  const getTeamComments = useCallback(async (applicationId) => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.get(`${API_URL}/applications/${applicationId}/comments/`);

      setLoading(false);
      return response.data.results || response.data || [];
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch comments');
      setLoading(false);
      return [];
    }
  }, [axios]);

  // Add team comment/feedback (using real API)
  const addTeamComment = useCallback(async (applicationId, comment) => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.post(`${API_URL}/applications/${applicationId}/comments/`, {
        content: comment.content,
        rating: comment.rating || null,
        recommendation: comment.recommendation || null,
        is_private: comment.is_private || false
      });

      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add comment');
      setLoading(false);
      throw err;
    }
  }, [axios]);

  // Create conversation for team discussion (using real API)
  const createTeamConversation = useCallback(async (applicationId, participantIds, subject, message) => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.post(`${API_URL}/conversations/`, {
        participant_ids: participantIds,
        subject: subject,
        initial_message: message,
        conversation_type: "team_discussion",
        application: applicationId
      });

      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create conversation');
      setLoading(false);
      throw err;
    }
  }, [axios]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    getTeamComments,
    addTeamComment,
    createTeamConversation,
    loading,
    error,
    clearError
  };
}