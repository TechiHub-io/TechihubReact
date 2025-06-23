// src/store/slices/profileSlice.js
import Cookies from "js-cookie";

export const createProfileSlice = (set, get) => ({
  // Profile state
  profile: null,
  profileId: null,
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  portfolioItems: [],
  isLoadingProfile: false,
  isUpdatingProfile: false,
  isAddingExperience: false,
  isAddingEducation: false,
  isAddingSkill: false,
  isAddingCertification: false,
  isAddingPortfolioItem: false,
  error: null,

 
  // Actions
  setProfile: (profile) =>
    set((state) => {
      state.profile = profile;
      
      // Sync nested data from profile response to separate arrays
      if (profile) {
        state.experiences = profile.experiences || [];
        state.education = profile.education || [];
        state.skills = profile.skills || [];
        state.certifications = profile.certifications || [];
        state.portfolioItems = profile.portfolio_items || [];
      }
  }),

    
  setProfileId: (id) =>
    set((state) => {
      state.profileId = id;
    }),

  // Fetch the current user's profile ID
  fetchProfileId: async () => {
    set((state) => {
      state.isLoadingProfile = true;
      state.error = null;
    });

    try {
      const token = Cookies.get("auth_token");
  
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/user/profile-id/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to fetch profile ID"
        );
      }
  
      const data = await response.json();
      
      set((state) => {
        state.profileId = data.profile_id;
        state.isLoadingProfile = false;
      });

      return data.profile_id;
    } catch (error) {
      console.error("Fetch profile ID error:", error);
      set((state) => {
        state.error = error.message;
        state.isLoadingProfile = false;
      });
      throw error;
    }
  },

  fetchProfile: async () => {
    set((state) => {
      state.isLoadingProfile = true;
      state.error = null;
    });

    try {
      let profileId = get().profileId;
      
      if (!profileId) {
        profileId = await get().fetchProfileId();
      }
      
      if (!profileId) {
        set((state) => {
          state.profile = null;
          state.experiences = [];
          state.education = [];
          state.skills = [];
          state.certifications = [];
          state.portfolioItems = [];
          state.isLoadingProfile = false;
        });
        return null;
      }
      
      const token = Cookies.get("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          set((state) => {
            state.profile = null;
            state.experiences = [];
            state.education = [];
            state.skills = [];
            state.certifications = [];
            state.portfolioItems = [];
            state.isLoadingProfile = false;
          });
          return null;
        }
        
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to fetch profile"
        );
      }

      const data = await response.json();

      set((state) => {
        state.profile = data;
        // Sync nested arrays from the profile response
        state.experiences = data.experiences || [];
        state.education = data.education || [];
        state.skills = data.skills || [];
        state.certifications = data.certifications || [];
        state.portfolioItems = data.portfolio_items || [];
        state.isLoadingProfile = false;
      });

      Cookies.set("has_completed_profile", "true", {
        expires: 7,
        sameSite: "strict",
        path: "/",
      });

      return data;
    } catch (error) {
      console.error("Fetch profile error:", error);
      set((state) => {
        state.error = error.message;
        state.isLoadingProfile = false;
      });
      
      if (error.message.includes('Not found')) {
        return null;
      }
      
      throw error;
    }
  },

  createProfile: async (profileData) => {
    set((state) => {
      state.isUpdatingProfile = true;
      state.error = null;
    });

    try {
      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to create profile"
        );
      }

      const data = await response.json();

      // Store the profile ID
      set((state) => {
        state.profileId = data.id;
        state.profile = data;
        state.isUpdatingProfile = false;
      });

      return data;
    } catch (error) {
      console.error("Create profile error:", error);
      set((state) => {
        state.error = error.message;
        state.isUpdatingProfile = false;
      });
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    set((state) => {
      state.isUpdatingProfile = true;
      state.error = null;
    });

    try {
      const profileId = get().profileId;
      if (!profileId) {
        throw new Error("Profile ID is missing");
      }
      
      const token = Cookies.get("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Get current profile data to preserve existing values
      const currentProfile = get().profile;
      
      // Structure the data according to API expectations
      const apiPayload = {
        // User data nested under 'user' object
        user: {
          username: currentProfile?.user?.username || currentProfile?.user?.email, // Keep existing username
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone || null,
          email: profileData.email,
        },
        
        // Profile-specific fields
        bio: profileData.bio,
        job_title: profileData.job_title,
        years_experience: parseInt(profileData.years_experience) || 0,
        country: profileData.country,
        salary_min: profileData.salary_min ? parseFloat(profileData.salary_min).toFixed(2) : null,
        salary_max: profileData.salary_max ? parseFloat(profileData.salary_max).toFixed(2) : null,
        salary_currency: profileData.salary_currency || 'USD',
        
        // Preserve existing values for fields not being updated
        profile_picture: currentProfile?.profile_picture || null,
        social_avatar_url: currentProfile?.social_avatar_url || null,
      };

      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";

        
      const response = await fetch(`${API_URL}/profiles/${profileId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile update error response:', errorData); // Debug log
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to update profile"
        );
      }

      const data = await response.json();

      set((state) => {
        state.profile = data;
        // Sync nested arrays
        state.experiences = data.experiences || [];
        state.education = data.education || [];
        state.skills = data.skills || [];
        state.certifications = data.certifications || [];
        state.portfolioItems = data.portfolio_items || [];
        state.isUpdatingProfile = false;
      });

      return data;
    } catch (error) {
      console.error("Update profile error:", error);
      set((state) => {
        state.error = error.message;
        state.isUpdatingProfile = false;
      });
      throw error;
    }
  },

  uploadProfilePicture: async (file) => {
    set((state) => {
      state.isUpdatingProfile = true;
      state.error = null;
    });

    try {
      // Get profile ID
      const profileId = get().profileId;
      
      if (!profileId) {
        throw new Error("Profile ID is missing. Please create a profile first.");
      }
      
      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Create form data
      const formData = new FormData();
      formData.append('profile_picture', file);

      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/upload-profile-picture/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to upload profile picture"
        );
      }

      const data = await response.json();

      set((state) => {
        state.profile = { ...state.profile, profile_picture: data.profile_picture };
        state.isUpdatingProfile = false;
      });

      return data;
    } catch (error) {
      console.error("Upload profile picture error:", error);
      set((state) => {
        state.error = error.message;
        state.isUpdatingProfile = false;
      });
      throw error;
    }
  },

  addExperience: async (experienceData) => {
    set((state) => {
      state.isAddingExperience = true;
      state.error = null;
    });

    try {
      const profileId = get().profileId;
      if (!profileId) {
        throw new Error("Profile ID is missing. Please create a profile first.");
      }
      
      const token = Cookies.get("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/experiences/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(experienceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to add experience"
        );
      }

      const data = await response.json();

      set((state) => {
        // Add to both the separate array and update profile
        state.experiences.push(data);
        if (state.profile) {
          state.profile.experiences = state.experiences;
        }
        state.isAddingExperience = false;
      });

      return data;
    } catch (error) {
      console.error("Add experience error:", error);
      set((state) => {
        state.error = error.message;
        state.isAddingExperience = false;
      });
      throw error;
    }
  },

  updateExperience: async (experienceId, experienceData) => {
    set((state) => {
      state.isAddingExperience = true;
      state.error = null;
    });

    try {
      const profileId = get().profileId;
      if (!profileId) {
        throw new Error("Profile ID is missing");
      }
      
      const token = Cookies.get("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/experiences/${experienceId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(experienceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to update experience"
        );
      }

      const data = await response.json();

      set((state) => {
        // Update in experiences array
        const index = state.experiences.findIndex(exp => exp.id === experienceId);
        if (index !== -1) {
          state.experiences[index] = data;
        }
        // Update in profile if it exists
        if (state.profile && state.profile.experiences) {
          const profileIndex = state.profile.experiences.findIndex(exp => exp.id === experienceId);
          if (profileIndex !== -1) {
            state.profile.experiences[profileIndex] = data;
          }
        }
        state.isAddingExperience = false;
      });

      return data;
    } catch (error) {
      console.error("Update experience error:", error);
      set((state) => {
        state.error = error.message;
        state.isAddingExperience = false;
      });
      throw error;
    }
  },

  deleteExperience: async (experienceId) => {
    try {
      const profileId = get().profileId;
      if (!profileId) {
        throw new Error("Profile ID is missing");
      }
      
      const token = Cookies.get("auth_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/experiences/${experienceId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to delete experience"
        );
      }

      set((state) => {
        // Remove from experiences array
        state.experiences = state.experiences.filter(exp => exp.id !== experienceId);
        // Remove from profile if it exists
        if (state.profile && state.profile.experiences) {
          state.profile.experiences = state.profile.experiences.filter(exp => exp.id !== experienceId);
        }
      });

      return true;
    } catch (error) {
      console.error("Delete experience error:", error);
      set((state) => {
        state.error = error.message;
      });
      throw error;
    }
  },

  // Education methods
  addEducation: async (educationData) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      // Get profile ID first
      const profileIdResponse = await fetch(`${API_URL}/user/profile-id/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profileIdResponse.ok) {
        throw new Error('Failed to fetch profile ID');
      }

      const { profile_id } = await profileIdResponse.json();

      const response = await fetch(`${API_URL}/profiles/${profile_id}/education/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(educationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add education');
      }

      const newEducation = await response.json();

      set((state) => {
        state.education = [...state.education, newEducation];
        state.loading = false;
      });

      return newEducation;
    } catch (error) {
      console.error('Error adding education:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },


  updateEducation: async (educationId, educationData) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      // Get profile ID first
      const profileIdResponse = await fetch(`${API_URL}/user/profile-id/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profileIdResponse.ok) {
        throw new Error('Failed to fetch profile ID');
      }

      const { profile_id } = await profileIdResponse.json();

      // Check if education exists first
      const checkResponse = await fetch(`${API_URL}/profiles/${profile_id}/education/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (checkResponse.ok) {
        const educationList = await checkResponse.json();
        const educationExists = Array.isArray(educationList) && 
          educationList.some(ed => ed.id === educationId);

        if (!educationExists) {
          throw new Error('Education record not found. It may have been deleted.');
        }
      }

      const response = await fetch(`${API_URL}/profiles/${profile_id}/education/${educationId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(educationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update education');
      }

      const updatedEducation = await response.json();

      set((state) => {
        const index = state.education.findIndex(ed => ed.id === educationId);
        if (index !== -1) {
          state.education[index] = updatedEducation;
        }
        state.loading = false;
      });

      return updatedEducation;
    } catch (error) {
      console.error('Error updating education:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  deleteEducation: async (educationId) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      
      // Get profile ID first
      const profileIdResponse = await fetch(`${API_URL}/user/profile-id/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profileIdResponse.ok) {
        throw new Error('Failed to fetch profile ID');
      }

      const { profile_id } = await profileIdResponse.json();

      const response = await fetch(`${API_URL}/profiles/${profile_id}/education/${educationId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete education');
      }

      set((state) => {
        state.education = state.education.filter(ed => ed.id !== educationId);
        state.loading = false;
      });

      return true;
    } catch (error) {
      console.error('Error deleting education:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  // Skills methods
  addSkill: async (skillData) => {
    set((state) => {
      state.isAddingSkill = true;
      state.error = null;
    });

    try {
      // Get profile ID
      const profileId = get().profileId;
      
      if (!profileId) {
        throw new Error("Profile ID is missing. Please create a profile first.");
      }
      
      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/skills/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(skillData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to add skill"
        );
      }

      const data = await response.json();

      set((state) => {
        state.skills.push(data);
        state.isAddingSkill = false;
      });

      return data;
    } catch (error) {
      console.error("Add skill error:", error);
      set((state) => {
        state.error = error.message;
        state.isAddingSkill = false;
      });
      throw error;
    }
  },

  updateSkill: async (skillId, skillData) => {
    set((state) => {
      state.isAddingSkill = true;
      state.error = null;
    });

    try {
      const profileId = get().profileId;
      const token = Cookies.get("auth_token");
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/skills/${skillId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(skillData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || errorData.name || "Failed to update skill");
      }

      const data = await response.json();

      set((state) => {
        const index = state.skills.findIndex(skill => skill.id === skillId);
        if (index !== -1) {
          state.skills[index] = data;
        }
        if (state.profile && state.profile.skills) {
          const profileIndex = state.profile.skills.findIndex(skill => skill.id === skillId);
          if (profileIndex !== -1) {
            state.profile.skills[profileIndex] = data;
          }
        }
        state.isAddingSkill = false;
      });

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.isAddingSkill = false;
      });
      throw error;
    }
  },


  deleteSkill: async (skillId) => {
    try {
      const profileId = get().profileId;
      const token = Cookies.get("auth_token");
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/skills/${skillId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || errorData.name || "Failed to delete skill");
      }

      set((state) => {
        state.skills = state.skills.filter(skill => skill.id !== skillId);
        if (state.profile && state.profile.skills) {
          state.profile.skills = state.profile.skills.filter(skill => skill.id !== skillId);
        }
      });

      return true;
    } catch (error) {
      set((state) => { state.error = error.message; });
      throw error;
    }
  },


  // Certifications methods
  addCertification: async (certificationData) => {
    set((state) => {
      state.isAddingCertification = true;
      state.error = null;
    });

    try {
      const profileId = get().profileId;
      const token = Cookies.get("auth_token");
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/certifications/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(certificationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || errorData.name || "Failed to add certification");
      }

      const data = await response.json();

      set((state) => {
        state.certifications.push(data);
        if (state.profile) {
          state.profile.certifications = state.certifications;
        }
        state.isAddingCertification = false;
      });

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.isAddingCertification = false;
      });
      throw error;
    }
  },

  updateCertification: async (certId, certData) => {
    try {
      const profileId = get().profileId;
      const token = Cookies.get("auth_token");
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/certifications/${certId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(certData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || errorData.name || "Failed to update certification");
      }

      const data = await response.json();

      set((state) => {
        const index = state.certifications.findIndex(cert => cert.id === certId);
        if (index !== -1) {
          state.certifications[index] = data;
        }
        if (state.profile && state.profile.certifications) {
          const profileIndex = state.profile.certifications.findIndex(cert => cert.id === certId);
          if (profileIndex !== -1) {
            state.profile.certifications[profileIndex] = data;
          }
        }
      });

      return data;
    } catch (error) {
      set((state) => { state.error = error.message; });
      throw error;
    }
  },

  deleteCertification: async (certId) => {
    try {
      const profileId = get().profileId;
      const token = Cookies.get("auth_token");
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/certifications/${certId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || errorData.name || "Failed to delete certification");
      }

      set((state) => {
        state.certifications = state.certifications.filter(cert => cert.id !== certId);
        if (state.profile && state.profile.certifications) {
          state.profile.certifications = state.profile.certifications.filter(cert => cert.id !== certId);
        }
      });

      return true;
    } catch (error) {
      set((state) => { state.error = error.message; });
      throw error;
    }
  },

  // Portfolio items methods
  addPortfolioItem: async (portfolioItemData) => {
    set((state) => {
      state.isAddingPortfolioItem = true;
      state.error = null;
    });

    try {
      // Get profile ID
      const profileId = get().profileId;
      
      if (!profileId) {
        throw new Error("Profile ID is missing. Please create a profile first.");
      }
      
      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // For portfolio items with files, we need to use FormData
      const formData = new FormData();
      
      // Add all fields to the form data
      Object.keys(portfolioItemData).forEach(key => {
        if (key === 'image' && portfolioItemData[key] instanceof File) {
          formData.append(key, portfolioItemData[key]);
        } else {
          formData.append(key, portfolioItemData[key]);
        }
      });

      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/portfolio/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type when using FormData, browser will set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to add portfolio item"
        );
      }

      const data = await response.json();

      set((state) => {
        state.portfolioItems.push(data);
        state.isAddingPortfolioItem = false;
      });

      return data;
    } catch (error) {
      console.error("Add portfolio item error:", error);
      set((state) => {
        state.error = error.message;
        state.isAddingPortfolioItem = false;
      });
      throw error;
    }
  },

  updatePortfolioItem: async (id, portfolioItemData) => {
    set((state) => {
      state.isUpdatingProfile = true;
      state.error = null;
    });

    try {
      // Get profile ID
      const profileId = get().profileId;
      
      if (!profileId) {
        throw new Error("Profile ID is missing. Please create a profile first.");
      }
      
      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // For portfolio items with files, we need to use FormData
      const formData = new FormData();
      
      // Add all fields to the form data
      Object.keys(portfolioItemData).forEach(key => {
        if (key === 'image' && portfolioItemData[key] instanceof File) {
          formData.append(key, portfolioItemData[key]);
        } else {
          formData.append(key, portfolioItemData[key]);
        }
      });

      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/portfolio/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type when using FormData, browser will set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to update portfolio item"
        );
      }

      const data = await response.json();

      set((state) => {
        const index = state.portfolioItems.findIndex((item) => item.id === id);
        if (index !== -1) {
          state.portfolioItems[index] = data;
        }
        state.isUpdatingProfile = false;
      });

      return data;
    } catch (error) {
      console.error("Update portfolio item error:", error);
      set((state) => {
        state.error = error.message;
        state.isUpdatingProfile = false;
      });
      throw error;
    }
  },

  deletePortfolioItem: async (id) => {
    set((state) => {
      state.isUpdatingProfile = true;
      state.error = null;
    });

    try {
      // Get profile ID
      const profileId = get().profileId;
      
      if (!profileId) {
        throw new Error("Profile ID is missing. Please create a profile first.");
      }
      
      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const API_URL = 
        process.env.NEXT_PUBLIC_API_FRONT_URL || 
        "https://api.techihub.io/api/v1";
        
      const response = await fetch(`${API_URL}/profiles/${profileId}/portfolio/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // For delete operations, check if response is empty or has an error message
        if (response.status !== 204) { // 204 No Content is a successful delete
          const errorData = await response.json();
          throw new Error(
            errorData.detail || errorData.message || errorData.name || "Failed to delete portfolio item"
          );
        }
      }

      set((state) => {
        state.portfolioItems = state.portfolioItems.filter((item) => item.id !== id);
        state.isUpdatingProfile = false;
      });

      return true;
    } catch (error) {
      console.error("Delete portfolio item error:", error);
      set((state) => {
        state.error = error.message;
        state.isUpdatingProfile = false;
      });
      throw error;
    }
  },

  // Reset profile state
  resetProfileState: () => {
    set((state) => {
      state.profile = null;
      state.profileId = null;
      state.experiences = [];
      state.education = [];
      state.skills = [];
      state.certifications = [];
      state.portfolioItems = [];
      state.isLoadingProfile = false;
      state.isUpdatingProfile = false;
      state.isAddingExperience = false;
      state.isAddingEducation = false;
      state.isAddingSkill = false;
      state.isAddingCertification = false;
      state.isAddingPortfolioItem = false;
      state.error = null;
    });
  },

  // Clear error
  clearError: () =>
    set((state) => {
      state.error = null;
    }),
});