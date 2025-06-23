// src/lib/api/applications.js
import api from './index';

export const applicationsApi = {
  getApplications: (params) => api.get('/applications/', { params }),
  
  getApplicationById: (id) => api.get(`/applications/${id}/`),
  
  submitApplication: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'answers' && typeof data[key] === 'object') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    
    return api.post('/applications/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  updateApplicationStatus: (id, data) => 
    api.patch(`/applications/${id}/status/`, data),
  
  withdrawApplication: (id) => 
    api.post(`/applications/${id}/withdraw/`),
  
  // Get applications for a specific job
  getJobApplications: (jobId, params) => 
    api.get(`/applications/job/${jobId}/`, { params }),
  
  // Get application questions for a job
  getJobQuestions: (jobId) => 
    api.get(`/applications/questions/${jobId}/`),
  
  // Application analytics
  getApplicationStats: () => 
    api.get('/analytics/application-stats/'),
};