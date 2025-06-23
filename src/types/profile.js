// src/types/profile.js
/**
 * @typedef {Object} Profile
 * @property {string} id - Unique identifier
 * @property {User} user - Associated user
 * @property {string} [profilePicture] - Profile picture URL
 * @property {string} [socialAvatarUrl] - Social media avatar URL
 * @property {string} [bio] - User bio
 * @property {string} [jobTitle] - Current job title
 * @property {number} yearsExperience - Years of experience
 * @property {string} [country] - Country
 * @property {number} [salaryMin] - Minimum salary expectation
 * @property {number} [salaryMax] - Maximum salary expectation
 * @property {string} salaryCurrency - Salary currency
 * @property {number} profileStrength - Profile completion percentage
 * @property {Experience[]} experiences - Work experiences
 * @property {Education[]} education - Education history
 * @property {Skill[]} skills - Skills
 * @property {Certification[]} certifications - Certifications
 * @property {PortfolioItem[]} portfolioItems - Portfolio items
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {Object} Experience
 * @property {string} id - Unique identifier
 * @property {string} companyName - Company name
 * @property {string} jobTitle - Job title
 * @property {string} [location] - Location
 * @property {string} startDate - Start date (ISO)
 * @property {string} [endDate] - End date (ISO)
 * @property {boolean} currentJob - Is current job
 * @property {string} [description] - Job description
 * @property {string} [portfolioLink] - Portfolio link
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {Object} Education
 * @property {string} id - Unique identifier
 * @property {string} institution - Institution name
 * @property {string} degree - Degree type
 * @property {string} degreeDisplay - Display name for degree
 * @property {string} fieldOfStudy - Field of study
 * @property {string} startDate - Start date (ISO)
 * @property {string} [endDate] - End date (ISO)
 * @property {boolean} current - Is current education
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {Object} Skill
 * @property {string} id - Unique identifier
 * @property {string} name - Skill name
 * @property {string} level - Skill level
 * @property {string} levelDisplay - Display name for level
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {Object} Certification
 * @property {string} id - Unique identifier
 * @property {string} name - Certification name
 * @property {string} institution - Issuing institution
 * @property {number} yearAwarded - Year awarded
 * @property {string} [credentialUrl] - Credential URL
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {Object} PortfolioItem
 * @property {string} id - Unique identifier
 * @property {string} title - Title
 * @property {string} description - Description
 * @property {string} [url] - Project URL
 * @property {string} [image] - Image URL
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */