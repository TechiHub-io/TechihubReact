// src/types/auth.js
/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} email - User email
 * @property {string} username - Username
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {boolean} isEmployer - Whether user is an employer
 * @property {boolean} emailVerified - Whether email is verified
 * @property {string} [phone] - Phone number
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email - User email
 * @property {string} password - User password
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} email - User email
 * @property {string} username - Username
 * @property {string} password - User password
 * @property {string} password2 - Password confirmation
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {boolean} isEmployer - Whether user is registering as employer
 */

/**
 * @typedef {Object} AuthResponse
 * @property {User} user - User data
 * @property {string} access - Access token
 * @property {string} refresh - Refresh token
 */

/**
 * @typedef {Object} PasswordResetRequest
 * @property {string} email - User email
 */

/**
 * @typedef {Object} PasswordResetConfirm
 * @property {string} token - Reset token
 * @property {string} password - New password
 * @property {string} password2 - Password confirmation
 */