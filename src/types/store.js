// src/types/store.js
/**
 * @typedef {Object} AuthState
 * @property {User|null} user - Current user
 * @property {string|null} token - Auth token
 * @property {boolean} isAuthenticated - Authentication status
 * @property {boolean} isEmployer - Employer status
 * @property {boolean} loading - Loading status
 * @property {string|null} error - Error message
 */

/**
 * @typedef {Object} ProfileState
 * @property {Profile|null} profile - Current profile
 * @property {Experience[]} experiences - Work experiences
 * @property {Education[]} education - Education history
 * @property {Skill[]} skills - Skills
 * @property {Certification[]} certifications - Certifications
 * @property {PortfolioItem[]} portfolioItems - Portfolio items
 * @property {boolean} loading - Loading status
 * @property {string|null} error - Error message
 */

/**
 * @typedef {Object} JobsState
 * @property {Job[]} jobs - Job listings
 * @property {Job|null} currentJob - Current job details
 * @property {SavedJob[]} savedJobs - Saved jobs
 * @property {Object} filters - Search filters
 * @property {Object} pagination - Pagination info
 * @property {boolean} loading - Loading status
 * @property {string|null} error - Error message
 */

/**
 * @typedef {Object} ApplicationsState
 * @property {Application[]} applications - Applications list
 * @property {Application|null} currentApplication - Current application
 * @property {ApplicationStats} stats - Application statistics
 * @property {boolean} loading - Loading status
 * @property {string|null} error - Error message
 */

/**
 * @typedef {Object} CompanyState
 * @property {Company|null} company - Current company
 * @property {Company[]} companies - Companies list
 * @property {Company|null} currentCompany - Selected company
 * @property {CompanyMember[]} members - Company members
 * @property {CompanyInvitation[]} invitations - Company invitations
 * @property {boolean} loading - Loading status
 * @property {string|null} error - Error message
 */

/**
 * @typedef {Object} MessagesState
 * @property {Conversation[]} conversations - Conversations list
 * @property {Conversation|null} currentConversation - Active conversation
 * @property {Message[]} messages - Current conversation messages
 * @property {number} unreadCount - Unread messages count
 * @property {boolean} loading - Loading status
 * @property {string|null} error - Error message
 */

/**
 * @typedef {Object} UIState
 * @property {Object} modals - Modal state
 * @property {Notification[]} notifications - UI notifications
 * @property {boolean} sidebarOpen - Sidebar state
 * @property {boolean} isLoading - Global loading state
 * @property {string|null} error - Global error state
 */

/**
 * @typedef {Object} ThemeState
 * @property {boolean} isDarkMode - Dark mode status
 * @property {Object} theme - Theme configuration
 * @property {Object} theme.colors - Theme colors
 * @property {Object} theme.fonts - Theme fonts
 */

/**
 * @typedef {Object} StoreState
 * @property {AuthState} auth - Auth slice
 * @property {ProfileState} profile - Profile slice
 * @property {JobsState} jobs - Jobs slice
 * @property {ApplicationsState} applications - Applications slice
 * @property {CompanyState} company - Company slice
 * @property {MessagesState} messages - Messages slice
 * @property {UIState} ui - UI slice
 * @property {ThemeState} theme - Theme slice
 */