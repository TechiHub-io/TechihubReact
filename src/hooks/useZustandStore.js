// src/hooks/useZustandStore.js
import useStore from '../store';

export { useStore };

// Helper hooks for specific slices
export const useAuthStore = () => useStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isEmployer: state.isEmployer,
  token: state.token,
  refreshToken: state.refreshToken,
  login: state.login,
  logout: state.logout,
  register: state.register,
  verifyEmail: state.verifyEmail,
  requestPasswordReset: state.requestPasswordReset,
  resetPassword: state.resetPassword,
  refreshAuthToken: state.refreshAuthToken,
  updateUser: state.updateUser,
  clearError: state.clearError,
  loading: state.loading,
  error: state.error
}));

export const useProfileStore = () => useStore((state) => ({
  profile: state.profile,
  experiences: state.experiences,
  education: state.education,
  skills: state.skills,
  certifications: state.certifications,
  portfolioItems: state.portfolioItems,
  fetchProfile: state.fetchProfile,
  updateProfile: state.updateProfile,
  addExperience: state.addExperience,
  updateExperience: state.updateExperience,
  deleteExperience: state.deleteExperience,
  addEducation: state.addEducation,
  updateEducation: state.updateEducation,
  deleteEducation: state.deleteEducation,
  addSkill: state.addSkill,
  updateSkill: state.updateSkill,
  deleteSkill: state.deleteSkill,
  addCertification: state.addCertification,
  updateCertification: state.updateCertification,
  deleteCertification: state.deleteCertification,
  addPortfolioItem: state.addPortfolioItem,
  updatePortfolioItem: state.updatePortfolioItem,
  deletePortfolioItem: state.deletePortfolioItem,
  loading: state.loading,
  error: state.error,
  clearError: state.clearError
}));

export const useJobsStore = () => useStore((state) => ({
  jobs: state.jobs,
  currentJob: state.currentJob,
  savedJobs: state.savedJobs,
  filters: state.filters,
  pagination: state.pagination,
  fetchJobs: state.fetchJobs,
  fetchJobById: state.fetchJobById,
  createJob: state.createJob,
  updateJob: state.updateJob,
  deleteJob: state.deleteJob,
  toggleJobStatus: state.toggleJobStatus,
  addJobSkill: state.addJobSkill,
  saveJob: state.saveJob,
  unsaveJob: state.unsaveJob,
  setFilters: state.setFilters,
  setPage: state.setPage,
  loading: state.loading,
  error: state.error,
  clearError: state.clearError
}));

export const useApplicationsStore = () => useStore((state) => ({
  applications: state.applications,
  currentApplication: state.currentApplication,
  applicationQuestions: state.applicationQuestions,
  currentQuestion: state.currentQuestion,
  stats: state.stats,
  filters: state.filters,
  pagination: state.pagination,
  fetchApplications: state.fetchApplications,
  fetchApplicationById: state.fetchApplicationById,
  updateApplicationStatus: state.updateApplicationStatus,
  fetchJobApplications: state.fetchJobApplications,
  fetchJobQuestions: state.fetchJobQuestions,
  createJobQuestion: state.createJobQuestion,
  updateJobQuestion: state.updateJobQuestion,
  deleteJobQuestion: state.deleteJobQuestion,
  fetchApplicationStats: state.fetchApplicationStats,
  submitApplication: state.submitApplication,
  withdrawApplication: state.withdrawApplication,
  setFilters: state.setFilters,
  setPage: state.setPage,
  loading: state.loading,
  error: state.error,
  clearError: state.clearError
}));

