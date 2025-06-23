// src/lib/api/companies.js
import api from './index';

export const companiesApi = {
  getCompanies: (params) => api.get('/companies/', { params }),
  
  getCompanyById: (id) => api.get(`/companies/${id}/`),
  
  createCompany: (data) => api.post('/companies/', data),
  
  updateCompany: (id, data) => api.put(`/companies/${id}/`, data),
  
  deleteCompany: (id) => api.delete(`/companies/${id}/`),
  
  uploadCompanyLogo: (id, file) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post(`/companies/${id}/upload_logo/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // Company benefits
  addBenefit: (companyId, data) => api.post(`/companies/${companyId}/add_benefit/`, data),
  
  updateBenefit: (companyId, benefitId, data) => 
    api.put(`/companies/${companyId}/benefits/${benefitId}/`, data),
  
  deleteBenefit: (companyId, benefitId) => 
    api.delete(`/companies/${companyId}/benefits/${benefitId}/`),
  
  // Company images
  addImage: (companyId, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return api.post(`/companies/${companyId}/add_image/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  deleteImage: (companyId, imageId) => 
    api.delete(`/companies/${companyId}/images/${imageId}/`),
  
  // Company reviews
  addReview: (companyId, data) => api.post(`/companies/${companyId}/add_review/`, data),
  
  // Company members
  getMembers: (companyId) => api.get(`/companies/${companyId}/members/`),
  
  addMember: (companyId, data) => api.post(`/companies/${companyId}/members/`, data),
  
  updateMember: (companyId, memberId, data) => 
    api.put(`/companies/${companyId}/members/${memberId}/`, data),
  
  removeMember: (companyId, memberId) => 
    api.delete(`/companies/${companyId}/members/${memberId}/`),
  
  // Company invitations
  getInvitations: (companyId) => api.get(`/companies/${companyId}/invitations/`),
  
  sendInvitation: (companyId, data) => 
    api.post(`/companies/${companyId}/invitations/`, data),
  
  cancelInvitation: (companyId, invitationId) => 
    api.delete(`/companies/${companyId}/invitations/${invitationId}/`),
  
  acceptInvitation: (token) => 
    api.post(`/companies/invitations/${token}/accept/`),
};