// src/lib/api/jobs.js
import api from './index';

export const jobsApi = {
  getJobs: (params) => api.get('/jobs/', { params }),
  
  getJobById: (id) => api.get(`/jobs/${id}/`),
  
  createJob: (data) => api.post('/jobs/', data),
  
  updateJob: (id, data) => api.put(`/jobs/${id}/`, data),
  
  deleteJob: (id) => api.delete(`/jobs/${id}/`),
  
  searchJobs: (params) => api.get('/jobs/search/', { params }),
  
  getFeaturedJobs: () => api.get('/jobs/featured/'),
  
  getSimilarJobs: (id) => api.get(`/jobs/${id}/similar/`),
  
  getCompanyJobs: (companyId) => api.get(`/jobs/company/${companyId}/`),
  
  // Job actions
  activateJob: (id) => api.post(`/jobs/${id}/activate/`),
  
  deactivateJob: (id) => api.post(`/jobs/${id}/deactivate/`),
  
  featureJob: (id) => api.post(`/jobs/${id}/feature/`),
  
  // Job skills
  addJobSkill: (jobId, data) => api.post(`/jobs/${jobId}/add_skill/`, data),
  
  // Saved jobs
  getSavedJobs: () => api.get('/favorites/jobs/'),
  
  saveJob: (jobId) => api.post('/favorites/jobs/', { job: jobId }),
  
  unsaveJob: (jobId) => api.delete(`/favorites/jobs/${jobId}/`),
};