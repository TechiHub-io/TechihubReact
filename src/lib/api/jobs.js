// src/lib/api/jobs.js
import api from './index';

export const jobsApi = {
  // Regular job operations
  getJobs: (params) => api.get('/jobs/', { params }),
  
  getJobById: (id) => api.get(`/jobs/${id}/`),
  
  createJob: (data) => api.post('/jobs/', data),
  
  updateJob: (id, data) => api.put(`/jobs/${id}/`, data),
  
  deleteJob: (id) => api.delete(`/jobs/${id}/`),
  
  // Job search
  searchJobs: (params) => api.get('/jobs/search/', { params }),
  
  getFeaturedJobs: () => api.get('/jobs/featured/'),
  
  getSimilarJobs: (jobId) => api.get(`/jobs/${jobId}/similar/`),
  
  // Company jobs
  getCompanyJobs: (companyId, params) => api.get(`/jobs/company/${companyId}/`, { params }),
  
  // Admin-specific job operations
  createAdminJob: (data) => api.post('/jobs/admin-create/', data),
  
  updateAdminJob: (jobId, data) => api.put(`/jobs/${jobId}/admin-update/`, data),
  
  getAdminPostedJobs: (params) => api.get('/jobs/admin-posted/', { params }),
  
  bulkUpdateJobs: (data) => api.post('/jobs/bulk-update/', data),
  
  activateJob: (jobId) => api.post(`/jobs/${jobId}/activate/`),
  
  deactivateJob: (jobId) => api.post(`/jobs/${jobId}/deactivate/`),
  
  // Job favorites
  getFavoriteJobs: () => api.get('/favorites/jobs/'),
  
  addToFavorites: (jobId) => api.post(`/favorites/jobs/${jobId}/`),
  
  removeFromFavorites: (jobId) => api.delete(`/favorites/jobs/${jobId}/`),
  
  // Job analytics
  getJobViews: (jobId) => api.get(`/analytics/job-views/${jobId}/`),
};