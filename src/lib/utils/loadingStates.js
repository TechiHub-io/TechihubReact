// src/lib/utils/loadingStates.js

/**
 * Centralized loading state utilities for admin job posting
 */

// Loading state types
export const LOADING_TYPES = {
  INITIAL: 'initial',
  FETCHING: 'fetching',
  SUBMITTING: 'submitting',
  UPDATING: 'updating',
  DELETING: 'deleting',
  RETRYING: 'retrying',
  REFRESHING: 'refreshing'
};

// Loading priorities (higher number = higher priority)
export const LOADING_PRIORITIES = {
  [LOADING_TYPES.INITIAL]: 1,
  [LOADING_TYPES.FETCHING]: 2,
  [LOADING_TYPES.REFRESHING]: 3,
  [LOADING_TYPES.UPDATING]: 4,
  [LOADING_TYPES.SUBMITTING]: 5,
  [LOADING_TYPES.DELETING]: 6,
  [LOADING_TYPES.RETRYING]: 7
};

/**
 * Get loading message based on loading type and context
 * @param {string} loadingType - Type of loading operation
 * @param {string} context - Context where loading is occurring
 * @returns {string} User-friendly loading message
 */
export function getLoadingMessage(loadingType, context = '') {
  const contextMessages = {
    job_creation: {
      [LOADING_TYPES.INITIAL]: 'Preparing job form...',
      [LOADING_TYPES.SUBMITTING]: 'Creating job...',
      [LOADING_TYPES.RETRYING]: 'Retrying job creation...'
    },
    job_update: {
      [LOADING_TYPES.INITIAL]: 'Loading job details...',
      [LOADING_TYPES.UPDATING]: 'Updating job...',
      [LOADING_TYPES.RETRYING]: 'Retrying job update...'
    },
    job_management: {
      [LOADING_TYPES.INITIAL]: 'Loading jobs...',
      [LOADING_TYPES.FETCHING]: 'Fetching jobs...',
      [LOADING_TYPES.REFRESHING]: 'Refreshing job list...',
      [LOADING_TYPES.DELETING]: 'Deleting job...'
    },
    company_selection: {
      [LOADING_TYPES.INITIAL]: 'Loading companies...',
      [LOADING_TYPES.FETCHING]: 'Fetching accessible companies...',
      [LOADING_TYPES.REFRESHING]: 'Refreshing company list...'
    }
  };

  // Default messages
  const defaultMessages = {
    [LOADING_TYPES.INITIAL]: 'Loading...',
    [LOADING_TYPES.FETCHING]: 'Fetching data...',
    [LOADING_TYPES.SUBMITTING]: 'Submitting...',
    [LOADING_TYPES.UPDATING]: 'Updating...',
    [LOADING_TYPES.DELETING]: 'Deleting...',
    [LOADING_TYPES.RETRYING]: 'Retrying...',
    [LOADING_TYPES.REFRESHING]: 'Refreshing...'
  };

  // Try to get context-specific message first
  if (context && contextMessages[context] && contextMessages[context][loadingType]) {
    return contextMessages[context][loadingType];
  }

  // Fall back to default message
  return defaultMessages[loadingType] || 'Loading...';
}

/**
 * Get loading duration estimate in milliseconds
 * @param {string} loadingType - Type of loading operation
 * @returns {number} Estimated duration in milliseconds
 */
export function getLoadingDuration(loadingType) {
  const durations = {
    [LOADING_TYPES.INITIAL]: 1000,
    [LOADING_TYPES.FETCHING]: 2000,
    [LOADING_TYPES.SUBMITTING]: 3000,
    [LOADING_TYPES.UPDATING]: 2500,
    [LOADING_TYPES.DELETING]: 1500,
    [LOADING_TYPES.RETRYING]: 4000,
    [LOADING_TYPES.REFRESHING]: 1500
  };

  return durations[loadingType] || 2000;
}

/**
 * Create loading skeleton configuration
 * @param {string} type - Type of skeleton (list, form, card, etc.)
 * @param {Object} options - Skeleton options
 * @returns {Object} Skeleton configuration
 */
export function createSkeletonConfig(type, options = {}) {
  const {
    count = 1,
    height = 'auto',
    animated = true,
    className = ''
  } = options;

  const configs = {
    list: {
      type: 'list',
      count,
      items: [
        { type: 'rectangle', width: '100%', height: '60px' },
        { type: 'text', width: '80%', height: '16px' },
        { type: 'text', width: '60%', height: '14px' }
      ],
      animated,
      className: `space-y-4 ${className}`
    },
    form: {
      type: 'form',
      count: 1,
      items: [
        { type: 'text', width: '40%', height: '20px' }, // Label
        { type: 'rectangle', width: '100%', height: '40px' }, // Input
        { type: 'text', width: '60%', height: '20px' }, // Label
        { type: 'rectangle', width: '100%', height: '100px' }, // Textarea
        { type: 'text', width: '50%', height: '20px' }, // Label
        { type: 'rectangle', width: '100%', height: '40px' } // Select
      ],
      animated,
      className: `space-y-6 ${className}`
    },
    card: {
      type: 'card',
      count,
      items: [
        { type: 'rectangle', width: '100%', height: '200px' },
        { type: 'text', width: '90%', height: '18px' },
        { type: 'text', width: '70%', height: '14px' },
        { type: 'text', width: '50%', height: '14px' }
      ],
      animated,
      className: `grid gap-6 ${className}`
    },
    table: {
      type: 'table',
      count,
      items: [
        { type: 'rectangle', width: '100%', height: '50px' }, // Header
        { type: 'rectangle', width: '100%', height: '40px' }, // Row
        { type: 'rectangle', width: '100%', height: '40px' }, // Row
        { type: 'rectangle', width: '100%', height: '40px' }  // Row
      ],
      animated,
      className: `space-y-2 ${className}`
    }
  };

  return configs[type] || configs.list;
}

/**
 * Loading state manager class
 */
export class LoadingStateManager {
  constructor() {
    this.states = new Map();
    this.listeners = new Set();
  }

  // Set loading state
  setLoading(key, type, context = '') {
    const loadingState = {
      type,
      context,
      message: getLoadingMessage(type, context),
      duration: getLoadingDuration(type),
      priority: LOADING_PRIORITIES[type] || 1,
      timestamp: Date.now()
    };

    this.states.set(key, loadingState);
    this.notifyListeners();
  }

  // Clear loading state
  clearLoading(key) {
    this.states.delete(key);
    this.notifyListeners();
  }

  // Clear all loading states
  clearAll() {
    this.states.clear();
    this.notifyListeners();
  }

  // Get current loading state
  getLoading(key) {
    return this.states.get(key) || null;
  }

  // Get all loading states
  getAllLoading() {
    return Array.from(this.states.entries()).map(([key, state]) => ({
      key,
      ...state
    }));
  }

  // Get highest priority loading state
  getPrimaryLoading() {
    const loadingStates = this.getAllLoading();
    if (loadingStates.length === 0) return null;

    return loadingStates.reduce((highest, current) => {
      return current.priority > highest.priority ? current : highest;
    });
  }

  // Check if any loading is active
  isLoading() {
    return this.states.size > 0;
  }

  // Check if specific type is loading
  isLoadingType(type) {
    return Array.from(this.states.values()).some(state => state.type === type);
  }

  // Add listener for state changes
  addListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.getAllLoading(), this.getPrimaryLoading());
      } catch (error) {
        console.error('Error in loading state listener:', error);
      }
    });
  }
}

// Global loading state manager instance
export const globalLoadingManager = new LoadingStateManager();

/**
 * Progress indicator utilities
 */
export const ProgressIndicators = {
  // Linear progress bar
  linear: (progress, options = {}) => ({
    type: 'linear',
    progress: Math.max(0, Math.min(100, progress)),
    animated: options.animated !== false,
    color: options.color || '#0CCE68',
    height: options.height || '4px',
    className: options.className || ''
  }),

  // Circular progress
  circular: (progress, options = {}) => ({
    type: 'circular',
    progress: Math.max(0, Math.min(100, progress)),
    size: options.size || '24px',
    strokeWidth: options.strokeWidth || '2px',
    color: options.color || '#0CCE68',
    backgroundColor: options.backgroundColor || '#e5e7eb',
    className: options.className || ''
  }),

  // Indeterminate spinner
  spinner: (options = {}) => ({
    type: 'spinner',
    size: options.size || '24px',
    color: options.color || '#0CCE68',
    speed: options.speed || '1s',
    className: options.className || ''
  }),

  // Dots indicator
  dots: (options = {}) => ({
    type: 'dots',
    count: options.count || 3,
    size: options.size || '8px',
    color: options.color || '#0CCE68',
    spacing: options.spacing || '4px',
    speed: options.speed || '1.4s',
    className: options.className || ''
  })
};

/**
 * Create loading overlay configuration
 * @param {Object} options - Overlay options
 * @returns {Object} Overlay configuration
 */
export function createLoadingOverlay(options = {}) {
  const {
    message = 'Loading...',
    type = 'spinner',
    backdrop = true,
    dismissible = false,
    zIndex = 50,
    className = ''
  } = options;

  return {
    message,
    indicator: ProgressIndicators[type] ? ProgressIndicators[type](options) : ProgressIndicators.spinner(options),
    backdrop,
    dismissible,
    zIndex,
    className: `fixed inset-0 flex items-center justify-center ${className}`,
    backdropClassName: backdrop ? 'absolute inset-0 bg-black bg-opacity-50' : '',
    contentClassName: 'relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg'
  };
}

/**
 * Debounced loading state setter
 * @param {Function} setter - State setter function
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} Debounced setter function
 */
export function createDebouncedLoader(setter, delay = 300) {
  let timeoutId = null;

  return (isLoading, ...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (isLoading) {
      // Show loading immediately
      setter(true, ...args);
    } else {
      // Delay hiding loading to prevent flicker
      timeoutId = setTimeout(() => {
        setter(false, ...args);
        timeoutId = null;
      }, delay);
    }
  };
}