export const useCompanyStore = () => useStore((state) => ({
  company: state.company,
  companies: state.companies,
  companySetupStep: state.companySetupStep,
  isCreatingCompany: state.isCreatingCompany,
  isLoadingCompany: state.isLoadingCompany,
  isUpdatingCompany: state.isUpdatingCompany,
  isAddingBenefit: state.isAddingBenefit,
  isUploadingLogo: state.isUploadingLogo,
  isAddingImage: state.isAddingImage,
  isSendingInvitation: state.isSendingInvitation,
  setupProgress: state.setupProgress,
  setCompany: state.setCompany,
  setCompanySetupStep: state.setCompanySetupStep,
  fetchCompany: state.fetchCompany,
  fetchUserCompanies: state.fetchUserCompanies,
  switchCompany: state.switchCompany,
  createCompany: state.createCompany,
  updateCompany: state.updateCompany,
  addCompanyBenefit: state.addCompanyBenefit,
  uploadCompanyLogo: state.uploadCompanyLogo,
  addCompanyImage: state.addCompanyImage,
  inviteTeamMember: state.inviteTeamMember,
  fetchCompanyMembers: state.fetchCompanyMembers,
  fetchCompanyInvitations: state.fetchCompanyInvitations,
  setCompanies: state.setCompanies,
  updateSetupProgress: state.updateSetupProgress,
  isSetupComplete: state.isSetupComplete,
  getSetupCompletionPercentage: state.getSetupCompletionPercentage,
  resetCompanyState: state.resetCompanyState,
  loading: state.isLoadingCompany,
  error: state.error,
  clearError: state.clearError
}));

export const useMessagesStore = () => useStore((state) => ({
  conversations: state.conversations,
  currentConversation: state.currentConversation,
  messages: state.messages,
  unreadCount: state.unreadCount,
  pagination: state.pagination,
  fetchConversations: state.fetchConversations,
  fetchConversation: state.fetchConversation,
  fetchMessages: state.fetchMessages,
  loadMoreMessages: state.loadMoreMessages,
  createConversation: state.createConversation,
  sendMessage: state.sendMessage,
  markConversationAsRead: state.markConversationAsRead,
  fetchUnreadCount: state.fetchUnreadCount,
  resetPagination: state.resetPagination,
  updatePagination: state.updatePagination,
  loading: state.loading,
  error: state.error,
  clearError: state.clearError
}));

export const useUIStore = () => useStore((state) => ({
  modals: state.modals,
  notifications: state.notifications,
  sidebarOpen: state.sidebarOpen,
  isLoading: state.isLoading,
  error: state.error,
  openModal: state.openModal,
  closeModal: state.closeModal,
  toggleModal: state.toggleModal,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
  toggleSidebar: state.toggleSidebar,
  setSidebarOpen: state.setSidebarOpen,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
  resetUI: state.resetUI
}));

export const useThemeStore = () => useStore((state) => ({
  isDarkMode: state.isDarkMode,
  theme: state.theme,
  toggleDarkMode: state.toggleDarkMode,
  setDarkMode: state.setDarkMode,
  initializeTheme: state.initializeTheme,
  setThemeColor: state.setThemeColor,
  resetTheme: state.resetTheme
}));

export const useTeamStore = () => useStore((state) => ({
  teamMembers: state.teamMembers,
  teamInvitations: state.teamInvitations,
  fetchTeamMembers: state.fetchTeamMembers,
  fetchTeamInvitations: state.fetchTeamInvitations,
  sendInvitation: state.sendInvitation,
  cancelInvitation: state.cancelInvitation,
  removeMember: state.removeMember,
  updateMemberRole: state.updateMemberRole,
  acceptInvitation: state.acceptInvitation,
  loading: state.loading,
  error: state.error,
  clearError: state.clearError
}));

export const useAnalyticsStore = () => useStore((state) => ({
  analyticsData: state.analyticsData,
  dateRange: state.dateRange,
  setAnalyticsData: state.setAnalyticsData,
  setDateRange: state.setDateRange,
  fetchDashboardAnalytics: state.fetchDashboardAnalytics,
  fetchJobViews: state.fetchJobViews,
  fetchApplicationStats: state.fetchApplicationStats,
  fetchAllAnalytics: state.fetchAllAnalytics,
  loading: state.loading,
  error: state.error,
  clearError: state.clearError
}));