// src/lib/api/admin.js
import api from './index';

export const adminApi = {
  // Dashboard Analytics
  getDashboardAnalytics: () => api.get('/analytics/dashboard/'),
  
  // Application Statistics
  getApplicationStats: () => api.get('/analytics/application-stats/'),
  
  // Job Management
  getAdminPostedJobs: (params) => api.get('/jobs/admin-posted/', { params }),
  
  createAdminJob: (data) => api.post('/jobs/admin-create/', data),
  
  bulkUpdateJobs: (data) => api.post('/jobs/bulk-update/', data),
  
  activateJob: (jobId) => api.post(`/jobs/${jobId}/activate/`),
  
  deactivateJob: (jobId) => api.post(`/jobs/${jobId}/deactivate/`),
  
  // User Activities
  getUserActivities: () => api.get('/analytics/activities/'),
  
  // Daily Statistics
  getDailyStatistics: () => api.get('/analytics/daily-stats/'),
  
  // User Growth Metrics
  getUserGrowthMetrics: () => api.get('/analytics/user-growth/'),
  
  // Trending Searches
  getTrendingSearches: () => api.get('/analytics/trending-searches/'),
};