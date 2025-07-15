// src/hooks/useCompany.js
import { useStore } from './useZustandStore';
import useAuthAxios from './useAuthAxios';
import Cookies from 'js-cookie';

/**
 * Custom hook for accessing company-related state and actions
 * @returns {Object} Company-related state and actions
 */
export function useCompany() {
  const axios = useAuthAxios();
  
  // Select relevant state and actions from the store
  const {
    company,
    companies,
    companySetupStep,
    isLoading,
    isCreatingCompany,
    isUpdatingCompany,
    isUploadingLogo,
    isAddingBenefit,
    isAddingImage,
    isSendingInvitation,
    setupProgress,
    error,
    
    setCompany,
    setCompanySetupStep,
    fetchCompany,
    fetchUserCompanies,
    switchCompany,
    createCompany,
    updateCompany,
    addCompanyBenefit: storeAddCompanyBenefit,
    uploadCompanyLogo,
    addCompanyImage: storeAddCompanyImage,
    inviteTeamMember,
    fetchCompanyMembers,
    fetchCompanyInvitations,
    cancelInvitation,
    removeTeamMember,
    updateTeamMemberRole,
    isSetupComplete,
    getSetupCompletionPercentage,
    clearError
  } = useStore(state => ({
    // State
    company: state.company,
    companies: state.companies,
    companySetupStep: state.companySetupStep,
    isLoading: state.isLoadingCompany,
    isCreatingCompany: state.isCreatingCompany,
    isUpdatingCompany: state.isUpdatingCompany,
    isUploadingLogo: state.isUploadingLogo,
    isAddingBenefit: state.isAddingBenefit,
    isAddingImage: state.isAddingImage,
    isSendingInvitation: state.isSendingInvitation,
    setupProgress: state.setupProgress,
    error: state.error,
    
    // Actions
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
    cancelInvitation: state.cancelInvitation,
    removeTeamMember: state.removeTeamMember,
    updateTeamMemberRole: state.updateTeamMemberRole,
    isSetupComplete: state.isSetupComplete,
    getSetupCompletionPercentage: state.getSetupCompletionPercentage,
    clearError: state.clearError
  }));

  /**
   * Initializes company data by fetching user companies
   * @returns {Promise<Object|null>} The active company or null
   */
  const initializeCompany = async () => {
    try {
      // First try to fetch all companies to see if user belongs to multiple
      await fetchUserCompanies();
      
      // If no company is set but we have companies, fetch the first one
      if (!company && companies.length > 0) {
        return await fetchCompany();
      }
      
      return company;
    } catch (error) {
      console.error('Error initializing company data:', error);
      return null;
    }
  };

  /**
   * Add a new benefit to the company
   * @param {Object} benefitData - Benefit data to add
   * @returns {Promise<Object>} - The created benefit
   */
  const addBenefit = async (benefitData) => {
    try {
      const companyId = company?.id || Cookies.get('company_id');
      
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      
      let response;
      
      // Use the store method if available
      if (typeof storeAddCompanyBenefit === 'function') {
        response = await storeAddCompanyBenefit(benefitData);
      } else {
        // Direct API call if store method not available
        const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
        const apiResponse = await axios.post(`${API_URL}/companies/${companyId}/add_benefit/`, benefitData);
        response = apiResponse.data;
      }
      
      // Extract the actual benefit data from the response
      const actualBenefitData = response.data || response; // Changed variable name to avoid conflict
      
      // ALWAYS update local state after successful API call
      if (company && actualBenefitData) {
        setCompany({
          ...company,
          benefits: company.benefits ? [...company.benefits, actualBenefitData] : [actualBenefitData]
        });
      }
      
      return actualBenefitData;
    } catch (error) {
      console.error('Error adding company benefit:', error);
      throw error;
    }
  };
  
  /**
   * Delete a company benefit
   * @param {string} companyId - Company ID
   * @param {string} benefitId - Benefit ID to delete
   * @returns {Promise<boolean>} - Success status
   */
  const deleteBenefit = async (companyId, benefitId) => {
    try {
      if (!companyId) {
        companyId = company?.id || Cookies.get('company_id');
        if (!companyId) {
          throw new Error('Company ID is required');
        }
      }
      
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      await axios.delete(`${API_URL}/companies/${companyId}/benefits/${benefitId}/`);
      
      // Update local state
      if (company && company.benefits) {
        setCompany({
          ...company,
          benefits: company.benefits.filter(benefit => benefit.id !== benefitId)
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting benefit:', error);
      throw error;
    }
  };
  
  /**
   * Add a new image to the company gallery
   * @param {Object} imageData - Image data with file and caption
   * @returns {Promise<Object>} - The created image entry
   */
  const addImage = async (imageData) => {
    try {
      const companyId = company?.id || Cookies.get('company_id');
      
      if (!companyId) {
        throw new Error('Company ID is required');
      }
  
      let response;
      
      // Use store method if available
      if (typeof storeAddCompanyImage === 'function') {
        response = await storeAddCompanyImage(imageData);
      } else {
        const formData = new FormData();
        if (imageData.image) {
          formData.append('image', imageData.image);
        }
        if (imageData.caption) {
          formData.append('caption', imageData.caption);
        }
        if (imageData.display_order) {
          formData.append('display_order', imageData.display_order);
        }
        
        const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
        const apiResponse = await axios.post(
          `${API_URL}/companies/${companyId}/add_image/`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        response = apiResponse.data;
      }
      
      
      // Extract the actual image data from the response
      const actualImageData = response.data || response; // Changed variable name to avoid conflict
      
      // ALWAYS update local state after successful API call
      if (company && actualImageData) {
        const updatedCompany = {
          ...company,
          images: company.images ? [...company.images, actualImageData] : [actualImageData]
        };
        
        setCompany(updatedCompany);
      }
      
      return actualImageData; // Return the actual image data
    } catch (error) {
      console.error('Error uploading company image:', error);
      throw error;
    }
  };
  
  /**
   * Delete a company gallery image
   * @param {string} companyId - Company ID
   * @param {string} imageId - Image ID to delete
   * @returns {Promise<boolean>} - Success status
   */
  const deleteImage = async (companyId, imageId) => {
    try {
      if (!companyId) {
        companyId = company?.id || Cookies.get('company_id');
        if (!companyId) {
          throw new Error('Company ID is required');
        }
      }
      
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      await axios.delete(`${API_URL}/companies/${companyId}/images/${imageId}/`);
      
      // Update local state
      if (company && company.images) {
        setCompany({
          ...company,
          images: company.images.filter(image => image.id !== imageId)
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting company image:', error);
      throw error;
    }
  };
  
  /**
   * Add a team member to the company
   * @param {Object} memberData - Member data to add
   * @returns {Promise<Object>} - The created team member
   */
  const addTeamMember = async (memberData) => {
    try {
      const companyId = company?.id || Cookies.get('company_id');
      
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.post(`${API_URL}/companies/${companyId}/members/`, memberData);
      
      // Update local state if company has members array
      if (company && company.members) {
        setCompany({
          ...company,
          members: [...company.members, response.data]
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  };
  
  /**
   * Send invitation to join team
   * @param {Object} inviteData - Invitation data with email and role
   * @returns {Promise<Object>} - The created invitation
   */
  const sendTeamInvitation = async (inviteData) => {
    try {
      const companyId = company?.id || Cookies.get('company_id');
      
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      
      // Use store method if available
      if (typeof inviteTeamMember === 'function') {
        return await inviteTeamMember(inviteData);
      }
      
      // Direct API call if store method not available
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await axios.post(`${API_URL}/companies/${companyId}/invitations/`, inviteData);
      
      // Update local state
      if (company) {
        const updatedCompany = { ...company };
        if (!updatedCompany.invitations) {
          updatedCompany.invitations = [response.data];
        } else {
          updatedCompany.invitations.push(response.data);
        }
        setCompany(updatedCompany);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error sending team invitation:', error);
      throw error;
    }
  };
  
  // Derived state
  const hasMultipleCompanies = companies.length > 1;
  const isAnyLoading = isLoading || isCreatingCompany || isUpdatingCompany || 
                       isUploadingLogo || isAddingBenefit || isAddingImage || 
                       isSendingInvitation;

  return {
    // State
    company,
    companies,
    companySetupStep,
    isLoading,
    isCreatingCompany,
    isUpdatingCompany,
    isUploadingLogo, 
    isAddingBenefit,
    isAddingImage,
    isSendingInvitation,
    isAnyLoading,
    setupProgress,
    error,
    hasMultipleCompanies,
    
    // Core company actions
    setCompany,
    setCompanySetupStep,
    fetchCompany,
    fetchUserCompanies,
    initializeCompany,
    switchCompany,
    createCompany,
    updateCompany,
    uploadCompanyLogo,
    isSetupComplete,
    getSetupCompletionPercentage,
    clearError,
    
    // Enhanced benefit methods
    addCompanyBenefit: addBenefit,
    deleteBenefit,
    
    // Enhanced image gallery methods
    addCompanyImage: addImage,
    deleteImage,
    
    // Enhanced team management methods
    addTeamMember,
    inviteTeamMember: sendTeamInvitation,
    fetchCompanyMembers,
    fetchCompanyInvitations,
    cancelInvitation,
    removeTeamMember,
    updateTeamMemberRole
  };
}