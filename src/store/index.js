// src/store/index.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Import all slices
import { createAuthSlice } from './slices/authSlice';
import { createProfileSlice } from './slices/profileSlice';
import { createJobsSlice } from './slices/jobsSlice';
import { createApplicationsSlice } from './slices/applicationsSlice';
import { createCompanySlice } from './slices/companySlice';
import { createUISlice } from './slices/uiSlice';
import { createThemeSlice } from './slices/themeSlice';
import { createTeamSlice } from './slices/teamSlice';
import { createAnalyticsSlice } from './slices/analyticsSlice';
import { createMessagesSlice } from './slices/messagesSlice';

// Create store with all slices
const useStore = create(
  devtools(
    persist(
      immer((...args) => ({
        ...createAuthSlice(...args),
        ...createProfileSlice(...args),
        ...createJobsSlice(...args),
        ...createApplicationsSlice(...args),
        ...createCompanySlice(...args),
        ...createUISlice(...args),
        ...createThemeSlice(...args),
        ...createTeamSlice(...args),
        ...createAnalyticsSlice(...args),
        ...createMessagesSlice(...args),
      })),
      {
        name: 'techhub-storage',
        partialize: (state) => ({
          // Persist relevant state
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
          isEmployer: state.isEmployer,
          company: state.company,
          companies: state.companies,
          isDarkMode: state.isDarkMode,
          unreadCount: state.unreadCount, 
          profile: state.profile,
          hasCompletedProfile: state.hasCompletedProfile,
          // Potentially add other states that need to be persisted
        }),
        merge: (persistedState, currentState) => {
          // Merge the states but protect against stale data
          const mergedState = { ...currentState, ...persistedState };
          
          // Ensure arrays are properly initialized
          mergedState.applications = Array.isArray(mergedState.applications) ? mergedState.applications : [];
          mergedState.jobs = Array.isArray(mergedState.jobs) ? mergedState.jobs : [];
          mergedState.companies = Array.isArray(mergedState.companies) ? mergedState.companies : [];
          mergedState.teamMembers = Array.isArray(mergedState.teamMembers) ? mergedState.teamMembers : [];
          mergedState.teamInvitations = Array.isArray(mergedState.teamInvitations) ? mergedState.teamInvitations : [];
          mergedState.conversations = Array.isArray(mergedState.conversations) ? mergedState.conversations : [];
          mergedState.messages = Array.isArray(mergedState.messages) ? mergedState.messages : [];
          
          // If user has changed or logged out, reset sensitive state
          if (!mergedState.user || 
              (currentState.user && persistedState.user && 
               mergedState.user.id !== currentState.user?.id)) {
            mergedState.company = null;
            mergedState.companies = [];
            mergedState.jobs = [];
            mergedState.applications = [];
            mergedState.teamMembers = [];
            mergedState.teamInvitations = [];
            mergedState.conversations = []; // Reset conversations
            mergedState.messages = []; // Reset messages
            mergedState.unreadCount = 0; // Reset unread count
          }
          
          return mergedState;
        },
      }
    )
  )
);

export default useStore;