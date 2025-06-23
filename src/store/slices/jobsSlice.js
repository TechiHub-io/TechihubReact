// src/store/slices/jobsSlice.js
export const createJobsSlice = (set, get) => ({
  // Jobs state
  jobs: [],
  currentJob: null,
  savedJobs: [],
  filters: {
    keyword: '',
    location: '',
    type: '',
    experience: '',
    remote: false,
    status: 'all', // 'all', 'active', 'inactive'
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
  setJobs: (jobs) => set((state) => {
    state.jobs = jobs;
  }),
  
  setCurrentJob: (job) => set((state) => {
    state.currentJob = job;
  }),

  setFilters: (filters) => set((state) => {
    state.filters = { ...state.filters, ...filters };
  }),

  setPage: (page) => set((state) => {
    state.pagination.page = page;
  }),

  // API Actions
  fetchJobs: async (filters = {}) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      // Combine state filters with passed filters
      const combinedFilters = {
        ...get().filters,
        ...filters,
        page: filters.page || get().pagination.page,
        page_size: filters.page_size || get().pagination.pageSize,
      };
      
      // Remove empty filters
      Object.keys(combinedFilters).forEach(key => {
        if (!combinedFilters[key] || combinedFilters[key] === '') {
          delete combinedFilters[key];
        }
      });
      
      // If we're an employer, ensure we only see our company's jobs
      if (get().isEmployer && get().company) {
        combinedFilters.company = get().company.id;
      }

      // Build query params
      const queryParams = new URLSearchParams(combinedFilters);
      
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      
      
      const token = get().token;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/jobs/?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If response is not JSON, get the text instead
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') === -1) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(errorText || 'Failed to fetch jobs');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch jobs');
      }

      const data = await response.json();
      const results = data.results || data;
      const totalCount = data.count || results.length;
      const totalPages = data.total_pages || Math.ceil(totalCount / get().pagination.pageSize);

      set((state) => {
        state.jobs = results;
        state.pagination = {
          ...state.pagination,
          totalPages,
          totalCount,
        };
        state.loading = false;
      });

      return results;
    } catch (error) {
      console.error('Error in fetchJobs:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  fetchJobById: async (id) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const token = get().token;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/jobs/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If response is not JSON, get the text instead
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') === -1) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(errorText || 'Failed to fetch job details');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch job details');
      }

      const data = await response.json();

      set((state) => {
        state.currentJob = data;
        state.loading = false;
      });

      return data;
    } catch (error) {
      console.error('Error in fetchJobById:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  createJob: async (jobData) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      // If company ID is not in jobData, add it from state
      const enhancedJobData = {
        ...jobData,
        company: jobData.company || get().company?.id,
      };

      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const token = get().token;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      
      const response = await fetch(`${API_URL}/jobs/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedJobData),
      });
      
      if (!response.ok) {
        // If response is not JSON, get the text instead
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') === -1) {
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          throw new Error(errorText || 'Failed to create job');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create job');
      }

      // Get the response text first to debug potential JSON issues
      const responseText = await response.text();
      
      let data;
      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      

      set((state) => {
        state.jobs = [data, ...state.jobs];
        state.loading = false;
      });

      return data;
    } catch (error) {
      console.error('Error in createJob:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  updateJob: async (id, jobData) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const token = get().token;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/jobs/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      
      if (!response.ok) {
        // If response is not JSON, get the text instead
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') === -1) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(errorText || 'Failed to update job');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update job');
      }

      // Get the response text first to debug potential JSON issues
      const responseText = await response.text();
      
      let data;
      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      set((state) => {
        const index = state.jobs.findIndex(job => job.id === id);
        if (index !== -1) {
          state.jobs[index] = data;
        }
        if (state.currentJob?.id === id) {
          state.currentJob = data;
        }
        state.loading = false;
      });

      return data;
    } catch (error) {
      console.error('Error in updateJob:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  deleteJob: async (id) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const token = get().token;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/jobs/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // For delete operations, we might get an empty response body
        if (response.status === 204) {
          // 204 No Content is a success
        } else {
          try {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to delete job');
          } catch (parseError) {
            // If parsing fails, use status text
            throw new Error(`Failed to delete job: ${response.statusText}`);
          }
        }
      }

      set((state) => {
        state.jobs = state.jobs.filter(job => job.id !== id);
        if (state.currentJob?.id === id) {
          state.currentJob = null;
        }
        state.loading = false;
      });

      return true;
    } catch (error) {
      console.error('Error in deleteJob:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  // Job Status Management
  activateJob: async (id) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const token = get().token;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/jobs/${id}/activate/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // If response is not JSON, get the text instead
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') === -1) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(errorText || 'Failed to activate job');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to activate job');
      }

      // Get the response text first to debug potential JSON issues
      const responseText = await response.text();
      
      let data;
      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      set((state) => {
        const index = state.jobs.findIndex(job => job.id === id);
        if (index !== -1) {
          state.jobs[index] = { ...state.jobs[index], is_active: true, ...data };
        }
        if (state.currentJob?.id === id) {
          state.currentJob = { ...state.currentJob, is_active: true, ...data };
        }
        state.loading = false;
      });

      return data;
    } catch (error) {
      console.error('Error in activateJob:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  deactivateJob: async (id) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const token = get().token;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/jobs/${id}/deactivate/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // If response is not JSON, get the text instead
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') === -1) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(errorText || 'Failed to deactivate job');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to deactivate job');
      }

      // Get the response text first to debug potential JSON issues
      const responseText = await response.text();
      
      let data;
      try {
        // Try to parse the response as JSON
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      set((state) => {
        const index = state.jobs.findIndex(job => job.id === id);
        if (index !== -1) {
          state.jobs[index] = { ...state.jobs[index], is_active: false, ...data };
        }
        if (state.currentJob?.id === id) {
          state.currentJob = { ...state.currentJob, is_active: false, ...data };
        }
        state.loading = false;
      });

      return data;
    } catch (error) {
      console.error('Error in deactivateJob:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  // Job Skills Management
  addJobSkill: async (jobId, skillData) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const token = get().token;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/jobs/${jobId}/add_skill/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillData),
      });
      
      if (!response.ok) {
        // If response is not JSON, get the text instead
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') === -1) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(errorText || 'Failed to add skill to job');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add skill to job');
      }

      const data = await response.json();

      // This might return the skill or the updated job, handle both cases
      set((state) => {
        // If a full job is returned
        if (data.title) {
          const index = state.jobs.findIndex(job => job.id === jobId);
          if (index !== -1) {
            state.jobs[index] = data;
          }
          if (state.currentJob?.id === jobId) {
            state.currentJob = data;
          }
        } 
        // If just the skill is returned, update the current job skills
        else if (state.currentJob?.id === jobId) {
          if (!state.currentJob.skills) {
            state.currentJob.skills = [data];
          } else {
            state.currentJob.skills.push(data);
          }
        }
        state.loading = false;
      });

      return data;
    } catch (error) {
      console.error('Error in addJobSkill:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  // Saved Jobs Management
  saveJob: async (jobId) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const token = get().token;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/favorites/jobs/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job: jobId }),
      });
      
      if (!response.ok) {
        // If response is not JSON, get the text instead
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') === -1) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(errorText || 'Failed to save job');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save job');
      }

      const data = await response.json();

      set((state) => {
        state.savedJobs.push(data);
        state.loading = false;
      });

      return data;
    } catch (error) {
      console.error('Error in saveJob:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  unsaveJob: async (jobId) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "https://api.techihub.io/api/v1";
      const token = get().token;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/favorites/jobs/${jobId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // For delete operations, we might get an empty response body
        if (response.status === 204) {
          // 204 No Content is a success
        } else {
          try {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to unsave job');
          } catch (parseError) {
            // If parsing fails, use status text
            throw new Error(`Failed to unsave job: ${response.statusText}`);
          }
        }
      }

      set((state) => {
        state.savedJobs = state.savedJobs.filter(saved => saved.job.id !== jobId);
        state.loading = false;
      });

      return true;
    } catch (error) {
      console.error('Error in unsaveJob:', error);
      set((state) => {
        state.error = error.message;
        state.loading = false;
      });
      throw error;
    }
  },

  // Convenience method for toggling job status
  toggleJobStatus: async (jobId, isActive) => {
    if (isActive) {
      return get().activateJob(jobId);
    } else {
      return get().deactivateJob(jobId);
    }
  },

  // Utils
  clearError: () => set((state) => {
    state.error = null;
  }),
});