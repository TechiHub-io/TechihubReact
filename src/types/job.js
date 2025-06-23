// src/types/job.js
/**
 * @typedef {Object} Job
 * @property {string} id - Unique identifier
 * @property {Company} company - Associated company
 * @property {string} title - Job title
 * @property {string} slug - URL slug
 * @property {string} description - Job description
 * @property {string} [responsibilities] - Job responsibilities
 * @property {string} [requirements] - Job requirements
 * @property {string} [benefits] - Job benefits
 * @property {string} location - Job location
 * @property {boolean} isRemote - Remote job flag
 * @property {boolean} isHybrid - Hybrid job flag
 * @property {string} category - Job category
 * @property {string} jobType - Job type (full_time, part_time, etc.)
 * @property {string} jobTypeDisplay - Display name for job type
 * @property {string} educationLevel - Education level required
 * @property {string} educationLevelDisplay - Display name for education level
 * @property {string} experienceLevel - Experience level required
 * @property {string} experienceLevelDisplay - Display name for experience level
 * @property {number} [minSalary] - Minimum salary
 * @property {number} [maxSalary] - Maximum salary
 * @property {string} salaryCurrency - Salary currency
 * @property {boolean} isSalaryVisible - Whether salary is visible
 * @property {string} [applicationDeadline] - Application deadline (ISO)
 * @property {boolean} isActive - Whether job is active
 * @property {boolean} isFeatured - Whether job is featured
 * @property {string} [applicationUrl] - External application URL
 * @property {string} [applicationEmail] - Application email
 * @property {string} [applicationInstructions] - Application instructions
 * @property {JobSkill[]} requiredSkills - Required skills
 * @property {boolean} isExpired - Whether job is expired
 * @property {boolean} isSaved - Whether job is saved by current user
 * @property {number} applicationCount - Number of applications
 * @property {number} daysRemaining - Days remaining to apply
 * @property {number} viewCount - View count
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {Object} JobSkill
 * @property {string} id - Unique identifier
 * @property {string} skill - Skill name
 * @property {boolean} isRequired - Whether skill is required
 */

/**
 * @typedef {Object} SavedJob
 * @property {string} id - Unique identifier
 * @property {Job} job - Associated job
 * @property {string} [notes] - Personal notes
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {Object} JobSearchParams
 * @property {string} [keyword] - Search keyword
 * @property {string} [location] - Location filter
 * @property {string} [type] - Job type filter
 * @property {string} [experience] - Experience level filter
 * @property {boolean} [remote] - Remote jobs only
 * @property {number} [minSalary] - Minimum salary filter
 * @property {number} [maxSalary] - Maximum salary filter
 * @property {string[]} [skills] - Required skills filter
 * @property {number} [page] - Page number
 * @property {number} [pageSize] - Page size
 */

/**
 * @typedef {Object} JobView
 * @property {string} id - Unique identifier
 * @property {Job} job - Associated job
 * @property {User} [viewer] - Viewer (if authenticated)
 * @property {string} [ipAddress] - IP address
 * @property {string} viewedAt - ISO date string
 */