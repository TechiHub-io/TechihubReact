// src/lib/api/profiles.js
import api from './index';

export const profilesApi = {
  getCurrentProfile: () => api.get('/profiles/me/'),
  
  updateProfile: (data) => api.put('/profiles/me/', data),
  
  getProfileById: (id) => api.get(`/profiles/${id}/`),
  
  // Experience endpoints
  addExperience: (data) => api.post('/profiles/me/experiences/', data),
  
  updateExperience: (id, data) => api.put(`/profiles/me/experiences/${id}/`, data),
  
  deleteExperience: (id) => api.delete(`/profiles/me/experiences/${id}/`),
  
  // Education endpoints
  addEducation: (data) => api.post('/profiles/me/education/', data),
  
  updateEducation: (id, data) => api.put(`/profiles/me/education/${id}/`, data),
  
  deleteEducation: (id) => api.delete(`/profiles/me/education/${id}/`),
  
  // Skills endpoints
  addSkill: (data) => api.post('/profiles/me/skills/', data),
  
  updateSkill: (id, data) => api.put(`/profiles/me/skills/${id}/`, data),
  
  deleteSkill: (id) => api.delete(`/profiles/me/skills/${id}/`),
  
  // Certifications endpoints
  addCertification: (data) => api.post('/profiles/me/certifications/', data),
  
  updateCertification: (id, data) => api.put(`/profiles/me/certifications/${id}/`, data),
  
  deleteCertification: (id) => api.delete(`/profiles/me/certifications/${id}/`),
  
  // Portfolio items endpoints
  addPortfolioItem: (data) => api.post('/profiles/me/portfolio/', data),
  
  updatePortfolioItem: (id, data) => api.put(`/profiles/me/portfolio/${id}/`, data),
  
  deletePortfolioItem: (id) => api.delete(`/profiles/me/portfolio/${id}/`),
};