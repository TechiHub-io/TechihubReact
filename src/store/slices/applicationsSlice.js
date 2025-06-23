// src/store/slices/applicationsSlice.js
export const createApplicationsSlice = (set, get) => ({
  // Applications state
  applications: [],
  currentApplication: null,
  applicationQuestions: [],
  currentQuestion: null,
  stats: {
    total: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    assessment: 0,
    offer: 0,
    hired: 0,
    rejected: 0,
    withdrawn: 0,
  },
  filters: {
    status: '',
    job: '',
    search: '',
    dateFrom: '',
    dateTo: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
  },
  loading: false,
  error: null,

  // Basic Actions
  setApplications: (applications) => set((state) => {
    state.applications = applications;
  }),
  
  setCurrentApplication: (application) => set((state) => {
    state.currentApplication = application;
  }),
  
  setApplicationQuestions: (questions) => set((state) => {
    state.applicationQuestions = questions;
  }),
  
  setCurrentQuestion: (question) => set((state) => {
    state.currentQuestion = question;
  }),
  
  setFilters: (filters) => set((state) => {
    state.filters = { ...state.filters, ...filters };
  }),
  
  setPage: (page) => set((state) => {
    state.pagination.page = page;
  }),

  // API Actions
  fetchApplications: async (filters = {}) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      // Combine state filters with passed filters
      const combinedFilters = {
        ...get().filters,
        ...filters,
        page: get().pagination.page,
        page_size: get().pagination.pageSize,
      };
      
      // Remove empty filters
      Object.keys(combinedFilters).forEach(key => {
        if (!combinedFilters[key] || combinedFilters[key] === '') {
          delete combinedFilters[key];
        }
      });

      // Build query params
      const queryParams = new URLSearchParams(combinedFilters);
      
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/applications/?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch applications');
      }

      const data = await response.json();
      const results = data.results || data;
      const totalCount = data.count || results.length;
      const totalPages = data.total_pages || Math.ceil(totalCount / get().pagination.pageSize);

      set((state) => {
        state.applications = results;
        state.pagination = {
          ...state.pagination,
          totalPages,
          totalCount,
        };
        state.loading = false;
      });

      return results;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  fetchApplicationById: async (id) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/applications/${id}/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch application details');
      }

      const data = await response.json();

      set((state) => {
        state.currentApplication = data;
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

  updateApplicationStatus: async (id, status, notes = '') => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/applications/${id}/status/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes, employer_notes: notes }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update application status');
      }

      const data = await response.json();

      set((state) => {
        // Update in applications list
        const index = state.applications.findIndex(app => app.id === id);
        if (index !== -1) {
          state.applications[index] = { ...state.applications[index], ...data };
        }
        
        // Update currentApplication if it's the one being modified
        if (state.currentApplication?.id === id) {
          state.currentApplication = { ...state.currentApplication, ...data };
        }
        
        state.loading = false;
      });

      // Update stats
      await get().fetchApplicationStats();

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  // Job Applications
  fetchJobApplications: async (jobId, filters = {}) => {
    if (!jobId) {
      set((state) => {
        state.error = 'Job ID is required';
      });
      return [];
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      // Prepare filters
      const combinedFilters = {
        ...get().filters,
        ...filters,
        page: get().pagination.page,
        page_size: get().pagination.pageSize,
      };
      
      // Remove empty filters
      Object.keys(combinedFilters).forEach(key => {
        if (!combinedFilters[key] || combinedFilters[key] === '') {
          delete combinedFilters[key];
        }
      });

      // Build query params
      const queryParams = new URLSearchParams(combinedFilters);
      
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/applications/job/${jobId}/?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch job applications');
      }

      const data = await response.json();
      const results = data.results || data;
      const totalCount = data.count || results.length;
      const totalPages = data.total_pages || Math.ceil(totalCount / get().pagination.pageSize);

      set((state) => {
        state.applications = results;
        state.pagination = {
          ...state.pagination,
          totalPages,
          totalCount,
        };
        state.loading = false;
      });

      return results;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  // Application Questions
  fetchJobQuestions: async (jobId) => {
    if (!jobId) {
      set((state) => {
        state.error = 'Job ID is required';
      });
      return [];
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/applications/questions/${jobId}/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch job questions');
      }

      const data = await response.json();

      set((state) => {
        state.applicationQuestions = data;
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

  createJobQuestion: async (jobId, questionData) => {
    if (!jobId) {
      set((state) => {
        state.error = 'Job ID is required';
      });
      return null;
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/applications/questions/${jobId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create job question');
      }

      const data = await response.json();

      set((state) => {
        state.applicationQuestions = [...state.applicationQuestions, data];
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

  updateJobQuestion: async (questionId, questionData) => {
    if (!questionId) {
      set((state) => {
        state.error = 'Question ID is required';
      });
      return null;
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/applications/questions/${questionId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update job question');
      }

      const data = await response.json();

      set((state) => {
        state.applicationQuestions = state.applicationQuestions.map(q => 
          q.id === questionId ? data : q
        );
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

  deleteJobQuestion: async (questionId) => {
    if (!questionId) {
      set((state) => {
        state.error = 'Question ID is required';
      });
      return false;
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/applications/questions/${questionId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete job question');
      }

      set((state) => {
        state.applicationQuestions = state.applicationQuestions.filter(q => q.id !== questionId);
        state.loading = false;
      });

      return true;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  // Statistics
  fetchApplicationStats: async () => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/analytics/application-stats/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch application statistics');
      }

      const data = await response.json();

      set((state) => {
        // Set status counts
        if (data.status_counts) {
          state.stats = data.status_counts;
        }
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

  // For Job Seekers - Submit Application
  submitApplication: async (jobId, applicationData) => {
    if (!jobId) {
      set((state) => {
        state.error = 'Job ID is required';
      });
      return null;
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('job', jobId);
      
      // Append all application data
      Object.keys(applicationData).forEach(key => {
        if (key === 'resume' && applicationData[key] instanceof File) {
          formData.append(key, applicationData[key]);
        } else if (key === 'answers' && typeof applicationData[key] === 'object') {
          formData.append(key, JSON.stringify(applicationData[key]));
        } else {
          formData.append(key, applicationData[key]);
        }
      });

      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/applications/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${get().token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit application');
      }

      const data = await response.json();

      set((state) => {
        state.applications = [data, ...state.applications];
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

  // For Job Seekers - Withdraw Application
  withdrawApplication: async (id) => {
    if (!id) {
      set((state) => {
        state.error = 'Application ID is required';
      });
      return false;
    }
    
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/applications/${id}/withdraw/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to withdraw application');
      }

      const data = await response.json();

      set((state) => {
        // Update application in list
        const index = state.applications.findIndex(app => app.id === id);
        if (index !== -1) {
          state.applications[index] = { ...state.applications[index], status: 'withdrawn', status_display: 'Withdrawn' };
        }
        
        // Update current application if it's the one being withdrawn
        if (state.currentApplication?.id === id) {
          state.currentApplication = { ...state.currentApplication, status: 'withdrawn', status_display: 'Withdrawn' };
        }
        
        state.loading = false;
      });

      // Update stats
      await get().fetchApplicationStats();

      return data;
    } catch (error) {
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  // Utils
  clearError: () => set((state) => {
    state.error = null;
  }),
});