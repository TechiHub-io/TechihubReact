// src/hooks/useApplicationMessaging.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthAxios from './useAuthAxios';

export function useApplicationMessaging() {
  const axios = useAuthAxios();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startConversationWithApplicant = async (application) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Get full application details to get applicant user info
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const applicationResponse = await axios.get(`${API_URL}/applications/${application.id}/`);
      const fullApplication = applicationResponse.data;

      // Check if we have applicant user info
      if (!fullApplication.user || !fullApplication.user.id) {
        throw new Error('Could not find applicant user information');
      }

      const applicantUserId = fullApplication.user.id;
      const applicantName = fullApplication.user.first_name && fullApplication.user.last_name 
        ? `${fullApplication.user.first_name} ${fullApplication.user.last_name}`
        : fullApplication.user.email.split('@')[0]; // fallback to email username

      // Step 2: Check if conversation already exists for this application
      try {
        const conversationsResponse = await axios.get(`${API_URL}/conversations/`);
        const existingConversation = conversationsResponse.data.results?.find(conv => 
          conv.application === application.id
        );

        if (existingConversation) {
          // Navigate to existing conversation
          router.push(`/messages/${existingConversation.id}`);
          setLoading(false);
          return existingConversation;
        }
      } catch (convError) {
        console.error('Could not check existing conversations, creating new one', convError);
      }

      // Step 3: Create new conversation with correct conversation_type
      const conversationData = {
        participant_ids: [applicantUserId],
        conversation_type: "job_application", // Changed from "application_followup"
        subject: `Regarding your application for ${application.job.title}`,
        initial_message: `Hi ${applicantName}, thank you for your application for the ${application.job.title} position. I wanted to reach out to discuss your application further.`,
        job: application.job.id,
        application: application.id
      };


      const conversationResponse = await axios.post(`${API_URL}/conversations/`, conversationData);
      const conversation = conversationResponse.data;

      // Step 4: Navigate to the conversation
      router.push(`/messages/${conversation.id}`);

      setLoading(false);
      return conversation;

    } catch (error) {
      console.error('Error starting conversation:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to start conversation';
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    startConversationWithApplicant,
    loading,
    error,
    clearError
  };
}