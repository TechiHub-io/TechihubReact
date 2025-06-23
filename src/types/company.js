// src/types/company.js
/**
 * @typedef {Object} Company
 * @property {string} id - Unique identifier
 * @property {User} user - Company owner user
 * @property {string} name - Company name
 * @property {string} [logo] - Company logo URL
 * @property {string} [description] - Company description
 * @property {string} [foundingDate] - Founding date (ISO)
 * @property {string} [industry] - Industry
 * @property {string} [location] - Location
 * @property {string} [website] - Website URL
 * @property {string} [email] - Contact email
 * @property {string} [phone] - Contact phone
 * @property {string} [size] - Company size
 * @property {string} [linkedin] - LinkedIn URL
 * @property {string} [twitter] - Twitter URL
 * @property {string} [facebook] - Facebook URL
 * @property {boolean} isVerified - Verification status
 * @property {boolean} isFeatured - Featured status
 * @property {CompanyBenefit[]} benefits - Company benefits
 * @property {CompanyImage[]} images - Company images
 * @property {CompanyReview[]} reviews - Company reviews
 * @property {number} averageRating - Average review rating
 * @property {number} jobCount - Active job count
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {Object} CompanyBenefit
 * @property {string} id - Unique identifier
 * @property {string} title - Benefit title
 * @property {string} [description] - Benefit description
 * @property {string} [icon] - Icon identifier
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * @typedef {Object} CompanyImage
 * @property {string} id - Unique identifier
 * @property {string} image - Image URL
 * @property {string} [caption] - Image caption
 * @property {number} displayOrder - Display order
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {Object} CompanyReview
 * @property {string} id - Unique identifier
 * @property {number} rating - Rating (1-5)
 * @property {string} title - Review title
 * @property {string} content - Review content
 * @property {string} [pros] - Pros
 * @property {string} [cons] - Cons
 * @property {string} [employmentStatus] - Employment status
 * @property {boolean} isAnonymous - Anonymous review flag
 * @property {string} reviewerName - Reviewer name
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {Object} CompanyMember
 * @property {string} id - Unique identifier
 * @property {User} user - User
 * @property {string} userEmail - User email
 * @property {string} userName - User name
 * @property {string} role - Member role
 * @property {string} roleDisplay - Display name for role
 * @property {User} [invitedBy] - Invited by user
 * @property {boolean} isActive - Active status
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {Object} CompanyInvitation
 * @property {string} id - Unique identifier
 * @property {Company} company - Company
 * @property {string} companyName - Company name
 * @property {string} email - Invitee email
 * @property {string} role - Invited role
 * @property {string} roleDisplay - Display name for role
 * @property {User} invitedBy - Invited by user
 * @property {string} invitedByName - Inviter name
 * @property {boolean} isAccepted - Acceptance status
 * @property {string} expiresAt - Expiration date (ISO)
 * @property {string} createdAt - ISO date string
 * @property {boolean} isValid - Validity status
 */