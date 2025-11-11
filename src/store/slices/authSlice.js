// src/store/slices/authSlice.js 
import { socialAuth } from "@/lib/api/auth";
import Cookies from "js-cookie";

export const createAuthSlice = (set, get) => ({
  // Auth state
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isEmployer: false,
  loading: false,
  error: null,
  verificationEmail: null,
  sessionValid: true,
  pendingInvitations: [],
  hasPendingInvitations: false,
  _hasHydrated: false,

  // Actions
  setHasHydrated: (hasHydrated) =>
    set((state) => {
      state._hasHydrated = hasHydrated;
    }),

  setUser: (user) =>
    set((state) => {
      state.user = user;
      state.isEmployer = user?.is_employer || false;

      // Set user role in cookie for middleware
      if (user) {

        
        // Handle super admin users - check multiple fields since user_type might be undefined
        let userRole = "jobseeker"; // default
        if (user.user_type === "super_admin" || 
            (user.is_staff && user.is_superuser)) {
          userRole = "super_admin";
        } else if (user.is_employer) {
          userRole = "employer";
        }
        

        
        Cookies.set("user_role", userRole, {
          expires: 1, // 1 day
          sameSite: "strict",
          path: "/",
        });
        
        // For super admin, set profile as completed immediately
        if (userRole === "super_admin") {

          Cookies.set("has_completed_profile", "true", {
            expires: 7,
            sameSite: "strict",
            path: "/",
          });
        }
        

      } else {
        Cookies.remove("user_role", { path: "/" });
      }
    }),

  setToken: (token, refreshToken) =>
    set((state) => {
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = !!token;
      state.sessionValid = !!token;

      // Store tokens in cookies for middleware and persistence
      if (token) {
        Cookies.set("auth_token", token, {
          expires: 1, // 1 day
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("refresh_token", refreshToken, {
          expires: 7, // 7 days
          sameSite: "strict",
          path: "/",
        });
      } else {
        Cookies.remove("auth_token", { path: "/" });
        Cookies.remove("refresh_token", { path: "/" });
      }
    }),

  // Initialize authentication state from cookies
  initializeAuth: async () => {

    const token = Cookies.get("auth_token");
    const refreshToken = Cookies.get("refresh_token");
    

    
    if (!token) {

      return false;
    }
    

    
    // Set tokens first
    set((state) => {
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.loading = true;
    });

    // Validate session and get user data
    const result = await get().validateSession();

    return result;
  },

  // Session validation
  validateSession: async () => {
    const token = get().token || Cookies.get("auth_token");
    
    if (!token) {
      set((state) => {
        state.loading = false;
      });
      return get().logout();
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/auth/verify-token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        set((state) => {
          state.loading = false;
        });
        return get().logout();
      }

      const data = await response.json();

      // Update user data from validation response
      if (data.user) {
        set((state) => {
          state.user = data.user;
          state.isEmployer = data.user.is_employer || false;
          state.sessionValid = true;
          state.loading = false;
        });
        
        // Set user in cookies as well
        get().setUser(data.user);
      } else {
        set((state) => {
          state.sessionValid = true;
          state.loading = false;
        });
      }

      return true;
    } catch (error) {
      console.error("Session validation error:", error);
      set((state) => {
        state.loading = false;
      });
      return get().logout();
    }
  },

  // Enhanced login with profile strength checking
  login: async (credentials) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const loginEndpoint = `${API_URL}/auth/login/`;

      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Login failed. Please check your credentials."
        );
      }

      const data = await response.json();

      // ✅ NEW: Handle pending invitations
      if (data.has_pending_invitations && data.pending_invitations) {
        // Store invitations in sessionStorage for the invitations page
        sessionStorage.setItem('pending_invitations', JSON.stringify(data.pending_invitations));
        
        // Set a flag in cookies for middleware
        Cookies.set("has_pending_invitations", "true", {
          expires: 1,
          sameSite: "strict",
          path: "/",
        });
      } else {
        // Clear any existing invitation flags
        Cookies.remove("has_pending_invitations", { path: "/" });
        sessionStorage.removeItem('pending_invitations');
      }

      // Set auth cookies (existing code)
      Cookies.set("auth_token", data.access, {
        expires: 1,
        sameSite: "strict",
        path: "/",
      });

      Cookies.set("refresh_token", data.refresh, {
        expires: 7,
        sameSite: "strict",
        path: "/",
      });


      
      // Additional check for super admin detection
      const isSuperAdminByType = data?.user?.user_type === "super_admin";
      const isSuperAdminByFlags = data?.user?.is_staff && data?.user?.is_superuser;
      const isSuperAdminByEmail = data?.user?.email === "vitalis@gmail.com"; // Temporary check for your specific user
      
      
      // Handle super admin users - check multiple fields since user_type might be undefined
      let userRole = "jobseeker"; // default
      if (data?.user?.user_type === "super_admin" || 
          (data?.user?.is_staff && data?.user?.is_superuser) ||
          data?.user?.email === "vitalis@gmail.com") { // Temporary check for your specific user
        userRole = "super_admin";
      } else if (data?.user?.is_employer) {
        userRole = "employer";
      }
      

      
      Cookies.set("user_role", userRole, {
        expires: 1,
        sameSite: "strict",
        path: "/",
      });
      
      // For super admin, set profile as completed immediately
      if (userRole === "super_admin") {

        Cookies.set("has_completed_profile", "true", {
          expires: 7,
          sameSite: "strict",
          path: "/",
        });
      }
      
   

      // Initialize userCompanies variable in proper scope
      let userCompanies = [];
      // Handle super admin users first (with fallback detection)
      if (data?.user?.user_type === "super_admin" || 
          (data?.user?.is_staff && data?.user?.is_superuser) ||
          data?.user?.email === "vitalis@gmail.com") { // Temporary check for your specific user
        
        Cookies.set("has_completed_profile", "true", {
          expires: 7,
          sameSite: "strict",
          path: "/",
        });
      }
      // Handle employer flow (existing logic)
      else if (data?.user?.is_employer) {
        try {
          const companiesResponse = await fetch(`${API_URL}/companies/me/`, {
            headers: {
              Authorization: `Bearer ${data.access}`,
              "Content-Type": "application/json",
            },
          });

          if (companiesResponse.ok) {
            userCompanies = await companiesResponse.json();
            if (Array.isArray(userCompanies) && userCompanies.length > 0) {
              Cookies.set("company_id", userCompanies[0].id, {
                expires: 7,
                sameSite: "strict",
                path: "/",
              });
              Cookies.set("has_company", "true", {
                expires: 7,
                sameSite: "strict",
                path: "/",
              });
              if (userCompanies.length > 1) {
                Cookies.set("has_multiple_companies", "true", {
                  expires: 7,
                  sameSite: "strict",
                  path: "/",
                });
              } else {
                Cookies.remove("has_multiple_companies", { path: "/" });
              }
            } else {
              Cookies.set("has_company", "false", {
                expires: 7,
                sameSite: "strict",
                path: "/",
              });
              Cookies.remove("company_id", { path: "/" });
              Cookies.remove("has_multiple_companies", { path: "/" });
            }
          } else {
            console.error("Failed to fetch user companies:", companiesResponse.status);
            Cookies.set("has_company", "false", {
              expires: 7,
              sameSite: "strict",
              path: "/",
            });
          }
        } catch (error) {
          console.error("Error checking user companies:", error);
          Cookies.set("has_company", "false", {
            expires: 7,
            sameSite: "strict",
            path: "/",
          });
        }
      } 
      // Enhanced job seeker flow (existing logic)
      else {
        try {
          const profileIdResponse = await fetch(`${API_URL}/user/profile-id/`, {
            headers: {
              Authorization: `Bearer ${data.access}`,
              "Content-Type": "application/json",
            },
          });

          if (profileIdResponse.ok) {
            const { profile_id } = await profileIdResponse.json();
            
            if (profile_id) {
              const profileResponse = await fetch(`${API_URL}/profiles/${profile_id}/`, {
                headers: {
                  Authorization: `Bearer ${data.access}`,
                  "Content-Type": "application/json",
                },
              });

              if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                const profileStrength = profileData.profile_strength || 0;
                
                if (profileStrength >= 20) {
                  Cookies.set("has_completed_profile", "true", {
                    expires: 7,
                    sameSite: "strict",
                    path: "/",
                  });
                } else {
                  Cookies.set("has_completed_profile", "false", {
                    expires: 7,
                    sameSite: "strict",
                    path: "/",
                  });
                }
                
                set((state) => {
                  state.profile = profileData;
                  state.profileId = profile_id;
                });
              } else {
                Cookies.set("has_completed_profile", "false", {
                  expires: 7,
                  sameSite: "strict",
                  path: "/",
                });
              }
            } else {
              Cookies.set("has_completed_profile", "false", {
                expires: 7,
                sameSite: "strict",
                path: "/",
              });
            }
          } else {
            Cookies.set("has_completed_profile", "false", {
              expires: 7,
              sameSite: "strict",
              path: "/",
            });
          }
        } catch (error) {
          console.error("Error checking profile strength:", error);
          Cookies.set("has_completed_profile", "false", {
            expires: 7,
            sameSite: "strict",
            path: "/",
          });
        }
      }

      // Update auth state
      set((state) => {
        state.user = data.user;
        state.token = data.access;
        state.refreshToken = data.refresh;
        state.isAuthenticated = true;
        state.isEmployer = data?.user?.is_employer;
        state.sessionValid = true;
        state.loading = false;
        
        // ✅ NEW: Store invitation data in state
        if (data.has_pending_invitations) {
          state.pendingInvitations = data.pending_invitations;
          state.hasPendingInvitations = true;
        } else {
          state.pendingInvitations = [];
          state.hasPendingInvitations = false;
        }

        if (data?.user?.is_employer) {
          state.companies = userCompanies;
          if (userCompanies.length > 0) {
            state.company = userCompanies[0];
          }
        }
      });

      return data;
    } catch (error) {
      console.error("Login error:", error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
        state.sessionValid = false;
      });
      throw error;
    }
  },


  changePassword: async (currentPassword, newPassword) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/auth/password-change/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${get().token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
          new_password2: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Password change failed";

        if (typeof errorData === "object") {
          const errorMessages = [];
          for (const [field, errors] of Object.entries(errorData)) {
            if (Array.isArray(errors)) {
              errorMessages.push(`${field}: ${errors.join(", ")}`);
            } else {
              errorMessages.push(`${field}: ${errors}`);
            }
          }
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join("; ");
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      set((state) => {
        state.loading = false;
      });

      return data;
    } catch (error) {
      console.error("Password change error:", error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  register: async (userData) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const registerEndpoint = `${API_URL}/auth/register/`;

      const transformedData = {
        username: userData.email,
        email: userData.email,
        password: userData.password,
        password2: userData.confirmPassword,
        first_name: userData.firstName,
        last_name: userData.lastName,
        is_employer: userData.isEmployer,
        company_name: userData.companyName,
      };

      const response = await fetch(registerEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Registration failed";

        if (typeof errorData === "object") {
          const errorMessages = [];
          for (const [field, errors] of Object.entries(errorData)) {
            if (Array.isArray(errors)) {
              errorMessages.push(`${field}: ${errors.join(", ")}`);
            } else {
              errorMessages.push(`${field}: ${errors}`);
            }
          }
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join("; ");
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      set((state) => {
        state.loading = false;
        state.verificationEmail = userData.email;
      });

      // Store registration type in cookies for middleware to know what to do after verification
      if (userData.isEmployer) {
        Cookies.set("registration_type", "employer", {
          expires: 1,
          sameSite: "strict",
          path: "/",
        });
      } else {
        Cookies.set("registration_type", "jobseeker", {
          expires: 1,
          sameSite: "strict",
          path: "/",
        });
      }

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  acceptInvitation: async (invitationToken) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });
  
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/companies/invitations/${invitationToken}/accept/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${get().token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to accept invitation');
      }
  
      const data = await response.json();
  
      // Remove the accepted invitation from state
      set((state) => {
        state.pendingInvitations = state.pendingInvitations.filter(
          inv => inv.token !== invitationToken
        );
        state.hasPendingInvitations = state.pendingInvitations.length > 0;
        state.loading = false;
      });
  
      // Update sessionStorage
      const updatedInvitations = get().pendingInvitations;
      if (updatedInvitations.length > 0) {
        sessionStorage.setItem('pending_invitations', JSON.stringify(updatedInvitations));
      } else {
        sessionStorage.removeItem('pending_invitations');
        Cookies.remove("has_pending_invitations", { path: "/" });
      }
  
      return data;
    } catch (error) {
      console.error("Accept invitation error:", error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },
  
  declineInvitation: async (invitationId) => {
    // Remove the invitation from state (you might want to add a backend endpoint for this)
    set((state) => {
      state.pendingInvitations = state.pendingInvitations.filter(
        inv => inv.id !== invitationId
      );
      state.hasPendingInvitations = state.pendingInvitations.length > 0;
    });
  
    // Update sessionStorage
    const updatedInvitations = get().pendingInvitations;
    if (updatedInvitations.length > 0) {
      sessionStorage.setItem('pending_invitations', JSON.stringify(updatedInvitations));
    } else {
      sessionStorage.removeItem('pending_invitations');
      Cookies.remove("has_pending_invitations", { path: "/" });
    }
  },
  
  clearInvitations: () => {
    set((state) => {
      state.pendingInvitations = [];
      state.hasPendingInvitations = false;
    });
    sessionStorage.removeItem('pending_invitations');
    Cookies.remove("has_pending_invitations", { path: "/" });
  },

  verifyEmail: async (token) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/auth/verify-email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      set((state) => {
        state.loading = false;
      });

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  requestPasswordReset: async (email) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/auth/password-reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset request failed");
      }

      set((state) => {
        state.loading = false;
      });

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/auth/password-reset/confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: password,
          new_password2: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      set((state) => {
        state.loading = false;
      });

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  refreshAuthToken: async () => {
    // Get refresh token from store or cookie
    const refreshToken = get().refreshToken || Cookies.get("refresh_token");

    if (!refreshToken) {
      return get().logout();
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        return get().logout();
      }

      // Update token in state and cookie
      set((state) => {
        state.token = data.access;
        state.sessionValid = true;
      });

      Cookies.set("auth_token", data.access, {
        expires: 1,
        sameSite: "strict",
        path: "/",
      });

      return data;
    } catch (error) {
      return get().logout();
    }
  },

  socialLogin: async (provider, accessToken) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const data = await socialAuth(provider, accessToken);
      
      
      // ✅ Set ALL required middleware cookies
      
      // 1. Auth tokens (using the correct cookie names from your other methods)
      Cookies.set("auth_token", data.access, {
        expires: 1, // 1 day to match your existing login
        sameSite: "strict",
        path: "/",
      });
      
      Cookies.set("refresh_token", data.refresh, {
        expires: 7, // 7 days to match your existing login
        sameSite: "strict",
        path: "/",
      });

      // 2. User role (critical for middleware)
      // Console log for debugging super admin
     
      
      // Handle super admin users - check multiple fields since user_type might be undefined
      let userRole = "jobseeker"; // default
      if (data?.user?.user_type === "super_admin" || 
          (data?.user?.is_staff && data?.user?.is_superuser)) {
        userRole = "super_admin";
      } else if (data?.user?.is_employer) {
        userRole = "employer";
      }
      
      Cookies.set("user_role", userRole, {
        expires: 1,
        sameSite: "strict",
        path: "/",
      });
      
      // For super admin, set profile as completed immediately
      if (userRole === "super_admin") {
        Cookies.set("has_completed_profile", "true", {
          expires: 7,
          sameSite: "strict",
          path: "/",
        });
      }

      // 3. Profile ID for easy access
      if (data.profile_id) {
        Cookies.set("profile_id", data.profile_id, {
          expires: 7,
          sameSite: "strict",
          path: "/",
        });
      }

      // 4. Handle super admin users first (with fallback detection)
      if (data?.user?.user_type === "super_admin" || 
          (data?.user?.is_staff && data?.user?.is_superuser)) {
        Cookies.set("has_completed_profile", "true", {
          expires: 7,
          sameSite: "strict",
          path: "/",
        });
      }
      // 5. Handle employer-specific cookies
      else if (data?.user?.is_employer) {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
          const companiesResponse = await fetch(`${API_URL}/companies/me/`, {
            headers: {
              Authorization: `Bearer ${data.access}`,
              "Content-Type": "application/json",
            },
          });

          if (companiesResponse.ok) {
            userCompanies = await companiesResponse.json();
            
            if (Array.isArray(userCompanies) && userCompanies.length > 0) {
              // Has company
              Cookies.set("has_company", "true", {
                expires: 7,
                sameSite: "strict",
                path: "/",
              });
              
              Cookies.set("company_id", userCompanies[0].id, {
                expires: 7,
                sameSite: "strict",
                path: "/",
              });

              if (userCompanies.length > 1) {
                Cookies.set("has_multiple_companies", "true", {
                  expires: 7,
                  sameSite: "strict",
                  path: "/",
                });
              } else {
                Cookies.remove("has_multiple_companies", { path: "/" });
              }
              
              // Employer with company = completed profile
              Cookies.set("has_completed_profile", "true", {
                expires: 7,
                sameSite: "strict",
                path: "/",
              });
            } else {
              // No company
              Cookies.set("has_company", "false", {
                expires: 7,
                sameSite: "strict",
                path: "/",
              });
              Cookies.remove("company_id", { path: "/" });
              Cookies.remove("has_multiple_companies", { path: "/" });
              
              // Employer without company = needs setup
              Cookies.set("has_completed_profile", "false", {
                expires: 7,
                sameSite: "strict",
                path: "/",
              });
            }
          } else {
            console.error("Failed to fetch companies:", companiesResponse.status);
            Cookies.set("has_company", "false", {
              expires: 7,
              sameSite: "strict",
              path: "/",
            });
            Cookies.set("has_completed_profile", "false", {
              expires: 7,
              sameSite: "strict",
              path: "/",
            });
          }
        } catch (error) {
          console.error("Error fetching companies:", error);
          Cookies.set("has_company", "false", {
            expires: 7,
            sameSite: "strict",
            path: "/",
          });
          Cookies.set("has_completed_profile", "false", {
            expires: 7,
            sameSite: "strict",
            path: "/",
          });
        }
      } 
      // 5. Handle job seeker profile strength
      else {
        try {
          const profileStrength = data.profile?.profile_strength || 0;
          
          // ✅ Use > 20 threshold as requested
          const hasCompletedProfile = profileStrength > 20;
          
          Cookies.set("has_completed_profile", hasCompletedProfile.toString(), {
            expires: 7,
            sameSite: "strict",
            path: "/",
          });
          
        } catch (error) {
          console.error("Error checking profile strength:", error);
          Cookies.set("has_completed_profile", "false", {
            expires: 7,
            sameSite: "strict",
            path: "/",
          });
        }
      }

      // 6. Update auth state
      set((state) => {
        state.user = data.user;
        state.profile = data.profile;
        state.profileId = data.profile_id;
        state.token = data.access;
        state.refreshToken = data.refresh;
        state.isAuthenticated = true;
        state.isEmployer = data?.user?.is_employer;
        state.sessionValid = true;
        state.loading = false;

        if (data?.user?.is_employer) {
          state.companies = userCompanies;
          if (userCompanies.length > 0) {
            state.company = userCompanies[0];
          }
        }
      });

      return data;
    } catch (error) {
      console.error("Social login error:", error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
        state.sessionValid = false;
      });
      throw error;
    }
  },

  // Enhanced logout with comprehensive cleanup including localStorage
  logout: () => {
    
    // Define ALL possible cookies that might exist
    const allApplicationCookies = [
      // Auth-related cookies
      "auth_token",
      "refresh_token", 
      "user_role",
      
      // Company-related cookies
      "has_company",
      "company_id", 
      "has_multiple_companies",
      "company_setup_step",
      
      // Profile-related cookies
      "has_completed_profile",
      "profile_id",
      
      // Invitation cookies
      "has_pending_invitations",

      // Registration flow cookies
      "registration_type",
      
      // Theme/UI preferences
      "theme_preference",
      "sidebar_collapsed",
      
      // Any other application-specific cookies
      "last_visited_page",
      "onboarding_completed",
      "tour_completed"
    ];

    // Clear all cookies
    allApplicationCookies.forEach(cookieName => {
      Cookies.remove(cookieName, { path: "/" });
      // Also try removing with different path configurations
      Cookies.remove(cookieName, { path: "/", domain: window.location.hostname });
      Cookies.remove(cookieName); // Default path
    });

    // Clear ALL localStorage and sessionStorage
    try {
      // Clear specific application storage
      localStorage.removeItem("techhub-storage");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("company_data");
      localStorage.removeItem("profile_data");
      sessionStorage.removeItem('pending_invitations');
      
      // Clear all localStorage (if you want complete cleanup)
      const localStorageKeys = Object.keys(localStorage);
      localStorageKeys.forEach(key => {
        if (key.startsWith('techhub') || key.includes('auth') || key.includes('user')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear all sessionStorage
      sessionStorage.clear();

    } catch (error) {
      console.error("Error clearing storage:", error);
    }

    // Reset ALL state in the store
    set((state) => {
      // Auth state
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isEmployer = false;
      state.error = null;
      state.verificationEmail = null;
      state.sessionValid = false;
      state.pendingInvitations = [];
      state.hasPendingInvitations = false;
      
      // Company state
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
      
      // Profile state
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
      
      // Jobs state
      state.jobs = [];
      state.currentJob = null;
      state.savedJobs = [];
      
      // Applications state
      state.applications = [];
      state.currentApplication = null;
      state.applicationQuestions = [];
      state.currentQuestion = null;
      
      // Messages state
      state.conversations = [];
      state.currentConversation = null;
      state.messages = [];
      state.unreadCount = 0;
      
      // Team state
      state.teamMembers = [];
      state.teamInvitations = [];
      
      // Analytics state
      state.analyticsData = {
        jobViews: [],
        applicationStats: {
          statusBreakdown: [],
          timeToHire: 0,
          conversionRate: 0
        },
        jobPerformance: [],
        topSources: [],
        dailyApplications: []
      };
      
      // UI state
      state.modals = {
        loginModal: false,
        registerModal: false,
        applicationModal: false,
        jobModal: false,
        messageModal: false,
      };
      state.notifications = [];
      state.error = null;
    });

    // Call individual slice reset methods if they exist
    try {
      const state = get();
      if (state.resetCompanyState) state.resetCompanyState();
      if (state.resetProfileState) state.resetProfileState();
      if (state.resetUI) state.resetUI();
    } catch (error) {
      console.error("Error calling reset methods:", error);
    }

    // Force page refresh to ensure complete cleanup and middleware takes effect
    window.location.href = "/auth/login";
  },

  updateUser: (userData) =>
    set((state) => {
      state.user = { ...state.user, ...userData };

      // Update role cookie if needed
      if (userData?.is_employer !== undefined) {
        Cookies.set(
          "user_role",
          userData?.is_employer ? "employer" : "jobseeker",
          {
            expires: 1,
            sameSite: "strict",
            path: "/",
          }
        );
      }
    }),

  clearError: () =>
    set((state) => {
      state.error = null;
    }),
});