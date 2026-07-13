// JSDoc type definitions for the enterprise frontend client
/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} phoneNumber
 * @property {string} displayName
 * @property {string} [avatarUrl]
 * @property {string} [about]
 * @property {string} lastSeen
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} senderId
 * @property {string} receiverId
 * @property {string} text
 * @property {string} time
 * @property {string} [type] - 'text' | 'image' | 'video' | 'file'
 * @property {string} [status] - 'sent' | 'delivered' | 'read'
 */

export {};
