// src/store/slices/companySlice.js
import Cookies from "js-cookie";

export const createCompanySlice = (set, get) => ({
  // Company state
  company: null,
  companies: [], // For users invited to multiple companies
  companySetupStep: 1,
  isCreatingCompany: false,
  isLoadingCompany: false,
  isUpdatingCompany: false,
  isAddingBenefit: false,
  isUploadingLogo: false,
  isAddingImage: false,
  isSendingInvitation: false,
  setupProgress: {
    details: false,
    benefits: false,
    logo: false,
    images: false,
    team: false,
  },
  error: null,

  // Actions
  setCompany: (company) =>
    set((state) => {
      state.company = company;

      // Update cookies for middleware with company ID
      if (company?.id) {
        Cookies.set("company_id", company.id, {
          expires: 7, // 7 days
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("has_company", "true", {
          expires: 7,
          sameSite: "strict",
          path: "/",
        });
      } else {
        Cookies.remove("company_id", { path: "/" });
        Cookies.set("has_company", "false", {
          expires: 7,
          sameSite: "strict",
          path: "/",
        });
      }

      // Update setup progress based on loaded data
      if (company) {
        state.setupProgress = {
          details: true, // If we have a company, basic details are complete
          benefits: company.benefits && company.benefits.length > 0,
          logo: !!company.logo,
          images: company.images && company.images.length > 0,
          team: company.members && company.members.length > 1, // More than just the owner
        };
      }
    }),

  setCompanySetupStep: (step) =>
    set((state) => {
      state.companySetupStep = step;
    }),

  // Fetch the company using ID from cookies or store
  fetchCompany: async (specificId = null) => {
    set((state) => {
      state.isLoadingCompany = true;
      state.error = null;
    });
  
    try {
      // Get auth token from cookies
      const token = Cookies.get("auth_token");
  
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      // Get company ID from parameter, state, or cookies - avoid using get() here
      const companyId = specificId || Cookies.get("company_id");
  
      // If we don't have a company ID, return null without triggering more state changes
      if (!companyId) {
        set((state) => {
          state.isLoadingCompany = false;
          state.company = null;
        });
        return null;
      }
  
      // If we have a specific company ID, fetch that company
      let endpoint = `${
        process.env.NEXT_PUBLIC_API_FRONT_URL ||
        "https://api.techihub.io/api/v1"
      }/companies/`;
      
      endpoint = `${endpoint}${companyId}/`;
  
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        // If 404, it means the company doesn't exist or user doesn't have access
        if (response.status === 404) {
          // Clear company ID cookie if it was set
          if (Cookies.get("company_id")) {
            Cookies.remove("company_id", { path: "/" });
            Cookies.set("has_company", "false", {
              expires: 7,
              sameSite: "strict",
              path: "/",
            });
          }
  
          set((state) => {
            state.company = null;
            state.isLoadingCompany = false;
          });
          return null;
        }
  
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to fetch company"
        );
      }
  
      // Get the company data
      const company = await response.json();
  
      // Update company ID in cookies
      if (company?.id) {
        Cookies.set("company_id", company.id, {
          expires: 7,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("has_company", "true", {
          expires: 7,
          sameSite: "strict",
          path: "/",
        });
      }
  
      // Update company state all at once to avoid multiple renders
      set((state) => {
        state.company = company;
  
        // Update setup progress only if we have a company
        if (company) {
          state.setupProgress = {
            details: true, // If we have a company, basic details are complete
            benefits: company.benefits && company.benefits.length > 0,
            logo: !!company.logo,
            images: company.images && company.images.length > 0,
            team: company.members && company.members.length > 1, // More than just the owner
          };
        }
  
        state.isLoadingCompany = false;
      });
  
      return company;
    } catch (error) {
      console.error("Fetch company error:", error);
      
      // Update state to reflect error
      set((state) => {
        state.error = error.message;
        state.isLoadingCompany = false;
      });
      
      throw error;
    }
  },

  // Fetch all companies user is a member of
  fetchUserCompanies: async () => {
    set((state) => {
      state.isLoadingCompany = true;
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
      const response = await fetch(`${API_URL}/companies/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to fetch companies"
        );
      }

      const data = await response.json();
      const companies = data.results || data;

      set((state) => {
        state.companies = companies;

        // If no active company is set and we have companies, set the first one
        if (!state.company && companies.length > 0) {
          state.company = companies[0];

          // Update company ID in cookies
          if (companies[0].id) {
            Cookies.set("company_id", companies[0].id, {
              expires: 7,
              sameSite: "strict",
              path: "/",
            });
            Cookies.set("has_company", "true", {
              expires: 7,
              sameSite: "strict",
              path: "/",
            });
          }

          // Update setup progress for this company
          const company = companies[0];
          state.setupProgress = {
            details: true,
            benefits: company.benefits && company.benefits.length > 0,
            logo: !!company.logo,
            images: company.images && company.images.length > 0,
            team: company.members && company.members.length > 1,
          };
        } else if (companies.length === 0) {
          // No companies, update cookies
          Cookies.remove("company_id", { path: "/" });
          Cookies.set("has_company", "false", {
            expires: 7,
            sameSite: "strict",
            path: "/",
          });
        }

        state.isLoadingCompany = false;
      });

      return companies;
    } catch (error) {
      console.error("Fetch user companies error:", error);
      set((state) => {
        state.error = error.message;
        state.isLoadingCompany = false;
      });
      throw error;
    }
  },

  // Switch active company (for users with multiple companies)
  switchCompany: (companyId) =>
    set((state) => {
      const company = state.companies.find((c) => c.id === companyId);

      if (company) {
        state.company = company;

        // Update company ID in cookies
        Cookies.set("company_id", company.id, {
          expires: 7,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("has_company", "true", {
          expires: 7,
          sameSite: "strict",
          path: "/",
        });

        // Update setup progress for this company
        state.setupProgress = {
          details: true,
          benefits: company.benefits && company.benefits.length > 0,
          logo: !!company.logo,
          images: company.images && company.images.length > 0,
          team: company.members && company.members.length > 1,
        };
      }
    }),

  createCompany: async (companyData) => {
    set((state) => {
      state.isCreatingCompany = true;
      state.error = null;
    });
  
    try {
      // Get token from cookie instead of localStorage
      const token = Cookies.get("auth_token");
  
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
  
      const API_URL =
        process.env.NEXT_PUBLIC_API_FRONT_URL ||
        "https://api.techihub.io/api/v1";
      const response = await fetch(`${API_URL}/companies/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle different types of error responses
        let errorMessage;
        let fieldErrors = {};
        
        if (errorData.detail) {
          // Standard error with detail
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          // Standard error with message
          errorMessage = errorData.message;
        } else if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
          // Validation errors - extract field-specific errors
          fieldErrors = errorData;
          
          // Create a readable error message from validation errors
          const errorMessages = [];
          Object.keys(errorData).forEach(field => {
            const fieldMessages = Array.isArray(errorData[field]) ? errorData[field] : [errorData[field]];
            fieldMessages.forEach(msg => {
              errorMessages.push(`${field}: ${msg}`);
            });
          });
          
          errorMessage = errorMessages.length > 0 
            ? `Validation errors: ${errorMessages.join(', ')}`
            : "Validation errors occurred";
        } else {
          errorMessage = "Failed to create company";
        }
        
        const error = new Error(errorMessage);
        
        // Attach the response data to the error so the component can access field-specific errors
        error.response = {
          data: errorData,
          status: response.status,
          fieldErrors: fieldErrors
        };
        
        throw error;
      }
      
      const company = await response.json();
  
      // Set company ID in cookies
      Cookies.set("company_id", company.id, {
        expires: 7,
        sameSite: "strict",
        path: "/",
      });
  
      Cookies.set("has_company", "true", {
        expires: 7,
        sameSite: "strict",
        path: "/",
      });
  
      set((state) => {
        state.company = company;
        // Add to companies list if not already there
        if (
          state.companies &&
          !state.companies.find((c) => c.id === company.id)
        ) {
          state.companies.push(company);
        }
        state.setupProgress.details = true;
        state.isCreatingCompany = false;
      });
  
      return company;
    } catch (error) {
      console.error("Create company error:", error);
      set((state) => {
        state.error = error.message;
        state.isCreatingCompany = false;
      });
      throw error; // Re-throw with the response data attached
    }
  },

  updateCompany: async (companyData) => {
    set((state) => {
      state.isUpdatingCompany = true;
      state.error = null;
    });
  
    try {
      // Get company ID from store or cookies
      const companyId = get().company?.id || Cookies.get("company_id");
  
      if (!companyId) {
        throw new Error("Company ID not found");
      }
  
      const token = Cookies.get("auth_token");
  
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      const API_URL =
        process.env.NEXT_PUBLIC_API_FRONT_URL ||
        "https://api.techihub.io/api/v1";
      const response = await fetch(`${API_URL}/companies/${companyId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        
        // Create an error object that includes the response data for field-specific errors
        const error = new Error(
          errorData.detail || 
          errorData.message || 
          Object.keys(errorData).length > 0 ? "Validation errors occurred" : "Failed to update company"
        );
        
        // Attach the response data to the error so the component can access it
        error.response = {
          data: errorData,
          status: response.status
        };
        
        throw error;
      }
  
      const company = await response.json();
  
      set((state) => {
        state.company = company;
        state.isUpdatingCompany = false;
  
        // Update in companies list if present
        if (state.companies) {
          const index = state.companies.findIndex((c) => c.id === company.id);
          if (index !== -1) {
            state.companies[index] = company;
          }
        }
      });
  
      return company;
    } catch (error) {
      console.error("Update company error:", error);
      set((state) => {
        state.error = error.message;
        state.isUpdatingCompany = false;
      });
      throw error; // Re-throw with the response data attached
    }
  },

  addCompanyBenefit: async (benefitData) => {
    set((state) => {
      state.isAddingBenefit = true;
      state.error = null;
    });

    try {
      // Get company ID from store or cookies
      const companyId = get().company?.id || Cookies.get("company_id");

      if (!companyId) {
        throw new Error(
          "Company ID not found. Please complete the company details step first."
        );
      }

      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_FRONT_URL ||
        "https://api.techihub.io/api/v1";
      const response = await fetch(
        `${API_URL}/companies/${companyId}/add_benefit/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(benefitData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to add benefit"
        );
      }

      const benefit = await response.json();

      // Update company benefits
      set((state) => {
        if (!state.company.benefits) {
          state.company.benefits = [benefit];
        } else {
          state.company.benefits.push(benefit);
        }
        state.setupProgress.benefits = true;
        state.isAddingBenefit = false;
      });

      return benefit;
    } catch (error) {
      console.error("Add company benefit error:", error);
      set((state) => {
        state.error = error.message;
        state.isAddingBenefit = false;
      });
      throw error;
    }
  },

  uploadCompanyLogo: async (file) => {
    set((state) => {
      state.isUploadingLogo = true;
      state.error = null;
    });

    try {
      // Get company ID from store or cookies
      const companyId = get().company?.id || Cookies.get("company_id");

      if (!companyId) {
        throw new Error(
          "Company ID not found. Please complete the company details step first."
        );
      }

      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const formData = new FormData();
      formData.append("logo", file);

      const API_URL =
        process.env.NEXT_PUBLIC_API_FRONT_URL ||
        "https://api.techihub.io/api/v1";
      const response = await fetch(
        `${API_URL}/companies/${companyId}/upload_logo/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to upload logo"
        );
      }

      const data = await response.json();

      set((state) => {
        if (state.company) {
          state.company.logo = data.logo;
          state.setupProgress.logo = true;
        }
        state.isUploadingLogo = false;
      });

      return data;
    } catch (error) {
      console.error("Upload company logo error:", error);
      set((state) => {
        state.error = error.message;
        state.isUploadingLogo = false;
      });
      throw error;
    }
  },

  addCompanyImage: async (imageData) => {
    set((state) => {
      state.isAddingImage = true;
      state.error = null;
    });

    try {
      // Get company ID from store or cookies
      const companyId = get().company?.id || Cookies.get("company_id");

      if (!companyId) {
        throw new Error(
          "Company ID not found. Please complete the company details step first."
        );
      }

      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const formData = new FormData();
      Object.keys(imageData).forEach((key) => {
        formData.append(key, imageData[key]);
      });

      const API_URL =
        process.env.NEXT_PUBLIC_API_FRONT_URL ||
        "https://api.techihub.io/api/v1";
      const response = await fetch(
        `${API_URL}/companies/${companyId}/add_image/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to add image"
        );
      }

      const image = await response.json();

      // Update company images
      set((state) => {
        if (state.company) {
          if (!state.company.images) {
            state.company.images = [image];
          } else {
            state.company.images.push(image);
          }
          state.setupProgress.images = true;
        }
        state.isAddingImage = false;
      });

      return image;
    } catch (error) {
      console.error("Add company image error:", error);
      set((state) => {
        state.error = error.message;
        state.isAddingImage = false;
      });
      throw error;
    }
  },

  inviteTeamMember: async (inviteData) => {
    set((state) => {
      state.isSendingInvitation = true;
      state.error = null;
    });

    try {
      // Get company ID from store or cookies
      const companyId = get().company?.id || Cookies.get("company_id");

      if (!companyId) {
        throw new Error(
          "Company ID not found. Please complete the company details step first."
        );
      }

      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_FRONT_URL ||
        "https://api.techihub.io/api/v1";
      const response = await fetch(
        `${API_URL}/companies/${companyId}/invitations/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(inviteData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.message || errorData.name || "Failed to send invitation"
        );
      }

      const invitation = await response.json();

      // Update company invitations and progress
      set((state) => {
        if (state.company) {
          if (!state.company.invitations) {
            state.company.invitations = [invitation];
          } else {
            state.company.invitations.push(invitation);
          }
          state.setupProgress.team = true;
        }
        state.isSendingInvitation = false;
      });

      return invitation;
    } catch (error) {
      console.error("Invite team member error:", error);
      set((state) => {
        state.error = error.message;
        state.isSendingInvitation = false;
      });
      throw error;
    }
  },

  // Fetch company members
  fetchCompanyMembers: async () => {
    set((state) => {
      state.error = null;
    });

    try {
      // Get company ID from store or cookies
      const companyId = get().company?.id || Cookies.get("company_id");

      if (!companyId) {
        throw new Error("Company ID not found");
      }

      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_FRONT_URL ||
        "https://api.techihub.io/api/v1";
      const response = await fetch(
        `${API_URL}/companies/${companyId}/members/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
            errorData.message ||
            "Failed to fetch company members"
        );
      }

      const members = await response.json();

      // Update company members
      set((state) => {
        if (state.company) {
          state.company.members = members;
        }
      });

      return members;
    } catch (error) {
      console.error("Fetch company members error:", error);
      set((state) => {
        state.error = error.message;
      });
      throw error;
    }
  },

  // Fetch company invitations
  fetchCompanyInvitations: async () => {
    set((state) => {
      state.error = null;
    });

    try {
      // Get company ID from store or cookies
      const companyId = get().company?.id || Cookies.get("company_id");

      if (!companyId) {
        throw new Error("Company ID not found");
      }

      const token = Cookies.get("auth_token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_FRONT_URL ||
        "https://api.techihub.io/api/v1";
      const response = await fetch(
        `${API_URL}/companies/${companyId}/invitations/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
            errorData.message ||
            "Failed to fetch company invitations"
        );
      }

      const invitations = await response.json();

      // Update company invitations
      set((state) => {
        if (state.company) {
          state.company.invitations = invitations;
        }
      });

      return invitations;
    } catch (error) {
      console.error("Fetch company invitations error:", error);
      set((state) => {
        state.error = error.message;
      });
      throw error;
    }
  },

  // set companies
  setCompanies: (companies) =>
    set((state) => {
      state.companies = companies;

      // If we have companies, set the first one as active
      if (companies && companies.length > 0) {
        state.company = companies[0];

        // Update setup progress based on loaded data
        state.setupProgress = {
          details: true, // If we have a company, basic details are complete
          benefits: companies[0].benefits && companies[0].benefits.length > 0,
          logo: !!companies[0].logo,
          images: companies[0].images && companies[0].images.length > 0,
          team: companies[0].members && companies[0].members.length > 1, // More than just the owner
        };
      }
    }),

  // Update setup progress
  updateSetupProgress: (progressUpdate) =>
    set((state) => {
      state.setupProgress = {
        ...state.setupProgress,
        ...progressUpdate,
      };
    }),

  // Check if setup is complete
  isSetupComplete: () => {
    const progress = get().setupProgress;
    // Consider setup complete if details are done and at least one other section
    return (
      progress.details &&
      (progress.benefits || progress.logo || progress.images || progress.team)
    );
  },

  // Get setup completion percentage
  getSetupCompletionPercentage: () => {
    const progress = get().setupProgress;
    const steps = Object.values(progress);
    const completed = steps.filter((step) => step).length;
    return Math.round((completed / steps.length) * 100);
  },

  // Reset company state (used during logout)
  resetCompanyState: () => {
    // Clear company cookies
    Cookies.remove("company_id", { path: "/" });
    Cookies.remove("has_company", { path: "/" });

    set((state) => {
      state.company = null;
      state.companies = [];
      state.companySetupStep = 1;
      state.isCreatingCompany = false;
      state.isLoadingCompany = false;
      state.isUpdatingCompany = false;
      state.isAddingBenefit = false;
      state.isUploadingLogo = false;
      state.isAddingImage = false;
      state.isSendingInvitation = false;
      state.setupProgress = {
        details: false,
        benefits: false,
        logo: false,
        images: false,
        team: false,
      };
      state.error = null;
    });
  },

  // Clear error
  clearError: () =>
    set((state) => {
      state.error = null;
    }),
});
