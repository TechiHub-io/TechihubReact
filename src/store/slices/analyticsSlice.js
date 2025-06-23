// src/store/slices/analyticsSlice.js
export const createAnalyticsSlice = (set, get) => ({
  // Analytics state
  analyticsData: {
    jobViews: [],
    applicationStats: {
      statusBreakdown: [],
      timeToHire: 0,
      conversionRate: 0
    },
    jobPerformance: [],
    topSources: [],
    dailyApplications: []
  },
  dateRange: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    to: new Date().toISOString().split('T')[0] // Today
  },
  loading: false,
  error: null,

  // Actions
  setAnalyticsData: (data) => set((state) => {
    state.analyticsData = { ...state.analyticsData, ...data };
  }),
  
  setDateRange: (dateRange) => set((state) => {
    state.dateRange = dateRange;
  }),
  
  fetchDashboardAnalytics: async () => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const companyId = get().company?.id;
      
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/analytics/dashboard/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch dashboard analytics');
      }

      const data = await response.json();

      set((state) => {
        state.analyticsData = {
          ...state.analyticsData,
          activeJobsCount: data.active_jobs_count || 0,
          totalApplications: data.total_applications || 0,
          profileViewsCount: data.profile_views_initiated || 0,
          jobViewsCount: data.job_views_received || 0,
          recentApplications: data.recent_applications || [],
          recentJobs: data.recent_jobs || []
        };
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
  
  fetchJobViews: async (jobId = null) => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const companyId = get().company?.id;
      const { from, to } = get().dateRange;
      
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const endpoint = jobId 
        ? `${API_URL}/analytics/job-views/${jobId}/` 
        : `${API_URL}/analytics/job-views/`;
      
      const response = await fetch(`${endpoint}?from_date=${from}&to_date=${to}`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch job views');
      }

      const data = await response.json();

      set((state) => {
        state.analyticsData = {
          ...state.analyticsData,
          jobViews: data.daily_views || []
        };
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
  
  fetchApplicationStats: async () => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      const companyId = get().company?.id;
      
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      
      const API_URL = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${API_URL}/analytics/application-stats/`, {
        headers: {
          'Authorization': `Bearer ${get().token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch application stats');
      }

      const data = await response.json();

      set((state) => {
        state.analyticsData = {
          ...state.analyticsData,
          applicationStats: {
            statusBreakdown: data.status_breakdown || [],
            timeToHire: data.average_time_to_hire || 0,
            conversionRate: data.conversion_rate || 0
          },
          jobPerformance: data.job_performance || [],
          topSources: data.application_sources || [],
          dailyApplications: data.daily_applications || []
        };
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
  
  fetchAllAnalytics: async () => {
    set((state) => {
      state.loading = true;
      state.error = null;
    });

    try {
      await Promise.all([
        get().fetchDashboardAnalytics(),
        get().fetchJobViews(),
        get().fetchApplicationStats()
      ]);
      
      set((state) => {
        state.loading = false;
      });
      
      return get().analyticsData;
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