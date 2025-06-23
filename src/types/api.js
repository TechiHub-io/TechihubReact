// src/types/api.js
/**
 * @typedef {Object} ApiResponse
 * @property {string} status - Status (success/error)
 * @property {string} [message] - Response message
 * @property {Object} [data] - Response data
 * @property {Object} [errors] - Validation errors
 */

/**
 * @typedef {Object} ApiError
 * @property {string} status - Status (error)
 * @property {string} message - Error message
 * @property {string} [code] - Error code
 * @property {Object} [errors] - Validation errors
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {number} count - Total count
 * @property {string|null} next - Next page URL
 * @property {string|null} previous - Previous page URL
 * @property {number} currentPage - Current page number
 * @property {number} totalPages - Total pages
 * @property {number} pageSize - Items per page
 * @property {Array} results - Data array
 */

/**
 * @typedef {Object} Conversation
 * @property {string} id - Unique identifier
 * @property {User[]} participants - Participants
 * @property {Job} [job] - Related job
 * @property {Application} [application] - Related application
 * @property {string} conversationType - Conversation type
 * @property {string} [subject] - Conversation subject
 * @property {boolean} isActive - Active status
 * @property {string} createdAt - Creation date (ISO)
 * @property {string} updatedAt - Last update date (ISO)
 * @property {Message} [lastMessage] - Last message
 * @property {number} unreadCount - Unread message count
 * @property {User} [otherParticipant] - Other participant for DMs
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Unique identifier
 * @property {User} sender - Message sender
 * @property {string} content - Message content
 * @property {boolean} isRead - Read status
 * @property {string} [readAt] - Read timestamp (ISO)
 * @property {boolean} isSystemMessage - System message flag
 * @property {string} createdAt - Creation date (ISO)
 * @property {Attachment[]} attachments - Message attachments
 * @property {boolean} [isFromCurrentUser] - From current user flag
 */

/**
 * @typedef {Object} Attachment
 * @property {string} id - Unique identifier
 * @property {string} file - File path
 * @property {string} fileUrl - File URL
 * @property {string} filename - File name
 * @property {string} contentType - MIME type
 * @property {number} size - File size in bytes
 * @property {string} createdAt - Creation date (ISO)
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique identifier
 * @property {string} notificationType - Notification type
 * @property {string} notificationTypeDisplay - Display name for type
 * @property {string} title - Notification title
 * @property {string} message - Notification message
 * @property {string} plainMessage - Plain text message
 * @property {string} [link] - Related link
 * @property {string} [relatedObjectType] - Related object type
 * @property {number} [relatedObjectId] - Related object ID
 * @property {boolean} isRead - Read status
 * @property {string} [readAt] - Read timestamp (ISO)
 * @property {string} createdAt - Creation date (ISO)
 * @property {string} timeAgo - Human-readable time ago
 */

/**
 * @typedef {Object} AnalyticsData
 * @property {number} totalViews - Total view count
 * @property {number} uniqueViews - Unique views
 * @property {Array<{date: string, count: number}>} viewsByDate - Views by date
 * @property {Array<{company: Company, count: number}>} topViewers - Top viewers
 * @property {number} conversionRate - Conversion rate
 * @property {number} applicationCount - Application count
 */