// src/types/application.js
/**
 * @typedef {Object} Application
 * @property {string} id - Unique identifier
 * @property {Job} job - Applied job
 * @property {User} user - Applicant user
 * @property {string} status - Application status
 * @property {string} statusDisplay - Display name for status
 * @property {string} resume - Resume file path
 * @property {string} resumeUrl - Resume file URL
 * @property {string} [coverLetter] - Cover letter text
 * @property {string} [employerNotes] - Employer notes
 * @property {string} [rejectionReason] - Rejection reason
 * @property {string} appliedDate - Applied date (ISO)
 * @property {string} updatedAt - Last update date (ISO)
 * @property {ApplicationAnswer[]} answers - Application answers
 * @property {ApplicationStatusHistory[]} statusHistory - Status history
 */

/**
 * @typedef {Object} ApplicationQuestion
 * @property {string} id - Unique identifier
 * @property {string} question - Question text
 * @property {string} [description] - Question description
 * @property {string} questionType - Question type (text, textarea, select, etc.)
 * @property {string} [options] - Options for select/radio/checkbox
 * @property {string[]} optionsList - Parsed options list
 * @property {boolean} isRequired - Required flag
 * @property {number} displayOrder - Display order
 */

/**
 * @typedef {Object} ApplicationAnswer
 * @property {string} id - Unique identifier
 * @property {ApplicationQuestion} question - Associated question
 * @property {string} questionText - Question text
 * @property {string} questionType - Question type
 * @property {string} answer - Answer text
 * @property {string} [fileAnswer] - File answer URL
 */

/**
 * @typedef {Object} ApplicationStatusHistory
 * @property {string} id - Unique identifier
 * @property {string} status - Status
 * @property {string} statusDisplay - Display name for status
 * @property {string} [notes] - Status change notes
 * @property {User} [createdBy] - User who changed status
 * @property {string} [createdByName] - Name of user who changed status
 * @property {string} createdAt - Creation date (ISO)
 */

/**
 * @typedef {Object} ApplicationStage
 * @property {string} id - Unique identifier
 * @property {string} name - Stage name
 * @property {string} [description] - Stage description
 * @property {number} displayOrder - Display order
 * @property {boolean} isActive - Active status
 */

/**
 * @typedef {Object} ApplicationStats
 * @property {number} total - Total applications
 * @property {number} applied - Applied status count
 * @property {number} screening - Screening status count
 * @property {number} interview - Interview status count
 * @property {number} assessment - Assessment status count
 * @property {number} offer - Offer status count
 * @property {number} hired - Hired status count
 * @property {number} rejected - Rejected status count
 * @property {number} withdrawn - Withdrawn status count
 */