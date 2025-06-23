// src/store/slices/themeSlice.js
export const createThemeSlice = (set, get) => ({
  // Theme state
  isDarkMode: false,
  theme: {
    colors: {
      primary: '#0CCE68',
      secondary: '#364187',
      accent: '#88FF99',
      background: '#FFFFFF',
      text: '#000000',
    },
    fonts: {
      heading: 'system-ui, -apple-system, sans-serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
  },

  // Actions
  toggleDarkMode: () => set((state) => {
    state.isDarkMode = !state.isDarkMode;
    
    // Update theme colors for dark mode
    if (state.isDarkMode) {
      state.theme.colors = {
        ...state.theme.colors,
        background: '#1a1a1a',
        text: '#FFFFFF',
      };
      // Update CSS variables
      document.documentElement.classList.add('dark');
    } else {
      state.theme.colors = {
        ...state.theme.colors,
        background: '#FFFFFF',
        text: '#000000',
      };
      // Update CSS variables
      document.documentElement.classList.remove('dark');
    }
  }),

  setDarkMode: (isDark) => set((state) => {
    state.isDarkMode = isDark;
    
    // Update theme colors
    if (isDark) {
      state.theme.colors = {
        ...state.theme.colors,
        background: '#1a1a1a',
        text: '#FFFFFF',
      };
      document.documentElement.classList.add('dark');
    } else {
      state.theme.colors = {
        ...state.theme.colors,
        background: '#FFFFFF',
        text: '#000000',
      };
      document.documentElement.classList.remove('dark');
    }
    
    // Persist theme preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }),

  initializeTheme: () => {
    // Check if there's a saved preference first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      get().setDarkMode(isDark);
    } else {
      // Check if user has a system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      get().setDarkMode(prefersDark);
    }
    
    // Listen for system theme changes only if no saved preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        get().setDarkMode(e.matches);
      }
    });
  },

  setThemeColor: (colorName, value) => set((state) => {
    state.theme.colors[colorName] = value;
  }),

  resetTheme: () => set((state) => {
    state.theme.colors = {
      primary: '#0CCE68',
      secondary: '#364187',
      accent: '#88FF99',
      background: state.isDarkMode ? '#1a1a1a' : '#FFFFFF',
      text: state.isDarkMode ? '#FFFFFF' : '#000000',
    };
  }),
});